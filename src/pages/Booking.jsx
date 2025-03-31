import React, { useEffect, useState } from 'react';
import styles from './styles/Booking.module.css';
import NavBar from '../components/NavBar';
import eventsIcon from '../assets/navbar/inactive/eventsIcon.png';
import bookingIcon from '../assets/navbar/active/bookingIcon.png';
import availabilityIcon from '../assets/navbar/inactive/availabilityIcon.png';
import settingsIcon from '../assets/navbar/inactive/settingsIcon.png';
import BookingComponent from '../components/BookingComponent';
import { getUserMeetings, updateUserInvitationStatus } from '../services';
import InviteeDisplay from '../components/InviteeDisplay';
import MobileHeader from '../components/MobileHeader';
import toast from 'react-hot-toast';

const Booking = () => {
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail');
  const token = localStorage.getItem('token');

  const [activeTab, setActiveTab] = useState("upcoming");
  const [userEvents, setUserEvents] = useState([]);
  const [presentEvents, setPresentEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const selectedEvent = userEvents.find(userEvent => userEvent.id === selectedEventId);
  const inviteeNames = selectedEvent
  ? [
      selectedEvent.hostName,
      ...selectedEvent.invitations
        .filter(invite => invite.status !== "canceled")
        .map(invite => invite.name)
    ]
  : [];

  useEffect(() => {
    const fetchUserMeetings = async () => { 
      try {
        const meetings = await getUserMeetings(username, token);
        console.log("Meetings from backend: ", meetings);
        const upcomingEventsArray = meetings.map((meeting) => {
          const dateAndTime = convertUTCToLocalStrings(meeting.dateTime);
          return {
            id: meeting._id, 
            dateTime: meeting.dateTime,
            day: dateAndTime.day,
            date: dateAndTime.date,
            startTime: dateAndTime.time,
            endTime: getEndTime(meeting.dateTime, meeting.duration),
            title: meeting.eventTopic,
            members: String(meeting.invitations.filter(inv => inv.status !== 'rejected').length + 1),
            invitations: meeting.invitations,
            hostName: meeting.hostName,
            status: getInvitationStatus(meeting, userId, userEmail)
          };
        });
        setUserEvents(upcomingEventsArray);        
      } catch (error) {
        console.error("Error fetching meetings: ", error);
      }
    };
    fetchUserMeetings();  
  }, [username, userId]);
  
  useEffect(() => {
    const { presentEvents, pastEvents } = segregateEventsByTime(userEvents);
    setPresentEvents(presentEvents);
    setPastEvents(pastEvents);
  }, [userEvents]);


  function HandleSelectedEvent(e) {
    setSelectedEventId(e);
  }

  async function HandleStatus(e, eventId, userEmail) {
        try {
            e.preventDefault();
            const { name } = e.currentTarget; 
            
            const response = await updateUserInvitationStatus(userEmail, name, eventId, token);
            const data = await response.json();
            
            if (!response.ok) {
                toast.error(data.message || "Something went wrong.");
                return;
            }
    
            toast.success(`Invitation ${name} successfully!`);
        } catch (error) {
            console.error("Error in handling status: ", error);
            toast.error("Something went wrong.");
        }
    }
  

  return (
    <div className={styles.page}>
      <NavBar 
        imgEvents={eventsIcon}
        imgBooking={bookingIcon}
        imgAvailability={availabilityIcon}
        imgSettings={settingsIcon}
        brandStyle={{
          backgroundColor: 'white'
        }}
        eventStyle="border-bottom-right-radius background-white"
        bookingStyle="color-blue"
        availabilityStyle="border-top-right-radius background-white"
        settingsStyle='background-white'
      />
      <div className={styles.main}>
        <MobileHeader />
        <div className={styles.head}>
          <h2>Booking</h2>
          <p>See upcoming and past events booked through your event type links.</p>
        </div>
        <div className={styles.bookingContainer}>
          <div className={styles.bookingNavBar}>
            <div onClick={() => setActiveTab('upcoming')} 
              className={`${styles.upcomingBox} ${activeTab==='upcoming'? styles.activeTab : ''}`}>
              <p>Upcoming</p>
            </div>
            <div onClick={() => setActiveTab('pending')} 
              className={`${styles.pendingBox} ${activeTab==='pending'? styles.activeTab : ''}`}>
              <p>Pending</p>
            </div>
            <div onClick={() => setActiveTab('canceled')} 
              className={`${styles.canceledBox} ${activeTab==='canceled'? styles.activeTab : ''}`}>
              <p>Canceled</p>
            </div>
            <div onClick={() => setActiveTab('past')} 
              className={`${styles.pastBox} ${activeTab==='past'? styles.activeTab : ''}`}>
              <p>Past</p>
            </div>
          </div>
          <div className={styles.eventsList}>
            {(activeTab === 'past'
              ? pastEvents
              : presentEvents.filter(event => {
                if (activeTab === 'upcoming') return event.status === 'accepted' || event.status === 'Hosted';
                if (activeTab === 'pending') return event.status === 'pending';
                if (activeTab === 'canceled') return event.status === 'rejected' || event.status === 'canceled';
                
                return true;
              })
            ).map((event, index) => (
              <BookingComponent
                eventId = {event.id}
                activeTab={activeTab}
                event={event}
                key={index}
                HandleSelectedEvent={() => HandleSelectedEvent(event.id)}
              />
            ))}

          </div>
        </div>
        {selectedEventId && <InviteeDisplay
          event={userEvents.find(userEvent => userEvent.id === selectedEventId)}
          inviteeNames={inviteeNames}
          eventId={selectedEventId}
          HandleStatus={HandleStatus}
          setSelectedEventId={setSelectedEventId}
          activeTab={activeTab}
        />}
      </div>
    </div>
  )
}

export default Booking;

export function convertUTCToLocalStrings(utcDateTime) {
  const dateObj = new Date(utcDateTime);
  const localDateString = dateObj.toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'short',
  });

  const localDayString = dateObj.toLocaleDateString(undefined, {
      weekday: 'long',
  });

  const localTimeString = dateObj.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
  });

  return {
      date: localDateString,
      day: localDayString,
      time: localTimeString,
  };
}

export function segregateEventsByTime(userEvents) {
  const currentDate = new Date();

  const presentEvents = userEvents.filter((event) => {
    const eventDate = new Date(event.dateTime);
    return eventDate >= currentDate;
  });

  const pastEvents = userEvents.filter((event) => {
    const eventDate = new Date(event.dateTime);
    return eventDate < currentDate;
  });

  return { presentEvents, pastEvents };
}

export const getInvitationStatus = (meeting, currentUserId, userEmail) => {
  if (meeting.hostId === currentUserId) {
    return "Hosted";
  }
  const userInvitation = meeting.invitations.find(invitation => invitation.email === userEmail);
  return userInvitation ? userInvitation.status : "pending";
};

export function getEndTime(utcStartTime, durationInMinutes) {
  console.log("Start time: ", utcStartTime);
  console.log("Duration: ", durationInMinutes);
  const startDate = new Date(utcStartTime);
  const endDate = new Date(startDate.getTime() + durationInMinutes * 60000);
  
  const localEndTimeString = endDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return localEndTimeString;
}
