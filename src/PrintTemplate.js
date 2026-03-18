import React, { useState, useRef } from "react";
import "./apps.css"
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlus, faMinus, faRotateRight } from '@fortawesome/free-solid-svg-icons';

const config = require('./Apiconfig');

function PrintTemplate() {

    const [Academic, setAcademic] = useState([{ relation: 'Screens', members: [{ screenName: '', templatename: '', Templates: null, documentUrl: '' }] }]);
    const [Screens, setScreens] = useState("");
    const [templatename, settemplatename] = useState("");
    const [error, setError] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [documentUrl, setDocumentUrl] = useState({});
    const navigate = useNavigate();
    const created_by = sessionStorage.getItem('selectedUserCode')
    const [open, setOpen] = React.useState(false);
    const [saveButtonVisible, setSaveButtonVisible] = useState(true);
    const [isAcademicDataLoaded, setIsAcademicDataLoaded] = useState(false);
    const employeeIdRef = useRef(null);
    const [showAsterisk, setShowAsterisk] = useState(true);
    const [currentPdfUrl, setCurrentPdfUrl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePdfClick = (url) => {
        setCurrentPdfUrl(url);
        setIsModalOpen(true);  // Show the modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentPdfUrl(null);
    };


    const addRow = (relation) => {
        setAcademic((prev) =>
            prev.map((item) =>
                item.relation === relation
                    ? { ...item, members: [...item.members, { screenName: '', templatename: '', institution: '', }] }
                    : item
            )
        );
    };

    const deleteRow = (relation, index) => {
        setAcademic((prev) =>
            prev.map((item) =>
                item.relation === relation
                    ? { ...item, members: item.members.filter((_, i) => i !== index) }
                    : item
            )
        );
    };

    const handleSave = async () => {


        const employeeData = await Promise.all(

            Academic.flatMap((relationGroup) =>
                relationGroup.members.map(async (member) => {
                    if (member.Templates) {
                        // Check if file size exceeds 1MB before proceeding
                        const fileSize = member.Templates.size;
                        const maxSize = 1 * 1024 * 1024; // 1MB

                        if (fileSize > maxSize) {
                            toast.warning('File size exceeds 1MB. Please upload a smaller file.');
                            return; // Exit early if file is too large
                        }

                        const fileBase64 = member.Templates ? await convertToBase64(member.Templates) : null;
                        console.log(fileBase64)
                        return {
                            Screens: member.screenName,
                            Template_name: member.templatename,
                            Templates: fileBase64,
                            created_by: sessionStorage.getItem("selectedUserCode"),
                        };
                    }
                })
            )

        );

        try {
            const response = await fetch(`${config.apiBaseUrl}/AddPrintTemplate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ employeeData }),
            });
            if (response.ok) {
                setTimeout(() => {
                    toast.success("Data saved successfully!", {
                        onClose: () => window.location.reload(),
                    });
                }, 1000);
            } else {
                const errorResponse = await response.json();
                console.error(errorResponse.message);
                toast.warning(errorResponse.message, {
                })
            }
        } catch (err) {
            console.error("Error delete data:", err);
            toast.error('Error delete data: ' + err.message, {
            });
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(",")[1]); // Remove metadata prefix
            reader.onerror = (error) => reject(error);
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(Screens)
        }
    };

    const detectMimeTypeFromBuffer = (bufferData) => {
        const hex = bufferData.slice(0, 4).map(b => b.toString(16).toUpperCase());
        if (hex[0] === "25" && hex[1] === "50") return "application/pdf"; // PDF
        if (hex[0] === "FF" && hex[1] === "D8") return "image/jpeg";      // JPEG
        if (hex[0] === "89" && hex[1] === "50") return "image/png";       // PNG
        return "application/octet-stream"; // fallback
    };


    const convertBufferToBlobUrlAndFile = (buffer, fileName = "template") => {
        if (buffer && buffer.type === "Buffer") {
            const byteArray = new Uint8Array(buffer.data);
            const mimeType = detectMimeTypeFromBuffer(buffer.data);
            const blob = new Blob([byteArray], { type: mimeType });
            const extension = mimeType === "application/pdf" ? ".pdf"
                : mimeType === "image/jpeg" ? ".jpg"
                    : mimeType === "image/png" ? ".png"
                        : "";
            const blobUrl = URL.createObjectURL(blob);
            const file = new File([blob], fileName + extension, { type: mimeType });
            return { blobUrl, file, mimeType };
        }
        return { blobUrl: null, file: null, mimeType: null };
    };

    const RelationInputChange = (relation, index, field, value) => {
        setAcademic((prev) =>
            prev.map((item) =>
                item.relation === relation
                    ? {
                        ...item,
                        members: item.members.map((member, i) =>
                            i === index ? { ...member, [field]: value } : member
                        ),
                    }
                    : item
            )
        );
    };
    const handleFileChange = (event, index) => {
        const file = event.target.files[0];
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (file && allowedTypes.includes(file.type)) {
            const fileUrl = URL.createObjectURL(file);
            setAcademic(prev => {
                const updated = [...prev];
                updated[0].members[index].Templates = file;
                updated[0].members[index].documentUrl = fileUrl;
                return updated;
            });
        } else {
            toast.warning('Please upload a valid PDF or image file (JPEG, PNG).');
            event.target.value = '';
        }
    };

    const reloadGridData = () => {
        window.location.reload();
    };

    const handleUpdate = async (relationName, index) => {
        const relationGroup = Academic.find(group => group.relation === relationName);
        const member = relationGroup ? relationGroup.members[index] : null;

        if (!member.keyfield) {
            setDeleteError(" ");
            toast.warning("Error: Missing required keyfield")
            return;
        }

        if (!member) {
            setError(" ");
            return;
        }

        if (!member.academicName || !member.major || !member.institution || !member.academicYear) {
            setError(" ");
            return;
        }

        const fileBase64 = member.document ? await convertToBase64(member.document) : null;
        console.log(fileBase64);

        const editedData = {
            EmployeeId: Screens,
            academicName: member.academicName,
            major: member.major,
            institution: member.institution,
            academicYear: member.academicYear,
            document: fileBase64,
            keyfield: member.keyfield,
            company_code: sessionStorage.getItem("selectedCompanyCode")
        };

        try {
            const response = await fetch(`${config.apiBaseUrl}/updateEmployeeAcademicDetails`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ editedData: [editedData] }),
            });

            if (response.ok) {
                setTimeout(() => {
                    toast.success("Data updated successfully!", {
                        onClose: () => window.location.reload(),
                    });
                }, 1000);
            } else {
                const errorResponse = await response.json();
                console.error(errorResponse.message);
                toast.warning(errorResponse.message, {
                })
            }
        } catch (err) {
            console.error("Error delete data:", err);
            toast.error('Error delete data: ' + err.message, {
            });
        }
    };

    const handleDelete = async (relationName, index) => {
        const relationGroup = Academic.find(group => group.relation === relationName);
        const member = relationGroup ? relationGroup.members[index] : null;

        if (!member.keyfield) {
            setDeleteError(" ");
            toast.warning("Error: Missing required keyfield")
            return;
        }

        if (!member) {
            setError(" ");
            return;
        }

        if (!member.academicName || !member.major || !member.institution || !member.academicYear) {
            setError(" ");
            return;
        }

        const fileBase64 = member.document ? await convertToBase64(member.document) : null;
        console.log(fileBase64);

        const keyfieldsToDelete = {
            keyfield: member.keyfield,
            company_code: sessionStorage.getItem("selectedCompanyCode")
        };

        try {
            const response = await fetch(`${config.apiBaseUrl}/deleteEmployeeAcademicDetails`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ keyfieldsToDelete: [keyfieldsToDelete] }),
            });

            if (response.ok) {
                setTimeout(() => {
                    toast.success("Data deleted successfully!", {
                        onClose: () => window.location.reload(),
                    });
                }, 1000);
            } else {
                const errorResponse = await response.json();
                console.error(errorResponse.message);
                toast.warning(errorResponse.message, {
                })
            }
        } catch (err) {
            console.error("Error delete data:", err);
            toast.error('Error delete data: ' + err.message, {
            });
        }
    };



    const formatDate = (isoDateString) => {
        const date = new Date(isoDateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    const handleSearch = async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/Templatesearch`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Screens, templatename }),
            });
            if (response.ok) {
                const searchData = await response.json();
                if (searchData.length > 0) {
                    const updatedTemplateMembers = searchData.reduce((acc, item) => {
                        const { Screens, Template_name, Templates, Key_field } = item;
                        let documentUrl = null;
                        let documentFile = null;
                        if (Templates) {
                            const { blobUrl, file } = convertBufferToBlobUrlAndFile(Templates, Template_name);
                            documentUrl = blobUrl;
                            documentFile = file;
                        }
                        const memberData = {
                            screenName: Screens,
                            templatename: Template_name,
                            keyfield: Key_field,
                            documentUrl,
                            Templates: documentFile,
                        };
                        const existingRelation = acc.find(group => group.relation === Screens);
                        if (existingRelation) {
                            existingRelation.members.push(memberData);
                        } else {
                            acc.push({ relation: Screens, members: [memberData] });
                        }
                        return acc;
                    }, []);
                    setAcademic(updatedTemplateMembers);
                    setSaveButtonVisible(false);
                    setShowAsterisk(false);
                } else {
                    toast.warning("No matching data found");
                    setAcademic([]);
                }
            } else {
                const errorResponse = await response.json();
                toast.warning(errorResponse.message || "Failed to fetch data");
                setAcademic([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Error fetching data: " + error.message);
        }
    };


    return (
          <div className="container-fluid Topnav-screen">
        <ToastContainer position="top-right" className="toast-design" theme="colored" />
                    <div className="shadow-lg p-1 bg-light rounded">
                        <div className=" mb-0 d-flex justify-content-between" >
                            <div class="d-flex justify-content-start">
                                <h1 class="">Print Templates</h1>
                            </div>
                            <div className='d-flex justify-content-end me-4'>
                                <div onClick={handleSave} className='col-md-2'><a className='border-none text-success p-1' title="Save" style={{ cursor: "pointer" }}><svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" class="bi bi-floppy2" viewBox="0 0 16 16">
                                    <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v3.5A1.5 1.5 0 0 1 11.5 6h-7A1.5 1.5 0 0 1 3 4.5V1H1.5a.5.5 0 0 0-.5.5m9.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z" />
                                </svg>
                                </a>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="shadow-lg bg-light rounded mt-2 p-3">
                        <div class="row">
                            <div className="col-md-3 form-group mb-2 me-1">
                                <label className='fw-bold'>Screens</label>
                                <div class="exp-form-floating">
                                    <div class="d-flex justify-content-end">
                                        <input
                                            id="employeeId"
                                            className="exp-input-field form-control"
                                            type="text"
                                            placeholder=""
                                            required
                                            value={Screens}
                                            ref={employeeIdRef}
                                            onChange={(e) => setScreens(e.target.value)}
                                            maxLength={18}
                                            onKeyPress={handleKeyPress}
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 form-group mb-2 me-1">
                                <label className='fw-bold' >Template Name</label>
                                <div class="exp-form-floating">
                                    <div class="d-flex justify-content-end">
                                        <input
                                            id="employeeId"
                                            className="exp-input-field form-control"
                                            type="text"
                                            placeholder=""
                                            required
                                            title="Please enter the EmployeeId"
                                            value={templatename}
                                            ref={employeeIdRef}
                                            onChange={(e) => settemplatename(e.target.value)}
                                            maxLength={18}
                                            onKeyPress={handleKeyPress}
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2 mb-2 mt-4">
                                <button className="button2" onClick={handleSearch} title="Search">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                        className="bi bi-search" viewBox="0 0 16 16">
                                        <path
                                            d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="mb-4 mt-2">
                        {Academic.map((relationGroup, relationIndex) => (
                            <div key={relationIndex} className="shadow-sm p-1 bg-light rounded-0 ">
                                {relationGroup.members.map((member, index) => (
                                    <div key={index} className="row  mt-3">
                                        <div className="col-md-1 mt-4">
                                            <button type="button" className="btn btn-primary ms-3" onClick={() => addRow(relationGroup.relation)}>
                                                <FontAwesomeIcon icon={faPlus} />
                                            </button>
                                            {relationGroup.members.length > 1 && (
                                                <button type="button" className="btn btn-danger ms-2"
                                                    onClick={() => deleteRow(relationGroup.relation, index)}>
                                                    <FontAwesomeIcon icon={faMinus} />
                                                </button>
                                            )}
                                        </div>
                                        <div className="col-md-2 form-group mb-2">
                                            <label className={`${error && !member.screenName ? 'red' : ''}`}>Screens{showAsterisk && <span className="text-danger">*</span>}</label>
                                            <input
                                                type="text"
                                                className="exp-input-field form-control"
                                                value={member.screenName}
                                                maxLength={50}
                                                title="Please enter the Academic Name"
                                                onChange={(e) => RelationInputChange(relationGroup.relation, index, 'screenName', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-2 form-group mb-2">
                                            <label className={`${error && !member.templatename ? 'red' : ''}`}>Template Name {showAsterisk && <span className="text-danger">*</span>}</label>
                                            <input
                                                type="text"
                                                className="exp-input-field form-control"
                                                value={member.templatename}
                                                maxLength={125}
                                                title="Please enter the Major"
                                                onChange={(e) => RelationInputChange(relationGroup.relation, index, 'templatename', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-2 form-group mb-2">
                                            <div className="exp-form-floating">
                                                <label className="exp-form-labels">Templates</label>
                                                <input
                                                    type="file"
                                                    className="exp-input-field form-control"
                                                    accept=".pdf,.jpeg,.jpg,.png"
                                                    onChange={(e) => handleFileChange(e, index)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-1 mt-4">
                                            {isAcademicDataLoaded && (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="btn btn-success"
                                                        title="Update"
                                                        onClick={() => handleUpdate(relationGroup.relation, index)}
                                                    >
                                                        <i className="fa-solid fa-floppy-disk"></i>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger"
                                                        title="Delete"
                                                        onClick={() => handleDelete(relationGroup.relation, index)}>
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                        <div className="d-flex col-md-1 mt-4 justify-content-end">
                                            <div className="exp-form-floating">
                                                <div
                                                    className="pdf-frame"
                                                    style={{
                                                        width: "200px",
                                                        height: "200px",
                                                        border: "2px solid #ccc",
                                                        padding: "10px",
                                                        textAlign: "center",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        overflow: "hidden",
                                                    }}
                                                    onClick={() => handlePdfClick(member.documentUrl)}
                                                >
                                                    {member.documentUrl ? (
                                                        member.Templates?.type?.includes("pdf") || member.Templates?.name?.endsWith(".pdf") ? (
                                                            <iframe
                                                                src={member.documentUrl}
                                                                title="PDF Preview"
                                                                style={{ width: "100%", height: "100%", border: "none" }}
                                                            />
                                                        ) : (
                                                            <img
                                                                src={member.documentUrl}
                                                                alt="Preview"
                                                                style={{
                                                                    maxWidth: "100%",
                                                                    maxHeight: "100%",
                                                                    objectFit: "contain",
                                                                }}
                                                            />
                                                        )
                                                    ) : (
                                                        <span>Preview</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
        </div>
    );
}
export default PrintTemplate;
