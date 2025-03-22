import React from 'react';
import styles from './styles/Settings.module.css';
import NavBar from '../components/NavBar';
import eventsIcon from '../assets/navbar/inactive/eventsIcon.png';
import bookingIcon from '../assets/navbar/inactive/bookingIcon.png';
import availabilityIcon from '../assets/navbar/inactive/availabilityIcon.png';
import settingsIcon from '../assets/navbar/active/settingsIcon.png'

const Settings = () => {
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
        bookingStyle="background-white"
        availabilityStyle="border-bottom-right-radius background-white"
        settingsStyle="color-blue"
        emptyStyle={{
          borderTopRightRadius: '0.7rem',
        }}
      />
    </div>
  )
}

export default Settings
