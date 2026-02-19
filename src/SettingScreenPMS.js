import React, { useState, useEffect } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import "./apps.css";

import Select from "react-select";
import { showConfirmationToast } from './ToastConfirmation';
const config = require("./Apiconfig");

function PMSsettings() {
  const [statusdrop, setStatusdrop] = useState([]);
    const [PerDayWorkingHours, setPerDayWorkingHours] = useState("");
  const [defaultworking, setdefaultworking] = useState([]);
  const [generateid, setgenerateid] = useState("");
  const [selectedgenerate, setselectedgenerateid] = useState("");
   const [selectedStatus, setSelectedStatus] = useState(null);
    const [status, setstatus] = useState("");
    const [error, setError] = useState("");
    const [isUpdateVisible, setIsUpdateVisible] = useState(false);
  const [weekOffData, setWeekOffData] = useState([
    {
      relation: "weekOffData",
      members: [{ relationName: "", statusName: "" , keyfield:""}],
    },
  ]);
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);

  const location = useLocation();
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const familyPermissions = permissions
    .filter((permission) => permission.screen_type === "Family")
    .map((permission) => permission.permission_type.toLowerCase());
  


 const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

 const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setstatus(selectedStatus ? selectedStatus.value : '');
  };


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




useEffect(() => {
  fetch(`${config.apiBaseUrl}/GetPMSsettings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      company_code: sessionStorage.getItem("selectedCompanyCode"),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data || data.length === 0) return;

      const { Status, Per_Day_Working_hours } = data[0];

      const setDefault = (type, setType, options, setSelected) => {
        if (type !== undefined && type !== null) {
          const typeStr = type.toString();
          setType(typeStr);
          setSelected(options.find((opt) => opt.value === typeStr) || null);
        }
      };

      setDefault(Status, setstatus, filteredOptionStatus, setSelectedStatus);

      if (Per_Day_Working_hours) {
        setPerDayWorkingHours(Per_Day_Working_hours);
      }

      // 👇 Show Update button and hide Save
      setIsUpdateVisible(true);
    })
    .catch((error) => console.error("Error fetching data:", error));
}, [statusdrop]);



   const handleSave = async () => {
    if (
      !PerDayWorkingHours ||
      !status
    ) {
      setError(" ");
         toast.warning("Error: Missing required fields");
      return;
    }
    try {
      const response = await fetch(`${config.apiBaseUrl}/AddPMSSetting`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
         Per_Day_Working_hours: PerDayWorkingHours,
         Status: status,
          created_by: sessionStorage.getItem('selectedUserCode')
        }),
      });
      if (response.status === 200) {
        console.log("Data inserted successfully");
        setTimeout(() => {
          toast.success("Data inserted successfully!", {
            onClose: () => window.location.reload(), // Reloads the page after the toast closes
          });
        }, 1000);
      } else  {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message, {
          
        });
      } 
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message, {
       
      });
    }
    finally {
    
    }
  };

    const handleDelete = async () => {
    if (!PerDayWorkingHours || !status) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    showConfirmationToast(
      "Are you sure you want to Delete the data ?",
      async () => {
        try {
          const Header = {
            company_code: sessionStorage.getItem("selectedCompanyCode")
          };

          const response = await fetch(`${config.apiBaseUrl}/deletePMSsettings`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(Header),
          });

          if (response.status === 200) {
            console.log("Data deleted successfully");
            setTimeout(() => {
              toast.success("Data deleted successfully!", {
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
      },
      () => {
        toast.info("Data Delete cancelled.");
      }
    );
  };



 const handleUpdate = async () => {
  if (!PerDayWorkingHours || !status) {
    setError(" ");
    return;
  }

  try {
    const response = await fetch(`${config.apiBaseUrl}/PMSsettingsUpdate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_code: sessionStorage.getItem('selectedCompanyCode'),
        Per_Day_Working_hours: PerDayWorkingHours,
        Status: status,
        modified_by: sessionStorage.getItem('selectedUserCode')
      }),
    });

    if (response.status === 200) {
      console.log("Data inserted successfully");
      toast.success("Data Updated successfully!");

      // ⏳ Wait and reload
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } else if (response.status === 400) {
      const errorResponse = await response.json();
      console.error(errorResponse.message);
      toast.warning(errorResponse.message);
    } else {
      console.error("Failed to insert data");
      toast.error("Failed to insert data");
    }
  } catch (error) {
    console.error("Error inserting data:", error);
    toast.error("Error inserting data: " + error.message);
  }
};

  
 

  const reloadGridData = () => {
    window.location.reload();
  };



 



  return (
    <div className="container-fluid Topnav-screen">
      <ToastContainer
        position="top-right"
        className="toast-design"
        theme="colored"
      />
      <div className="shadow-lg p-0 bg-light rounded mb-2">
        <div className="purbut mb-0 d-flex justify-content-between">
          <div className="d-flex justify-content-start">
            <h1 className="purbut">PMS Setting Screen</h1>
          </div>
          <div className="d-flex justify-content-end purbut me-3">
  {!isUpdateVisible && (
  <savebutton className="purbut" onClick={handleSave} title="Save">
    <i className="fa-regular fa-floppy-disk"></i>
  </savebutton>
)}
            <reloadbutton
              className="purbut mt-3 me-3"
              onClick={reloadGridData}
              title="Reload"
            >
              <i className="fa-solid fa-arrow-rotate-right"></i>
            </reloadbutton>
          </div>
        </div>
         </div>
        <div className="shadow-lg p-3 bg-light rounded mb-1">
          <div className="row">
           
         
         
         <div className="col-md-3 form-group mb-2">
                <div class="exp-form-floating">
                  <label for="cusoff" class="exp-form-labels" className={`${error && !PerDayWorkingHours ? 'red' : ''}`}>
                 Per Day Working Hours<span className="text-danger">*</span>
                  </label><input
                    id="cusoff"
                    class="exp-input-field form-control"
                    type="number"
                    placeholder=""
                    required title="Please enter the office number"
                    value={PerDayWorkingHours}
                    onChange={(e) => setPerDayWorkingHours(e.target.value)}
                    maxLength={20}
                 
                  />
                </div>
              </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label class="exp-form-labels" className={`${error && !selectedStatus ? 'red' : ''}`}>
                  Status<span className="text-danger">*</span>
                </label>
                <Select
                  id="status"
                  value={selectedStatus}
                  onChange={handleChangeStatus}
                  onKeyDown={(e) => e.key === 'Enter'()}
                  options={filteredOptionStatus}
                  className="exp-input-field"
                  placeholder=""
                />
              </div>
            </div>
 <div className="col-md-1 mt-4">
  <>
    {isUpdateVisible &&
      ['update', 'all permission'].some(permission =>
        familyPermissions.includes(permission)
      ) && (
        <button
          type="button"
          className="btn btn-success"
          title="Update"
          onClick={handleUpdate}
        >
          <i className="fa-solid fa-floppy-disk"></i>
        </button>
      )}

    {isUpdateVisible &&
      ['delete', 'all permission'].some(permission =>
        familyPermissions.includes(permission)
      ) && (
        <button
          type="button"
          className="btn btn-danger"
          title="Delete"
          onClick={handleDelete}
        >
          <i className="fa-solid fa-trash"></i>
        </button>
      )}
  </>
</div>

                    </div>
        </div>
    </div>
  );
}

export default PMSsettings;
