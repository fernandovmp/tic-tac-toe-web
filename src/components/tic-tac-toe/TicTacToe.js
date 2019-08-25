import React, { Component } from 'react';
import Board from './Board';
import PlayerCard from './PlayerCard';
import api from '../../services/api';
import './TicTacToe.css';

const board = ['', '', '', '', '', '', '', '', ''];
const symbols = ['X', 'O'];
const winningSequences = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
const defaultGameState = {
    board,
    currentSymbol: -1,
    players: [],
    matchState: {
        end: false,
        result: ''
    }
}
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
            gameState: defaultGameState,
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
                this.getOpponent(startState.players[1]);
                this.props.socket.on('makePlay', this.handleMakePlay);
            });

        }
    }
    
    resetGame = () => {
        this.setState({ gameState: defaultGameState, showPlayers: false, opponent: { } });
    }
    
    checkWinningSequence = symbol => {
        for (let i in winningSequences) {
            if (this.state.gameState.board[winningSequences[i][0]] === symbol &&
                this.state.gameState.board[winningSequences[i][1]] === symbol &&
                this.state.gameState.board[winningSequences[i][2]] === symbol) {
                return true;
            }
        }
        return false;
    }
    
    getOpponent = async opponentId => {
        const response = await api.get(`/users/${opponentId}`);
        this.setState({ opponent: response.data });
    }
    
    startPlay = async opponentUser => {
        const defaultState = {
            board,
            currentSymbol: 0,
            players: [opponentUser._id, this.props.user._id],
            matchState: {
                end: false,
                result: ''
            }
        };
        this.setState({ gameState: defaultState });
        this.setState({ showPlayers: true });
        this.setState({ opponent: opponentUser });
        this.props.socket.emit('startPlay', defaultState);
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
        gameState.board[index] = symbols[gameState.currentSymbol];
        if (this.checkWinningSequence(symbols[gameState.currentSymbol])) {
            gameState.matchState = {
                end: true,
                result: symbols[gameState.currentSymbol]
            }
        }
        if (gameState.board.indexOf('') === -1) {
            gameState.matchState = {
                end: true,
                result: 'tied'
            }
        }
        gameState.currentSymbol = gameState.currentSymbol === 0 ? 1 : 0;
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
        const { currentSymbol } = this.state.gameState;
        const { user } = this.props;
        const { opponent } = this.state;
        const isPlayer1Turn = this.state.gameState.players[currentSymbol] === user._id;
        const isPlayer2Turn = this.state.gameState.players[currentSymbol] === opponent._id;
        return (
            <div className="game">
                {this.state.showPlayers && (
                <div className="game-players">
                        <PlayerCard activeTurn={isPlayer1Turn} playerInfo={user}/>
                        <PlayerCard activeTurn={isPlayer2Turn} playerInfo={opponent}/>
                </div>)}
                <Board gameState={this.state.gameState} handlePlay={this.handlePlay} />
            </div>
        );
    }
}

export default TicTacToe;