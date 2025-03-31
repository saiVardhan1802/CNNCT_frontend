import React, { useState } from 'react';
import styles from './styles/SignUp.module.css';
import frame from '../assets/auth/Frame.png';
import cnnctIcon from '../assets/global/cnnctIcon.png';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../services';
import toast from 'react-hot-toast';

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
            const response = await signUp(formData);
            const data = await response.json();
            const errors = validatePassword(formData.password, formData.confirmPassword);
            if (!response.ok) {
                toast.error(data.message || "Something went wrong. Please try again.");
                return;
            }
            else if(errors.length > 0) {
                toast.error(errors.join("\n"), { autoClose: 5000 });
                return;
            }
            else if(!formData.terms) {
                toast.error("Please check the terms and conditions to proceed.");
                return;
            }
            else if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/category');
                toast.success("Sign up successful.");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.")
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

export default SignUp;

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

    // If there are no errors in the password, then check confirm password
    if (errors.length === 0 && confirmPassword !== undefined) {
        if (password !== confirmPassword) {
            errors.push("Confirm password does not match.");
        }
    }

    console.log("Errors found:", errors);
    return errors.length > 0 ? errors : [];
}
