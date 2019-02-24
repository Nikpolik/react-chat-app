import * as React from 'react';
import { List, Image } from 'semantic-ui-react';

import './invitations.styles.css';

const placeholder = require('src/assets/avatar_placeholder.png')

interface InvitationsProps {
    invitations: { username: string, _id: string }[],
}

const { Item, Content, Header } = List;

const Invitations: React.FunctionComponent<InvitationsProps> = ({ invitations }) => {
    return (
        <React.Fragment>
            <h2 style={{ textAlign: 'center' }}>Invitations</h2>
            <List className="friendList">
                {invitations.map((user) => (
                    <Item>
                        <Image avatar src={placeholder} />
                        <Content>
                            <Header as="h2">{user.username}</Header>
                        </Content>
                    </Item>
                ))}
            </List>
        </React.Fragment>
    )
}

export default Invitations;
