import CircularProgress from '../../components/CircularProgress';
import NavBar from '../NavBar';
import TokensListTable from './TokensListTable';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AssetTabs from './Tabs';
import ShieldedTokensListTable from './ShieldedTokensListTable';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import ClassNames from 'classnames';
import TransparentDepositDialog from './TransparentDepositDialog';
import TransparentWithdrawDialog from './TransparentWithdrawDialog';
import TransparentTransferDialog from './TransparentTransferDialog';
import TransparentConvertDialog from './TransparentConvertDialog';
import ShieldedDepositDialog from './ShieldedDepositDialog';
import ShieldedWithdrawDialog from './ShieldedWithdrawDialog';
import ShieldedTransferDialog from './ShieldedTransferDialog';
import ShieldedConvertDialog from './ShieldedConvertDialog';
import syncProgress from 'assets/syncProgress.gif';
import SuccessDialog from 'containers/Stake/DelegateDialog/SuccessDialog';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

const Tokens = (props) => {
    const classes = useStyles();

    return (
        <>
            <NavBar/>
            <AssetTabs/>
            {props.assetsTab === 'transparent' && <div className="assets stake padding">
                {(props.tokensProgress || props.balanceProgress) && props.balanceList && !props.balanceList.length
                    ? <CircularProgress />
                    : <TokensListTable />}
            </div>}
            {props.assetsTab === 'shielded' && <div className="assets stake padding">
                {(props.tokensProgress || props.shieldedBalanceProgress) && props.shieldedBalance && !props.shieldedBalance.length
                    ? <div className='sync_in_progress'> 
                        <div className='sync_section'>
                            <img src={syncProgress} alt="Syncing..." className="sync-progress" />
                            <h2>Shielded Sync in Progress</h2>
                            <p>Hang tight, this might take a moment</p>
                        </div>
                    </div>
                    // <div className={ClassNames(classes.root, 'leaner_progress')}>
                    //     <LinearProgress />
                    // </div>
                    :  null}
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
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        tokensProgress: state.accounts.tokensList.inProgress,
        balanceProgress: state.accounts.balanceList.inProgress,
        balanceList: state.accounts.balanceList.result,
        shieldedBalanceProgress: state.accounts.shieldedBalance.inProgress,
        shieldedBalance: state.accounts.shieldedBalance.result,
        assetsTab: state.assets.assetsTab.value,
    };
};

export default connect(stateToProps)(Tokens);
