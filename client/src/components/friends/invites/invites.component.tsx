import * as React from 'react';
import { List, Image, Button } from 'semantic-ui-react';

import './invites.styles.css';

const placeholder = require('src/assets/avatar_placeholder.png')

interface InvitesProps {
    invites: { username: string, _id: string }[],
    acceptInvite: (friendId: string) => void
}

const { Item, Content, Header } = List;

const Invites: React.FunctionComponent<InvitesProps> = ({ invites, acceptInvite }) => {
    return (
        <React.Fragment>
            <h2 style={{ textAlign: 'center' }}>Invites</h2>
            <List className="friendList">
                {invites.map((user) => (
                    <Item>
                        <Image avatar src={placeholder} />
                        <Content>
                            <Header as="h2">{user.username}</Header>
                        </Content>
                        <Content floated="right">
                            <Button color="green" onClick={() => acceptInvite(user._id)}>Accept</Button>
                        </Content>
                    </Item>
                ))}
            </List>
        </React.Fragment>
    )
}

export default Invites;
