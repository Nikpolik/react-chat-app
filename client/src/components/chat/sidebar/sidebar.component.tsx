import * as React from 'react';
import { connect } from 'react-redux';
import './sidebar.styles.css';
import { Icon, Image } from 'semantic-ui-react';
import SearchModal from './searchModal.component';
import { State } from 'src/store';
import { Conversation } from 'src/store/reducers/conversations.reducer';
import { loadConversation } from 'src/store/actions/conversations';
const placeholder = require('src/assets/avatar_placeholder.png')

interface SideBarProps {
    conversations: {
        [id: string]: Conversation
    };
    loadConversation: (conversationId: string) => void;
    selected?: Conversation;
}


class SideBar extends React.Component<SideBarProps, { open: boolean }> {

    state = {
        open: false
    }

    _openModal = () => {
        this.setState({
            open: true
        });
    }

    _closeModal = () => {
        console.log('closing modal');
        this.setState({
            open: false
        })
    }
    
    render() {
        if(!this.props.conversations) {
            return <div>oops</div>
        }
        console.log(this.state.open);
        return (
            <div className="sidebar-container">
                <div className="sidebar-item header" onClick={this._openModal}>
                    <Icon name="plus" size="big" />
                    <SearchModal open={this.state.open} closeModal={this._closeModal} />
                </div>
                    {Object.keys(this.props.conversations).sort((firstId, secondId) => {
                        const first = new Date(this.props.conversations[firstId].lastMessageTimestamp).getTime();
                        const second = new Date(this.props.conversations[secondId].lastMessageTimestamp).getTime();
                        return second - first;                 
                    }).map((id) => {
                        let active = "";
                        if(this.props.selected && this.props.selected._id === id) {
                            active = "sidebar-item-active"
                        }
                        let current = this.props.conversations[id];
                        let text = current.lastMessage ? current.lastMessage.text : ""
                        return (
                            <div className={["sidebar-item", "sidebar-conversation", active].join(" ")} onClick={() => this.props.loadConversation(id)}>
                                {current.participants.length > 1 ?
                                    null
                                    :
                                    <Image avatar src={placeholder} className="sidebar-avatar"/>
                                }
                                <div className="sidebar-content">
                                    <h3 style={{ fontSize: 20 }}>{current.participants.map((participant) => participant.username).join(', ')}</h3>
                                </div>
                                <div className="sidebar-LastMessage">{text}</div>
                            </div>
                        )
                    })}
            </div>
        )
    }
}

const mapStateToProps = (state: State) => {
    return ({
        conversations: state.conversations.conversations,
        selected: state.conversations.selected
    })
}

const mapDispatchToProps = (dispatch: any) => {
    return ({
        loadConversation: (conversationId: string) => dispatch(loadConversation(conversationId))
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar)