
import { connect } from 'react-redux';
import * as React from 'react';

import './actions.styles.css';
import { State } from 'src/store';
import { Conversation } from 'src/store/reducers/conversations.reducer';
import { Icon } from 'semantic-ui-react';
import { leaveConversation } from 'src/store/actions/conversations';
import InviteModal from './inviteModal.component';
interface ActionsProps extends Conversation {
    leaveConversation: () => void;
}

const Actions: React.FunctionComponent<ActionsProps> = ({ _id, leaveConversation }) => {
    const [open, setOpen] = React.useState(false);
    const closeModal = () => {
        setOpen(false);
    }
    const openModal = () => {
        setOpen(true);
    }
    if(!_id) {
        return null;
    }
    return (
        <React.Fragment>
            <div className="navbar-item navbar-right action" onClick={openModal}>
                Invite<Icon name="plus" className="action-icon"/>
            </div>
            <div className="navbar-item navbar-right action" onClick={leaveConversation}>
                Leave<Icon name="sign-out alternate" className="action-icon"/>
            </div>
            <InviteModal open={open} closeModal={closeModal}/>
        </React.Fragment>
    )
};

const mapDispatchToProps = (dispatch: any) => ({
    leaveConversation: () => dispatch(leaveConversation())
});

const mapStateToProps = (state: State) => ({
    ...state.conversations.selected
});

export default connect(mapStateToProps, mapDispatchToProps)(Actions);