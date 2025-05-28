import React from 'react';
import DataTable from '../../components/DataTable';
import './index.css';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from '../../components/CircularProgress';
import { ibcList, namadaAssets } from 'dummy/ibcList';
import { config } from '../../config';
import NamadaLogo from '../../assets/masp/namada_logo.svg';
import { showTransparentTokensConvertDialog, showTransparentTokensDepositDialog, showTransparentTokensTransferDialog, showTransparentTokensWithdrawDialog } from 'actions/assets';
import { connectIBCAccount, connectIBCAccountSuccess, fetchIBCBalance, fetchIBCChannel, setIBCTransferType, setSelectedChain } from 'actions/IBCTransfer';
import TransferIcon from '../../assets/transactions/transfer.svg';
import DepositIcon from '../../assets/transactions/deposit.svg';
import WithdrawIcon from '../../assets/transactions/withdraw.svg';
import ConvertIcon from '../../assets/transactions/convert.svg';
import { Button, withStyles, Tooltip } from '@material-ui/core';
import { setSelectedSource } from 'actions/shieldedAssets';

const CustomTooltip = withStyles({
    tooltip: {
      maxWidth: '650px',
      maxHeight: '180px',
      backgroundColor: '#1E1E1E',
      color: '#ffffff',
      overflow: 'auto',
      scrollbarWidth: 'thin',
      '&::-webkit-scrollbar': {
        width: '4px',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: '#1E1E1E',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#ffffff',
        borderRadius: '1px',
      },
    },
})(Tooltip);

class TokensListTable extends React.Component {
    constructor (props) {
        super(props);

        this.handleWithdraw = this.handleWithdraw.bind(this);
        this.handleTransfer = this.handleTransfer.bind(this);
        this.handleConvert = this.handleConvert.bind(this);
        this.handleDeposit = this.handleDeposit.bind(this);
        this.initKeplr = this.initKeplr.bind(this);
    }

    handleDeposit (value) {
        this.props.setIBCTransferType('transparent');
        this.initKeplr(value);
        this.props.showTransparentTokensDepositDialog(value);
    }

    handleWithdraw (value) {
        this.props.setIBCTransferType('transparent');
        // this.initKeplr(value);
        this.props.showTransparentTokensWithdrawDialog(value);
    }

    handleTransfer (value) {
        this.props.setIBCTransferType('transparent');
        // this.initKeplr(value);
        this.props.showTransparentTokensTransferDialog(value);
    }

    handleConvert (value) {
        this.props.setIBCTransferType('transparent');
        // this.initKeplr(value);
        this.props.showTransparentTokensConvertDialog(value);
        this.props.setSelectedSource(value?.config?.COIN_DENOM);
    }

    initKeplr (value) {
        const config = {
            RPC_URL: value && value.config && value.config.RPC_URL,
            REST_URL: value && value.config && value.config.REST_URL,
            CHAIN_ID: value && value.config && value.config.CHAIN_ID,
            CHAIN_NAME: value && value.config && value.config.CHAIN_NAME,
            COIN_DENOM: value && value.config && value.config.COIN_DENOM,
            COIN_MINIMAL_DENOM: value && value.config && value.config.COIN_MINIMAL_DENOM,
            COIN_DECIMALS: value && value.config && value.config.COIN_DECIMALS,
            PREFIX: value && value.config && value.config.PREFIX,
        };

        // setInProgress(true);
        this.props.connectIBCAccount(config, (address) => {
            // this.props.connectIBCAccountSuccess(address);
            // setInProgress(false);
            this.props.fetchIBCBalance(config.REST_URL, address[0].address);
            this.props.fetchIBCChannel(value.channel_link);
            const find = ibcList.find((item) => item.value === value.coingecko_id);
            this.props.setSelectedChain(find);
        });
    }

    render () {
        const options = {
            serverSide: false,
            print: false,
            fixedHeader: false,
            pagination: false,
            selectableRows: 'none',
            selectToolbarPlacement: 'none',
            // sortOrder: {
            //     name: 'voting_power',
            //     direction: 'desc',
            // },
            textLabels: {
                body: {
                    noMatch: this.props.inProgress
                        ? <CircularProgress/>
                        : <div className="no_data_table"> No Tokens Found! </div>,
                    toolTip: 'Sort',
                },
                viewColumns: {
                    title: 'Show Columns',
                    titleAria: 'Show/Hide Table Columns',
                },
            },
        };

        const columns = [
        {
            name: 'token',
            label: 'Token',
            options: {
                sort: false,
                customBodyRender: (value, index) => {
                    const image = value.logo_URIs && (value.logo_URIs.svg || value.logo_URIs.png);
                    return (
                        <div className="voting_power token_name">
                            {image && <img alt={value.name} src={image} style={{ width: '24px', height: '24px', marginRight: '8px' }} />}
                            {value.symbol || value.name || value.display}
                        </div>
                    );
                },
            },
        },
        {
            name: 'balance',
            label: 'Balance',
            options: {
                sort: false,
                customBodyRender: (value, index) => {
                    let amount = value && value.balance && value.balance.minDenomAmount;
                    if (value && value.config && value.config.COIN_DECIMALS) {
                        amount = amount ? (amount / 10 ** value.config.COIN_DECIMALS) : 0;
                    }
                    if (value && value.name === 'Shielded Namada') {
                        return (
                            <div className="voting_power token_name">
                                <p className="percentage">Coming Soon...</p>
                            </div>
                        )
                    }

                    return (
                        <div className="voting_power token_name">
                            {amount} &nbsp;<p className="percentage" style={{ marginTop: '2px' }}>{value.symbol}</p>
                        </div>
                    );
                },
            },
        },  {
            name: 'actions',
            label: 'Actions',
            options: {
                sort: false,
                customBodyRender: (value, index) => {
                    const token = value.symbol || value.name || value.display;
                    return (
                        <div className="tokens_actions">
                              {token === 'NAM'
                            ? null 
                            : <Button onClick={() => this.handleDeposit(value)}>
                            <img src={DepositIcon} alt="Deposit"/>
                                Deposit
                            </Button>}
                            {token === 'NAM'
                                ? null 
                                : <Button onClick={() => this.handleWithdraw(value)}>
                                <img src={WithdrawIcon} alt="Withdraw"/>
                                    Withdraw
                                </Button>}
                                {token === 'NAM'
                                    ? <CustomTooltip title="Enables in Phase 5">
                                        <span className='disabled_tx_button'>
                                            <Button disabled={true} onClick={() => this.handleTransfer(value)}>
                                                <img src={TransferIcon} alt="Transfer"/>
                                                Transfer
                                            </Button>
                                        </span>
                                    </CustomTooltip>
                                    : <Button onClick={() => this.handleTransfer(value)}>
                                        <img src={TransferIcon} alt="Transfer"/>
                                        Transfer
                                    </Button>}
                                {/* <CustomTooltip title={token === 'NAM' ? 'Enables in Phase 5' : "Coming Soon"}>
                                    <span className='disabled_tx_button'>
                                        <Button disabled={true} onClick={() => this.handleTransfer(value)}>
                                            <img src={TransferIcon} alt="Transfer"/>
                                            Transfer
                                        </Button>
                                    </span>
                                </CustomTooltip> */}
                                {token === 'NAM'
                                    ? <CustomTooltip title="Enables in Phase 5">
                                        <span className='disabled_tx_button'>
                                            <Button disabled={true} onClick={() => this.handleConvert(value)}>
                                                <img src={ConvertIcon} alt="Convert"/>
                                                Shield
                                            </Button>
                                        </span>
                                    </CustomTooltip> 
                                    : <CustomTooltip title="Convert to Shielded">
                                        <Button onClick={() => this.handleConvert(value)}>
                                            <img src={ConvertIcon} alt="Convert"/>
                                            Shield
                                        </Button>
                                    </CustomTooltip>}
                        </div>
                    );
                },
            },
        }];

        let balance = null;
        this.props.balance && this.props.balance.length && this.props.balance.map((val) => {
            if (val && val.length) {
                val.map((value) => {
                    if (value === config.TOKEN_ADDRESS) {
                        balance = val[1];
                    }
                });
            }
        
            return null;
        });
        let available = balance && balance / 10 ** config.COIN_DECIMALS;
        available = available ? available : 0;

        let enrichedAssets = (namadaAssets || []).map((asset) => {
            // Step 1: Safely find matching token
            const matchingToken = (this.props.tokensList || []).find(token =>
            token.trace?.includes(`/${asset.base}`)
            );
        
            // Step 2: Safely find matching balance
            const matchingBalance = matchingToken
            ? (this.props.balanceList || []).find(b => b.tokenAddress === matchingToken.address)
            : null;
            
            return {
                ...asset,
                balance: matchingBalance || null,
                };
        }).filter((item) => item);
        // enrichedAssets.unshift({
        //     name: 'Shielded Namada',
        //     symbol: 'NAM',
        //     logo_URIs: {
        //         svg: NamadaShieldedLogo,
        //     },
        //     // balance: {
        //     //     minDenomAmount: available
        //     // }
        // });
        enrichedAssets.unshift({
            name: 'Transparent Namada',
            symbol: 'NAM',
            logo_URIs: {
                svg: NamadaLogo,
            },
            balance: {
                minDenomAmount: available
            }
        });

        const tableData = enrichedAssets && enrichedAssets.length
            ? enrichedAssets.map((item) =>
                [
                    item,
                    item,
                    item,
                ])
            : [];

        return (
            <div className="table">
                <DataTable
                    columns={columns}
                    data={tableData}
                    name="stake"
                    options={options}/>
            </div>
        );
    }
}

TokensListTable.propTypes = {
    balance: PropTypes.array.isRequired,
    balanceList: PropTypes.array.isRequired,
    lang: PropTypes.string.isRequired,
    showTransparentTokensConvertDialog: PropTypes.func.isRequired,
    showTransparentTokensDepositDialog: PropTypes.func.isRequired,
    showTransparentTokensTransferDialog: PropTypes.func.isRequired,
    showTransparentTokensWithdrawDialog: PropTypes.func.isRequired,
    setIBCTransferType: PropTypes.func.isRequired,
    setSelectedChain: PropTypes.func.isRequired,
    connectIBCAccount: PropTypes.func.isRequired,
    connectIBCAccountSuccess: PropTypes.func.isRequired,
    fetchIBCBalance: PropTypes.func.isRequired,
    fetchIBCChannel: PropTypes.func.isRequired,
    setSelectedSource: PropTypes.func.isRequired,
    tokensList: PropTypes.array.isRequired,
    address: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        address: state.accounts.address.value,
        lang: state.language,

        tokensList: state.accounts.tokensList.result,
        balanceList: state.accounts.balanceList.result,
        balance: state.accounts.balance.result,
    };
};

const actionToProps = {
    showTransparentTokensDepositDialog,
    showTransparentTokensWithdrawDialog,
    showTransparentTokensTransferDialog,
    showTransparentTokensConvertDialog,

    setIBCTransferType,
    setSelectedChain,
    connectIBCAccount,
    connectIBCAccountSuccess,
    fetchIBCBalance,
    fetchIBCChannel,
    setSelectedSource,
};


export default connect(stateToProps, actionToProps)(TokensListTable);
