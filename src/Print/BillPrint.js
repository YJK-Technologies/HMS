import { useState, useEffect } from 'react';
import "./BillPrint.css";
import "bootstrap/dist/css/bootstrap.min.css";
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

    const totalAmount = headerData[0].ReceivedAmount;
    const totalAmountInWords = `${toWords.convert(totalAmount)} rupees only`;

    return (
        <div className="bill-container p-4">
            {/* Header */}
            <div className="text-center mb-3">
                <h4 className="fw-bold">{headerData[0].company_name}</h4>
                <p className="text-center">
                    {[headerData[0].address1, headerData[0].address2, headerData[0].address3]
                        .filter((addr) => addr)
                        .join(", ")},{headerData[0].city} - {headerData[0].pincode}
                </p>
                <p className="text-center">{headerData[0].contact_no}</p>
            </div>

            {/* Patient Details */}
            <table className="table table-bordered small mb-2">
                <tbody>
                    <tr>
                        <td className="fw-bold">Patient Name</td>
                        <td>{headerData[0].PatientName}</td>
                        <td className="fw-bold">Patient Number</td>
                        <td>{headerData[0].ContactNumber}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold">Age/Gender</td>
                        <td>{headerData[0].Age} Year(s)/ {headerData[0].Gender}</td>
                        <td className="fw-bold">RCH ID</td>
                        <td>{headerData[0].RCHID}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold">Bill No</td>
                        <td>{headerData[0].BillNo}</td>
                        <td className="fw-bold">Bill Date</td>
                        <td>{headerData[0]?.BillDate ? headerData[0].BillDate.split("T")[0] : ""}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold">Visit No</td>
                        <td>{headerData[0].VisitNo}</td>
                        <td className="fw-bold">Contact No</td>
                        <td>{headerData[0].ContactNumber}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold">Ref. Dr</td>
                        <td>{headerData[0].DoctorName}</td>
                        <td className="fw-bold">Client</td>
                        <td>{headerData[0].ClientName}</td>
                    </tr>
                </tbody>
            </table>

            {/* Ordered Items */}
            <table className="table table-bordered small mb-2">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Code</th>
                        <th>Ordered Name</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {detailData.map((row, index) => (
                    <tr key={index}>
                        <td>{row.Sno || "-"}</td>
                        <td>{row.Code || "-"}</td>
                        <td>{row.ServiceName || "-"}</td>
                        <td>{row.Amount || "-"}</td>
                    </tr>
                    ))}
                </tbody>
            </table>

            {/* Payment Details */}
            <table className="table table-bordered small mb-3">
                <tbody>
                    <tr>
                        <td>Cash</td>
                        <td>{headerData[0].Cash}</td>
                    </tr>
                    <tr>
                        <td>Gross Amount</td>
                        <td>{headerData[0].GrossAmount}</td>
                    </tr>
                    <tr>
                        <td>Discount</td>
                        <td>{headerData[0].Discount}</td>
                    </tr>
                    <tr>
                        <td>Net Amount</td>
                        <td>{headerData[0].NetAmount}</td>
                    </tr>
                    <tr>
                        <td>Received Amount</td>
                        <td>{headerData[0].ReceivedAmount}</td>
                    </tr>
                    <tr>
                        <td>Balance Amount</td>
                        <td>{headerData[0].BalanceAmount}</td>
                    </tr>
                </tbody>
            </table>

            {/* Amount in Words */}
            <div className="d-flex mb-4">
                <div className="flex-grow-1">
                    <table className="table table-bordered small mb-3">
                        <tbody>
                            <tr>
                                <td>Received Amount in Words</td>
                                <td>{totalAmountInWords}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer */}
            <div className="d-flex justify-content-end align-items-end">
                <div className="text-end mb-5">
                    <p className="mb-0 small mb-5">Sign</p>
                </div>
            </div>
        </div>
    );
};

export default BillPrint;
