import React from 'react';
import styles from './styles/MobileHeader.module.css';
import cnnctIcon from '../assets/global/cnnctIcon.png';
import profileImg from '../assets/navbar/profileImg.png';

const MobileHeader = (props) => {
  return (
      <div  className={styles.profileContainer}>
          <div style={{...props.style}} className={styles.brand}>
              <img src={cnnctIcon} alt="CNNCT logo" />
              <p>CNNCT</p>
          </div>
          <img src={profileImg} alt="User profile" />
      </div>
  )
}

export default MobileHeader
