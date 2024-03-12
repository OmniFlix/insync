import React from 'react';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';

const colors = ['#0023DA', '#C9387E', '#EC2C00', '#80E3F2',
    '#E86FC5', '#1F3278', '#FFE761', '#7041B9'];

const ValidatorName = (props) => {
    const image = props.value && props.value.description && props.value.description.identity &&
        props.validatorImages && props.validatorImages.length &&
        props.validatorImages.filter((value) => value._id === props.value.description.identity.toString());
    let value = null;
    if (props.genesisValidatorList && props.genesisValidatorList[props.name]) {
        value = props.genesisValidatorList[props.name];
    }

    return (
        <div className="validator">
            {image && image.length && image[0] && image[0].them && image[0].them.length &&
            image[0].them[0] && image[0].them[0].pictures && image[0].them[0].pictures.primary &&
            image[0].them[0].pictures.primary.url
                ? <img
                    alt={props.value.description && props.value.description.moniker}
                    className="image"
                    src={image[0].them[0].pictures.primary.url}/>
                : props.value.description && props.value.description.moniker
                    ? <div
                        className="image"
                        style={{ background: colors[props.index % 6] }}>
                        {props.value.description.moniker[0]}
                    </div>
                    : <div className="image" style={{ background: colors[props.index % 6] }}/>}
            <div className="name_section">
                {value && value.alias
                    ? <p className="heading_text1">{value.alias}</p>
                    : null}
                <div className="hash_text" title={props.name}>
                    <p className="name">{props.name}</p>
                    {props.name &&
                        props.name.slice(props.name.length - 6, props.name.length)}
                </div>
                {value && value.nam_address
                    ? <div className="hash_text" title={value.nam_address}>
                        <p className="name">{value.nam_address}</p>
                        {value.nam_address &&
                        value.nam_address.slice(value.nam_address.length - 6, value.nam_address.length)}
                    </div> : null}
            </div>
        </div>
    );
};

ValidatorName.propTypes = {
    genesisValidatorList: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    validatorImages: PropTypes.array.isRequired,
    value: PropTypes.object.isRequired,
    index: PropTypes.number,
};

const stateToProps = (state) => {
    return {
        validatorImages: state.stake.validators.images,
        genesisValidatorList: state.stake.genesisValidators.list,
    };
};

export default connect(stateToProps)(ValidatorName);
