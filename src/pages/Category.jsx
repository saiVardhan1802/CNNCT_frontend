import React, { useState } from 'react';
import styles from './styles/Category.module.css';
import frame from '../assets/auth/Frame.png';
import cnnctIcon from '../assets/global/cnnctIcon.png';
import sales from '../assets/category/sales.png';
import education from '../assets/category/education.png';
import finance from '../assets/category/finance.png';
import governmentAndPolitics from '../assets/category/governmentAndPolitics.png';
import consulting from '../assets/category/consulting.png';
import recruting from '../assets/category/recruting.png';
import tech from '../assets/category/tech.png';
import marketing from '../assets/category/marketing.png';
import { updateUser } from '../services';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Category = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    console.log(token);
    const categories = {
        "Sales": sales,
        "Education": education,
        "Finance": finance,
        "Government & Politics": governmentAndPolitics,
        "Consulting": consulting,
        "recruting": recruting,
        "Tech": tech,
        "Marketing": marketing
    }

    const [selectedCategory, setSelectedCategory] = useState("");
    const [username, setUsername] = useState("");

    async function HandleContinue(e) {
        try {
            e.preventDefault();
            const response = await updateUser(token, {username: username, category: selectedCategory});
            const data = await response.json();
            console.log('response: ', data);
            if (!response.ok) {
                toast.error(data.message || "Something went wrong. Please try again.");
                return
            }
            toast.success("Username registered.");
            localStorage.setItem("username", username);
            navigate('/events');
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
        <div className={styles.container}>
            <h1>Your Preferences</h1>
            <input type="text" name="username" placeholder='Tell us your username' required 
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            />
            <div className={styles.categoryParent}>
                <p className='bold'>Select one category that best decribes your CNNCT:</p>
                <div className={styles.categoryContainer}>
                    {Object.entries(categories).map(([title, img], index) => (
                        <div onClick={() => setSelectedCategory(title)} 
                            key={index}
                            style={{
                                backgroundColor: selectedCategory === title ? "#1877F2" : "",
                                color: selectedCategory === title ? 'white' : ""
                            }}
                            >
                            <img src={img} alt={`${title} category`} />
                            <p>{title}</p>
                        </div>
                    ))}
                </div>
                <button onClick={HandleContinue}>Continue</button>
            </div>
        </div>
      </div>
      <img src={frame} alt="Person working on a project at their desk." />
    </div>
  )
}

export default Category
