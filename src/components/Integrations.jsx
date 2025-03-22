import React, { useState } from 'react';
import audioMack from '../assets/landing/icons/audioMack.png';
import bandsInTown from '../assets/landing/icons/bandsInTown.png';
import bonfire from '../assets/landing/icons/bonfire.png';
import books from '../assets/landing/icons/books.png';
import buyMeAGift from '../assets/landing/icons/buyMeAGift.png';
import cameo from '../assets/landing/icons/cameo.png';
import clubHouse from '../assets/landing/icons/clubHouse.png';
import community from '../assets/landing/icons/community.png';
import contactDetails from '../assets/landing/icons/contactDetails.png';
import styles from './styles/Integrations.module.css';


const Integrations = () => {
    const integrations = {
        "Audiomack": "Add an Audiomack player to your Linktree", 
        "Bandsintown": "Drive ticket sales by listing your events", 
        "Bonfire": "Display and sell your custom merch", 
        "Books": "Promote books on your Linktree", 
        "Buy Me A Gift": "Let visitors support you with a small gift", 
        "Cameo": "Make impossible fan connections possible", 
        "Clubhouse": "Let your community in on the conversation", 
        "Community": "Build an SMS subscriber list", 
        "Contact Details": "Easily share downloadable contact details"
    };

    const integrationImages = [
        audioMack, bandsInTown, bonfire, books, buyMeAGift, cameo, clubHouse, community, contactDetails
    ];


    return (
        <div className={styles.container}>
            {Object.entries(integrations).map(([key, value], index) => (
                <div className={styles.box} key={index}>
                    <img src={integrationImages[index]} alt={key} />
                    <div>
                        <p>{key}</p>
                        <p style={{
                            fontSize: '0.8rem',
                            }}>{value}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Integrations
