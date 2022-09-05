import React, { Component } from 'react';
import DataTable from '../../components/DataTable';
import './index.css';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from '../../components/CircularProgress';
import UnDelegateButton from '../Home/TokenDetails/UnDelegateButton';
import ReDelegateButton from '../Home/TokenDetails/ReDelegateButton';
import DelegateButton from './DelegateButton';
import { formatCount } from '../../utils/numberFormats';
import ValidatorName from './ValidatorName';
import { config } from '../../config';
import classNames from 'classnames';
import { Button } from '@material-ui/core';
import { showConnectDialog } from '../../actions/navBar';

class Table extends Component {
    render () {
        const options = {
            serverSide: false,
            print: false,
            fixedHeader: false,
            pagination: false,
            selectableRows: 'none',
            selectToolbarPlacement: 'none',
            sortOrder: {
                name: 'validator',
                direction: 'asc',
            },
            textLabels: {
                body: {
                    noMatch: this.props.inProgress
                        ? <CircularProgress/>
                        : !this.props.address
                            ? <Button
                                className="disconnect_button"
                                onClick={() => this.props.showConnectDialog()}>
                                Connect
                            </Button>
                            : <div className="no_data_table"> No data found </div>,
                    toolTip: 'Sort',
                },
                viewColumns: {
                    title: 'Show Columns',
                    titleAria: 'Show/Hide Table Columns',
                },
            },
        };

        const columns = [{
            name: 'validator',
            label: 'Validator',
            options: {
                sort: true,
                customBodyRender: (value, index) => (
                    <ValidatorName
                        index={index && index.rowIndex} name={value}
                        value={index.rowData && index.rowData.length && index.rowData[1]}/>
                ),
            },
        }, {
            name: 'status',
            label: 'Status',
            options: {
                sort: false,
                customBodyRender: (value) => (
                    <div
                        className={classNames('status', value.jailed ? 'red_status' : '')}
                        title={value.status === 1 ? 'unbonded'
                            : value.status === 2 ? 'unbonding'
                                : value.status === 3 ? 'active' : ''}>
                        {value.status === 1 ? 'unbonded'
                            : value.status === 2 ? 'unbonding'
                                : value.status === 3 ? 'active' : ''}
                    </div>
                ),
            },
        }, {
            name: 'voting_power',
            label: 'Voting Power',
            options: {
                sort: true,
                customBodyRender: (value) => (
                    <div className="voting_power">
                        <p>{formatCount(value, true)}</p>
                    </div>
                ),
            },
        },
        {
            name: 'commission',
            label: 'Commission',
            options: {
                sort: true,
                customBodyRender: (value) => (
                    value ? value + '%' : '0%'
                ),
            },
        }, {
            name: 'tokens_staked',
            label: 'Tokens Staked',
            options: {
                sort: false,
                customBodyRender: (item) => {
                    let value = this.props.delegations.find((val) =>
                        (val.delegation && val.delegation.validator_address) === item.operator_address);
                    value = value ? value.balance && value.balance.amount && value.balance.amount / 10 ** config.COIN_DECIMALS : null;

                    return (
                        <div className={value ? 'tokens' : 'no_tokens'}>
                            {value || 'no tokens'}
                        </div>
                    );
                },
            },
        }, {
            name: 'action',
            label: 'Action',
            options: {
                sort: false,
                customBodyRender: (validatorAddress) => (
                    this.props.delegations.find((item) =>
                        (item.delegation && item.delegation.validator_address) === validatorAddress)
                        ? <div className="actions">
                            <ReDelegateButton valAddress={validatorAddress}/>
                            <span/>
                            <UnDelegateButton valAddress={validatorAddress}/>
                            <span/>
                            <DelegateButton valAddress={validatorAddress}/>
                        </div>
                        : <div className="actions">
                            <DelegateButton valAddress={validatorAddress}/>
                        </div>
                ),
            },
        }]
        ;

        const dataToMap = this.props.active === 2
            ? this.props.delegatedValidatorList
            : this.props.active === 3
                ? this.props.inActiveValidators
                : this.props.validatorList;

        const tableData = dataToMap && dataToMap.length
            ? dataToMap.map((item) =>
                [
                    item.description && item.description.moniker,
                    item,
                    parseFloat((Number(item.tokens) / (10 ** config.COIN_DECIMALS)).toFixed(1)),
                    item.commission && item.commission.commission_rates &&
                    item.commission.commission_rates.rate
                        ? parseFloat((Number(item.commission.commission_rates.rate) * 100).toFixed(2)) : null,
                    item,
                    item.operator_address,
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

Table.propTypes = {
    active: PropTypes.number.isRequired,
    inProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    showConnectDialog: PropTypes.func.isRequired,
    address: PropTypes.string,
    delegatedValidatorList: PropTypes.arrayOf(
        PropTypes.shape({
            operator_address: PropTypes.string,
            status: PropTypes.number,
            tokens: PropTypes.string,
            commission: PropTypes.shape({
                commission_rates: PropTypes.shape({
                    rate: PropTypes.string,
                }),
            }),
            delegator_shares: PropTypes.string,
            description: PropTypes.shape({
                moniker: PropTypes.string,
            }),
        }),
    ),
    delegations: PropTypes.arrayOf(
        PropTypes.shape({
            validator_address: PropTypes.string,
            balance: PropTypes.shape({
                amount: PropTypes.any,
                denom: PropTypes.string,
            }),
        }),
    ),
    home: PropTypes.bool,
    inActiveValidators: PropTypes.arrayOf(
        PropTypes.shape({
            operator_address: PropTypes.string,
            status: PropTypes.number,
            tokens: PropTypes.string,
            commission: PropTypes.shape({
                commission_rates: PropTypes.shape({
                    rate: PropTypes.string,
                }),
            }),
            delegator_shares: PropTypes.string,
            description: PropTypes.shape({
                moniker: PropTypes.string,
            }),
        }),
    ),
    validatorList: PropTypes.arrayOf(
        PropTypes.shape({
            operator_address: PropTypes.string,
            status: PropTypes.number,
            tokens: PropTypes.string,
            commission: PropTypes.shape({
                commission_rates: PropTypes.shape({
                    rate: PropTypes.string,
                }),
            }),
            delegator_shares: PropTypes.string,
            description: PropTypes.shape({
                moniker: PropTypes.string,
            }),
        }),
    ),
};

const stateToProps = (state) => {
    return {
        address: state.accounts.address.value,
        lang: state.language,
        validatorList: state.stake.validators.list,
        inProgress: state.stake.validators.inProgress,
        delegations: state.accounts.delegations.result,
        delegatedValidatorList: state.stake.delegatedValidators.list,
        inActiveValidators: state.stake.inActiveValidators.list,
    };
};

const actionToProps = {
    showConnectDialog,
};

export default connect(stateToProps, actionToProps)(Table);
