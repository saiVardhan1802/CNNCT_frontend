import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import CustomEventComponent from './calendar-components/CustomEventComponent';

const CalendarView = () => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    const [userEvents, setUserEvents] = useState([]);
    const [date, setDate] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState("");
    const [scrollToTime, setScrollToTime] = useState(new Date(0, 0, 0, 9, 0));

    useEffect(() => {
      if (searchQuery.trim() === "") return; // Ignore empty searches
    
      const foundEvent = userEvents.find(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
      if (foundEvent) {
        setDate(new Date(foundEvent.start)); // Move to event date
        setScrollToTime(new Date(foundEvent.start));
      }
      console.log("Vardhan", searchQuery, foundEvent, userEvents);
    }, [searchQuery, userEvents]); 

    const eventPropGetter = (event) => {
      return {
        style: {
          border: event === searchQuery ? "2px solid green" : "",
        },
      };
    };    

    useEffect(() => {
        const fetchUserMeetings = async () => {
            try {
                const meetings = await getUserMeetings(username, token);
                const eventsArray = meetings.map((meeting) => {
                    console.log(meeting);
                    const dateAndTime = convertUTCToLocalStrings(meeting.dateTime);
                    return {
                        id: meeting._id, 
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
                setUserEvents(transformMeetingsForCalendar(meetings));
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
   
      

      const onView = useCallback((newView) => setView(newView), [setView])
    
    console.log("Views:", views);

    const renderToolbar = useCallback(
      (toolbarProps) => (
        <ToolBar
          {...toolbarProps}
          setView={setView}
          view={view}
          date={date}
          setDate={setDate}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      ),
      [setView, view, date, setDate, searchQuery, setSearchQuery] // Memoize to avoid unnecessary re-renders
    );

  return (
    <div className={styles.container}>
      <Calendar
        className={styles.rbcCalendar}
        localizer={localizer}
        events={userEvents}
        startAccessor="start"
        endAccessor="end"
        date={date}
        style={{width: "100%" }}
        views={views}
        view={view}
        onView={onView}
        toolbar={true}
        scrollToTime={scrollToTime}
        //ref={calendarRef}
        eventPropGetter={eventPropGetter}
        min={new Date(0, 0, 0, 9, 0)}
        formats={{
          timeGutterFormat: (date, culture, localizer) =>
            localizer.format(date, "h a", culture) // Removes :00
        }}
        components={{
            toolbar: renderToolbar,
            event: (props) => <CustomEventComponent {...props} />,
        }}
    />
    </div>
  )
}

export default CalendarView;

const transformMeetingsForCalendar = (meetings) => {
    return meetings.map((meeting) => {
      const startTime = new Date(meeting.dateTime); 
      const endTime = new Date(startTime.getTime() + meeting.duration * 60000);
  
      return {
        title: meeting.eventTopic, 
        start: startTime,
        end: endTime,
        backgroundColor: meeting.backgroundColor || "#3b82f6",
        host: meeting.hostName,
        description: meeting.description,
        timezone: meeting.timezone,
        link: meeting.link,
        inviteeEmails: meeting.inviteeEmails,
        invitations: meeting.invitations
      };
    });
  };
  
