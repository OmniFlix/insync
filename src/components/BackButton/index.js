import React from 'react';
import backIcon from '../../assets/back.png';
import { IconButton } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import './index.css';
import { withRouter } from 'react-router-dom';

const BackButton = (props) => {
    const onClick = () => {
        if (props.onClick) {
            props.onClick();

            return;
        }

        props.history.goBack();
    };

    return (
        <IconButton
            className="back_button"
            onClick={onClick}>
            <img alt="back" src={backIcon}/>
        </IconButton>
    );
};

BackButton.propTypes = {
    history: PropTypes.shape({
        goBack: PropTypes.func.isRequired,
    }).isRequired,
    onClick: PropTypes.func,
};

export default withRouter(BackButton);
