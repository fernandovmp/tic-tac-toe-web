import React, { useState } from 'react';
import './Login.css';

export default function Login() {
    
    const [createAccount, setCreateAccount] = useState(false);
    
    async function handleLogin() {
        if(createAccount) {
            console.log('Create account');
            return;
        }
        console.log('loggin');
    }
    
    return (
        <div className="login-container">
            <form onSubmit={handleLogin}>    
                <input placeholder="Nome de usuario"/>
                <input placeholder="Senha" type="password" />
                {createAccount && (
                    <input placeholder="Confirmar senha" type="password" />
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