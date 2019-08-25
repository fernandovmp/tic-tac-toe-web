import React, { Component } from 'react';
import api from '../services/api';
import InviteIcon from '../assets/account-plus.svg';
import './UserMenu.css';


class UserMenu extends Component {
    constructor (props) {
        super(props);
        this.state = {
            searchUsername: '',
            searchResult: []
        }
    }
    
    componentDidUpdate(prevProps, prevState) {
        if(prevState.searchUsername !== this.state.searchUsername) {
            this.handleUserSearch();
        }
    }
    
    handleUserSearch = () => {
        if (this.state.searchUsername.trim() === '') {
            this.setState({ searchResult: []});
            return;
        }
        this.setState({ 
            searchResult: this.props.searchBase.filter(
            result => result.username.includes(this.state.searchUsername.trim()) && 
                                                result._id !== this.props.user._id)
        });
    }
    
    handleInvite = async targetId => {
        await api.post(`/users/${targetId}/invites`);
    }
    
    render() {
        return (
        <div className={`menu ${this.props.opened ? '' : 'menu-hidden'}`}>
                <div className="user-statistics-container">
                    <div className="user-statistics-username">
                        <h2>{this.props.user.username}</h2>
                    </div>
                    <div className="user-statistics-content">
                        <h1>{this.props.user.wonMatches}</h1>
                        <p>Vitórias</p>
                    </div>
                    <div className="user-statistics-content">
                        <h1>{this.props.user.tiedMatches}</h1>
                        <p>Empates</p>
                    </div>
                    <div className="user-statistics-content">
                        <h1>{this.props.user.lostMatches}</h1>
                        <p>Derrotas</p>
                    </div>
                </div>
                <input placeholder="Usuário" value={this.state.searchUsername} 
                    onChange={e => this.setState({searchUsername: e.target.value})} 
                />
                <div className="search-result-container">
                    {this.state.searchResult.length > 0 ?
                        (<ul>
                        {this.state.searchResult.map(result => (
                                <li key={result._id} className="search-result-item">
                                    <p>{result.username}</p>
                                    <img src={InviteIcon} alt="Convidar" onClick={() => {
                                        this.handleInvite(result._id);
                                    }} />
                                </li>
                            ))}
                        </ul>)
                        : null}
                </div>
        </div>);
    }
}

export default UserMenu;