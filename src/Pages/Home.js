import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './Home.css';
import api from '../services/api';
import io from 'socket.io-client';
import UserMenu from '../components/UserMenu';
import NotificationBox from '../components/NotificationBox';
import TicTacToe from '../components/tic-tac-toe/TicTacToe';
import MatchResult from '../components/tic-tac-toe/MatchResult';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedUser: {
                
            },
            menuOpened: false,
            users: [],
            auth: true,
            socket: null,
            ticTacToe: null,
            matchResult: null
        }
    }
    
    componentDidMount() {
        this.isAuthorized();
    }
    
    componentDidUpdate(prevProps, prevState) {
        if(prevState.loggedUser !== this.state.loggedUser) {
            const localSocket = io('http://localhost:3001', {
                query: {
                    user: this.state.loggedUser._id
                }
            });
            this.setState({ socket: localSocket });
        }
    }
    
    isAuthorized = async () => {
        await this.getLoggedUser();
        if (this.state.auth) {
            this.getRegisteredUser();
        }
    }
    
    getLoggedUser = async () => {
        try {
            const response = await api.get('/login/user');
            this.setState({ loggedUser: response.data });
        } catch (error) {
            this.setState({ auth: false });
        }
    }
    
    getRegisteredUser = async () => {
        try {
            const response = await api.get('/users');
            this.setState({ users: response.data });
        } catch (error) {
            this.setState({ auth: false });
        }
        
    }
    
    handleMenuClick = () => {
        this.setState({ menuOpened: !this.state.menuOpened })
    }
    
    render() {
        return (
            <div className="page-container">
                {!this.state.auth && <Redirect to="/login" />}
                <header className="page-header">
                    <div className="menu-icon" onClick={this.handleMenuClick}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <NotificationBox socket={this.state.socket}
                        startPlay={invite => this.state.ticTacToe.startPlay(invite.sender, invite._id)}
                    />
                </header>
                <div id="page-content">
                    <UserMenu opened={this.state.menuOpened} user={this.state.loggedUser} 
                        searchBase={this.state.users} 
                    />
                    <TicTacToe user={this.state.loggedUser} socket={this.state.socket} 
                        onRef={ref => this.setState({ ticTacToe: ref })}
                        onEndMatch={resultMessage => {
                            this.state.matchResult.showResult(resultMessage);
                        }}
                    />
                </div>
                <MatchResult onRef={ref => this.setState({ matchResult: ref })}
                    onClose={() => {
                        this.state.ticTacToe.resetGame();
                        this.getLoggedUser();
                    }}
                />
            </div>
        );
    }
    
}

export default Home;