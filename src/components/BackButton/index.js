import React from 'react';
import backIcon from '../../assets/back.png';
import { IconButton } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import './index.css';
import withRouter from '../WithRouter';

const BackButton = (props) => {
    const onClick = () => {
        if (props.onClick) {
            props.onClick();

            return;
        }

        props.router.navigate(-1);
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
    router: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
    }),
    onClick: PropTypes.func,
};

export default withRouter(BackButton);
