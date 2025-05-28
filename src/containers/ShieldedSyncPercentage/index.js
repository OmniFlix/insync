import React, { Component } from "react";
import './index.css';
import { getSdk, SdkEvents } from '@namada/sdk/web';
import { connect } from "react-redux";
import * as PropTypes from 'prop-types';
import init from '@namada/sdk/web-init';
import { config } from "config";
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

class ShieldedSyncPercentage extends Component {
    constructor (props) {
        super(props);

        this.state = {
            percentage: null,
            stated: false,
            finished: false,
            isVisable: true,
        };

        this.getMessage = this.getMessage.bind(this);
    }

    // componentDidMount () {
    //     (async () => {
    //         console.log('aaaa');
    //         if (window.namada) {
    //             console.log('000000');
    //             // TODO: this can be reduced to one event listener
    //             addEventListener(SdkEvents.ProgressBarStarted, (e) => {
    //                 const event = e;
    //                 const payload = JSON.parse(event.detail);
    //                 console.log('1111111', event, payload, SdkEvents.ProgressBarStarted);
    //                 // postMessage({ ...payload, type: SdkEvents.ProgressBarStarted });
    //             });

    //             addEventListener(SdkEvents.ProgressBarIncremented, (e) => {
    //                 const event = e;
    //                 const payload = JSON.parse(event.detail);
    //                 console.log('2222222', event, payload, SdkEvents.ProgressBarIncremented);
    //                 // postMessage({ ...payload, type: SdkEvents.ProgressBarIncremented });
    //             });

    //             addEventListener(SdkEvents.ProgressBarFinished, (e) => {
    //                 const event = e;
    //                 const payload = JSON.parse(event.detail);
    //                 console.log('33333333', event, payload, SdkEvents.ProgressBarFinished);
    //                 // postMessage({ ...payload, type: SdkEvents.ProgressBarFinished });
    //             });
    //         }
    //     })();
    // }

    componentDidUpdate (pp, ps, ss) {
        if ((pp.address !== this.props.address) && (pp.address === '') && (this.props.address !== '')) {
            (async () => {
                if (window.namada) {
                    const { cryptoMemory } = await init();
                    const sdk = getSdk(
                        cryptoMemory,
                        config.RPC_URL,
                        config.MAPS_REST_URL,
                        '',
                        config.TOKEN_ADDRESS,
                    );
        
                    const { rpc, tx } = sdk;
                    // TODO: this can be reduced to one event listener
                    addEventListener(SdkEvents.ProgressBarStarted, (e) => {
                        // const event = e;
                        // const payload = JSON.parse(event.detail);
                        this.setState({
                            stated: true,
                        });
                        // postMessage({ ...payload, type: SdkEvents.ProgressBarStarted });
                    });

                    addEventListener(SdkEvents.ProgressBarIncremented, (e) => {
                        const event = e;
                        const payload = JSON.parse(event.detail);
                        if (payload?.name === 'namada_sdk::progress_bar::fetched') {
                            const current = payload?.current;
                            const total = payload?.total;
                            const percentage = total > 0 ? (current / total) * 100 : 0;
                            this.setState({
                                percentage: percentage,
                            });
                        }
                        // postMessage({ ...payload, type: SdkEvents.ProgressBarIncremented });
                    });

                    addEventListener(SdkEvents.ProgressBarFinished, (e) => {
                        // const event = e;
                        // const payload = JSON.parse(event.detail);
                        this.setState({
                            finished: true,
                        });
                        setTimeout(() => {
                            this.setState({
                                isVisable: false,
                            });
                        }, 3000);
                        // postMessage({ ...payload, type: SdkEvents.ProgressBarFinished });
                    });
                }
            })();
        }
    }

    getMessage () {
        if (this.state.percentage === 0 || (this.state.percentage > 0 && this.state.percentage < 100)) return `Shielded sync progress: ${this.state.percentage.toFixed(0)}%`;
        if (this.state.finished) return 'Shielded sync completed';
        if (this.state.stated && !this.state.percentage) return 'Shielded sync ready';
        if (this.props.tokensProgress || this.props.shieldedBalanceProgress) return 'Shielded sync converting...';
        return null;
    };

    render () {
        return (
            this.state.isVisable && this.getMessage() && <div className='shielded_sync_percentage'>
                {this.state.finished
                    ? <VerifiedUserIcon/>
                    : null}
                <p>{this.getMessage()}</p>
                {this.state.percentage === 0 || (this.state.percentage > 0 && this.state.percentage < 100)
                    ? <div className="progress-container">
                        <span className='progress-bar' style={{ width: `${this.state.percentage}%`}}/>
                    </div> : null}
            </div>
        )
    }
};

ShieldedSyncPercentage.propTypes = {
    shieldedBalanceProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    tokensProgress: PropTypes.bool.isRequired,
    address: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        address: state.accounts.address.value,
        lang: state.language,
        tokensProgress: state.accounts.tokensList.inProgress,
        shieldedBalanceProgress: state.accounts.shieldedBalance.inProgress,
    };
};

export default connect(stateToProps)(ShieldedSyncPercentage);
