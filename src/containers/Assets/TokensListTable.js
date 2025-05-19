import React from 'react';
import DataTable from '../../components/DataTable';
import './index.css';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from '../../components/CircularProgress';
import { namadaAssets } from 'dummy/ibcList';
import { config } from '../../config';
import NamadaLogo from '../../assets/masp/namada_logo.svg';
import NamadaShieldedLogo from '../../assets/masp/namada_shielded.svg';

class TokensListTable extends React.Component {
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
                            {(value.symbol === 'NAM' ? value.name : value.symbol) || value.name || value.display}
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
        }).filter((item) => item.balance);
        enrichedAssets.unshift({
            name: 'Shielded Namada',
            symbol: 'NAM',
            logo_URIs: {
                svg: NamadaShieldedLogo,
            },
            // balance: {
            //     minDenomAmount: available
            // }
        });
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

export default connect(stateToProps)(TokensListTable);
