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
    field: "BillNo",
    headerName: "Bill No",
    editable: false,
    cellStyle: { textAlign: "center" },
    // Hide checkbox if the row is the total row
    checkboxSelection: (params) => {
      return params.node.data && params.node.data.PaymentModeID !== "Total";
    },
    headerCheckboxSelection: (params) => {
      // Also hide the header checkbox if it includes the total row
      const rowData = params.api.getDisplayedRowAtIndex(params.rowIndex)?.data;
      return rowData?.PaymentModeID !== "Total";
    }
},
  {
    headerName: "Bill Date",
    field: "BillDate",
    editable: false,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params) => {
      if (!params.value) return ''; // Return an empty string if the value is null or undefined
      const date = new Date(params.value);
      const day = date.getDate().toString().padStart(2, '0'); // Get day (padStart ensures double-digit format)
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (+1 because months are zero-indexed)
      const year = date.getFullYear();
      return `${day}/${month}/${year}`; // Return formatted date string with day, month, and year
    },
  },
  {
    headerName: "Patient ID",
    field: "PatientID",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Patient Name",
    field: "PatientName",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Client ID",
    field: "ClientID",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Client Name",
    field: "ClientName",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Contact Number",
    field: "ContactNumber",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Age",
    field: "age",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Gender",
    field: "Gender",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  // {
  //   headerName: "Visit No",
  //   field: "VisitNo",
  //   editable: false,
  //   cellStyle: { textAlign: "center" },
  // },
  {
    headerName: "Doctor ID",
    field: "DoctorID",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Doctor Name",
    field: "DoctorName",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  // {
  //   headerName: "Cash",
  //   field: "Cash",
  //   editable: false,
  //   cellStyle: { textAlign: "center" },
  // },
  {
    headerName: "PaymentMode ID",
    field: "PaymentModeID",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Gross Amount",
    field: "GrossAmount",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Discount",
    field: "Discount",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Net Amount",
    field: "NetAmount",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Received Amount",
    field: "ReceivedAmount",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Balance Amount",
    field: "BalanceAmount",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  // {
  //   headerName: "Barcode",
  //   field: "Barcode",
  //   editable: false,
  //   cellStyle: { textAlign: "center" },
  // },
];

const defaultColDef = {
  resizable: true,
  wrapText: true,
  sortable: true,
  editable: true,
  // flex: 1,
};

export default function BillingHelpPopup({ open, handleClose, handleBilling }) {

  const [rowData, setRowData] = useState([]);
  const [BillNo, setBillNo] = useState("");
  const [PatientID, setPatientID] = useState("");
  const [Gender, setGender] = useState("");
  const [DoctorID, setDoctorID] = useState("");
  const [loading, setLoading] = useState('');
  const [BillDateFrom, setBillDateFrom] = useState('');
  const [BillDateTo, setBillDateTo] = useState('');
  const [PatientName, setPatientName] = useState('');
  const [DoctorName, setDoctorName] = useState('');
  const [ContactNumber, setContactNumber] = useState('');
  const [ClientName, setClientName] = useState('');
  const [GrossAmount, setGrossAmount] = useState('');
  const [Discount, setDiscount] = useState('');
  const [NetAmount, setNetAmount] = useState('');
  const [ReceivedAmount, setReceivedAmount] = useState('');
  const [BalanceAmount, setBalanceAmount] = useState('');
  

  const handleSearchItem = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/BillHdrSearchCreteria`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ BillNo, PatientID, Gender, BillDateFrom, BillDateTo, DoctorID, company_code: sessionStorage.getItem("selectedCompanyCode"),
          PatientName, DoctorName, ContactNumber, ClientName, GrossAmount: GrossAmount ? GrossAmount : 0, Discount: Discount ? Discount : 0,
          NetAmount: NetAmount ? NetAmount : 0, ReceivedAmount : ReceivedAmount ? ReceivedAmount : 0, BalanceAmount: BalanceAmount ? BalanceAmount : 0
         })
      });
      if (response.ok) {
        const searchData = await response.json();
        const newRows = searchData.map((matchedItem) => ({
          BillNo: matchedItem.BillNo,
          BillDate: matchedItem.BillDate,
          PatientName: matchedItem.PatientName,
          PatientID: matchedItem.PatientID,
          ClientName: matchedItem.ClientName,
          ClientID: matchedItem.ClientID,
          age: matchedItem.age,
          ContactNumber: matchedItem.ContactNumber,
          VisitNo: matchedItem.VisitNo,
          Gender: matchedItem.Gender,
          DoctorName: matchedItem.DoctorName,
          DoctorID: matchedItem.DoctorID,
          GrossAmount: matchedItem.GrossAmount,
          PaymentModeID: matchedItem.PaymentModeID,
          NetAmount: matchedItem.NetAmount,
          Discount: matchedItem.Discount,
          BalanceAmount: matchedItem.BalanceAmount,
          ReceivedAmount: matchedItem.ReceivedAmount,
        }));

        const GrossAmount = newRows.reduce((sum, row) => sum + row.GrossAmount, 0);
        const NetAmount = newRows.reduce((sum, row) => sum + row.NetAmount, 0);
        const Discount = newRows.reduce((sum, row) => sum + row.Discount, 0);
        const BalanceAmount = newRows.reduce((sum, row) => sum + row.BalanceAmount, 0);
        const ReceivedAmount = newRows.reduce((sum, row) => sum + row.ReceivedAmount, 0);

        const totalRow = {
          BillNo: null,
          BillDate: "",
          PatientName: "",
          PatientID: "",
          ClientName: "",
          ClientID: "",
          age: null,
          ContactNumber: "",
          VisitNo: "",
          Gender: "",
          DoctorName: "",
          DoctorID: "",
          GrossAmount: GrossAmount,
          PaymentModeID: "Total",
          NetAmount: NetAmount,
          Discount: Discount,
          BalanceAmount: BalanceAmount,
          ReceivedAmount: ReceivedAmount,
        };

        setRowData([...newRows, totalRow]);
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
        setRowData([]);
        clearInputs([])
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
    setBillNo("");
    setDoctorID("");
    setPatientID("");
    setGender("");
  };
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
      BillNo: row.BillNo,
      BillDate: row.BillDate,
      PatientID: row.PatientID,
      PatientName: row.PatientName,
      ClientID: row.ClientID,
      ClientName: row.ClientName,
      ContactNumber: row.ContactNumber,
      Gender: row.Gender,
      VisitNo: row.VisitNo,
      DoctorID: row.DoctorID,
      DoctorName: row.DoctorName,
      Cash: row.Cash,
      Discount: row.Discount,
      GrossAmount: row.GrossAmount,
      NetAmount: row.NetAmount,
      PaymentModeID: row.PaymentModeID,
      ReceivedAmount: row.ReceivedAmount,
      BalanceAmount: row.BalanceAmount,
      Barcode: row.Barcode,
      Age: row.age
    }));
    handleBilling(selectedData);
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
            <div className="">
              {loading && <LoadingScreen />}
              <div className="modal mt-5 Topnav-screen popupadj popup" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-xl ps-5 p-1 pe-5" role="document">
                  <div className="modal-content">
                    <div class="row justify-content-center">
                      <div class="col-md-12 text-center">
                        <div className="p-0 bg-body-tertiary">
                          <div className=" mb-0 d-flex justify-content-between" >
                            <h1 align="left" className="">Billing  Help</h1>
                            <button onClick={handleClose} className=" btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
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
                              type="date"
                              id="ItemCode"
                              className="exp-input-field form-control"
                              placeholder="Bill Date From"
                              title="Bill Date From"
                              value={BillDateFrom}
                              onChange={(e) => setBillDateFrom(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="date"
                              id="ItemCode"
                              className="exp-input-field form-control"
                              placeholder="Bill Date To"
                              title="Bill Date To"
                              value={BillDateTo}
                              onChange={(e) => setBillDateTo(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="ItemCode"
                              className="exp-input-field form-control"
                              placeholder="Bill No"
                              value={BillNo}
                              onChange={(e) => setBillNo(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="Variant"
                              className="exp-input-field form-control"
                              placeholder="Patient ID"
                              value={PatientID}
                              onChange={(e) => setPatientID(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="ItemName"
                              className="exp-input-field form-control"
                              placeholder="Gender"
                              value={Gender}
                              onChange={(e) => setGender(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          {/* <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="ShortName"
                              className="exp-input-field form-control"
                              placeholder="Doctor ID"
                              value={DoctorID}
                              onChange={(e) => setDoctorID(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div> */}
                          </div>
                          <div className="row ms-3 me-3">
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="ShortName"
                              className="exp-input-field form-control"
                              placeholder="Doctor ID"
                              value={DoctorID}
                              onChange={(e) => setDoctorID(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="ShortName"
                              className="exp-input-field form-control"
                              placeholder="Doctor Name"
                              value={DoctorName}
                              onChange={(e) => setDoctorName(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="ShortName"
                              className="exp-input-field form-control"
                              placeholder="Patient Name"
                              value={PatientName}
                              onChange={(e) => setPatientName(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="ShortName"
                              className="exp-input-field form-control"
                              placeholder="Client Name"
                              value={ClientName}
                              onChange={(e) => setClientName(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="ShortName"
                              className="exp-input-field form-control"
                              placeholder="Contact Number"
                              value={ContactNumber}
                              onChange={(e) => setContactNumber(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          </div>
                          <div className="row ms-3 me-3">
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="ShortName"
                              className="exp-input-field form-control"
                              placeholder="Gross Amount"
                              value={GrossAmount}
                              onChange={(e) => setGrossAmount(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="ShortName"
                              className="exp-input-field form-control"
                              placeholder="Discount"
                              value={Discount}
                              onChange={(e) => setDiscount(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="ShortName"
                              className="exp-input-field form-control"
                              placeholder="Net Amount"
                              value={NetAmount}
                              onChange={(e) => setNetAmount(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="ShortName"
                              className="exp-input-field form-control"
                              placeholder="Received Amount"
                              value={ReceivedAmount}
                              onChange={(e) => setReceivedAmount(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="ShortName"
                              className="exp-input-field form-control"
                              placeholder="Balance Amount"
                              value={BalanceAmount}
                              onChange={(e) => setBalanceAmount(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          </div>
                          <div className="row ms-3 me-3">
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
          </div>
        </fieldset>
      )}
    </div>
  );
}
