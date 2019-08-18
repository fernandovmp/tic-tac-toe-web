import React, { useState } from 'react';
import './Home.css';

export default function Home() {
    

    const [menuOpened, setMenuOpened] = useState(false);
    
    function handleMenuClick() {
        setMenuOpened(!menuOpened);
    }
    
    return (
        
        <div className="page-container">
            <header className="page-header">
                <div className="menu-icon" onClick={handleMenuClick}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </header>
            { menuOpened ? <div className="menu">
                
            </div> : null}
        </div>
    );
};