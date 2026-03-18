import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "./apps.css";
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ItemImagePopup from './ItemImageHelp'
import labels from "./Labels";
import Barcode from 'react-barcode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from './Loading';
import { showConfirmationToast } from './ToastConfirmation';
const config = require('./Apiconfig');


function ItemBrandGrid() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const [editedData, setEditedData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState("");
  const [Item_code, setItem_code] = useState("");
  const [Item_name, setItem_name] = useState("");
  const [Item_variant, setItem_variant] = useState("");
  const [Item_short_name, setItem_short_name] = useState("");
  const [Item_Our_Brand, setItem_Our_Brand] = useState("");
  const [status, setstatus] = useState("");
  const [statusdrop, setStatusdrop] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusgriddrop, setStatusGriddrop] = useState([]);
  const [brandgriddrop, setBrandGriddrop] = useState([]);
  const [ourbranddrop, setourbranddrop] = useState([]);
  const [selectedItemCode, setSelectedItemCode] = useState(null);
  const [selectedItemImage, setSelectedItemIamge] = useState(null);
  const [loading, setLoading] = useState(false);    
  const [createdBy, setCreatedBy] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  // Handle cell click and open popup
  const handleClickOpen = (params) => {
    const itemCode = params.data.Item_code;
    const itemImage = params.data.item_images;
    setSelectedItemCode(itemCode);
    setSelectedItemIamge(itemImage);
    setOpen(true);
  };

  //code added by Harish purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const itemBrandPermission = permissions
    .filter(permission => permission.screen_type === 'Item')
    .map(permission => permission.permission_type.toLowerCase());


  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    
    fetch(`${config.apiBaseUrl}/ourbrand`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setourbranddrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    
    fetch(`${config.apiBaseUrl}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })      .then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const statusOption = data.map(option => option.attributedetails_name);
        setStatusGriddrop(statusOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    
    fetch(`${config.apiBaseUrl}/ourbrand`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })      .then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const brandOption = data.map(option => option.attributedetails_name);
        setBrandGriddrop(brandOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);



  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    
    fetch(`${config.apiBaseUrl}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setStatusdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);



  const filteredOptionBrand = ourbranddrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));


  const handleChangeBrand = (selectedBrand) => {
    setSelectedBrand(selectedBrand);
    setItem_Our_Brand(selectedBrand ? selectedBrand.value : '');
  };


  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setstatus(selectedStatus ? selectedStatus.value : '');
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  const handleSearch = async () => {
    const company_code = sessionStorage.getItem('selectedCompanyCode')
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/itemsearchdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ company_code, Item_code, Item_name, Item_variant, Item_short_name, Item_Our_Brand, status }) // Send company_no and company_name as search criteria
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log("data fetched successfully")
      } else if (response.status === 404) {
        console.log("Data not found");
        toast.warning("Data not found")
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error updating data: " + error.message);
    }finally {
      setLoading(false);
    }

  };


  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const columnDefs = [


    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: "Code",
      field: "Item_code",
      //editable: true,
      cellStyle: { textAlign: "center" },
      // minWidth: 250,
      // maxWidth: 250,
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
      },
    },
    {
      headerName: "Variant",
      field: "Item_variant",
      editable: true,
      cellStyle: { textAlign: "center" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 18,
      },
    },
    {
      headerName: "Name",
      field: "Item_name",
      editable: true,
      cellStyle: { textAlign: "center" },
      // minWidth: 150,
      // maxWidth: 150,
      cellEditorParams: {
        maxLength: 40,
      },
    },
    {
      headerName: "Barcode",
      field: "Barcode_Data",
      // minWidth: 200,
      cellRenderer: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Barcode
            value={params.value || ""}
            width={1.5}
            height={50}
            format="CODE128"
            displayValue={false}
          />
        </div>
      ),
    },
    {
      headerName: "Item Image",
      field: "item_images",
      editable: true,
      cellStyle: { textAlign: "center" },
      // minWidth: 150,
      // maxWidth: 150,
      cellEditorParams: {
        maxLength: 40,
      },
      cellRenderer: (params) => {
        if (params.value) {
          const base64Image = arrayBufferToBase64(params.value.data);
          return (
            <img src={`data:image/jpeg;base64,${base64Image}`}
              alt="Item Image"
              style={{ width: " 50px", height: "50px" }}
            />
          );
        } else {
          return "";
        }
      },
      // onCellClicked: (params) => {  
      //   const input = document.createElement("input");
      //   input.type = "file";
      //   input.accept = "image/*";
      //   input.click();

      //   input.onchange = function (event) {
      //     const file = event.target.files[0];
      //     if (file) {
      //       const reader = new FileReader();
      //       reader.onloadend = function () {
      //         const base64String = reader.result.split(',')[1]; 
      //         const binaryString = atob(base64String);
      //         const len = binaryString.length;
      //         const bytes = new Uint8Array(len);
      //         for (let i = 0; i < len; i++) {
      //           bytes[i] = binaryString.charCodeAt(i);
      //         }
      //         const arrayBuffer = bytes.buffer;
      //         params.node.setDataValue("item_images", { data: arrayBuffer });
      //       };
      //       reader.readAsDataURL(file); 
      //     }
      //   };
      // }
      onCellClicked: (params) => handleClickOpen(params),
    },
    {
      headerName: "Weight",
      field: "Item_wigh",
      editable: true,
      cellStyle: { textAlign: "center" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 20,
      },
    },
    {
      headerName: "Base UOM",
      field: "Item_BaseUOM",
      editable: true,
      cellStyle: { textAlign: "center" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 60,
      },
    },
    {
      headerName: "Secondary UOM",
      field: "Item_SecondaryUOM",
      editable: true,
      cellStyle: { textAlign: "center" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 60,
      },
    },
    {
      headerName: "Short Name",
      field: "Item_short_name",
      editable: true,
      cellStyle: { textAlign: "center" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 50,
      },
    },
    {
      headerName: "Without Tax",
      field: "Item_Last_salesRate_ExTax",
      editable: true,
      cellStyle: { textAlign: "center" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 20,
      },
    },
    {
      headerName: "With Tax",
      field: "Item_Last_salesRate_IncludingTax",
      editable: true,
      cellStyle: { textAlign: "center" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 20,
      },
    },
    {
      headerName: "Purchase Price",
      field: "Item_std_purch_price",
      editable: true,
      cellStyle: { textAlign: "center" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 20,
      },
    },
    {
      headerName: "Sales Price",
      field: "Item_std_sales_price",
      editable: true,
      cellStyle: { textAlign: "center" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 20,
      },
    },
    {
      headerName: "MRP Price",
      field: "MRP_Price",
      editable: true,
      cellStyle: { textAlign: "center" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 20,
      },
    },
    {
      headerName: "Discount %",
      field: "discount_Percentage",
      editable: true,
      cellStyle: { textAlign: "center" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 20,
      },
    },
    {
      headerName: "Stock Code",
      field: "Item_stock_code",
      editable: true,
      cellStyle: { textAlign: "center" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 10,
      },
    },
    {
      headerName: "Other Purchase Tax",
      field: "Item_other_purch_taxtype",
      editable: true,
      cellStyle: { textAlign: "center" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 18,
      },
    },
    {
      headerName: "Purchase Tax",
      field: "Item_purch_tax_type",
      editable: true,
      cellStyle: { textAlign: "center" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 18,
      },
    },
    {
      headerName: "Other Sales Tax",
      field: "Item_other_sales_taxtype",
      editable: true,
      cellStyle: { textAlign: "center" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 18,
      },
    },
    {
      headerName: "Sales Tax",
      field: "Item_sales_tax_type",
      editable: true,
      cellStyle: { textAlign: "center" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 18,
      },
    },
    {
      headerName: "Stock Type",
      field: "Item_stock_type",
      editable: true,
      cellStyle: { textAlign: "center" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 50,
      },
    },
    {
      headerName: "HSN Code",
      field: "hsn",
      editable: true,
      cellStyle: { textAlign: "center" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 6,
      },
    },
    {
      headerName: "Register Brand",
      field: "Item_Register_Brand",
      editable: true,
      cellStyle: { textAlign: "center" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 30,
      },
    },
    {
      headerName: "Our Brand",
      field: "Item_Our_Brand",
      editable: true,
      cellStyle: { textAlign: "center" },
      // minWidth: 150,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: brandgriddrop
      },
    },
    {
      headerName: "Status",
      field: "status",
      editable: true,
      cellStyle: { textAlign: "center" },
      // minWidth: 150,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: statusgriddrop
      },
    },

  ];

  const defaultColDef = {
    resizable: true,
    wrapText: true,
    // flex: 1,
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const onSearchInputChange = (e) => {
    setSearchValue(e.target.value);
    if (gridApi) {
      gridApi.setQuickFilter(e.target.value);
    }
  };
  const generateReport = () => {
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      toast.warning("Please select at least one row to generate a report");
      return
    };

    const reportData = selectedRows.map((row) => {
      return {

        "Code": row.Item_code,
        "Type": row.Item_variant,
        "Item Name": row.Item_name,
        "Item Weight": row.Item_wigh,
        "Base UOM": row.Item_BaseUOM,
        "SecondaryUOM": row.Item_SecondaryUOM,
        "Short Name": row.Item_short_name,
        "Base UOM": row.Item_BaseUOM,
        "Without Tax": row.Item_Last_salesRate_ExTax,
        "With Tax": row.Item_Last_salesRate_IncludingTax,
        "Purchase Price": row.Item_std_purch_price,
        "Sales Price": row.Item_std_sales_price,
        "Stock Code": row.Item_stock_code,
        "Stock TYPE": row.Item_stock_type,
        "Tax Type": row.Item_tax_type,
        "Cash Or Credit": row.Item_Costing_Method,
        "HSN Code": row.hsn,
        "Register Brand": row.Item_Register_Brand,
        "Our Brand": row.Item_Our_Brand,
        "Status": row.status,
        // "Annual Report URL": row.AnnualReportURL,
        // "created by": row.created_by,
        // "created date": row.created_date,
        // "modfied by": row.modfied_by,
        // "modfied date": row.modfied_date,
      };
    });

    const reportWindow = window.open("", "_blank");
    reportWindow.document.write("<html><head><title>Item</title>");
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
    reportWindow.document.write("<h1><u>Item Information</u></h1>");

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

  /*const handleNavigateToForm = () => {
    navigate("/form");
  };*/
  const handleNavigateToForm = () => {
    navigate("/AddItem", { state: { mode: "create" } }); // Pass selectedRows as props to the Input component
  };
  const handleNavigateWithRowData = (selectedRow) => {
    navigate("/AddItem", { state: { mode: "update", selectedRow } });
  };

  const onSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };

  // Assuming you have a unique identifier for each row, such as 'id'
  const onCellValueChanged = (params) => {
    const updatedRowData = [...rowData];
    const rowIndex = updatedRowData.findIndex(
      (row) => row.Item_code === params.data.Item_code && row.Item_variant === params.data.Item_variant
    );
    if (rowIndex !== -1) {
      updatedRowData[rowIndex][params.colDef.field] = params.newValue;
      setRowData(updatedRowData);

      // Add the edited row data to the state
      setEditedData((prevData) => [...prevData, updatedRowData[rowIndex]]);
    }
  };

  const saveEditedData = async () => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    const modified_by = sessionStorage.getItem('selectedUserCode');
    const selectedRowsData = editedData.filter(row => selectedRows.some(selectedRow => selectedRow.Item_code === row.Item_code));


    if (selectedRowsData.length === 0) {
      toast.warning("Please select and modify at least one row to update its data");
      return;
    }

    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        setLoading(true);
        try {


          const response = await fetch(`${config.apiBaseUrl}/updateitemData`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code,
              "Modified-By": modified_by
            },


            body: JSON.stringify({ editedData: selectedRowsData }), // Send only the selected rows for saving
            "company_code": company_code,
            "modified_by": modified_by
          });


          if (response.status === 200) {
            toast.success("Data Updated Successfully", {
              onClose: () => handleSearch(),
              autoClose: 1000,
            });
            return;
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to Update");
          }
        } catch (error) {
          console.error("Error saving data:", error);
          toast.error("Error Updating Data: " + error.message);
        }finally {
          setLoading(false);
        }
    
      },
      () => {
        toast.info("Data updated cancelled.");
      }
    );
  };


  const deleteSelectedRows = async () => {
    const selectedRows = gridApi.getSelectedRows();

    if (selectedRows.length === 0) {
      toast.warning("Please select atleast One Row to Delete")
      return;
    }

    const company_code = sessionStorage.getItem('selectedCompanyCode');
    const modified_by = sessionStorage.getItem('selectedUserCode');
    const Item_codesToDelete = selectedRows.map((row) => row.Item_code);

    showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {
        setLoading(true);
        try {
          const response = await fetch(`${config.apiBaseUrl}/delItemBrandData`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code,
              "Modified-By": modified_by
            },
            body: JSON.stringify({ Item_codes: Item_codesToDelete }),
            "company_code": company_code,
            "modified_by": modified_by
          });

          if (response.ok) {
            toast.success("Data Deleted successfully", {
              onClose: () => handleSearch(),
              autoClose: 1000,
            });
          }
        } catch (err) {
          console.error("Error deleting rows:", err);
          toast.error('Error Deleting Data:' + err.message);
        }finally {
          setLoading(false);
        }
    
      },
      () => {
        toast.info("Data Delete cancelled.");
      }
    );
  };


  const formatDate = (dateString) => {
    if (!dateString) return ""; // Return 'N/A' if the date is missing
    const date = new Date(dateString);

    // Format as DD/MM/YYYY
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
                Item
              </h1>
            </div>

            <div className="d-flex justify-content-end purbut me-3">
              {['add', 'all permission'].some(permission => itemBrandPermission.includes(permission)) && (
                <addbutton className="purbut" onClick={handleNavigateToForm}
                  required title="Add Item"> <i class="fa-solid fa-user-plus"></i> </addbutton>
              )}
              {['delete', 'all permission'].some(permission => itemBrandPermission.includes(permission)) && (
                <delbutton
                  className="purbut" onClick={deleteSelectedRows} required title="Delete">
                  <i class="fa-solid fa-user-minus"></i>
                </delbutton>
              )}
              {['update', 'all permission'].some(permission => itemBrandPermission.includes(permission)) && (
                <savebutton class="purbut" onClick={saveEditedData} required title="Update"><i class="fa-solid fa-floppy-disk"></i></savebutton>
              )}


              {['all permission', 'view'].some(permission => itemBrandPermission.includes(permission)) && (
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
                <div class="d-flex justify-content-between">
                  <h1 align="left" className="h1">Item</h1>
                </div>
                <div class="dropdown mt-1 me-5 ms-5" >
                  <button class="btn btn-primary dropdown-toggle p-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fa-solid fa-list"></i>
                  </button>
                  <ul class="dropdown-menu menu">
                    <li class="iconbutton d-flex justify-content-center text-success">
                      {["add", "all permission"].some((permission) =>
                        itemBrandPermission.includes(permission)
                      ) && (
                          <icon
                            class="icon"
                            onClick={handleNavigateToForm}
                          >
                            <i class="fa-solid fa-user-plus"></i>
                            {" "}
                          </icon>
                        )}
                    </li>
                    <li class="iconbutton  d-flex justify-content-center text-danger">
                      {["delete", "all permission"].some((permission) =>
                        itemBrandPermission.includes(permission)
                      ) && (
                          <icon
                            class="icon"
                            onClick={deleteSelectedRows}
                          >

                            <i class="fa-solid fa-user-minus"></i>
                          </icon>
                        )}
                    </li>
                    <li class="iconbutton  d-flex justify-content-center text-primary ">
                      {["update", "all permission"].some((permission) =>
                        itemBrandPermission.includes(permission)
                      ) && (
                          <icon
                            class="icon"
                            onClick={saveEditedData}
                          >
                            <i class="fa-solid fa-floppy-disk"></i>
                          </icon>
                        )}{" "}
                    </li>
                    <li class="iconbutton  d-flex justify-content-center ">
                      {["all permission", "view"].some((permission) =>
                        itemBrandPermission.includes(permission)
                      ) && (
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

          <div className="row ms-4 mt-3 mb-3  me-4">
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="Icode" class="exp-form-labels">
                  Code
                </label><input
                  id="Icode"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please fill the code here"
                  value={Item_code}
                  onChange={(e) => setItem_code(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  maxLength={18}
                />

              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="Itemvar" class="exp-form-labels">
                  Variant
                </label> <input
                  id="Itemvar"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please fill the variant here"
                  value={Item_variant}
                  onChange={(e) => setItem_variant(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  maxLength={18}
                />

              </div>
            </div>

            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="Iname" class="exp-form-labels">
                  Name
                </label><input
                  id="Iname"
                  className="exp-input-field form-control"
                  type=""
                  placeholder=""
                  required title="Please fill the name here"
                  value={Item_name}
                  onChange={(e) => setItem_name(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  maxLength={40}
                />

              </div>
            </div>

            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="Ishname" class="exp-form-labels">
                  Short Name
                </label><input
                  id="Ishname"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please fill the short name here"
                  value={Item_short_name}
                  onChange={(e) => setItem_short_name(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  maxLength={50}
                />

              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="Iourbrand" class="exp-form-labels">
                  Our Brand
                </label>
                <div title="Select the Own Brand">
                <Select
                  id="ahsts"
                  value={selectedBrand}
                  onChange={handleChangeBrand}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  options={filteredOptionBrand}
                  className="exp-input-field"
                  placeholder=""
                  maxLength={30}
                />
              </div>
              </div>
            </div>


            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label class="exp-form-labels">
                  Status
                </label>
<div title="Select the Status">
                <Select
                  id="ahsts"
                  value={selectedStatus}
                  onChange={handleChangeStatus}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  options={filteredOptionStatus}
                  className="exp-input-field"
                  placeholder=""
                />
</div>
              </div>
            </div>
            <div className="col-md-3 form-group mt-4">
              <div class="exp-form-floating">
                <div class=" d-flex  justify-content-center">

                  <div class=''><icon className="popups-btn fs-6 p-3" onClick={handleSearch} required title="Search"><i className="fas fa-search"></i></icon></div>
                  <div><icon className="popups-btn fs-6 p-3" onClick={reloadGridData} required title="Refresh"><FontAwesomeIcon icon="fa-solid fa-arrow-rotate-right" /></icon></div>
                </div> </div></div></div>

          {/* <p>Result Set</p> */}

          <div class="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              onCellValueChanged={onCellValueChanged}
              rowSelection="multiple"
              pagination={true}
              onSelectionChanged={onSelectionChanged}
              paginationAutoPageSize={true}
              onRowSelected={onRowSelected} />
          </div>
        </div>
        <div>
          <ItemImagePopup open={open} handleClose={handleClose} itemCode={selectedItemCode} itemImage={selectedItemImage} />
        </div>
      </div>
      <div className="shadow-lg p-2 bg-body-tertiary rounded mt-2 mb-2">
        <div className="row ms-2">
          <div className="d-flex justify-content-start">
            <p className="col-md-6">{labels.createdBy}: {createdBy}</p>
            <p className="col-md-6">{labels.createdDate}: {createdDate}</p>
          </div>
          <div className="d-flex justify-content-start">
            <p className="col-md-6">{labels.modifiedBy}: {modifiedBy}</p>
            <p className="col-md-6"> {labels.modifiedDate}: {modifiedDate}</p>
          </div>
        </div>
      </div>
    </div>


  );
}

export default ItemBrandGrid;
