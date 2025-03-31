import React, { useEffect, useState } from 'react';
import hostProfileImg from '../assets/events/hostProfileImg.png';
import styles from './styles/SecondaryModal.module.css';
import { createMeeting, getUser, updateEvent } from '../services';
import toast from 'react-hot-toast';
import { convertUTCToLocalStrings, getEndTime } from '../pages/Booking';

const SecondaryModal = ({ eventData, setEventData, HandleTextInput, setIsModal, setIsNextModal }) => {
  const [selectedBackground, setSelectedBackground] = useState('');
  const [isInvalidHex, setIsInvalidHex] = useState(false);
  const [isValidLink, setIsValidLink] = useState(true);
  const [isValidMemberEmail, setIsValidMemberEmail] = useState(true);
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  function CheckInvalid(value) {
    if (value.length === 6 && isValidHex(value)) {
        setIsInvalidHex(false);
        setEventData((prev) => ({
            ...prev, backgroundColor: value
        }));
    } else {
        setIsInvalidHex(true);
    }
}

  const validBlackCodes = ['000000'];
  const validWhiteCodes = ['ffffff'];

  function OptionCheck(code) {
    const lowerCode = code.toLowerCase();
    if (validBlackCodes.includes(lowerCode)) {
      setSelectedBackground('black');
    } else if (validWhiteCodes.includes(lowerCode)) {
      setSelectedBackground('white');
    } else if (code.toUpperCase() === 'EF6500') {
      setSelectedBackground('orange');
    } else {
      setSelectedBackground('');
    }
  }

  function validateLink(val) {
    setIsValidLink(isValidUrl(val));
  }

  async function HandleSubmit(e) {
    try {
        e.preventDefault();
        if (
            isInvalidHex ||
            !isValidLink ||
            !isValidMemberEmail ||
            !eventData.addLink.trim() ||
            !eventData.eventTopic.trim() ||
            eventData.addEmails.length === 0
        ) {
            toast.error("Please fill all the fields.");
            return;
        }

        if (eventData.eventId) {
          const response = await updateEvent(eventData.eventId, { ...eventData, hostUsername: username, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }, token);
          const data = await response.json();
          if (response.ok) {
            setIsModal(false);
            setIsNextModal(false);
            toast.success('Meeting updated successfully.');
          } else {
            toast.error(data.message || 'Something went wrong.');
        }
        }
        else {
          const response = await createMeeting({ ...eventData, hostUsername: username, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }, token);
          const data = await response.json();
          if (response.ok) {
            setIsModal(false);
            setIsNextModal(false);
            toast.success('Meeting created successfully.');
        } else {
            toast.error(data.message || 'Something went wrong.');
        }
        }
    } catch (error) {
        console.error("Submit error:", error);
        toast.error("Something went wrong.");
    }
}

  return (
    <div className={styles.nextModal}>
      <div className={styles.bannerContainer}>
        <p>Banner</p>
        <div
          style={{
            backgroundColor: isValidHex(eventData.backgroundColor) ? `#${eventData.backgroundColor}` : '#000000',
            color: isValidHex(eventData.backgroundColor)
              ? getTextColor(eventData.backgroundColor)
              : '#ffffff',
          }}
          className={styles.banner}
        >
          <img src={hostProfileImg} alt="host profile for banner" />
          <h2>{eventData.eventTopic}</h2>
        </div>
        <div className={styles.bannerBackground}>
          <p>Custom Background Color</p>
          <div className={styles.bannerBackgroundOptions}>
            <div
              onClick={() => (
                setSelectedBackground('orange'),
                setEventData((prev) => ({
                  ...prev,
                  backgroundColor: 'EF6500',
                }))
              )}
              style={{
                backgroundColor: '#EF6500',
                border:
                  selectedBackground === 'orange' ? '2px solid #1877F2' : '1px solid rgba(0, 0, 0, 0.18)',
              }}
            ></div>

            <div
              onClick={() => (
                setSelectedBackground('white'),
                setEventData((prev) => ({
                  ...prev,
                  backgroundColor: 'FFFFFF',
                }))
              )}
              style={{
                backgroundColor: '#FFFFFF',
                border:
                  selectedBackground === 'white' ? '2px solid #1877F2' : '1px solid rgba(0, 0, 0, 0.18)',
              }}
            ></div>

            <div
              onClick={() => (
                setSelectedBackground('black'),
                setEventData((prev) => ({
                  ...prev,
                  backgroundColor: '000000',
                }))
              )}
              style={{
                backgroundColor: '#000000',
                border:
                  selectedBackground === 'black' || eventData.backgroundColor === '000000'
                    ? '2px solid #1877F2'
                    : '1px solid rgba(0, 0, 0, 0.18)',
              }}
            ></div>
          </div>
          <div className={styles.bannerBackgroundInput}>
            <div
              style={{
                backgroundColor: isValidHex(eventData.backgroundColor)
                  ? `#${eventData.backgroundColor}`
                  : '#000000',
              }}
            ></div>
                <input
                    style={{ border: isInvalidHex ? '1px solid red' : '1px solid transparent' }}
                    type="text"
                    value={`#${eventData.backgroundColor}`}
                    onChange={(e) => {
                        const newVal = e.target.value.replace('#', '');
                        setEventData((prev) => ({
                            ...prev, backgroundColor: newVal
                        }));
                        setSelectedBackground('');
                        CheckInvalid(newVal);
                        OptionCheck(newVal);
                    }}
                    maxLength={7}
                />
          </div>
        </div>
      </div>
      <hr style={{ marginTop: '0.5em' }} />
      <div className={styles.linksContainer}>
        <div className={styles.addLink}>
          <label htmlFor="addLink">
            Add link <span>*</span>
          </label>
          <input
            type="text"
            name="addLink"
            id="addLink"
            placeholder="Enter URL Here"
            value={eventData.addLink}
            onChange={(e) => {
              HandleTextInput(e);
              validateLink(e.target.value);
            }}
            style={{ border: isValidLink ? '1.5px solid #E0E0E0' : '1px solid red' }}
          />
        </div>
        <div className={styles.addEmails}>
          <label htmlFor="addEmails">
            Add Emails <span>*</span>
          </label>
          <input
            type="text"
            name="addEmails"
            id="addEmails"
            placeholder="Add member Emails"
            value={eventData.addEmails}
            onChange={(e) => {
              HandleTextInput(e);
              validateMultipleEmails(e.target.value)
                ? setIsValidMemberEmail(true)
                : setIsValidMemberEmail(false);
            }}
            style={{ border: isValidMemberEmail ? '1.5px solid #E0E0E0' : '1px solid red' }}
          />
        </div>
      </div>
      <div className={styles.linksFormButton}>
        <button onClick={() => (setIsModal(false), setIsNextModal(false))} className={styles.cancelButton}>
          Cancel
        </button>
        <button type="submit" onClick={HandleSubmit} className={styles.saveButton}>
          Save
        </button>
      </div>
    </div>
  );
};

export default SecondaryModal;

function isValidHex(color) {
    return /^[0-9A-Fa-f]{6}$/.test(color);
}

const getTextColor = (bgColor) => {
  if (!isValidHex(bgColor)) return '#ffffff';
  const r = parseInt(bgColor.slice(0, 2), 16);
  const g = parseInt(bgColor.slice(2, 4), 16);
  const b = parseInt(bgColor.slice(4, 6), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
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
  const emails = emailString.split(/[\s,]+/).filter((e) => e);
  return emails.every((email) => isValidEmail(email));
}