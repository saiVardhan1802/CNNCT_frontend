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
import cnnctIcon from '../assets/global/cnnctIcon.png';
import { getUser, getUserMeetings } from '../services';
import SecondaryModal from '../components/SecondaryModal';
import PrimaryModal from '../components/PrimaryModal';
import EventComponent from '../components/EventComponent';
import { segregateEventsByTime } from './Booking';

const Events = () => {
  const token = localStorage.getItem('token');
  const [isModal, setIsModal] = useState(false);
  const [isNextModal, setIsNextModal] = useState(false);
  const [name, setName] = useState('');
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem("userEmail");
  const [userMeetings, setUserMeetings] = useState([]);

  const [eventData, setEventData] = useState({
    eventId: '',
    eventTopic: '',
    password: '',
    hostName: name,
    description: '',
    dateAndTime: {
      date: "", // Format: YYYY-MM-DD
      time: "12:00", // Format: HH:MM (12-hour)
      ampm: "PM", // "AM" or "PM"
      timezone: getUserTimezone(), // Default timezone
    },
    duration: '1 hour',
    backgroundColor: '000000',
    addLink: '',
    addEmails: [],
  });

  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const user = await getUser(token);
        //console.log("Fetched User:", user);  // ✅ Debugging log
        if (user) {
          setName(`${user.firstName} ${user.lastName}`);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [token]);

  useEffect(() => {
    const fetchUserMeetings = async () => {
      try {
        const meetings = await getUserMeetings(username);
        // console.log("Meeting from backend: ", meetings);
        setUserMeetings(meetings.map(meeting => ({ ...meeting })));
      } catch (error) {
        console.error("error with fetching user meetings: ",error)
      }
    }
    fetchUserMeetings();
  }, [username])
  // console.log("User meetings: ", userMeetings);

  const { presentEvents, pastEvents } = segregateEventsByTime(userMeetings);
  // console.log("Present events: ", presentEvents);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const filtered = filterUpcomingEvents(presentEvents, userId, userEmail);
  console.log("Filtered events: ", filtered);

  useEffect(() => {
    setUpcomingEvents(filtered);
  }, [userMeetings]);
  console.log("Upcoming Events: ", upcomingEvents);
  //console.log("Present events: ", presentEvents)

// backgroundColor: "000000"
// dateTime: "2025-04-01T06:30:00.000Z"
// description: ""
// duration: 180
// eventTopic: "meeting - 5"
// hostId: "67dff1a5b6ad0cf9515fd1cd"
// hostName: "vardhan ch"
// invitations: (2) [{…}, {…}]
// inviteeEmails: (3) ['svchalaka@gmail.com', 'vardhanch7@gmail.com', 'konderripuku@gmail.com']
// isInactivated: false
// link: "instagram.com"
// password: "hogrider"
// timezone: "Asia/Calcutta"
// __v: 0
// _id: "67e30f58d03c0d8f0a80a2a6"

  function HandleTextInput(e) {
    const { name, value } = e.target;
    //console.log(value);
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
            <div className={styles.brand}>
              <img src={cnnctIcon} alt="CNNCT Logo" />
              <p>CNNCT</p>
            </div>
            <div className={styles.head}>
              <div className={styles.headText}>
                <h2>Event Types</h2>
                <p>Create events to share for people to book on your calendar.</p>
              </div>
              <button onClick={() => setIsModal(true)}>+ Add New Event</button>
            </div>
            <div className={styles.scrollContainer}>
              <div className={styles.eventsContainer}>
                {upcomingEvents.map((upcomingEvent, index) => (
                  <EventComponent 
                    key={index} 
                    event={upcomingEvent} 
                    setUpcomingEvents={setUpcomingEvents} 
                    index={index} 
                    setEventData={setEventData}
                    setIsModal={setIsModal}
                    eventData={eventData}
                  />
                ))}
              </div>
            </div>
          </div> :
          <div className={styles.modalContainer}>
            <div className={styles.brandModal}>
              <img src={cnnctIcon} alt="CNNCT Icon" />
              <p>CNNCT</p>
            </div>
            <div style={{ display: isModal? 'none' : 'block'}} className={styles.headText}>
              <h2>Create Event</h2>
              <p>Create events to share for people to book on your calendar.</p>
            </div>
            <div className={styles.modal}>
              <p>Add Event</p>
              <hr className='mobile-none' />
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

export function getUserTimezone() {
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

// export function filterUpcomingEvents(userEvents, userId) {
//   return userEvents.filter((event) => {
//     const isHost = event.hostId === userId;
//     const isAcceptedInvite = event.invitations.some(invite => invite.status === "accepted");

//     return isHost || isAcceptedInvite;
//   });
// }

export function filterUpcomingEvents(userEvents, userId, userEmail) {
  return userEvents.filter((event) => {
    const isHost = event.hostId === userId;
    const isAcceptedInvite = event.invitations?.some(invite => invite.email === userEmail && invite.status === "accepted") || false;

    return isHost || isAcceptedInvite;
  });
}

export function isHost(userId, event) {
  return event.hostId === userId;
}

