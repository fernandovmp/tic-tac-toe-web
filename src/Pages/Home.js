import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import './Home.css';
import api from '../services/api';
import InviteIcon from '../assets/account-plus.svg'
import NotificationIcon from '../assets/bell-outline.svg';
import AcceptInvite from '../assets/email.svg';
import io from 'socket.io-client';
import UserMenu from '../components/UserMenu';

const board = ['', '', '', '', '', '', '', '', ''];
const symbols = ['X', 'O'];
const winningSequences = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
const defaultGameState = {
    board,
    currentSymbol: -1,
    players: [],
    matchState: {
        end: false,
        result: ''
    }
}

const resultMessages = {
    won: 'Você ganhou!',
    tied: 'Empate',
    lost: 'Você perdeu!'
}

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
    const [gameState, setGameState] = useState(defaultGameState);
    const [resultContainerOpened, setResultContainerOpened] = useState(false);
    const [gameResultMessage, setGameResultMessage] = useState('');
    const [showPlayers, setShowPlayers] = useState(false);
    const [opponentInfo, setOpponentInfo] = useState({});
    
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
    
    async function GetInvites() {
        try {
            const response = await api.get('/invites');
            setInvites(response.data);
        } catch (error) {
            //setAuth(false);
        }
        
    }
    
    async function isAuthorized() {
        await getLoggedUser();
        if(auth) {
            GetRegisteredUser();
            GetInvites();
        }
    }
    
    useEffect(() => { isAuthorized(); }, []);
    
    useEffect(() => {
        const localSocket = io('http://localhost:3001', {
            query: {
                user: loggedUser._id
            }
        });
        localSocket.on('invite', () => GetInvites());
        localSocket.on('startPlay', startState => {
            setGameState(startState);
            setShowPlayers(true);
            async function getOpponent (opponentId) {
                const response = await api.get(`/users/${opponentId}`);
                setOpponentInfo(response.data);
                console.log(response.data + '\n' + startState.players);
            }
            getOpponent(startState.players[1]);
            localSocket.on('makePlay', handleMakePlay);
        });
        setSocket(localSocket);
    }, [loggedUser])
    
    useEffect(() => {
        let cont = 0;
        invites.forEach(item => {
            if (item.new) {
                cont++;
            }
        });
        setNotificationCount(cont);
    }, [invites]);
    function handleMenuClick() {
        setMenuOpened(!menuOpened);
    }
    
    useEffect(() => {
        if(!resultContainerOpened)
            setGameState(defaultGameState);
    }, [resultContainerOpened]);
    
    async function handleCheckNotification() {
        setNotificationCount(0);
        invites.forEach(async item => {
            if(item.new) {
                await api.patch(`/invites/${item._id}`);
            }
        });
    }
    
    async function handleMakePlay(newState) {
        setGameState(newState);
        let resultMessage = '';
        if (newState.matchState.end) {
            let requestData = {};
            if (newState.matchState.result === loggedUser._id) {
                requestData = {
                    wonMatches: loggedUser.wonMatches + 1
                };
                resultMessage = resultMessages.won;
            }
            else if (newState.matchState.result === 'tied') {
                requestData = {
                    tiedMatches: loggedUser.tiedMatches + 1
                };
                resultMessage = resultMessages.tied;
            }
            else {
                requestData = {
                    lostMatches: loggedUser.lostMatches + 1
                };
                resultMessage = resultMessages.lost;
            }
            await api.patch(`/users/${loggedUser._id}`, requestData);
            setGameResultMessage(resultMessage);
            setResultContainerOpened(true);
        }
        
    }
    
    function checkWinningSequence(symbol) {
        for(let i in winningSequences) {
            if (gameState.board[winningSequences[i][0]] === symbol &&
                gameState.board[winningSequences[i][1]] === symbol &&
                gameState.board[winningSequences[i][2]] === symbol) {
                return true;
            }
        }
        return false;
    }
    
    async function startPlay(opponentUser) {
        const defaultState = {
            board,
            currentSymbol: 0,
            players: [opponentUser._id, loggedUser._id],
            matchState: {
                end: false,
                result: ''
            }
        };
        setGameState(defaultState);
        setShowPlayers(true);
        setOpponentInfo(opponentUser);
        socket.emit('startPlay', defaultState);
        socket.on('makePlay', handleMakePlay);
    }
    
    async function handlePlay(index) {
        if(gameState.players[gameState.currentSymbol] !== loggedUser._id) {
            return;
        }
        if(gameState.board[index] !== '') {
            return;
        }
        gameState.board[index] = symbols[gameState.currentSymbol];
        if(checkWinningSequence(symbols[gameState.currentSymbol])) {
            gameState.matchState = {
                end: true,
                result: symbols[gameState.currentSymbol]
            }
        }
        if(gameState.board.indexOf('') === -1) {
            gameState.matchState = {
                end: true,
                result: 'tied'
            }
        }
        gameState.currentSymbol = gameState.currentSymbol === 0 ? 1 : 0;
        socket.emit('makePlay', gameState);
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
                <div className="notification-icon" >
                    {notificationCount > 0 && (<div id="notification-count">
                        <p>{notificationCount}</p>
                    </div>)}
                    <button id="notification-btn" onMouseOver={handleCheckNotification}>
                        <img src={NotificationIcon} alt=""/>
                    </button>
                    <div className="notification-content">
                        { invites.reverse().map( invite => (
                            <div key={invite._id} className="invite-container">
                                <strong className="invite-header">Você recebeu um convite!</strong>
                                <div>
                                    <p>{invite.sender.username} convidou você para uma partida!</p>
                                    <button onClick={() => startPlay(invite.sender)}>
                                        <img src={AcceptInvite} alt="Aceitar convite"/>
                                    </button>
                                </div>
                            </div>
                            ))}
                    </div>
                </div>
            </header>
            <div id="page-content">
                <UserMenu opened={menuOpened} user={loggedUser} searchBase={users}/>
                <div className="game">
                    {showPlayers && (<div className="game-players">
                        <div 
                        className={`player ${gameState.players[gameState.currentSymbol] === loggedUser._id ? 'player-turn' : '' }`}>
                            <p>{loggedUser.username}</p>
                        </div>
                        <div 
                        className={`player ${gameState.players[gameState.currentSymbol] === opponentInfo._id ? 'player-turn' : '' }`}>
                            <p>{opponentInfo.username}</p>
                        </div>
                    </div>)}
                    <div className="board">
                        <div className="board-cell" onClick={() => handlePlay(0) }>
                            <div>{gameState.board[0]}</div>
                        </div>
                        <div className="board-cell board-vertical-border" onClick={() => handlePlay(1)}>
                            <div>{gameState.board[1]}</div>
                        </div>
                        <div className="board-cell" onClick={() => handlePlay(2)}>
                            <div>{gameState.board[2]}</div>
                        </div>
                        <div className="board-cell board-horizontal-border" onClick={() => handlePlay(3)}>
                            <div>{gameState.board[3]}</div>
                        </div>
                        <div className="board-cell board-vertical-border board-horizontal-border" 
                            onClick={() => handlePlay(4)}
                        >
                            <div>{gameState.board[4]}</div>
                        </div>
                        <div className="board-cell board-horizontal-border" onClick={() => handlePlay(5)}>
                            <div>{gameState.board[5]}</div>
                        </div>
                        <div className="board-cell" onClick={() => handlePlay(6)}>
                            <div>{gameState.board[6]}</div>
                        </div>
                        <div className="board-cell board-vertical-border" onClick={() => handlePlay(7)}>
                            <div>{gameState.board[7]}</div>
                        </div>
                        <div className="board-cell" onClick={() => handlePlay(8)}>
                            <div>{gameState.board[8]}</div>
                        </div>
                    </div>
                </div>
            </div>
            {resultContainerOpened && (<div id="game-result-container">
                <h1>{gameResultMessage}</h1>
                <button onClick={() => { 
                    setResultContainerOpened(false);
                    setShowPlayers(false);
                    getLoggedUser();
                }}>FECHAR</button>
            </div>)}
        </div>
    );
};