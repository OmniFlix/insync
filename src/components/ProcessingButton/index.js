import React from 'react';
import { Box } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import './index.css';

const ProcessingButton = ({ children }) => {
  return (
    <p
      className='processing_button'
      sx={{
        position: 'relative',
        display: 'inline-block',
        borderRadius: '24px',
        padding: '3px', // Space for the animated border
        background: 'conic-gradient(#FFF 0% 25%, transparent 25% 50%, #FFF 50% 75%, transparent 75% 100%)',
        animation: 'spin 3s linear infinite',
        backgroundSize: '400% 400%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        overflow: 'visible',
        width: '100%',
      }}
    >
           {/* Button passed as children */}
      <Box className='button_div'>
        {children}
      </Box>

      {/* Keyframes */}
      <style>
        {`
          @keyframes spin {
            100% { background-position: 0% 0%; }
            0% { background-position: 100% 100%; }
          }
        `}
      </style>
    </p>
  );
};

ProcessingButton.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProcessingButton;