import React from 'react';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';

const ValidatorName = (props) => {
    const image = props.value && props.value.description && props.value.description.identity &&
        props.validatorImages && props.validatorImages.length &&
        props.validatorImages.filter((value) => value._id === props.value.description.identity.toString());

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
                    ? <div className="image">{props.value.description.moniker[0]}</div>
                    : <div className="image"/>}
            <p className="heading_text1">{props.value.description && props.value.description.moniker}</p>
        </div>
    );
};

ValidatorName.propTypes = {
    validatorImages: PropTypes.array.isRequired,
    value: PropTypes.object.isRequired,
};

const stateToProps = (state) => {
    return {
        validatorImages: state.stake.validators.images,
    };
};

export default connect(stateToProps)(ValidatorName);
