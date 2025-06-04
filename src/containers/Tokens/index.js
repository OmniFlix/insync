import CircularProgress from '../../components/CircularProgress';
import NavBar from '../NavBar';
import TokensListTable from './TokensListTable';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AssetTabs from './Tabs';
import ShieldedTokensListTable from './ShieldedTokensListTable';
import TransparentDepositDialog from './TransparentDepositDialog';
import TransparentWithdrawDialog from './TransparentWithdrawDialog';
import TransparentTransferDialog from './TransparentTransferDialog';
import TransparentConvertDialog from './TransparentConvertDialog';
import ShieldedDepositDialog from './ShieldedDepositDialog';
import ShieldedWithdrawDialog from './ShieldedWithdrawDialog';
import ShieldedTransferDialog from './ShieldedTransferDialog';
import ShieldedConvertDialog from './ShieldedConvertDialog';
import SuccessDialog from 'containers/Stake/DelegateDialog/SuccessDialog';
import ShieldedSyncPercentageText from '../ShieldedSyncPercentage/ShieldedSyncPercentageText';
import SyncCompleteIcon from '../../assets/sync_complete_tick.png';
import Button from '@material-ui/core/Button';
import { reSyncBalance } from '../../actions/accounts';
import { config } from 'config';
import variables from 'utils/variables';
import TokensSuccessDialog from 'containers/Tokens/SuccessDialog';


const Tokens = (props) => {
    const handleReSync = () => {
        props.reSyncBalance(props.shieldedData?.viewingKey, props.shieldedData?.timestamp, props.address, props.shieldedData?.address, config.CHAIN_ID);
    };

    return (
        <>
            <NavBar/>
            <AssetTabs/>
            {props.assetsTab === 'transparent' && <div className="assets stake padding">
                {(props.tokensProgress || props.balanceProgress) && props.balanceList && !props.balanceList.length
                    ? <CircularProgress />
                    : <TokensListTable />}
            </div>}
            {props.address && props.assetsTab === 'shielded' && <div className="sync_progress_div">
                <div>
                    {props.shieldedBalanceProgress
                        ? (
                            <div className="sync_container">
                                <div className="left_div">
                                    <p>{variables[props.lang].shielded_sync_progress}</p>
                                    <p>{variables[props.lang].hang_tight_text}</p>
                                </div>
                                <div className="right_div">
                                    <ShieldedSyncPercentageText/>
                                </div>
                            </div>
                        )
                        : (
                            <div className="sync_container">
                                <div className="success_left_div">
                                    <img alt="syncComplete" src={SyncCompleteIcon}/>
                                    <span>
                                        <p>{variables[props.lang].shielded_sync_success}</p>
                                        <p>{variables[props.lang].shielded_balance_uptodate}</p>
                                    </span>
                                </div>
                                <div className="right_div">
                                    <Button onClick={handleReSync}>{variables[props.lang].sync_again}</Button>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>}
            {props.assetsTab === 'shielded' && <div className="assets stake padding">
                <ShieldedTokensListTable inProgress={props.tokensProgress || props.shieldedBalanceProgress}/>
            </div>}
            <TransparentDepositDialog />
            <TransparentWithdrawDialog />
            <TransparentTransferDialog />
            <TransparentConvertDialog />
            <ShieldedDepositDialog />
            <ShieldedWithdrawDialog />
            <ShieldedTransferDialog />
            <ShieldedConvertDialog />
            <SuccessDialog/>
            <TokensSuccessDialog />
        </>
    );
};

Tokens.propTypes = {
    assetsTab: PropTypes.string.isRequired,
    balanceProgress: PropTypes.bool.isRequired,
    balanceList: PropTypes.array.isRequired,
    lang: PropTypes.string.isRequired,
    shieldedBalanceProgress: PropTypes.bool.isRequired,
    shieldedBalance: PropTypes.array.isRequired,
    tokensProgress: PropTypes.bool.isRequired,
    address: PropTypes.string,
    reSyncBalance: PropTypes.func,
    shieldedData: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        address: state.accounts.address.value,
        lang: state.language,
        tokensProgress: state.accounts.tokensList.inProgress,
        balanceProgress: state.accounts.balanceList.inProgress,
        balanceList: state.accounts.balanceList.result,
        shieldedBalanceProgress: state.accounts.shieldedBalance.inProgress,
        shieldedBalance: state.accounts.shieldedBalance.result,
        assetsTab: state.assets.assetsTab.value,
        shieldedData: state.accounts.address.shieldedData,
    };
};

const actionToProps = {
    reSyncBalance,
};

export default connect(stateToProps, actionToProps)(Tokens);
