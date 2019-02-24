import * as React from 'react';
import { Modal, Header, Search, Button, SearchResultData } from "semantic-ui-react";
import { State } from 'src/store';
import { connect } from 'react-redux';
import { searchFriends } from 'src/store/actions/search';
import {  inviteToConversation } from 'src/store/actions/conversations';

interface InviteModalProps {
    open: boolean;
    closeModal: () => void;
    searchFriends: (username?: string) => void;
    results: { _id: string, username: string }[];
    inviteToConversation: (friendId: string) => void;
}

interface InviteModalState {
    selection?: string
}
interface ownProps {
    open: boolean;
    closeModal: () => void;
}


class InviteModal extends React.Component<InviteModalProps, InviteModalState> {

    state = {
        selection: ''
    }

    _searchChange = (event: React.SyntheticEvent, { value }: { value: string }) => {
        this.props.searchFriends(value);

    }
    _selectionChange = (event: React.SyntheticEvent, { result }: SearchResultData) => this.setState({ selection: result.value });
    _submit = () => {
        const friendId = this.state.selection;
        if (!friendId) {
            alert('You must select a friend id in order to ivnite to a conversation');
            return;
        }
        setTimeout(this.props.closeModal, 0);
        this.props.inviteToConversation(friendId);
    }

    render() {
        const { open, closeModal, results } = this.props;
        const formattedResults = results.map(({ username, _id }) => ({
            title: username,
            value: _id
        }))
        return (
            <Modal open={open} basic small onClose={closeModal}>
                <Header icon="chat" content="Invite new friend to the conversation" />
                <Modal.Content style={{ display: 'flex', flexDirection: 'row' }}>
                    <Search style={{ width: '80%', marginRight: '5px' }}
                        onSearchChange={this._searchChange}
                        results={formattedResults}
                        onResultSelect={this._selectionChange}
                        onSelectionChange={this._selectionChange}
                        noResultsMessage="No friends found"
                    />
                    <Button inverted icon="plus" onClick={this._submit} />
                </Modal.Content>
            </Modal>
        )
    }
}

const mapStateToProps = (state: State, { open, closeModal }: ownProps) => ({
    open,
    closeModal,
    results: state.search.user.result,
});

const mapDispatchToProps = (dispatch: any) => ({
    searchFriends: (username?: string) => dispatch(searchFriends(username)),
    inviteToConversation: (friendId: string) => dispatch(inviteToConversation(friendId))
});

export default connect(mapStateToProps, mapDispatchToProps)(InviteModal);