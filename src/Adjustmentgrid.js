import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "./apps.css";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select'
import * as XLSX from 'xlsx';
import AdjustmentPopup from "./AdjustmentPopup";
import SalesItemPopup from "./ItemPopup";
import { showConfirmationToast } from './ToastConfirmation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import labels from './Labels';
import LoadingScreen from './Loading';

const config = require('./Apiconfig');

function AdjustmentGrid() {
  const [rowData, setRowData] = useState([{ Item_SNo: 1, item_code: '', qty: 0 }]);
  const [transaction_date, settransaction_date] = useState("");
  const [transaction_type, settransaction_type] = useState("");
  const [transaction_no, settransaction_no] = useState("");
  const [Transactiondrop, setTransactiondrop] = useState([]);
  const [selectedTransaction, setselectedTransaction] = useState('');
  // const [Transdrop, setTransdrop] = useState([]);
  const [financialYearStart, setFinancialYearStart] = useState('');
  const [financialYearEnd, setFinancialYearEnd] = useState('');
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [showExcelButton, setShowExcelButton] = useState(false);
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [globalItem, setGlobalItem] = useState(null);
  const [global, setGlobal] = useState(null);
  const [isAdjustmentDataRun, setIsAdjustmentDataRun] = useState(false);
  const [loading, setLoading] = useState('');
  const [additionalData, setAdditionalData] = useState({
    modified_by: '',
    created_by: '',
    modified_date: '',
    created_date: ''
  });

  //code added by Harish  purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const adjusmentPermission = permissions
    .filter(permission => permission.screen_type === 'Adjustment')
    .map(permission => permission.permission_type.toLowerCase());

  // useEffect(() => {
  //   const company_code = sessionStorage.getItem('selectedCompanyCode');
  //   fetch(`${config.apiBaseUrl}/Transaction`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ company_code })
  //   })      .then((response) => response.json())
  //     .then((data) => {
  //       const Transaction = data.map(option => option.attributedetails_name);
  //       setTransdrop(Transaction);
  //     })
  //     .catch((error) => console.error('Error fetching data:', error));
  // }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/Transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setTransactiondrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionTransaction = Transactiondrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangetransaction = (selectedTransaction) => {
    setselectedTransaction(selectedTransaction);
    settransaction_type(selectedTransaction ? selectedTransaction.value : '');
  };

  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    let startYear, endYear;
    if (currentMonth >= 4) {
      startYear = currentYear;
      endYear = currentYear + 1;
    } else {
      startYear = currentYear - 1;
      endYear = currentYear;
    }

    const financialYearStartDate = new Date(startYear, 3, 1).toISOString().split('T')[0]; // April 1
    const financialYearEndDate = new Date(endYear, 2, 31).toISOString().split('T')[0]; // March 31

    setFinancialYearStart(financialYearStartDate);
    setFinancialYearEnd(financialYearEndDate);
  }, []);

  const handleClickOpen = (params) => {
    const GlobalSerialNumber = params.data.Item_SNo
    setGlobal(GlobalSerialNumber)
    const GlobalItem = params.data.item_code
    setGlobalItem(GlobalItem)
    setOpen(true);
    console.log('Opening popup...');
  };

  function qtyValueSetter(params) {
    const newValue = parseFloat(params.newValue);
    if (isNaN(newValue) || newValue < 0) {
      toast.warning('Quantity cannot be negative!');
      return false;
    }
    params.data.qty = newValue;
    return true;
  }

  const handleDelete = (params) => {
    const serialNumberToDelete = params.data.Item_SNo;
    let updatedRowData = rowData.filter(row => row.Item_SNo !== serialNumberToDelete);
    setRowData(updatedRowData);

    if (updatedRowData.length === 0) {
      const newRow = {
        Item_SNo: 1,
        item_code: '',
        qty: ''
      };
      setRowData([newRow]);
    }
    else {
      const updatedRowDataWithNewSerials = updatedRowData.map((row, index) => ({
        ...row,
        Item_SNo: index + 1
      }));
      setRowData(updatedRowDataWithNewSerials);
    }
  };


  //ITEM CODE TO SEARCH IN AG GRID
  const handleItemCode = async (params) => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/getItemCodeSalesData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ Item_code: params.data.item_code, company_code: sessionStorage.getItem("selectedCompanyCode") })
      });

      if (response.ok) {
        const searchData = await response.json();
        const updatedRowData = rowData.map(row => {
          if (row.item_code === params.data.item_code) {
            const matchedItem = searchData.find(item => item.id === row.id);
            if (matchedItem) {
              return {
                ...row,
                item_code: matchedItem.Item_code
              };
            }
          }
          return row;
        });
        setRowData(updatedRowData);
        console.log(updatedRowData);
        return true;
      } else if (response.status === 404) {
        toast.warning('Data not found!', {
          onClose: () => {
            const updatedRowData = rowData.map(row => {
              if (row.item_code === params.data.item_code) {
                return {
                  ...row,
                  item_code: ''
                };
              }
              return row;
            });
            setRowData(updatedRowData);
          }
        });
        return false;
      } else {
        console.log("Bad request");
        toast.error("There was an issue with your request.");
        return false;
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("An error occurred while fetching the item data.");
      return false;
    } finally {
      setLoading(false);
    }
  };


  const columnDefs = [
    {
      headerName: "S.NO",
      field: "Item_SNo",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      editable: "false"
    },
    {
      headerName: '',
      field: 'delete',
      editable: false,
      maxWidth: 25,
      tooltipValueGetter: (p) =>
        "Delete",
      onCellClicked: handleDelete,
      cellRenderer: function (params) {
        return <FontAwesomeIcon icon="fa-solid fa-trash" style={{ cursor: 'pointer', marginRight: "12px" }} title='Delete' />
      },
      cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
      sortable: false
    },
    {
      headerName: "Item Code",
      field: "item_code",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 200,
      cellEditorParams: {
        maxLength: 18,
      },
      onCellValueChanged: function (params) {
        handleItemCode(params);
      },
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
                title='Item Help'
                onClick={() => handleClickOpen(params)}
              >
                <i className="fa fa-search"></i>
              </span>
            )}
          </div>
        );
      },
    },
    {
      headerName: "Quantity",
      field: "qty",
      editable: true,
      minWidth: 700,
      valueSetter: qtyValueSetter,
      cellEditorParams: {
        maxLength: 10,
      },
    },
  ];

  const handleItem = async (selectedData) => {
    console.log("Selected Data:", selectedData);
    let updatedRowDataCopy = [...rowData];
    let highestSerialNumber = updatedRowDataCopy.reduce((max, row) => Math.max(max, row.Item_SNo), 0);

    selectedData.map(item => {
      const existingItemWithSameCode = updatedRowDataCopy.find(row => row.Item_SNo === global && row.item_code === globalItem);

      if (existingItemWithSameCode) {
        console.log("if", existingItemWithSameCode);
        existingItemWithSameCode.item_code = item.itemCode;
        return true;
      }
      else {
        console.log("else");
        highestSerialNumber += 1;
        const newRow = {
          Item_SNo: highestSerialNumber,
          item_code: item.itemCode,
        };
        updatedRowDataCopy.push(newRow);
        return true;
      }
    });

    setRowData(updatedRowDataCopy);
    return true;
  };

  const handleSaveButtonClick = async () => {
    if (!transaction_date || !transaction_type) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    const hasValidDetails = rowData.some(row => row.item_code && row.item_code.trim() !== '' && Number(row.qty) > 0);

    if (!hasValidDetails) {
      toast.warning("No valid adjustment details found to save.");
      return;
    }
    setLoading(true);

    try {
      const Header = {
        company_code: sessionStorage.getItem('selectedCompanyCode'),
        transaction_date: transaction_date,
        transaction_type: transaction_type,
        created_by: sessionStorage.getItem('selectedUserCode')
      };
      const response = await fetch(`${config.apiBaseUrl}/addadjustmenthdr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Header),
      });

      if (response.ok) {
        const searchData = await response.json();
        const [{ transaction_no }] = searchData;
        settransaction_no(transaction_no);

        const detailSuccess = await AdjustmnetDetails(transaction_no);

        if (detailSuccess) {
          toast.success("Date inserted successfully.");
        } else {
          toast.warning("Header saved, but failed to save all details.");
        }

      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };


  const AdjustmnetDetails = async (transaction_no) => {
    try {
      const validRows = rowData.filter(row =>
        row.item_code && row.qty > 0
      );

      for (const row of validRows) {
        const Details = {
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          created_by: sessionStorage.getItem('selectedUserCode'),
          transaction_no: transaction_no,
          transaction_date: transaction_date,
          item_code: row.item_code,
          qty: row.qty,
          Item_SNo: row.Item_SNo,
        };

        const response = await fetch(`${config.apiBaseUrl}/addadjustmnetdetails`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Details),
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          toast.warning(errorResponse.message || "Failed to insert detail row");
          console.error(errorResponse.details || errorResponse.message);
          return false;
        }
      }

      return true;

    } catch (error) {
      console.error("Error inserting details:", error);
      toast.error("Error inserting detail data: " + error.message);
      return false;
    }
  };
  
  const handleDeleteButtonClick = async () => {
    if (!transaction_no) {
      setDeleteError(" ");
      toast.warning('Error: Missing required fields');
      return;
    }

    showConfirmationToast(
      "Are you sure you want to delete the data ?",
      async () => {
        setLoading(true);
        try {
          const detailResult = await AdjustmnetDetailDelete();
          const headerResult = await AdjustmnetHdrDelete();

          if (headerResult === true && detailResult === true) {
            console.log("Data Deleted SuccessFully");
            toast.success("Data Deleted SuccessFully", {
              autoClose: false,
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
          toast.error('Error inserting data: ' + error.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.info("Data deleted cancelled.");
      }
    );
  };

  const AdjustmnetHdrDelete = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/Adjustmnetdelhdr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ company_code: sessionStorage.getItem('selectedCompanyCode'), transaction_no: transaction_no })
      });
      if (response.ok) {
        return true;
      } else {
        const errorResponse = await response.json();
        return errorResponse.details || errorResponse.message || "Failed to delete header.";
      }
    } catch (error) {
      return "Error deleting header: " + error.message;
    }
  };

  const AdjustmnetDetailDelete = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/adjustmnetdeletedetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ company_code: sessionStorage.getItem('selectedCompanyCode'), transaction_no: transaction_no })
      });
      if (response.ok) {
        return true;
      } else {
        const errorResponse = await response.json();
        return errorResponse.details || errorResponse.message || "Failed to delete detail.";
      }
    } catch (error) {
      return "Error deleting detail: " + error.message;
    }
  };

  const generateReport = async () => {
    if (!transaction_no) {
      setDeleteError(" ");
      toast.warning('Error: Missing required fields');
      return;
    }
    setLoading(true);
    try {
      const headerData = await PrintHeaderData();
      const detailData = await PrintDetailData();

      if (headerData && detailData) {
        console.log("All API calls completed successfully");

        sessionStorage.setItem('ADheaderData', JSON.stringify(headerData));
        sessionStorage.setItem('ADdetailData', JSON.stringify(detailData));

        window.open('/AdjustmnetPrint', '_blank');
      } else {
        console.log("Failed to fetch some data");
        toast.error("Transaction Number Does Not Exits");
      }
    } catch (error) {
      console.error("Error executing API calls:", error);
    } finally {
      setLoading(false);
    }
  };

  const PrintHeaderData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/AdjustmnethdrPrint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ company_code: sessionStorage.getItem('selectedCompanyCode'), transaction_no: transaction_no })
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
      const response = await fetch(`${config.apiBaseUrl}/AdjustmnetdetPrint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ company_code: sessionStorage.getItem('selectedCompanyCode'), transaction_no: transaction_no })
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

  const transformRowData = (data) => {
    return data.map(row => ({
      "S.No": row.Item_SNo,
      "Item Code": row.item_code,
      "Quantity ": row.qty.toString(),
    }));
  };

  const handleExcelDownload = () => {

    const filteredRowData = rowData.filter(row => row.qty > 0);

    if (rowData.length === 0 || !transaction_no || !transaction_date || !selectedTransaction) {
      toast.warning('There is no data to export.');
      return;
    }

    const headerData = [{
      "company code": sessionStorage.getItem('selectedCompanyCode'),
      "Transaction No": transaction_no,
      "Transaction Date": transaction_date,
      "Transaction type": transaction_type
    }];

    const transformedData = transformRowData(filteredRowData);
    const rowDataSheet = XLSX.utils.json_to_sheet(transformedData);
    const headerSheet = XLSX.utils.json_to_sheet(headerData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, headerSheet, "Header Data");
    XLSX.utils.book_append_sheet(workbook, rowDataSheet, "Adjustment  Details");

    XLSX.writeFile(workbook, "Adjustmnet.xlsx");
  };

  const handleAddRow = () => {
    const Item_SNo = rowData.length + 1;
    const newRow = { Item_SNo, item_code: '', qty: 0 };
    setRowData([...rowData, newRow]);
  };

  const handleRemoveRow = () => {
    if (rowData.length > 0) {
      const updatedRowData = rowData.slice(0, -1);
      if (updatedRowData.length === 0) {
        setRowData([{ Item_SNo: '', item_code: '', qty: 0 }]);
      } else {
        setRowData(updatedRowData);
      }
    }
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleadjustment(transaction_no)
    }
  };

  const handleadjustment = async (code) => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/getadjustmentdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transaction_no: code, company_code: sessionStorage.getItem("selectedCompanyCode") })
      });

      if (response.ok) {
        setSaveButtonVisible(false);
        setShowExcelButton(true);
        // setUpdateButtonVisible(true);
        setIsAdjustmentDataRun(true);

        const searchData = await response.json();

        if (searchData.Header && searchData.Header.length > 0) {
          const item = searchData.Header[0];
          settransaction_date(formatDate(item.transaction_date));
          const selectedTransaction = filteredOptionTransaction.find(option => option.value === item.transaction_type);
          setselectedTransaction(selectedTransaction);
          settransaction_type(selectedTransaction)
        } else {
          console.log("Header Data is empty or not found");
          settransaction_date('');
          settransaction_no('');
          settransaction_type('')
        }

        if (searchData.Detail && searchData.Detail.length > 0) {
          const updatedRowData = searchData.Detail.map(item => {
            return {
              Item_SNo: item.Item_SNo,
              item_code: item.item_code,
              qty: item.qty
            };
          });

          setRowData(updatedRowData);
        } else {
          console.log("Detail Data is empty or not found");
          setRowData([{ Item_SNo: 1, item_code: '', qty: 0 }]);
        }

        console.log("data fetched successfully")
      } else if (response.status === 404) {
        toast.warning('Data not found');
        settransaction_date('');
        settransaction_no('');
        settransaction_type('');
        setRowData([{ serialNumber: 1, itemCode: '', itemName: '', warehouse: '', department: '', quantityIssued: '', reasonForIssuance: '', issuedBy: '', approvalStatus: '', actionTaken: '', notes: '' }]);

      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    } finally {
      setLoading(false);
    }
  };

  //Item Name Popup
  const handleClose = () => {
    setOpen(false);
    setOpen1(false);
  };

  const handleadjustmentbtn = () => {
    setOpen1(true);
  };

  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);

  const adjustmentData = async (data) => {
    if (data && data.length > 0) {
      setShowExcelButton(true)
      setSaveButtonVisible(false);
      // setUpdateButtonVisible(true);

      const [{ transactionNo, transactionDate, transactionType }] = data;

      const No = document.getElementById('transactionNO');
      if (No) {
        No.value = transactionNo;
        settransaction_no(transactionNo);
      } else {
        console.error('transactionNO element not found');
      }

      const Date = document.getElementById('transactionDate');
      if (Date) {
        Date.value = transactionDate;
        settransaction_date(formatDate(transactionDate));
      } else {
        console.error('transactionDate element not found');
      }

      const transactiontype = document.getElementById('transactionType');
      if (transactiontype) {
        const selectedTransaction = filteredOptionTransaction.find(option => option.value === transactionType);
        setselectedTransaction(selectedTransaction)
      } else {
        console.error('entry element not found');
      }

      await AdjustmentDetail(transactionNo);
      setIsAdjustmentDataRun(true);
    } else {
      console.log("Data not fetched...!");
    }
  };

  const AdjustmentDetail = async (transactionNo) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/AdjustmentDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transaction_no: transactionNo })
      });

      if (response.ok) {
        const searchData = await response.json();
        const newRowData = [];
        searchData.forEach(item => {
          const { Item_SNo, item_code, qty } = item;
          newRowData.push({
            Item_SNo: Item_SNo,
            item_code: item_code,
            qty: qty
          });
        });
        setRowData(newRowData)
      } else if (response.status === 404) {
        console.log("Data not found");
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  // const handleUpdateButtonClick = async () => {
  //   if (!transaction_no || !transaction_date ) {

  //     return;
  //   }

  //   if (rowData.length === 0) {
  //     toast.warning( "No  details found to save.");
  //     return;
  //   }

  //   try {

  //     const [detailResult] = await Promise.all([
  //       handleDeleteUpdateDetail()
  //     ]);
  //     if (!detailResult) {
  //       throw new Error('Detail deletion failed');
  //     }
  //     await Promise.all([
  //       updateadjustmentdetails()
  //     ]);
  //     toast.success("Journal  Data Upadated Successfully")
  //     console.log('Update successful');
  //   } catch (error) {
  //     console.error('Update failed:', error);
  //   }
  // };

  // const handleDeleteUpdateDetail = async () => {
  //   try {
  //     const response = await fetch(`${config.apiBaseUrl}/adjustmnetdeletedetails`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({ transaction_no })
  //     });
  //     if (response.ok) {
  //       return true
  //     } else {
  //       console.log("Failed to fetch some data");
  //     }
  //   } catch (error) {
  //     console.error("Error executing API calls:", error);
  //   }
  // };

  // const updateadjustmentdetails = async () => {
  //   try {
  //     for (const row of rowData) {
  //       const Details = {
  //         company_code: sessionStorage.getItem('selectedCompanyCode'),
  //         created_by: sessionStorage.getItem('selectedUserCode'),
  //         transaction_date,
  //         transaction_no,
  //         Item_SNo:row.Item_SNo,
  //         item_code:row.item_code,
  //         qty:row.qty
  //       };

  //       const response = await fetch(`${config.apiBaseUrl}/addadjustmnetdetails`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(Details),
  //       });

  //       if (response.ok) {
  //         console.log("Journal  Data inserted successfully");
  //       } else {
  //         const errorResponse = await response.json();
  //         console.error(errorResponse.message); // Log error message
  //         toast.warning(errorResponse.message);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error inserting data:", error);
  //   }
  // };


  //CODE ITEM CODE TO ADD NEW ROW FUNCTION
  const handleCellValueChanged = (params) => {
    const { colDef, rowIndex, newValue } = params;
    const lastRowIndex = rowData.length - 1;

    if (colDef.field === 'qty') {
      const quantity = parseFloat(newValue);

      if (quantity > 0 && rowIndex === lastRowIndex) {
        const Item_SNo = rowData.length + 1;
        const newRowData = {
          Item_SNo,
          item_code: null,
          qty: 0
        };
        setRowData(prevRowData => [...prevRowData, newRowData]);
      }
    }
  };

  //Default Date functionality
  const currentDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    settransaction_date(currentDate);
  }, [currentDate]);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;

    if (selectedDate >= financialYearStart && selectedDate <= financialYearEnd) {
      if (selectedDate !== currentDate) {
        console.log("Date has been changed.");
      }
      settransaction_date(selectedDate);
    } else {
      toast.warning('Transaction date must be between April 1st, 2024 and March 31st, 2025.');
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="container-fluid Topnav-screen">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div>
        <div className="shadow-lg p-1 bg-body-tertiary rounded  mb-2 mt-2">
          <div class="d-flex justify-content-between">
            <div className="d-flex justify-content-start">
              <h1 align="left" class="purbut me-5">Adjustment</h1>
            </div>
            <div class="d-flex justify-content-end me-3">
              {saveButtonVisible && ['add', 'all permission'].some(permission => adjusmentPermission.includes(permission)) && (
                <savebutton className="purbut" onClick={handleSaveButtonClick}
                  required title="Save"> <i class="fa-regular fa-floppy-disk"></i> </savebutton>
              )}
              {['delete', 'all permission'].some(permission => adjusmentPermission.includes(permission)) && (
                <delbutton onClick={handleDeleteButtonClick} required title="Delete">
                  <i class="fa-solid fa-trash"></i>
                </delbutton>
              )}
              {showExcelButton && ['all permission', 'view'].some(permission => adjusmentPermission.includes(permission)) && (
                <printbutton className="purbut" title="Print" onClick={generateReport}>
                  <i class="fa-solid fa-file-pdf"></i>
                </printbutton>
              )}
              {showExcelButton && (
                <printbutton className="purbut" title='Excel' onClick={handleExcelDownload}>
                  <i class="fa-solid fa-file-excel"></i>
                </printbutton>
              )}
              <printbutton className="purbut" title='Reload' onClick={handleReload}>
                <i class="fa-solid fa-arrow-rotate-right"></i>
              </printbutton>
            </div>
          </div>
          <div class="mobileview">
            <div class="d-flex justify-content-between">
              <div className="d-flex justify-content-start text-start">
                <h1 align="left" className="h1">Adjustment</h1>
              </div>
              <div class="dropdown mt-1 ms-4" style={{ marginLeft: 0 }}>
                <button class="btn btn-primary dropdown-toggle p-1 ms-3" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fa-solid fa-list"></i>
                </button>
                <ul class="dropdown-menu menu">
                  {saveButtonVisible && (
                    <li class="iconbutton d-flex justify-content-center text-success">
                      {['add', 'all permission'].some(permission => adjusmentPermission.includes(permission)) && (
                        <icon class="icon" onClick={handleSaveButtonClick}>
                          <i class="fa-regular fa-floppy-disk"></i>
                        </icon>
                      )}
                    </li>
                  )}
                  <li class="iconbutton  d-flex justify-content-center text-danger">
                    {['delete', 'all permission'].some(permission => adjusmentPermission.includes(permission)) && (
                      <icon class="icon" onClick={handleDeleteButtonClick}>
                        <i class="fa-solid fa-trash"></i>
                      </icon>
                    )}
                  </li>
                  <li class="iconbutton  d-flex justify-content-center text-warning">
                    {showExcelButton && ['all permission', 'view'].some(permission => adjusmentPermission.includes(permission)) && (
                      <icon class="icon" onClick={generateReport}>
                        <i class="fa-solid fa-file-pdf"></i>
                      </icon>
                    )}
                  </li>
                  {showExcelButton && (
                    <li class="iconbutton  d-flex justify-content-center text-info">
                      <icon class="icon" onClick={handleExcelDownload}>
                        <i class="fa-solid fa-file-excel"></i>
                      </icon>
                    </li>
                  )}
                  <li class="iconbutton  d-flex justify-content-center">
                    <icon class="icon" onClick={handleReload}>
                      <i class="fa-solid fa-arrow-rotate-right"></i>
                    </icon>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="shadow-lg p-1 bg-body-tertiary rounded mt-2 pt-3 pb-4">
          <div className="row ms-3 me-3">
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <label for="rolname" className={`${deleteError && !transaction_no ? 'red' : ''}`}>
                  Transaction No{isAdjustmentDataRun && <span className="text-danger">*</span>}
                </label>
                <div class="d-flex justify-content-end">
                  <input
                    id="transactionNO"
                    className="exp-input-field form-control justify-content-start"
                    type="text"
                    placeholder=""
                    required title="Please fill the transaction no here"
                    value={transaction_no}
                    onKeyPress={handleKeyPress}
                    onChange={(e) => settransaction_no(e.target.value)}
                  />
                  <div className='position-absolute mt-1 me-2'>
                    <span className="icon searchIcon"
                      title='Adjustment Help'
                      onClick={handleadjustmentbtn}>
                      <i class="fa fa-search"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <label for="rolname" className={`${error && !transaction_date ? 'red' : ''}`}>Transaction Date
                  {!isAdjustmentDataRun && <span className="text-danger">*</span>}</label>
                <input
                  id="transactionDate"
                  className="exp-input-field form-control"
                  type="date"
                  placeholder="Select the Date"
                  required title="Please fill the transaction date here"
                  min={financialYearStart}
                  max={financialYearEnd}
                  value={transaction_date}
                  maxLength={50}
                  onChange={handleDateChange}
                />
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <label for="tcode" className={`${error && !transaction_type ? 'red' : ''}`}>
                  Transaction Type{!isAdjustmentDataRun && <span className="text-danger">*</span>}
                </label>
                 <div title="Select the Transaction Type"> 
                <Select
                  id="transactionType"
                  value={selectedTransaction}
                  onChange={handleChangetransaction}
                  options={filteredOptionTransaction}
                  className="exp-input-field"
                  placeholder=""
                  required title="Please select a transaction type here"
                />
              </div>
            </div>
            </div>
          </div>
          <div class="d-flex justify-content-end me-5 mb-2" >
            <icon
              title="Add row"
              type="button"
              className="popups-btn"
              onClick={handleAddRow}>
              <FontAwesomeIcon icon={faPlus} />
            </icon>
            <icon
              title="Less row"
              type="button"
              className="popups-btn"
              onClick={handleRemoveRow}>
              <FontAwesomeIcon icon={faMinus} />
            </icon>
          </div>
          <div class="ag-theme-alpine" style={{ height: 545, width: "100%" }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={{ editable: true, resizable: true, flex: true }}
              pagination={true}
              paginationAutoPageSize={true}
              onCellValueChanged={async (event) => {
                handleCellValueChanged(event);
              }}
            />
          </div>
        </div>
      </div>
      <div>
        <AdjustmentPopup open={open1} handleClose={handleClose} adjustmentData={adjustmentData} />
        <SalesItemPopup open={open} handleClose={handleClose} handleItem={handleItem} />
      </div>
      <div className="shadow-lg p-2 bg-body-tertiary rounded mt-2 mb-2">
        <div className="row ms-2">
          <div className="d-flex justify-content-start">
            <p className="col-md-6">{labels.createdBy}: {additionalData.created_by}</p>
            <p className="col-md-6">{labels.createdDate}: {additionalData.created_date}</p>
          </div>
          <div className="d-flex justify-content-start">
            <p className="col-md-6">{labels.modifiedBy}: {additionalData.modified_by}</p>
            <p className="col-md-6"> {labels.modifiedDate}: {additionalData.modified_date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdjustmentGrid;