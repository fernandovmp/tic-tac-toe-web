import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import './Home.css';
import api from '../services/api';
import io from 'socket.io-client';
import UserMenu from '../components/UserMenu';
import NotificationBox from '../components/NotificationBox';
import TicTacToe from '../components/tic-tac-toe/TicTacToe';
import MatchResult from '../components/tic-tac-toe/MatchResult';

export default function Home({ history }) {
    
    const [loggedUser, setLoggedUser] = useState({});
    const [menuOpened, setMenuOpened] = useState(false);
    const [users, setUsers] = useState([]);
    const [auth, setAuth] = useState(true);
    const [socket, setSocket] = useState(null);
    const [ticTacToe, setTicTacToe] = useState(null);
    const [matchResult, setMatchResult] = useState(null);
    
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
                        matchResult.showResult(resultMessage);
                    }}
                />
            </div>
            <MatchResult onRef={ref => setMatchResult(ref)}
                onClose={() => {
                   ticTacToe.resetGame();
                   getLoggedUser(); 
                }}
            />
        </div>
    );
};