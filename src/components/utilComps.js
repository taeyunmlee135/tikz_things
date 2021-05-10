import React from 'react';
import './utilComps.css';

export const Toggle = ({ onSwitchOn, onSwitchOff, defaultVal=false }) => {
    const handleToggleChange = (e) => {
        if (e.target.checked) { onSwitchOn(); }
        else { onSwitchOff(); }
    }
    
    return (
        <label className="switch">
            <input type="checkbox" defaultChecked={defaultVal} onChange={(e) => handleToggleChange(e)} />
            <span className="slider round"></span>
        </label>
    );
}

export const CmdButton = ({ onClick, label }) => {
    return (
        <button 
            type="button"
            className="cmd-buttons"
            onClick={onClick}
        >
            {label}
        </button>
    )
}