import * as React from 'react';
import './login.styles.css';
import { connect } from 'react-redux';
import { State } from 'src/store';
import { login, authNavigation } from 'src/store/actions/user';

const icon = require('../../assets/conversation.svg');

interface LoginProps {
    loading: boolean,
    login: (username: string, password: string) => void;
    register: () => void;
    message: {
        type?: string;
        text?: string;
    };
}

class Login extends React.Component<LoginProps> {

    state = {
        username: '',
        password: ''
    }   

    

    _login = (event: React.SyntheticEvent) => {
        event.preventDefault();
        const { username, password } = this.state;
        this.props.login(username, password);
    }

    _register = (event: React.SyntheticEvent) => {
        event.preventDefault();
        this.props.register();
    }

    _changeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    _showMessage = ({ type, text} : { type?: string, text?: string}) => {
        return text ? (
            <div className={"login-message " + type}>
                {text}
            </div>
        ) : null
    }

    render() {
        return (
            <div className="login-container">
                <form className="login-box" onSubmit={this._login}>
                    <h1 className="login-header">Chatter App <img src={icon} className="login-logo" /></h1>
                    <span className="login-input">
                        <input name="username" onChange={this._changeInput} className="balloon login-input-text" id="username" type="text" placeholder="Username" /><label htmlFor="username">Username</label>
                    </span>
                    <span className="login-input">
                        <input name="password" onChange={this._changeInput} type="password" className="balloon login-input-text" id="password" placeholder="Password" /><label htmlFor="password">Password</label>
                    </span>
                    {this._showMessage(this.props.message)}
                    <a onClick={this._register} href="#">Register here if you dont have an account yet</a>
                    <button type="submit" className="button login-button" onClick={this._login}>Login</button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state: State) => ({
    loading: state.user.loading,
    message: state.user.message
});

const mapDispatchToProps = (dispatch: any) => ({
    login: (username: string, password: string) => dispatch(login(username, password)),
    register: (path: string) => dispatch(authNavigation('register')) 
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);