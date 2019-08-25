import React, { Component } from 'react';
import './Login.css';
import api from '../services/api';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
class Login extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            createAccount: false,
            username: '',
            password: '',
            confirmPassword: ''
        }
    }
    
    handleLogin = async (e) => {
        e.preventDefault();
        const { createAccount, username, password, confirmPassword } = this.state;
        try {
            if (createAccount) {

                if (password !== confirmPassword) {
                    throw new Error('passwords doesn\'t match');
                }
                const { userAlreadyExists } = await api.post('/users', {
                    username,
                    password
                });
                if (userAlreadyExists) {
                    throw new Error('user already exists');
                }
            }
            const response = await api.post('/login', {
                username,
                password
            });
            if (response.status === 401) {
                throw new Error('bad credentials');
            }
            cookies.set('access-token', response.headers['set-cookie'], {
                secure: true,
            });
            this.props.history.push('/');
        } catch (error) {

        }

    }
    
    render() {
        return (
            <div className="login-container">
                <form onSubmit={this.handleLogin}>
                    <input placeholder="Nome de usuario"
                        value={this.state.username}
                        onChange={e => this.setState({ username: e.target.value })}
                    />
                    <input placeholder="Senha" type="password"
                        value={this.state.password}
                        onChange={e => this.setState({ password: e.target.value })}
                    />
                    {this.state.createAccount && (
                        <input placeholder="Confirmar senha" type="password"
                            value={this.state.confirmPassword}
                            onChange={e => this.setState({ confirmPassword: e.target.value })}
                        />
                    )
                    }
                    <button type="submit">Entrar</button>
                    <p onClick={() => {
                        this.setState({ createAccount: !this.state.createAccount });
                    }}>{this.state.createAccount ? 'Tenho uma conta' : 'Não tem uma conta?'}</p >
                </form>
            </div>
        );
    }
}

export default Login;
