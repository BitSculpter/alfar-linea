/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
type IsTransactionSent = Readonly<boolean>;
type TransactionFunction = () => IsTransactionSent | Promise<IsTransactionSent>;

class Transaction {
  private name: string;
  private fn: TransactionFunction;

  constructor(params: { name: string; fn: TransactionFunction }) {
    const { name, fn } = params;

    this.name = name;
    this.fn = fn;
  }

  async run() {
    const result = this.fn();

    if (result instanceof Promise) {
      return await result;
    } else {
      return result;
    }
  }

  toString() {
    return this.name;
  }
}

export default Transaction;
