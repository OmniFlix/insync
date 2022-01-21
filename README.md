inSync by OmniFlix (for Communities)
===

inSync is a collaborative interface for an entire community (or) blockchain network to:

- identify stakeholders such as validator node hosts (will expand to other types of node hosts depending on the network)
- discover proposals & more!

Currently, the aim of inSync is to be the default/defacto interface when bootstrapping community activities of a
specific chain (on testnet or mainnet).

# Requirements

yarn

# Instructions

1. clone repository and install packages

  ```sh
  git clone https://github.dev/OmniFlix/insync.git
  cd insync
  yarn
  ```

2. update chain config

`NOTE:` below is the chain config for omniflix testnet

`src/config.js`

 ```js
export const config = {
    RPC_URL: 'https://rpc.flixnet.omniflix.network',
    REST_URL: 'https://rest.flixnet.omniflix.network',
    EXPLORER_URL: 'https://explorer.omniflix.network',
    STAKING_URL: 'https://flix.omniflix.co/stake',
    NETWORK_NAME: 'OmniFlix',
    NETWORK_TYPE: 'testnet',
    CHAIN_ID: 'flixnet-3',
    CHAIN_NAME: 'OmniFlix FlixNet-3',
    COIN_DENOM: 'FLIX',
    COIN_MINIMAL_DENOM: 'uflix',
    COIN_DECIMALS: 6,
    PREFIX: 'omniflix',
    COIN_TYPE: 118,
    COINGECKO_ID: '-',
    GAS_PRICE_STEP_LOW: 0.0025,
    GAS_PRICE_STEP_AVERAGE: 0.025,
    GAS_PRICE_STEP_HIGH: 0.04,
    FEATURES: ['stargate', 'ibc-transfer', 'no-legacy-stdTx', 'ibc-go'],
};
 ```

3. start app

 ```sh
 yarn start
 ```
