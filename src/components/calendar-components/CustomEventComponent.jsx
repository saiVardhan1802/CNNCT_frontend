import React from 'react';
// import styles from './styles/CustomEventComponent.css'

const CustomEventComponent = ({ event }) => {
    console.log("CustomEvent rendered for:", event.title);
    return (
        <div style={{ 
          backgroundColor: hexToRGBA(event.backgroundColor) || "#3b82f6", 
          color: `#${event.backgroundColor}`,
          borderRadius: "0.5rem",
          fontSize: "14px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: '100%',
          height: '100%',
          display: 'flex',
        }}>
            <div style={{
                width: '5%',
                height: '100%',
                backgroundColor: `#${event.backgroundColor}`,
            }}></div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1em',
            margin: '5px'
          }}>
              <p style={{ margin: 0, fontSize: '1.2rem' }}>
                {event.start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
              </p>
              <strong>{event.title}</strong>
          </div>
        </div>
      );    
}

export default CustomEventComponent;

const hexToRGBA = (hex, alpha = 0.2) => {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`; // Converts hex to RGBA with given alpha
  };  
