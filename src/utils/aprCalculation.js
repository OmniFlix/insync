const { config } = require('../config');
const axios = require('axios').default;

export const getParams = async (lcdApi) => {
    let response = await lcdApi.get('/cosmos/mint/v1beta1/annual_provisions');

    const annualProvisions = Number(response.data.annual_provisions); // string
    response = await lcdApi.get('/cosmos/mint/v1beta1/params');
    const blocksPerYear = Number(response.data.params.blocks_per_year); // string
    // const denom = response.data.params.mint_denom;

    response = await lcdApi.get('/cosmos/mint/v1beta1/inflation');
    const inflation = Number(response.data.inflation); // string

    response = await lcdApi.get('/cosmos/staking/v1beta1/pool');
    const bondedTokens = Number(response.data.pool.bonded_tokens); // string

    response = await lcdApi.get('/omniflix/alloc/v1beta1/params');
    const stakingRewards = Number(response.data.params.distribution_proportions.staking_rewards);

    // string

    return {
        annualProvisions,
        blocksPerYear,
        inflation,
        bondedTokens,
        stakingRewards,
    };
};

export const calculateNominalAPR = (params) => {
    return (params.annualProvisions * params.stakingRewards) / params.bondedTokens;
};

export const getBlocksPerYearReal = async (lcdApi) => {
    let response = await lcdApi.get('/cosmos/base/tendermint/v1beta1/blocks/latest');
    const block1 = response.data.block.header;
    const blockRange = Number(block1.height) > 10000 ? 10000 : 1;

    response = await lcdApi.get('/cosmos/base/tendermint/v1beta1/blocks/' + (Number(block1.height) - blockRange));
    const block2 = response.data.block.header;

    const yearMilisec = 31536000000;
    const blockMilisec = (new Date(block1.time) - new Date(block2.time)) / blockRange;
    return Math.ceil(yearMilisec / blockMilisec);
};

export const calculateRealAPR = (params, nominalAPR, blocksYearReal) => {
    const blockProvision = params.annualProvisions / params.blocksPerYear;
    const realProvision = blockProvision * blocksYearReal;
    return nominalAPR * (realProvision / params.annualProvisions);
};

export const start = async () => {
    try {
        const apiUrl = config.REST_URL;
        const lcdApi = axios.create({
            baseURL: apiUrl,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                Accept: 'application/json',
            },
            timeout: 10000,
        });

        const params = await getParams(lcdApi);
        const blocksYearReal = await getBlocksPerYearReal(lcdApi);
        const nominalAPR = calculateNominalAPR(params);
        const actualAPR = calculateRealAPR(params, nominalAPR, blocksYearReal);

        console.log(`Nominal APR: ${nominalAPR * 100} %`);
        console.log(`RealTime APR: ${actualAPR * 100} %`);
    } catch (error) {
        console.log(error);
        return process.exit(-1);
    }
};
