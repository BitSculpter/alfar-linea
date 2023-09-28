import { ethers } from "ethers";
import { Transaction } from "web3";

import {
  CONTRACT_SYNCSWAP_CLASSIC_POOL_FACTORY,
  CONTRACT_SYNCSWAP_ROUTER,
} from "../../../abi/constants/contracts";
import getWeb3Contract from "../../../abi/methods/getWeb3Contract";
import { DEFAULT_SLIPPAGE_PERCENT } from "../../../constants";
import Account from "../../../core/account";
import Token from "../../../core/token";
import { Amount } from "../../../types";
import SwapAction from "../base";

import ActionContext from "../../../core/actionContext";
import { WITHDRAWAL_MODE } from "./constants";

class SyncswapSwapAction extends SwapAction {
  private readonly routerContractAddress: string;
  private readonly factoryContractAddress: string;

  public constructor(params: {
    fromToken: Token;
    toToken: Token;
    context: ActionContext;
  }) {
    const { fromToken, toToken, context } = params;
    super({ fromToken, toToken, provider: "SYNCSWAP", context });

    this.routerContractAddress = this.getContractAddress({
      contractName: CONTRACT_SYNCSWAP_ROUTER,
    });

    this.factoryContractAddress = this.getContractAddress({
      contractName: CONTRACT_SYNCSWAP_CLASSIC_POOL_FACTORY,
    });
  }

  private async getPool(fromToken: Token, toToken: Token): Promise<string> {
    const { chain } = fromToken;

    const classicPoolFactoryContract = getWeb3Contract({
      w3: chain.w3,
      name: CONTRACT_SYNCSWAP_CLASSIC_POOL_FACTORY,
      address: this.factoryContractAddress,
    });

    const poolAddress = await classicPoolFactoryContract.methods
      .getPool(
        fromToken.getAddressOrWrappedForNative(),
        toToken.getAddressOrWrappedForNative(),
      )
      .call();

    if (poolAddress !== ethers.ZeroAddress) return poolAddress;

    const reversedPoolAddress = await this.getPool(toToken, fromToken);

    if (reversedPoolAddress !== ethers.ZeroAddress) return reversedPoolAddress;

    throw new Error(`${fromToken.name} -> ${toToken.name} pool not found`);
  }

  private async getSwapCall(params: {
    account: Account;
    normalizedAmount: Amount;
    minOutNormalizedAmount: Amount;
    poolAddress: string;
  }) {
    const { account, normalizedAmount, minOutNormalizedAmount, poolAddress } =
      params;

    const { chain } = this.fromToken;
    const { w3 } = chain;

    const encoder = new ethers.AbiCoder();

    const swapData = encoder.encode(
      ["address", "address", "uint8"],
      [
        this.fromToken.getAddressOrWrappedForNative(),
        account.address,
        WITHDRAWAL_MODE.WITHDRAW_ETH,
      ],
    );

    const routerContract = getWeb3Contract({
      w3,
      name: CONTRACT_SYNCSWAP_ROUTER,
      address: this.routerContractAddress,
    });

    type SwapPath = Parameters<typeof routerContract.methods.swap>["0"][number];
    type SwapStep = SwapPath["0"][number];

    const step: SwapStep = [poolAddress, swapData, ethers.ZeroAddress, "0x"];

    const tokenIn = this.fromToken.isNative
      ? ethers.ZeroAddress
      : this.fromToken.address;

    const path: SwapPath = [[step], tokenIn, normalizedAmount];

    const deadline = await chain.getSwapDeadline();

    return routerContract.methods.swap(
      [path],
      minOutNormalizedAmount,
      deadline,
    );
  }

  protected async approve(params: {
    account: Account;
    normalizedAmount: Amount;
  }) {
    const { account, normalizedAmount } = params;

    return await SyncswapSwapAction.getDefaultApproveTransaction({
      account,
      token: this.fromToken,
      spenderAddress: this.routerContractAddress,
      normalizedAmount,
    });
  }

  protected async swap(params: { account: Account; normalizedAmount: Amount }) {
    const { account, normalizedAmount } = params;

    const { chain } = this.fromToken;
    const { w3 } = chain;

    await this.checkIsBalanceAllowed({ account, normalizedAmount });

    const poolAddress = await this.getPool(this.fromToken, this.toToken);

    if (!poolAddress) {
      throw new Error(`pool not found`);
    }

    const minOutNormalizedAmount = await this.toToken.getMinOutNormalizedAmount(
      this.fromToken,
      normalizedAmount,
      DEFAULT_SLIPPAGE_PERCENT,
    );

    const swapFunctionCall = await this.getSwapCall({
      account,
      normalizedAmount,
      minOutNormalizedAmount,
      poolAddress,
    });

    const value = this.fromToken.isNative ? normalizedAmount : 0;

    const estimatedGas = await swapFunctionCall.estimateGas({
      from: account.address,
      value,
    });

    const nonce = await account.nonce(w3);

    const gasPrice = await w3.eth.getGasPrice();

    const tx: Transaction = {
      data: swapFunctionCall.encodeABI(),
      from: account.address,
      gas: estimatedGas,
      gasPrice,
      nonce,
      to: this.routerContractAddress,
      value,
    };

    const resultMsg = await this.getDefaultSwapResultMsg({
      normalizedAmount,
      minOutNormalizedAmount,
    });

    return { tx, resultMsg };
  }
}

export default SyncswapSwapAction;
