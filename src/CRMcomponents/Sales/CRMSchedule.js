import React, { useState } from 'react';
import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';
import './CRMSchedule.css';
import ReactTooltip from 'react-tooltip';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CRMCalendar() {
  const [view, setView] = useState(Views.MONTH);
  const [events, setEvents] = useState([
   
  ]);

  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '' });
  const [showModal, setShowModal] = useState(false);
const [selectedEvent, setSelectedEvent] = useState(null);

  const navigate = useNavigate();

  const handleNavigate = () => navigate("/crmlistpage");
  const handleNavigate1 = () => navigate("/CrmChart");
  const handleNavigate3 = () => navigate("/CrmScheduler");

  const handleAddEvent = () => {
    const { title, start, end } = newEvent;
    if (!title || !start || !end) return alert("Please fill all fields");

    setEvents([
      ...events,
      {
        title,
        start: new Date(start),
        end: new Date(end),
      },
    ]);
    setNewEvent({ title: '', start: '', end: '' });
    setShowModal(false);
  };
const formattedEvents = events.map(e => ({
  ...e,
  title: `${e.title}\n${new Date(e.start).toLocaleTimeString()} - ${new Date(e.end).toLocaleTimeString()}`
}));



    const handleNavigate4 = () => {
    navigate("/CrmActivity"); // Pass selectedRows as props to the Input component
  };
      const handleNavigate5 = () => {
    navigate("/CrmLocation"); // Pass selectedRows as props to the Input component
  };
  return (
    <div className="container-fluid Topnav-screen">
      {/* Top Nav */}
      <div className="shadow-lg bg-white rounded-3 mb-3">
        <div className="d-flex justify-content-between p-0">
          <h1>CRM Schedule</h1>
          <div className='mt-2'>
            <addbutton className=" " onClick={handleNavigate}>
              <i className="bi bi-kanban text-dark fs-4"></i>
            </addbutton>
            <addbutton className="" onClick={handleNavigate}>
              <i className="bi bi-card-list text-dark fs-4"></i>
            </addbutton>
            <addbutton className=" " onClick={handleNavigate3}>
              <i className="bi bi-calendar3 text-dark fs-4"></i>
            </addbutton>
            <addbutton className=" " onClick={handleNavigate1}>
              <i className="bi bi-bar-chart-fill text-dark fs-4"></i>
            </addbutton>
            <addbutton className="mt-2 " onClick={handleNavigate4}>
              <i class="bi bi-stopwatch text-dark fs-4"></i>
            </addbutton>
            <addbutton className="mt-2 " onClick={handleNavigate5}>
                <i class="bi bi-geo-alt-fill text-dark fs-4"></i>
            </addbutton>
            <button className="me-4" onClick={() => setShowModal(true)}>
              <i className="bi bi-plus-circle-fill "></i> Add Event
            </button>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="shadow p-3 bg-white rounded">
        <div className="mb-3 d-flex justify-content-end">
          {['DAY', 'WEEK', 'MONTH', 'AGENDA'].map(v => (
            <button
              key={v}
              className={`me-2 ${view === Views[v] ? 'active' : ''}`}
              onClick={() => setView(Views[v])}
            >
              {v.charAt(0) + v.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Calendar */}
        <Calendar
            localizer={localizer}
            events={formattedEvents}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            style={{ height: 600 }}
            className="bg-light"
            onSelectEvent={(event) => setSelectedEvent(event)}
            tooltipAccessor="title"
            />

      </div>

      {/* Bootstrap Modal */}
      {showModal && (
        <div className="modal show d-block mt-5 popupadj Topnav-screen popup" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Event</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Start Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={newEvent.start}
                    onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">End Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={newEvent.end}
                    onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={handleAddEvent} className="">Add</button>
                <button onClick={() => setShowModal(false)} className="">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedEvent && (
  <div className="modal show d-block mt-5 popupadj Topnav-screen popup" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Event Details</h5>
          <button type="button" className="btn-close" onClick={() => setSelectedEvent(null)}></button>
        </div>
        <div className="modal-body">
          <p><strong>Title:</strong> {selectedEvent.title}</p>
          <p><strong>Start:</strong> {new Date(selectedEvent.start).toLocaleString()}</p>
          <p><strong>End:</strong> {new Date(selectedEvent.end).toLocaleString()}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-danger" onClick={() => {
            setEvents(events.filter(ev => ev !== selectedEvent));
            setSelectedEvent(null);
          }}>Delete</button>
          <button className="btn btn-secondary" onClick={() => setSelectedEvent(null)}>Close</button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
