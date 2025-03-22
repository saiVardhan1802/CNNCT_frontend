import React, { useState } from 'react';
import styles from './styles/DateTimeInput.module.css';
import arrow from '../assets/events/arrow.png';

const DateTimeInput = ({ eventData, setEventData }) => {
    const timeSlots = generateTimeSlots();
    const [dateError, setDateError] = useState(false)

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
        <input type="date" value={eventData.dateAndTime.date} name='date' required 
        onChange={(e) => {
            handleChange('date', e.target.value);
            length(e.target.value)===10? setDateError(false) : setDateError(true)
            }}
            style={{border: dateError? '1.5px solid red' : '1.5px solid #E0E0E0'}}/>

        <div className={styles.selectWrapper}>
            <select name="time" value={eventData.dateAndTime.time}>
                {timeSlots.map((timeSlot, index) => (
                    <option key={index} value={timeSlot}>{timeSlot}</option>
                ))}
            </select>
            <span>
                <img src={arrow} alt="" />
            </span>
        </div>

        <div className={styles.selectWrapper}>
            <select name="ampm" value={eventData.dateAndTime.ampm}
            onChange={(e) => handleChange('ampm', e.target.value)}>
                <option value="am">AM</option>
                <option value="pm">pm</option>
            </select>
            <span>
                <img src={arrow} alt="" />
            </span>
        </div>

        <div className={styles.selectWrapper}>
            <select name="timezone" value={eventData.dateAndTime.timezone}
            onChange={(e) => handleChange("timezone", e.target.value)}>
                <option value={`${eventData.dateAndTime.timezone}`}>{eventData.dateAndTime.timezone}</option>
            </select>
            <span>
                <img src={arrow} alt="" />
            </span>
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
