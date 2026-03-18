import React, { useState } from 'react';
import './CRMActivityScheduler.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const activityTypes = ['To-Do', 'Email', 'Call', 'Meeting', 'Document'];

export default function ActivityScheduler() {
  const [selectedTab, setSelectedTab] = useState('To-Do');
  const [showModal, setShowModal] = useState(false);
const [activities, setActivities] = useState([]);

  const renderActivityForm = () => (
  <div className="activity-form">
    <div className="mb-3">
      <label className="form-label">Summary</label>
      <input
        type="text"
        className="form-control"
        placeholder={`Enter ${selectedTab} summary`}
        value={formData.summary}
        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Due Date</label>
      <input
        type="date"
        className="form-control"
        value={formData.dueDate}
        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
      />
    </div>
    {selectedTab === 'Email' && (
      <div className="mb-3">
        <label className="form-label">Recipient</label>
        <input
          type="email"
          className="form-control"
          placeholder="email@example.com"
          value={formData.recipient}
          onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
        />
      </div>
    )}
    {selectedTab === 'Call' && (
      <div className="mb-3">
        <label className="form-label">Phone Number</label>
        <input
          type="tel"
          className="form-control"
          placeholder="+1 234 567 8900"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
    )}
    <div className="mb-3">
      <label className="form-label">Notes</label>
      <textarea
        className="form-control"
        rows="3"
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
      />
    </div>
    <div className="text-end">
      <button className=" me-2" onClick={() => setShowModal(false)}>Cancel</button>
      <button className="" onClick={handleSchedule}>Schedule</button>
    </div>
  </div>
);


  const navigate = useNavigate();
  const handleNavigate = () => navigate("/crmlistpage");
  const handleNavigate1 = () => navigate("/CrmChart");
  const handleNavigate3 = () => navigate("/CrmScheduler");
  const handleNavigate4 = () => {
   navigate("/CrmActivity"); // Pass selectedRows as props to the Input component
  };

  const [formData, setFormData] = useState({
  summary: '',
  dueDate: '',
  recipient: '',
  phone: '',
  notes: ''
});


const handleSchedule = () => {
  const newActivity = {
    type: selectedTab,
    ...formData,
    id: Date.now(), // unique ID
  };

  setActivities([...activities, newActivity]);

  // Reset form and close modal
  setFormData({
    summary: '',
    dueDate: '',
    recipient: '',
    phone: '',
    notes: '',
  });
  setShowModal(false);
};
      const handleNavigate5 = () => {
    navigate("/CrmLocation"); // Pass selectedRows as props to the Input component
  };

  return (
    <div className="container-fluid Topnav-screen">
      <div className="shadow-lg bg-white rounded-3 mb-3 ">
        <div className="d-flex justify-content-between p-1">
          <h1>CRM Activity Scheduler</h1>
          <div className="mt-2">
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
          </div>
        </div>
      </div>

      <div className="activity-scheduler bg-white text-dark p-4 border rounded shadow-sm">
        <div className="d-flex border-bottom mb-3">
          {activityTypes.map((type) => (
            <div
              key={type}
              className={`tab-item px-3 py-2 ${
                selectedTab === type ? "active-tab" : ""
              }`}
              onClick={() => setSelectedTab(type)}
            >
              {type}
            </div>
          ))}
          <div
            className="ms-auto text-primary px-3 py-2 fw-semibold"
            role="button"
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-plus-lg"></i> Schedule activity
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content bg-white text-dark border">
                <div className="modal-header border-bottom">
                  <h5 className="modal-title">Schedule {selectedTab}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">{renderActivityForm()}</div>
              </div>
            </div>
          </div>
        )}
        <div className="mt-4">
          {activities.filter((act) => act.type === selectedTab).length === 0 ? (
            <p className="text-muted">No {selectedTab} activities scheduled.</p>
          ) : (
            <ul className="list-group">
              {activities
                .filter((act) => act.type === selectedTab)
                .map((act) => (
                  <li key={act.id} className="list-group-item">
                    <strong>{act.summary}</strong> <br />
                    <small>Due: {act.dueDate}</small>
                    <br />
                    {act.notes && <small>Notes: {act.notes}</small>}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
