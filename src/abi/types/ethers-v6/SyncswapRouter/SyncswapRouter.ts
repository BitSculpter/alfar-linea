/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "./common";

export declare namespace SyncSwapRouter {
  export type TokenInputStruct = { token: AddressLike; amount: BigNumberish };

  export type TokenInputStructOutput = [token: string, amount: bigint] & {
    token: string;
    amount: bigint;
  };
}

export declare namespace IRouter {
  export type SplitPermitParamsStruct = {
    token: AddressLike;
    approveAmount: BigNumberish;
    deadline: BigNumberish;
    v: BigNumberish;
    r: BytesLike;
    s: BytesLike;
  };

  export type SplitPermitParamsStructOutput = [
    token: string,
    approveAmount: bigint,
    deadline: bigint,
    v: bigint,
    r: string,
    s: string
  ] & {
    token: string;
    approveAmount: bigint;
    deadline: bigint;
    v: bigint;
    r: string;
    s: string;
  };

  export type ArrayPermitParamsStruct = {
    approveAmount: BigNumberish;
    deadline: BigNumberish;
    signature: BytesLike;
  };

  export type ArrayPermitParamsStructOutput = [
    approveAmount: bigint,
    deadline: bigint,
    signature: string
  ] & { approveAmount: bigint; deadline: bigint; signature: string };

  export type SwapStepStruct = {
    pool: AddressLike;
    data: BytesLike;
    callback: AddressLike;
    callbackData: BytesLike;
  };

  export type SwapStepStructOutput = [
    pool: string,
    data: string,
    callback: string,
    callbackData: string
  ] & { pool: string; data: string; callback: string; callbackData: string };

  export type SwapPathStruct = {
    steps: IRouter.SwapStepStruct[];
    tokenIn: AddressLike;
    amountIn: BigNumberish;
  };

  export type SwapPathStructOutput = [
    steps: IRouter.SwapStepStructOutput[],
    tokenIn: string,
    amountIn: bigint
  ] & {
    steps: IRouter.SwapStepStructOutput[];
    tokenIn: string;
    amountIn: bigint;
  };
}

export declare namespace IPool {
  export type TokenAmountStruct = { token: AddressLike; amount: BigNumberish };

  export type TokenAmountStructOutput = [token: string, amount: bigint] & {
    token: string;
    amount: bigint;
  };
}

export interface SyncswapRouterInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "addLiquidity"
      | "addLiquidity2"
      | "addLiquidityWithPermit"
      | "addLiquidityWithPermit2"
      | "burnLiquidity"
      | "burnLiquiditySingle"
      | "burnLiquiditySingleWithPermit"
      | "burnLiquidityWithPermit"
      | "createPool"
      | "enteredPools"
      | "enteredPoolsLength"
      | "isPoolEntered"
      | "multicall"
      | "selfPermit"
      | "selfPermit2"
      | "selfPermit2IfNecessary"
      | "selfPermitAllowed"
      | "selfPermitAllowedIfNecessary"
      | "selfPermitIfNecessary"
      | "stake"
      | "swap"
      | "swapWithPermit"
      | "vault"
      | "wETH"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addLiquidity",
    values: [
      AddressLike,
      SyncSwapRouter.TokenInputStruct[],
      BytesLike,
      BigNumberish,
      AddressLike,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "addLiquidity2",
    values: [
      AddressLike,
      SyncSwapRouter.TokenInputStruct[],
      BytesLike,
      BigNumberish,
      AddressLike,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "addLiquidityWithPermit",
    values: [
      AddressLike,
      SyncSwapRouter.TokenInputStruct[],
      BytesLike,
      BigNumberish,
      AddressLike,
      BytesLike,
      IRouter.SplitPermitParamsStruct[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "addLiquidityWithPermit2",
    values: [
      AddressLike,
      SyncSwapRouter.TokenInputStruct[],
      BytesLike,
      BigNumberish,
      AddressLike,
      BytesLike,
      IRouter.SplitPermitParamsStruct[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "burnLiquidity",
    values: [
      AddressLike,
      BigNumberish,
      BytesLike,
      BigNumberish[],
      AddressLike,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "burnLiquiditySingle",
    values: [
      AddressLike,
      BigNumberish,
      BytesLike,
      BigNumberish,
      AddressLike,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "burnLiquiditySingleWithPermit",
    values: [
      AddressLike,
      BigNumberish,
      BytesLike,
      BigNumberish,
      AddressLike,
      BytesLike,
      IRouter.ArrayPermitParamsStruct
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "burnLiquidityWithPermit",
    values: [
      AddressLike,
      BigNumberish,
      BytesLike,
      BigNumberish[],
      AddressLike,
      BytesLike,
      IRouter.ArrayPermitParamsStruct
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "createPool",
    values: [AddressLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "enteredPools",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "enteredPoolsLength",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isPoolEntered",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "multicall",
    values: [BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "selfPermit",
    values: [
      AddressLike,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BytesLike,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "selfPermit2",
    values: [AddressLike, BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "selfPermit2IfNecessary",
    values: [AddressLike, BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "selfPermitAllowed",
    values: [
      AddressLike,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BytesLike,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "selfPermitAllowedIfNecessary",
    values: [
      AddressLike,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BytesLike,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "selfPermitIfNecessary",
    values: [
      AddressLike,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BytesLike,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "stake",
    values: [AddressLike, AddressLike, BigNumberish, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "swap",
    values: [IRouter.SwapPathStruct[], BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "swapWithPermit",
    values: [
      IRouter.SwapPathStruct[],
      BigNumberish,
      BigNumberish,
      IRouter.SplitPermitParamsStruct
    ]
  ): string;
  encodeFunctionData(functionFragment: "vault", values?: undefined): string;
  encodeFunctionData(functionFragment: "wETH", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "addLiquidity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addLiquidity2",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addLiquidityWithPermit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addLiquidityWithPermit2",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "burnLiquidity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "burnLiquiditySingle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "burnLiquiditySingleWithPermit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "burnLiquidityWithPermit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "createPool", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "enteredPools",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "enteredPoolsLength",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isPoolEntered",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "multicall", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "selfPermit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "selfPermit2",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "selfPermit2IfNecessary",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "selfPermitAllowed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "selfPermitAllowedIfNecessary",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "selfPermitIfNecessary",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "stake", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "swap", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "swapWithPermit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "vault", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "wETH", data: BytesLike): Result;
}

export interface SyncswapRouter extends BaseContract {
  connect(runner?: ContractRunner | null): SyncswapRouter;
  waitForDeployment(): Promise<this>;

  interface: SyncswapRouterInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  addLiquidity: TypedContractMethod<
    [
      pool: AddressLike,
      inputs: SyncSwapRouter.TokenInputStruct[],
      data: BytesLike,
      minLiquidity: BigNumberish,
      callback: AddressLike,
      callbackData: BytesLike
    ],
    [bigint],
    "payable"
  >;

  addLiquidity2: TypedContractMethod<
    [
      pool: AddressLike,
      inputs: SyncSwapRouter.TokenInputStruct[],
      data: BytesLike,
      minLiquidity: BigNumberish,
      callback: AddressLike,
      callbackData: BytesLike
    ],
    [bigint],
    "payable"
  >;

  addLiquidityWithPermit: TypedContractMethod<
    [
      pool: AddressLike,
      inputs: SyncSwapRouter.TokenInputStruct[],
      data: BytesLike,
      minLiquidity: BigNumberish,
      callback: AddressLike,
      callbackData: BytesLike,
      permits: IRouter.SplitPermitParamsStruct[]
    ],
    [bigint],
    "payable"
  >;

  addLiquidityWithPermit2: TypedContractMethod<
    [
      pool: AddressLike,
      inputs: SyncSwapRouter.TokenInputStruct[],
      data: BytesLike,
      minLiquidity: BigNumberish,
      callback: AddressLike,
      callbackData: BytesLike,
      permits: IRouter.SplitPermitParamsStruct[]
    ],
    [bigint],
    "payable"
  >;

  burnLiquidity: TypedContractMethod<
    [
      pool: AddressLike,
      liquidity: BigNumberish,
      data: BytesLike,
      minAmounts: BigNumberish[],
      callback: AddressLike,
      callbackData: BytesLike
    ],
    [IPool.TokenAmountStructOutput[]],
    "nonpayable"
  >;

  burnLiquiditySingle: TypedContractMethod<
    [
      pool: AddressLike,
      liquidity: BigNumberish,
      data: BytesLike,
      minAmount: BigNumberish,
      callback: AddressLike,
      callbackData: BytesLike
    ],
    [IPool.TokenAmountStructOutput],
    "nonpayable"
  >;

  burnLiquiditySingleWithPermit: TypedContractMethod<
    [
      pool: AddressLike,
      liquidity: BigNumberish,
      data: BytesLike,
      minAmount: BigNumberish,
      callback: AddressLike,
      callbackData: BytesLike,
      permit: IRouter.ArrayPermitParamsStruct
    ],
    [IPool.TokenAmountStructOutput],
    "nonpayable"
  >;

  burnLiquidityWithPermit: TypedContractMethod<
    [
      pool: AddressLike,
      liquidity: BigNumberish,
      data: BytesLike,
      minAmounts: BigNumberish[],
      callback: AddressLike,
      callbackData: BytesLike,
      permit: IRouter.ArrayPermitParamsStruct
    ],
    [IPool.TokenAmountStructOutput[]],
    "nonpayable"
  >;

  createPool: TypedContractMethod<
    [_factory: AddressLike, data: BytesLike],
    [string],
    "payable"
  >;

  enteredPools: TypedContractMethod<
    [arg0: AddressLike, arg1: BigNumberish],
    [string],
    "view"
  >;

  enteredPoolsLength: TypedContractMethod<
    [account: AddressLike],
    [bigint],
    "view"
  >;

  isPoolEntered: TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike],
    [boolean],
    "view"
  >;

  multicall: TypedContractMethod<[data: BytesLike[]], [string[]], "payable">;

  selfPermit: TypedContractMethod<
    [
      token: AddressLike,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike
    ],
    [void],
    "payable"
  >;

  selfPermit2: TypedContractMethod<
    [
      token: AddressLike,
      value: BigNumberish,
      deadline: BigNumberish,
      signature: BytesLike
    ],
    [void],
    "payable"
  >;

  selfPermit2IfNecessary: TypedContractMethod<
    [
      token: AddressLike,
      value: BigNumberish,
      deadline: BigNumberish,
      signature: BytesLike
    ],
    [void],
    "payable"
  >;

  selfPermitAllowed: TypedContractMethod<
    [
      token: AddressLike,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike
    ],
    [void],
    "payable"
  >;

  selfPermitAllowedIfNecessary: TypedContractMethod<
    [
      token: AddressLike,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike
    ],
    [void],
    "payable"
  >;

  selfPermitIfNecessary: TypedContractMethod<
    [
      token: AddressLike,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike
    ],
    [void],
    "payable"
  >;

  stake: TypedContractMethod<
    [
      stakingPool: AddressLike,
      token: AddressLike,
      amount: BigNumberish,
      onBehalf: AddressLike
    ],
    [void],
    "nonpayable"
  >;

  swap: TypedContractMethod<
    [
      paths: IRouter.SwapPathStruct[],
      amountOutMin: BigNumberish,
      deadline: BigNumberish
    ],
    [IPool.TokenAmountStructOutput],
    "payable"
  >;

  swapWithPermit: TypedContractMethod<
    [
      paths: IRouter.SwapPathStruct[],
      amountOutMin: BigNumberish,
      deadline: BigNumberish,
      permit: IRouter.SplitPermitParamsStruct
    ],
    [IPool.TokenAmountStructOutput],
    "payable"
  >;

  vault: TypedContractMethod<[], [string], "view">;

  wETH: TypedContractMethod<[], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "addLiquidity"
  ): TypedContractMethod<
    [
      pool: AddressLike,
      inputs: SyncSwapRouter.TokenInputStruct[],
      data: BytesLike,
      minLiquidity: BigNumberish,
      callback: AddressLike,
      callbackData: BytesLike
    ],
    [bigint],
    "payable"
  >;
  getFunction(
    nameOrSignature: "addLiquidity2"
  ): TypedContractMethod<
    [
      pool: AddressLike,
      inputs: SyncSwapRouter.TokenInputStruct[],
      data: BytesLike,
      minLiquidity: BigNumberish,
      callback: AddressLike,
      callbackData: BytesLike
    ],
    [bigint],
    "payable"
  >;
  getFunction(
    nameOrSignature: "addLiquidityWithPermit"
  ): TypedContractMethod<
    [
      pool: AddressLike,
      inputs: SyncSwapRouter.TokenInputStruct[],
      data: BytesLike,
      minLiquidity: BigNumberish,
      callback: AddressLike,
      callbackData: BytesLike,
      permits: IRouter.SplitPermitParamsStruct[]
    ],
    [bigint],
    "payable"
  >;
  getFunction(
    nameOrSignature: "addLiquidityWithPermit2"
  ): TypedContractMethod<
    [
      pool: AddressLike,
      inputs: SyncSwapRouter.TokenInputStruct[],
      data: BytesLike,
      minLiquidity: BigNumberish,
      callback: AddressLike,
      callbackData: BytesLike,
      permits: IRouter.SplitPermitParamsStruct[]
    ],
    [bigint],
    "payable"
  >;
  getFunction(
    nameOrSignature: "burnLiquidity"
  ): TypedContractMethod<
    [
      pool: AddressLike,
      liquidity: BigNumberish,
      data: BytesLike,
      minAmounts: BigNumberish[],
      callback: AddressLike,
      callbackData: BytesLike
    ],
    [IPool.TokenAmountStructOutput[]],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "burnLiquiditySingle"
  ): TypedContractMethod<
    [
      pool: AddressLike,
      liquidity: BigNumberish,
      data: BytesLike,
      minAmount: BigNumberish,
      callback: AddressLike,
      callbackData: BytesLike
    ],
    [IPool.TokenAmountStructOutput],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "burnLiquiditySingleWithPermit"
  ): TypedContractMethod<
    [
      pool: AddressLike,
      liquidity: BigNumberish,
      data: BytesLike,
      minAmount: BigNumberish,
      callback: AddressLike,
      callbackData: BytesLike,
      permit: IRouter.ArrayPermitParamsStruct
    ],
    [IPool.TokenAmountStructOutput],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "burnLiquidityWithPermit"
  ): TypedContractMethod<
    [
      pool: AddressLike,
      liquidity: BigNumberish,
      data: BytesLike,
      minAmounts: BigNumberish[],
      callback: AddressLike,
      callbackData: BytesLike,
      permit: IRouter.ArrayPermitParamsStruct
    ],
    [IPool.TokenAmountStructOutput[]],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "createPool"
  ): TypedContractMethod<
    [_factory: AddressLike, data: BytesLike],
    [string],
    "payable"
  >;
  getFunction(
    nameOrSignature: "enteredPools"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: BigNumberish],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "enteredPoolsLength"
  ): TypedContractMethod<[account: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "isPoolEntered"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "multicall"
  ): TypedContractMethod<[data: BytesLike[]], [string[]], "payable">;
  getFunction(
    nameOrSignature: "selfPermit"
  ): TypedContractMethod<
    [
      token: AddressLike,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike
    ],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "selfPermit2"
  ): TypedContractMethod<
    [
      token: AddressLike,
      value: BigNumberish,
      deadline: BigNumberish,
      signature: BytesLike
    ],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "selfPermit2IfNecessary"
  ): TypedContractMethod<
    [
      token: AddressLike,
      value: BigNumberish,
      deadline: BigNumberish,
      signature: BytesLike
    ],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "selfPermitAllowed"
  ): TypedContractMethod<
    [
      token: AddressLike,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike
    ],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "selfPermitAllowedIfNecessary"
  ): TypedContractMethod<
    [
      token: AddressLike,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike
    ],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "selfPermitIfNecessary"
  ): TypedContractMethod<
    [
      token: AddressLike,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike
    ],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "stake"
  ): TypedContractMethod<
    [
      stakingPool: AddressLike,
      token: AddressLike,
      amount: BigNumberish,
      onBehalf: AddressLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "swap"
  ): TypedContractMethod<
    [
      paths: IRouter.SwapPathStruct[],
      amountOutMin: BigNumberish,
      deadline: BigNumberish
    ],
    [IPool.TokenAmountStructOutput],
    "payable"
  >;
  getFunction(
    nameOrSignature: "swapWithPermit"
  ): TypedContractMethod<
    [
      paths: IRouter.SwapPathStruct[],
      amountOutMin: BigNumberish,
      deadline: BigNumberish,
      permit: IRouter.SplitPermitParamsStruct
    ],
    [IPool.TokenAmountStructOutput],
    "payable"
  >;
  getFunction(
    nameOrSignature: "vault"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "wETH"
  ): TypedContractMethod<[], [string], "view">;

  filters: {};
}
