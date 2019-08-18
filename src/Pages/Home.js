import React, { useState, useEffect } from 'react';
import './Home.css';
import api from '../services/api';
import InviteIcon from '../assets/account-plus.svg'
export default function Home() {
    
    const [searchUsername, setSearchUsername] = useState('');
    const [menuOpened, setMenuOpened] = useState(false);
    const [users, setUsers] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    
    async function GetRegisteredUser() {
        const response = await api.get('/users');
        setUsers(response.data);
    }
    
    useEffect(() => {
        GetRegisteredUser();
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
        console.log(targetId);
    }
    
    return (
        
        <div className="page-container">
            <header className="page-header">
                <div className="menu-icon" onClick={handleMenuClick}>
                    <div></div>
                    <div></div>
                    <div></div>
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