import React, { useEffect, useState } from 'react';
import styles from './styles/SignIn.module.css';
import frame from '../assets/auth/frame.png'
import cnnctIcon from '../assets/global/cnnctIcon.png';
import { login } from '../services';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SignIn = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  // if (token) {
  //   navigate('/events');
  // }
  const getHeadingText = () => {
    if (window.innerWidth < 600) return "Sign in to your CNNCT";
    if (window.innerWidth > 1023) return "Sign in";
  };
  
  const [heading, setHeading] = useState(getHeadingText());
  
  useEffect(() => {
    const handleResize = () => setHeading(getHeadingText());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  function HandleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev, [name] : value
    }))
  };

  async function HandleSubmit(e) {
    try {
      e.preventDefault();
      const response = await login({ data: formData });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', formData.username);
        toast.success("Successfully logged in.");
        navigate('/events');
      }
      else {
        const data = await response.json();
        toast.error(data.message || "Sign in failed. Please try again");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    }
  }
  
  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <div className={styles.mainWrapper}>
          <div className={styles.brand}>
            <img src={cnnctIcon} alt="CNNCT Icon" />
            <p>CNNCT</p>
          </div>
          <div className={styles.container}>
            <p>{heading}</p>
            <form onSubmit={HandleSubmit}>
              <div className={styles.formContainer}>
                <div className={styles.inputContainer}>
                  <input type="text" placeholder='Username' name='username' value={formData.username} required onChange={HandleChange}/>
                  <input type="password" placeholder='Password' name='password' value={formData.password} required onChange={HandleChange} />
                </div>
                <button type='submit'>Log in</button>
                <p>Don't have an account? <span className='underline' onClick={() => navigate('/sign-up')}>Sign up</span></p>
              </div>
            </form>
          </div>
        </div>
        <footer>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span> and <span className='underline'>Terms of Service</span> apply.</footer>
      </div>
      <img src={frame} alt="Person working on a project at their desk." />
    </div>
  )
}

export default SignIn
