import React from 'react';
import DataTable from '../../components/DataTable';
import './index.css';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from '../../components/CircularProgress';
import { namadaAssets } from 'dummy/ibcList';
import { Button } from '@material-ui/core';
// import NamadaShieldedLogo from '../../assets/masp/namada_shielded.svg';
import TransferIcon from '../../assets/transactions/transfer.svg';
import DepositIcon from '../../assets/transactions/deposit.svg';
import WithdrawIcon from '../../assets/transactions/withdraw.svg';
import ConvertIcon from '../../assets/transactions/convert.svg';
import { showShieldedTokensConvertDialog, showShieldedTokensDepositDialog, showShieldedTokensTransferDialog, showShieldedTokensWithdrawDialog } from 'actions/assets';
import { setIBCTransferType } from 'actions/IBCTransfer';

class ShieldedTokensListTable extends React.Component {
    constructor (props) {
        super(props);

        this.handleWithdraw = this.handleWithdraw.bind(this);
        this.handleTransfer = this.handleTransfer.bind(this);
        this.handleConvert = this.handleConvert.bind(this);
        this.handleDeposit = this.handleDeposit.bind(this);
        // this.initKeplr = this.initKeplr.bind(this);
    }

    handleDeposit (value) {
        this.props.setIBCTransferType('transparent');
        // this.initKeplr(value);
        this.props.showShieldedTokensDepositDialog(value);
    }

    handleWithdraw (value) {
        this.props.setIBCTransferType('transparent');
        // this.initKeplr(value);
        this.props.showShieldedTokensWithdrawDialog(value);
    }

    handleTransfer (value) {
        this.props.setIBCTransferType('transparent');
        // this.initKeplr(value);
        this.props.showShieldedTokensTransferDialog(value);
    }

    handleConvert (value) {
        this.props.setIBCTransferType('transparent');
        // this.initKeplr(value);
        this.props.showShieldedTokensConvertDialog(value);
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
                            <Button onClick={() => this.handleTransfer(value)}>
                                <img src={TransferIcon} alt="Transfer"/>
                                Transfer
                            </Button>
                            <Button onClick={() => this.handleConvert(value)}>
                                <img src={ConvertIcon} alt="Convert"/>
                                Convert
                            </Button>
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
                balance: matchingBalance && matchingBalance.length && matchingBalance[1] || null,
                };
        }).filter((item) => item.balance);
        // enrichedAssets.unshift({
        //     name: 'Shielded Namada',
        //     symbol: 'NAM',
        //     logo_URIs: {
        //         svg: NamadaShieldedLogo,
        //     },
        //     balance: {
        //         minDenomAmount: available
        //     }
        // });

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

ShieldedTokensListTable.propTypes = {
    balanceList: PropTypes.array.isRequired,
    lang: PropTypes.string.isRequired,
    setIBCTransferType: PropTypes.func.isRequired,
    showShieldedTokensTransferDialog: PropTypes.func.isRequired,
    showShieldedTokensDepositDialog: PropTypes.func.isRequired, 
    showShieldedTokensWithdrawDialog: PropTypes.func.isRequired,
    showShieldedTokensConvertDialog: PropTypes.func.isRequired,
    tokensList: PropTypes.array.isRequired,
    address: PropTypes.string,
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
};


export default connect(stateToProps, actionToProps)(ShieldedTokensListTable);
