import * as React from 'react';
import './generic.styles.css';

import NavBar from '../../navbar/navbar.component';
import Notifications from '../../notifications/notifications';

interface LayoutProps {
    content: React.ComponentType;
    footer?: React.ComponentType
}



const GenericLayout: React.FunctionComponent<LayoutProps> = ({ footer, content: Content }) => (
    <div className="generic-container">
        <div className="generic-navbar">
            <NavBar />
        </div>
        <div className="generic-content">
            <Content />
        </div>
        <Notifications/>
    </div>
)

export default GenericLayout;