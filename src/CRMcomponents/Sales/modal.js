import React, { useState, useEffect } from 'react';
import AddContactModal from './contact.js';
import Select from 'react-select';
const config = require('../../Apiconfig');

export default function LeadForm({ initialData = {}, onSubmit, onCancel }) {
  // const [form, setForm] = useState(() => ({
  //   company: '',
  //   contact: '',
  //   opportunity: '',
  //   email: '',
  //   phone: '',
  //   investment: '',
  //   rotational: '',
  //   ...initialData
  // }));
  const [nameDrop, setNameDrop] = useState([]);
  const [selectedName, setselectedName] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [opportunityName, setOpportunityName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [expectedRevenue, setExpectedRevenue] = useState('');
  const [monthlyRevenue, setMonthlyRevenue] = useState('');
  const [email, setEmail] = useState('');

  // Only reset form if initialData changes (deep equality might be better, but usually shallow is fine)
  // useEffect(() => {
  //   setForm({
  //     company: '',
  //     contact: '',
  //     opportunity: '',
  //     email: '',
  //     phone: '',
  //     investment: '',
  //     rotational: '',
  //     ...initialData
  //   });
  // }, [JSON.stringify(initialData)]); // JSON.stringify ensures change detection on content, not ref

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setForm((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (!form.company.trim() || !form.opportunity.trim()) return;

  //   const newLead = {
  //     id: initialData.id || `lead-${Date.now()}`,
  //     ...form,
  //   };

  //   onSubmit(newLead);

  //   // Clear form only if adding new (not editing)
  //   if (!initialData.id) {
  //     setForm({
  //       company: '',
  //       contact: '',
  //       opportunity: '',
  //       email: '',
  //       phone: '',
  //       investment: '',
  //       rotational: '',
  //     });
  //   }
  // };

  const handleSaveContact = () => {
    setShowContactModal(false);
  };
  const [showContactModal, setShowContactModal] = useState(false);


  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getCRMContactName`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((data) => data.json())
      .then((val) => setNameDrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionName = nameDrop.map((option) => ({
    value: option.Name,
    label: option.Name,
  }));

  const handleChangeName = (selectedName) => {
    setselectedName(selectedName);
    setName(selectedName ? selectedName.value : '');
  };

  return (
    <div className="card p-2 mb-2  " >
      {/* Company */}
      <div className="input-group mb-2">
        <span className="input-group-text text-dark"><i className="bi bi-building"></i></span>
        <input
          type="text"
          className="form-control"
          name="company"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Company Name"
        />
      </div>

      {/* Contact Name */}
      <div>
        <div className="input-group mb-2">
          <span className="input-group-text">
            <i className="bi bi-person-fill"></i>
          </span>
          <Select
            className='col-md-8'
            options={filteredOptionName}
            isClearable
            isSearchable
            onChange={handleChangeName}
            value={selectedName}
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowContactModal(true)}
          >
            <i className="bi bi-plus-lg"></i>
          </button>
        </div>

        {/* Modal Component */}
        <AddContactModal
          show={showContactModal}
          onClose={() => setShowContactModal(false)}
          onSave={handleSaveContact}
        />
      </div>

      {/* Opportunity Name */}
      <div className="input-group mb-2">
        <span className="input-group-text"><i className="bi bi-lightbulb-fill"></i></span>
        <input
          type="text"
          className="form-control"
          name="opportunity"
          value={opportunityName}
          onChange={(e) => setOpportunityName(e.target.value)}
          placeholder="Opportunity Name"
        />
      </div>

      {/* Email */}
      <div className="input-group mb-2">
        <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
        <input
          type="email"
          className="form-control"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Contact Email"
        />
      </div>

      {/* Phone */}
      <div className="input-group mb-2">
        <span className="input-group-text"><i className="bi bi-telephone-fill"></i></span>
        <input
          type="tel"
          className="form-control"
          name="phone"
          value={phoneNo}
          onChange={(e) => setPhoneNo(e.target.value)}
          placeholder="Contact Phone"
        />
      </div>

      {/* Investment Money */}
      <div className="input-group mb-2">
        <span className="input-group-text"><i className="bi bi-cash-coin"></i></span>
        <input
          type="number"
          className="form-control"
          name="investment"
          value={expectedRevenue}
          onChange={(e) => setExpectedRevenue(e.target.value)}
          placeholder="0.00"
          step="0.01"
          min="0"
        />
      </div>

      {/* Rotational Money */}
      <div className="input-group mb-2">
        <span className="input-group-text"><i className="bi bi-arrow-repeat"></i></span>
        <input
          type="number"
          className="form-control"
          name="rotational"
          value={monthlyRevenue}
          onChange={(e) => setMonthlyRevenue(e.target.value)}
          placeholder="0.00"
          step="0.01"
          min="0"
        />
      </div>

      <div className="d-flex justify-content-between">
        <button className="">
          Save
        </button>
        <button type="button" className="" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
