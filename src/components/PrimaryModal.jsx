import React, { useState } from 'react';
import arrow from '../assets/events/arrow.png';
import DateTimeInput from './DateTimeInput';
import styles from './styles/PrimaryModal.module.css'
import toast from 'react-hot-toast';
import { getUser } from '../services';
import { convertUTCToLocalStrings, getEndTime } from '../pages/Booking';
import { convertDurationToMinutes, hasConflict } from '../services/TimeConversionFunctions';

const PrimaryModal = ({ eventData, setEventData, HandleTextInput, name, setIsModal, setIsNextModal}) => {
    const [eventTopicError, setEventTopicError] = useState(false);
    const [dateError, setDateError] = useState(false);
    const token = localStorage.getItem('token');

    function HandleSelectInput(e) {
        const { name, value } = e.target;
        setEventData((prev) => ({
            ...prev, [name] : value
        }))
    }

    async function HandleSave(e) {
        try {
            e.preventDefault();
            if (!eventData.eventTopic) {
                setEventTopicError(true);
                toast.error("Please enter Event Topic.");
                return;
            }
    
            for (const [key, value] of Object.entries(eventData.dateAndTime)) {
                if (!value) {
                    if (key === 'date') {
                        console.log("date:", eventData.dateAndTime.date);
                        setDateError(true);
                    }
                    toast.error(`Please enter valid ${key}.`);
                    return;
                }
            }
    
            const { date, time, ampm } = eventData.dateAndTime;
            const selectedDateTime = new Date(`${date} ${time} ${ampm}`);
            const now = new Date();
    
            if (selectedDateTime <= now) {
                toast.error("You can only set up events for the future.");
                return;
            }
    
            const user = await getUser(token);
            console.log("User unavailability: ", user.unavailability);
            const { day } = convertUTCToLocalStrings(eventData.dateAndTime.date);
            const slicedDay = day.slice(0, 3);
    
            let isUnavailable = false;
    
            for (const dayObj of user.unavailability) {
                if (dayObj.day === slicedDay) {
                    if (dayObj.isUnavailable) {
                        toast.error(`You are unavailable on ${day}`);
                        isUnavailable = true;
                        break;
                    } else {
                        const hasSlotConflict = dayObj.slots.some((slot) => {
                            const eventStart = `${eventData.dateAndTime.time} ${eventData.dateAndTime.ampm}`;
                            const eventEnd = getEndTimeFromString(eventStart, convertDurationToMinutes(eventData.duration));
    
                            console.log("Checking conflict:", eventStart, eventEnd, slot.startTime, slot.endTime);
                            
                            if (hasConflict(eventStart, eventEnd, slot.startTime, slot.endTime)) {
                                toast.error("You are unavailable during this time");
                                return true; // Stops execution of `.some()`
                            }
                            return false;
                        });
    
                        if (hasSlotConflict) {
                            isUnavailable = true;
                            break;
                        }
                    }
                }
            }
    
            if (isUnavailable) return; // Stops execution and prevents moving to the next modal
    
            setIsNextModal(true);
            toast.success("Please fill the remaining event details.");
        } catch (error) {
            toast.error("Something went wrong.");
            console.log("Caught error:", error);
            throw error;
        }
    }
    
    return (
        <div className={styles.formContainer}>
            <div className={styles.wrapper}>
                <div className={styles.inputWrapper}>
                    <label htmlFor="event-topic">Event Topic <span>*</span></label>
                    <input type="text"
                        name='eventTopic'
                        id='event-topic'
                        placeholder='Set a conference topic before it starts'
                        value={eventData.eventTopic? eventData.eventTopic : ''}
                        onChange={(e) => {
                            HandleTextInput(e);
                            e.target.value? setEventTopicError(false) : setEventTopicError(true)
                        }}
                        style={{border: eventTopicError? '1.5px solid red' : '1.5px solid #E0E0E0'}}
                        required />
                </div>
                <div className={styles.inputWrapper}>
                    <label htmlFor="password">Password</label>
                    <input type="text"
                        name='password'
                        id='password'
                        placeholder='password'
                        value={eventData.password}
                        onChange={HandleTextInput} />
                </div>
                <div className={styles.selectWrapper}>
                    <label htmlFor="hostName">Host name <span>*</span></label>
                    <div className={styles.hostNameSelector}>
                        <select name="hostName" id="hostName" value={eventData.hostName} onChange={HandleSelectInput}>
                            <option value={name}>{name}</option>
                        </select>
                        <span>
                            <img src={arrow} alt="" />
                        </span>
                    </div>
                </div>
                <div className={styles.textareaWrapper}>
                    <label htmlFor="description">Description</label>
                    <textarea name="description" id="description" value={eventData.description} onChange={HandleTextInput}></textarea>
                </div>
            </div>
            <hr style={{ marginTop: '0.5em' }} />
            <div className={styles.timeWrapper}>
                <DateTimeInput eventData={eventData} 
                    setEventData={setEventData}
                    dateError={dateError}
                    setDateError={setDateError} />
                <div className={styles.selectWrapper}>
                    <label htmlFor="duration">Set duration</label>
                    <div>
                        <div className={styles.pseudoSelector}>
                            <select name="duration" id="duration" value={eventData.duration} onChange={HandleSelectInput}>
                                <option value="1 hour">1 hour</option>
                                <option value="2 hour">2 hour</option>
                                <option value="3 hour">3 hour</option>
                            </select>
                            <span>
                                <img src={arrow} alt="" />
                            </span>
                        </div>
                    </div>
                </div>
                <div className={styles.generalFormButton}>
                    <button className={styles.cancelButton}
                        onClick={() => setIsModal(false)}
                    >Cancel</button>
                    <button type='submit' className={styles.saveButton}
                        onClick={HandleSave}
                    >Save</button>
                </div>
            </div>
        </div>
    )
}

export default PrimaryModal;

function getEndTimeFromString(startTime, durationInMinutes) {
    console.log("Start time: ", startTime);
    console.log("Duration: ", durationInMinutes);

    // Parse input time
    const [time, ampm] = startTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    // Convert 12-hour format to 24-hour format
    if (ampm.toLowerCase() === "pm" && hours !== 12) {
        hours += 12;
    }
    if (ampm.toLowerCase() === "am" && hours === 12) {
        hours = 0;
    }

    // Create a new Date object for today
    const now = new Date();
    now.setHours(hours, minutes, 0, 0); // Set start time

    // Add duration
    const endDate = new Date(now.getTime() + durationInMinutes * 60000); // Convert min → ms

    // Format end time in 12-hour format
    const localEndTimeString = endDate.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    return localEndTimeString;
}
