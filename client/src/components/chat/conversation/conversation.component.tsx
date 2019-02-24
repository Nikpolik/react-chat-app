import * as React from 'react';
import { connect } from 'react-redux';

import './conversation.styles.css';
import { Icon } from 'semantic-ui-react';
import { State } from 'src/store';
import { Conversation as IConversation } from '../../../store/reducers/conversations.reducer';
import { sendMessage } from 'src/store/actions/conversations';
import Message from './message';

interface ConversationProps {
    selected: IConversation;
    sendMessage: (conversationId: string, message: string) => void;
    username: string;
    id: string;
}

class Conversation extends React.Component<ConversationProps> {

    messageContainer = React.createRef<HTMLDivElement>();

    state = {
        message: ''
    }

    _keyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            this.sendMessage();
        }
    }

    sendMessage = () => {
        if (this.state.message) {
            const { sendMessage, selected } = this.props;
            sendMessage(selected._id, this.state.message);
            this.setState({
                message: ""
            })
        }
    }

    componentDidMount() {
        this._scrollBottom();
    }

    componentDidUpdate() {
        this._scrollBottom();
    }

    _scrollBottom = () => {
        let div = this.messageContainer.current;
        if (div) {
            div.scroll({ top: div.scrollHeight })
        }
    }

    _submit = () => {
        this.sendMessage();
    }

    _changeText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({
            message: event.target.value
        })
    }

    render() {
        return (
            <div className="conversation-container">
                <div className="messages-container" ref={this.messageContainer}>
                    {this.props.selected.messages.map((message) => {
                        return <Message participants={this.props.selected.participants} userId={this.props.id} username={this.props.username} {...message} />
                    })}
                </div>
                <div className="send-box">
                    <textarea className="send-input" onKeyDown={this._keyDown} onChange={this._changeText} value={this.state.message} />
                    <div className="send-icon-container" onClick={this._submit}>
                        <Icon size="big" name="send"/>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: State) => ({
    selected: state.conversations.selected,
    username: state.user.username,
    id: state.user._id
});

const mapDispatchToProps = (dispatch: any) => ({
    sendMessage: (conversationId: string, message: string) => dispatch(sendMessage(message, conversationId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Conversation)