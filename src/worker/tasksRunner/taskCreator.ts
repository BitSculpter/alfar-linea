import Big from "big.js";

import Account from "../../core/account";
import Chain from "../../core/chain";
import TaskFactory from "../../factory/taskFactory";
import createMessage from "../../utils/other/createMessage";
import logger from "../../utils/other/logger";
import prettifyError from "../../utils/other/prettifyError";
import randomInteger from "../../utils/random/randomInteger";

import TasksRunnerConfig from "./config";
import initializeFactory from "./initializeFactory";
import Task from "./task";

class TaskCreator {
  private readonly config: TasksRunnerConfig;
  private tasks: Task[];
  private readonly factory: TaskFactory;
  private readonly chain: Chain;

  public constructor(params: { chain: Chain; config: TasksRunnerConfig }) {
    const { chain, config } = params;

    this.config = config;
    this.chain = chain;

    const { providers, workingAmountPercent } = this.config.fixed;

    this.factory = initializeFactory({
      chain: this.chain,
      activeProviders: providers,
      minWorkAmountPercent: workingAmountPercent.min,
      maxWorkAmountPercent: workingAmountPercent.max,
    });

    this.tasks = [];
  }

  private async checkIsBalanceAllowed(account: Account) {
    const native = this.chain.getNative();
    const { minEthBalance } = this.config.dynamic();

    const minEthNormalizedBalance =
      await native.toNormalizedAmount(minEthBalance);

    const normalizedBalance = await native.normalizedBalanceOf(account.address);

    const isAllowed = Big(normalizedBalance).gte(minEthNormalizedBalance);

    if (!isAllowed) {
      const readableBalance = await native.toReadableAmount(normalizedBalance);
      throw new Error(
        createMessage(
          `insufficient native balance`,
          `${readableBalance} < ${minEthBalance}`,
        ),
      );
    }
  }

  private async initializeTask(account: Account) {
    const { transactionsLimit, isCheckBalanceOnStart } = this.config.fixed;

    if (isCheckBalanceOnStart) {
      await this.checkIsBalanceAllowed(account);
    }

    const minimumTransactionsLimit = randomInteger(
      transactionsLimit.min,
      transactionsLimit.max,
    ).toNumber();

    return new Task({ account, minimumTransactionsLimit });
  }

  public async initializeTasks(accounts: Account[]) {
    for (const account of accounts) {
      try {
        const task = await this.initializeTask(account);
        this.tasks.push(task);
      } catch (error) {
        logger.error(createMessage(account, (error as Error).message));
        logger.debug(prettifyError.render(error as Error));
      }
    }
  }

  public isEmpty() {
    return !this.tasks.length;
  }

  public async updateTask(task: Task) {
    const { isShuffleAccountOnStepsEnd } = this.config.fixed;

    const { account } = task;

    if (task.isMinimumTransactionsLimitReached()) {
      logger.info(
        createMessage(
          account,
          `txs limit reached: ${task.minimumTransactionsLimit}`,
        ),
      );
      this.removeTask(task);
      return false;
    }

    const steps = await this.factory.getRandomSteps({ account });

    task.clear();

    task.pushMany(...steps);

    logger.info(
      createMessage(account, `new steps created: ${task.stepsString()}`),
    );

    const isFirstAccountRun = account.transactionsPerformed() === 0;

    if (isFirstAccountRun) return true;

    if (!isShuffleAccountOnStepsEnd) return true;

    this.moveTaskRandomly(task);

    return false;
  }

  private moveTaskRandomly(task: Task) {
    const { maxParallelAccounts } = this.config.dynamic();

    const index = this.tasks.findIndex((t) => t.isEquals(task));

    if (index === -1) {
      throw new Error(`unexpected error. task ${task} is not defined`);
    }

    const minIndex =
      this.tasks.length > maxParallelAccounts ? maxParallelAccounts : 0;

    const maxIndex = this.tasks.length - 1;

    const randomIndex = randomInteger(minIndex, maxIndex).toNumber();

    const [item] = this.tasks.splice(index, 1);

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!item) {
      throw new Error(`unexpected error. task is not defined`);
    }

    this.tasks.splice(randomIndex, 0, item);
  }

  private async checkIsTaskAllowed(task: Task) {
    const { account } = task;

    try {
      await this.checkIsBalanceAllowed(account);

      if (!task.isEmpty()) return true;

      return await this.updateTask(task);
    } catch (error) {
      logger.error(createMessage(account, (error as Error).message));
      logger.debug(prettifyError.render(error as Error));

      this.removeTask(task);
      return false;
    }
  }

  private removeTask(task: Task) {
    this.tasks = this.tasks.filter((taskItem) => !taskItem.isEquals(task));

    logger.info(
      createMessage(
        `${task.account}`,
        `account was removed from list`,
        `tasks left: ${this.tasks.length}`,
      ),
    );
  }

  public getFactoryInfoStr() {
    return this.factory.info().join("\n");
  }

  private pickRandomTask() {
    const { maxParallelAccounts } = this.config.dynamic();

    const maxIndexBaseOnOne = Math.min(this.tasks.length, maxParallelAccounts);

    const maxIndex = maxIndexBaseOnOne - 1;

    const randomIndex = randomInteger(0, maxIndex).toNumber();

    const task = this.tasks.at(randomIndex);

    if (!task) {
      throw new Error(`unexpected error. task is not defined`);
    }

    return task;
  }

  public async getNextTask() {
    while (!this.isEmpty()) {
      const task = this.pickRandomTask();

      const isAllowed = await this.checkIsTaskAllowed(task);

      if (isAllowed) return task;
    }

    return null;
  }

  public getAllTasksInfoStr() {
    const data = this.tasks.map((task) => task.infoStr()).join("\n");
    return `Current tasks:\n${data}`;
  }
}

export default TaskCreator;
