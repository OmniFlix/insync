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
                {props.tokensProgress || props.balanceProgress
                    ? <CircularProgress />
                    : <TokensListTable />}
            </div>}
            {props.assetsTab === 'shielded' && <div className="assets stake padding">
                {props.tokensProgress || props.shieldedBalanceProgress
                    ? <div className={ClassNames(classes.root, 'leaner_progress')}>
                        <LinearProgress />
                    </div>
                    : null}
                <ShieldedTokensListTable/>
            </div>}
            <TransparentDepositDialog />
            <TransparentWithdrawDialog />
            <TransparentTransferDialog />
            <TransparentConvertDialog />
            <ShieldedDepositDialog />
            <ShieldedWithdrawDialog />
            <ShieldedTransferDialog />
            <ShieldedConvertDialog />
        </>
    );
};

Tokens.propTypes = {
    assetsTab: PropTypes.string.isRequired,
    balanceProgress: PropTypes.bool.isRequired,
    shieldedBalanceProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    tokensProgress: PropTypes.bool.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        tokensProgress: state.accounts.tokensList.inProgress,
        balanceProgress: state.accounts.balanceList.inProgress,
        shieldedBalanceProgress: state.accounts.shieldedBalance.inProgress,
        assetsTab: state.assets.assetsTab.value,
    };
};

export default connect(stateToProps)(Tokens);
