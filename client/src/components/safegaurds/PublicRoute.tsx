import * as React from 'react';
import { Redirect, Route } from 'react-router';
import { State } from 'src/store';
import { connect } from 'react-redux';

interface PublicRouteProps {
    token?: string;
    redirect: string;
    exact?: boolean;
    path: string;
    component: React.ComponentType
    [key: string]: any
}

const PrivateRoute = (props: PublicRouteProps) => {
    const { path, exact, token, redirect, component: Component } = props;
    return <Route
        exact={exact}
        path={path}
        render={() => {
            if (token) {
                return <Redirect to={redirect} />
            }
            return <Component />
        }}
    />
}

const mapStateToProps = (state: State, ownProps: PublicRouteProps) => ({
    token: state.user.token,
    ...ownProps
})

export default connect(mapStateToProps)(PrivateRoute);