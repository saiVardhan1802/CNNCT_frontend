import React, { useState } from 'react';
import styles from './styles/BookingComponent.module.css';
import acceptedIcon from '../assets/booking/acceptedIcon.png';
import rejectedIcon from '../assets/booking/rejectedIcon.png';
import membersIcon from '../assets/booking/membersIcon.png';

const BookingComponent = ({ eventId, activeTab, event, HandleSelectedEvent, HandleStatus }) => {
    storeEventInLocalStorage(activeTab, event);
    const userEmail = localStorage.getItem('userEmail');
    let rightClass = {}
    let statusButtons = {};
    if (activeTab === 'upcoming') {
        rightClass = styles.upcomingStatus;
        statusButtons = styles.upcomingButtons;
    }
    else if (activeTab === 'pending') {
        rightClass = styles.pendingRight;
        statusButtons = styles.pendingButtons;
    }
    else if (activeTab === 'canceled') {
        rightClass = styles.canceledRight;
        statusButtons = styles.canceledButtons;
    }
    else {
        rightClass = styles.pastStatus;
        statusButtons = styles.pastButtons;
    }

  return (
    <div className={styles.container}>
      <div className={styles.leftInfo}>
        <div className={styles.dateTime}>
            <p className={styles.dayText}>{event.day}, {event.date}</p>
            <p className={styles.timeText}>{event.startTime} - {event.endTime}</p>
        </div>
        <div className={styles.eventTitle}>
            <div  className={styles.membersMobile}>
                <p className={styles.titleText}>{event.title}</p>
                <button style={{display: activeTab==='canceled'&&'none'}} onClick={HandleSelectedEvent}><img src={membersIcon} alt="" /><p>{event.members}</p></button>
            </div>
            <p className={styles.teamText}>You and team {event.members}</p>
        </div>
      </div>
      <div className={rightClass}>
        <div className={statusButtons}>
            <button name='accepted' 
                onClick={(e) => activeTab==='pending'||'canceled'? HandleStatus(e, eventId, userEmail) : null} 
                className={styles.acceptedButton}
                style={{
                    display:
                        activeTab === 'past' &&
                        ['pending', 'accepted'].includes(
                            event.invitations.find(inv => inv.email === userEmail)?.status
                        )
                            && 'flex'
                }}   
                >
                <img src={acceptedIcon} alt="" />
                <p>Accepted</p>
            </button>
            <button name='rejected' 
                onClick={(e) => activeTab==='pending'||'canceled'? HandleStatus(e, eventId, userEmail) : null} 
                className={styles.rejectedButton}
                style={{
                    display:
                        activeTab === 'past' &&
                        ['pending', 'rejected'].includes(
                            event.invitations.find(inv => inv.email === userEmail)?.status
                        )
                            && 'flex'
                }}                
                >
                <img src={rejectedIcon} alt="" />
                <p>Rejected</p>
            </button>
        </div>
        <div className={styles.membersLaptop} onClick={HandleSelectedEvent}>
            <img src={membersIcon} alt="" />
            <p>{event.members} members</p>
        </div>
      </div>
    </div>
  )
}

export default BookingComponent;

const storeEventInLocalStorage = (activeTab, newEvent) => {
    let key = "";

    if (activeTab === "upcoming") {
        key = "upcomingEvents";
    } else if (activeTab === "pending") {
        return;
    } else if (activeTab === "canceled") {
        return;
    } else {
        key = "pastEvents";
    }
    let events = JSON.parse(localStorage.getItem(key)) || [];
    events.push(newEvent);
    localStorage.setItem(key, JSON.stringify(events));
};
