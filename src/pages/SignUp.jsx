import React, { useState } from 'react';
import styles from './styles/SignUp.module.css';
import frame from '../assets/auth/frame.png';
import cnnctIcon from '../assets/global/cnnctIcon.png';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../services';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false
    });

    function HandleChange(e) {
        const { name, type, checked, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    }    

    async function HandleSubmit(e) {
        try {
            e.preventDefault();
            const response = await signUp({ data : formData });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                navigate('/category');
            }
        } catch (error) {
            console.log(error);
        }
    }
    
  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <div className={styles.brand}>
            <img src={cnnctIcon} alt="CNNCT Icon" />
            <p>CNNCT</p>
        </div>
        <h1>Sign up to your CNNCT</h1>
        <div className={styles.container}>
            <div className={styles.containerHeading}>
                <p style={{
                    fontSize: '1.3rem',
                    fontWeight: '500'
                }}>Create an account</p>
                <p style={{
                    textDecoration: 'underline',
                    color: '#1877F2',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                }} onClick={() => navigate('/sign-in')}>Sign in instead</p>
            </div>
            <form onSubmit={HandleSubmit}>
                <div className={styles.formContainer}>
                    <div className={styles.textInput}>
                        <label htmlFor="firstName">First name</label>
                        <input type="text" id='firstName' name='firstName' required value={formData.firstName} onChange={HandleChange}/>
                    </div>
                    <div className={styles.textInput}>
                        <label htmlFor="lastName">Last name</label>
                        <input type="text" id='lastName' name='lastName' value={formData.lastName} onChange={HandleChange} />
                    </div>
                    <div className={styles.textInput}>
                        <label htmlFor="email">Email</label>
                        <input type="text" id='email' name='email' required value={formData.email} onChange={HandleChange} />
                    </div>
                    <div className={styles.textInput}>
                        <label htmlFor="password">Password</label>
                        <input type="password" id='password' name='password' required value={formData.password} onChange={HandleChange} />
                    </div>
                    <div className={styles.textInput}>
                        <label htmlFor="confirmPassword">Confirm password</label>
                        <input type="password" id='confirmPassword' name='confirmPassword' required value={formData.confirmPassword} onChange={HandleChange} />
                    </div>
                    <div className={styles.checkboxContainer}>
                        <input type="checkbox" name="terms" id="terms" 
                        checked={formData.terms} onChange={HandleChange} 
                        className={styles.checkbox} />
                        <label className={styles.checkboxLabel} htmlFor="terms">
                        By creating an account, I agree to our <span className="underline">Terms of use</span> and <span className="underline">Privacy Policy</span> 
                        </label>
                    </div>
                    <button type='submit'>Create an account</button>
                </div>
            </form>
        </div>
        <footer>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span> and <span className='underline'>Terms of Service</span> apply.</footer>
      </div>
      <img src={frame} alt="Person working on a project at their desk." />
    </div>
  )
}

export default SignUp
