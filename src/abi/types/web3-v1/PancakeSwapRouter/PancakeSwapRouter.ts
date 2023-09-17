/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import type BN from "bn.js";
import type { ContractOptions } from "web3-eth-contract";
import type { EventLog } from "web3-core";
import type { EventEmitter } from "events";
import type {
  Callback,
  PayableTransactionObject,
  NonPayableTransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract,
} from "./types";

export interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export interface PancakeSwapRouter extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): PancakeSwapRouter;
  clone(): PancakeSwapRouter;
  methods: {
    exactInputSingle(
      params: [
        string,
        string,
        number | string | BN,
        string,
        number | string | BN,
        number | string | BN,
        number | string | BN
      ]
    ): PayableTransactionObject<string>;

    multicall(
      deadline: number | string | BN,
      data: (string | number[])[]
    ): PayableTransactionObject<string[]>;

    unwrapWETH9(
      amountMinimum: number | string | BN,
      recipient: string
    ): NonPayableTransactionObject<void>;
  };
  events: {
    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };
}