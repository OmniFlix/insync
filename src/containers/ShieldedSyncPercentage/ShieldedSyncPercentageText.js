import React, { Component } from "react";
import './index.css';
import { getSdk, SdkEvents } from '@namada/sdk/web';
import init from '@namada/sdk/web-init';
import { config } from "config";
import { connect } from "react-redux";
import { CircularProgress, Box, Typography } from '@material-ui/core';

class ShieldedSyncPercentageText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            percentage: 0,
            isVisible: true,
        };
    }

    componentDidMount () {
        if (this.props.address && (this.props.address !== '')) {
            (async () => {
                if (window.namada) {
                    const { cryptoMemory } = await init();
                    const sdk = getSdk(
                        cryptoMemory,
                        config.RPC_URL,
                        config.MASP_REST_URL,
                        '',
                        config.TOKEN_ADDRESS
                    );

                    addEventListener(SdkEvents.ProgressBarIncremented, (e) => {
                        const payload = JSON.parse(e.detail);
                        if (payload?.name === 'namada_sdk::progress_bar::fetched') {
                            const { current, total } = payload;
                            const percentage = total > 0 ? (current / total) * 100 : 0;
                            this.setState({ percentage });
                        }
                    });

                    addEventListener(SdkEvents.ProgressBarFinished, () => {
                        setTimeout(() => {
                            this.setState({ isVisible: false });
                        }, 3000);
                    });
                }
            })();
        }
    }

    componentDidUpdate (pp, ps, ss) {
        if ((pp.address !== this.props.address) && (pp.address === '') && (this.props.address !== '') && !this.state.isVisible) {
            (async () => {
                if (window.namada) {
                    const { cryptoMemory } = await init();
                    const sdk = getSdk(
                        cryptoMemory,
                        config.RPC_URL,
                        config.MASP_REST_URL,
                        '',
                        config.TOKEN_ADDRESS
                    );

                    addEventListener(SdkEvents.ProgressBarStarted, (e) => {
                        // const event = e;
                        // const payload = JSON.parse(event.detail);
                        this.setState({
                            stated: true,
                        });
                        // postMessage({ ...payload, type: SdkEvents.ProgressBarStarted });
                    });

                    addEventListener(SdkEvents.ProgressBarIncremented, (e) => {
                        const payload = JSON.parse(e.detail);
                        if (payload?.name === 'namada_sdk::progress_bar::fetched') {
                            const { current, total } = payload;
                            const percentage = total > 0 ? (current / total) * 100 : 0;
                            this.setState({ percentage });
                        }
                    });

                    addEventListener(SdkEvents.ProgressBarFinished, () => {
                        setTimeout(() => {
                            this.setState({ isVisible: false });
                        }, 3000);
                    });
                }
            })();
        }
    }

    render() {
        const { percentage, isVisible } = this.state;

        return (
            isVisible && (
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
            )
        );
    }
}

const stateToProps = (state) => ({
    address: state.accounts.address.value,
});

export default connect(stateToProps)(ShieldedSyncPercentageText);
