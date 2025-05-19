import CircularProgress from '../../components/CircularProgress';
import NavBar from '../NavBar';
import TokensListTable from './TokensListTable';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Assets = (props) => {
    return (
        <div className="assets stake">
            <NavBar proposalTab={true}/>
            {props.tokensProgress || props.balanceProgress
                ? <CircularProgress />
                : <TokensListTable />}
        </div>
    );
};

TokensListTable.propTypes = {
    balanceProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    tokensProgress: PropTypes.bool.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        tokensProgress: state.accounts.tokensList.inProgress,
        balanceProgress: state.accounts.balanceList.inProgress,
    };
};

export default connect(stateToProps)(Assets);
