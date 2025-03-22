import React, { useEffect, useState } from 'react';
import styles from './styles/Events.module.css';
import NavBar from '../components/NavBar';
import arrow from '../assets/events/arrow.png';
import eventsIconActive from '../assets/navbar/active/eventsIcon.png';
import eventsIconInactive from '../assets/navbar/inactive/eventsIcon.png';
import bookingIcon from '../assets/navbar/inactive/bookingIcon.png';
import availabilityIcon from '../assets/navbar/inactive/availabilityIcon.png';
import settingsIcon from '../assets/navbar/inactive/settingsIcon.png';
import hostProfileImg from '../assets/events/hostProfileImg.png'
import DateTimeInput from '../components/DateTimeInput';
import { getUser } from '../services';
import SecondaryModal from '../components/SecondaryModal';
import PrimaryModal from '../components/PrimaryModal';

const Events = () => {
  const token = localStorage.getItem('token');
  const [isModal, setIsModal] = useState(false);
  const [isNextModal, setIsNextModal] = useState(false);
  const [name, setName] = useState("");

  const [eventData, setEventData] = useState({
    eventTopic: '',
    password: '',
    hostName: '',
    description: '',
    dateAndTime: {
      date: "", // Format: YYYY-MM-DD
      time: "", // Format: HH:MM (24-hour)
      ampm: "PM", // "AM" or "PM"
      timezone: getUserTimezone(), // Default timezone
    },
    duration: '',
    backgroundColor: '000000',
    addLink: '',
    addEmails: [],
  });

  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const user = await getUser(token);
        console.log("Fetched User:", user);  // ✅ Debugging log
        if (user) {
          setName(`${user.firstName} ${user.lastName}`);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [token]);
  console.log(name);

  function HandleTextInput(e) {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className={styles.page}>
      <NavBar
        imgEvents={isModal ? eventsIconInactive : eventsIconActive}
        imgBooking={bookingIcon}
        imgAvailability={availabilityIcon}
        imgSettings={settingsIcon}
        brandStyle={{
          borderBottomRightRadius: '0.7rem',
          backgroundColor: 'white'
        }}
        navbarBackground={{ backgroundColor: isModal ? 'white' : '' }}
        eventStyle={isModal ? 'background-white' : "color-blue"}
        bookingStyle="border-top-right-radius background-white"
        availabilityStyle="background-white"
        settingsStyle="background-white"

        create={() => (setIsModal(!isModal), setIsNextModal(false))}
        buttonStyle={{
          backgroundColor: isModal ? '#1877F2' : 'transparent',
          color: isModal ? 'white' : '#1877F2'
        }}
      />
      <div style={{overflowY: isNextModal? 'auto' : ''}} className={styles.main}>
        {!isModal ?
          <div className={styles.events}>
            <div className={styles.head}>
              <div className={styles.headText}>
                <h2>Event Types</h2>
                <p>Create events to share for people to book on your calendar.</p>
              </div>
              <button onClick={() => setIsModal(true)}>+ Add New Event</button>
            </div>
          </div> :
          <div className={styles.modalContainer}>
            <div className={styles.headText}>
              <h2>Create Event</h2>
              <p>Create events to share for people to book on your calendar.</p>
            </div>
            <div className={styles.modal}>
              <p>Add Event</p>
              <hr />
              <form>
                {!isNextModal ? 
                <PrimaryModal eventData={eventData}
                  setEventData={setEventData} HandleTextInput={HandleTextInput} 
                  name={name} 
                  setIsModal={setIsModal} 
                  setIsNextModal={setIsNextModal} />
                 : 
                <SecondaryModal eventData={eventData} 
                  setEventData={setEventData} 
                  HandleTextInput={HandleTextInput}
                  setIsModal={setIsModal}
                  setIsNextModal={setIsNextModal} />
                }
              </form>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default Events;

function getUserTimezone() {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const city = timeZone.split('/')[1].replace('_', ' '); // e.g., Kolkata

  const offsetMinutes = new Date().getTimezoneOffset(); // ex: -330 for IST
  const totalMinutes = offsetMinutes * -1; // to convert negative to positive
  const sign = totalMinutes >= 0 ? '+' : '-';
  const absMinutes = Math.abs(totalMinutes);
  const hours = Math.floor(absMinutes / 60).toString().padStart(2, '0');
  const minutes = (absMinutes % 60).toString().padStart(2, '0');

  return `UTC${sign}${hours}:${minutes} ${city}`;
}


