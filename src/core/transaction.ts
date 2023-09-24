import Big from "big.js";
import Web3, { Transaction } from "web3";

import logger from "../utils/other/logger";

import Account from "./account";
import Chain from "./chain";

const MAX_RETRY_TIMES = 20;
const DEFAULT_GAS_MULTIPLIER = 1.1;
const DEFAULT_RETRY_TIMES = 0;

export type CreateTransactionResult = {
  tx: Transaction | null;
  resultMsg: string;
  gasMultiplier?: number;
  retryTimes?: number;
};

export type CreateTransactionFunc = () => Promise<CreateTransactionResult>;

class RunnableTransaction {
  public readonly name: string;
  public readonly account: Account;

  private readonly chain: Chain;
  private readonly createTransaction: CreateTransactionFunc;

  public constructor(params: {
    name: string;
    chain: Chain;
    account: Account;
    createTransaction: CreateTransactionFunc;
  }) {
    const { name, chain, account, createTransaction } = params;

    this.name = name;
    this.chain = chain;
    this.account = account;
    this.createTransaction = createTransaction;
  }

  private increaseGas(tx: Transaction, gasMultiplier: number) {
    if (tx.gas) {
      tx.gas = Big(tx.gas.toString()).times(gasMultiplier).round().toString();
    }

    return tx;
  }

  private async calcTxPriceUsd(tx: Transaction) {
    const gas = String(tx.gas || 0);
    const gasPrice = String(tx.gasPrice || 0);

    const priceEthWei = Big(gas).times(gasPrice).toString();

    const priceEth = Web3.utils.fromWei(priceEthWei, "ether");

    const usdPrice = await this.chain.getNative().readableAmountToUsd(priceEth);

    return usdPrice;
  }

  private async transactionRunner(params: {
    tx: Transaction;
    retryTimes: number;
    gasMultiplier: number;
    maxTxPriceUsd?: number;
  }): Promise<{ hash: string; gasPriceUsd: string }> {
    const { tx, retryTimes, gasMultiplier, maxTxPriceUsd } = params;

    const gasPriceUsd = await this.calcTxPriceUsd(tx);

    if (maxTxPriceUsd) {
      if (Big(gasPriceUsd).gt(maxTxPriceUsd)) {
        throw new Error(
          `Tx price is greater than max value: ${gasPriceUsd} > ${maxTxPriceUsd}`,
        );
      }
    }

    try {
      const hash = await this.account.signAndSendTransaction(this.chain, tx);

      return { hash, gasPriceUsd };
    } catch (error) {
      if (retryTimes <= 0) throw error;

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const isTxReverted = (error as Error)?.message?.includes("reverted");
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const isNullableError = (error as Error)?.message?.includes(
        "Cannot use 'in' operator to search for 'originalError' in null",
      );

      if (!isTxReverted && !isNullableError) throw error;

      const nextTx = this.increaseGas(tx, gasMultiplier);

      logger.debug(
        `Retrying to resend tx: ${retryTimes} times | ${tx.gas} gas`,
      );

      return this.transactionRunner({
        tx: nextTx,
        retryTimes: retryTimes - 1,
        gasMultiplier,
        maxTxPriceUsd,
      });
    }
  }

  public async run(params: { maxTxPriceUsd?: number }) {
    const { maxTxPriceUsd } = params;

    const data = await this.createTransaction();

    const {
      tx,
      resultMsg,
      retryTimes = DEFAULT_RETRY_TIMES,
      gasMultiplier = DEFAULT_GAS_MULTIPLIER,
    } = data;

    if (!tx) return null;

    if (retryTimes && retryTimes >= MAX_RETRY_TIMES) {
      throw new Error(
        `unexpected error. times > maxSendTransactionTimes. ${retryTimes} >= ${MAX_RETRY_TIMES}`,
      );
    }

    const { hash, gasPriceUsd } = await this.transactionRunner({
      tx,
      maxTxPriceUsd,
      retryTimes,
      gasMultiplier,
    });

    return { hash, resultMsg, gasPriceUsd };
  }

  public toString() {
    return this.name;
  }
}

export default RunnableTransaction;
