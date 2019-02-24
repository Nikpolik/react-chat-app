import * as React from 'react';
import { connect } from 'react-redux';
import './navbar.styles.css';
import { State } from 'src/store';
import { Dropdown } from 'semantic-ui-react';
import { logout } from 'src/store/actions/user';
import { routerActions } from 'connected-react-router';
import { Location } from 'history';

const icon = require('../../assets/conversation.svg');

interface NavbarProps {
    username: string;
    logout: () => void;
    goTo: (path: string) => () => void;
    location: Location,
    actions?: React.ComponentType;
}

const Menu = Dropdown.Menu;
const Item: React.FunctionComponent<{ onClick?: (event?: React.SyntheticEvent) => void }> = ({ children, onClick } : { children: React.ReactNode, onClick?: (event?: React.SyntheticEvent) => void }) => (
    <Dropdown.Item style={{ fontSize: '20px', textAlign: 'center' }} onClick={onClick}>
        {children}
    </Dropdown.Item>
)

const Navbar: React.FunctionComponent<NavbarProps> = ({ username, logout, goTo, location, actions: Actions }) => {
    return (
        <div className="navbar-container">
            <div onClick={goTo('/')} className="navbar-item navbar-first"><img style={{ height: '90%'}} src={icon} alt=""/></div>
            <div className="navbar-path">
                <h3 style={{ marginRight: 'auto'}}>{location.pathname.slice(1, location.pathname.length).toUpperCase()}</h3>
                {Actions ? 
                    <Actions/>    
                :
                    null
                }
            </div>
            <Dropdown text={username} className="navbar-item navbar-right">
                <Menu className="navbar-dropdown">
                    <Item onClick={goTo('friends')}>
                        Friends
                    </Item>
                    <Item onClick={logout}>
                        Logout
                    </Item>
                </Menu>
            </Dropdown>
        </div>
    )
}

const mapStateToProps = (state: State) => ({
    username: state.user.username,
    location: state.router.location
});

const mapDispatchToProps = (dispatch: any) => ({
    logout: () => dispatch(logout()),
    goTo: (path: string) => () => dispatch(routerActions.push(path))
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)