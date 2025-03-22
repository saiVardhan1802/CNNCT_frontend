import React from 'react';
import styles from './styles/LanderSignUpButton.module.css';
import {useNavigate} from 'react-router-dom';

const LanderSignUpButton = ({ style }) => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate('/sign-up')} style={{...style}} className={styles.signUpButton}>Sign up free</button>
  )
}

export default LanderSignUpButton
