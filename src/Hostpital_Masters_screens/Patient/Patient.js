import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "../../apps.css";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import labels from "../../Labels";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showConfirmationToast } from '../../ToastConfirmation';
import LoadingScreen from '../../Loading';
import Select from "react-select";

const config = require('../../Apiconfig');


function AttriDetGrid() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [PatientID, setPatientID] = useState("");
  const [PatientName, setPatientName] = useState("");
  const [DOB, setDOB] = useState("");
  const [ContactNumber, setContactNumber] = useState("");
  const [RCHID, setRCHID] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [Genderdrop, setGenderdrop] = useState([]);
  const [Address, setAddress] = useState("");
  const [Gender, setGender] = useState("");
  const [editedData, setEditedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createdBy, setCreatedBy] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");
  const [citydrop, setcitydrop] = useState([]);
  const [statedrop, setstatedrop] = useState([]);
  const [countrydrop, setcountrydrop] = useState([]);
  const [genderdrop, setgenderdrop] = useState([]);

  //code added by Harish purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const attributePermission = permissions
    .filter(permission => permission.screen_type === 'SearchPatient')
    .map(permission => permission.permission_type.toLowerCase());

  const reloadGridData = () => {
    window.location.reload();
  };

  const handleSearch = async () => {
    setLoading(true);
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    try {
      const response = await fetch(`${config.apiBaseUrl}/PatientSearchCreteria`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            PatientID,
            PatientName,
            DOB,
            RCHID,
            ContactNumber,
            Gender,
            address_1: Address,
            company_code: company_code,
          }), 
        }
      );

      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
      } else if (response.GenderType === 404) {
        console.log("Data not found");
        setRowData([]);
        toast.warning("Data not found");
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("Error fetching search data:", error);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/city`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((data) => {
        const city = data.map(option => option.attributedetails_name);
        setcitydrop(city);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/state`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((data) => {
        const state = data.map(option => option.attributedetails_name);
        setstatedrop(state);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

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
      .then((data) => {
        const country = data.map(option => option.attributedetails_name);
        setcountrydrop(country);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/Gender`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setGenderdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/Gender`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((data) => {
        const gender = data.map(option => option.attributedetails_name);
        setgenderdrop(gender);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionGender = Genderdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeGender = (selectedOption) => {
    setSelectedGender(selectedOption);
    setGender(selectedOption ? selectedOption.value : '')
  };

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: "Patient ID",
      field: "PatientID",
      cellStyle: { textAlign: "center" },
      cellEditorParams: {
        maxLength: 18,
      },
      cellRenderer: (params) => {
        const handleClick = () => {
          handleNavigateWithRowData(params.data);
        };
        return (
          <span
            style={{ cursor: "pointer" }}
            onClick={handleClick}
          >
            {params.value}
          </span>
        );
      }
    },
    {
      headerName: "Patient Name",
      field: "PatientName",
      cellStyle: { textAlign: "center" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "DOB",
      field: "DOB",
      editable: true,
    },
    {
      headerName: "Age",
      field: "age",
      editable: true,
    },
    {
      headerName: "Contact Number",
      field: "ContactNumber",
      editable: true,
      cellStyle: { textAlign: "center" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Gender",
      field: "Gender",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: genderdrop
      },
    },
    {
      headerName: "RCHID",
      field: "RCHID",
      editable: true,
      cellStyle: { textAlign: "center" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Address 1",
      field: "address_1",
      editable: true,
      cellStyle: { textAlign: "center" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Address 2",
      field: "address_2",
      editable: true,
      cellStyle: { textAlign: "center" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Address 3",
      field: "address_3",
      editable: true,
      cellStyle: { textAlign: "center" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "City",
      field: "city",
      editable: true,
      cellStyle: { textAlign: "center" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: citydrop
      },
    },
    {
      headerName: "State",
      field: "state",
      editable: true,
      cellStyle: { textAlign: "center" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: statedrop
      },
    },
    {
      headerName: "Country",
      field: "country",
      editable: true,
      cellStyle: { textAlign: "center" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: countrydrop
      },
    },
  ];

  const defaultColDef = {
    resizable: true,
    wrapText: true,
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const generateReport = () => {
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      toast.warning("Please select at least one row to generate a report");
      return
    };
    const reportData = selectedRows.map((row) => {
      const safeValue = (val) => (val !== undefined && val !== null ? val : '');
      return {

        "Patient ID": safeValue(row.PatientID),
        "Patient Name": safeValue(row.PatientName),
        "D.O.B": safeValue(row.DOB),
        "Age": safeValue(row.age),
        "Contact Number": safeValue(row.ContactNumber),
        "Gender": safeValue(row.Gender),
        "RCHID": safeValue(row.RCHID),
        "Address 1": safeValue(row.address_1),
        "Address 2": safeValue(row.address_2),
        "Address 3": safeValue(row.address_3),
        "City": safeValue(row.city),
        "State": safeValue(row.state),
        "Country": safeValue(row.country),

      };
    });

    const reportWindow = window.open("", "_blank");
    reportWindow.document.write("<html><head><title>Patient</title>");
    reportWindow.document.write("<style>");
    reportWindow.document.write(`
      body {
          font-family: Arial, sans-serif;
          margin: 20px;
      }
      h1 {
          color: maroon;
          text-align: center;
          font-size: 24px;
          margin-bottom: 30px;
          text-decoration: underline;
      }
      table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
      }
      th, td {
          padding: 10px;
          text-align: left;
          border: 1px solid #ddd;
          vertical-align: top;
      }
      th {
          background-color: maroon;
          color: white;
          font-weight: bold;
      }
      td {
          background-color: #fdd9b5;
      }
      tr:nth-child(even) td {
          background-color: #fff0e1;
      }
      .report-button {
          display: block;
          width: 150px;
          margin: 20px auto;
          padding: 10px;
          background-color: maroon;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 16px;
          text-align: center;
          border-radius: 5px;
      }
      .report-button:hover {
          background-color: darkred;
      }
      @media print {
          .report-button {
              display: none;
          }
          body {
              margin: 0;
              padding: 0;
          }
      }
    `);
    reportWindow.document.write("</style></head><body>");
    reportWindow.document.write("<h1><u>Patient Information</u></h1>");

    // Create table with headers
    reportWindow.document.write("<table><thead><tr>");
    Object.keys(reportData[0]).forEach((key) => {
      reportWindow.document.write(`<th>${key}</th>`);
    });
    reportWindow.document.write("</tr></thead><tbody>");

    // Populate the rows
    reportData.forEach((row) => {
      reportWindow.document.write("<tr>");
      Object.values(row).forEach((value) => {
        reportWindow.document.write(`<td>${value}</td>`);
      });
      reportWindow.document.write("</tr>");
    });

    reportWindow.document.write("</tbody></table>");

    reportWindow.document.write(
      '<button class="report-button" onclick="window.print()">Print</button>'
    );
    reportWindow.document.write("</body></html>");
    reportWindow.document.close();
  };

  const handleNavigatesToForm = () => {
    navigate("/AddPatientInfo", { state: { mode: "create" } }); // Pass selectedRows as props to the Input component
  };

  const handleNavigateWithRowData = (selectedRow) => {
    navigate("/AddPatientInfo", { state: { mode: "update", selectedRow } });
  };

  const onSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };

  const onCellValueChanged = (params) => {
    const updatedRowData = [...rowData];
    const rowIndex = updatedRowData.findIndex(
      (row) => row.PatientID === params.data.PatientID
    );

    if (rowIndex !== -1) {
      updatedRowData[rowIndex][params.colDef.field] = params.newValue;
      setRowData(updatedRowData);

      setEditedData((prevData) => {
        const existingIndex = prevData.findIndex(
          (item) => item.PatientID === params.data.PatientID
        );

        if (existingIndex !== -1) {
          const updatedEdited = [...prevData];
          updatedEdited[existingIndex] = updatedRowData[rowIndex];
          return updatedEdited;
        } else {
          return [...prevData, updatedRowData[rowIndex]];
        }
      });
    }
  };

  const saveEditedData = async () => {
    const selectedRowsData = editedData.filter(row => selectedRows.some(selectedRow => selectedRow.PatientID === row.PatientID));
    if (selectedRowsData.length === 0) {
      toast.warning("Please select a row to update its data");
      return;
    }

    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        setLoading(true);
        try {

          const modified_by = sessionStorage.getItem('selectedUserCode');
          const company_code = sessionStorage.getItem("selectedCompanyCode");

          const response = await fetch(`${config.apiBaseUrl}/PatientSearchUpdate2`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code,
              "modified-by": modified_by,
            },
            body: JSON.stringify({ editedData: selectedRowsData })
          });

          if (response.status === 200) {
            setTimeout(() => {
              toast.success("Data Updated Successfully");
              handleSearch();
            }, 3000);
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to update");
          }
        } catch (error) {
          console.error("Error saving data:", error);
          toast.error("Error Updating Data: " + error.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.info("Data update cancelled.");
      }
    );
  };

  const deleteSelectedRows = async () => {
    const selectedRows = gridApi.getSelectedRows();

    if (selectedRows.length === 0) {
      toast.warning("Please select atleast One Row to Delete")
      return;
    }

    const modified_by = sessionStorage.getItem('selectedUserCode');
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {
        setLoading(true);
        try {
          const response = await fetch(`${config.apiBaseUrl}/PatientMasterDelete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code,
              "Modified-By": modified_by
            },
            body: JSON.stringify({ deletedPatientID: selectedRows }),
            "company_code": company_code,
            "modified_by": modified_by
          });

          if (response.ok) {
            toast.success("Data Deleted successfully")
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to Delete");
          }
        } catch (error) {
          console.error("Error deleting rows:", error);
          toast.error('Error Deleting Data: ' + error.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.info("Data Delete cancelled.");
      }
    );
  };


  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const handleRowClick = (rowData) => {
    setCreatedBy(rowData.created_by);
    setModifiedBy(rowData.modified_by);
    const formattedCreatedDate = formatDate(rowData.created_date);
    const formattedModifiedDate = formatDate(rowData.modified_date);
    setCreatedDate(formattedCreatedDate);
    setModifiedDate(formattedModifiedDate);
  };

  // Handler for when a row is selected
  const onRowSelected = (event) => {
    if (event.node.isSelected()) {
      handleRowClick(event.data);
    }
  };

  return (
    <div className="container-fluid Topnav-screen">
      <div>
        {loading && <LoadingScreen />}

        <ToastContainer position="top-right" className="toast-design" theme="colored" />
        <div className="shadow-lg p-1 bg-body-tertiary rounded  mb-2 mt-2">
          <div className=" d-flex justify-content-between  ">
            <div class="d-flex justify-content-start">
              <h1 align="left" className="purbut me-5">
                Patient
              </h1>
            </div>
            <div className="d-flex justify-content-end purbut me-3">
              {["add", "all permission"].some((permission) =>
                attributePermission.includes(permission)
              ) && (
                  <addbutton
                    className="purbut"
                    onClick={handleNavigatesToForm}
                    required
                    title="Add Patient"
                  >
                    {" "}
                    <i class="fa-solid fa-user-plus"></i>{" "}
                  </addbutton>
                )}
              {["delete", "all permission"].some((permission) =>
                attributePermission.includes(permission)
              ) && (
                  <delbutton
                    className="purbut"
                    onClick={deleteSelectedRows}
                    required
                    title="Delete Patient"
                  >
                    <i class="fa-solid fa-user-minus"></i>
                  </delbutton>
                )}
              {["update", "all permission"].some((permission) =>
                attributePermission.includes(permission)
              ) && (
                  <savebutton
                    className="purbut"
                    onClick={saveEditedData}
                    required
                    title="Update Patient"
                  >
                    <i class="fa-solid fa-floppy-disk"></i>
                  </savebutton>
                )}
              {["all permission", "view"].some((permission) =>
                attributePermission.includes(permission)
              ) && (
                  <printbutton
                    class="purbut"
                    onClick={generateReport}
                    required
                    title="Generate Report"
                  >
                    <i class="fa-solid fa-print"></i>
                  </printbutton>
                )}
            </div>
            <div class="mobileview">
              <div class="d-flex justify-content-between">
                <div className="d-flex justify-content-start">
                  <h1 align="left" className="h1">
                    Patient
                  </h1>
                </div>
                <div class="dropdown mt-1 me-5" >
                  <button
                    class="btn btn-primary dropdown-toggle p-1"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i class="fa-solid fa-list"></i>
                  </button>
                  <ul class="dropdown-menu menu">
                    <li class="iconbutton d-flex justify-content-center text-success">
                      {['add', 'all permission'].some(permission => attributePermission.includes(permission)) && (
                        <icon
                          class="icon"
                          onClick={handleNavigatesToForm}
                        >
                          <i class="fa-solid fa-user-plus"></i>
                          {" "}
                        </icon>
                      )}
                    </li>
                    <li class="iconbutton  d-flex justify-content-center text-danger">
                      {['delete', 'all permission'].some(permission => attributePermission.includes(permission)) && (
                        <icon
                          class="icon"
                          onClick={deleteSelectedRows}
                        >

                          <i class="fa-solid fa-user-minus"></i>
                        </icon>
                      )}
                    </li>
                    <li class="iconbutton  d-flex justify-content-center text-primary ">
                      {['update', 'all permission'].some(permission => attributePermission.includes(permission)) && (
                        <icon
                          class="icon"
                          onClick={saveEditedData}
                        >
                          <i class="fa-solid fa-floppy-disk"></i>
                        </icon>
                      )}
                    </li>
                    <li class="iconbutton  d-flex justify-content-center ">
                      {['all permission', 'view'].some(permission => attributePermission.includes(permission)) && (
                        <icon
                          class="icon"
                          onClick={generateReport}
                        >

                          <i class="fa-solid fa-print"></i>
                        </icon>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="shadow-lg p-1 bg-body-tertiary rounded  mb-2 mt-2">
          <div className="row ms-4 mt-3 mb-3 me-4">
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="locno" class="exp-form-labels">
                  Patient ID
                </label>
                <input
                  id="locno"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required
                  title="Please fill the header code here"
                  value={PatientID}
                  maxLength={18}
                  onChange={(e) => setPatientID(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>

            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="lname" class="exp-form-labels">
                  Patient Name
                </label>
                <input
                  id="lname"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required
                  title="Please fill the sub code here"
                  value={PatientName}
                  maxLength={18}
                  onChange={(e) => setPatientName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>

            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="Detail" class="exp-form-labels">
                  Gender
                </label>
                <Select
                  id="GenderType"
                  value={selectedGender}
                  onChange={handleChangeGender}
                  options={filteredOptionGender}
                  className="exp-input-field"
                />
              </div>
            </div>

            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="state" class="exp-form-labels">
                  DOB
                </label>
                <input
                  id="DOB"
                  className="exp-input-field form-control"
                  type="date"
                  placeholder=""
                  required
                  title="Please fill the description here"
                  value={DOB}
                  maxLength={250}
                  onChange={(e) => setDOB(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="state" class="exp-form-labels">
                  ContactNumber
                </label>
                <input
                  id="state"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required
                  title="Please fill the description here"
                  value={ContactNumber}
                  maxLength={10}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setContactNumber(value);
                    }
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="state" class="exp-form-labels">
                  RCHID
                </label>
                <input
                  id="state"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required
                  title="Please fill the description here"
                  value={RCHID}
                  maxLength={250}
                  onChange={(e) => setRCHID(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="state" class="exp-form-labels">
                  Address
                </label>
                <input
                  id="state"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required
                  title="Please fill the description here"
                  value={Address}
                  maxLength={250}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>
            <div className="col-md-2 form-group mt-4">
              <div class="exp-form-floating">
                <div class=" d-flex justify-content-center ">
                  <div class="">
                    <icon
                      className="popups-btn fs-6 p-3"
                      onClick={handleSearch}
                      required
                      title="Search"
                    >
                      <i className="fas fa-search"></i>
                    </icon>
                  </div>
                  <div>
                    <icon
                      className="popups-btn fs-6 p-3"
                      onClick={reloadGridData}
                      required
                      title="Refresh"
                    >
                      <FontAwesomeIcon icon="fa-solid fa-arrow-rotate-right" />
                    </icon>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="ag-theme-alpine" style={{ height: 450, width: "100%" }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              rowSelection="multiple"
              pagination={true}
              paginationAutoPageSize={true}
              onSelectionChanged={onSelectionChanged}
              onCellValueChanged={onCellValueChanged}
              onRowSelected={onRowSelected}
            />
          </div>
        </div>
      </div>

      <div className="shadow-lg p-2 bg-body-tertiary rounded mt-2 mb-2">
        <div className="row ms-2">
          <div className="d-flex justify-content-start">
            <p className="col-md-6">
              {labels.createdBy}: {createdBy}
            </p>
            <p className="col-md-">
              {labels.createdDate}: {createdDate}
            </p>
          </div>
          <div className="d-flex justify-content-start">
            <p className="col-md-6">
              {labels.modifiedBy}: {modifiedBy}
            </p>
            <p className="col-md-6">
              {labels.modifiedDate}: {modifiedDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttriDetGrid;
