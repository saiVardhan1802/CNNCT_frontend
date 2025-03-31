import cnnctIcon from "../assets/global/cnnctIcon.png";
import NavBox from "./NavBox";
import styles from "./styles/NavBar.module.css";
import { useNavigate } from "react-router-dom";
import profileImg from '../assets/navbar/profileImg.png';
import signOutIcon from '../assets/navbar/signOutIcon.svg';
import { useEffect, useState } from "react";
import { getUser } from "../services";
import toast from "react-hot-toast";

export default function NavBar(props) {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [isSignOut, setIsSignOut] = useState(false);
    const token = localStorage.getItem('token');
    
    useEffect(() => {
        if (!token) return;

        const fetchUser = async () => {
            try {
                const user = await getUser(token);
                // console.log("Fetched User:", user);  // ✅ Debugging log
                if (user) {
                    setName(`${user.firstName} ${user.lastName}`);
                    localStorage.setItem('name', `${user.firstName} ${user.lastName}`);
                    localStorage.setItem('userId', user._id);
                    localStorage.setItem('userEmail', user.email);
                }
            } catch (error) {
                // console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, [token]); 
       // Runs when the token changes
    //    console.log("Name:", name);

    function SignOut() {
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
        <div style={{...props.navbarBackground}} className={styles.navbar}>
            <div className={styles.container}>
                <div style={{...props.brandStyle}} className={`${styles.brand}`}>
                    <img src={cnnctIcon} alt="CNNCT logo" />
                    <p>CNNCT</p>
                </div>
                <div className={styles.routeWrapper}>
                    <NavBox navigate={() => navigate("/events")} className={props.eventStyle} text="Events" img={props.imgEvents}/>
                    <NavBox navigate={() => navigate("/booking")} className={props.bookingStyle} text="Booking" img={props.imgBooking}/>
                    <NavBox navigate={() => navigate("/availability")} className={props.availabilityStyle} text="Availability" img={props.imgAvailability}/>
                    <NavBox navigate={() => navigate("/settings")} className={props.settingsStyle} text="Settings" img={props.imgSettings}/>
                    
                </div>
            </div>
            <div style={{...props.emptyStyle}} className={styles.empty}>
                <button type="button" style={{...props.buttonStyle}} onClick={props.create}>
                    <p style={{
                        fontSize: '2rem',
                        fontWeight: ''
                    }}>+</p>
                    <p>Create</p>
                </button>
            </div>
            <div style={{position: 'relative'}} className={styles.profileContainer}>
                <div style={{display: isSignOut? 'inline': 'none'}} className={styles.buttonContainer}>
                    <button type="button" onClick={SignOut}>
                        <img src={signOutIcon} alt="Sign out icon" />
                        <p>Sign out</p>
                    </button>
                </div>
                <div onClick={() => setIsSignOut(prev => !prev)} className={styles.profile}>
                    <img src={profileImg} alt="User profile" />
                    <p>{name}</p>
                </div>
            </div>
        </div>
    )
}