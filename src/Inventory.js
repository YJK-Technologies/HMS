import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import "./apps.css";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'ag-grid-autocomplete-editor/dist/main.css';
import "./mobile.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showConfirmationToast } from './ToastConfirmation';
import LoadingScreen from './Loading';
import ItemPopup from "./ItemHelp";
import BillingHelpPopup from './BillingHelpPopup';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
const config = require('./Apiconfig');

function Sales() {
  const [error, setError] = useState("");
  const [selectedGender, setSelectedGender] = useState('');
  const [gender, setGender] = useState("");
  const [Genderdrop, setGenderdrop] = useState([]);
  const [Bill_no, setBill_no] = useState('');
  const [vistno, setvistno] = useState('');
  const [Payementmode, setPayementmode] = useState("");
  const [SelectedPayementmode, setSelectedPayementmode] = useState("");
  const [paymentdrop, setPaymentdrop] = useState([]);
  const [Doc, setDoc] = useState("Default");
  const [DoctorName, setDoctorName] = useState("");
  const [Cash, setCash] = useState("");
  const [GrossAmount, setGrossAmount] = useState(0);
  const [Discount, setDiscount] = useState(0);
  const [Net_Amount, setNet_Amount] = useState("");
  const [Received_Amount, setReceived_Amount] = useState(0);
  const [Balance_Amount, setBalance_Amount] = useState(0);
  const [contact_no, setcontact_no] = useState(null);
  const [rowData, setRowData] = useState([{ serialNumber: 1, ServiceID: '', ServiceName: '', Rate: '' }]);
  const [PatientID, setPatientID] = useState("Default");
  const [PatientName, setPatientName] = useState("");
  const [clientid, setclientid] = useState("Default");
  const [ClientName, setClientName] = useState("");
  const [printButtonVisible, setPrintButtonVisible] = useState(true);
  const [billDate, setBillDate] = useState("");
  const [buttonsVisible, setButtonsVisible] = useState(true);
  const [deleteButtonVisible, setDeleteButtonVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [global, setGlobal] = useState(null);
  const [globalItem, setGlobalItem] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [age, setAge] = useState("");
  const [isPatientNameEditable, setIsPatientNameEditable] = useState(false);
  const [isClientNameEditable, setIsClientNameEditable] = useState(false);
  const [isDoctorNameEditable, setIsDoctorNameEditable] = useState(false);
  const [doctorDrop, setDoctorDrop] = useState([]);
  const [SelectedDoctor, setSelectedDoctor] = useState({ value: "Default", label: "Default" })
  const [ServiceDrop, setServiceDrop] = useState([]);
  const [SelectedService, setSelectedService] = useState('');
  const [Service, setService] = useState('');

  //code added by Harish purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const sales = permissions
    .filter(permission => permission.screen_type === 'Sales')
    .map(permission => permission.permission_type.toLowerCase());

  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0]; // Format the date as 'YYYY-MM-DD'
    setBillDate(currentDate);
  }, []);

  const handleClickOpen = (params) => {
    const GlobalSerialNumber = params.data.serialNumber;
    setGlobal(GlobalSerialNumber);
    const GlobalItem = params.data.ServiceID;
    setGlobalItem(GlobalItem);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpen1(false);
  };

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/getDoctorDropdown`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setDoctorDrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/GetServiceName`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setServiceDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const filteredOptionDoctor = [
    { value: "Default", label: "Default" },
    ...doctorDrop.map((option) => ({
      value: option.DoctorID,
      label: `${option.DoctorID}-${option.DoctorName}`,
    })),
  ];

  const handleChangeDoctor = (SelectedDoctor) => {
    setSelectedDoctor(SelectedDoctor);
    setDoc(SelectedDoctor ? SelectedDoctor.value : "");
    setDoctorName(SelectedDoctor ? SelectedDoctor.label.split("-")[1] : "");
  };

  const handleChangeService = async (SelectedService) => {
    setSelectedService(SelectedService);

    const serviceID = SelectedService ? SelectedService.value : "";
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    if (!SelectedService) return;

    try {
      const response = await fetch(`${config.apiBaseUrl}/getServiceDetail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ company_code, ServiceID: serviceID })
      });

      if (response.ok) {
        const searchData = await response.json();
        const matchedItem = searchData[0];
        if (!matchedItem) {
          toast.warning("No item data found.");
          return;
        }

        const emptyRowIndex = rowData.findIndex(row => !row.ServiceID);

        if (emptyRowIndex !== -1) {
          // Update the first empty row
          const updatedRowData = [...rowData];
          updatedRowData[emptyRowIndex] = {
            ...updatedRowData[emptyRowIndex],
            ServiceID: matchedItem.ServiceID,
            ServiceName: matchedItem.ServiceName,
            Rate: matchedItem.Rate,
          };
          setRowData(updatedRowData);
        } else {
          // No empty row found, add a new row
          const newRow = {
            serialNumber: rowData.length + 1,
            ServiceID: matchedItem.ServiceID,
            ServiceName: matchedItem.ServiceName,
            Rate: matchedItem.Rate,
          };
          setRowData(prev => [...prev, newRow]);
        }

      } else {
        toast.warning("Item not found.");
      }
    } catch (error) {
      console.error("Error fetching item data from dropdown:", error);
      toast.error("Error: " + error.message);
    }
  };

  const filteredOptionService = ServiceDrop.map((option) => ({
    value: option.ServiceID,
    label: `${option.ServiceID}-${option.ServiceName}`,
  }));

  const handleDelete = (params) => {
    const serialNumberToDelete = params.data.serialNumber;

    const updatedRowData = rowData.filter(row => row.serialNumber !== serialNumberToDelete);

    setRowData(updatedRowData);

    if (updatedRowData.length === 0) {
      const newRow = {
        serialNumber: 1,
        delete: '',
        ServiceID: '',
        ServiceName: '',
        Rate: ''
      };
      setRowData([newRow]);

      setReceived_Amount(0);    
      setGrossAmount(0);
      setNet_Amount(0);
      setBalance_Amount(0);
      setDiscount(0);

      // const formattedTotalItemAmounts = '0.00';
      // const formattedTotalTaxAmounts = '0.00';

      // TotalAmountCalculation(formattedTotalTaxAmounts, formattedTotalItemAmounts);
    }
    else {
      const updatedRowDataWithNewSerials = updatedRowData.map((row, index) => ({
        ...row,
        serialNumber: index + 1
      }));
      setRowData(updatedRowDataWithNewSerials);

      // const updatedRowDataTaxWithNewSerials = updatedRowDataTax.map((taxRow) => {
      //   const correspondingRow = updatedRowDataWithNewSerials.find(
      //     (dataRow) => dataRow.keyField === taxRow.keyfield
      //   );

      //   return correspondingRow
      //     ? { ...taxRow, ItemSNO: correspondingRow.serialNumber.toString() }
      //     : taxRow;
      // });
      // setRowDataTax(updatedRowDataTaxWithNewSerials);

      // const totalItemAmounts = updatedRowData.map(row => row.TotalItemAmount || '0.00').join(',');
      // const totalTaxAmounts = updatedRowData.map(row => row.TotalTaxAmount || '0.00').join(',');

      // const formattedTotalItemAmounts = totalItemAmounts.endsWith(',') ? totalItemAmounts.slice(0, -1) : totalItemAmounts;
      // const formattedTotalTaxAmounts = totalTaxAmounts.endsWith(',') ? totalTaxAmounts.slice(0, -1) : totalTaxAmounts;

      // TotalAmountCalculation(formattedTotalTaxAmounts, formattedTotalItemAmounts);
    }
  };

  const columnDef = [
    {
      headerName: 'S.No',
      field: 'serialNumber',
      maxWidth: 80,
      editable: false
    },
    {
      headerName: '',
      field: 'delete',
      editable: false,
      maxWidth: 25,
      onCellClicked: handleDelete,
      cellRenderer: function (params) {
        return <FontAwesomeIcon icon="fa-solid fa-trash" style={{ cursor: 'pointer', marginRight: "12px" }} />
      },
      sortable: false,
      cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
    },
    // {
    //   headerName: 'Code',
    //   field: 'Code',
    //   filter: true,
    //   cellEditorParams: {
    //     maxLength: 18,
    //   },
    //   sortable: false,
    //   cellRenderer: (params) => {
    //     const cellWidth = params.column.getActualWidth();
    //     const isWideEnough = cellWidth > 30;
    //     const showSearchIcon = isWideEnough;

    //     return (
    //       <div className="position-relative d-flex align-items-center" style={{ minHeight: '100%' }}>
    //         <div className="flex-grow-1">
    //           {params.editing ? (
    //             <input
    //               type="text"
    //               className="form-control"
    //               value={params.value || ''}
    //               onChange={(e) => params.setValue(e.target.value)}
    //               style={{ width: '100%' }}
    //             />
    //           ) : (
    //             params.value
    //           )}
    //         </div>

    //         {showSearchIcon && (
    //           <span
    //             className="icon searchIcon"
    //             style={{
    //               position: 'absolute',
    //               right: '-10px',
    //               top: '50%',
    //               transform: 'translateY(-50%)',
    //             }}
    //             onClick={() => handleClickOpen(params)}
    //           >
    //             <i className="fa fa-search"></i>
    //           </span>
    //         )}
    //       </div>
    //     );
    //   },
    // },
    {
      headerName: 'Service Code',
      field: 'ServiceID',
      editable: true,
      filter: true,
      cellRenderer: (params) => {
        const cellWidth = params.column.getActualWidth();
        const isWideEnough = cellWidth > 30;
        const showSearchIcon = isWideEnough;

        return (
          <div className="position-relative d-flex align-items-center" style={{ minHeight: '100%' }}>
            <div className="flex-grow-1">
              {params.editing ? (
                <input
                  type="text"
                  className="form-control"
                  value={params.value || ''}
                  onChange={(e) => params.setValue(e.target.value)}
                  style={{ width: '100%' }}
                />
              ) : (
                params.value
              )}
            </div>

            {showSearchIcon && (
              <span
                className="icon searchIcon"
                style={{
                  position: 'absolute',
                  right: '-10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
                onClick={() => handleClickOpen(params)}
              >
                <i className="fa fa-search"></i>
              </span>
            )}
          </div>
        );
      },
      onCellValueChanged: function (params) {
        handleItemCode(params);
      },
    },
    {
      headerName: 'Service Name',
      field: 'ServiceName',
      editable: false,
      filter: true,
    },
    {
      headerName: 'Amount',
      field: 'Rate',
      editable: false,
    },
  ]

  const handleCellValueChanged = (params) => {
    const { colDef, rowIndex } = params;
    const lastRowIndex = rowData.length - 1;

    if (colDef.field === 'ServiceID' && rowIndex === lastRowIndex) {
      const serialNumber = rowData.length + 1;
      const newRowData = {
        serialNumber, ServiceID: '', ServiceName: '', Rate: null
      };
      setRowData(prevRowData => [...prevRowData, newRowData]);
    }
  };

  const handleSalesData = () => {
    setOpen1(true);
  };


  const [open1, setOpen1] = React.useState(false);

  const handleChangeGender = (selectedGender) => {
    setSelectedGender(selectedGender);
    setGender(selectedGender ? selectedGender.value : '');
  };

  const handleChangePayment = (SelectedPayementmode) => {
    setSelectedPayementmode(SelectedPayementmode);
    setPayementmode(SelectedPayementmode ? SelectedPayementmode.value : '');
  };

  const filteredOptionGender = Genderdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionPayment = paymentdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/gender`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => {
        setGenderdrop(val);

        const femaleOption = val.find(
          (option) => option.attributedetails_name.toLowerCase() === "female"
        );

        if (femaleOption) {
          const defaultGender = {
            value: femaleOption.attributedetails_name,
            label: femaleOption.attributedetails_name,
          };
          setSelectedGender(defaultGender);
          setGender(defaultGender.value);
        }
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/getTransactionType`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setPaymentdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleSaveButtonClick = async () => {
    if (!PatientID || !clientid || !age || !Payementmode || !Doc) {
      setError(" ");
      toast.warning('Error: Missing required fields');
      return;
    }

    const validRows = rowData.filter(row =>
      row.ServiceID && row.Rate > 0
    );

    if (validRows.length === 0) {
      toast.warning("Error: At least one detail entry is required!");
      return;
    }

    setLoading(true)
    try {
      const Header = {
        BillNo: Number(Bill_no),
        PatientID: PatientID,
        PatientName: PatientName,
        BillDate: billDate,
        Gender: gender,
        // VisitNo: vistno,
        DoctorID: Doc,
        DoctorName: DoctorName,
        ContactNumber: contact_no,
        ClientID: clientid,
        ClientName: ClientName,
        PaymentModeID: Payementmode,
        Cash: Number(Cash),
        GrossAmount: Number(GrossAmount),
        ReceivedAmount: Received_Amount,
        NetAmount: Net_Amount.toString(),
        BalanceAmount: Balance_Amount.toString(),
        Discount: Number(Discount).toFixed(2),
        age: Number(age),
        created_by: sessionStorage.getItem('selectedUserCode'),
        company_code: sessionStorage.getItem("selectedCompanyCode")
      };
      const response = await fetch(`${config.apiBaseUrl}/HMS_BillHeaderInsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Header),
      });

      if (response.ok) {
        const searchData = await response.json();
        const [{ BillNo }] = searchData;
        setBill_no(BillNo);

        toast.success("Data inserted Successfully");

        await saveInventoryDetails(BillNo);

        setDeleteButtonVisible(true);
        setPrintButtonVisible(true);
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.error);
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error("Error inserting data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveInventoryDetails = async (BillNo) => {
    try {
      const validRows = rowData.filter(row =>
        row.ServiceID && row.Rate > 0
      );

      for (const row of validRows) {
        const Details = {
          BillNo: BillNo,
          Sno: row.serialNumber,
          ServiceID: row.ServiceID,
          ServiceName: row.ServiceName,
          Amount: row.Rate,
          created_by: sessionStorage.getItem('selectedUserCode'),
          company_code: sessionStorage.getItem("selectedCompanyCode")
        };
        const response = await fetch(`${config.apiBaseUrl}/HMS_BillDetailsInsert`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Details),
        });

        if (response.ok) {
          console.log(" Data inserted successfully");
        } else {
          const errorResponse = await response.json();
          console.error(errorResponse.error);
          toast.warning(errorResponse.message);
        }
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleItem = async (selectedData) => {
    let updatedRowDataCopy = [...rowData];

    let highestSerialNumber = updatedRowDataCopy.reduce(
      (max, row) => Math.max(max, row.serialNumber || 0),
      0
    );

    selectedData.forEach((item) => {
      const existingItemWithSameCode = updatedRowDataCopy.find(
        (row) => row.serialNumber === global && row.ServiceID === globalItem
      );

      if (existingItemWithSameCode) {
        existingItemWithSameCode.ServiceID = item.ServiceID;
        existingItemWithSameCode.Code = item.Code;
        existingItemWithSameCode.ServiceName = item.ServiceName;
        existingItemWithSameCode.Rate = item.Rate;
      } else {
        highestSerialNumber += 1;
        const newRow = {
          serialNumber: highestSerialNumber,
          ServiceID: item.ServiceID,
          Code: item.Code,
          ServiceName: item.ServiceName,
          Rate: item.Rate
        };
        updatedRowDataCopy.push(newRow);
      }
    });

    const gross = updatedRowDataCopy.reduce((sum, row) => sum + (Number(row.Rate) || 0), 0);

    const net = gross - (Number(Discount) || 0);

    setRowData(updatedRowDataCopy);
    setGrossAmount(gross);
    setNet_Amount(net);
    setReceived_Amount(net);

    return true;
  };

  useEffect(() => {
    const gross = rowData.reduce((sum, row) => sum + (Number(row.Rate) || 0), 0);
    const net = gross - (Number(Discount) || 0);
    setGrossAmount(gross);
    setNet_Amount(net);
    setReceived_Amount(net);

    const net_amount = parseFloat(Net_Amount) || 0;
    const received = parseFloat(Received_Amount) || 0;
    const balance = net_amount - received;
    setBalance_Amount(balance >= 0 ? balance : 0);
  }, [rowData, Discount]);

  const handleReceivedChange = (e) => {
    const receivedValue = e.target.value;

    if (!/^\d*\.?\d*$/.test(receivedValue)) return;

    setReceived_Amount(receivedValue);

    const net = parseFloat(Net_Amount) || 0;
    const received = parseFloat(receivedValue) || 0;
    const balance = net - received;
    setBalance_Amount(balance > 0 ? balance : 0);
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0]; // yyyy-MM-dd
  };

  const handleBilling = async (data) => {

    setDeleteButtonVisible(true);
    setPrintButtonVisible(true);
    if (data && data.length > 0) {
      const [{ BillNo, BillDate, PatientID, PatientName, ClientID, ClientName, ContactNumber, Gender, VisitNo, DoctorID, DoctorName, Cash, Discount, GrossAmount,
        NetAmount, PaymentModeID, ReceivedAmount, BalanceAmount, Barcode, Age }] = data;

      const billNo = document.getElementById('bill_no');
      if (billNo) {
        billNo.value = BillNo;
        setBill_no(BillNo);
      } else {
        console.error('bill no element not found');
      }

      const billDate = document.getElementById('bill_date');
      if (billDate) {
        billDate.value = BillDate;
        setBillDate(formatDateForInput(BillDate));
      } else {
        console.error('bill date element not found');
      }

      const patientId = document.getElementById('patient_id');
      if (patientId) {
        patientId.value = PatientID;
        setPatientID(PatientID);
      } else {
        console.error('patient id element not found');
      }

      const patientName = document.getElementById('patient_name');
      if (patientName) {
        patientName.value = PatientName;
        setPatientName(PatientName);
      } else {
        console.error('patient name element not found');
      }

      const contactNumber = document.getElementById('contact_number');
      if (contactNumber) {
        contactNumber.value = ContactNumber;
        setcontact_no(ContactNumber);
      } else {
        console.error('contact number element not found');
      }

      const clientId = document.getElementById('client_id');
      if (clientId) {
        clientId.value = ClientID;
        setclientid(ClientID);
      } else {
        console.error('client id element not found');
      }

      const clientName = document.getElementById('client_name');
      if (clientName) {
        clientName.value = ClientName;
        setClientName(ClientName);
      } else {
        console.error('client name element not found');
      }

      const visitNo = document.getElementById('visit_no');
      if (visitNo) {
        visitNo.value = VisitNo;
        setvistno(VisitNo);
      } else {
        console.error('visit no element not found');
      }

      const paymentmode = document.getElementById('paymentmode_id');
      if (paymentmode) {
        const SelectedPayementmode = filteredOptionPayment.find(option => option.value === PaymentModeID);
        setSelectedPayementmode(SelectedPayementmode);
        setPayementmode(SelectedPayementmode.value);
      } else {
        console.error('paymentmode element not found');
      }

      // const paymentmode = document.getElementById('paymentmode_id');
      // if (paymentmode) {
      //   paymentmode.value = PaymentModeID;
      //   setPayementmode(PaymentModeID);
      // } else {
      //   console.error('paymentmode id element not found');
      // }

      // const doctorId = document.getElementById('doctor_id');
      // if (doctorId) {
      //   doctorId.value = DoctorID;
      //   setDoc(DoctorID);
      // } else {
      //   console.error('doctor id element not found');
      // }

      const doctorId = document.getElementById('doctor_id');
      if (doctorId) {
        const SelectedDoctor = filteredOptionDoctor.find(option => option.value === DoctorID);
        setSelectedDoctor(SelectedDoctor);
        setDoc(SelectedDoctor.value);
      } else {
        console.error('doctor Id element not found');
      }

      const doctorName = document.getElementById('doctor_name');
      if (doctorName) {
        doctorName.value = DoctorName;
        setDoctorName(DoctorName);
      } else {
        console.error('doctor name element not found');
      }

      const cash = document.getElementById('cash');
      if (cash) {
        cash.value = Cash;
        setCash(Cash);
      } else {
        console.error('cash element not found');
      }

      const age = document.getElementById('age');
      if (age) {
        age.value = Age;
        setAge(Age);
      } else {
        console.error('age element not found');
      }

      // const barcode = document.getElementById('barcode');
      // if (barcode) {
      //   barcode.value = Barcode;
      //   set(Barcode);
      // } else {
      //   console.error('cash element not found');
      // }

      const grossAmount = document.getElementById('gross_amount');
      if (grossAmount) {
        grossAmount.value = GrossAmount;
        setGrossAmount(GrossAmount);
      } else {
        console.error('gross amount element not found');
      }

      const discount = document.getElementById('discount');
      if (discount) {
        discount.value = Discount;
        setDiscount(Discount);
      } else {
        console.error('discount element not found');
      }

      const netAmount = document.getElementById('net_amount');
      if (netAmount) {
        netAmount.value = NetAmount;
        setNet_Amount(NetAmount);
      } else {
        console.error('net amount element not found');
      }

      const receivedAmount = document.getElementById('received_amount');
      if (receivedAmount) {
        receivedAmount.value = ReceivedAmount;
        setReceived_Amount(ReceivedAmount);
      } else {
        console.error('received amount element not found');
      }

      const balanceAmount = document.getElementById('balance_amount');
      if (balanceAmount) {
        balanceAmount.value = BalanceAmount;
        setBalance_Amount(BalanceAmount);
      } else {
        console.error('balance amount element not found');
      }

      const gender = document.getElementById('gender');
      if (gender) {
        const selectedGender = filteredOptionGender.find(option => option.value === Gender);
        setSelectedGender(selectedGender);
        setGender(selectedGender.value);
      } else {
        console.error('gender element not found');
      }

      await PurchaseDetail(BillNo);
    } else {
      console.log("Data not fetched...!");
    }
    console.log(data);
  };

  const PurchaseDetail = async (BillNo) => {
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/getBillingDetail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ BillNo: BillNo, company_code: sessionStorage.getItem("selectedCompanyCode") })
      });

      if (response.ok) {
        const searchData = await response.json();

        const newRowData = [];
        searchData.forEach(item => {
          const {
            Sno,
            ServiceID,
            ServiceName,
            Amount
          } = item;

          newRowData.push({
            serialNumber: Sno,
            ServiceID: ServiceID,
            ServiceName: ServiceName,
            Rate: Amount
          });
        });
        setRowData(newRowData);

      } else if (response.status === 404) {
        setRowData([
          { serialNumber: 1, Code: '', ServiceID: '', ServiceName: '', Rate: '' }
        ]);
        toast.warning('Details data is not found')
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPressRef = (e) => {
    if (e.key === 'Enter') {
      handleRefNo(Bill_no)
    }
  };

  const handleRefNo = async (code) => {
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/getBillingGetData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BillNo: code,
          company_code: sessionStorage.getItem("selectedCompanyCode")
        }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          toast.warning("Data not found");
          clearFormFields();
        } else {
          const errorResponse = await response.json();
          toast.error(errorResponse.message || "An error occurred");
        }
        return;
      }

      setDeleteButtonVisible(true);
      setPrintButtonVisible(true);

      const searchData = await response.json();
      if (searchData.Header && searchData.Header.length > 0) {
        const item = searchData.Header[0];
        setBill_no(item.BillNo);
        setBillDate(formatDateForInput(item.BillDate));
        setPatientID(item.PatientID);
        setcontact_no(item.ContactNumber);
        setclientid(item.ClientID);
        setvistno(item.VisitNo);
        setPatientID(item.PatientID);
        // setDoc(item.DoctorID);
        setCash(item.Cash);
        setGrossAmount(item.GrossAmount);
        // setPayementmode(item.PaymentModeID);
        setDiscount(item.Discount);
        setNet_Amount(item.NetAmount);
        setReceived_Amount(item.ReceivedAmount);
        setBalance_Amount(item.BalanceAmount);
        setGender(item.Gender);
        setPatientName(item.PatientName);
        setDoctorName(item.DoctorName);
        setClientName(item.ClientName);
        setAge(item.age);

        const selectedPay = filteredOptionGender.find(
          (option) => option.value === item.Gender
        );
        setSelectedGender(selectedPay);
        setGender(selectedPay.value);

        const selectedDoctor = filteredOptionDoctor.find(
          (option) => option.value === item.DoctorID
        );
        setSelectedDoctor(selectedDoctor);
        setDoc(selectedDoctor.value);

        const SelectedPayementmode = filteredOptionPayment.find(
          (option) => option.value === item.PaymentModeID
        );
        setSelectedPayementmode(SelectedPayementmode);
        setPayementmode(SelectedPayementmode.value);

      } else {
        console.log("Header Data is empty or not found");
        clearFormFields();
      }

      if (searchData.Detail && searchData.Detail.length > 0) {
        const updatedRowData = searchData.Detail.map((item) => {

          return {
            serialNumber: item.Sno,
            ServiceID: item.ServiceID,
            ServiceName: item.ServiceName,
            Rate: item.Amount
          };
        });

        setRowData(updatedRowData);
      } else {
        console.log("Detail Data is empty or not found");
        setRowData([
          { serialNumber: 1, Code: '', ServiceID: '', ServiceName: '', Rate: '' }
        ]);
      }

    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error(error.message || "Failed to fetch data");
    }
    finally {
      setLoading(false);
    }
  };

  const clearFormFields = () => {
    setBill_no("");
    setBillDate("");
    setPatientID("");
    setcontact_no("");
    setclientid("");
    setvistno("");
    setPatientID("");
    setDoc("");
    setCash("");
    setGrossAmount("");
    setPayementmode("");
    setDiscount("");
    setNet_Amount("");
    setReceived_Amount("");
    setBalance_Amount("");
    setGender("");
    setSelectedGender("");
    setRowData([
      {
        serialNumber: 1, Code: '', ServiceID: '', ServiceName: '', Rate: ''
      },
    ]);
  };

  const handleDeleteButtonClick = async () => {
    if (!Bill_no) {
      setDeleteError(" ");
      toast.warning('Error: Missing required fields');
      return;
    }


    showConfirmationToast(
      "Are you sure you want to delete the data ?",
      async () => {
        setLoading(true);
        try {
          const detailResult = await handleDeleteDetail();
          const headerResult = await handleDeleteHeader();

          if (headerResult === true && detailResult === true) {
            console.log("All API calls completed successfully");
            toast.success("Data Deleted Successfully", {
              autoClose: true,
              onClose: () => {
                window.location.reload();
              }
            });
          } else {
            const errorMessage =
              headerResult !== true
                ? headerResult
                : detailResult !== true
                  ? detailResult

                  : "An unknown error occurred.";

            toast.error(errorMessage);
          }
        } catch (error) {
          console.error("Error executing API calls:", error);
          toast.warning(error.message || "An Error occured while Deleting Data");
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.info("Data deleted cancelled.");
      }

    );
  };

  const handleDeleteHeader = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/HMS_BillHeaderDelete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ BillNo: Bill_no, company_code: sessionStorage.getItem("selectedCompanyCode") })
      });
      if (response.ok) {
        return true
      } else {
        const errorResponse = await response.json();
        return errorResponse.details || errorResponse.message || "Failed to delete header.";
      }
    } catch (error) {
      return "Error deleting header: " + error.message;
    }
  };

  const handleDeleteDetail = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/HMS_BillDetailsDelete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ BillNo: Bill_no, company_code: sessionStorage.getItem("selectedCompanyCode") })
      });
      if (response.ok) {
        return true
      } else {
        const errorResponse = await response.json();
        return errorResponse.details || errorResponse.message || "Failed to delete detail.";
      }
    } catch (error) {
      return "Error deleting detail: " + error.message;
    }
  };

  const PrintHeaderData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getBillingHeader`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ BillNo: Bill_no, company_code: sessionStorage.getItem('selectedCompanyCode') })
      });

      if (response.ok) {
        const searchData = await response.json();
        return searchData;
      } else if (response.status === 404) {
        console.log("Data not found");
      } else {
        console.log("Bad request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  const PrintDetailData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getBillingDetail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ BillNo: Bill_no, company_code: sessionStorage.getItem('selectedCompanyCode') })
      });

      if (response.ok) {
        const searchData = await response.json();
        return searchData;
      } else if (response.status === 404) {
        console.log("Data not found");
      } else {
        console.log("Bad request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  const generateReport = async () => {
    setLoading(true);

    try {
      const headerData = await PrintHeaderData();
      const detailData = await PrintDetailData();

      if (headerData && detailData) {
        console.log("All API calls completed successfully");

        sessionStorage.setItem('BillHeader', JSON.stringify(headerData));
        sessionStorage.setItem('BillDetail', JSON.stringify(detailData));

        window.open('/SalesPrint1', '_blank');

      } else {
        console.log("Failed to fetch some data");
        toast.error("Transaction No Does Not Exits");
      }

    } catch (error) {
      console.error("Error executing API calls:", error);
    }
    finally {
      setLoading(false);
    }
  };

  const getPatientName = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/getPatientName`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ PatientID: PatientID, company_code: sessionStorage.getItem("selectedCompanyCode") })
      });

      if (response.ok) {
        const searchData = await response.json();

        const [{ PatientID, PatientName, ContactNumber }] = searchData
        setPatientID(PatientID);
        setPatientName(PatientName);
        setcontact_no(ContactNumber);

      } else if (response.status === 404) {
        // toast.warning('Data not found')
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to fetch data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getClientName = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/getClientName`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ClientID: clientid, company_code: sessionStorage.getItem("selectedCompanyCode") })
      });

      if (response.ok) {
        const searchData = await response.json();

        const [{ ClientID, ClientName }] = searchData
        setclientid(ClientID);
        setClientName(ClientName);

        if (ClientID?.toLowerCase() === "default") {
          setIsClientNameEditable(true);
        } else {
          setIsClientNameEditable(false);
        }

      } else if (response.status === 404) {
        setclientid('');
        setClientName('')
        setIsPatientNameEditable(false);
        toast.warning('Data not found');
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to fetch data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDoctorName = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/getDoctorName`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ DoctorID: Doc, company_code: sessionStorage.getItem("selectedCompanyCode") })
      });

      if (response.ok) {
        const searchData = await response.json();

        const [{ DoctorID, DoctorName }] = searchData
        setDoc(DoctorID);
        setDoctorName(DoctorName);

        if (DoctorID?.toLowerCase() === "default") {
          setIsDoctorNameEditable(true);
        } else {
          setIsDoctorNameEditable(false);
        }

      } else if (response.status === 404) {
        setDoc('');
        setDoctorName('');
        setIsDoctorNameEditable(false);
        toast.warning('Data not found')
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to fetch data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemCode = async (params) => {
    setLoading(true)
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    try {
      const response = await fetch(`${config.apiBaseUrl}/getServiceDetail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_code, ServiceID: params.data.ServiceID })
      });

      if (response.ok) {
        const searchData = await response.json();

        setRowData(prevRowData =>
          prevRowData.map(row => {
            if (row.ServiceID === params.data.ServiceID) {
              const matchedItem = searchData.find(item => item.id === row.id);
              if (matchedItem) {
                return {
                  ...row,
                  ServiceID: matchedItem.ServiceID,
                  ServiceName: matchedItem.ServiceName,
                  Rate: matchedItem.Rate,
                };
              }
            }
            return row;
          })
        );
      } else if (response.status === 404) {
        toast.warning('Data not found!', {
          onClose: () => {
            setRowData(prevRowData =>
              prevRowData.map(row => {
                if (row.ServiceID === params.data.ServiceID) {
                  return { ...row, ServiceID: '', ServiceName: '', Rate: null };
                }
                return row;
              })
            );
          }
        });
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRow = () => {
    const serialNumber = rowData.length + 1;
    const newRow = { serialNumber, Code: '', ServiceID: '', ServiceName: '', Rate: null };
    setRowData([...rowData, newRow]);
  };

  const handleRemoveRow = () => {
    if (rowData.length > 0) {
      const updatedRowData = rowData.slice(0, -1);
      if (updatedRowData.length === 0) {
        setRowData([{ serialNumber: 1, Code: '', ServiceID: '', ServiceName: '', Rate: null }]);
      } else {
        setRowData(updatedRowData);
      }
    }
  };

  return (
    <div className="">
      <div className="container-fluid Topnav-screen">
        {loading && <LoadingScreen />}
        <ToastContainer position="top-right" className="toast-design" theme="colored" />
        <div className="shadow-lg p-1 bg-body-tertiary rounded  mb-2 mt-2">
          <div class="d-flex justify-content-between">
            <div className="d-flex justify-content-start">
              <h1 align="left" className="purbut me-5" >Billing</h1>
            </div>
            <div className="d-flex justify-content-end purbut me-3">
              {buttonsVisible && ['add', 'all permission'].some(permission => sales.includes(permission)) && (
                <savebutton className="purbut" onClick={handleSaveButtonClick} title='Save'>
                  <i class="fa-regular fa-floppy-disk"></i>
                </savebutton>
              )}
              {deleteButtonVisible && ['delete', 'all permission'].some(permission => sales.includes(permission)) && (
                <delbutton className="purbut" title='Delete' onClick={handleDeleteButtonClick} >
                  <i class="fa-solid fa-trash"></i>
                </delbutton>
              )}
              {printButtonVisible && ['all permission', 'view'].some(permission => sales.includes(permission)) && (
                <printbutton className="purbut" title="print" onClick={generateReport} >
                  <i class="fa-solid fa-file-pdf"></i>
                </printbutton>
              )}
              <printbutton className="purbut" onClick={handleReload} title='Reload'>
                <i class="fa-solid fa-arrow-rotate-right"></i>
              </printbutton>
            </div>
          </div>
          <div class="mobileview">
            <div class="d-flex justify-content-between">
              <div className="d-flex justify-content-start ms-5">
                <h1 align="left" className="h1">Billing</h1>
              </div>
              <div class="dropdown mt-1 ms-5">
                <button
                  class="btn btn-primary dropdown-toggle p-1"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i class="fa-solid fa-list"></i>
                </button>
                <ul class="dropdown-menu menu">
                  {buttonsVisible && ['add', 'all permission'].some(permission => sales.includes(permission)) && (
                    <li class="iconbutton d-flex justify-content-center text-success">
                      <icon class="icon" onClick={handleSaveButtonClick}>
                        <i class="fa-regular fa-floppy-disk"></i>
                      </icon>
                    </li>
                  )}
                  {deleteButtonVisible && ['delete', 'all permission'].some(permission => sales.includes(permission)) && (
                    <li class="iconbutton  d-flex justify-content-center text-danger">
                      <icon class="icon" onClick={handleDeleteButtonClick}>
                        <i class="fa-solid fa-trash"></i>
                      </icon>
                    </li>
                  )}
                  <li class="iconbutton  d-flex justify-content-center text-dark ">
                    {['view', 'all permission'].some(permission => sales.includes(permission)) && (
                      <icon class="icon" onClick={generateReport}>
                        <i class="fa-solid fa-file-pdf"></i>
                      </icon>
                    )}
                  </li>
                  <li class="iconbutton  d-flex justify-content-center ">
                    <icon class="icon" onClick={handleReload}>
                      <i class="fa-solid fa-arrow-rotate-right"></i>
                    </icon>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="shadow-lg p-1 bg-body-tertiary rounded  pt-3 pb-4" align="left">
          <div >
            <div className="row ms-3 me-3">
              <div className="col-md-3 form-group mb-2">
                <label htmlFor="party_code" >Bill No</label>
                <div className="exp-form-floating">
                  <div class="d-flex justify-content-end">
                    <input
                      className="exp-input-field form-control justify-content-start"
                      id='bill_no'
                      required
                      value={Bill_no}
                      onKeyPress={handleKeyPressRef}
                      onChange={(e) => setBill_no(e.target.value)}
                      autoComplete="off"
                    />
                    <div className='position-absolute mt-1 me-2'>
                      <span className="icon searchIcon"
                        onClick={handleSalesData}>
                        <i class="fa fa-search"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <div className="exp-form-floating">
                  <label htmlFor="" className="bill-date-label">Bill Date</label>
                  <input
                    name="transactionDate"
                    id="bill_date"
                    className="exp-input-field form-control"
                    type="date"
                    placeholder=""
                    required
                    value={billDate}
                    onChange={(e) => setBillDate(e.target.value)}
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <label htmlFor="party_code" className={`${error && !PatientID ? 'red' : ''}`}>
                  Patient ID<span className="text-danger">*</span>
                </label>
                <div className="exp-form-floating ">
                  <div class="d-flex justify-content-between">
                    <input
                      className="exp-input-field form-control"
                      id='patient_id'
                      required
                      value={PatientID}
                      type="text"
                      autoComplete='off'
                      onChange={(e) => setPatientID(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          getPatientName();
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <label htmlFor="party_code" >
                  Patient Name
                </label>
                <div className="exp-form-floating ">
                  <div class="d-flex justify-content-between">
                    <input
                      className="exp-input-field form-control"
                      id='patient_name'
                      required
                      value={PatientName}
                      type="text"
                      readOnly={PatientID !== "Default"}
                      onChange={(e) => setPatientName(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <div className="exp-form-floating">
                  <label htmlFor="" >Contact Number</label>
                  <input
                    id="contact_number"
                    value={contact_no}
                    className="exp-input-field form-control"
                    placeholder=""
                    required
                    type="text"
                    maxLength={10}
                    autoComplete="off"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setcontact_no(value);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <div className="exp-form-floating">
                  <label htmlFor="" className={`${error && !age ? 'red' : ''}`}>Age<span className="text-danger">*</span></label>
                  <input
                    id="age"
                    value={age}
                    className="exp-input-field form-control"
                    placeholder=""
                    required
                    autoComplete="off"
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <div class="exp-form-floating">
                  <label for="gender" class="exp-form-labels">
                    Gender
                  </label>
                  <div title="Select the Gender">
                    <Select
                      id="gender"
                      value={selectedGender}
                      onChange={handleChangeGender}
                      options={filteredOptionGender}
                      className="exp-input-field"
                      placeholder=""
                      maxLength={50}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <div className="exp-form-floating">
                  <label htmlFor="party_code" className={`${error && !clientid ? 'red' : ''}`}>Client ID<span className="text-danger">*</span></label>
                  <input
                    name="transactionNumber"
                    id="client_id"
                    type="text"
                    className="exp-input-field form-control"
                    placeholder=""
                    required
                    value={clientid}
                    onChange={(e) => setclientid(e.target.value)}
                    autoComplete="off"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        getClientName();
                      }
                    }}
                  />
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <div className="exp-form-floating">
                  <label >Client Name</label>
                  <input
                    name="transactionNumber"
                    id="client_name"
                    type="text"
                    className="exp-input-field form-control"
                    placeholder=""
                    required
                    value={ClientName}
                    readOnly={clientid !== "Default"}
                    onChange={(e) => setClientName(e.target.value)}
                    autoComplete="off"
                  />
                </div>
              </div>
              {/* <div className="col-md-3 form-group mb-2">
                <div className="exp-form-floating">
                  <label htmlFor="" className={`${error && !vistno ? 'red' : ''}`}>Visit No<span className="text-danger">*</span></label>
                  <input
                    id="visit_no"
                    value={vistno}
                    className="exp-input-field form-control"
                    placeholder=""
                    required
                    onChange={(e) => setvistno(e.target.value)} // <-- Add this line
                    isDisabled={true}
                    autoComplete="off"
                  />
                </div>
              </div> */}
              <div className="col-md-3 form-group mb-2">
                <label htmlFor="" className={`${error && !Payementmode ? 'red' : ''}`}>PaymentMode<span className="text-danger">*</span> </label>
                <div class="exp-form-floating">
                  <Select
                    id="paymentmode_id"
                    className="exp-input-field"
                    placeholder=""
                    required
                    value={SelectedPayementmode}
                    onChange={handleChangePayment}
                    options={filteredOptionPayment}
                  />
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <div className="exp-form-floating">
                  <label htmlFor="" className={`${error && !Doc ? 'red' : ''}`}>Doctor ID<span className="text-danger">*</span></label>
                  <Select
                    id="doctor_id"
                    value={SelectedDoctor}
                    className="exp-input-field"
                    placeholder=""
                    required
                    onChange={handleChangeDoctor}
                    options={filteredOptionDoctor}
                    autoComplete="off"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        getDoctorName();
                      }
                    }}
                  />
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <div className="exp-form-floating">
                  <label htmlFor="" >Doctor Name</label>
                  <input
                    id="doctor_name"
                    value={DoctorName}
                    className="exp-input-field form-control"
                    placeholder=""
                    required
                    readOnly={Doc !== "Default"}
                    onChange={(e) => setDoctorName(e.target.value)}
                    autoComplete="off"
                  />
                </div>
              </div>
              {/* <div className="col-md-3 form-group mb-2">
                <div className="exp-form-floating">
                  <label htmlFor="" >Cash</label>
                  <input
                    id="cash"
                    value={Cash}
                    className="exp-input-field form-control"
                    placeholder=""
                    required
                    type='number'
                    onChange={(e) => setCash(e.target.value)}
                    autoComplete="off"
                  />
                </div>
              </div> */}
              {/* <div className="col-md-3 form-group mb-2">
                <label for="">Barcode </label>
                <div class="exp-form-floating">
                  <input
                    id="barcode"
                    className="exp-input-field form-control"
                    placeholder=""
                    required
                    readOnly
                  />
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <div className="shadow-lg p-1 bg-body-tertiary rounded mt-2 pt-3 pb-4" align="left">
          <div className=''>
            <div className="">
              <div className="row ms-3 me-3">
                <div className="col-md-2 form-group mb-2">
                  <div className="exp-form-floating">
                    <label htmlFor="">Gross Amount</label>
                    <input
                      name=""
                      id="gross_amount"
                      type="number"
                      className="exp-input-field form-control input"
                      placeholder=""
                      required
                      readOnly
                      value={GrossAmount}
                      autoComplete="off"
                      onChange={(e) => setGrossAmount(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-2 form-group mb-2">
                  <div className="exp-form-floating">
                    <label htmlFor="">Discount</label>
                    <input
                      name=""
                      id="discount"
                      type="number"
                      className="exp-input-field form-control input"
                      placeholder=""
                      required
                      value={Discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="col-md-2 form-group mb-2">
                  <div className="exp-form-floating">
                    <label htmlFor="" >Net Amount</label>
                    <input
                      id="net_amount"
                      className="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required
                      value={Net_Amount}
                      onChange={(e) => setNet_Amount(e.target.value)}
                      readOnly
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="col-md-2 form-group mb-2">
                  <div className="exp-form-floating">
                    <label htmlFor="">Received Amount</label>
                    <input
                      name="totalTaxAmount"
                      id="received_amount"
                      text="text"
                      className="exp-input-field form-control"
                      placeholder=""
                      required
                      value={Received_Amount}
                      onChange={handleReceivedChange}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="col-md-2 form-group">
                  <div className="exp-form-floating">
                    <label htmlFor="">Balance Amount</label>
                    <input
                      name=""
                      id="balance_amount"
                      type="text"
                      className="exp-input-field form-control"
                      placeholder=""
                      required
                      value={Balance_Amount}
                      onChange={(e) => setBalance_Amount(e.target.value)}
                      readOnly
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="shadow-lg p-1 mt-2 bg-body-tertiary rounded  pt-3 pb-4" align="left">
          <div className="row ms-3 me-3">
            <div className="col-md-3">
              <label className={`form-label fw-semibold d-flex justify-content-start`}>Types Of Scan</label>
              <Select
                value={SelectedService}
                onChange={handleChangeService}
                isClearable
                options={filteredOptionService}
                placeholder="Select Service"
              />
            </div>
          </div>
          <div className="ag-grid-container position-relative rounded-top">
            <div className="d-flex justify-content-end align-items-center me-5 pt-2 bg-light rounded-top">
              <button
                type="button"
                className="btn btn-success btn-sm me-2"
                onClick={handleAddRow}
                title="Add Row"
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleRemoveRow}
                title="Remove Row"
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
            </div>
            <div className="ag-theme-alpine" style={{ height: 350, width: "100%" }}>
              <AgGridReact
                columnDefs={columnDef}
                rowData={rowData}
                defaultColDef={{ editable: true, resizable: true, flex: true }}
                onCellValueChanged={async (event) => { handleCellValueChanged(event); }}
              />
            </div>
          </div>
          <div>
            <ItemPopup open={open} handleClose={handleClose} handleItem={handleItem} />
            <BillingHelpPopup open={open1} handleClose={handleClose} handleBilling={handleBilling} />
          </div>
        </div>
      </div>
    </div>
  );
}


export default Sales;