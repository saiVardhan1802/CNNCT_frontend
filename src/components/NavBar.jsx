import cnnctIcon from "../assets/global/cnnctIcon.png";
import NavBox from "./NavBox";
import styles from "./styles/NavBar.module.css";
import { useNavigate } from "react-router-dom";
import profileImg from '../assets/navbar/profileImg.png';
import { useEffect, useState } from "react";
import { getUser } from "../services";

export default function NavBar(props) {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const token = localStorage.getItem('token');
    
    useEffect(() => {
        if (!token) return;

        const fetchUser = async () => {
            try {
                const user = await getUser(token);
                console.log("Fetched User:", user);  // ✅ Debugging log
                if (user) {
                    setName(`${user.firstName} ${user.lastName}`);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, [token]); 
       // Runs when the token changes
    
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
                        // transform: 'scaleX(1.2)'
                    }}>+</p>
                    <p>Create</p>
                </button>
            </div>
            <div className={styles.profile}>
                <img src={profileImg} alt="User profile" />
                <p>{name}</p>
            </div>
        </div>
    )
}