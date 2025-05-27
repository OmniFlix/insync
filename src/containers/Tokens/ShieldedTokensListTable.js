import React from 'react';
import DataTable from '../../components/DataTable';
import './index.css';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from '../../components/CircularProgress';
import { namadaAssets } from 'dummy/ibcList';
import { Button } from '@material-ui/core';
// import NamadaShieldedLogo from '../../assets/masp/namada_shielded.svg';

class ShieldedTokensListTable extends React.Component {
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
                           <Button>
                            Deposit
                            </Button>
                            <Button>
                            Withdraw
                            </Button>
                            <Button>
                            Transfer
                            </Button>
                            <Button>
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

export default connect(stateToProps)(ShieldedTokensListTable);
