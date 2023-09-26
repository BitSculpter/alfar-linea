import Big from "big.js";

import Account from "../../../core/account";
import Action, {
  DefaultActionFunctionResult,
  Provider,
} from "../../../core/action";
import Step from "../../../core/step";
import Token from "../../../core/token";
import RunnableTransaction from "../../../core/transaction";
import { Amount } from "../../../types";
import randomInteger from "../../../utils/random/randomInteger";

abstract class SwapAction extends Action {
  public readonly fromToken: Token;
  public readonly toToken: Token;

  public constructor(params: { fromToken: Token; toToken: Token }) {
    const { fromToken, toToken } = params;

    super();

    this.fromToken = fromToken;
    this.toToken = toToken;

    this.checkConstructor();
  }

  // eslint-disable-next-line no-unused-vars
  protected abstract approve(params: {
    account: Account;
    normalizedAmount: Amount;
  }): Promise<DefaultActionFunctionResult>;

  // eslint-disable-next-line no-unused-vars
  protected abstract swap(params: {
    account: Account;
    normalizedAmount: Amount;
  }): Promise<DefaultActionFunctionResult>;

  protected initializeName(params: { provider: Provider }) {
    const { provider } = params;
    this.initializeDefaultName({
      provider,
      actionType: "SWAP",
      operation: `${this.fromToken.name}_${this.toToken.name}`,
    });
  }

  private checkConstructor() {
    const isSameTokens = this.fromToken.isEquals(this.toToken);

    if (isSameTokens) {
      throw new Error(`swap is not available for equal tokens`);
    }

    const isSameChains = this.fromToken.chain.isEquals(this.toToken.chain);

    if (!isSameChains) {
      throw new Error(`swap is not available for tokens in different chains`);
    }
  }

  protected getContractAddress(params: { contractName: string }) {
    const { contractName } = params;

    return SwapAction.getDefaultContractAddress({
      contractName,
      chain: this.fromToken.chain,
    });
  }

  protected async checkIsBalanceAllowed(params: {
    account: Account;
    normalizedAmount: Amount;
  }) {
    const { account, normalizedAmount } = params;

    const normalizedBalance = await this.fromToken.normalizedBalanceOf(
      account.address,
    );

    const isBalanceAllowed = Big(normalizedBalance).gte(normalizedAmount);

    if (isBalanceAllowed) return;

    const readableBalance =
      await this.fromToken.toReadableAmount(normalizedBalance);

    const readableAmount =
      await this.fromToken.toReadableAmount(normalizedAmount);

    throw new Error(
      `balance is less than amount: ${readableBalance} < ${readableAmount}`,
    );
  }

  private getCreateApproveTransaction(params: {
    account: Account;
    minWorkAmountPercent: number;
    maxWorkAmountPercent: number;
    minApproveMultiplier: number;
    maxApproveMultiplier: number;
  }) {
    const {
      account,
      minWorkAmountPercent,
      maxWorkAmountPercent,
      minApproveMultiplier,
      maxApproveMultiplier,
    } = params;

    const createApproveTransaction = async () => {
      const normalizedAmount = await account.getRandomNormalizedAmountOfBalance(
        this.fromToken,
        minWorkAmountPercent,
        maxWorkAmountPercent,
      );

      const minAmount = Big(normalizedAmount).times(minApproveMultiplier);
      const maxAmount = Big(normalizedAmount).times(maxApproveMultiplier);

      const randomNormalizedAmount = randomInteger(
        minAmount,
        maxAmount,
      ).toString();

      return this.approve({
        account,
        normalizedAmount: randomNormalizedAmount,
      });
    };

    return createApproveTransaction;
  }

  private getCreateSwapTransaction(params: {
    account: Account;
    minWorkAmountPercent: number;
    maxWorkAmountPercent: number;
  }) {
    const { account, minWorkAmountPercent, maxWorkAmountPercent } = params;

    const createSwapTransaction = async () => {
      const normalizedAmount = await account.getRandomNormalizedAmountOfBalance(
        this.fromToken,
        minWorkAmountPercent,
        maxWorkAmountPercent,
      );
      return await this.swap({ account, normalizedAmount });
    };

    return createSwapTransaction;
  }

  public swapStep(params: {
    account: Account;
    minWorkAmountPercent: number;
    maxWorkAmountPercent: number;
    minApproveMultiplier: number;
    maxApproveMultiplier: number;
  }) {
    const {
      account,
      minWorkAmountPercent,
      maxWorkAmountPercent,
      minApproveMultiplier,
      maxApproveMultiplier,
    } = params;

    const step = new Step({ name: this.name });

    if (!this.fromToken.isNative) {
      const createTransaction = this.getCreateApproveTransaction({
        account,
        minWorkAmountPercent,
        maxWorkAmountPercent,
        minApproveMultiplier,
        maxApproveMultiplier,
      });

      const approveTransaction = new RunnableTransaction({
        name: this.getTxName("approve"),
        chain: this.fromToken.chain,
        account: account,
        createTransaction,
      });

      step.push(approveTransaction);
    }

    const createTransaction = this.getCreateSwapTransaction({
      account,
      minWorkAmountPercent,
      maxWorkAmountPercent,
    });

    const swapTransaction = new RunnableTransaction({
      name: this.getTxName("swap"),
      chain: this.fromToken.chain,
      account: account,
      createTransaction,
    });

    step.push(swapTransaction);

    return step;
  }

  protected async getDefaultSwapResultMsg(params: {
    normalizedAmount: Amount;
    minOutNormalizedAmount: Amount;
  }) {
    const { normalizedAmount, minOutNormalizedAmount } = params;

    const inReadableAmount =
      await this.fromToken.toReadableAmount(normalizedAmount);

    const outReadableAmount = await this.toToken.toReadableAmount(
      minOutNormalizedAmount,
    );
    return `${inReadableAmount} ${this.fromToken} -> ${outReadableAmount} ${this.toToken} swapped`;
  }
}

export default SwapAction;
