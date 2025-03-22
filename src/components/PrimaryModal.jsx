import React, { useState } from 'react';
import arrow from '../assets/events/arrow.png';
import DateTimeInput from './DateTimeInput';
import styles from './styles/PrimaryModal.module.css'

const PrimaryModal = ({ eventData, setEventData, HandleTextInput, name, setIsModal, setIsNextModal}) => {
    const [eventTopicError, setEventTopicError] = useState(false)
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
                        <select name="hostName" id="hostName" value={eventData.hostName} onChange={{}}>
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
                <DateTimeInput eventData={eventData} setEventData={setEventData} />
                <div className={styles.selectWrapper}>
                    <label htmlFor="duration">Set duration</label>
                    <div>
                        <div className={styles.pseudoSelector}>
                            <select name="duration" id="duration">
                                <option value="1">1 hour</option>
                                <option value="2">2 hour</option>
                                <option value="3">3 hour</option>
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
                    <button className={styles.saveButton}
                        onClick={() => setIsNextModal(true)}
                    >Save</button>
                </div>
            </div>
        </div>
    )
}

export default PrimaryModal
