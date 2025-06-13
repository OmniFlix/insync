export const config = {
    RPC_URL: 'https://rpc.campfire.tududes.com',
    REST_URL: 'https://indexer.campfire.tududes.com',
    MASP_REST_URL: 'https://masp.campfire.tududes.com',
    EXPLORER_URL: 'https://explorer75.org/namada',
    STAKING_URL: 'https://namada.omniflix.co/stake',
    NETWORK_NAME: 'Namada',
    NETWORK_TYPE: 'testnet',
    CHAIN_ID: 'campfire-square.ff09671d333707',
    TOKEN_ADDRESS: 'tnam1qy440ynh9fwrx8aewjvvmu38zxqgukgc259fzp6h',
    COIN_DENOM: 'NAM',
    COIN_DECIMALS: 6,
};

export const osmosisChainConfig = {
    RPC_URL: 'https://rpc-osmosis.streamswap.io',
    REST_URL: 'https://lcd-osmosis.streamswap.io',
    CHAIN_ID: 'osmosis-1',
    CHAIN_NAME: 'Osmosis',
    NETWORK: 'mainnet',
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
};

export const DEFAULT_PAGE = 1;
