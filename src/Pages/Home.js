import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import './Home.css';
import api from '../services/api';
import InviteIcon from '../assets/account-plus.svg'
import NotificationIcon from '../assets/bell-outline.svg';
import AcceptInvite from '../assets/email.svg';

export default function Home({ history }) {
    
    const [loggedUser, setLoggedUser] = useState({});
    const [searchUsername, setSearchUsername] = useState('');
    const [menuOpened, setMenuOpened] = useState(false);
    const [users, setUsers] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [invites, setInvites] = useState([]);
    const [auth, setAuth] = useState(true);
    
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
    
    useEffect(() => isAuthorized(), []);
    
    useEffect(handleUserSearch, [searchUsername]);
    
    function handleMenuClick() {
        setMenuOpened(!menuOpened);
    }
    
    function handleUserSearch() {
        if(searchUsername.trim()  === '') {
            setSearchResult([]);
            return;
        }
        setSearchResult(users.filter(user => user.username.includes(searchUsername.trim())));
    }
    
    async function handleInvite(targetId) {
        const response = await api.post(`/users/${targetId}/invites`);
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
                    <button id="notification-btn">
                        <img src={NotificationIcon} alt=""/>
                    </button>
                    <div className="notification-content">
                        { invites.map( invite => (
                            <div className="invite-container">
                                <strong className="invite-header">Você recebeu um convite!</strong>
                                <div>
                                    <p>{invite.sender.username} convidou você para uma partida!</p>
                                    <button><img src={AcceptInvite} alt="Aceitar convite"/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </header>
            { menuOpened ? <div className="menu">
                <input placeholder="Usuário" value={searchUsername} onChange={e => setSearchUsername(e.target.value)}/>
                <div className="search-result-container">
                    {searchResult.length > 0 ?
                        (<ul>
                            {searchResult.map(result => (
                                <li key={result._id} className="search-result-item">
                                    <p>{result.username}</p>
                                    <img src={InviteIcon} alt="Convidar" onClick={() => {
                                        handleInvite(result._id);
                                    }}/>
                                </li>
                            ))}
                        </ul>)
                        : null}
                </div>
                    
            </div> : null}
        </div>
    );
};