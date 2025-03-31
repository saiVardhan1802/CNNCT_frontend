import React, { useEffect, useRef, useState } from 'react';
import styles from './styles/InviteeDisplay.module.css';
import acceptedIcon from '../assets/booking/acceptedIcon.png';
import rejectedIcon from '../assets/booking/rejectedIcon.png'
import profileImg from '../assets/navbar/profileImg.png'
import { PiTrashThin } from "react-icons/pi";
import { DeleteEvent, updateUserInvitationStatus } from '../services';
import toast from 'react-hot-toast';

const InviteeDisplay = ({ inviteeNames, activeTab, event, eventId, HandleStatus, setSelectedEventId }) => {
  // console.log(eventId);
    console.log(event);
    const userEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    console.log(userEmail);
  //   async function HandleStatus(e, eventId, userEmail) {
  //     try {
  //         e.preventDefault();
  //         const { name } = e.currentTarget; // Ensuring correct target
          
  //         const response = await updateUserInvitationStatus(userEmail, name, eventId, token);
  
  //         // Parsing response correctly
  //         const data = await response.json();
          
  //         if (!response.ok) {
  //             toast.error(data.message || "Something went wrong.");
  //             return;
  //         }
  
  //         toast.success(`Invitation ${name} successfully!`);
  //     } catch (error) {
  //         console.error("Error in handling status: ", error);
  //         toast.error("Something went wrong.");
  //     }
  // }

  const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
              setSelectedEventId(''); // Close when clicking outside
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function HandleDelete(eventId, token, userEmail, userId) {
      try {
        const response = await DeleteEvent(eventId, token, userEmail, userId)
        if (response.ok) {
          toast.success("Booking deleted successfully.");
        }
        else {
          toast.error("Failed to delete the booking.");
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to delete the booking.");
      }
    }

  return (
    <div ref={wrapperRef} className={styles.container}>
      <div className={styles.heading}>
        <p>Participants <span style={{color: '#B6B6B6'}}>({event.members})</span></p>
        <PiTrashThin onClick={() => HandleDelete(eventId, token, userEmail, userId)} style={{display: (activeTab==='upcoming'||activeTab==='past')? 'block' : 'none'}} className={styles.trashIcon} />
        <button style={{display: (activeTab==='upcoming'||activeTab==='past')? 'none' : 'flex'}} name='rejected' onClick={(e) => HandleStatus(e, eventId, userEmail)} className={styles.rejectedButton}>
            <img src={rejectedIcon} alt="" />
            {(activeTab==='pending'||activeTab==='past')? <p>Reject</p> : <p>Rejected</p>}
        </button>
        <button style={{display: (activeTab==='upcoming'||activeTab==='past')? 'none' : 'flex'}} name='accepted' onClick={(e) => HandleStatus(e, eventId, userEmail)} className={styles.acceptedButton}>
            <img src={acceptedIcon} alt="" />
            {(activeTab==='pending'||activeTab==='past')? <p>Accept</p> : <p>Accepted</p>}
        </button>
      </div>
      <div className={styles.membersList}>
        <div>
          <div className={styles.profile}>
            <img src={profileImg} alt="" />
            {event.hostName}
          </div>
          <input type="checkbox" checked={true} readOnly/>
        </div>
        {event.invitations.filter(invitation => invitation.status !== 'rejected').map((invitation, index) => (
            <div key={index}>
                <div className={styles.profile}>
                  <img src={profileImg} alt="" />
                  {invitation.name}
                </div>
                <input type="checkbox" checked={event.invitations[index]?.status==='accepted'? true : false} readOnly />
            </div>
        ))}
      </div>
    </div>
  )
}

export default InviteeDisplay;
