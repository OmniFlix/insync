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
import { Button } from '@material-ui/core';
import { showConnectDialog } from '../../actions/navBar';
import { randomNoRepeats } from 'utils/array';
import classNames from 'classnames';

class Table extends Component {
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
                        : !this.props.address
                            ? <Button
                                className="disconnect_button"
                                onClick={() => this.props.showConnectDialog()}>
                                Connect
                            </Button>
                            : <div className="no_data_table"> Stake with a Validator now! </div>,
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
                customBodyRender: (value, index) => (
                    <ValidatorName
                        index={index && index.rowIndex} name={value}
                        value={index.rowData && index.rowData.length && index.rowData[2]}/>
                ),
            },
        },
        // {
        //     name: 'status',
        //     label: 'Status',
        //     options: {
        //         sort: false,
        //         customBodyRender: (value) => (
        //             <div
        //                 className={classNames('status', (value.status === 'inactive' || value.status === 'jailed') ? 'red_status' : '')}
        //                 title={value.status === 'jailed' ? 'jailed'
        //                     // : value.status === 'BOND_STATUS_UNBONDING' ? 'unbonding'
        //                         : value.status === 'consensus' ? 'active'
        //                             : value.status === 'inactive' ? 'invalid'
        //                                 : ''}>
        //                 {value.status === 'jailed' ? 'jailed'
        //                     // : value.status === 'BOND_STATUS_UNBONDING' ? 'unbonding'
        //                         : value.status === 'consensus' ? 'active'
        //                             : value.status === 'inactive' ? 'invalid'
        //                                 : ''}
        //             </div>
        //         ),
        //     },
        // },
        {
            name: 'voting_power',
            label: 'Voting Power',
            options: {
                sort: true,
                customBodyRender: (value, index) => (
                    <div className="voting_power">
                        <p>{formatCount(value, true)}</p>
                        {index.rowData && index.rowData.length && index.rowData[2] && index.rowData[2].votingPower
                            ? <p className="percentage">{formatCount(parseFloat((Number(index.rowData[2].votingPower) / this.props.totalVotingPower) * 100), 2)}%</p>
                            : '-'}
                    </div>
                ),
            },
        },
        //         {
        //     name: 'apr',
        //     label: 'APR %',
        //     options: {
        //         sort: true,
        //         customBodyRender: (value) => {
        //             let apr = Number(this.props.actualAPR) * Number(value);
        //             apr = Number(this.props.actualAPR) - apr;
        //             return apr ? apr.toFixed(2) + ' %' : '--';
        //         },
        //     },
        // },
        // {
        //     name: 'commission',
        //     label: 'Commission',
        //     options: {
        //         sort: true,
        //         customBodyRender: (value) => (
        //             value ? value + '%' : '0%'
        //         ),
        //     },
        // },
        {
            name: 'tokens_staked',
            label: 'Tokens Staked',
            options: {
                sort: false,
                customBodyRender: (item) => {
                    let address = null;
                    let newValue = null;
                    this.props.delegatedValidatorList && this.props.delegatedValidatorList.length &&
                    this.props.delegatedValidatorList.map((value) => {
                        if (value && value.validator && value.validator.address && item &&
                            (item.address === value.validator.address)) {
                            address = value.validator.address;
                            if (newValue) {
                                newValue = (value.minDenomAmount && value.minDenomAmount / 10 ** config.COIN_DECIMALS) + newValue;
                            } else {
                                newValue = value.minDenomAmount && value.minDenomAmount / 10 ** config.COIN_DECIMALS;
                            }
                        }
                    });
                    // address && this.props.delegations && this.props.delegations.length &&
                    // this.props.delegations.map((val) => {
                    //     if (val && val.length && val[1] && (address === val[1])) {
                    //         value = val[2];
                    //     }
                    // });

                    return (
                        <div className={newValue ? 'tokens' : 'no_tokens'}>
                            {Number(newValue) || 'no tokens'}
                        </div>
                    );
                },
            },
        }, {
            name: 'action',
            label: 'Action',
            options: {
                sort: false,
                customBodyRender: (value) => {
                    return (
                        this.props.delegations.find((item) =>
                            value && (item && item.length && item[1]) === value.address)
                            ? <div className="actions">
                                <ReDelegateButton valAddress={value && value.address}/>
                                <span/>
                                <UnDelegateButton valAddress={value && value.address}/>
                                <span/>
                                <DelegateButton valAddress={value && value.address}/>
                            </div>
                            : value && value.address
                                ? <div className="actions">
                                    <DelegateButton valAddress={value && value.address}/>
                                </div> : null
                    );
                },
            },
        }];

        let dataToMap = this.props.active === 2
            ? this.props.delegatedValidatorList
            : this.props.active === 3
                ? this.props.inActiveValidators
                : this.props.validatorList;

        if (this.props.active === 2) {
            dataToMap = [];
            this.props.validatorList && this.props.validatorList.length && this.props.validatorList.map((val) => {
                if (val && val.address) {
                    // let address = null;
                    // if (this.props.genesisValidatorList && this.props.genesisValidatorList[val.address]) {
                    //     address = this.props.genesisValidatorList[val.address];
                    // }
                    let valid = true;
                    this.props.delegatedValidatorList && this.props.delegatedValidatorList.length &&
                    this.props.delegatedValidatorList.map((value) => {
                        if (value && value.validator && value.validator.address &&
                            (val.address === value.validator.address) && valid) {
                            valid = false;
                            dataToMap.push(val);
                        }
                    });
                }
            });
        }

        let newData = [];
        if (dataToMap && dataToMap.length) {
            dataToMap.map((val) => {
                if (val && val.name && val.name.toLowerCase() === 'cosmic validator') {
                    newData.splice(0, 0, val);
                } else if (val && val.name && val.name.toLowerCase() === 'mandragora') {
                    const find = newData.find((val1) => val1 && val1.name && val1.name.toLowerCase() === 'cosmic validator');
                    if (!find) {
                        newData.splice(0, 0, val);
                    } else {
                        newData.splice(1, 0, val);
                    }
                } else {
                    newData.push(val);
                }
            });
        } else {
            newData = dataToMap;
        }

        const tableData = newData && newData.length
            ? newData.map((item) =>
                [
                    // item.description && item.description.moniker,
                    item.name,
                    // item,
                    // parseFloat((Number(item.tokens) / (10 ** config.COIN_DECIMALS)).toFixed(1)),
                    parseFloat((Number(item.votingPower)).toFixed(1)),
                    // item.commission
                    //     ? parseFloat((Number(item.commission) * 100).toFixed(2)) : null,
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

Table.propTypes = {
    active: PropTypes.number.isRequired,
    genesisValidatorList: PropTypes.object.isRequired,
    inProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    showConnectDialog: PropTypes.func.isRequired,
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
};

const stateToProps = (state) => {
    return {
        actualAPR: state.stake.apr.actualAPR,
        address: state.accounts.address.value,
        lang: state.language,
        validatorList: state.stake.validators.list,
        totalVotingPower: state.stake.validators.totalVotingPower,
        genesisValidatorList: state.stake.genesisValidators.list,
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
