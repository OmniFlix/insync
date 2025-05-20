import CircularProgress from '../../components/CircularProgress';
import NavBar from '../NavBar';
import TokensListTable from './TokensListTable';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AssetTabs from './Tabs';

const Assets = (props) => {
    return (
        <>
            <NavBar/>
            <AssetTabs/>
            {props.assetsTab === 'transparent' && <div className="assets stake padding">
                {props.tokensProgress || props.balanceProgress
                    ? <CircularProgress />
                    : <TokensListTable />}
            </div>}
            {props.assetsTab === 'shielded' && <div style={{margin: '150px 0'}}>Coming Soon...</div>}
        </>
    );
};

TokensListTable.propTypes = {
    assetsTab: PropTypes.string.isRequired,
    balanceProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    tokensProgress: PropTypes.bool.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        tokensProgress: state.accounts.tokensList.inProgress,
        balanceProgress: state.accounts.balanceList.inProgress,
        assetsTab: state.assets.assetsTab.value,
    };
};

export default connect(stateToProps)(Assets);
