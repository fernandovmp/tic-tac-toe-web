import React, { Component } from 'react';
import './MatchResult.css';

class MatchResult extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            opened: false,
            resultMessage: ''
        }
    }
    
    componentDidMount() {
        this.props.onRef(this);
    }
    
    showResult = resultMessage => {
        this.setState({ opened: true, resultMessage });
    }
    
    handleClose = () => {
        this.setState({ opened: false, resultMessage: '' });
        if(this.props.onClose) {
            this.props.onClose();
        }
    }
    
    render() {
        return (
            <div>
                {this.state.opened && (<div id="game-result-container">
                    <h1>{this.state.resultMessage}</h1>
                    <button onClick={this.handleClose}>FECHAR</button>
                </div>)}
            </div>
        );
    }
}

export default MatchResult;