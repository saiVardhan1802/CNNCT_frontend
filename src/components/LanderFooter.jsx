import React from 'react';
import styles from './styles/LanderFooter.module.css';
import LanderSignUpButton from './LanderSignUpButton';
import twitter from '../assets/landing/socials/twitter.png';
import instagram from '../assets/landing/socials/instagram.png';
import youtube from '../assets/landing/socials/youTube.png';
import tikTok from '../assets/landing/socials/tikTok.png';
import frame from '../assets/landing/socials/frame.png';
import { useNavigate } from 'react-router-dom';

const LanderFooter = () => {
    const links = [
        'About CNNCT', 'Careers', 'Terms and Conditions', 'Blog', 'Getting Started', 'Privacy Policy', 'Press',
        'Features and How-Tos', 'Cookies Notice', 'Social Good', "FAQs", 'Trust Center', 'Contact', 
        'Report a Violation'
    ];

    const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
          <div className={styles.authButtons}>
            <button onClick={() => navigate('/sign-in')} className={`${styles.login} ${styles.none}`}>Log in</button>
            <LanderSignUpButton style={{
                padding: '1em 1.5em'
            }}/>
          </div>
          <div className={styles.links}>
            {links.map((link, index) => (
                <p className={styles.linksText} key={index}>{link}</p>
            )) }
          </div>
      </div>
      <div className={styles.socialContainer}>
          <p className={styles.none}>We acknowledge the Traditional Custodians of the land on which our office stands, The Wurundjeri people of the Kulin Nation, and pay our respects to Elders past, present and emerging.</p>
            <div className={styles.socials}>
                <img src={twitter} alt="Twitter logo" />
                <img src={instagram} alt="Instagra logo" />
                <img src={youtube} alt="Youtube logo" />
                <img src={tikTok} alt="tik-tok logo" />
                <img src={frame} alt="CNNCT logo" />
            </div>
      </div>
    </div>
  )
}

export default LanderFooter
