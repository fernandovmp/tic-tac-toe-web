import React, { Component } from 'react';
import './NotificationBox.css';
import NotificationIcon from '../assets/bell-outline.svg';
import AcceptInvite from '../assets/email.svg';
import api from '../services/api';

class NotificationBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notificationCount: 0,
            invites: []
        }
        this.getInvites();
    }
    
    componentDidUpdate(prevProps, prevState) {
        if(prevProps.socket !== this.props.socket) {
            this.props.socket.on('invite', () => {
                this.getInvites();
            });
            
        }
        if(prevState.invites !== this.state.invites) {
            let cont = 0;
            this.state.invites.forEach(item => {
                if (item.new) {
                    cont++;
                }
            });
            this.setState({ notificationCount: cont });
        }
    }
    
    getInvites = async () => {
        try {
            const response = await api.get('/invites');
            this.setState({ invites: response.data });
        } catch (error) {
            
        }
    }
    
    handleCheckNotification = async () => {
        this.setState({ notificationCount: 0 });
        this.state.invites.forEach(async item => {
            if (item.new) {
                await api.patch(`/invites/${item._id}`);
            }
        });
    }
    
    render() {
        return (
            <div className="notification-icon" >
                {this.state.notificationCount > 0 && (
                    <div id="notification-count">
                        <p>{this.state.notificationCount}</p>
                    </div>
                )}
                <button id="notification-btn" onMouseOver={this.handleCheckNotification}>
                    <img src={NotificationIcon} alt="" />
                </button>
                <div className="notification-content">
                    {this.state.invites.reverse().map(invite => (
                        <div key={invite._id} className="invite-container">
                            <strong className="invite-header">Você recebeu um convite!</strong>
                            <div>
                                <p>{invite.sender.username} convidou você para uma partida!</p>
                                <button onClick={() => this.props.startPlay(invite)}>
                                    <img src={AcceptInvite} alt="Aceitar convite" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default NotificationBox;