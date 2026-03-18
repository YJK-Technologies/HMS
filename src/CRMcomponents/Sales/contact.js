import React, { useState, useMemo, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import NewContactModal from './addContact'; // Correct component here
import Select from 'react-select';
const config = require('../../Apiconfig');

const AddContactModal = ({ show, onClose, showC, onCloseC, onSaveC }) => {
  const [condrop, setCondrop] = useState([]);
  const [selectedCountry, setselectedCountry] = useState('');
  const [country, setCountry] = useState('');
  const [showNewContactModal, setShowNewContactModal] = useState(false);

  const [rowData] = useState([
    { name: 'John Doe', email: 'john@example.com', phone: '+1 123 456 7890', activities: 5, country: 'USA' },
    { name: 'Jane Smith', email: 'jane@example.com', phone: '+91 9876543210', activities: 3, country: 'India' },
  ]);

  const columnDefs = [
    { 
      headerName: 'Name', 
      field: 'name', 
      sortable: true, 
      filter: true 
    },
    { 
      headerName: 'Email', 
      field: 'email', 
      sortable: true, 
      filter: true 
    },
    { 
      headerName: 'Phone', 
      field: 'phone', 
      sortable: true, 
      filter: true 
    },
    { 
      headerName: 'Activities', 
      field: 'activities', 
      sortable: true, 
      filter: true 
    },
    { 
      headerName: 'Country', 
      field: 'country', 
      sortable: true, 
      filter: true 
    },
  ];


    useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/country`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setCondrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionCountry = condrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeCountry = (selectedCountry) => {
    setselectedCountry(selectedCountry);
    setCountry(selectedCountry ? selectedCountry.value : '');
  };

  if (!show) return null;

  const handleOpenNewContactModal = () => setShowNewContactModal(true);
  const handleSaveNewContact = () => {
    // Save logic here
    setShowNewContactModal(false);
  };

  return (
    <div
      className="modal d-block mt-5 popupadj Topnav-screen popup"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-xl" role="document">
        <div className="modal-content">

          {/* Header */}
          <div className="modal-header">
            <div className="d-flex justify-content-between w-100">
              <h5 className="modal-title">Search Contact</h5>
              <button className="btn btn-danger" onClick={onClose} aria-label="Close">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="modal-body">

            {/* Search Filters */}
            <div className="row mb-3">
              <div className="col-md-3">
                <div className="input-group">
                  <input type="text" className="form-control" placeholder="Search Name" />
                  <button
                    className=""
                    type="button"
                    onClick={handleOpenNewContactModal}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="col-md-3">
                <input type="email" className="form-control" placeholder="Search Email" />
              </div>

              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="Search Phone" />
              </div>

              <div className="col-md-3">
                <Select
                    className="exp-input-field"
                    placeholder="Select Country"
                    value={selectedCountry}
                    onChange={handleChangeCountry}
                    options={filteredOptionCountry}
                  />
              </div>
            </div>

            {/* AG Grid Table */}
            <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
              <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={5}
              />
            </div>

          </div>

          {/* Footer */}
          <div className="modal-footer justify-content-end ms-3">
            <button  className="" onClick={handleSaveNewContact}>
              Add Selected
            </button>
          </div>
        </div>
      </div>

      {/* Correct Modal */}
      <NewContactModal
        showC={showNewContactModal}
        onCloseC={() => setShowNewContactModal(false)}
        onSaveC={handleSaveNewContact}
      />
    </div>
  );
};

export default AddContactModal;
