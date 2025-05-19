import React from 'react';
import DataTable from '../../components/DataTable';
import './index.css';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from '../../components/CircularProgress';
import { namadaAssets } from 'dummy/ibcList';
import { config } from '../../config';

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
                    return (
                        <div className="voting_power">
                            {value}
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
                    amount = amount ? (amount / 10 ** config.COIN_DECIMALS) : 0;

                    return (
                        <div className="voting_power">
                            {amount}
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
        name: 'Namada',
        balance: {
            balance: {
                minDenomAmount: available * 10 ** config.COIN_DECIMALS
            }
        }
    });

        const tableData = enrichedAssets && enrichedAssets.length
            ? enrichedAssets.map((item) =>
                [
                    item.name || item.display,
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
    };
};

export default connect(stateToProps)(TokensListTable);
