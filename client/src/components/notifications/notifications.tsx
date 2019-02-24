import * as React from 'react';
import { connect } from 'react-redux';
import { State } from 'src/store';

const { SemanticToastContainer } = require('react-semantic-toasts');

interface NotificationsProps {
}

class Notifications extends React.Component<NotificationsProps> {
    
    notificationRef = React.createRef();

    render() {
        return (
            <SemanticToastContainer />
        );
    }
}

const mapStateToProps = (state: State) => ({

})

export default connect(mapStateToProps)(Notifications)