import React, { useState } from 'react';
import './Login.css';
import api from '../services/api';
import Cookies from 'universal-cookie';

export default function Login({ history }) {
    
    const cookies = new Cookies();
    const [createAccount, setCreateAccount] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    async function handleLogin(e) {
        e.preventDefault();
        try {
            if (createAccount) {

                if (password !== confirmPassword) {
                    throw new Error('passwords doesn\'t match');
                }
                const { userAlreadyExists } = await api.post('/users', {
                    username,
                    password
                });
                if(userAlreadyExists) {
                    throw new Error('user already exists');
                }
            }
            const response = await api.post('/login', {
                username,
                password
            });
            if(response.status === 401) {
                throw new Error('bad credentials');
            }
            cookies.set('access-token', response.headers['set-cookie']);
            history.push('/');
        } catch (error) {
            
        }
        
    }
    
    return (
        <div className="login-container">
            <form onSubmit={handleLogin}>    
                <input placeholder="Nome de usuario"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input placeholder="Senha" type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                {createAccount && (
                    <input placeholder="Confirmar senha" type="password" 
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                )
                }
                <button type="submit">Entrar</button>
                <p onClick={() => {
                    setCreateAccount(!createAccount);
                }}>{createAccount ? 'Tenho uma conta' : 'Não tem uma conta?'}</p >
            </form>
        </div>
    );
};