import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './containers/Home';
import Stake from './containers/Stake';
import Proposals from './containers/Proposals';
import ProposalDialog from './containers/Proposals/ProposalDialog';
import ShieldedAssets from './containers/ShieldedAssets';
import IBCTransfer from './containers/IBCTransfer';
import Tokens from './containers/Tokens';

const routes = [{
    path: '/',
    component: Home,
}, {
    path: '/stake',
    component: Stake,
}, {
    path: '/proposals',
    component: Proposals,
}, {
    path: '/proposals/:proposalID',
    component: ProposalDialog,
}, {
    path: '/internalShielding',
    component: ShieldedAssets,
}, {
    path: '/externalShielding',
    component: IBCTransfer,
}, {
    path: '/externalTransfer',
    component: IBCTransfer,
}, {
    path: '/tokens',
    component: Tokens,
}, {
    path: '/tokensShielded',
    component: Tokens,
},  {
    path: '/externalTransfer/withdraw',
    component: IBCTransfer,
}];

const Router = () => {
    return (
        <div className="main_content">
            <div className="content_div scroll_bar">
                <Routes>
                    {routes.map((route) =>
                        <Route
                            key={route.path}
                            exact
                            element={<route.component/>}
                            path={route.path}/>,
                    )}
                    <Route
                        exact
                        element={<Home/>}
                        path="*"/>
                </Routes>
            </div>
        </div>
    );
};

export default Router;
