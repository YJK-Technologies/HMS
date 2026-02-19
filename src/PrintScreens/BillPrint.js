import { useState, useEffect } from 'react';
import "./BillPrint.css";
import { ToWords } from 'to-words';

const BillPrint = () => {
    const [headerData, setHeaderData] = useState(null);
    const [detailData, setDetailData] = useState(null);
    const toWords = new ToWords();

    useEffect(() => {
        const header = sessionStorage.getItem('BillHeader');
        const detail = sessionStorage.getItem('BillDetail');

        if (header && detail) {
            setHeaderData(JSON.parse(header));
            setDetailData(JSON.parse(detail));
        } else {
            console.error('Data not found in sessionStorage');
        }
    }, []);


    if (!headerData || !detailData) {
        return <div>Loading...</div>;
    }

    const bufferToBase64 = (buffer) => {
        const bytes = new Uint8Array(buffer);
        let binary = '';

        for (let i = 0; i < bytes.byteLength; i += 1024) {
            const chunk = bytes.subarray(i, i + 1024);
            binary += String.fromCharCode.apply(null, chunk);
        }

        return `data:image/jpeg;base64,${window.btoa(binary)}`;
    };

    const processCompanyLogo = () => {
        if (headerData[0].company_logo && headerData[0].company_logo.data) {
            return bufferToBase64(headerData[0].company_logo.data);
        }
        return '';
    };

    const totalAmount = headerData[0].ReceivedAmount;
    const totalAmountInWords = `${toWords.convert(totalAmount)} rupees only`;

    return (
        <div className="bill-container p-4">
            {/* Header */}
            <div className="row align-items-center mb-2">
                {/* Logo Left Side */}
                <div className="col-2 text-start">
                    <img
                        className="rounded-0"
                        src={processCompanyLogo(headerData[0].company_logo)}
                        width={100}
                        height={100}
                        alt="Company Logo"
                    />
                </div>

                {/* Company Details Center */}
                <div className="col-8 text-center">
                    <h4 className="fw-bold fs-2 company-name">{headerData[0].company_name}</h4>
                    <p className="text-center address-fs fw-bold">
                        {[headerData[0].address1, headerData[0].address2, headerData[0].address3]
                            .filter((addr) => addr)
                            .join(", ")}
                        , {headerData[0].city} - {headerData[0].pincode}
                    </p>
                    <p className="text-center fw-bold">{headerData[0].contact_no}</p>
                </div>
            </div>

            {/* Patient Details */}
            <table className="table table-bordered border-dark mb-2">
                <tbody>
                    <tr>
                        <td className="fw-bold font-size" >Patient Name</td>
                        <td className="fw-bold font-size" >{headerData[0].PatientName}</td>
                        <td className="fw-bold font-size">Age</td>
                        <td className="fw-bold font-size">{headerData[0].age} Year(s) </td>
                        {/* <td className="fw-bold">Patient Number</td>
                        <td className="fw-bold">{headerData[0].ContactNumber}</td> */}
                    </tr>
                    <tr>
                        <td className="fw-bold font-size">Gender</td>
                        <td className="fw-bold font-size">{headerData[0].Gender}</td>
                        <td className="fw-bold font-size">Contact No</td>
                        <td className="fw-bold font-size">{headerData[0].ContactNumber}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold font-size">Bill No</td>
                        <td className="fw-bold font-size">{headerData[0].BillNo}</td>
                        <td className="fw-bold font-size">Bill Date</td>
                        <td className="fw-bold font-size">{headerData[0]?.BillDate ? headerData[0].BillDate.split("T")[0] : ""}</td>
                    </tr>
                    {/* <tr>
                        <td className="fw-bold">Visit No</td>
                        <td className="fw-bold">{headerData[0].VisitNo}</td>
                    </tr> */}
                    <tr>
                        <td className="fw-bold font-size">Ref. Dr</td>
                        <td className="fw-bold font-size">{headerData[0].DoctorName}</td>
                        <td className="fw-bold font-size">Client</td>
                        <td className="fw-bold font-size">{headerData[0].ClientName}</td>
                    </tr>
                </tbody>
            </table>

            {/* Ordered Items */}
            <table className="table table-bordered border-dark fw-bold small mb-2">
                <thead>
                    <tr>
                        <td className="fw-bold font-size">S.No</td>
                        <td className="fw-bold font-size">Service Code</td>
                        <td className="fw-bold font-size">Service Name</td>
                        <td className="fw-bold font-size">Amount</td>
                    </tr>
                </thead>
                <tbody>
                    {detailData.map((row, index) => (
                        <tr key={index}>
                            <td className="fw-bold font-size">{row.Sno || "-"}</td>
                            <td className="fw-bold font-size">{row.ServiceID || "-"}</td>
                            <td className="fw-bold font-size">{row.ServiceName || "-"}</td>
                            <td className="fw-bold font-size">{row.Amount || "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Payment Details */}
            <table className="table table-bordered border-dark small mb-3">
                <tbody>
                    {/* <tr>
                        <td>Cash</td>
                        <td>{headerData[0].Cash}</td>
                    </tr> */}
                    <tr>
                        <td className="fw-bold font-size">Gross Amount</td>
                        <td className="fw-bold font-size">{headerData[0].GrossAmount}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold font-size">Discount</td>
                        <td className="fw-bold font-size">{headerData[0].Discount}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold font-size">Net Amount</td>
                        <td className="fw-bold font-size">{headerData[0].NetAmount}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold font-size">Received Amount</td>
                        <td className="fw-bold font-size">{headerData[0].ReceivedAmount}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold font-size">Balance Amount</td>
                        <td className="fw-bold font-size">{headerData[0].BalanceAmount}</td>
                    </tr>
                </tbody>
            </table>

            {/* Amount in Words */}
            <div className="d-flex mb-4">
                <div className="flex-grow-1">
                    <table className="table table-bordered border-dark small mb-1">
                        <tbody>
                            <tr>
                                <td className="fw-bold font-size">Received Amount in Words</td>
                                <td className="fw-bold font-size">{totalAmountInWords}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer */}
            <div className="d-flex justify-content-end align-items-end">
                <div className="text-end mb-5">
                    <p className="mb-0 small fw-bold mb-5 font-size">Sign</p>
                </div>
            </div>
        </div>
    );
};

export default BillPrint;
