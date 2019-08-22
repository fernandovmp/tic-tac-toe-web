import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import './Home.css';
import api from '../services/api';
import InviteIcon from '../assets/account-plus.svg'
import NotificationIcon from '../assets/bell-outline.svg';

export default function Home({ history }) {
    
    const [searchUsername, setSearchUsername] = useState('');
    const [menuOpened, setMenuOpened] = useState(false);
    const [users, setUsers] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [invites, setInvites] = useState([]);
    const [auth, setAuth] = useState(true);
    
    async function GetRegisteredUser() {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            setAuth(false);
        }
    }
    
    useEffect(() => {
        if(auth)
            GetRegisteredUser();
    }, [auth]);
    
    async function GetInvites() {
        try {
            const response = await api.get('/invites');
            setInvites(response.data);
        } catch (error) {
            //setAuth(false);
        }
        
    }
    useEffect(() => {
        GetInvites();
    }, []);
    
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
                    <button>
                        <img src={NotificationIcon} alt=""/>
                    </button>
                    <div className="notification-content">
                        { invites.map( invite => (
                            <div>
                                <p>{invite.sender.username} convidou você para uma partida!</p>
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