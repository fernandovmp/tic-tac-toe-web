import React, { Component } from 'react';
import './PlayerCard.css';

class PlayerCard extends Component {
    
    render() {
        return (
            <div
                className={`player ${this.props.activeTurn ? 'player-turn' : ''}`}>
                <p>{this.props.playerInfo.username}</p>
            </div>
        );
    }
}

export default PlayerCard;