import React, { Component } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
// timeGridPlugin is not available in v4.4.0
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import AddEventPopup from "./AddEventPopup";
import moment from "moment";
import ReactToolTip from "react-tooltip";
import ShowEventPopup from './ShowEventPopup';
import { createGlobalStyle } from 'styled-components';

// Global styles for the calendar
const CalendarStyles = createGlobalStyle`
  .fc {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 100%;
    margin: 20px auto;
    padding: 0 10px;
    
    .fc-toolbar {
      flex-direction: column;
      gap: 15px;
      margin-bottom: 1.5em !important;
      padding: 0 10px;
      
      .fc-toolbar-chunk {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 10px;
        justify-content: center;
        width: 100%;
      }
      
      @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
        padding: 0;
        
        .fc-toolbar-chunk {
          width: auto;
          margin-bottom: 0;
          justify-content: flex-start;
        }
      }
      
      h2 {
        font-size: 1.5em;
        font-weight: 600;
        color: #2c3e50;
        margin: 0;
      }
    }
    
    .fc-button {
      background-color:rgb(233, 58, 58);
      border: none;
      color: white;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 0.9em;
      font-weight: 500;
      text-transform: capitalize;
      transition: all 0.2s ease;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      margin: 3px;
      min-width: 80px;
      text-align: center;
      
      @media (max-width: 767px) {
        padding: 8px 12px;
        font-size: 0.85em;
        min-width: 70px;
      }
      
      &:hover {
        background-color:rgb(238, 0, 0);
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(255, 255, 255, 0.15);
      }
      
      &:active {
        transform: translateY(0);
        box-shadow: 0 2px 3px rgb(235, 230, 230);
        
      }
      
      &.fc-today-button {
        background-color:rgb(185, 41, 16);
        &:hover { background-color:rgb(159, 13, 13); }
      }
    }
    
    .fc-daygrid-day {
      border: 1px solid #e9ecef;
      transition: background-color 0.2s ease;
      
      &:hover {
        background-color: #f8f9fa;
      }
    }
    
    .fc-day-today {
      background-color: #f0f7ff !important;
      
      .fc-daygrid-day-number {
        background-color:rgb(247, 74, 74);
        color: white;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 2px;
      }
    }
    
    .fc-daygrid-day-number {
      color:rgb(158, 39, 39);
      padding: 4px;
      font-weight: 500;
    }
    
    .fc-col-header-cell {
      background-color: #f8fafc;
      padding: 10px 0;
      border: 1px solid #e9ecef;
      
      .fc-col-header-cell-cushion {
        color:rgb(158, 39, 39);
        font-weight: 600;
        text-decoration: none;
      }
    }
    
    .fc-event {
      border: none;
      border-radius: 4px;
      padding: 2px 5px;
      font-size: 0.85em;
      margin: 1px 2px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 1px 3px rgba(154, 34, 34, 0.1);
      
      &:hover {
        box-shadow: 0 2px 5px rgb(219, 209, 209);
        transform: translateY(-1px);
      }
      
      .fc-event-title {
        font-weight: 500;
      }
    }
    
    .fc-daygrid-event-dot {
      display: none;
    }
  }
`;

export default class Calendar extends Component {
  
  _isMounted=false;

  constructor(props) {
    super(props);

    this.state = {
      user: {},
      events: [],
      showAddModel: false,
      showModel: false,
      selectedEvent: {}
    };

    this.handleEventClick = this.handleEventClick.bind(this)
  }

  componentDidMount() {
    this._isMounted = true;

    if(this._isMounted) {
      this.setState({ user: JSON.parse(localStorage.getItem("user")) }, () => {
        axios({
          method: "get",
          url: `api/personalEvents/user/${this.state.user.id}`,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {

          let newEvents = res.data.map((x) => ({
            title: x.eventTitle,
            description: x.eventDescription,
            start: x.eventStartDate,
            end: x.eventEndDate,
            id: x.id,
            backgroundColor: '#dc3545',
            borderColor: '#dc3545',
            textColor: 'white',
            display: 'block',
            className: 'custom-event',
            extendedProps: {
              description: x.eventDescription
            }
          }));

          for (var i in newEvents) {
            newEvents[i].start = moment
              (newEvents[i].start)
              .format("YYYY-MM-DD HH:mm:ss");
            newEvents[i].end = moment
              (newEvents[i].end)
              .format("YYYY-MM-DD HH:mm:ss");
          }

          this.setState({ events: [...newEvents] });
        });
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleEventClick(info) {
    this.setState({
      selectedEvent: {
        id: info.event.id,
        title: info.event.title,
        description: info.event.extendedProps.description,
        start: info.event.start,
        end: info.event.end
      },
      showModel: true
    })
  }

  handleEventPositioned(info) {
    info.el.setAttribute("title", info.event.extendedProps.description ? info.event.extendedProps.description : 'No description');
    ReactToolTip.rebuild();
  }

  render() {
    let closeAddModel = () => this.setState({ showAddModel: false });
    let closeShowModel = () => this.setState({showModel: false});
    
    // Add styles for the calendar header buttons
    const headerStyles = `
      .fc .fc-button-active {
        color: #dc3545 !important;
        background-color: white !important;
        border-color: #dc3545 !important;
      }
      .fc .fc-button-active:hover {
        color: white !important;
        background-color: #dc3545 !important;
      }
      .fc .fc-button:focus, .fc .fc-button:active {
        box-shadow: none !important;
      }
    `;
    
    const calendarOptions = {
      defaultView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,dayGridDay,listWeek'
      },
      buttonText: {
        today: 'Today',
        month: 'Month',
        week: 'Week',
        day: 'Day',
        list: 'List'
      },
      views: {
        dayGridMonth: { buttonText: 'Month' },
        dayGridWeek: { buttonText: 'Week' },
        dayGridDay: { buttonText: 'Day' },
        listWeek: { buttonText: 'List' }
      },
      firstDay: 1, // Start week on Monday
      weekNumbers: true,
      navLinks: true,
      editable: true,
      dayMaxEvents: 3,
      eventDisplay: 'block',
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      },
      eventClassNames: (arg) => {
        return ['custom-event'];
      },
      eventDidMount: (info) => {
        info.el.style.backgroundColor = info.event.backgroundColor || '#dc3545';
        info.el.style.borderColor = info.event.borderColor || '#dc3545';
      },
      eventClick: this.handleEventClick,
      dateClick: () => this.setState({ showAddModel: true }),
      events: this.state.events,
      eventPositioned: this.handleEventPositioned,
      customButtons: {
        addEvent: {
          text: 'Add Event',
          click: () => this.setState({ showAddModel: true })
        }
      },
      header: {
        left: 'prev,next today addEvent',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,dayGridDay,listWeek'
      },
      height: 'auto',
      contentHeight: 'auto',
      aspectRatio: 1.8
    };

    return (
      <div className="calendar-container" style={{ padding: '20px' }}>
        <style>
          {`
            .fc .fc-button-active {
              color: #dc3545 !important;
              background-color: white !important;
              border-color: #dc3545 !important;
            }
            .fc .fc-button-active:hover {
              color: white !important;
              background-color: #dc3545 !important;
            }
            .fc .fc-button:focus, .fc .fc-button:active {
              box-shadow: none !important;
            }
            /* Style for Today button */
            .fc .fc-today-button {
              background-color:rgb(255, 13, 13) !important;
              text-color:  #dc3545 !important;
              color: white !important;
              border-color:rgb(227, 66, 82) !important;
            }
            .fc .fc-today-button:hover {
              background-color:rgb(255, 32, 54) !important;
              border-color: #bd2130 !important;
            }
          `}
        </style>
        <CalendarStyles />
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '10px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <FullCalendar {...calendarOptions} />
        </div>
        <AddEventPopup show={this.state.showAddModel} onHide={closeAddModel} />
        {this.state.showModel && (
          <ShowEventPopup 
            show={true} 
            onHide={closeShowModel} 
            data={this.state.selectedEvent} 
          />
        )}
      </div>
    );
  }
}
