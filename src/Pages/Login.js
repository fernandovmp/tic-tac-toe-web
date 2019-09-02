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
            confirmPassword: '',
            errorMessage: '',
            showErrorMessage: false
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
                const response = await api.post('/users', {
                    username,
                    password
                });
                if (response.data.userAlreadyExists) {
                    throw new Error('user already exists');
                }
            }
            const response = await api.post('/login', {
                username,
                password
            });
            cookies.set('access-token', response.headers['set-cookie'], {
                secure: true,
            });
            this.props.history.push('/');
        } catch (error) {
            let message;
            if (error.message === 'Request failed with status code 401') {
                message = 'Senha e/ou usuário inválido';
            }
            else if (error.message === 'passwords doesn\'t match') {
                message = 'As senhas informadas precisão ser iguais';
            }
            else if (error.message === 'user already exists') {
                message = 'Usuário já foi cadastrado';
            }
            this.setState({errorMessage: message, showErrorMessage: true})
        }

    }
    
    render() {
        return (
            <div className="login-container">
                <form onSubmit={this.handleLogin}>
                    { this.state.showErrorMessage && (
                    <p id="error-message">{this.state.errorMessage}</p>
                    ) }
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
                    <p id="login-toggle" onClick={() => {
                        this.setState({ createAccount: !this.state.createAccount });
                    }}>{this.state.createAccount ? 'Tenho uma conta' : 'Não tem uma conta?'}</p >
                </form>
            </div>
        );
    }
}

export default Login;
