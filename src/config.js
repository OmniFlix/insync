export const config = {
    RPC_URL: 'https://rpc.campfire.tududes.com',
    REST_URL: 'https://indexer.campfire.tududes.com',
    MAPS_REST_URL: 'https://masp.campfire.tududes.com',
    EXPLORER_URL: 'https://testnet.namada.tududes.com/omniflix',
    STAKING_URL: 'https://namada.omniflix.co/stake',
    NETWORK_NAME: 'Namada',
    NETWORK_TYPE: 'testnet',
    CHAIN_ID: 'campfire-square.ff09671d333707',
    TOKEN_ADDRESS: 'tnam1qy440ynh9fwrx8aewjvvmu38zxqgukgc259fzp6h',
    // CHAIN_NAME: 'OmniFlix Hub',
    COIN_DENOM: 'NAM',
    // COIN_MINIMAL_DENOM: 'uflix',
    COIN_DECIMALS: 6,
    // PREFIX: 'omniflix',
    // COIN_TYPE: 118,
    // COSMOSTAION: 'omniflix',
    // COINGECKO_ID: 'omniflix-network',
    // GAS_PRICE_STEP_LOW: 0.001,
    // GAS_PRICE_STEP_AVERAGE: 0.0025,
    // GAS_PRICE_STEP_HIGH: 0.025,
    // FEATURES: ['ibc-transfer', 'ibc-go'],
};

export const osmosisChainConfig = {
    RPC_URL: 'https://osmosis-testnet-rpc.polkachu.com',
    REST_URL: 'https://osmosis-testnet-api.polkachu.com',
    CHAIN_ID: 'osmo-test-5',
    CHAIN_NAME: 'Osmosis Testnet',
    NETWORK: 'testnet',
    COIN_DENOM: 'OSMO',
    COIN_MINIMAL_DENOM: 'uosmo',
    COIN_DECIMALS: 6,
    PREFIX: 'osmo',
    gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.04,
    },
    AVG_GAS_STEP: 0.010,
    CONTRACT_ADDRESS: 'osmo10rukl0l79ysqzxqrzpj825u6qf90v69xnvvr2z02dlk092nq0m8slr3uly',
};

export const DEFAULT_PAGE = 1;
