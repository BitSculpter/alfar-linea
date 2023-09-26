import Queue from "./queue";
import RunnableTransaction from "./transaction";

class Step extends Queue<RunnableTransaction> {
  public readonly name: string;

  public constructor(params: { name: string; txs?: RunnableTransaction[] }) {
    const { name, txs } = params;

    super(txs);

    this.name = name;
  }

  public toString() {
    return this.name;
  }

  public getNextTransaction() {
    return this.shift();
  }
}

export default Step;
