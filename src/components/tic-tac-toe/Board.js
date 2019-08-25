import React, { Component } from 'react';
import './Board.css';

class Board extends Component {
    
    render() {
        return (
            <div className="board">
                <div className="board-cell" onClick={() => this.props.handlePlay(0)}>
                    <div>{this.props.gameState.board[0]}</div>
                </div>
                <div className="board-cell board-vertical-border" onClick={() => this.props.handlePlay(1)}>
                    <div>{this.props.gameState.board[1]}</div>
                </div>
                <div className="board-cell" onClick={() => this.props.handlePlay(2)}>
                    <div>{this.props.gameState.board[2]}</div>
                </div>
                <div className="board-cell board-horizontal-border" onClick={() => this.props.handlePlay(3)}>
                    <div>{this.props.gameState.board[3]}</div>
                </div>
                <div className="board-cell board-vertical-border board-horizontal-border"
                    onClick={() => this.props.handlePlay(4)}
                >
                    <div>{this.props.gameState.board[4]}</div>
                </div>
                <div className="board-cell board-horizontal-border" onClick={() => this.props.handlePlay(5)}>
                    <div>{this.props.gameState.board[5]}</div>
                </div>
                <div className="board-cell" onClick={() => this.props.handlePlay(6)}>
                    <div>{this.props.gameState.board[6]}</div>
                </div>
                <div className="board-cell board-vertical-border" onClick={() => this.props.handlePlay(7)}>
                    <div>{this.props.gameState.board[7]}</div>
                </div>
                <div className="board-cell" onClick={() => this.props.handlePlay(8)}>
                    <div>{this.props.gameState.board[8]}</div>
                </div>
            </div>
        );
    }
}

export default Board;