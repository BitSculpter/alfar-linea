import {
  CONTRACT_PANCAKE_FACTORY,
  CONTRACT_PANCAKE_SWAP_ROUTER,
  CONTRACT_PANCAKE_QUOTE,
  CONTRACT_SYNC_SWAP_CLASSIC_POOL_FACTORY,
  CONTRACT_SYNC_SWAP_ROUTER,
  CONTRACT_VELOCORE_VAULT,
  CONTRACT_VELOCORE_FACTORY,
  CONTRACT_DMAIL,
  CONTRACT_OPEN_OCEAN_EXCHANGE,
  CONTRACT_XY_FINANCE_ROUTER,
  CONTRACT_WOOFI_ROUTER,
} from "../../constants";

const contracts = {
  [CONTRACT_SYNC_SWAP_ROUTER]: "0x80e38291e06339d10aab483c65695d004dbd5c69",
  [CONTRACT_SYNC_SWAP_CLASSIC_POOL_FACTORY]:
    "0x37BAc764494c8db4e54BDE72f6965beA9fa0AC2d",
  [CONTRACT_PANCAKE_SWAP_ROUTER]: "0x678Aa4bF4E210cf2166753e054d5b7c31cc7fa86",
  [CONTRACT_PANCAKE_FACTORY]: "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
  [CONTRACT_PANCAKE_QUOTE]: "0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997",
  [CONTRACT_VELOCORE_VAULT]: "0x1d0188c4b276a09366d05d6be06af61a73bc7535",
  [CONTRACT_VELOCORE_FACTORY]: "0xBe6c6A389b82306e88d74d1692B67285A9db9A47",
  [CONTRACT_DMAIL]: "0xd1a3abf42f9e66be86cfdea8c5c2c74f041c5e14",
  [CONTRACT_OPEN_OCEAN_EXCHANGE]: "0x6352a56caadC4F1E25CD6c75970Fa768A3304e64",
  [CONTRACT_XY_FINANCE_ROUTER]: "0xc693C8AAD9745588e95995fef4570d6DcEF98000",
  [CONTRACT_WOOFI_ROUTER]: "0x39d361e66798155813b907a70d6c2e3fdafb0877",
};

export default contracts;
