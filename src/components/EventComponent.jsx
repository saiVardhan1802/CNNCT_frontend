import React, { useEffect, useState } from 'react';
import styles from './styles/EventComponent.module.css';
import { RxCopy } from "react-icons/rx";
import { PiTrashThin } from "react-icons/pi";
import { BiEditAlt } from "react-icons/bi";
import { convertUTCToLocalStrings, getEndTime } from '../pages/Booking';
import { getUserTimezone } from '../pages/Events';
import toast from 'react-hot-toast';
import { DeleteEvent } from '../services';
import errorIcon from '../assets/events/error.svg'; 
import { hasConflict } from '../services/TimeConversionFunctions';
export const API_URL = import.meta.env.VITE_API_URL;

const EventComponent = ({ event, upcomingEvents, setUpcomingEvents, index, eventData, setEventData, setIsModal }) => {
    const { date, day, time: startTime } = convertUTCToLocalStrings(event.dateTime);
    const endTime = getEndTime(event.dateTime, event.duration);
    const duration = convertDurationToString(event.duration);
    const [isActive, setIsActive] = useState(true);
    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');
    const [inConflict, setInConflict] = useState(false);

    useEffect(() => {
        if (event) {
            if (event.hostId === userId) {
                setIsActive(event.hostActive);
            } else {
                const invitee = event.invitations.find(inv => inv.email === userEmail);
                if (invitee) {
                    setIsActive(invitee.active);
                }
            }
        }
    }, [event]);

    useEffect(() => {
        const eventStartTime = new Date(event.dateTime);
        const eventEndTime = new Date(eventStartTime.getTime() + event.duration * 60000); // Convert minutes to ms
    
        let conflictFound = false;
    
        for (const upcomingEvent of upcomingEvents) {
            if (upcomingEvent._id === event._id) continue; // Skip the current event
    
            const upcomingStartTime = new Date(upcomingEvent.dateTime);
            const upcomingEndTime = new Date(upcomingStartTime.getTime() + upcomingEvent.duration * 60000);
    
            // Check if times overlap
            if (eventStartTime < upcomingEndTime && eventEndTime > upcomingStartTime) {
                conflictFound = true;
                break;
            }
        }
    
        setInConflict(conflictFound);
    }, [event, upcomingEvents]);

    function EditEvent(e, event) {
        try {
            e.preventDefault();
            if (event.hostId !== userId) {
                toast.error("You are not authorized to edit this meeting.");
                return;
            }
            console.log("Before click: ", eventData)
            setEventData({
                eventId: event._id,
                eventTopic: event.eventTopic,
                password: event.password,
                description: event.description,
                dateAndTime: {
                    date: event.dateTime.split("T")[0],
                    time: startTime.split(" ")[0],
                    ampm: startTime.split(" ")[1],
                    timezone: getUserTimezone() 
                },
                duration: stringifyDurationForEventData(event.duration),
                backgroundColor: event.backgroundColor,
                addLink: event.link,
                addEmails: event.inviteeEmails.join(", ")
            });
            
            setIsModal(true);
        } catch (error) {
            console.log("Error in editing event: ", error);
        }
    }
    async function UpdateActiveStatus() {
        try {
            const updatedStatus = !isActive;

            const updateData = event.hostId === userId
                ? { hostActive: updatedStatus }
                : { invitations: event.invitations.map(inv =>
                    inv.email === userEmail ? { ...inv, active: updatedStatus } : inv
                  ) 
                };

            const response = await fetch(`${API_URL}/api/meeting/${event._id}/toggle-active`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ updates: updateData })
            });

            if (!response.ok) throw new Error("Failed to update active status");

            setIsActive(updatedStatus);
            toast.success(`Event marked as ${updatedStatus ? "active" : "inactive"}`);
        } catch (error) {
            console.error("Error updating active status:", error);
            toast.error("Something went wrong.");
        }
    }

    async function HandleDelete() {
        try {
            const response = await DeleteEvent(event._id, token, userEmail, userId);
            setUpcomingEvents(prevEvents => prevEvents.filter(ev => ev._id !== event._id));
            if (!response.ok) {
                toast.error("Failed to delete the event. Please try again.")
                return
            }
            toast.success("Event deleted successfully.");
        } catch (error) {
            toast.error("Failed deleting the event. Please try again.")
            console.error("Error while handling delete event: ", error)
        }
    }

    function HandleCopy() {
        navigator.clipboard.writeText(event.link)
        .then(() => toast.success("Event link copied."))
        .catch(() => toast.error("Failed to copy event link."));
    }

    return (
        <div className={styles.container}>
            <div style={{
                backgroundColor: isActive? '#1877F2' : '#676767'
            }} className={styles.header}></div>
            <div className={styles.content}>
                <div className={styles.editWrapper}>
                    <p className={styles.title}>{event.eventTopic}</p>
                    <BiEditAlt onClick={(e) => EditEvent(e, event)} className={styles.icon} />
                </div>
                <p className={styles.date}>{day}, {date}</p>
                <p className={styles.time}>{startTime.toLowerCase()} - {endTime.toLowerCase()}</p>
                <p className={styles.duration}>{duration}, Group meeting</p>
            </div>
            <hr />
            <div className={styles.footer}>
                <label className={styles.toggleSwitch}>
                    <input
                        type="checkbox"
                        checked={!isActive}
                        onChange={UpdateActiveStatus}
                    />
                    <span className={styles.slider}></span>
                </label>
                <RxCopy onClick={HandleCopy} className={styles.icon} />
                <PiTrashThin onClick={HandleDelete} className={styles.icon} />
            </div>
            <div style={{display: inConflict? 'inline' : 'none'}} className={styles.errorBox}>
                <div>
                    <img src={errorIcon} alt="" />
                    <p>Conflict of timing</p>
                </div>
            </div>
        </div>
    )
}



export default EventComponent;

function convertDurationToString(duration) {
    if (duration < 60) {
        return `${duration}mins`;
    }

    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    return minutes > 0 ? `${hours}hr ${minutes}mins` : `${hours}hr`;
}

function stringifyDurationForEventData(duration) {
    if (duration < 60) {
        return `${duration} mins`;
    }

    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    return minutes > 0 ? `${hours} hour ${minutes} mins` : `${hours} hour`;
}

