import Account from "../../core/account";
import Chain from "../../core/chain";
import Token from "../../core/token";
import OperationFactory from "../../factory/operationFactory";
import createMessage from "../../utils/other/createMessage";
import logger from "../../utils/other/logger";
import randomChoice from "../../utils/random/randomChoice";
import randomInteger from "../../utils/random/randomInteger";
import randomShuffle from "../../utils/random/randomShuffle";

import TasksRunnerConfig from "./config";
import initializeFactory from "./initializeFactory";
import Task, { TaskStatus } from "./task";

class TaskCreator {
  private readonly config: TasksRunnerConfig;
  private readonly chain: Chain;
  private readonly native: Token;
  private readonly factory: OperationFactory;
  private tasks: Task[];

  public constructor(params: { chain: Chain; config: TasksRunnerConfig }) {
    const { chain, config } = params;

    this.config = config;
    this.chain = chain;
    this.native = chain.getNative();

    const { providers, workingAmountPercent, approveMultiplier } =
      this.config.fixed;

    this.factory = initializeFactory({
      chain: this.chain,
      activeProviders: providers,
      minWorkAmountPercent: workingAmountPercent.min,
      maxWorkAmountPercent: workingAmountPercent.max,
      minApproveMultiplier: approveMultiplier.min,
      maxApproveMultiplier: approveMultiplier.max,
    });

    this.tasks = [];
  }

  public getTasks(): readonly Task[] {
    return this.tasks;
  }

  private async initializeTask(account: Account) {
    const { minEthBalance, transactionsLimit } = this.config.fixed;

    const minimumTransactionsLimit = randomInteger(
      transactionsLimit.min,
      transactionsLimit.max,
    ).toNumber();

    const { isAllowed, readableBalance } = await account.isBalanceGteReadable({
      token: this.native,
      minReadableAmount: minEthBalance,
    });

    if (isAllowed) return new Task({ account, minimumTransactionsLimit });

    logger.error(
      createMessage(
        account,
        `insufficient balance ${readableBalance} < ${minEthBalance}`,
        `deposit to create tasks`,
      ),
    );

    return new Task({
      account,
      minimumTransactionsLimit,
      status: "INSUFFICIENT_BALANCE",
    });
  }

  public async initializeTasks(accounts: Account[]) {
    for (const account of accounts) {
      const task = await this.initializeTask(account);
      this.tasks.push(task);
    }
  }

  private getTasksByStatuses(...statuses: TaskStatus[]) {
    return this.tasks.filter((t) => statuses.includes(t.status));
  }

  public isEmpty() {
    return this.tasks.every((t) =>
      ["DONE", "INSUFFICIENT_BALANCE", "FEE_LIMIT"].includes(t.status),
    );
  }

  public async onTaskOperationEnd(task: Task, isFailed: boolean) {
    if (isFailed) task.clear();

    const { minEthBalance, onCurrentTaskEnd, maxAccountFeeUsd } =
      this.config.fixed;

    const { account } = task;

    const { isAllowed, readableBalance } = await account.isBalanceGteReadable({
      token: this.native,
      minReadableAmount: minEthBalance,
    });

    if (!isAllowed) {
      logger.error(
        createMessage(
          account,
          `insufficient balance ${readableBalance} < ${minEthBalance}`,
          `deposit to create tasks`,
        ),
      );

      task.changeStatus("INSUFFICIENT_BALANCE");
      this.moveTaskToEnd(task);
      return;
    }

    if (!task.isEmpty()) return;

    if (task.isMinimumTransactionsLimitReached()) {
      task.changeStatus("DONE");
      task.clear();
      const { txsDone, totalFeeStr } = task;

      logger.info(
        createMessage(account, `done`, `txs:${txsDone}`, `fee:${totalFeeStr}`),
      );
      return;
    }

    if (task.isFeeGte(maxAccountFeeUsd)) {
      task.changeStatus("FEE_LIMIT");

      const { txsDone, totalFeeStr } = task;

      logger.info(
        createMessage(
          account,
          `fee limit`,
          `txs:${txsDone}`,
          `fee:${totalFeeStr}`,
        ),
      );
      return;
    }

    switch (onCurrentTaskEnd) {
      case "CREATE_NEXT_TASK": {
        await this.addOperationsAndSetInProgress(task);
        break;
      }
      case "WAIT_OTHERS": {
        task.changeStatus("WAITING");
        this.moveTaskToEnd(task);

        logger.info(createMessage(account, `current task done, waiting`));
        break;
      }
      case "MOVE_RANDOMLY": {
        task.changeStatus("TODO");
        this.moveTaskRandomly(task);

        logger.info(createMessage(account, `moved randomly`));
      }
    }
  }

  private removeTask(task: Task) {
    const index = this.tasks.findIndex((t) => t.isEquals(task));

    if (index === -1) {
      throw new Error(`unexpected error. task ${task} is not defined`);
    }

    this.tasks.splice(index, 1);
  }

  private moveTaskToEnd(task: Task) {
    this.removeTask(task);
    this.tasks.push(task);
  }

  private moveTaskRandomly(task: Task) {
    const randomIndex = randomInteger(0, this.tasks.length - 1).toNumber();

    this.removeTask(task);

    this.tasks.splice(randomIndex, 0, task);
  }

  public getFactoryInfoStr() {
    return this.factory.info().join("\n");
  }

  private async addOperationsAndSetInProgress(task: Task) {
    const { account } = task;

    task.clear();

    const operation = await this.factory.getRandomOperations({ account });

    task.pushMany(...operation);

    logger.info(
      createMessage(account, `new steps created: ${task.operationsString()}`),
    );

    task.changeStatus("IN_PROGRESS");
  }

  private async pickNextToDoTask() {
    const { minEthBalance } = this.config.fixed;

    const workableTasks = this.getTasksByStatuses(
      "INSUFFICIENT_BALANCE",
      "TODO",
    );

    for (const task of workableTasks) {
      const { account } = task;

      if (task.status === "TODO") return task;

      if (task.status !== "INSUFFICIENT_BALANCE") {
        throw new Error(
          `unexpected error. task status is not allowed here: ${task.status}`,
        );
      }

      const { isAllowed, readableBalance } = await account.isBalanceGteReadable(
        {
          token: this.native,
          minReadableAmount: minEthBalance,
        },
      );

      if (isAllowed) return task;

      logger.error(
        createMessage(
          account,
          `insufficient balance ${readableBalance} < ${minEthBalance}`,
          `deposit to create tasks`,
        ),
      );
    }

    const iterationDoneTasks = this.getTasksByStatuses("WAITING");

    if (!iterationDoneTasks.length) return null;

    for (const iterationDoneTask of iterationDoneTasks) {
      iterationDoneTask.changeStatus("TODO");
    }

    this.tasks = randomShuffle(this.tasks);

    logger.info("iteration end");

    const firstTodoTask = this.tasks.find((t) => t.status === "TODO");

    if (!firstTodoTask) {
      throw new Error(`todo task is not found`);
    }

    return firstTodoTask;
  }

  public async getNextInProgressTask(): Promise<Task | null> {
    if (this.isEmpty()) return null;

    const { maxParallelAccounts } = this.config.dynamic();

    const inProgressTasks = this.getTasksByStatuses("IN_PROGRESS");

    if (inProgressTasks.length >= maxParallelAccounts) {
      return randomChoice(inProgressTasks);
    }

    const task = await this.pickNextToDoTask();

    if (task) {
      await this.addOperationsAndSetInProgress(task);
      return task;
    }

    if (inProgressTasks.length) return randomChoice(inProgressTasks);

    return null;
  }
}

export default TaskCreator;
