import React from 'react';
import styles from './styles/AvailabilityComponent.module.css';
import copyIcon from '../assets/availability/copyIcon.svg';
import addIcon from '../assets/availability/addIcon.svg';
import CalendarView from './CalendarView';

const AvailabilityComponent = ({ unavailability, setUnavailability, isAvailability }) => {
    function handleTimeInput(e, dayObj, idx) {
        const { name, value } = e.target;
        const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i;
    
        setUnavailability((prev) =>
            prev.map((item) =>
                item.day === dayObj.day
                    ? {
                          ...item,
                          slots: item.slots.map((s, index) =>
                              index === idx
                                  ? {
                                        ...s,
                                        [name]: value, 
                                        [`${name}Error`]: value !== "" && !timeRegex.test(value),
                                    }
                                  : s
                          ),
                      }
                    : item
            )
        );
    }
    
    
    function RemoveInput(dayObj, idx) {
        setUnavailability((prev) =>
            prev.map((item) =>
                item.day === dayObj.day
                    ? {
                        ...item,
                        slots: item.slots.filter((_, index) => index !== idx) // ✅ Remove the slot at idx
                    }
                    : item
            )
        );
    }

    function AddSlot(dayObj) {
        setUnavailability((prev) =>
            prev.map((item) =>
                item.day === dayObj.day
                    ? { 
                        ...item, 
                        slots: [
                            ...item.slots, 
                            { 
                                startTime: "", 
                                endTime: "", 
                                startTimeError: false,  
                                endTimeError: false 
                            }
                        ] 
                    }
                    : item
            )
        );
    }     

    return (
        <div className={isAvailability? styles.availabilityViewContainer : styles.calendarViewContainer}>
            <div className={styles.head}>
                <p>Activity</p>
                <div className={styles.timezone}>
                    <p>Time Zone</p>
                    <div className={styles.pseudoSelector}>
                        <select name="timezone" id="timezone" value={getFriendlyTimeZoneName()}>
                            <option value={getFriendlyTimeZoneName()}>{getFriendlyTimeZoneName()}</option>
                        </select>
                    </div>
                </div>
            </div>
            {isAvailability? <div className={styles.unavailabilityContainer}>
                <p>Weekly Hours</p>
                <div className={styles.unavailabilityWrapper}>
                    {unavailability.map((dayObj, index) => (
                        <div className={styles.dayContainer} key={index}>
                            <div className={styles.dayCheck}>
                                <input
                                    style={{ color: dayObj.day === 'Sun' && '#A1A1A1' }}
                                    type="checkbox"
                                    checked={dayObj.day === "Sun" || dayObj.isUnavailable}
                                    readOnly={dayObj.day === "Sun"}
                                    onChange={() => {
                                        if (dayObj.day !== "Sun") {
                                            setUnavailability((prev) =>
                                                prev.map((item) =>
                                                    item.day === dayObj.day
                                                        ? { ...item, isUnavailable: !item.isUnavailable }
                                                        : item
                                                )
                                            );
                                        }
                                    }}
                                />
                                <p>{dayObj.day}</p>
                            </div>
                            {dayObj.day === "Sun" || dayObj.isUnavailable ? (
                                <div className={styles.timeInputWrapper}>
                                    <div className={styles.timeBlock}>
                                        <p>Unavailable</p>
                                    </div>
                                </div>
                            ) : (
                                
                            <div className={styles.timeInputWrapper}>
                                {dayObj.slots.map((slot, idx) => (
                                    <div style={{ alignItems: 'center' }} className={styles.timeBlock} key={idx}>
                                        <div
                                            className={styles.timeBlockInput}
                                        >
                                            <input
                                                className={slot.startTimeError ? styles.inputStartError : ''}
                                                type="text"
                                                name="startTime"
                                                value={slot.startTime}
                                                onChange={(e) => handleTimeInput(e, dayObj, idx)}
                                                // onBlur={(e) => handleTimeInput(e, dayObj, idx, true)}
                                                placeholder="HH:MM AM/PM"
                                            />
                                            <p>-</p>
                                            <input
                                                className={slot.endTimeError ? styles.inputEndError : ''}
                                                type="text"
                                                name="endTime"
                                                value={slot.endTime}
                                                onChange={(e) => handleTimeInput(e, dayObj, idx)}
                                                // onBlur={(e) => handleTimeInput(e, dayObj, idx, true)}
                                                placeholder="HH:MM AM/PM"
                                            />
                                        </div>
                                        <div className={styles.timeBlockIcons}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className={styles.removeIcon}
                                                onClick={() => RemoveInput(dayObj, idx)}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6 18 18 6M6 6l12 12"
                                                />
                                            </svg>
                                            <img src={copyIcon} alt="" />
                                        </div>
                                    </div>
                                    ))}
                            </div>
                            )}
                            <img onClick={() => AddSlot(dayObj)} src={addIcon} alt="" />
                        </div>
                    ))}
                </div>
            </div>
                :
                <CalendarView />
            }
        </div>
    )
}

export default AvailabilityComponent;

function getFriendlyTimeZoneName() {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        timeZoneName: 'long'
    });
    const parts = formatter.formatToParts(new Date());
    const tzPart = parts.find(part => part.type === 'timeZoneName');
    return tzPart ? tzPart.value : tz;
}

