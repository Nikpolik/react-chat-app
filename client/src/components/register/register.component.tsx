import * as React from 'react';
import { connect } from 'react-redux';

import './register.styles.css';
import { register, authNavigation } from 'src/store/actions/user';
import { State } from 'src/store';
const icon = require('../../assets/conversation.svg');

interface RegisterProps {
    login: () => void;
    register: (username: string, password: string, confirmPassword: string, firstName: string, lastName: string, email: string) => void
    message: {
        type?: string;
        text?: string;
    };
}

class Register extends React.Component<RegisterProps> {

    state = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        lastName: '',
        firstName: ''
    }

    _changeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    _login = (event: React.SyntheticEvent) => {
        event.preventDefault();
        this.props.login();
    }

    _register = () => {
        const { username, password, confirmPassword, email, firstName, lastName} = this.state;
        this.props.register(username, password, confirmPassword, firstName, lastName, email);
    }

    _showMessage = ({ type, text }: { type?: string, text?: string }) => {
        return text ? (
            <div className={"login-message " + type}>
                {text}
            </div>
        ) : null
    }

    render() {
        return (
            <div className="register-container">
                <div className="register-box">
                    <h1 className="register-header">Chatter App <img src={icon} className="register-logo" /></h1>
                    <span className="register-input">
                        <input name="username" onChange={this._changeInput} className="balloon register-input-text" id="username" type="text" placeholder="Username" /><label htmlFor="username">Username</label>
                    </span>
                    <span className="register-input">
                        <input name="email" onChange={this._changeInput} className="balloon register-input-text" id="email" type="text" placeholder="Email" /><label htmlFor="email">Email</label>
                    </span>
                    <div className="register-input-group">
                        <span className="register-input-group-item" style={{ marginRight: 15 }}>
                            <input name="firstName" onChange={this._changeInput} className="balloon register-input-text" id="firstName" type="text" placeholder="First Name" /><label htmlFor="firstName">First name</label>
                        </span>
                        <span className="register-input-group-item">
                            <input name="lastName" onChange={this._changeInput} className="balloon register-input-text" id="lastName" type="text" placeholder="Last Name" /><label htmlFor="lastName">Last name</label>
                        </span>
                    </div>
                    <span className="register-input">
                        <input name="password" onChange={this._changeInput} type="password" className="balloon register-input-text" id="password" placeholder="Password" /><label htmlFor="password">Password</label>
                    </span>
                    <span className="register-input">
                        <input name="confirmPassword" onChange={this._changeInput} type="password" className="balloon register-input-text" id="confirmPassword" placeholder="Confirm password" /><label htmlFor="confirmPassword">Confirm password</label>
                    </span>
                    {this._showMessage(this.props.message)}
                    <a onClick={this._login} href="#" className="register-redirect">If you already have an account click here to login</a>
                    <a className="button register-button" onClick={this._register}>Register</a>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: State) => ({
    message: state.user.message
})

const mapDispatchToProps = (dispatch: any) => ({
    login: () => dispatch(authNavigation('login')),
    register: (username: string, password: string, confirmPassword: string, firstName: string, lastName: string, email: string) => dispatch(register(username, password, confirmPassword, firstName, lastName, email))
})

export default connect(mapStateToProps, mapDispatchToProps)(Register);