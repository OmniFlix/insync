import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import Stake from './containers/Stake';
import Proposals from './containers/Proposals';
import ProposalDialog from './containers/Proposals/ProposalDialog';

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
}];

const Router = () => {
    return (
        <div className="main_content">
            <div className="content_div scroll_bar">
                <Switch>
                    {routes.map((route) =>
                        <Route
                            key={route.path}
                            exact
                            component={route.component}
                            path={route.path}/>,
                    )}
                    <Route
                        exact
                        component={Home}
                        path="*"/>
                </Switch>
            </div>
        </div>
    );
};

export default Router;
