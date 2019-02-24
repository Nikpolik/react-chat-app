import * as React from 'react';
import { Redirect, Route } from 'react-router';
import { State } from 'src/store';
import { connect } from 'react-redux';

interface PrivateRouteProps {
    token?: string;
    redirect: string;
    exact?: boolean;
    path: string;
    component: JSX.Element
    [key: string]: any,
}

const PrivateRoute = (props: PrivateRouteProps) => {
    const { path, exact, token, redirect, component: Component } = props;
    return <Route
        exact={exact}
        path={path}
        render={() => {
            if (!token) {
                return <Redirect to={redirect} />
            }
            return Component
        }}
    />
}

const mapStateToProps = (state: State, ownProps: PrivateRouteProps) => ({
    token: state.user.token,
    ...ownProps
});

export default connect(mapStateToProps)(PrivateRoute);