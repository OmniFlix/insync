import React, { Component } from "react";
import './index.css';
import { connect } from "react-redux";
import { CircularProgress, Box, Typography } from '@material-ui/core';

class ShieldedSyncPercentageText extends Component {
    render() {
        const percentage = this.props.progress > 0 ? this.props.progress * 100 : 0;

        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                className="shielded_sync_percentage_text"
            >
                <Box position="relative" display="inline-flex">
                    {/* Track */}
                    <CircularProgress
                        className="circular_progress_track"
                        variant="determinate"
                        value={100}
                        size={110}
                        thickness={5}
                        style={{ color: "#FFFFFF36" }}
                    />
                    {/* Progress fill */}
                    <CircularProgress
                        className="circular_progress_bar"
                        variant="determinate"
                        value={percentage}
                        size={110}
                        thickness={5}
                        style={{
                            color: "#FFFF46",
                            position: "absolute",
                            left: 0,
                        }}
                    />
                    {/* Center text */}
                    <Box
                        top={0}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Typography variant="caption" component="div" className="circular-percentage-text">
                            {`${Math.round(percentage)}%`}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        );
    }
}

const stateToProps = (state) => ({
    address: state.accounts.address.value,
    progress: state.accounts.shieldedBalance.progress,
});

export default connect(stateToProps)(ShieldedSyncPercentageText);
