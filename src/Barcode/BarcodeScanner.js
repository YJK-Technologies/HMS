import React, { useRef, useEffect, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import './BarcodeScanner.css';

const BarcodeScanner = () => {
  const [data, setData] = useState('');
  const videoRef = useRef(null);
  const codeReader = new BrowserMultiFormatReader();

  useEffect(() => {
    const startScanner = async () => {
      try {
        const result = await codeReader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
          if (result) {
            setData(result.text);
            console.log('Scanned Data: ', result.text);
          }
          if (err && !(err instanceof NotFoundException)) {
            console.error(err);
          }
        });
        console.log(result);
      } catch (err) {
        console.error(err);
      }
    };

    startScanner();

    return () => {
      codeReader.reset();
    };
  }, [codeReader]);

  return (
    <div className="container-fluid Topnav-screen">
    <div className="scanner-container">
      <h1 className="scanner-title">Barcode Scanner</h1>
      <div className="barcode-reader">
        <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
      </div>
      {data && <p className="scanned-data">Scanned Data: <span>{data}</span></p>}
    </div>
    </div>
  );
};

export default BarcodeScanner;
