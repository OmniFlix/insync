import React from 'react';
import { Box } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import './index.css';

const ProcessingButton = ({ children }) => {
    return (
        <p className="processing_button">
            <Box className="button_div">
                {children}
            </Box>
        </p>
    );
};

ProcessingButton.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProcessingButton;
