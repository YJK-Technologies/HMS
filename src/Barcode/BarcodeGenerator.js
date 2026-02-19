import React, { useState, useRef } from 'react';
import Barcode from 'react-barcode';
import Swal from 'sweetalert2';
import { useReactToPrint } from 'react-to-print';
 import './BarcodeGenerator.css';

const BarcodeGenerator = () => {
  const componentRef = useRef();
  const [inputValue, setInputValue] = useState('');
  const [barcodeValue, setBarcodeValue] = useState('');

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Purchase data'
  });

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleGenerateBarcode = () => {
    if (!inputValue.trim()) {
      Swal.fire({
        title: 'Error',
        text: 'Please enter a value to generate the barcode',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }
    setBarcodeValue(inputValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGenerateBarcode();
    }
  };


  return (
    <div className="container-fluid Topnav-screen">
    <div className="barcode">
      <h2 className="heading">Barcode Generator</h2>
      <div className="barcode-form">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          className="input"
          placeholder="Enter value to generate barcode"
        />
        <button onClick={handleGenerateBarcode} className="login-button">
          Generate Barcode
        </button>
        <div id="barcodeWrapper" style={{ marginTop: '20px', overflowX:"scroll" }} ref={componentRef}>
          {barcodeValue && <Barcode value={barcodeValue} displayValue={true} />}
        </div>
        {barcodeValue && (
        <button onClick={handlePrint} className="barcode-print">
          Print
        </button>
      )}
      </div>
    </div>
    </div>
  );
};

export default BarcodeGenerator;
