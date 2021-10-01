import { IconButton, Tooltip } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import React from 'react';
import './index.css';
import copy from '../../assets/userDetails/copy.png';

const CopyButton = (props) => {
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleCopy = (e) => {
        navigator && navigator.clipboard && navigator.clipboard.writeText(props.data);

        e.stopPropagation();
        setOpen(true);
        setTimeout(handleClose, 1000);
    };

    return (
        <Tooltip
            arrow
            open={open}
            title="Copied!">
            <IconButton
                className="copy_button"
                variant="contained"
                onClick={handleCopy}>
                <img alt="copy" src={copy}/>
            </IconButton>
        </Tooltip>
    );
};

CopyButton.propTypes = {
    data: PropTypes.string,
};

export default CopyButton;
