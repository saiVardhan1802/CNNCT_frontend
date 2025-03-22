import React, { useState } from 'react';
import hostProfileImg from '../assets/events/hostProfileImg.png';
import styles from './styles/SecondaryModal.module.css';

const SecondaryModal = ({ eventData, 
    setEventData, 
    HandleTextInput, 
    setIsModal, 
    setIsNextModal,  }) => {
        const [selectedBackground, setSelectedBackground] = useState('');
        const [isInvalidHex, setIsInvalidHex] = useState(false);
        const [isValidLink, setIsValidLink] = useState(true);
        const [isValidMemberEmail, setIsValidMemberEmail] = useState(true);

        function CheckInvalid(value) {
            setIsInvalidHex(!isValidHex(value));
        }

        const validBlackCodes = ['000', '0000', '000000'];
        const validWhiteCodes = ['fff', 'ffff', 'ffffff'];

        function OptionCheck(code) {
            const lowerCode = code.toLowerCase();
            if (validBlackCodes.includes(lowerCode)) {
                setSelectedBackground('black'); // Black codes — blue border
            } else if (validWhiteCodes.includes(lowerCode)) {
                setSelectedBackground('white'); // White codes — green border (or any color you prefer)
            }
            else if (code === 'EF6500') {
                setSelectedBackground('orange');
            }
        }

        function validateLink(val) {
            isValidUrl(val)? setIsValidLink(true) : setIsValidLink(false)
        }
          
    return (
        <div className={styles.nextModal}>
            <div className={styles.bannerContainer}>
                <p>Banner</p>
                <div style={{ 
                    backgroundColor: eventData.backgroundColor ? `#${eventData.backgroundColor}` : "#ffffff",
                    color: eventData.backgroundColor? getTextColor(eventData.backgroundColor) : '#000000' }} 
                    className={styles.banner}>
                    <img src={hostProfileImg} alt="host profile for banner" />
                    <h2>{eventData.eventTopic}</h2>
                </div>
                <div className={styles.bannerBackground}>
                    <p>Custom Background Color</p>
                    <div className={styles.bannerBackgroundOptions}>
                        <div onClick={() => (setSelectedBackground('orange'), setEventData((prev) => ({
                            ...prev, backgroundColor: 'EF6500'
                        })))} style={{ 
                            backgroundColor: '#EF6500', 
                            border: selectedBackground==='orange' ? '2px solid #1877F2' : '1px solid rgba(0, 0, 0, 0.18)' 
                            }}></div>

                        <div onClick={() => (setSelectedBackground('white'), setEventData((prev) => ({
                            ...prev, backgroundColor: 'FFFFFF'
                        })))} style={{ backgroundColor: '#FFFFFF',
                            border: selectedBackground==='white' ? '2px solid #1877F2' : '1px solid rgba(0, 0, 0, 0.18)'
                            }}></div>

                        <div onClick={() => (setSelectedBackground('black'), setEventData((prev) => ({
                            ...prev, backgroundColor: '000000'
                        })))} style={{ backgroundColor: '#000000',
                            border: selectedBackground==='black' ? '2px solid #1877F2' : '1px solid rgba(0, 0, 0, 0.18)' 
                            }}></div>
                    </div>
                    <div className={styles.bannerBackgroundInput}>
                        <div style={{
                            backgroundColor: eventData.backgroundColor ? `#${eventData.backgroundColor}` : "#ffffff"
                        }}></div>
                        <input style={{border: isInvalidHex? '1px solid red' : '1px solid transparent'}}
                            type="text"
                            value={`#${eventData.backgroundColor}`}
                            onChange={(e) => {
                                const newVal = e.target.value.replace('#', '');
                                setEventData((prev) => ({
                                    ...prev, backgroundColor: newVal
                                }));
                                setSelectedBackground("");
                                CheckInvalid(newVal);
                                OptionCheck(newVal)
                            }}
                            maxLength={7}
                        />
                    </div>
                </div>
            </div>
            <hr style={{ marginTop: '0.5em' }} />
            <div className={styles.linksContainer}>
                <div className={styles.addLink}>
                    <label htmlFor="addLink">Add link <span>*</span></label>
                    <input type="text"
                        name='addLink'
                        id='addLink'
                        placeholder='Enter URL Here'
                        value={eventData.addLink}
                        onChange={(e) => {
                            HandleTextInput(e);
                            validateLink(e.target.value);
                          }}
                        style={{border: isValidLink? '1.5px solid #E0E0E0' : '1px solid red'}} />
                </div>
                <div className={styles.addEmails}>
                    <label htmlFor="addEmails">Add Emails <span>*</span></label>
                    <input type="text"
                        name='addEmails'
                        id='addEmails'
                        placeholder='Add memeber Emails'
                        value={eventData.addEmails}
                        onChange={(e) => {
                            HandleTextInput(e);
                            validateMultipleEmails(e.target.value)? setIsValidMemberEmail(true) : setIsValidMemberEmail(false);
                        }}
                        style={{border: isValidMemberEmail? '1.5px solid #E0E0E0' : '1px solid red'}} />
                </div>
            </div>
            <div className={styles.linksFormButton}>
                <button onClick={() => (setIsModal(false), setIsNextModal(false))} className={styles.cancelButton}>Cancel</button>
                <button className={styles.saveButton}>Save</button>
            </div>
        </div>
    )
}

export default SecondaryModal;

function isValidHex(color) {
    return /^([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6})$/.test(color);
  }  

const getTextColor = (bgColor) => {
    if(!isValidHex(bgColor)) return 'ffffff'
    const r = parseInt(bgColor.slice(0, 2), 16);
    const g = parseInt(bgColor.slice(2, 4), 16);
    const b = parseInt(bgColor.slice(4, 6), 16);
    // Luminance formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    return luminance > 186 ? '#000000' : '#ffffff';  
  };  

  function isValidUrl(link) {
    const pattern = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,15}$/;
    return pattern.test(link);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }  

  function validateMultipleEmails(emailString) {
    const emails = emailString.split(/[\s,]+/).filter(e => e);
    return emails.every(email => isValidEmail(email)); // anni valid ayite true, otherwise false
  }
  
  
  
  