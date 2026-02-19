import React, { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import './EmployeeLoan.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import '../apps.css'
import Select from 'react-select';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import ReactDOM from 'react-dom/client';
import PayslipReport from '../PayslipReport';
import Loading from "../Loading";
import Swal from 'sweetalert2';
import { useLocation } from "react-router-dom";

const config = require('../Apiconfig');

// const generatePDF = async (payslip) => {
//   const tempDiv = document.createElement("div");

//   Object.assign(tempDiv.style, {
//     position: "fixed",
//   });

//   document.body.appendChild(tempDiv);

//   const root = ReactDOM.createRoot(tempDiv);
//   root.render(<PayslipReport payslip={payslip} />);

//   await new Promise((resolve) => {
//     const checkReady = () => {
//       const logo = tempDiv.querySelector("img");
//       if (logo && logo.complete) {
//         setTimeout(resolve, 300); 
//       } else {
//         setTimeout(checkReady, 100);
//       }
//     };
//     checkReady();
//   });

//   const canvas = await html2canvas(tempDiv, {
//     useCORS: true, 
//     scale: 3 
//   });

//   const imgData = canvas.toDataURL("image/png");
//   const pdf = new jsPDF("p", "mm", "a4");
//   const pdfWidth = pdf.internal.pageSize.getWidth();
//   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//   pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//   pdf.save(`${payslip.EmployeeId}_${payslip.company_code}_Payslip_${payslip.SalaryMonth}.pdf`);

//   root.unmount();
//   document.body.removeChild(tempDiv);
// };

const generatePDF = async (payslip) => {
  const tempDiv = document.createElement("div");

  Object.assign(tempDiv.style, {
    position: "fixed",
  });

  document.body.appendChild(tempDiv);

  const root = ReactDOM.createRoot(tempDiv);
  root.render(<PayslipReport payslip={payslip} />);

  await new Promise((resolve) => {
    const checkReady = () => {
      const logo = tempDiv.querySelector("img");
      if (logo && logo.complete) {
        setTimeout(resolve, 300);
      } else {
        setTimeout(checkReady, 100);
      }
    };
    checkReady();
  });

  const canvas = await html2canvas(tempDiv, {
    useCORS: true,
    scale: 3,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

  // Convert to Blob and send to backend
  const pdfBlob = pdf.output("blob");
  const fileName = `${payslip.EmployeeId}_${payslip.company_code}_Payslip_${payslip.SalaryMonth}.pdf`;

  const formData = new FormData();
  formData.append("pdf", pdfBlob, fileName);
  formData.append("SalaryMonth", payslip.SalaryMonth); // ✅ Only SalaryMonth is passed

  try {
    const response = await fetch(`${config.apiBaseUrl}/savePdf`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      console.log("✅ PDF sent to backend and saved.");
    } else {
      console.error("❌ Failed to upload PDF.");
    }
  } catch (error) {
    console.error("Error while sending PDF:", error.message);
  }

  root.unmount();
  document.body.removeChild(tempDiv);
};

function Input({ }) {
  const [EmployeeID, setEmployeeID] = useState('');
  const [employeeID, setemployeeID] = useState('');
  const [EmpolyeeName, setEmpolyeeName] = useState('');
  const [SalaryDate, setSalaryDate] = useState('');
  const [PFNo, setPFNo] = useState('');
  const [Basic, setBasic] = useState('');
  const [HRA, setHRA] = useState('');
  const [Conveyance, setConveyance] = useState('');
  const [Medical, setMedical] = useState('');
  const [SpecialAllowance, setSpecialAllowance] = useState('');
  const [CompanyPFContribution, setCompanyPFContribution] = useState('');
  const [Bonus, setBonus] = useState('');
  const [OtherAllowance, setOtherAllowance] = useState('');
  const [PFBothShare, setPFBothShare] = useState('');
  const [TDS, setTDS] = useState('');
  const [ProfessionalTax, setProfessionalTax] = useState('');
  const [StaffLoanSalaryAdvance, setStaffLoanSalaryAdvance] = useState('');
  const [TotalLeave, setTotalLeave] = useState('');
  const [ApprovedLeave, setApprovedLeave] = useState('');
  const [LeaveDeduction, setLeaveDeduction] = useState('');
  const [OtherDeductions, setOtherDeductions] = useState('');
  const [TotalEarnings, setTotalEarnings] = useState('');
  const [NetEarnings, setNetEarnings] = useState('');
  const [open3, setOpen3] = React.useState(false);
  const [selectedUser, setSelectedEmployeeID] = useState([]);
  const [userDrop, setUserDrop] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const location = useLocation();


  const isSalaryPath = location.pathname === '/salarypath';

  const handlePaySlip = () => {
    setOpen3(true);
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  // const filteredOptionUser = [{ value: 'All', label: 'All' }, 
  //   ...(Array.isArray(userDrop) ? userDrop.map((option) => ({
  //       value: option.user_code,
  //       label: `${option.user_code} - ${option.user_name}`,
  //     }))
  //     : [])
  // ];

  const filteredOptionUser = [{ value: 'All', label: 'All' }, 
    ...(Array.isArray(userDrop) ? userDrop.map((option) => ({
        value: option.EmployeeId,
        label: `${option.EmployeeId} - ${option.First_Name}`,
      }))
      : [])
  ];

  const handleChangeUser = (selectedUser) => {
    setSelectedEmployeeID(selectedUser);
    setemployeeID(selectedUser ? selectedUser.value : '');
  };


// useEffect(() => {
//   const fetchUserData = async () => {
//     try {
//       const response = await fetch(`${config.apiBaseUrl}/usercode`);
//       const val = await response.json();
//       setUserDrop(val);
//       const defaultOption = { value: 'All', label: 'All' };
//       setSelectedEmployeeID(defaultOption);
//       setemployeeID(defaultOption.value);
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//     }
//   };
//   fetchUserData();
// }, []);

useEffect(() => {
  const fetchUserData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getEmployeeId`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company_code: sessionStorage.getItem('selectedCompanyCode') }) 
      });

      const val = await response.json();
      setUserDrop(val);

      const defaultOption = { value: 'All', label: 'All' };
      setSelectedEmployeeID(defaultOption);
      setemployeeID(defaultOption.value);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  fetchUserData();
}, []);

  // const handleGeneratePayslip = async (e) => {
  //   try {
  //     if (!SalaryDate) {
  //       toast.warning("Error:Missing Required Fields")
  //       return;
  //     }
  //     e.preventDefault();
  //     setIsLoading(true); // ✅ Show loader

  //     const data = {
  //       month:SalaryDate,
  //       company_code: sessionStorage.getItem('selectedCompanyCode')
  //     };
  //     const response = await fetch(`${config.apiBaseUrl}/GeneratePaySlip`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data),
  //     });

  //     if (response.ok) {
  //       const payslipData = await response.json();
  //       for (const payslip of payslipData) {
  //         await generatePDF(payslip); 
  //       }
  //       Swal.fire({
  //         title: 'Send Payslip Email?',
  //         text: 'Do you want to send the payslips via email now?',
  //         icon: 'question',
  //         showCancelButton: true,
  //         confirmButtonText: 'Yes, send it!',
  //         cancelButtonText: 'No, maybe later',
  //       }).then((result) => {
  //         if (result.isConfirmed) {
  //           handleSendPayslipEmail();
  //         }
  //       });
  //     }
  //     else {
  //       const errorResponse = await response.json();
  //       toast.warning(errorResponse.message);
  //     }
  //   } catch (error) {
  //     toast.error("Error inserting data: " + error.message);
  //   } finally {
  //     setIsLoading(false); 
  //   }
  // };

  const handleGeneratePayslip = async (e) => {
    try {
      if (!SalaryDate) {
        setError(' ');
        toast.warning("Error: Missing Required Fields");
        return;
      }
      e.preventDefault();
      setIsLoading(true);

      const data = {
        month: SalaryDate,
        employee_id: employeeID,
        company_code: sessionStorage.getItem('selectedCompanyCode'),
      };

      const response = await fetch(`${config.apiBaseUrl}/GeneratePaySlip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const payslipData = await response.json();
        for (const payslip of payslipData) {
          await generatePDF(payslip);
        }

        const salaryMonthFromData = payslipData.length > 0 ? payslipData[0].SalaryMonth : null;

        Swal.fire({
          title: 'Send Payslip Email?',
          text: 'Do you want to send the payslips via email now?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes, send it!',
          cancelButtonText: 'No, maybe later',
        }).then(async (result) => {
          if (result.isConfirmed) {
            const emailRes = await fetch(`${config.apiBaseUrl}/sendPayslipEmails`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ SalaryMonth: salaryMonthFromData, payslips: payslipData, employee_id: employeeID, }),
            });

            if (emailRes.ok) {
              toast.success("Payslips emailed successfully.");
            } else {
              toast.error("Failed to send payslip emails.");
            }
          }
        });
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPayslipEmail = async () => {
    try {
      setIsLoading(true);

      const data = {
        company_code: sessionStorage.getItem('selectedCompanyCode'),
      };

      const response = await fetch(`${config.apiBaseUrl}/mailgenerating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Payslip emails sent successfully!");
      } else {
        const errorResponse = await response.json();
        toast.error(errorResponse.message || "Failed to send emails.");
      }
    } catch (error) {
      toast.error("Error sending email: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  console.log(isSalaryPath)
  return (
    <div class="">
      <div class="container-fluid Topnav-screen ">
        <div className="">
          <ToastContainer position="top-right" className="toast-design" theme="colored" />
          {isLoading && <Loading />}
          {isSalaryPath ? (
            <div className="">
              <div className="shadow-lg p-0 bg-light rounded">
                <div className="mb-0 d-flex justify-content-between mt-4">
                  <div class="d-flex justify-content-start">
                    <h1 align="left" className="">Salary Process</h1>
                  </div>
                  <div className="d-flex justify-content-end me-3">
                    <reloadbutton className="purbut mt-3 me-3" onClick={reloadGridData} title="Reload" style={{ cursor: "pointer" }}>
                      <i className="fa-solid fa-arrow-rotate-right"></i>
                    </reloadbutton>
                  </div>
                </div>
              </div>
              <div className="shadow-lg bg-light rounded mt-2 p-3">
                <div className="row">
                  {/* Repeat the same block here or extract to a function if needed */}
                  <div className="col-md-3 form-group mb-2 me-1">
                    <label htmlFor="cno" className="exp-form-labels">
                      Employee ID<span className="text-danger">*</span>
                    </label>
                    <div className="exp-form-floating" title="Please Select the Employee ID">
                      <Select
                        id="cno"
                        className="exp-input-field "
                        type="text"
                        placeholder=""
                        required
                        title="Please enter the employee id"
                        onChange={handleChangeUser}
                        value={selectedUser}
                        options={filteredOptionUser}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 form-group mb-2">
                    <div className="exp-form-floating">
                      <label htmlFor="SalaryDate" className={`${error && !SalaryDate ? 'red' : ''}`}>Salary Month<span className="text-danger">*</span></label>
                      <input
                        id="SalaryDate"
                        className="exp-input-field form-control"
                        type="month"
                        placeholder=""
                        required
                        title="Please Enter the Salary Month"
                        value={SalaryDate}
                        onChange={(e) => setSalaryDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div class="me-2 mt-3">
                      <div class=" d-flex justify-content-start">
                        <button className="Documents-btn mt-2" title="Generate Payslip" onClick={handleGeneratePayslip}>
                          <span class="folderContainer">
                            <svg
                              class="fileBack"
                              width="146"
                              height="113"
                              viewBox="0 0 146 113"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0 4C0 1.79086 1.79086 0 4 0H50.3802C51.8285 0 53.2056 0.627965 54.1553 1.72142L64.3303 13.4371C65.2799 14.5306 66.657 15.1585 68.1053 15.1585H141.509C143.718 15.1585 145.509 16.9494 145.509 19.1585V109C145.509 111.209 143.718 113 141.509 113H3.99999C1.79085 113 0 111.209 0 109V4Z"
                                fill="url(#paint0_linear_117_4)"
                              ></path>
                              <defs>
                                <linearGradient
                                  id="paint0_linear_117_4"
                                  x1="0"
                                  y1="0"
                                  x2="72.93"
                                  y2="95.4804"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stop-color="#8F88C2"></stop>
                                  <stop offset="1" stop-color="#5C52A2"></stop>
                                </linearGradient>
                              </defs>
                            </svg>
                            <svg
                              class="filePage"
                              width="88"
                              height="99"
                              viewBox="0 0 88 99"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width="88" height="99" fill="url(#paint0_linear_117_6)"></rect>
                              <defs>
                                <linearGradient
                                  id="paint0_linear_117_6"
                                  x1="0"
                                  y1="0"
                                  x2="81"
                                  y2="160.5"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stop-color="white"></stop>
                                  <stop offset="1" stop-color="#686868"></stop>
                                </linearGradient>
                              </defs>
                            </svg>
                            <svg
                              class="fileFront"
                              width="160"
                              height="79"
                              viewBox="0 0 160 79"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0.29306 12.2478C0.133905 9.38186 2.41499 6.97059 5.28537 6.97059H30.419H58.1902C59.5751 6.97059 60.9288 6.55982 62.0802 5.79025L68.977 1.18034C70.1283 0.410771 71.482 0 72.8669 0H77H155.462C157.87 0 159.733 2.1129 159.43 4.50232L150.443 75.5023C150.19 77.5013 148.489 79 146.474 79H7.78403C5.66106 79 3.9079 77.3415 3.79019 75.2218L0.29306 12.2478Z"
                                fill="url(#paint0_linear_117_5)"
                              ></path>
                              <defs>
                                <linearGradient
                                  id="paint0_linear_117_5"
                                  x1="38.7619"
                                  y1="8.71323"
                                  x2="66.9106"
                                  y2="82.8317"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stop-color="#C3BBFF"></stop>
                                  <stop offset="1" stop-color="#51469A"></stop>
                                </linearGradient>
                              </defs>
                            </svg>
                          </span>
                          {/* <p className="text mb-2 me-3">Generate Payslip</p> */}
                        </button>
                        {/* <div className="col-md-1">
                  <div className="ms-2 mt-3"></div>
                  <reloadbutton className="purbut" onClick={reloadGridData} title="save">
                    <i className="fa-solid fa-arrow-rotate-right"></i>
                  </reloadbutton>
                </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="">
              {/* <ToastContainer position="top-right" className="toast-design" theme="colored" /> */}
              <div className="shadow-lg p-0 bg-light rounded">
                <div className=" mb-0 d-flex justify-content-between" >
                  <h1 align="left" class="">PaySlip Generator</h1>
                </div>
              </div>

              <div className="shadow-lg  bg-light rounded-top mt-2  pt-3">
                <button className=" shadow-lg  addTab1 mt-2 rounded-bottom rounded-bottom-0 text-white">Payslip Details</button>
              </div>
              <div class=" mb-4">
                <div className="shadow-lg p-3 bg-light rounded-bottom  mb-2">
                  <div class="row">
                    <div className="col-md-3 form-group mb-2 me-1">
                      <label for="cno" class="exp-form-labels">Employee ID </label>
                      <div class="exp-form-floating">
                        <div class="d-flex justify-content-end">
                          <input
                            id="cno"
                            class="exp-input-field form-control"
                            type="text"
                            placeholder=""
                            required title="Please enter the employee id"
                            value={EmployeeID}
                            onChange={(e) => setEmployeeID(e.target.value)}
                          />
                          <div className="position-absolute mt-1 me-2">
                            <span className="icon searchIcon"
                              onClick={handlePaySlip}>
                              <i className="fa fa-search"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <div class="d-flex justify-content-start">
                          <div>
                            <label for="sname" class="exp-form-labels">Salary Month</label>
                          </div>
                        </div>
                        <input
                          id="SalaryDate"
                          class="exp-input-field form-control"
                          type="month"
                          placeholder=""
                          required title="Please enter the salary month"
                          value={SalaryDate}
                          onChange={(e) => setSalaryDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-2 form-group mb-2 mt-4">
                      <div class="exp-form-floating">
                        <div class=" d-flex  justify-content-center">
                          <div class=''>
                            <icon className="popups-btn fs-6 p-3"
                              // onClick={handleSearch}
                              required title="Search">
                              <i className="fas fa-search"></i>
                            </icon>
                          </div>
                          <div>
                            <icon className="popups-btn fs-6 p-3"
                              // onClick={reloadGridData}
                              required title="Refresh">
                              <i className="fa-solid fa-arrow-rotate-right" />
                            </icon>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <div class="d-flex justify-content-start">
                          <div>
                            <label for="cname" class="exp-form-labels">Empolyee Name</label>
                          </div>
                        </div>
                        <input
                          id="state"
                          className="exp-input-field form-control"
                          placeholder=""
                          required title="Please enter the employee name"
                          value={EmpolyeeName}
                          onChange={(e) => setEmpolyeeName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <div class="d-flex justify-content-start">
                          <div>
                            <label for="add1" class="exp-form-labels">PF No</label>
                          </div>
                        </div>
                        <input
                          id="fdate"
                          class="exp-input-field form-control"
                          type="text"
                          placeholder=""
                          required title="Please enter the pf no"
                          value={PFNo}
                          onChange={(e) => setPFNo(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <div class="d-flex justify-content-start">
                          <div>
                            <label for="add1" class="exp-form-labels">Basic</label>
                          </div>
                        </div>
                        <input
                          id="Basic"
                          class="exp-input-field form-control"
                          type="text"
                          placeholder=""
                          required title="Please enter the basic"
                          value={Basic}
                          onChange={(e) => setBasic(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <div class="d-flex justify-content-start">
                          <div>
                            <label for="add2" class="exp-form-labels">HRA</label>
                          </div>
                        </div>
                        <input
                          id="HRA"
                          class="exp-input-field form-control"
                          type="text"
                          placeholder=""
                          required title="Please enter the HRA"
                          value={HRA}
                          onChange={(e) => setHRA(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <label for="add3" class="exp-form-labels">Conveyance</label>
                        <input
                          id="Conveyance"
                          class="exp-input-field form-control"
                          type="text"
                          placeholder=""
                          required title="Please enter the conveyance"
                          value={Conveyance}
                          onChange={(e) => setConveyance(e.target.value)}
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
                          type="text"
                          placeholder=""
                          required title="Please enter the medical"
                          value={Medical}
                          onChange={(e) => setMedical(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <label for="add3" class="exp-form-labels">Special Allowance
                        </label>
                        <input
                          id="add3"
                          class="exp-input-field form-control"
                          type="text"
                          placeholder=""
                          required title="Please enter the special allowance"
                          value={SpecialAllowance}
                          onChange={(e) => setSpecialAllowance(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <label for="add3" class="exp-form-labels">Company PF Contribution</label>
                        <input
                          id="CompanyPFContribution"
                          class="exp-input-field form-control"
                          type="text"
                          placeholder=""
                          required title="Please enter the cpmany pf contribution"
                          value={CompanyPFContribution}
                          onChange={(e) => setCompanyPFContribution(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <label for="add3" class="exp-form-labels">Bonus / Arrears</label>
                        <input
                          id="Bonus"
                          class="exp-input-field form-control"
                          type="text"
                          placeholder=""
                          required title="Please enter the bonus / arrears"
                          value={Bonus}
                          onChange={(e) => setBonus(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <label for="add3" class="exp-form-labels">Other Allowance</label>
                        <input
                          id="OtherAllowance"
                          class="exp-input-field form-control"
                          type="text"
                          placeholder=""
                          required title="Please enter the other allowance"
                          value={OtherAllowance}
                          onChange={(e) => setOtherAllowance(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <label for="add3" class="exp-form-labels">PF Both Share</label>
                        <input
                          id="PFBothShare"
                          class="exp-input-field form-control"
                          type="text"
                          placeholder=""
                          required title="Please enter the pf both share"
                          value={PFBothShare}
                          onChange={(e) => setPFBothShare(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <label for="add3" class="exp-form-labels">TDS</label>
                        <input
                          id="TDS"
                          class="exp-input-field form-control"
                          type="text"
                          placeholder=""
                          required title="Please enter the TDS"
                          value={TDS}
                          onChange={(e) => setTDS(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <label for="add3" class="exp-form-labels">Professional Tax</label>
                        <input
                          id="ProfessionalTax"
                          class="exp-input-field form-control"
                          type="text"
                          placeholder=""
                          required title="Please enter the professional tax"
                          value={ProfessionalTax}
                          onChange={(e) => setProfessionalTax(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <label for="add3" class="exp-form-labels">Staff Loan Salary Advance</label>
                        <input
                          id="add3"
                          class="exp-input-field form-control"
                          type="text"
                          placeholder=""
                          required title="Please enter the loan salary advance"
                          value={StaffLoanSalaryAdvance}
                          onChange={(e) => setStaffLoanSalaryAdvance(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <label for="add3" class="exp-form-labels">Total Leave</label>
                        <input
                          id="TotalLeave"
                          class="exp-input-field form-control"
                          type="text"
                          placeholder=""
                          required title="Please enter the total leave"
                          value={TotalLeave}
                          onChange={(e) => setTotalLeave(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <label for="add3" class="exp-form-labels">Approved Leave</label>
                        <input
                          id="ApprovedLeave"
                          class="exp-input-field form-control"
                          type="text"
                          placeholder=""
                          required title="Please enter the approved leave"
                          value={ApprovedLeave}
                          onChange={(e) => setApprovedLeave(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <label for="add3" class="exp-form-labels">Leave Deduction</label>
                        <input
                          id="LeaveDeduction"
                          class="exp-input-field form-control"
                          type="text"
                          placeholder=""
                          required title="Please enter the leave deduction"
                          value={LeaveDeduction}
                          onChange={(e) => setLeaveDeduction(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <label for="add3" class="exp-form-labels">Other Deductions</label>
                        <input
                          id=" OtherDeductions"
                          class="exp-input-field form-control"
                          type="text"
                          placeholder=""
                          required title="Please enter the other deductions"
                          value={OtherDeductions}
                          onChange={(e) => setOtherDeductions(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <label for="add3" class="exp-form-labels">Total Earnings</label>
                        <input
                          id="TotalEarnings"
                          class="exp-input-field form-control"
                          type="text"
                          placeholder=""
                          required title="Please enter the total earnings"
                          value={TotalEarnings}
                          onChange={(e) => setTotalEarnings(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <label for="add3" class="exp-form-labels">Net Earnings</label>
                        <input
                          id="NetEarnings"
                          class="exp-input-field form-control"
                          type="text"
                          placeholder=""
                          required title="Please enter the net earnings"
                          value={NetEarnings}
                          onChange={(e) => setNetEarnings(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          )}

        </div>
      </div>
    </div>
  );
}
export default Input;
