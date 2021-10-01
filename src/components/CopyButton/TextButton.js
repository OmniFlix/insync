import { Button, Tooltip } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import React from 'react';
import './index.css';

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
            <Button
                className="copy_button"
                variant="outlined"
                onClick={handleCopy}>
                {props.children}
            </Button>
        </Tooltip>
    );
};

CopyButton.propTypes = {
    children: PropTypes.string.isRequired,
    data: PropTypes.any,
};

export default CopyButton;
