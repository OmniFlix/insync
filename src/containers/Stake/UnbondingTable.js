import React, { Component } from 'react';
import DataTable from '../../components/DataTable';
import './index.css';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { floatCountWithoutABBRS } from '../../utils/numberFormats';
import ValidatorName from './ValidatorName';
import { config } from '../../config';
import { Button } from '@material-ui/core';
import { showConnectDialog } from '../../actions/navBar';
import TextSkeleton from '../../components/TextSkeleton';
import CopyButton from 'components/CopyButton';
import variables from 'utils/variables';
import { getPendingTime } from 'utils/date';
import moment from 'moment';
import WithDrawButton from './WithDrawButton';

class UnbondingTable extends Component {
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
                    noMatch: !this.props.address
                        ? <Button
                            className="disconnect_button"
                            onClick={() => this.props.showConnectDialog()}>
                                {variables[this.props.lang].connect}
                        </Button>
                        : <span
                            className="no_data_table" onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}> {variables[this.props.lang].no_data} </span>,
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
                sort: false,
                customBodyRender: (value, index) => {
                    if (value === 'skeleton-loader') {
                        return <TextSkeleton/>;
                    }
                    return (<ValidatorName
                        index={index && index.rowIndex} name={value}
                        value={index.rowData && index.rowData.length && index.rowData[3] && index.rowData[3].validator}/>)
                },
            },
        },
        {
            name: 'address',
            label: 'Address',
            options: {
                sort: true,
                customBodyRender: (value, index) => {
                    return (
                        <div className="hash_text" title={value}>
                            <p className="name">{value}</p>
                            {value && value.slice(value.length - 6, value.length)}
                            <CopyButton data={value}>
                                {variables[this.props.lang].copy}
                            </CopyButton>
                        </div>
                    );
                },
            },
        },
        {
            name: 'amount_unbonding',
            label: 'Amount Unbonding',
            options: {
                sort: true,
                customBodyRender: (value, index) => {
                    return (
                        <div className={value ? 'tokens' : 'no_tokens'}>
                            {floatCountWithoutABBRS(value) || 'no tokens'}
                        </div>
                    );
                },
            },
        },
        {
            name: 'time_left',
            label: 'Time Left',
            options: {
                sort: true,
                customBodyRender: (value, index) => {
                    return (
                        <div className="actions">
                            {moment.unix(value?.withdrawTime).isBefore(moment())
                                ? <WithDrawButton validator={value?.validator?.address}/>
                                : <div className="voting_power">
                                    {getPendingTime(value?.withdrawTime)}
                                </div>}
                        </div>
                    );
                },
            },
        }];

        const tableData = this.props.unBondingValidatorsList && this.props.unBondingValidatorsList.length
            ? this.props.unBondingValidatorsList.map((item) =>
                [
                    item.validator?.name,
                    item.validator?.address,
                    parseFloat((Number(item.minDenomAmount) / (10 ** config.COIN_DECIMALS)).toFixed(1)),
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

UnbondingTable.propTypes = {
    active: PropTypes.number.isRequired,
    genesisValidatorList: PropTypes.object.isRequired,
    inProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    showConnectDialog: PropTypes.func.isRequired,
    unBondingValidatorsList: PropTypes.array.isRequired,
    unBondingValidatorsProgress: PropTypes.bool.isRequired,
    actualAPR: PropTypes.number,
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
    validatorList: PropTypes.array,
    delegatedValidatorListInProgress: PropTypes.bool,
    validatorsListInProgress: PropTypes.bool,
};

const stateToProps = (state) => {
    return {
        actualAPR: state.stake.apr.actualAPR,
        address: state.accounts.address.value,
        lang: state.language,
        validatorList: state.stake.validators.list,
        validatorListInProgress: state.stake.validators.inProgress,
        totalVotingPower: state.stake.validators.totalVotingPower,
        genesisValidatorList: state.stake.genesisValidators.list,
        inProgress: state.stake.validators.inProgress,
        delegations: state.accounts.delegations.result,
        delegatedValidatorList: state.stake.delegatedValidators.list,
        delegatedValidatorListInProgress: state.stake.delegatedValidators.inProgress,
        inActiveValidators: state.stake.inActiveValidators.list,
        unBondingValidatorsList: state.stake.unBondingValidators.list,
          unBondingValidatorsProgress: state.stake.unBondingValidators.inProgress,
    };
};

const actionToProps = {
    showConnectDialog,
};

export default connect(stateToProps, actionToProps)(UnbondingTable);
