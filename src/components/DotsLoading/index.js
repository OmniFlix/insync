import React from 'react';
import './index.css';
import classNames from 'classnames';

const DotsLoading = (props) => {
    return (
        <div className={classNames(props.className ? `spinner ${props.className}` : "spinner")}>
            <div className="bounce1"/>
            <div className="bounce2"/>
            <div className="bounce3"/>
        </div>
    );
};

export default DotsLoading;
