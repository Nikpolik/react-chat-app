import * as React from 'react';
import { List, Image, Button } from 'semantic-ui-react';
import './friendList.styles.css';
const placeholder = require('src/assets/avatar_placeholder.png')
interface FriendListProps {
    friends: {username: string, _id: string}[],
    deleteFriend: (friendId: string) => void
}

const { Item, Content, Header } = List;

const FriendList: React.FunctionComponent<FriendListProps> = ({ friends, deleteFriend }) => {
    return (
        <React.Fragment>
            <h2 style={{ textAlign: 'center'}}>Manage Friends</h2>
            <List className="friendList">
                {friends.map((user) => (
                    <Item>
                        <Image avatar src={placeholder} />
                        <Content>
                            <Header as="h2">{user.username}</Header>
                        </Content>
                        <Content floated="right">
                            <Button color="red" onClick={() => deleteFriend(user._id)}>Delete</Button>
                        </Content>
                    </Item>
                ))}
            </List>
        </React.Fragment>
    )
} 

export default FriendList;
