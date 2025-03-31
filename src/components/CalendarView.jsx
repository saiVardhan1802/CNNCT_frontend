import React, { useCallback, useEffect, useState } from 'react';
import styles from './styles/CalendarView.module.css';
import '../App.css';
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { useMemo } from 'react';
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getUserMeetings } from '../services';
import { convertUTCToLocalStrings, getEndTime, getInvitationStatus, segregateEventsByTime } from '../pages/Booking';
import ToolBar from './calendar-components/ToolBar';

const CalendarView = () => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    const [userEvents, setUserEvents] = useState([]);

    useEffect(() => {
        const fetchUserMeetings = async () => {
            try {
                const meetings = await getUserMeetings(username, token);
                const eventsArray = meetings.map((meeting) => {
                    const dateAndTime = convertUTCToLocalStrings(meeting.dateTime);
                    return {
                        id: meeting._id, // Important for future updates
                        dateTime: meeting.dateTime,
                        day: dateAndTime.day,
                        date: dateAndTime.date,
                        startTime: dateAndTime.time,
                        endTime: getEndTime(meeting.dateTime, meeting.duration),
                        title: meeting.eventTopic,
                        members: `${meeting.invitations.length + 1}`,
                        invitations: meeting.invitations,
                        hostName: meeting.hostName,
                        status: getInvitationStatus(meeting, userId)
                    };
                });
                setUserEvents(eventsArray);
            } catch (error) {
                console.error("Error fetching meetings: ", error);
            }
        };
        fetchUserMeetings();
    }, [username, userId]);

    const { presentEvents, pastEvents } = segregateEventsByTime(userEvents);
    console.log("Present events: ", presentEvents);

    const locales = { "en-US": enUS };
    const localizer = dateFnsLocalizer({ 
        format, 
        parse, 
        startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
        getDay, 
        locales 
    })    

    const { defaultDate, views } = useMemo(
        () => ({
          defaultDate: new Date(2015, 3, 1),
          views: [Views.MONTH, Views.DAY, Views.WEEK],
        }),
        []
      )
    const [view, setView] = useState(Views.WEEK)
    // const views = {
    //     month: true,
    //     week: true,
    //     day: true,
    //     // year: YearView, // Custom View Add Chesaam
    //   };
      

      const onView = useCallback((newView) => setView(newView), [setView])
    
    console.log("Views:", views);

    const events = [
        {
            title: "Team Meeting",
            start: new Date(2025, 2, 28, 10, 0), // ✅ Correct format
            end: new Date(2025, 2, 28, 11, 0),
        },
        {
            title: "Daily Standup",
            start: new Date(2025, 2, 29, 9, 0),
            end: new Date(2025, 2, 29, 9, 30),
        }
    ];    

  return (
    <div className={styles.container}>
      <Calendar
        className={styles.rbcCalendar}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{width: "100%" }}
        views={views}
        view={view}
        onView={onView}
        toolbar={true}
        components={{
            toolbar: () => {return <ToolBar setView={setView} />}
        }}
    />
    </div>
  )
}

export default CalendarView;

const transformMeetingsForCalendar = (meetings) => {
    return meetings.map((meeting) => {
      const startTime = new Date(meeting.dateTime); 
      const endTime = new Date(startTime.getTime() + meeting.duration * 60000); // duration in minutes
  
      return {
        title: meeting.eventTopic, 
        start: startTime,
        end: endTime,
        backgroundColor: meeting.backgroundColor || "#3b82f6", // Default blue
        host: meeting.hostName,
        description: meeting.description,
        timezone: meeting.timezone,
        link: meeting.link,
        inviteeEmails: meeting.inviteeEmails,
        invitations: meeting.invitations
      };
    });
  };
  
