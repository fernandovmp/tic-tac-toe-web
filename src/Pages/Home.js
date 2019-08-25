import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import './Home.css';
import api from '../services/api';
import InviteIcon from '../assets/account-plus.svg'
import NotificationIcon from '../assets/bell-outline.svg';
import AcceptInvite from '../assets/email.svg';
import io from 'socket.io-client';
import UserMenu from '../components/UserMenu';
import NotificationBox from '../components/NotificationBox';
import TicTacToe from '../components/tic-tac-toe/TicTacToe';

export default function Home({ history }) {
    
    const [loggedUser, setLoggedUser] = useState({});
    const [searchUsername, setSearchUsername] = useState('');
    const [menuOpened, setMenuOpened] = useState(false);
    const [users, setUsers] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [invites, setInvites] = useState([]);
    const [auth, setAuth] = useState(true);
    const [notificationCount, setNotificationCount] = useState(0);
    const [socket, setSocket] = useState(null);
    const [gameState, setGameState] = useState({});
    const [resultContainerOpened, setResultContainerOpened] = useState(false);
    const [gameResultMessage, setGameResultMessage] = useState('');
    const [showPlayers, setShowPlayers] = useState(false);
    const [opponentInfo, setOpponentInfo] = useState({});
    const [ticTacToe, setTicTacToe] = useState(null);
    
    async function getLoggedUser() {
        try {
            const response = await api.get('/login/user');
            setLoggedUser(response.data);
        } catch (error) {
            setAuth(false);
        }
    }
    
    async function GetRegisteredUser() {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            setAuth(false);
        }
    }
    
    async function isAuthorized() {
        await getLoggedUser();
        if(auth) {
            GetRegisteredUser();
            //GetInvites();
        }
    }
    
    useEffect(() => { isAuthorized(); }, []);
    
    useEffect(() => {
        const localSocket = io('http://localhost:3001', {
            query: {
                user: loggedUser._id
            }
        });
        setSocket(localSocket);
    }, [loggedUser])
    
    function handleMenuClick() {
        setMenuOpened(!menuOpened);
    }
    
    return (
        <div className="page-container">
            {!auth && <Redirect to="/login" /> }
            <header className="page-header">
                <div className="menu-icon" onClick={handleMenuClick}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <NotificationBox socket={socket} 
                    startPlay={ opponent => ticTacToe.startPlay(opponent)}
                />
            </header>
            <div id="page-content">
                <UserMenu opened={menuOpened} user={loggedUser} searchBase={users}/>
                <TicTacToe user={loggedUser} socket={socket} onRef={ref => setTicTacToe(ref)}
                    onEndMatch={resultMessage => {
                        setGameResultMessage(resultMessage);
                        setResultContainerOpened(true);
                    }}
                />
            </div>
            {resultContainerOpened && (<div id="game-result-container">
                <h1>{gameResultMessage}</h1>
                <button onClick={() => { 
                    setResultContainerOpened(false);
                    ticTacToe.resetGame();
                    getLoggedUser();
                }}>FECHAR</button>
            </div>)}
        </div>
    );
};