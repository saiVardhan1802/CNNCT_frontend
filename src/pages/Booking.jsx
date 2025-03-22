import React from 'react';
import styles from './styles/Booking.module.css';
import NavBar from '../components/NavBar';
import eventsIcon from '../assets/navbar/inactive/eventsIcon.png';
import bookingIcon from '../assets/navbar/active/bookingIcon.png';
import availabilityIcon from '../assets/navbar/inactive/availabilityIcon.png';
import settingsIcon from '../assets/navbar/inactive/settingsIcon.png'

const Booking = () => {
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
    </div>
  )
}

export default Booking