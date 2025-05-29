export const ibcList = [{
    name: 'Osmosis',
    value: 'osmosis',
    chain_name: 'osmosis',
    config: {
        RPC_URL: 'https://osmosis-rpc.polkachu.com',
        REST_URL: 'https://osmosis-api.polkachu.com',
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
        EXPLORER_URL: 'https://www.mintscan.io/osmosis',
    },
    channel_link: 'https://raw.githubusercontent.com/anoma/namada-chain-registry/refs/heads/main/_IBC/namada-osmosis.json',
    image_URL: 'https://ipfs.omniflix.studio/ipfs/QmXY8o1DkYXABWFvhTfVRcnnviRT6ZgWsmPEkiKLWmstws',
    assets: [
        {
            base: 'uosmo',
            name: 'Osmosis',
            display: 'osmo',
            symbol: 'OSMO',
            logo_URIs: {
                png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.png',
                svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.svg',
            },
            coingecko_id: 'osmosis',
        },
    ],
}, {
    name: 'Celestia',
    value: 'celestia',
    chain_name: 'celestia',
    config: {
        RPC_URL: 'https://public-celestia-rpc.numia.xyz',
        REST_URL: 'https://public-celestia-lcd.numia.xyz',
        CHAIN_ID: 'celestia',
        CHAIN_NAME: 'celestia',
        NETWORK: 'mainnet',
        COIN_DENOM: 'TIA',
        COIN_MINIMAL_DENOM: 'utia',
        COIN_DECIMALS: 6,
        PREFIX: 'celestia',
        gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.04,
        },
        AVG_GAS_STEP: 0.010,
        EXPLORER_URL: 'https://www.mintscan.io/celestia',
    },
    channel_link: 'https://raw.githubusercontent.com/anoma/namada-chain-registry/refs/heads/main/_IBC/namada-celestia.json',
    image_URL: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/celestia/images/celestia.png',
    assets: [
        {
            base: 'utia',
            name: 'Celestia',
            display: 'tia',
            symbol: 'TIA',
            logo_URIs: {
                png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/celestia/images/celestia.png",
                svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/celestia/images/celestia.svg"
            },
            coingecko_id: 'celestia',
        },
    ],
}, {
    name: 'Cosmos Hub',
    value: 'cosmos',
    chain_name: 'cosmoshub',
    config: {
        RPC_URL: 'https://cosmos-rpc.polkachu.com',
        REST_URL: 'https://cosmos-api.polkachu.com',
        CHAIN_ID: 'cosmoshub-4',
        CHAIN_NAME: 'Cosmos Hub',
        NETWORK: 'mainnet',
        COIN_DENOM: 'ATOM',
        COIN_MINIMAL_DENOM: 'uatom',
        COIN_DECIMALS: 6,
        PREFIX: 'cosmos',
        gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.04,
        },
        AVG_GAS_STEP: 0.010,
        EXPLORER_URL: 'https://www.mintscan.io/cosmos',
    },
    channel_link: 'https://raw.githubusercontent.com/anoma/namada-chain-registry/refs/heads/main/_IBC/namada-cosmoshub.json',
    image_URL: 'https://ipfs.omniflix.studio/ipfs/QmQdHBE8x8H6cQ85CUgUaGEKToCgG6EhomnEV9VAeyBJhg',
    assets: [
        {
            base: 'uatom',
            name: 'Cosmos Hub Atom',
            display: 'atom',
            symbol: 'ATOM',
            logo_URIs: {
                png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png',
                svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.svg',
            },
            coingecko_id: 'cosmos',
        },
    ],
}, {
    name: 'Neutron',
    value: 'neutron',
    chain_name: 'neutron',
    config: {
        RPC_URL: 'https://neutron-rpc.publicnode.com:443',
        REST_URL: 'https://neutron-rest.publicnode.com',
        CHAIN_ID: 'neutron-1',
        CHAIN_NAME: 'neutron',
        NETWORK: 'mainnet',
        COIN_DENOM: 'NTRN',
        COIN_MINIMAL_DENOM: 'untrn',
        COIN_DECIMALS: 6,
        PREFIX: 'neutron',
        gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.04,
        },
        AVG_GAS_STEP: 0.010,
        EXPLORER_URL: 'https://www.mintscan.io/neutron',
    },
    channel_link: 'https://raw.githubusercontent.com/anoma/namada-chain-registry/refs/heads/main/_IBC/namada-neutron.json',
    image_URL: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/ntrn.png',
    assets: [
        {
            base: 'untrn',
            name: 'neutron',
            display: 'ntrn',
            symbol: 'NTRN',
            logo_URIs: {
                png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/ntrn.png",
                svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/ntrn.svg"
            },
            coingecko_id: 'neutron',
        },
    ],
}, {
    name: 'Stride',
    value: 'stride',
    chain_name: 'stride',
    config: {
        RPC_URL: 'https://stride-rpc.polkachu.com',
        REST_URL: 'https://stride-api.polkachu.com',
        CHAIN_ID: 'stride-1',
        CHAIN_NAME: 'stride',
        NETWORK: 'mainnet',
        COIN_DENOM: 'stATOM',
        COIN_MINIMAL_DENOM: 'stuatom',
        COIN_DECIMALS: 6,
        PREFIX: 'stride',
        gasPriceStep: {
            low: 0.005,
            average: 0.005,
            high: 0.05,
        },
        AVG_GAS_STEP: 0.0005,
        EXPLORER_URL: 'https://explorer.bccnodes.com/stride-M',
    },
    channel_link: 'https://raw.githubusercontent.com/anoma/namada-chain-registry/refs/heads/main/_IBC/namada-stride.json',
    image_URL: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/strd.png',
    assets: [
        {
            base: 'stuatom',
            name: 'stride',
            display: 'statom',
            symbol: 'stATOM',
            logo_URIs: {
                png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/strd.png",
                svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/strd.svg"
            },
            coingecko_id: 'stride',
        },
    ],
// }, {
//     name: 'Noble',
//     value: 'noble',
//     chain_name: 'noble',
//     config: {
//         RPC_URL: 'https://noble-rpc.polkachu.com',
//         REST_URL: 'https://noble-api.polkachu.com',
//         CHAIN_ID: 'noble-1',
//         CHAIN_NAME: 'noble',
//         NETWORK: 'mainnet',
//         COIN_DENOM: 'USDC',
//         COIN_MINIMAL_DENOM: 'uusdc',
//         COIN_DECIMALS: 6,
//         PREFIX: 'noble',
//         gasPriceStep: {
//             low: 0.005,
//             average: 0.005,
//             high: 0.05,
//         },
//         AVG_GAS_STEP: 0.0005,
//         EXPLORER_URL: 'https://www.mintscan.io/noble',
//     },
//     channel_link: 'https://raw.githubusercontent.com/anoma/namada-chain-registry/refs/heads/main/_IBC/namada-noble.json',
//     image_URL: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/noble/images/stake.png',
//     assets: [
//         {
//             base: 'uusdc',
//             name: 'USDC',
//             display: 'usdc',
//             symbol: 'noble',
//             logo_URIs: {
//                 png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/noble/images/stake.png",
//                 svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/noble/images/stake.svg"
//             },
//             coingecko_id: 'usdc',
//         },
//     ],
// }, {
//     name: 'Nym',
//     value: 'nym',
//     chain_name: 'nym',
//     config: {
//         RPC_URL: 'https://nym-rpc.polkachu.com',
//         REST_URL: 'https://nym-api.polkachu.com',
//         CHAIN_ID: 'nyx',
//         CHAIN_NAME: 'nyx',
//         NETWORK: 'mainnet',
//         COIN_DENOM: 'NYM',
//         COIN_MINIMAL_DENOM: 'unym',
//         COIN_DECIMALS: 6,
//         PREFIX: 'n',
//         gasPriceStep: {
//             low: 0.025,
//             average: 0.025,
//             high: 0.04,
//         },
//         AVG_GAS_STEP: 0.025,
//         EXPLORER_URL: 'https://www.mintscan.io/nyx',
//     },
//     channel_link: 'https://raw.githubusercontent.com/anoma/namada-chain-registry/refs/heads/main/_IBC/namada-nyx.json',
//     image_URL: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/nyx/images/nym_token_light.png',
//     assets: [
//         {
//             base: 'nym',
//             name: 'NYM',
//             display: 'nym',
//             symbol: 'NYM',
//             logo_URIs: {
//                 png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/nyx/images/nym_token_light.png",
//                 svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/nyx/images/nym_token_light.svg"
//             },
//             coingecko_id: 'nym',
//         },
//     ],
}];

export const feeList = {
    OSMO: {
        fee: 0.00001,
        gas: 32032,
        shieldedgas: 152624, // Gas for shielded transfer
    },
    ATOM: {
        fee: 0.000001,
        gas: 32032,
        shieldedgas: 152624,
    },
    TIA: {
        fee: 0.000001,
        gas: 28432,
        shieldedgas: 102624,
    },
    NTRN: {
        fee: 0.00001,
        gas: 32032,
        shieldedgas: 152624,
    },
    stATOM: {
        fee: 0.000001,
        gas: 28432,
        shieldedgas: 102624,
    },
};

export const namadaAssets = ibcList.flatMap((chain) =>
    chain.assets.map((asset) => ({
        ...asset,
        config: chain.config, // Attach the chain's config to each asset
        channel_link: chain.channel_link,
    })),
);
