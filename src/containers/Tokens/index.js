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
import IBCTransferDialog from 'containers/IBCTransfer/IBCTransferDialog';
import DepositDialog from './DepositDialog';

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
            <DepositDialog />
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
