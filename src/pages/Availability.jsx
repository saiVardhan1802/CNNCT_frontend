import React from 'react';
import styles from './styles/Availability.module.css';
import NavBar from '../components/NavBar';
import eventsIcon from '../assets/navbar/inactive/eventsIcon.png';
import bookingIcon from '../assets/navbar/inactive/bookingIcon.png';
import availabilityIcon from '../assets/navbar/active/availabilityIcon.png';
import settingsIcon from '../assets/navbar/inactive/settingsIcon.png'

const Availability = () => {
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
    </div>
  )
}

export default Availability