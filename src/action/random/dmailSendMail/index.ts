import { Transaction } from "web3";

import { CONTRACT_DMAIL } from "../../../abi/constants/contracts";
import getWeb3Contract from "../../../abi/methods/getWeb3Contract";
import Account from "../../../core/account";
import Chain from "../../../core/chain";
import Step from "../../../core/step";
import RunnableTransaction from "../../../core/transaction";
import RandomAction from "../base";

import generateEmail from "./generateEmail";

class DmailSendMailAction extends RandomAction {
  private readonly contractAddress: string;

  public constructor(params: { chain: Chain }) {
    const { chain } = params;

    super({ chain, provider: "DMAIL", operation: "SEND_MAIL" });

    this.contractAddress = this.getContractAddress({
      contractName: CONTRACT_DMAIL,
    });
  }

  private async sendMail(params: { account: Account }) {
    const { account } = params;
    const { w3 } = this.chain;

    const dmailContract = getWeb3Contract({
      w3,
      name: CONTRACT_DMAIL,
      address: this.contractAddress,
    });

    const emailAddress = generateEmail();

    const sendFunctionCall = dmailContract.methods.send_mail(
      emailAddress,
      emailAddress,
    );

    const estimatedGas = await sendFunctionCall.estimateGas({
      from: account.address,
    });

    const nonce = await account.nonce(w3);

    const gasPrice = await w3.eth.getGasPrice();

    const tx: Transaction = {
      data: sendFunctionCall.encodeABI(),
      from: account.address,
      gas: estimatedGas,
      gasPrice,
      nonce,
      to: this.contractAddress,
      value: 0,
    };

    return { tx, resultMsg: "email sent" };
  }

  private getCreateSendMailTransaction(params: { account: Account }) {
    const { account } = params;

    const createSendMailTransaction = async () => {
      return await this.sendMail({ account });
    };

    return createSendMailTransaction;
  }

  public steps(params: { account: Account }) {
    const { account } = params;

    const step = new Step({ name: this.name });

    const createTransaction = this.getCreateSendMailTransaction({ account });

    const sendMailTransaction = new RunnableTransaction({
      name: this.getTxName("SEND"),
      chain: this.chain,
      account: account,
      createTransaction,
    });

    step.push(sendMailTransaction);

    return [step];
  }
}

export default DmailSendMailAction;
