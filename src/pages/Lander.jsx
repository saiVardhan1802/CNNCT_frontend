import React from 'react';
import styles from './styles/Lander.module.css';
import cnnctIcon from '../assets/global/cnnctIcon.png';
import heroImg from '../assets/landing/heroImg.png';
import calendarImgOne from '../assets/landing/calendarImgOne.png'
import calendarImgTwo from '../assets/landing/calendarImgTwo.png'
import LanderSignUpButton from '../components/LanderSignUpButton';
import snowIcon from '../assets/landing/snowIcon.png';
import Integrations from '../components/Integrations';
import LanderFooter from '../components/LanderFooter';

const Lander = () => {
  return (
    <div className={styles.page}>
      <div className={styles.landerNav}>
        <div className={styles.brand}>
            <img src={cnnctIcon} alt="cnnct icon" />
            <p>CNNCT</p>
        </div>
        <LanderSignUpButton />
      </div>
      <div className={styles.wrapper}>
        <div className={styles.heading}>
            <h1>CNNCT – Easy</h1>
            <h1>Scheduling Ahead</h1>
        </div>
        <LanderSignUpButton style={{
            marginTop: '2em',
            padding: '0.8em 2em',
            }}/>
        <img src={heroImg} alt="CNNCT's booking page" />
        
        <h2>Simplified scheduling for you and your team</h2>
        <p className={styles.cnnctMotto}>CNNCT eliminates the back-and-forth of scheduling meetings so you can focus on what matters. Set your availability, share your link, and let others book time with you instantly.</p>
        
        <div className={styles.cnnctFeatures}>
            <div className={styles.featureList}>
                <h2 style={{width: '70%'}}>Stay Organized with Your Calendar & Meetings</h2>
                <div className={styles.featureContainer}>
                    <p>Seamless Event Scheduling</p>
                    <ul>
                        <li>View all your upcoming meetings and appointments in one place.</li>
                        <li>Syncs with Google Calendar, Outlook, and iCloud to avoid conflicts.</li>
                        <li>Customize event types: one-on-ones, team meetings, group sessions, and webinars.</li>
                    </ul>
                </div>
            </div>
            <div className={styles.featureImages}>
                <img className={styles.calendarImgOne} src={calendarImgOne} alt="" />
                <img className={styles.calendarImgTwo} src={calendarImgTwo} alt="" />
            </div>
        </div>
        <div className={styles.featureImagesMobile}>
            <img className={styles.calendarImgOneMobile} src={calendarImgOne} alt="" />
            <img className={styles.calendarImgTwoMobile} src={calendarImgTwo} alt="" />
        </div>
        <div className={styles.customerContainer}>
            <div className={styles.customerStories}>
                <p>Here's what our <span style={{color: '#1877F2'}}>customer</span> has to says</p>
                <div className={styles.mobileNone}>
                    <img src={snowIcon} alt="" />
                    <p>[short description goes in here] lorem ipsum is a placeholder text to demonstrate.</p>
                </div>
                <button>Read customer stories</button>
            </div>
            <div className={styles.customerReviews}>
                {[...Array(4)].map((_, index) => (
                    <div 
                    key={index} 
                    style={{ backgroundColor: index === 0 || index === 3 ? "#DEDEDE" : "#FFFFFF" }}
                    >
                        <p className={styles.reviewTitle}>Amazing tool! Saved me months</p>
                        <p style={{fontWeight: '500'}}>This is a placeholder for your testimonials and what your client has to say, put them here and make sure its 100% true and meaningful.</p>
                        <div className={styles.reviewer}>
                            <div className={styles.reviewerProfile}></div>
                            <div className={styles.reviewerInfo}>
                                <p>John Master</p>
                                <p>Director, Spark.com</p>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            </div>
            <h2 style={{
                marginTop: '2em',
                fontSize: '2rem',
                letterSpacing: '-0.05em'
                }}>
                    All Link Apps and Integrations
            </h2>
            <Integrations />
            <LanderFooter />
        </div>
    </div>
  )
}

export default Lander
