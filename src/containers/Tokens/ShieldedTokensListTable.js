import React from 'react';
import DataTable from '../../components/DataTable';
import './index.css';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from '../../components/CircularProgress';
import { ibcList, namadaAssets } from 'dummy/ibcList';
import NamadaShieldedLogo from '../../assets/masp/namada_shielded.svg';
import TransferIcon from '../../assets/transactions/transfer.svg';
import DepositIcon from '../../assets/transactions/deposit.svg';
import WithdrawIcon from '../../assets/transactions/withdraw.svg';
import ConvertIcon from '../../assets/transactions/convert.svg';
import { showShieldedTokensConvertDialog, showShieldedTokensDepositDialog, showShieldedTokensTransferDialog, showShieldedTokensWithdrawDialog } from 'actions/assets';
import { connectIBCAccount, connectIBCAccountSuccess, fetchIBCBalance, fetchIBCChannel, setFromShieldedNamadaSelectedAsset, setIBCTransferType, setSelectedChain } from 'actions/IBCTransfer';
import { Button, withStyles, Tooltip } from '@material-ui/core';
import classNames from 'classnames';

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

class ShieldedTokensListTable extends React.Component {
    constructor (props) {
        super(props);

        this.handleWithdraw = this.handleWithdraw.bind(this);
        this.handleTransfer = this.handleTransfer.bind(this);
        this.handleConvert = this.handleConvert.bind(this);
        this.handleDeposit = this.handleDeposit.bind(this);
        this.initKeplr = this.initKeplr.bind(this);
    }

    handleDeposit (value) {
        this.props.setIBCTransferType('shielded');
        this.initKeplr(value);
        this.props.showShieldedTokensDepositDialog(value);
    }

    handleWithdraw (value) {
        this.initKeplr(value);
        this.props.setIBCTransferType('shielded');
        const find = ibcList.find((item) => item.value === value.coingecko_id);
        if (find) {
            this.props.setFromShieldedNamadaSelectedAsset(value?.config?.COIN_DENOM, value);
        } else {
            this.props.setFromShieldedNamadaSelectedAsset(value?.config?.COIN_DENOM);
        }
        this.props.showShieldedTokensWithdrawDialog(value);
    }

    handleTransfer (value) {
        this.props.setIBCTransferType('shielded');
        // this.initKeplr(value);
        this.props.showShieldedTokensTransferDialog(value);
    }

    handleConvert (value) {
        this.props.setIBCTransferType('shielded');
        // this.initKeplr(value);
        const find = ibcList.find((item) => item.value === value.coingecko_id);
        if (find) {
            this.props.setFromShieldedNamadaSelectedAsset(value?.config?.COIN_DENOM, value);
        } else {
            this.props.setFromShieldedNamadaSelectedAsset(value?.config?.COIN_DENOM);
        }
        this.props.showShieldedTokensConvertDialog(value);
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
                    let amount = value && value.balance;
                    if (value && value.config && value.config.COIN_DECIMALS) {
                        amount = amount ? (amount / 10 ** value.config.COIN_DECIMALS) : 0;
                    }
                    // if (value && value.name === 'Shielded Namada') {
                    //     return (
                    //         <div className="voting_power token_name">
                    //             <p className="percentage">Coming Soon...</p>
                    //         </div>
                    //     )
                    // }

                    return (
                        <div className="voting_power token_name">
                            {amount} &nbsp;<p className="percentage" style={{ marginTop: '2px' }}>{value.symbol}</p>
                        </div>
                    );
                },
            },
        }, {
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
                                    ? <CustomTooltip  title="Enables in Phase 5">
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
                                {token === 'NAM'
                                    ? <CustomTooltip  title="Enables in Phase 5">
                                        <span className='disabled_tx_button'>
                                            <Button disabled={true} onClick={() => this.handleConvert(value)}>
                                                <img src={ConvertIcon} alt="Convert"/>
                                                Unshield
                                            </Button>
                                        </span>
                                    </CustomTooltip> 
                                    : <Button onClick={() => this.handleConvert(value)}>
                                        <img src={ConvertIcon} alt="Convert"/>
                                        Unshield
                                    </Button>}
                        </div>
                    );
                },
            },
        }];

        let enrichedAssets = (namadaAssets || []).map((asset) => {
            const matchingToken = (this.props.tokensList || []).find(token =>
            token.trace?.includes(`/${asset.base}`)
            );
        
            const matchingBalance = matchingToken
                ? (this.props.balanceList || []).find(([address]) => address === matchingToken.address)
                : null;
            
            return {
                ...asset,
                balance: (matchingBalance && matchingBalance.length && matchingBalance[1]) || 0,
                tokenAddress: (matchingBalance && matchingBalance.length && matchingBalance[0]) || (matchingToken && matchingToken.address) || null,
            };
        }).filter((item) => item);
        enrichedAssets.unshift({
            name: 'Shielded Namada',
            symbol: 'NAM',
            logo_URIs: {
                svg: NamadaShieldedLogo,
            },
            balance: 0,
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
            <div className={classNames(this.props.inProgress ? "table shielded_table" : 'table')}>
                <DataTable
                    columns={columns}
                    data={tableData}
                    name="stake"
                    options={options}/>
            </div>
        );
    }
}

ShieldedTokensListTable.propTypes = {
    balanceList: PropTypes.array.isRequired,
    lang: PropTypes.string.isRequired,
    setIBCTransferType: PropTypes.func.isRequired,
    showShieldedTokensTransferDialog: PropTypes.func.isRequired,
    showShieldedTokensDepositDialog: PropTypes.func.isRequired, 
    showShieldedTokensWithdrawDialog: PropTypes.func.isRequired,
    showShieldedTokensConvertDialog: PropTypes.func.isRequired,
    setFromShieldedNamadaSelectedAsset: PropTypes.func.isRequired,
    setSelectedChain: PropTypes.func.isRequired,
    connectIBCAccount: PropTypes.func.isRequired,
    connectIBCAccountSuccess: PropTypes.func.isRequired,
    fetchIBCBalance: PropTypes.func.isRequired,
    fetchIBCChannel: PropTypes.func.isRequired,
    tokensList: PropTypes.array.isRequired,
    address: PropTypes.string,
    inProgress: PropTypes.bool,
};

const stateToProps = (state) => {
    return {
        address: state.accounts.address.value,
        lang: state.language,

        tokensList: state.accounts.tokensList.result,
        balanceList: state.accounts.shieldedBalance.result,
    };
};

const actionToProps = {
    showShieldedTokensTransferDialog,
    showShieldedTokensDepositDialog,
    showShieldedTokensWithdrawDialog,
    showShieldedTokensConvertDialog,

    setIBCTransferType,
    setSelectedChain: setSelectedChain,
    connectIBCAccount: connectIBCAccount,
    connectIBCAccountSuccess: connectIBCAccountSuccess,
    fetchIBCBalance: fetchIBCBalance,
    fetchIBCChannel: fetchIBCChannel,
    setFromShieldedNamadaSelectedAsset,
};


export default connect(stateToProps, actionToProps)(ShieldedTokensListTable);
