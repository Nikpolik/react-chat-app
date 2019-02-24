import * as React from 'react';
import './App.css';
import createStore from './store';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import { Switch } from 'react-router';
import PrivateRoute from './components/safegaurds/PrivateRoute';
import PublicRoute from './components/safegaurds/PublicRoute';
import Login from './components/login/login.component';
import Register from './components/register/register.component';
import Chat from './components/chat/chat.component';
import { RESET_CONNECTION } from './constants';
import Friends from './components/friends/friends.component';


const history = createBrowserHistory();
export const store = createStore(history);

store.subscribe(() => {
  const { user: { token, expiresAt } }  = store.getState();
  localStorage.setItem('token', token);
  localStorage.setItem('expiresAt', expiresAt ? expiresAt.toDateString() : '');
});

class App extends React.Component {
  
  componentWillMount() {
      store.dispatch({ type: RESET_CONNECTION});
  }

  public render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>
            <PrivateRoute path="/" exact={true} component={Chat} redirect="/login"/>
            <PrivateRoute path="/friends" exact={false} component={Friends} redirect="/login"/>
            <PublicRoute path="/login" component={Login} redirect="/"/>
            <PublicRoute path="/register" component={Register} redirect="/" />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
