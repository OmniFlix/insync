import React from 'react';
import { CircularProgress as MaterialCircularProgress } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import ClassNames from 'classnames';
import './index.css';

const CircularProgress = (props) => {
    return (
        <div className={ClassNames('circular_progress', props.className ? props.className : '')}>
            <MaterialCircularProgress/>
        </div>
    );
};

CircularProgress.propTypes = {
    className: PropTypes.string,
};

export default CircularProgress;
