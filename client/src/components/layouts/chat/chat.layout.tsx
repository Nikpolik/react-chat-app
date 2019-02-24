import * as React from 'react';
import './chat.styles.css';

import NavBar from '../../navbar/navbar.component';
import Notifications from '../../notifications/notifications';

interface LayoutProps {
    content : React.ComponentType;
    sidebar: React.ComponentType;
    footer?: React.ComponentType;
    actions?: React.ComponentType;
}


const ChatLayout: React.FunctionComponent<LayoutProps> =  ({ footer, content: Content, sidebar: Sidebar, actions}) => (
    <div className="chat-container">
        <div className="navbar">
            <NavBar actions={actions}/>
        </div>
        <div className="sidebar">
            <Sidebar/>
        </div>
        <div className="content">
            <Content/>
        </div>
        <Notifications/>
    </div>
)

export default ChatLayout;