import * as React from 'react';

import './message.styles.css';
import { Image } from 'semantic-ui-react';
import { Message as IMessage } from 'src/store/reducers/conversations.reducer';

interface MessageProps extends IMessage {
    username: string;
    userId: string;
    participants: {
        _id: string;
        username: string;
    }[]
}

interface SingleMessageProps extends IMessage {
    name: string;
}

const Right: React.FunctionComponent<SingleMessageProps> = (props) => (
    <div className="message-right-container clearfix">
        <div className="speech-bubble speech-bubble-right">
            {props.text}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px', flexDirection: 'column', marginRight: 10 }}>
            {props.name}
            <Image style={{ height: 40, width: 'auto' }} avatar src={require('../../../assets/avatar_placeholder.png')} />
        </div>
    </div>
);

const Left: React.FunctionComponent<SingleMessageProps> = (props) => (
    <div className="message-left-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px', flexDirection: 'column' }}>
            {props.name}
            <Image style={{ height: 40, width: 'auto' }} avatar src={require('../../../assets/avatar_placeholder.png')} />
        </div>
        <div className="speech-bubble speech-bubble-left">
            {props.text}
        </div>
    </div>
)
const Message: React.FunctionComponent<MessageProps> = (props) => {
    const { userId, sender } = props;
    if (userId === sender) {
        return <Right name={props.username} {...props} />
    }
    let participantSender = props.participants.find((participant) => participant._id === sender);
    let senderUsername = 'unknown';
    if(participantSender) {
        senderUsername = participantSender.username;
    }
    return <Left name={senderUsername} {...props} />;
};

export default Message;