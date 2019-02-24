import * as React from 'react';
import { connect } from 'react-redux';
import { State } from 'src/store';

import GenericLayout from '../layouts/generic/generic.layout';
import './friends.styles.css';
import FriendList from './friendList/friendList.component';
import Invitations from './invitations/invitations.component';
import Invites from './invites/invites.component';

import { getDetails, addFriend, acceptInvite, deleteFriend } from 'src/store/actions/user';
import { Search, SearchProps, SearchResultData } from 'semantic-ui-react';
import { searchUsers, clearResults } from 'src/store/actions/search';

interface FriendsProps {
    friends: any[];
    invitations: any[];
    invites: any[];
    getDetails: () => void;
    results: any[];
    search: (username: string) => void;
    addFriend: (friendId: string) => void;
    acceptInvite: (friendId: string) => void;
    deleteFriend: (friendId: string) => void;
    clearResults: () => void;
}

class Friends extends React.Component<FriendsProps> {

    state = {
        selected: ''
    }

    componentWillMount() {
        this.props.getDetails();
        this.props.clearResults();
    }

    _changeInput = (event: React.MouseEvent<HTMLInputElement>, props: SearchProps) => {
        const value = props.value;
        if (value) {
            this.props.search(value);
        }
    }

    _selectionChange = (event: any, data: SearchResultData) => {
        const { result: { value } } = data;
        this.setState({
            selected: value
        });
    }

    _addFriend = () => {
        const { selected } = this.state;
        if (!selected) {
            alert('No user selected');
            return;
        }
        this.props.addFriend(selected);
    };

    render() {
        let results = this.props.results ? this.props.results.map(({ username, _id }) => ({
            title: username,
            value: _id
        })) : [];

        return (
            <div className="friends-container">
                <div className="friends-add-container">
                    <div style={{ fontSize: '22px', fontWeight: 'bold', marginRight: '1%' }}>Add friend by username</div>
                    <Search fluid className="friends-add-input" results={results} onSearchChange={this._changeInput} onResultSelect={this._selectionChange} />
                    <a className="button friends-add-button" onClick={this._addFriend}>Add</a>
                </div>
                <br />
                <div className="friends-list-container">
                    <div className="friends-item">
                        <FriendList friends={this.props.friends} deleteFriend={this.props.deleteFriend} />
                    </div>
                    <div className="friends-item">
                        <Invites invites={this.props.invites} acceptInvite={this.props.acceptInvite} />
                    </div>
                    <div className="friends-item">
                        <Invitations invitations={this.props.invitations} />
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: State) => ({
    friends: state.user.friends,
    invitations: state.user.invitations,
    invites: state.user.invites,
    results: state.search.user.result
});

const mapDispatchToProps = (dispatch: any) => ({
    getDetails: () => dispatch(getDetails()),
    search: (username: string) => dispatch(searchUsers(username)),
    addFriend: (friendId: string) => dispatch(addFriend(friendId)),
    acceptInvite: (friendId: string) => dispatch(acceptInvite(friendId)),
    deleteFriend: (friendId: string) => dispatch(deleteFriend(friendId)),
    clearResults: () => dispatch(clearResults())
})

export default <GenericLayout content={connect(mapStateToProps, mapDispatchToProps)(Friends)} />