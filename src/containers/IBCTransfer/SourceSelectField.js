import React, { useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectField from '../../components/SelectField/WithChildren';
import { MenuItem } from '@material-ui/core';
import variables from '../../utils/variables';
import NamadaLogo from '../../assets/masp/namada_shielded.svg';
import { setFromNamadaSelectedAsset } from '../../actions/IBCTransfer';
import { namadaAssets } from 'dummy/ibcList';

const SourceSelectField = (props) => {
    const enrichedAssets = (namadaAssets || []).map((asset) => {
        // Step 1: Safely find matching token
        const matchingToken = (props.tokensList || []).find(token =>
          token.trace?.includes(`/${asset.base}`)
        );
      
        // Step 2: Safely find matching balance
        const matchingBalance = matchingToken
          ? (props.balanceList || []).find(b => b.tokenAddress === matchingToken.address)
          : null;
      
        return {
          ...asset,
          balance: matchingBalance || null,
        };
    }).filter((item) => item.balance);

    useEffect(() => {
        if (props.from === 'transparent_withdraw' && props.data && enrichedAssets && enrichedAssets.length) {
            const matchedItem = enrichedAssets.find(item => item.symbol === props.data?.symbol);

            if (matchedItem) {
                const value = matchedItem.symbol;
                props.onChange(value, matchedItem);
                return;
            }
        }
        if (enrichedAssets && enrichedAssets.length && enrichedAssets[0]) {
            const value = enrichedAssets[0].symbol;
            const find = enrichedAssets.find((item) => item.symbol === value);
            if (find) {
                props.onChange(value, find);
            } else {
                props.onChange(value);
            }
        }
    }, [enrichedAssets]);

    const handleChange = (value) => {
        if (props.value === value) {
            return;
        }

        const find = enrichedAssets.find((item) => item.symbol === value);
        if (find) {
            props.onChange(value, find);
        } else {
            props.onChange(value);
        }
    };
    return (
        <SelectField
            className="select_field"
            id="source_select_field"
            name="source"
            placeholder={variables[props.lang]['select_asset']}
            value={props.value}
            onChange={handleChange}>
            {props.ibcOnly
            ? null
            : <MenuItem className="phase5_disable" value="Namada" disabled>
                <img alt="NamadaLogo" src={NamadaLogo}/>
                <div>
                    {variables[props.lang].namada}
                    <p>{variables[props.lang].enable_in_phase_5}</p>
                </div>
            </MenuItem>}
            {enrichedAssets && enrichedAssets.map((asset, index) => {
                // if (asset?.balance?.minDenomAmount === "0") {
                //     return null;
                // }
                const image = asset.logo_URIs && (asset.logo_URIs.svg || asset.logo_URIs.png);
                return (
                    <MenuItem key={index} value={asset.symbol}>
                        {image && <img alt={asset.name} src={image} style={{ width: '24px', height: '24px', marginRight: '8px' }} />}
                        {asset.symbol || asset.display}
                    </MenuItem>
                );
            })}
        </SelectField>
    );
};

SourceSelectField.propTypes = {
    lang: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    tokensList: PropTypes.array.isRequired,
    balanceList: PropTypes.array.isRequired,
    data: PropTypes.object,
    from: PropTypes.string,
    ibcOnly: PropTypes.bool,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        value: state.ibcTransfer.fromNamadaSelectedAsset.value,
        tokensList: state.accounts.tokensList.result,
        balanceList: state.accounts.balanceList.result,
    };
};

const actionToProps = {
    onChange: setFromNamadaSelectedAsset,
};

export default connect(stateToProps, actionToProps)(SourceSelectField);
