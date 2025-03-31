import React, { useState } from 'react';
import styles from './styles/Settings.module.css';
import NavBar from '../components/NavBar';
import eventsIcon from '../assets/navbar/inactive/eventsIcon.png';
import bookingIcon from '../assets/navbar/inactive/bookingIcon.png';
import availabilityIcon from '../assets/navbar/inactive/availabilityIcon.png';
import settingsIcon from '../assets/navbar/active/settingsIcon.png'
import MobileHeader from '../components/MobileHeader';
import { updateUser } from '../services';
import toast from 'react-hot-toast';

const Settings = () => {
  const token = localStorage.getItem('token');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  function HandleTextInput(e) {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev, [name] : value
    }))
  };
  
  async function HandleSubmit(e) {
    try {
      e.preventDefault();
      const errors = validatePassword(profileData.password, profileData.confirmPassword);
      if (errors.length > 0) {
        toast.error(errors.join("\n"), { autoClose: 5000 });
      }
      else {
        const response = await updateUser(token, profileData);
        if (response.ok) {
          toast.success("Your profile is successfully updated.");
          localStorage.setItem('name', `${profileData.firstName} ${profileData.lastName}`);
          localStorage.setItem('userEmail', profileData.email);
        }
        else {
          const data = await response.json();
          toast.error(data.message || "Something went wrong. Please try again.")
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Error updating profile: ", error);
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
        bookingStyle="background-white"
        availabilityStyle="border-bottom-right-radius background-white"
        settingsStyle="color-blue"
        emptyStyle={{
          borderTopRightRadius: '0.7rem',
        }}
      />
      <div className={styles.main}>
        <MobileHeader />
        <h2 className={styles.mobileNone}>Profile</h2>
        <p className={styles.mobileNone}>Manage your profile</p>

        <div className={styles.container}>
          <div className={styles.containerHead}>
            <p>Edit Profile</p>
          </div>
          <form onSubmit={HandleSubmit}>
            <div className={styles.formWrapper}>
              <div>
                <p>First name</p>
                <input required name='firstName' type="text" value={profileData.firstName} onChange={HandleTextInput}/>
              </div>
              <div>
                <p>Last name</p>
                <input name='lastName' type="text" value={profileData.lastName} onChange={HandleTextInput}/>
              </div>
              <div>
                <p>Email</p>
                <input required name='email' type="text" value={profileData.email} onChange={HandleTextInput}/>
              </div>
              <div>
                <p>Password</p>
                <input required name='password' type="password" value={profileData.password} onChange={HandleTextInput}/>
              </div>
              <div>
                <p>Confirm Password</p>
                <input required name='confirmPassword' type="password" value={profileData.confirmPassword} onChange={HandleTextInput}/>
              </div>
            </div>
            <div className={styles.buttonClass}><button type='submit'>Save</button></div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Settings;

function validatePassword(password, confirmPassword) {
  if (!password) {
      return ["Password cannot be empty."];
  }

  const errors = [];

  if (password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
  }
  if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter.");
  }
  if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter.");
  }
  if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number.");
  }
  if (!/[@$!%*?&]/.test(password)) {
      errors.push("Password must contain at least one special character (@$!%*?&).");
  }
  if (errors.length === 0) {
      if (password !== confirmPassword) {
          errors.push("Confirm password does not match.");
      }
  }

  console.log("Errors found:", errors);
  return errors.length > 0 ? errors : [];
}
