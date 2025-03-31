import React, { useEffect, useState } from 'react';
import styles from './styles/Availability.module.css';
import NavBar from '../components/NavBar';
import eventsIcon from '../assets/navbar/inactive/eventsIcon.png';
import bookingIcon from '../assets/navbar/inactive/bookingIcon.png';
import availabilityIcon from '../assets/navbar/active/availabilityIcon.png';
import settingsIcon from '../assets/navbar/inactive/settingsIcon.png';
import availabilityTabImg from '../assets/availability/availabilityTabImg.png';
import calenderTabImg from '../assets/availability/calenderTabImg.png'
import MobileHeader from '../components/MobileHeader';
import AvailabilityComponent from '../components/AvailabilityComponent';
import toast from 'react-hot-toast';
import { getUser, updateUser } from '../services';

const Availability = () => {
  const token = localStorage.getItem('token');
  const [isAvailability, setIsAvailability] = useState(false);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const [unavailability, setUnavailability] = useState(days.map(day => ({
  day,
  slots: [
    {
      startTime: '',
      endTime: '',
      startTimeError: false,
      endTimeError: false,
    }
  ],
  isUnavailable: day === 'Sun',
})));

useEffect(() => {
  const fetchUser = async () => {
    try {
      const user = await getUser(token);
      if (user && user.unavailability) {
        setUnavailability(days.map(day => {
          const existingData = user.unavailability.find(d => d.day === day);
          
          return {
            day,
            slots: existingData ? existingData.slots : [
              {
                startTime: '',
                endTime: '',
                startTimeError: false,
                endTimeError: false,
              }
            ],
            isUnavailable: day === 'Sun' ? true : existingData?.isUnavailable || false,
          };
        }));
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  fetchUser();
}, []);

useEffect(() => {
  localStorage.setItem("unavailability", JSON.stringify(unavailability));
}, [unavailability]); 

console.log("Unavailability state: ", unavailability);

  const [isInputError, setIsInputError] = useState(false);

  async function HandleSubmit(e) {
    try {
      e.preventDefault();
      if (isInputError) {
        toast.error("Please enter the timings in correct format (AM/PM).")
        return
      }
      else {
        const response = await updateUser(token, { unavailability });
        toast.success("Your unavailability timings have been updated.")
      }
    } catch (error) {
        toast.error("Failed to update your unavailability timings.")
        console.error("Update error: ", error);
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
        eventStyle="background-white"
        bookingStyle="border-bottom-right-radius background-white"
        availabilityStyle="color-blue"
        settingsStyle="border-top-right-radius background-white"
      />
      <div className={styles.main}>
        <MobileHeader style={{
          fontSize: '2.25rem'
        }} />
        <div className={styles.heading}>
          <h3>Availability</h3>
          <p>Configure times when you are available for bookings</p>
        </div>
        <div className={styles.tabSelectors}>
          <div style={{
            backgroundColor: isAvailability? 'white' : 'transparent'
          }} onClick={() => setIsAvailability(true)}>
            <img src={availabilityTabImg} alt="" />
            <p>Availability</p>
          </div>
          <div style={{
            backgroundColor: isAvailability? 'transparent' : 'white'
          }} onClick={() => setIsAvailability(false)}>
            <img src={calenderTabImg} alt="" />
            <p>Calendar View</p>
          </div>
        </div>
        <form onSubmit={HandleSubmit}>
          <AvailabilityComponent
            unavailability={unavailability}
            setUnavailability={setUnavailability}
            isInputError={isInputError}
            setIsInputError={setIsInputError}
            isAvailability={isAvailability}
          />
          {isAvailability && <button type='submit' >Save</button>}
        </form>
      </div>
    </div>
  )
}

export default Availability