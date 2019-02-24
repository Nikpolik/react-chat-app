import * as React from 'react';
import { connect } from 'react-redux';
import ChatLayout from '../layouts/chat/chat.layout';
import { State } from 'src/store';
import { getDetails } from 'src/store/actions/user';

import Sidebar from './sidebar/sidebar.component';
import { loadConversations } from 'src/store/actions/conversations';
import './chat.styles.css';
import Conversation from  './conversation/conversation.component';
import { Conversation as IConversation } from 'src/store/reducers/conversations.reducer';
import Actions from './actions/actions.component';

interface ChatProps {
    getDetails: () => void;
    loadConversations: () => void;
    selected?: IConversation
}

class Chat extends React.Component<ChatProps> {

    componentDidMount() {
        this.props.getDetails();
        this.props.loadConversations();
    }

    render() {
        const selected = this.props.selected;
        return (
            selected ? 
                <Conversation/>
            :
                <h1 className="chat-placeholder">
                    Selected a conversation from the left to start chatting
                </h1>
        )
    }
}

const mapStateTopProps = (state: State) => ({
    selected: state.conversations.selected
});

const mapDispatchToProps = (dispatch: any) => ({
    getDetails: () => dispatch(getDetails()),
    loadConversations: () => dispatch(loadConversations())
});

const container = connect(mapStateTopProps, mapDispatchToProps)(Chat);

export default <ChatLayout content={container} sidebar={Sidebar} actions={Actions}/>