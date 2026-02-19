import { useState } from "react";
import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import 'ag-grid-autocomplete-editor/dist/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from './Loading';

const config = require('./Apiconfig');


const columnDefs = [
  {
    headerCheckboxSelection: true,
    checkboxSelection: true,
    headerName: "Service ID",
    field: "ServiceID",
    cellStyle: { textAlign: "center" },
    editable: false,
  },
  {
    headerName: "Service Name",
    field: "ServiceName",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  // {
  //   headerName: "Code",
  //   field: "Code",
  //   editable: false,
  //   cellStyle: { textAlign: "center" },
  // },
  {
    headerName: "Department",
    field: "Department",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Rate",
    field: "Rate",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Tax Applicable",
    field: "TaxApplicable",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Status",
    field: "Status",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
];

const defaultColDef = {
  resizable: true,
  wrapText: true,
  sortable: true,
  editable: true,
  // flex: 1,
};

export default function PurchaseItemPopup({ open, handleClose, handleItem }) {

  const [rowData, setRowData] = useState([]);
  const [ServiceID, setServiceID] = useState("");
  const [Code, setCode] = useState("");
  const [ServiceName, setServiceName] = useState("");
  const [Department, setDepartment] = useState("");
  const [Status, setStatus] = useState("");
  const [Rate, setRate] = useState('');
  const [loading, setLoading] = useState('');

  const handleSearchItem = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/ServiceSearchCreteria`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ServiceID, Code, ServiceName, Department, Status, Rate : Rate ? Rate : 0, company_code: sessionStorage.getItem("selectedCompanyCode") }) // Send company_no and company_name as search criteria
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log("data fetched successfully")
      } else if (response.status === 404) {
        toast.warning('Data not found')
        setRowData([]);
        clearInputs([])
        console.log("Data not found");
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("Error fetching search data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReload = () => {
    clearInputs([])
    setRowData([])
  };

  const clearInputs = () => {
    setServiceID("");
    setCode("");
    setServiceName("");
    setDepartment("");
    setStatus("");
  };
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
      ServiceID: row.ServiceID,
      Code: row.Code,
      Department: row.Department,
      Rate: row.Rate,
      ServiceName: row.ServiceName,
      TaxApplicable: row.TaxApplicable,
      Status: row.Status,
    }));
    handleItem(selectedData);
    handleClose();
    clearInputs([]);
    setRowData([]);
    setSelectedRows([]);
  }

  return (
    <div>
      {open && (
        <fieldset>
          <div>
            <div className="purbut">
              {loading && <LoadingScreen />}
              <div className="modal mt-5 Topnav-screen popupadj popup" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-xl ps-5 p-1 pe-5" role="document">
                  <div className="modal-content">
                    <div class="row justify-content-center">
                      <div class="col-md-12 text-center">
                        <div className="p-0 bg-body-tertiary">
                          <div className="purbut mb-0 d-flex justify-content-between" >
                            <h1 align="left" className="purbut">Item Help</h1>
                            <button onClick={handleClose} className="purbut btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                              <i class="fa-solid fa-xmark"></i>
                            </button>
                          </div>
                          <div class="d-flex justify-content-between">
                            <div className="d-flex justify-content-start">
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="modal-body">
                        <div className="row ms-3 me-3">
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="ItemCode"
                              className="exp-input-field form-control"
                              placeholder="Service ID"
                              value={ServiceID}
                              onChange={(e) => setServiceID(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          {/* <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="Variant"
                              className="exp-input-field form-control"
                              placeholder="Code"
                              value={Code}
                              onChange={(e) => setCode(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div> */}
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="ItemName"
                              className="exp-input-field form-control"
                              placeholder="Service Name"
                              value={ServiceName}
                              onChange={(e) => setServiceName(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="ShortName"
                              className="exp-input-field form-control"
                              placeholder="Department"
                              value={Department}
                              onChange={(e) => setDepartment(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="OurBrand"
                              className="exp-input-field form-control"
                              placeholder="Status"
                              value={Status}
                              onChange={(e) => setStatus(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="OurBrand"
                              className="exp-input-field form-control"
                              placeholder="Rate"
                              value={Rate}
                              onChange={(e) => setRate(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="mb-2 mt-2 d-flex justify-content-end">
                            <icon className="icon popups-btn" onClick={handleSearchItem}>
                              <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </icon>
                            <icon className="icon popups-btn" onClick={handleReload}>
                              <i class="fa-solid fa-arrow-rotate-right"></i>
                            </icon>
                            <icon className="icon popups-btn" onClick={handleConfirm}>
                              <FontAwesomeIcon icon="fa-solid fa-check" />
                            </icon>
                          </div>
                        </div>
                        <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
                          <AgGridReact
                            rowData={rowData}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            rowSelection="multiple"
                            pagination
                            onSelectionChanged={handleRowSelected}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mobileview">
              {loading && <LoadingScreen />}
              <div className="modal mt-5 Topnav-screen" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-xl ps-4 pe-4 p-1" role="document">
                  <div className="modal-content">
                    <div class="row justify-content-center">
                      <div class="col-md-12 text-center">
                        <div className="mb-0 d-flex justify-content-between">
                          <div className="mb-0 d-flex justify-content-start me-4">
                            <h1 className="h1">Item Help</h1>
                          </div>
                          <div className="mb-0 d-flex justify-content-end" >
                            <button onClick={handleClose} className="closebtn2" required title="Close">
                              <i class="fa-solid fa-xmark"></i>
                            </button>
                          </div>
                        </div>
                        <div class="d-flex justify-content-between">
                          <div className="d-flex justify-content-start">
                          </div>
                        </div>
                      </div>
                      <div className="modal-body">
                        <div className="row ms-3 me-3">
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="ItemCode"
                              className="exp-input-field form-control"
                              placeholder="Service ID"
                              value={ServiceID}
                              onChange={(e) => setServiceID(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          {/* <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="Variant"
                              className="exp-input-field form-control"
                              placeholder="Code"
                              value={Code}
                              onChange={(e) => setCode(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div> */}
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="ItemName"
                              className="exp-input-field form-control"
                              placeholder="Service Name"
                              value={ServiceName}
                              onChange={(e) => setServiceName(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="ShortName"
                              className="exp-input-field form-control"
                              placeholder="Department"
                              value={Department}
                              onChange={(e) => setDepartment(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="OurBrand"
                              className="exp-input-field form-control"
                              placeholder="Status"
                              value={Status}
                              onChange={(e) => setStatus(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="OurBrand"
                              className="exp-input-field form-control"
                              placeholder="Rate"
                              value={Rate}
                              onChange={(e) => setRate(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="mb-2 mt-2 d-flex justify-content-end">
                            <button className="" onClick={handleSearchItem}>
                              <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </button>
                            <button className="" onClick={handleReload}>
                              <i class="fa-solid fa-arrow-rotate-right"></i>
                            </button>
                            <button className="" onClick={handleConfirm}>
                              <FontAwesomeIcon icon="fa-solid fa-check" />
                            </button>
                          </div>
                          <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
                            <AgGridReact
                              rowData={rowData}
                              columnDefs={columnDefs}
                              defaultColDef={defaultColDef}
                              rowSelection="multiple"
                              pagination
                              onSelectionChanged={handleRowSelected}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      )}
    </div>
  );
}
