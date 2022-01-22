import React from 'react';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';

const colors = ['#0023DA', '#C9387E', '#EC2C00', '#80E3F2',
    '#E86FC5', '#1F3278', '#FFE761', '#7041B9'];

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
                    ? <div
                        className="image"
                        style={{ background: colors[props.index % 6] }}>
                        {props.value.description.moniker[0]}
                    </div>
                    : <div className="image" style={{ background: colors[props.index % 6] }}/>}
            <p className="heading_text1">{props.name}</p>
        </div>
    );
};

ValidatorName.propTypes = {
    name: PropTypes.string.isRequired,
    validatorImages: PropTypes.array.isRequired,
    value: PropTypes.object.isRequired,
    index: PropTypes.number,
};

const stateToProps = (state) => {
    return {
        validatorImages: state.stake.validators.images,
    };
};

export default connect(stateToProps)(ValidatorName);
