import React, { useState } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import './EmployeeLoan.css'
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import { showConfirmationToast } from '../ToastConfirmation';
import '../apps.css'

const config = require('../Apiconfig');

function Input({ }) {

  const [GradeID, setGradeID] = useState('');
  const [GradeName, setGradeName] = useState('');
  const [Basic, setBasic] = useState('');
  const [SalaryrrangeFrom, setSalaryrrangeFrom] = useState('');
  const [SalaryrangeTo, setSalaryrangeTo] = useState('');
  const [HRA, setHRA] = useState('');
  const [Conveyance, setConveyance] = useState('');
  const [Medical, setMedical] = useState('');
  const [Special_Allowance, setSpecial_Allowance] = useState('');
  const [Company_Pf_Contribution, setCompany_Pf_Contribution] = useState('');
  const [Bonus_Arrears, setBonus_Arrears] = useState('');
  const [Other_Allowance, setOther_Allowance] = useState('');
  const [LeaveDeduction, setLeaveDeduction] = useState('');
  const [minimum_take_salary, setMinimumTakeSalary] = useState('');
  const [ctc_currency, setCtcCurrency] = useState('');
  const [otherDeductions, setotherDeductions] = useState('');
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [gridApi, setGridApi] = useState(null);
  const [rowData, setrowData] = useState([]);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [showAsterisk, setShowAsterisk] = useState(true);

  // selected input fields
  const [Gradeid, setGradeid] = useState('');
  const [Gradename, setGradename] = useState('');
  const [basic, setbasic] = useState('');
  const [salaryrrangefrom, setsalaryrrangefrom] = useState('');
  const [salaryrangeto, setsalaryrangeto] = useState('');
  const [Hra, setHra] = useState('');
  const [conveyance, setconveyance] = useState('');
  const [medical, setmedical] = useState('');
  const [SpecialAllowance, setSpecialAllowance] = useState('');
  const [CompanyPfContribution, setCompanyPfContribution] = useState('');
  const [BonusArrears, setBonusArrears] = useState('');
  const [OtherAllowance, setOtherAllowance] = useState('');
  const [Leavededuction, setLeavededuction] = useState('');
  const [otherdeductions, setotherdeductions] = useState('');
  const [ctccurrency, setCurrency] = useState('');
  const [minimumtakesalary, setMinimumSalary] = useState('');

  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleNavigateWithRowData = (selectedRow) => {
    navigate("/EmployeeGrade", { state: { mode: "update", selectedRow } });
  };

  const handleReload = () => {
    window.location.reload();
  }

  const reloadGridData = () => {
    setrowData([]);
  };

  const columnDefs = [
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => {
        const cellWidth = params.column.getActualWidth();
        const isWideEnough = cellWidth > 20;
        const showIcons = isWideEnough;
        return (
          <div className="position-relative d-flex align-items-center" style={{ minHeight: '100%', justifyContent: 'center' }}>
            {showIcons && (
              <>
                <span
                  className="icon mx-2"
                  onClick={() => saveEditedData(params.data, params.node.data)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-regular fa-floppy-disk"></i>
                </span>

                <span
                  className="icon mx-2"
                  onClick={() => deleteSelectedRows(params.data)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-trash"></i>
                </span>
              </>
            )}
          </div>
        );
      },
    },
    {
      headerName: "Grade ID",
      field: "GradeID",
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 50,
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
      },
    },
    {
      headerName: "Grade Name",
      field: "GradeName",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Salary Range From",
      field: "salary_range_from",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Salary Range To",
      field: "salary_range_to",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Basic",
      field: "Basic",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "HRA",
      field: "HRA",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Conveyance",
      field: "Conveyance",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Medical",
      field: "Medical",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Special Allowance",
      field: "Special_Allowance",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Company PF Contribution",
      field: "Company_Pf_Contribution",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Bonus/Arrears",
      field: "Bonus_Arrears",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Other Allowance",
      field: "Other_Allowance",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Leave Deductions",
      field: "LeaveDeduction",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Other Deductions",
      field: "otherDeductions",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "CTC Currency",
      field: "ctc_currency",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Minimum Take Salary",
      field: "minimum_take_salary",
      filter: 'agTextColumnFilter',
      editable: true
    },
  ]

  const gridOptions = {
    pagination: true,
  };

  const handleSave = async () => {
    if (!Gradeid || !Gradename || !basic || !salaryrrangefrom || !salaryrangeto) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    try {

      const Header = {
        GradeID: Gradeid,
        GradeName: Gradename,
        Basic: basic,
        HRA: Hra,
        Conveyance: parseFloat(conveyance),
        Medical: parseFloat(medical),
        Special_Allowance: parseFloat(SpecialAllowance),
        Company_Pf_Contribution: parseFloat(CompanyPfContribution),
        Bonus_Arrears: parseFloat(BonusArrears),
        Other_Allowance: parseFloat(OtherAllowance),
        LeaveDeduction: parseFloat(Leavededuction),
        otherDeductions: parseFloat(otherdeductions),
        salary_range_from: salaryrrangefrom,
        salary_range_to: salaryrangeto,
        ctc_currency: ctccurrency,
        minimum_take_salary: parseFloat(minimumtakesalary),
        company_code: sessionStorage.getItem('selectedCompanyCode'),
        created_by: sessionStorage.getItem('selectedUserCode')
      };

      const response = await fetch(`${config.apiBaseUrl}/addGrade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Header),
      });
      if (response.status === 200) {
        console.log("Data inserted successfully");
        setTimeout(() => {
          toast.success("Data inserted successfully!", {
            onClose: () => window.location.reload(),
          });
        }, 1000);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    }
  };

  const handleSearch = async () => {

    try {
      const body = {
        GradeID: GradeID,
        GradeName: GradeName,
        Basic: parseFloat(Basic),
        HRA: parseFloat(HRA),
        Conveyance: parseFloat(Conveyance),
        Medical: parseFloat(Medical),
        Special_Allowance: parseFloat(Special_Allowance),
        Company_Pf_Contribution: parseFloat(Company_Pf_Contribution),
        Bonus_Arrears: parseFloat(Bonus_Arrears),
        OtherAllowance: parseFloat(Other_Allowance),
        LeaveDeduction: parseFloat(LeaveDeduction),
        otherDeductions: parseFloat(otherDeductions),
        ctc_currency: ctc_currency,
        salary_range_from: parseFloat(SalaryrrangeFrom),
        salary_range_to: parseFloat(SalaryrangeTo),
        minimum_take_salary: parseFloat(minimum_take_salary),
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }
      const response = await fetch(`${config.apiBaseUrl}/GradeSC`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body) // Send company_no and company_name as search criteria
      });
      if (response.ok) {
        const fetchedData = await response.json();
        const newRows = fetchedData.map((matchedItem) => ({


          GradeID: matchedItem.GradeID,
          GradeName: matchedItem.GradeName,
          Basic: matchedItem.Basic,
          HRA: matchedItem.HRA,
          Conveyance: matchedItem.Conveyance,
          Medical: matchedItem.Medical,
          Special_Allowance: matchedItem.Special_Allowance,
          Company_Pf_Contribution: matchedItem.Company_Pf_Contribution,
          Bonus_Arrears: matchedItem.Bonus_Arrears,
          Other_Allowance: matchedItem.Other_Allowance,
          LeaveDeduction: matchedItem.LeaveDeduction,
          otherDeductions: matchedItem.otherDeductions,
          salary_range_from: matchedItem.salary_range_from,
          salary_range_to: matchedItem.salary_range_to,
          ctc_currency: matchedItem.ctc_currency,
          minimum_take_salary: matchedItem.minimum_take_salary,
        }));
        setrowData(newRows);
      } else if (response.status === 404) {
        console.log("Data Not found");
        toast.warning("Data Not found");
        setrowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        console.error(errorResponse.details || errorResponse.message);
        setrowData([]);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  const saveEditedData = async () => {
showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
    try {
      const company_code = sessionStorage.getItem('selectedCompanyCode');
      const modified_by = sessionStorage.getItem('selectedUserCode');

      const dataToSend = { editedData: Array.isArray(rowData) ? rowData : [rowData] };

      const response = await fetch(`${config.apiBaseUrl}/updateGrade `, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "company_code": company_code,
          "modified_by": modified_by
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        toast.success("Data updated successfully", {
          onClose: () => handleSearch(), // Runs handleSearch when toast closes
        });
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
      }
    } catch (error) {
      console.error("Error deleting rows:", error);
      toast.error('Error Deleting Data: ' + error.message);
    }
     },
          () => {
            toast.info("Data updated cancelled.");
          }
        );
  };

  const deleteSelectedRows = async (rowData) => {
    const GradeIDDelete = { GradeIDToDelete: Array.isArray(rowData) ? rowData : [rowData] };
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    showConfirmationToast(
      "Are you sure you want to delete the data in the selected rows?",
      async () => {
        try {
          const response = await fetch(`${config.apiBaseUrl}/deleteGrade`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code,

            },
            body: JSON.stringify(GradeIDDelete),
          });

          if (response.ok) {
            setTimeout(() => {
              toast.success("Data deleted successfully");
              handleSearch();
            }, 3000);
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to delete data");
          }
        } catch (error) {
          console.error("Error deleting rows:", error);
          toast.error("Error deleting data: " + error.message);
        }
      },
      () => {
        toast.info("Data delete cancelled.");
      }
    );
  };


  // const onCellValueChanged = (params) => {
  //   const updatedRowData = [...rowData];
  //   const rowIndex = updatedRowData.findIndex(
  //     (row) => row.ProjectID === params.data.ProjectID
  //   );
  //   if (rowIndex !== -1) {
  //     updatedRowData[rowIndex][params.colDef.field] = params.newValue;
  //     setrowData(updatedRowData);

  //     // Add the edited row data to the state
  //     setEditedData((prevData) => [...prevData, updatedRowData[rowIndex]]);
  //   }
  // };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  // const onSelectionChanged = () => {
  //   const selectedNodes = gridApi.getSelectedNodes();
  //   const selectedData = selectedNodes.map((node) => node.data);
  //   setSelectedRows(selectedData);
  // };


  return (
    <div class="container-fluid Topnav-screen ">
      <div className="">
        <div class="">
          <ToastContainer position="top-right" className="toast-design" theme="colored" />
          <div className="shadow-lg p-0 bg-white rounded">
            <div className="purbut mb-0 d-flex justify-content-between" >
              <h1 align="left" class="purbut">Add Grade Details</h1>
              <div className="col-md-1 mt-3 me-5 purbut">
                <div class=" d-flex justify-content-end  me-3">
                  <div >
                  </div>
                  <div className="me-1 ">
                    {saveButtonVisible && (
                      <savebutton className="" onClick={handleSave}
                        required title="save">
                        <i class="fa-regular fa-floppy-disk"></i> </savebutton>
                    )}
                  </div>
                  <div className="ms-1">
                  </div>
                  <div className="col-md-1">
                    <div className="ms-1">
                      <reloadbutton
                        className="purbut"
                        onClick={handleReload}
                        title="Reload" style={{ cursor: "pointer" }}>
                        <i className="fa-solid fa-arrow-rotate-right"></i>
                      </reloadbutton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="shadow-lg  bg-white rounded-top mt-2  pt-3">
            <button className="shadow-lg  addTab1 mt-2 rounded-bottom rounded-bottom-0 text-white" > Grade Details</button>
          </div>
          <div class=" mb-4">
            <div className="shadow-lg p-3 bg-white rounded-bottom  mb-2">
              <div class="row ms-2 me-2">
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="cname" className={`${error && !Gradeid ? 'red' : ''}`}>Grade ID{showAsterisk && <span className="text-danger">*</span>}</label>
                      </div>
                    </div>
                    <input
                      id=" Grade ID"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please Enter the Grade ID"
                      value={Gradeid}
                      onChange={(e) => setGradeid(e.target.value)}
                      // onKeyPress={handleKeyPress}
                      maxLength={50}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="sname" className={`${error && !Gradename ? 'red' : ''}`}>  Grade Name {showAsterisk && <span className="text-danger">*</span>}</label>
                      </div>
                    </div>
                    <input
                      id="Grade Name "
                      class="exp-input-field form-control"
                      type="Text"
                      placeholder=""
                      required title="Please Enter the Grade Name"
                      value={Gradename}
                      onChange={(e) => setGradename(e.target.value)}
                      maxLength={100}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div> <label for="add1" className={`${error && !salaryrrangefrom ? 'red' : ''}`}>Salary Range From{showAsterisk && <span className="text-danger">*</span>}</label>
                      </div>
                    </div>
                    <input
                      id=" Basic"
                      class="exp-input-field form-control"
                      type="number"
                      placeholder=""
                      required title="Please Enter the Salary Range From Amount"
                      value={salaryrrangefrom}
                      onChange={(e) => setsalaryrrangefrom(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div> <label for="add1" className={`${error && !salaryrangeto ? 'red' : ''}`}>Salary Range To{showAsterisk && <span className="text-danger">*</span>}</label>
                      </div>
                    </div>
                    <input
                      id="Basic"
                      class="exp-input-field form-control"
                      type="Number"
                      placeholder=""
                      required title="Please Enter the Salary Range To Amount"
                      value={salaryrangeto}
                      onChange={(e) => setsalaryrangeto(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div> <label for="add1" className={`${error && !basic ? 'red' : ''}`}>Basic{showAsterisk && <span className="text-danger">*</span>}</label>
                      </div>
                    </div>
                    <input
                      id=" Basic"
                      class="exp-input-field form-control"
                      type="Number"
                      placeholder=""
                      required title="Please Enter the Basic Amount"
                      value={basic}
                      onChange={(e) => setbasic(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="add2" className={`${error && !Hra ? 'red' : ''}`}>HRA{showAsterisk && <span className="text-danger">*</span>}</label>
                      </div>
                    </div>
                    <input
                      id="HRA "
                      class="exp-input-field form-control"
                      type="Number"
                      placeholder=""
                      required title="Please Enter the HRA Allowance Amount"
                      value={Hra}
                      onChange={(e) => setHra(e.target.value)}
                      maxLength={250}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="add3">Conveyance</label>
                    <input
                      id="add3"
                      class="exp-input-field form-control"
                      type="Number"
                      placeholder=""
                      required title="Please Enter the Conveyance Allowance Amount"
                      value={conveyance}
                      onChange={(e) => setconveyance(e.target.value)}
                      maxLength={250}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label For="city" >Medical</label>
                      </div>
                    </div>
                    <input
                      id="add3"
                      class="exp-input-field form-control"
                      type="Number"
                      placeholder=""
                      required title="Please Enter the Medical Allowance Amount"
                      value={medical}
                      onChange={(e) => setmedical(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="add3" className={`${error && !SpecialAllowance ? 'red' : ''}`}>Special Allowance{showAsterisk && <span className="text-danger">*</span>}</label>
                    <input
                      id="add3"
                      class="exp-input-field form-control"
                      type="Number"
                      placeholder=""
                      required title="Please Enter the Special Allowance"
                      value={SpecialAllowance}
                      onChange={(e) => setSpecialAllowance(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="add3" className={`${error && !CompanyPfContribution ? 'red' : ''}`}>  Company PF Contribution{showAsterisk && <span className="text-danger">*</span>}</label>
                    <input
                      id="add3"
                      class="exp-input-field form-control"
                      type="Number"
                      placeholder=""
                      required title="Please Enter the  Company PF Contribution"
                      value={CompanyPfContribution}
                      onChange={(e) => setCompanyPfContribution(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="add3" > Bonus / Arrears</label>
                    <input
                      id="add3"
                      class="exp-input-field form-control"
                      type="Number"
                      placeholder=""
                      required title="Please Enter the Bonus / Arrears"
                      value={BonusArrears}
                      onChange={(e) => setBonusArrears(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="add3" >   Other Allowance</label>
                    <input
                      id="add3"
                      class="exp-input-field form-control"
                      type="Number"
                      placeholder=""
                      required title="Please Enter the Other Allowance"
                      value={OtherAllowance}
                      onChange={(e) => setOtherAllowance(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="add3" > Leave Deductions</label>
                    <div>
                    </div>
                    <input
                      id="add3"
                      class="exp-input-field form-control"
                      type="Number"
                      placeholder=""
                      required title="Please Enter the Leave Deductions"
                      value={Leavededuction}
                      onChange={(e) => setLeavededuction(e.target.value)}
                      maxLength={250}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="add3" >  Other Deductions</label>
                    <input
                      id="add3"
                      class="exp-input-field form-control"
                      type="Number"
                      placeholder=""
                      required title="Please Enter the Other Deductions"
                      value={otherdeductions}
                      onChange={(e) => setotherdeductions(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="add3" className={`${error && !ctccurrency ? 'red' : ''}`}> CTC Currency{showAsterisk && <span className="text-danger">*</span>}</label>
                    <input
                      id="add3"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please Enter the CTC Currency"
                      value={ctccurrency}
                      onChange={(e) => setCurrency(e.target.value)}
                      maxLength={10}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="add3" >Minimum Take Salary</label>
                    <input
                      id="add3"
                      class="exp-input-field form-control"
                      type="Number"
                      placeholder=""
                      required title="Please Enter the  Minimum Take Salary"
                      value={minimumtakesalary}
                      onChange={(e) => setMinimumSalary(e.target.value)}

                    />
                  </div>
                </div>
                <div class="col-md-3 form-group d-flex justify-content-start mt-4 mb-4">
                </div>
              </div>
            </div>
            <div className="shadow-lg p-3 bg-light rounded-bottom  mb-2">
              <div className="pe-0 " style={{ width: "150px" }}>
                <h6 className="">Search Criteria:</h6>
              </div>
              <div class="row ms-2 me-2">
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div><label for="cname" class="exp-form-labels">
                        Grade ID
                      </label></div>
                    </div>
                    <input
                      id=" GradeID"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please Enter the Grade ID"
                      value={GradeID}
                      onChange={(e) => setGradeID(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="sname" class="exp-form-labels">
                          Grade Name
                        </label> </div>
                    </div>
                    <input
                      id="GradeName"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please Enter the Grade Name"
                      value={GradeName}
                      onChange={(e) => setGradeName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div> <label for="sname" class="exp-form-labels">Salary Range From</label>
                      </div>
                    </div>
                    <input
                      id=" Basic"
                      class="exp-input-field form-control"
                      type="number"
                      placeholder=""
                      required title="Please Enter the Salary Range Amount"
                      value={SalaryrrangeFrom}
                      onChange={(e) => setSalaryrrangeFrom(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div> <label for="add1" class="exp-form-labels">Salary Range To</label>
                      </div>
                    </div>
                    <input
                      id="Basic"
                      class="exp-input-field form-control"
                      type="Number"
                      placeholder=""
                      required title="Please Enter the Salary Range Amount"
                      value={SalaryrangeTo}
                      onChange={(e) => setSalaryrangeTo(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div> <label for="add1" class="exp-form-labels">
                        Basic
                      </label></div>
                    </div>
                    <input
                      id=" Basic"
                      class="exp-input-field form-control"
                      type="Number"
                      placeholder=""
                      required title="Please Enter the Basic Amount"
                      value={Basic}
                      onChange={(e) => setBasic(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div> <label for="add2" class="exp-form-labels">
                        HRA
                      </label> </div>
                    </div>
                    <input
                      id="HRA"
                      class="exp-input-field form-control"
                      type="Number"
                      placeholder=""
                      required title="Please Enter the HRA Allowance Amount"
                      value={HRA}
                      onChange={(e) => setHRA(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      maxLength={250}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="add3" class="exp-form-labels  ">
                      Conveyance
                    </label><input
                      id="Conveyance"
                      class="exp-input-field form-control"
                      type="Number"
                      placeholder=""
                      required title="Please Enter the Conveyance Allowance Amount"
                      value={Conveyance}
                      onChange={(e) => setConveyance(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      maxLength={250}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label For="city" className="exp-form-labels">Medical</label>
                      </div>
                    </div>
                    <input
                      id="Medical"
                      class="exp-input-field form-control"
                      type="Number"
                      placeholder=""
                      required title="Please Enter the Medical Allowance Amount"
                      value={Medical}
                      onChange={(e) => setMedical(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="add3" class="exp-form-labels  ">
                      Special Allowance
                    </label><input
                      id="Special_Allowance"
                      class="exp-input-field form-control"
                      type="Number"
                      placeholder=""
                      required title="Please Enter the Special Allowance"
                      value={Special_Allowance}
                      onChange={(e) => setSpecial_Allowance(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="add3" class="exp-form-labels  ">
                      Company PF Contribution
                    </label><input
                      id="Company_Pf_Contribution"
                      class="exp-input-field form-control"
                      type="Number"
                      placeholder=""
                      required title="Please Enter the Company PF Contribution"
                      value={Company_Pf_Contribution}
                      onChange={(e) => setCompany_Pf_Contribution(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="add3" class="exp-form-labels  ">
                      Bonus / Arrears
                    </label><input
                      id="Bonus_Arrears"
                      class="exp-input-field form-control"
                      type="Number"
                      placeholder=""
                      required title="Please Enter the Bonus / Arrears"
                      value={Bonus_Arrears}
                      onChange={(e) => setBonus_Arrears(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="add3" class="exp-form-labels  ">
                      Other Allowance
                    </label><input
                      id="Other_Allowance"
                      class="exp-input-field form-control"
                      type="Number"
                      placeholder=""
                      required title="Please Enter the Other Allowance"
                      value={Other_Allowance}
                      onChange={(e) => setOther_Allowance(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="add3" class="exp-form-labels  ">
                      Leave Deductions
                    </label>
                    <div>
                    </div>
                    <input
                      id="LeaveDeduction"
                      class="exp-input-field form-control"
                      type="Number"
                      placeholder=""
                      required title="Please Enter the Leave Deductions"
                      value={LeaveDeduction}
                      onChange={(e) => setLeaveDeduction(e.target.value)}
                      maxLength={250}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="add3" class="exp-form-labels  ">
                      Other Deductions
                    </label><input
                      id="otherDeductions"
                      class="exp-input-field form-control"
                      type="Number"
                      placeholder=""
                      required title="Please Enter the Other Deductions"
                      value={otherDeductions}
                      onChange={(e) => setotherDeductions(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="add3" class="exp-form-labels  ">
                      CTC Currency
                    </label><input
                      id="ctc_currency"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please Enter the CTC Currency"
                      value={ctc_currency}
                      onChange={(e) => setCtcCurrency(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="add3" class="exp-form-labels">
                      Minimum Take Salary
                    </label><input
                      id="minimum_take_salary"
                      class="exp-input-field form-control"
                      type="Number"
                      placeholder=""
                      required title="Please Enter the Minimum Take Salary"
                      value={minimum_take_salary}
                      onChange={(e) => setMinimumTakeSalary(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>
                <div className="col-md-2 form-group mb-2 mt-4">
                  <div class="exp-form-floating">
                    <div class=" d-flex  justify-content-center">
                      <div class=''>
                        <icon className="popups-btn fs-6 p-3"
                          onClick={handleSearch}
                          required title="Search">
                          <i className="fas fa-search"></i>
                        </icon>
                      </div>
                      <div>
                        <icon className="popups-btn fs-6 p-3"
                          onClick={reloadGridData}
                          required title="Reload">
                          <i className="fa-solid fa-arrow-rotate-right" />
                        </icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ag-theme-alpine mt-2" style={{ height: 400, width: '100%' }}>
                <AgGridReact
                  rowData={rowData}
                  columnDefs={columnDefs}
                  // defaultColDef={defaultColDef}
                  onGridReady={onGridReady}
                  // onCellValueChanged={onCellValueChanged}
                  rowSelection="multiple"
                  // onSelectionChanged={onSelectionChanged}
                  paginationAutoPageSize={true}
                  gridOptions={gridOptions}
                  pagination={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Input;
