import React, { useState } from 'react';
import styles from './styles/DateTimeInput.module.css';
import arrow from '../assets/events/arrow.png';

const DateTimeInput = ({ eventData, setEventData, dateError, setDateError }) => {
    const timeSlots = generateTimeSlots();

    const handleChange = (field, value) => {
        setEventData((prev) => ({
          ...prev,
          dateAndTime: { ...prev.dateAndTime, [field]: value },
        }));
      };

  return (
    <div className={styles.container}>
      <label>Date and time <span>*</span></label>
      <div className={styles.inputWrapper}>
        <input className={styles.dateInput} type="date" value={eventData.dateAndTime.date} name='date' required 
        onChange={(e) => {
            handleChange('date', e.target.value);
            e.target.value? setDateError(false) : setDateError(true)
            }}
            style={{border: dateError? '1.5px solid red' : '1.5px solid #E0E0E0'}}/>

        <div className={`${styles.selectWrapper} ${styles.timeContainer}`}>
            <select name="time" value={eventData.dateAndTime.time} 
              onChange={(e) => handleChange('time', e.target.value)}>
                {timeSlots.map((timeSlot, index) => (
                    <option key={index} value={timeSlot}>{timeSlot}</option>
                ))}
            </select>
            {/* <span>
                <img src={arrow} alt="" />
            </span> */}
        </div>

        <div className={`${styles.selectWrapper} ${styles.ampmContainer}`}>
            <select name="ampm" value={eventData.dateAndTime.ampm}
            onChange={(e) => handleChange('ampm', e.target.value)}>
                <option value="am">am</option>
                <option value="pm">pm</option>
            </select>
            {/* <span>
                <img src={arrow} alt="" />
            </span> */}
        </div>

        <div className={`${styles.timezoneContainer}`}>
            <select name="timezone" value={eventData.dateAndTime.timezone}
            onChange={(e) => handleChange("timezone", e.target.value)}>
                <option value={`${eventData.dateAndTime.timezone}`}>{eventData.dateAndTime.timezone}</option>
            </select>
            {/* <span>
                <img src={arrow} alt="" />
            </span> */}
        </div>
      </div>
    </div>
  )
}

const generateTimeSlots = () => {
    const times = [];
    for (let hour = 12; hour >= 1; hour--) {
      times.push(`${hour}:00`);
      times.push(`${hour}:30`);
    }
    return times;
  };    

export default DateTimeInput
