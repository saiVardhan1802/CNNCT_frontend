import React, { useState } from 'react';
import styles from './styles/MobileHeader.module.css';
import cnnctIcon from '../assets/global/cnnctIcon.png';
import profileImg from '../assets/navbar/profileImg.png';
import signOutIcon from '../assets/navbar/signOutIcon.svg';

const MobileHeader = (props) => {
    const [isSignOut, setIsSignOut] = useState(false);

    function HandleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('username');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('name');
        localStorage.removeItem('userId');
        toast.success("Signed out successfully.");
        navigate('/sign-in');
    }
    
    return (
        <div className={styles.profileContainer}>
            <div style={{ ...props.style }} className={styles.brand}>
                <img src={cnnctIcon} alt="CNNCT logo" />
                <p>CNNCT</p>
            </div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <div onClick={() => setIsSignOut(!isSignOut)} className={styles.profileImg}>
                    <img src={profileImg} alt="User profile" />
                </div>

                <div style={{ display: isSignOut ? 'inline' : 'none' }} className={styles.logoutWrapper}>
                    <div onClick={HandleLogout} className={styles.logout}>
                        <img src={signOutIcon} alt="" />
                        <p>Sign out</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MobileHeader
