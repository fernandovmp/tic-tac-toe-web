import React, { Component } from 'react';
import Board from './Board';
import PlayerCard from './PlayerCard';
import api from '../../services/api';
import './TicTacToe.css';

const board = ['', '', '', '', '', '', '', '', ''];

const resultMessages = {
    won: 'Você ganhou!',
    tied: 'Empate',
    lost: 'Você perdeu!'
}


class TicTacToe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPlayers: false,
            gameState: {
                board
            },
            opponent: {
                
            }
        }
    }
    
    componentDidMount() {
        this.props.onRef(this);
    }
    
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.socket !== this.props.socket) {
            this.props.socket.on('startPlay', startState => {
                this.setState({ gameState: startState });
                this.setState({ showPlayers: true });
                this.getOpponent(startState.players.find(item => item !== this.props.user._id));
                this.props.socket.on('makePlay', this.handleMakePlay);
            });

        }
    }
    
    resetGame = () => {
        this.setState({ gameState: { board }, showPlayers: false, opponent: { } });
    }
    
    getOpponent = async opponentId => {
        const response = await api.get(`/users/${opponentId}`);
        this.setState({ opponent: response.data });
    }
    
    startPlay = async inviteId => {
        this.props.socket.emit('startPlay', inviteId);
        this.props.socket.on('makePlay', this.handleMakePlay);
    }
    
    handlePlay = async index => {
        const { gameState } = this.state;
        if (gameState.players[gameState.currentSymbol] !== this.props.user._id) {
            return;
        }
        if (gameState.board[index] !== '') {
            return;
        }
        gameState.board[index] = gameState.symbols[gameState.currentSymbol];
        this.props.socket.emit('makePlay', gameState);
    }
    
    handleMakePlay = async newState => {
        this.setState({ gameState: newState });
        let resultMessage = '';
        if (newState.matchState.end) {
            let requestData = {};
            if (newState.matchState.result === this.props.user._id) {
                requestData = {
                    wonMatches: this.props.user.wonMatches + 1
                };
                resultMessage = resultMessages.won;
            }
            else if (newState.matchState.result === 'tied') {
                requestData = {
                    tiedMatches: this.props.user.tiedMatches + 1
                };
                resultMessage = resultMessages.tied;
            }
            else {
                requestData = {
                    lostMatches: this.props.user.lostMatches + 1
                };
                resultMessage = resultMessages.lost;
            }
            await api.patch(`/users/${this.props.user._id}`, requestData);
            this.props.onEndMatch(resultMessage);
        }

    }
    
    render() {
        const { gameState, opponent } = this.state;
        const { currentSymbol } = gameState;
        const { user } = this.props;
        const isPlayer1Turn = gameState.players && gameState.players[currentSymbol] === user._id;
        const isPlayer2Turn = gameState.players && gameState.players[currentSymbol] === opponent._id;
        return (
            <div className="game">
                {this.state.showPlayers && (
                <div className="game-players">
                        <PlayerCard activeTurn={isPlayer1Turn} playerInfo={user}/>
                        <PlayerCard activeTurn={isPlayer2Turn} playerInfo={opponent}/>
                </div>)}
                <Board gameState={gameState} handlePlay={this.handlePlay} />
            </div>
        );
    }
}

export default TicTacToe;