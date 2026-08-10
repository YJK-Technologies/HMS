// controllers/dataController.js
const sql = require("mssql");
const connection = require("../connection/connection");
const transporter = require("../mailer");
const { generateOTP } = require("../utils");
const dbConfig = require("../config/dbConfig");
const multer = require("multer");
const CryptoJS = require("crypto-js");
const upload = multer({ storage: multer.memoryStorage() }); //add in top of the datacontroller page
const path = require("path");
const fs = require("fs");
const otpStorage = {};

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: "alert@yjktechnologies.com",
    to: email,
    subject: "Login OTP",
    text: `Your OTP is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Error sending OTP:", err);
    throw new Error("Error sending OTP");
  }
};

// forget Password handler
const forgetPassword = async (req, res) => {
  const { user_code, email_id } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "VE")
      .input("user_code", sql.NVarChar, user_code)
      .input("email_id", sql.NVarChar, email_id)
      .query(
        `EXEC SP_user_info_hdr @mode,'',@user_code,'','','','','','','',@email_id,'','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );
    if (result.recordset.length > 0) {
      const otp = generateOTP();
      await sendOTP(email_id, otp);

      otpStorage[email_id] = otp;

      res.status(200).json({ message: "OTP sent successfully" });
    } else {
      res.status(401).json({ message: "Email not found" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const Passwords = async (req, res) => {
  const { user_code, email_id, user_password } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("mode", sql.NVarChar, "UP")
      .input("user_code", sql.NVarChar, user_code)
      .input("email_id", sql.NVarChar, email_id)
      .input("user_password", sql.NVarChar, user_password)
      .query(
        "EXEC SP_user_info_hdr @mode,'',@user_code,'','','',@user_password,'','','',@email_id,'','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const login = async (req, res) => {
  const { user_code, user_password } = req.body;
  const secretKey = "yjk26012024";

  try {
    const decryptedUserCode = CryptoJS.AES.decrypt(
      user_code,
      secretKey,
    ).toString(CryptoJS.enc.Utf8);
    const decryptedPassword = CryptoJS.AES.decrypt(
      user_password,
      secretKey,
    ).toString(CryptoJS.enc.Utf8);

    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "LUC")
      .input("user_code", sql.NVarChar, decryptedUserCode)
      .input("user_password", sql.NVarChar, decryptedPassword)
      .query(
        `EXEC SP_user_info_hdr 'LUC','',@user_code,'','','',@user_password,'','','','','','','','','','','','','','','','','',''`,
      );
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err.message);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// Signup handler
const signUp = async (req, res) => {
  const { name, email } = req.body;

  try {
    // Check if the user already exists in the database
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("Email", sql.NVarChar, email)
      .query("SELECT * FROM yjk_users WHERE Ymail = @Email");

    if (result.recordset.length === 0) {
      // If user does not exist, generate and send OTP
      const otp = generateOTP();
      await sendOTP(email, otp);

      // Store OTP temporarily for verification
      otpStorage[email] = otp;

      // Proceed with adding user to the database
      await pool
        .request()
        .input("Name", sql.NVarChar, name)
        .input("Email", sql.NVarChar, email)
        .query("INSERT INTO yjk_users (Name, Ymail) VALUES (@Name, @Email)");

      res.status(200).json({ message: "OTP sent successfully" });
    } else {
      res.status(401).json({ message: "Existing User" });
    }
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// Verify OTP handler
const verifyOtp = (req, res) => {
  const { email_id, enteredOtp } = req.body;

  try {
    const storedOtp = otpStorage[email_id];
    if (storedOtp && storedOtp === enteredOtp) {
      // If OTP is valid, clear the OTP storage
      delete otpStorage[email_id];
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(401).json({ message: "Invalid OTP" });
    }
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getvariant = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Item_variant','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const getuom = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'UOM','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getCity = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'city','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getCountry = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'country','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getState = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'state','',' ', ' ' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getStatus = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'status','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getShift = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Shift','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getTransaction = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Transaction Type','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getGender = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Gender','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getTaxApplicable = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Tax Applicable','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getLoginorout = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Log IN/OUT','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getDeletepermission = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'deletepermission','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getregisterbrand = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Register_brand','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getboolean = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'boolean','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getourbrand = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'our_brand','','', '' , '','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const gethdrcode = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query(
      "EXEC sp_attribute_Info 'TS','','', '','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
    );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getUsercode = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query(
      "EXEC SP_user_info_hdr 'F','','user_code','','', '' ,'','','','','','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
    );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getUsertype = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'User Type', '','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const getscreentype = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Sc type', '','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getCompanyno = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query(
      `EXEC sp_company_info 'F','', ' ', '', '', '', '', '',  '', '' , '', '', '','',  '','','','','',null,NULL, NULL,NULL,NULL,NULL,NULL,NULL,NULL,null,null,null`,
    );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getLocationno = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query(
      "EXEC sp_location_info 'F','', '', '', '', '', '', '','', '', '', '', '',  0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
    );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getPaytype = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'paytype','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getPurchasetype = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'PurchaseType','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getSalestype = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'SalesType','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getordertype = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'ORDER TYPE','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getroleid = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_role_info 'F',@company_code,'','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getAllData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query("select * from tbl_company_info_hdr");

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getsearchdata = async (req, res) => {
  const { company_no, company_name, city, state, pincode, country, status, company_gst_no,} = req.body;
  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();
    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_no", sql.NVarChar, company_no)
      .input("company_name", sql.NVarChar, company_name)
      .input("city", sql.NVarChar, city)
      .input("state", sql.NVarChar, state)
      .input("pincode", sql.NVarChar, pincode)
      .input("country", sql.NVarChar, country)
      .input("company_gst_no", sql.NVarChar, company_gst_no)
      .input("status", sql.NVarChar, status)
      .query(
        ` EXEC sp_company_info @mode,@company_no,@company_name,'','','','',@city,@state,@pincode,@country,@company_gst_no,@status,'','','','','','','','','','','','','','','','','','' `,
      );
    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const addData = async (req, res) => {
  const { company_no, company_name, short_name, address1, address2, address3, city, state, pincode, country, email_id, status, foundedDate, websiteURL, contact_no, annualReportURL, location_no,
    company_gst_no, created_by, modified_by, tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4,} = req.body;

  let company_logo = req.files["company_logo"]
    ? req.files["company_logo"][0].buffer
    : null;
  let authorisedSignatur = req.files["authorisedSignatur"]
    ? req.files["authorisedSignatur"][0].buffer
    : null;

  try {
    pool = await sql.connect(dbConfig);

    // If the company code doesn't exist, proceed with inserting the data
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_no", sql.NVarChar, company_no)
      .input("company_name", sql.NVarChar, company_name)
      .input("short_name", sql.NVarChar, short_name)
      .input("address1", sql.NVarChar, address1)
      .input("address2", sql.NVarChar, address2)
      .input("address3", sql.NVarChar, address3)
      .input("city", sql.NVarChar, city)
      .input("state", sql.NVarChar, state)
      .input("pincode", sql.NVarChar, pincode)
      .input("country", sql.NVarChar, country)
      .input("email_id", sql.NVarChar, email_id)
      .input("status", sql.NVarChar, status)
      .input("foundedDate", sql.NVarChar, foundedDate)
      .input("websiteURL", sql.NVarChar, websiteURL)
      .input("company_logo", sql.VarBinary, company_logo)
      .input("contact_no", sql.NVarChar, contact_no)
      .input("annualReportURL", sql.NVarChar, annualReportURL)
      .input("location_no", sql.NVarChar, location_no)
      .input("company_gst_no", sql.NVarChar, company_gst_no)
      .input("authorisedSignatur", sql.VarBinary, authorisedSignatur)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(
        `EXEC sp_company_info @mode, @company_no, @company_name, @short_name, @address1, @address2, @address3, @city, @state, @pincode, @country, @email_id, 
        @status, @foundedDate, @websiteURL, @company_logo, @contact_no, @annualReportURL,@location_no,@company_gst_no,@authorisedSignatur,@created_by,@modified_by,  
         @tempstr1, @tempstr2, @tempstr3, @tempstr4, 
        @datetime1, @datetime2, @datetime3, @datetime4`,
      );

    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const saveEditedData = async (req, res) => {
  const editedData = req.body.editedData;
  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }
  try {
    const pool = await connection.connectToDatabase();
    for (const updatedRow of editedData) {
      const company_logo =
        updatedRow.company_logo && updatedRow.company_logo.type === "Buffer"
          ? Buffer.from(updatedRow.company_logo.data)
          : null;

      const authorisedSignatur =
        updatedRow.authorisedSignatur &&
        updatedRow.authorisedSignatur.type === "Buffer"
          ? Buffer.from(updatedRow.authorisedSignatur.data)
          : null;

      console.log(company_logo);
      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("company_no", updatedRow.company_no)
        .input("company_name", updatedRow.company_name)
        .input("short_name", updatedRow.short_name)
        .input("address1", updatedRow.address1)
        .input("address2", updatedRow.address2)
        .input("address3", updatedRow.address3)
        .input("city", updatedRow.city)
        .input("state", updatedRow.state)
        .input("pincode", updatedRow.pincode)
        .input("country", updatedRow.country)
        .input("email_id", updatedRow.email_id)
        .input("status", updatedRow.status)
        .input("foundedDate", updatedRow.foundedDate)
        .input("websiteURL", updatedRow.websiteURL)
        .input("company_logo", sql.VarBinary, company_logo)
        .input("contact_no", updatedRow.contact_no)
        .input("annualReportURL", updatedRow.annualReportURL)
        .input("location_no", updatedRow.location_no)
        .input("company_gst_no", updatedRow.company_gst_no)
        .input("authorisedSignatur", sql.VarBinary, authorisedSignatur)
        .input("created_by", updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", updatedRow.tempstr1)
        .input("tempstr2", updatedRow.tempstr2)
        .input("tempstr3", updatedRow.tempstr3)
        .input("tempstr4", updatedRow.tempstr4)
        .input("datetime1", updatedRow.datetime1)
        .input("datetime2", updatedRow.datetime2)
        .input("datetime3", updatedRow.datetime3)
        .input("datetime4", updatedRow.datetime4)
        .query(`EXEC sp_company_info @mode, @company_no, @company_name, @short_name, @address1, @address2, @address3, @city, @state, @pincode, @country, @email_id,
          @status, @foundedDate, @websiteURL,@company_logo,@contact_no,@annualReportURL,@location_no,@company_gst_no,@authorisedSignatur,@created_by,@modified_by,
           @tempstr1, @tempstr2, @tempstr3, @tempstr4,
          @datetime1, @datetime2, @datetime3, @datetime4`);
    }
    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const deleteData = async (req, res) => {
  const company_nosToDelete = req.body.company_nos;

  if (!company_nosToDelete || !company_nosToDelete.length) {
    res.status(400).json("Invalid or empty company_nos array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const company_no of company_nosToDelete) {
      await pool
        .request()
        .input("company_no", company_no)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"]).query(`
          EXEC sp_company_info 'D', @company_no,'','','','','','','','',
          '','','','','','','','',
          '','','','',@modified_by,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL
        `);
    }

    res.status(200).json("Companies deleted successfully");
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getAlluserData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query(
      `EXEC SP_user_info_hdr 'A','','','','',' ','','','','','','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
    );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const userAddData = async (req, res) => {
  const { company_code, user_code, user_name, first_name, last_name, user_password, user_status, log_in_out, user_type, email_id, dob,
    gender, role_id, created_by, modified_by, tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4,} = req.body;

  let user_img = null;

  if (req.file) {
    user_img = req.file.buffer; // Buffer containing the uploaded image
  }

  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.NVarChar, user_code)
      .input("user_name", sql.NVarChar, user_name)
      .input("first_name", sql.NVarChar, first_name)
      .input("last_name", sql.NVarChar, last_name)
      .input("user_password", sql.NVarChar, user_password)
      .input("user_status", sql.NVarChar, user_status)
      .input("log_in_out", sql.NVarChar, log_in_out)
      .input("user_type", sql.NVarChar, user_type)
      .input("email_id", sql.NVarChar, email_id)
      .input("dob", sql.NVarChar, dob)
      .input("gender", sql.NVarChar, gender)
      .input("role_id", sql.NVarChar, role_id)
      .input("user_img", sql.VarBinary, user_img)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(
        `EXEC SP_user_info_hdr @mode,@company_code,@user_code,@user_name,
        @first_name,@last_name,@user_password,
        @user_status,@log_in_out,@user_type,
        @email_id,@dob,@gender,@role_id,@user_img,@created_by,@modified_by,
        @tempstr1, @tempstr2, @tempstr3, @tempstr4,    
        @datetime1, @datetime2, @datetime3, @datetime4`,
      );
    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (err) {
    if (err.class === 16 && err.number === 50000) {
      // Custom error from the stored procedure
      res
        .status(400)
        .json({ message: "User already exists", err: err.message });
    } else {
      // Handle unexpected errors
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  }
};

const UsersaveEditedData = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase(dbConfig);

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U") // update mode
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .input("user_code", sql.NVarChar, updatedRow.user_code)
        .input("user_name", sql.NVarChar, updatedRow.user_name)
        .input("first_name", sql.NVarChar, updatedRow.first_name)
        .input("last_name", sql.NVarChar, updatedRow.last_name)
        .input("user_password", sql.NVarChar, updatedRow.user_password)
        .input("user_status", sql.NVarChar, updatedRow.user_status)
        .input("log_in_out", sql.NVarChar, updatedRow.log_in_out)
        .input("user_type", sql.NVarChar, updatedRow.user_type)
        .input("email_id", sql.NVarChar, updatedRow.email_id)
        .input("dob", sql.NVarChar, updatedRow.dob)
        .input("gender", sql.NVarChar, updatedRow.gender)
        .input("role_id", sql.NVarChar, updatedRow.role_id)
        .input("created_by", sql.NVarChar, updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", sql.NVarChar, updatedRow.tempstr1)
        .input("tempstr2", sql.NVarChar, updatedRow.tempstr2)
        .input("tempstr3", sql.NVarChar, updatedRow.tempstr3)
        .input("tempstr4", sql.NVarChar, updatedRow.tempstr4)
        .input("datetime1", sql.NVarChar, updatedRow.datetime1)
        .input("datetime2", sql.NVarChar, updatedRow.datetime2)
        .input("datetime3", sql.NVarChar, updatedRow.datetime3)
        .input("datetime4", sql.NVarChar, updatedRow.datetime4)
        .query(
          `EXEC SP_user_info_hdr 
            'U',@company_code, @user_code, @user_name, @first_name, @last_name, 
            @user_password, @user_status, @log_in_out, @user_type, 
            @email_id, @dob, @gender,@role_id,'', @created_by,  
            @modified_by, @tempstr1, @tempstr2, @tempstr3, 
            @tempstr4, @datetime1, @datetime2, @datetime3, @datetime4`,
        );
    }

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const UserdeleteData = async (req, res) => {
  const user_codesToDelete = req.body.user_codes;

  if (!user_codesToDelete || !user_codesToDelete.length) {
    res.status(400).json("Invalid or empty user_codes array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const user_code of user_codesToDelete) {
      try {
        await pool
          .request()
          .input("user_code", user_code)
          .input("company_code", sql.NVarChar, req.headers["company_code"])
          .input("modified_by", sql.NVarChar, req.headers["modified-by"])
          .query(`
      EXEC SP_user_info_hdr 'D',@company_code,@user_code,'','','', 
            '', '', '', '','','', '','','','', 
            @modified_by,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);
      } catch (err) {
        if (err.number === 50000) {
          // Foreign key constraint violation
          res
            .status(500)
            .json(
              "The user cannot be deleted due to a link with another record",
            );
          return;
        } else {
          throw err; // Rethrow other SQL errors
        }
      }
    }

    res.status(200).json("user deleted successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getAllWareHouseData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query("select * from tbl_warehouse_info");

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getAllRoleInfoData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query(
      `EXEC sp_role_Info 'A','','','','','','','','','','','','','',''`,
    );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const AddRoleInfoData = async (req, res) => {
  const { company_code, role_id, role_name, description, created_by, modified_by, tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4,} = req.body;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("role_id", sql.NVarChar, role_id)
      .input("role_name", sql.NVarChar, role_name)
      .input("description", sql.NVarChar, description)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(`EXEC sp_role_info @mode,@company_code, @role_id,
        @role_name,@description,
        @created_by,@modified_by,
        @tempstr1, @tempstr2, @tempstr3, @tempstr4, 
        @datetime1, @datetime2, @datetime3, @datetime4`);

    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (err) {
    if (err.class === 16 && err.number === 50000) {
      // Custom error from the stored procedure
      res.status(400).json({ message: "Role already exists" });
    } else {
      // Handle unexpected errors
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  }
};

// update for WareHouse Data
const RolesaveEditedData = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase(dbConfig);

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U") // update mode
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .input("role_id", sql.NVarChar, updatedRow.role_id)
        .input("role_name", sql.NVarChar, updatedRow.role_name)
        .input("description", sql.NVarChar, updatedRow.description)
        .input("created_by", sql.NVarChar, updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", sql.NVarChar, updatedRow.tempstr1)
        .input("tempstr2", sql.NVarChar, updatedRow.tempstr2)
        .input("tempstr3", sql.NVarChar, updatedRow.tempstr3)
        .input("tempstr4", sql.NVarChar, updatedRow.tempstr4)
        .input("datetime1", sql.NVarChar, updatedRow.datetime1)
        .input("datetime2", sql.NVarChar, updatedRow.datetime2)
        .input("datetime3", sql.NVarChar, updatedRow.datetime3)
        .input("datetime4", sql.NVarChar, updatedRow.datetime4)
        .query(
          `EXEC sp_Role_Info @mode,@company_code,@role_id,@role_name,@description,@created_by,@modified_by,@tempstr1,@tempstr2,
          @tempstr3,@tempstr4,@datetime1,@datetime2,@datetime3,@datetime4
          `,
        );
    }

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//GET ATTRIBUTES HEADER DATA
const getAllattributehdrData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query("select * from tbl_attribute_info_hdr");

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//ADD DATAS IN ATTRIBUTE HEADER TABLE
const addattrihdrData = async (req, res) => {
  const { company_code, attributeheader_code, attributeheader_name, status, created_by, modified_by, tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4,} = req.body;

  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("company_code", sql.NVarChar, company_code)
      .input("attributeheader_code", sql.NVarChar, attributeheader_code)
      .input("attributeheader_name", sql.NVarChar, attributeheader_name)
      .input("status", sql.NVarChar, status)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(
        `EXEC sp_attribute_hdr @mode,@company_code,@attributeheader_code,@attributeheader_name,@status,@created_by,@modified_by,@tempstr1,@tempstr2,@tempstr3,@tempstr4,@datetime1,@datetime2,@datetime3,@datetime4`,
      );

    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (err) {
    {
      // Handle unexpected errors
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  }
};

//GET ATTRIBUTES HEADER DATA
const getAllattributedetData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result =
      await sql.query(`EXEC sp_attribute_info 'A','','', '','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//ADD DATAS IN ATTRIBUTE DETAILS TABLE
const addattridetData = async (req, res) => {
  const { company_code, attributeheader_code, attributedetails_code, attributedetails_name, descriptions, created_by, modified_by, tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4,} = req.body;

  try {
    // Input validation
    if (!attributeheader_code) {
      return res
        .status(400)
        .json({ error: "Attribute Header Code cannot be blank" });
    }

    // Establish connection to the database
    const pool = await sql.connect(dbConfig);

    // Execute the stored procedure
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("attributeheader_code", sql.NVarChar, attributeheader_code)
      .input("attributedetails_code", sql.NVarChar, attributedetails_code)
      .input("attributedetails_name", sql.NVarChar, attributedetails_name)
      .input("descriptions", sql.NVarChar, descriptions)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(
        `EXEC sp_attribute_Info @mode,@company_code,@attributeheader_code, @attributedetails_code,@attributedetails_name,@descriptions,@created_by,@modified_by,@tempstr1, @tempstr2, @tempstr3, @tempstr4, 
        @datetime1, @datetime2, @datetime3, @datetime4`,
      );
    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (err) {
    if (err.class === 16 && err.number === 50000) {
      // Custom error from the stored procedure
      res.status(400).json({ message: err.message });
    } else {
      // Handle unexpected errors
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  }
};

const deleteAttriDetailData = async (req, res) => {
  const { attributeheader_codesToDelete, attributedetails_codeToDelete } =
    req.body;

  if (
    !attributeheader_codesToDelete ||
    !attributeheader_codesToDelete.length ||
    !attributedetails_codeToDelete ||
    !attributedetails_codeToDelete.length
  ) {
    res.status(400).json("Invalid or empty Codes or codeDetails array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    const deleteQuery = `EXEC sp_attribute_Info 'D',@company_code,@attributeheader_code, @attributedetails_code,'','','',@modified_by,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL
    `;
    for (let i = 0; i < attributeheader_codesToDelete.length; i++) {
      try {
        await pool
          .request()
          .input("attributeheader_code", attributeheader_codesToDelete[i])
          .input("attributedetails_code", attributedetails_codeToDelete[i])
          .input("modified_by", sql.NVarChar, req.headers["modified-by"])
          .input("company_code", sql.NVarChar, req.headers["company_code"])
          .query(deleteQuery);
      } catch (err) {
        if (err.number === 50000) {
          // Foreign key constraint violation
          res
            .status(400)
            .json(
              "The attribute cannot be deleted due to a link with another record",
            );
          return;
        } else {
          throw err; // Rethrow other SQL errors
        }
      }
    }

    res.status(200).json("Attribute data deleted successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const updattridetData = async (req, res) => {
  const {
    attributeheader_codesToUpdate,
    attributedetails_codesToUpdate,
    updatedData,
  } = req.body;

  if (
    !attributeheader_codesToUpdate ||
    !attributeheader_codesToUpdate.length ||
    !attributedetails_codesToUpdate ||
    !attributedetails_codesToUpdate.length ||
    !updatedData ||
    !updatedData.length
  ) {
    res.status(400).json("Invalid or empty input data.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (let i = 0; i < attributeheader_codesToUpdate.length; i++) {
      const updatedRow = updatedData[i]; // Assuming updatedData is an array of objects with updated values

      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .input("attributeheader_code", attributeheader_codesToUpdate[i])
        .input("attributedetails_code", attributedetails_codesToUpdate[i])
        .input(
          "attributedetails_name",
          sql.NVarChar,
          updatedRow.attributedetails_name,
        )
        .input("descriptions", sql.NVarChar, updatedRow.descriptions)
        .input("created_by", sql.NVarChar, updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", sql.NVarChar, updatedRow.tempstr1)
        .input("tempstr2", sql.NVarChar, updatedRow.tempstr2)
        .input("tempstr3", sql.NVarChar, updatedRow.tempstr3)
        .input("tempstr4", sql.NVarChar, updatedRow.tempstr4)
        .input("datetime1", sql.NVarChar, updatedRow.datetime1)
        .input("datetime2", sql.NVarChar, updatedRow.datetime2)
        .input("datetime3", sql.NVarChar, updatedRow.datetime3)
        .input("datetime4", sql.NVarChar, updatedRow.datetime4)
        .query(
          `EXEC sp_attribute_Info @mode,@company_code, @attributeheader_code, @attributedetails_code, @attributedetails_name, @descriptions, @created_by,@modified_by, @tempstr1, @tempstr2, @tempstr3, @tempstr4, @datetime1, @datetime2, @datetime3, @datetime4`,
        );
    }

    res.status(200).json("Updated data successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Dhana create on : 02may2024 COMPANY MAPPING//
const getAllCompanyMappingData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result =
      await sql.query(`EXEC sp_user_company_mapping 'I','','','','','',0,'','','',
      NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const addCompanyMappingData = async (req, res) => {
  const { company_code, user_code, company_no, location_no, status, order_no, created_by, modified_by, tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4,} = req.body;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.VarChar, user_code)
      .input("company_no", sql.NVarChar, company_no)
      .input("location_no", sql.VarChar, location_no)
      .input("status", sql.VarChar, status)
      .input("order_no", sql.Int, order_no)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(
        `EXEC sp_user_company_mapping @mode,@company_code,@user_code,@company_no,@location_no,@status,@order_no,'',@created_by,@modified_by,
        @tempstr1,@tempstr2,@tempstr3,@tempstr4,@datetime1,@datetime2,@datetime3,@datetime4`,
      );

    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (err) {
    if (err.class === 16 && err.number === 50000) {
      // Custom error from the stored procedure
      res.status(400).json({ message: err.message });
    } else {
      // Handle unexpected errors
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  }
};

const getAllUserRoleMappingData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query(
      `EXEC sp_user_rolemapping 'A','','','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
    );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const addUserRoleMappingData = async (req, res) => {
  const { company_code, user_code, role_id, created_by, modified_by, tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4,} = req.body;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.VarChar, user_code)
      .input("role_id", sql.NVarChar, role_id)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(
        `EXEC sp_user_rolemapping @mode,@company_code, @user_code,'',@role_id,'','',@created_by,@modified_by,
        @tempstr1,@tempstr2,@tempstr3,@tempstr4,@datetime1,@datetime2,@datetime3,@datetime4`,
      );

    res.json({ success: true, message: "Data inserted successfully" });
  } catch (err) {
    if (err.class === 16 && err.number === 50000) {
      // Custom error from the stored procedure
      res.status(400).json({ message: "User & Role already exists" });
    } else {
      // Handle unexpected errors
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  }
};

const getlocationsearchdata = async (req, res) => {
  const { company_code, location_no, location_name, city, state, pincode, country, status, } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("location_no", sql.NVarChar, location_no)
      .input("location_name", sql.NVarChar, location_name)
      .input("city", sql.NVarChar, city)
      .input("state", sql.NVarChar, state)
      .input("pincode", sql.NVarChar, pincode)
      .input("country", sql.NVarChar, country)
      .input("status", sql.NVarChar, status)
      .query(` EXEC sp_location_info @mode,@location_no,@location_name, '', '', '', '', @city,@state, @pincode, @country, '', 
        @status, '', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL `);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const addlocationinfo = async (req, res) => {
  const { location_no, location_name, short_name, address1, address2, address3, city, state, pincode, country, email_id, status, contact_no, created_by, modified_by,
    tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4, } = req.body;

  let pool;
  try {
    pool = await sql.connect(dbConfig);

    // If the company code doesn't exist, proceed with inserting the data
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("location_no", sql.NVarChar, location_no)
      .input("location_name", sql.NVarChar, location_name)
      .input("short_name", sql.NVarChar, short_name)
      .input("address1", sql.NVarChar, address1)
      .input("address2", sql.NVarChar, address2)
      .input("address3", sql.NVarChar, address3)
      .input("city", sql.NVarChar, city)
      .input("state", sql.NVarChar, state)
      .input("pincode", sql.NVarChar, pincode)
      .input("country", sql.NVarChar, country)
      .input("email_id", sql.NVarChar, email_id)
      .input("status", sql.NVarChar, status)
      .input("contact_no", sql.NVarChar, contact_no)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(
        `EXEC sp_location_info @mode,@location_no, @location_name, @short_name, @address1, @address2, @address3, @city, @state, @pincode, @country, @email_id, 
      @status,  @contact_no, @created_by,@modified_by,
       @tempstr1, @tempstr2, @tempstr3, @tempstr4, 
      @datetime1, @datetime2, @datetime3, @datetime4`,
      );

    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (err) {
    if (err.class === 16 && err.number === 50000) {
      // Custom error from the stored procedure
      res.status(400).json({ message: "Location already exists" });
    } else {
      // Handle unexpected errors
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  }
};

const locationsaveEditedData = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("location_no", updatedRow.location_no)
        .input("location_name", updatedRow.location_name)
        .input("short_name", updatedRow.short_name)
        .input("address1", updatedRow.address1)
        .input("address2", updatedRow.address2)
        .input("address3", updatedRow.address3)
        .input("city", updatedRow.city)
        .input("state", updatedRow.state)
        .input("pincode", updatedRow.pincode)
        .input("country", updatedRow.country)
        .input("email_id", updatedRow.email_id)
        .input("status", updatedRow.status)
        .input("contact_no", updatedRow.contact_no)
        .input("created_by", updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", updatedRow.tempstr1)
        .input("tempstr2", updatedRow.tempstr2)
        .input("tempstr3", updatedRow.tempstr3)
        .input("tempstr4", updatedRow.tempstr4)
        .input("datetime1", updatedRow.datetime1)
        .input("datetime2", updatedRow.datetime2)
        .input("datetime3", updatedRow.datetime3)
        .input("datetime4", updatedRow.datetime4)
        .query(`EXEC sp_location_info @mode,@location_no, @location_name, @short_name, @address1, @address2, 
          @address3, @city, @state, @pincode, @country, @email_id,  @status, @contact_no, @created_by, @modified_by , 
         @tempstr1, @tempstr2, @tempstr3, @tempstr4, 
        @datetime1, @datetime2, @datetime3, @datetime4`);
    }

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const locationdeleteData = async (req, res) => {
  const location_nosToDelete = req.body.location_nos;

  if (!location_nosToDelete || !location_nosToDelete.length) {
    res.status(400).json("Invalid or empty location no's array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const location_no of location_nosToDelete) {
      try {
        await pool
          .request()
          .input("location_no", location_no)
          .input("modified_by", sql.NVarChar, req.headers["modified-by"])
          .query(
            `EXEC sp_location_info 'D',@location_no, '', '', '', '', '', '', '', '', '', '','',  '', '',@modified_by,NULL, NULL, NULL, NULL,NULL, NULL, NULL, NULL`,
          );
      } catch (err) {
        if (err.number === 50000) {
          // Foreign key constraint violation
          res
            .status(400)
            .json(
              "The location cannot be deleted due to a link with another record",
            );
          return;
        } else {
          throw err; // Rethrow other SQL errors
        }
      }
    }

    res.status(200).json("Companies deleted successfully");
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const getUserrolesearchdata = async (req, res) => {
  const { company_code, user_code, user_name, role_id, role_name } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.NVarChar, user_code)
      .input("user_name", sql.NVarChar, user_name)
      .input("role_id", sql.NVarChar, role_id)
      .input("role_name", sql.NVarChar, role_name)
      .query(`EXEC sp_user_rolemapping @mode,@company_code,@user_code,@user_name,@role_id,@role_name,'','','',
      null,null,null,null,null,null,null,null `);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const getUsersearchdata = async (req, res) => {
  const { company_code, user_code, user_name, first_name, last_name, user_status, email_id, dob, gender, role_id, user_img,} = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.NVarChar, user_code)
      .input("user_name", sql.NVarChar, user_name)
      .input("first_name", sql.NVarChar, first_name)
      .input("last_name", sql.NVarChar, last_name)
      .input("user_status", sql.NVarChar, user_status)
      .input("email_id", sql.NVarChar, email_id)
      .input("dob", sql.NVarChar, dob)
      .input("gender", sql.NVarChar, gender)
      .input("role_id", sql.NVarChar, role_id)
      .input("user_img", sql.NVarChar, user_img)
      .query(
        ` EXEC SP_user_info_hdr @mode,@company_code,@user_code,@user_name,@first_name,@last_name,'',@user_status,'','',@email_id,@dob,@gender,@role_id,@user_img,'','','','','','','','','',''`,
      );

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const getRolesearchdata = async (req, res) => {
  const { company_code, role_id, role_name } = req.body;

  try {
    // Connect to the
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.NVarChar, company_code)
      .input("role_id", sql.NVarChar, role_id)
      .input("role_name", sql.NVarChar, role_name)
      .query(
        `EXEC sp_Role_Info @mode,@company_code,@role_id,@role_name,'','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const roledeleteData = async (req, res) => {
  const role_idsToDelete = req.body.role_ids;

  if (!role_idsToDelete || !role_idsToDelete.length) {
    res.status(400).json("Invalid or empty RoleID array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const role_id of role_idsToDelete) {
      try {
        await pool
          .request()
          .input("role_id", role_id)
          .input("modified_by", sql.NVarChar, req.headers["modified-by"])
          .input("company_code", sql.NVarChar, req.headers["company_code"])
          .query(`
          EXEC sp_Role_Info 'D',@company_code,@role_id,'','','',@modified_by,
        NULL, NULL, NULL, NULL,NULL, NULL, NULL, NULL
          `);
      } catch (err) {
        if (err.number === 50000) {
          // Foreign key constraint violation
          res
            .status(400)
            .json(
              "The role cannot be deleted due to a link with another record",
            );
          return;
        } else {
          throw err; // Rethrow other SQL errors
        }
      }
    }

    res.status(200).json("User deleted successfully");
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const getcompanymappingsearchdata = async (req, res) => {
  const { company_code, user_code, company_no, location_no, status } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.NVarChar, user_code)
      .input("company_no", sql.NVarChar, company_no)
      .input("location_no", sql.NVarChar, location_no)
      .input("status", sql.NVarChar, status)

      .query(
        `EXEC sp_user_company_mapping @mode,@company_code,@user_code,@company_no,@location_no,@status,0,'','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const getattributeSearchdata = async (req, res) => {
  const { company_code, attributeheader_code, attributedetails_code, attributedetails_name, descriptions, } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.NVarChar, company_code)
      .input("attributeheader_code", sql.NVarChar, attributeheader_code)
      .input("attributedetails_code", sql.NVarChar, attributedetails_code)
      .input("attributedetails_name", sql.NVarChar, attributedetails_name)
      .input("descriptions", sql.NVarChar, descriptions)
      .query(`EXEC sp_attribute_Info 'SC',@company_code,@attributeheader_code,@attributedetails_code,@attributedetails_name,@descriptions,'','','','','','','','','',''
                `);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code added by dhana
const gettranstype = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'TRANSATION','','', '','','' , NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//code added by harish kumar on 07/03/2024//
const getusercompany = async (req, res) => {
  const { user_code } = req.body;
  let pool;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "UCL") // Insert mode
      .input("user_code", sql.NVarChar, user_code)
      .query(
        `EXEC sp_user_company_mapping @mode,'',@user_code,'','','',0,'','','',
                              NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
// code ended by harishkumar  07/03/2024

const updcompanymapping = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase(dbConfig);

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .input("user_code", updatedRow.user_code)
        .input("company_no", updatedRow.company_no)
        .input("location_no", updatedRow.location_no)
        .input("status", updatedRow.status)
        .input("order_no", updatedRow.order_no)
        .input("keyfiels", updatedRow.keyfiels)
        .input("created_by", updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", updatedRow.tempstr1)
        .input("tempstr2", updatedRow.tempstr2)
        .input("tempstr3", updatedRow.tempstr3)
        .input("tempstr4", updatedRow.tempstr4)
        .input("datetime1", updatedRow.datetime1)
        .input("datetime2", updatedRow.datetime2)
        .input("datetime3", updatedRow.datetime3)
        .input("datetime4", updatedRow.datetime4)
        .query(`EXEC sp_user_company_mapping @mode, @company_code, @user_code, @company_no, @location_no, 
                                @status, @order_no,@keyfiels,@created_by,@modified_by,
                               @tempstr1, @tempstr2, @tempstr3, @tempstr4, 
                              @datetime1, @datetime2, @datetime3, @datetime4`);
    }

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const commappingdeleteData = async (req, res) => {
  const keyfielsToDelete = req.body.keyfiels;
  try {
    const pool = await connection.connectToDatabase();
    for (const keyfiels of keyfielsToDelete) {
      try {
        await pool
          .request()
          .input("keyfiels", keyfiels)
          .input("modified_by", sql.NVarChar, req.headers["modified-by"])
          .query(`EXEC sp_user_company_mapping 'D','','','','001','',0,@keyfiels,'','',
                                NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);
      } catch (err) {
        if (err.number === 50000) {
          // Foreign key constraint violation
          res
            .status(400)
            .json(
              "The user rights cannot be deleted due to a link with another record",
            );
          return;
        } else {
          throw err; // Rethrow other SQL errors
        }
      }
    }

    res.status(200).json("User and company mapping data deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//DROPDOWN FOR USER SCREEN MAPPING 06/07/2024 DHANA

const getScreens = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Screens','',' ', ' ','','' , NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getPermissions = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Permissions','',' ', ' ' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

///test from kathir on 18-07-2024
const facereg = async (req, res) => {
  try {
    const pool = await connection.connectToDatabase();
    const user_code = req.params.user_code;

    const result = await pool
      .request()
      .input("user_code", sql.VarChar, user_code)
      .query(
        "SELECT user_image FROM tbl_face_recognition WHERE user_code = @user_code",
      );

    if (result.recordset.length > 0 && result.recordset[0].user_image) {
      const imageData = result.recordset[0].user_image;

      // Convert binary image data to Base64
      const base64Image = Buffer.from(imageData).toString("base64");
      const imageSrc = `data:image/jpeg;base64,${base64Image}`; // Adjust content type based on your image type

      res.json({ imageSrc });
    } else {
      res.status(404).json({ message: "Image not found" });
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code added By harish 23-07-2024

const getacctype = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'account type','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getofftype = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'OfficeType','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const RollMappingDelete = async (req, res) => {
  const keyfieldToDelete = req.body.keyfield;

  try {
    const pool = await connection.connectToDatabase();
    for (const keyfield of keyfieldToDelete) {
      try {
        await pool
          .request()
          .input("keyfield", keyfield)
          .input("modified_by", sql.NVarChar, req.headers["modified-by"])
          .query(` EXEC sp_user_rolemapping 'D','','','','','',@keyfield,'', @modified_by,null,null,null,null,null,null,null,null
            `);
      } catch (error) {
        if (error.number === 547) {
          // Foreign key constraint violation
          res.status(400).json("First Delete the RoleMapping header");
          return;
        } else {
          throw error; // Rethrow other SQL errors
        }
      }
    }
    res.status(200).json("RoleMapping Deleted Successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const updateRoleMapping = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }
  try {
    const pool = await connection.connectToDatabase(dbConfig);

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .input("user_code", updatedRow.user_code)
        .input("role_id", updatedRow.role_id)
        .input("keyfield", updatedRow.keyfield)
        .input("created_by", updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", updatedRow.tempstr1)
        .input("tempstr2", updatedRow.tempstr2)
        .input("tempstr3", updatedRow.tempstr3)
        .input("tempstr4", updatedRow.tempstr4)
        .input("datetime1", updatedRow.datetime1)
        .input("datetime2", updatedRow.datetime2)
        .input("datetime3", updatedRow.datetime3)
        .input("datetime4", updatedRow.datetime4)
        .query(
          `EXEC sp_user_rolemapping @mode,@company_code,@user_code,'',@role_id,'',@keyfield,@created_by,@modified_by,@tempstr1,@tempstr2,@tempstr3,@tempstr4,@datetime1,@datetime2,@datetime3,@datetime4`,
        );
    }

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getUserRole = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_role_info 'UR',@company_code,'','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const UpdateUserImage = async (req, res) => {
  const { user_code } = req.body;

  let user_img = null;

  if (req.file) {
    user_img = req.file.buffer; // Buffer containing the uploaded image
  }
  try {
    // Check if the user exists in the database
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("user_code", sql.NVarChar, user_code)
      .input("user_img", sql.VarBinary, user_img)
      .query(`EXEC SP_user_info_hdr 'UI','',@user_code,'','','','','','','','','','','',@user_img,'','',
                    NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);

    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (error) {
    if (error.class === 16 && error.number === 50000) {
      // Custom error from the stored procedure
      res
        .status(400)
        .json({ message: "User already exists", error: error.message });
    } else {
      // Handle unexpected errors
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
};

const getInventoryTransaction = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'InventoryTransacti','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getEmptype = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'EmployeeType','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getCondition = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Condition','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//code added by pavun 05-06-2024
const LocationUpdate = async (req, res) => {
  const { location_no, location_name, short_name, address1, address2, address3, city, state, pincode, country, email_id, status, contact_no, created_by, modified_by,} = req.body;

  let pool;
  try {
    pool = await connection.connectToDatabase();

    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("location_no", sql.NVarChar, location_no)
      .input("location_name", sql.NVarChar, location_name)
      .input("short_name", sql.NVarChar, short_name)
      .input("address1", sql.NVarChar, address1)
      .input("address2", sql.NVarChar, address2)
      .input("address3", sql.NVarChar, address3)
      .input("city", sql.NVarChar, city)
      .input("state", sql.NVarChar, state)
      .input("pincode", sql.NVarChar, pincode)
      .input("country", sql.NVarChar, country)
      .input("email_id", sql.NVarChar, email_id)
      .input("status", sql.NVarChar, status)
      .input("contact_no", sql.NVarChar, contact_no)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_location_info @mode,@location_no, @location_name, @short_name, @address1, @address2, 
          @address3, @city, @state, @pincode, @country, @email_id,  @status, @contact_no, @created_by, @modified_by , 
         '', '', '', '','', '', '',''`);
    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CompanyUpdate = async (req, res) => {
  const { company_no, company_name, short_name, address1, address2, address3, city, state, pincode, country, email_id, status, foundedDate, websiteURL, contact_no, annualReportURL, location_no, company_gst_no, modified_by,} = req.body;

  let company_logo = req.files["company_logo"]
    ? req.files["company_logo"][0].buffer
    : null;
  let authorisedSignatur = req.files["authorisedSignatur"]
    ? req.files["authorisedSignatur"][0].buffer
    : null;
  try {
    const pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("company_no", sql.NVarChar, company_no)
      .input("company_name", sql.NVarChar, company_name)
      .input("short_name", sql.NVarChar, short_name)
      .input("address1", sql.NVarChar, address1)
      .input("address2", sql.NVarChar, address2)
      .input("address3", sql.NVarChar, address3)
      .input("city", sql.NVarChar, city)
      .input("state", sql.NVarChar, state)
      .input("pincode", sql.NVarChar, pincode)
      .input("country", sql.NVarChar, country)
      .input("email_id", sql.NVarChar, email_id)
      .input("status", sql.NVarChar, status)
      .input("foundedDate", sql.NVarChar, foundedDate)
      .input("websiteURL", sql.NVarChar, websiteURL)
      .input("company_logo", sql.VarBinary, company_logo)
      .input("contact_no", sql.NVarChar, contact_no)
      .input("annualReportURL", sql.NVarChar, annualReportURL)
      .input("location_no", sql.NVarChar, location_no)
      .input("company_gst_no", sql.NVarChar, company_gst_no)
      .input("authorisedSignatur", sql.VarBinary, authorisedSignatur)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_company_info @mode, @company_no, @company_name, @short_name, @address1, @address2, @address3, @city, @state, @pincode, @country, @email_id, 
        @status, @foundedDate, @websiteURL, @company_logo, @contact_no, @annualReportURL,@location_no,@company_gst_no,@authorisedSignatur,'' ,@modified_by,
         '', '', '', '','', '', '', ''`);
    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const UpdateCompanyImage = async (req, res) => {
  const { company_no } = req.body;

  let company_logo = null;

  if (req.file) {
    company_logo = req.file.buffer;
  }

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_no", sql.NVarChar, company_no)
      .input("company_logo", sql.VarBinary, company_logo)
      .query(
        `EXEC sp_company_info 'CIU',@company_no,'','','','','','','','','','','','','',@company_logo,'','','','','','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,null`,
      );

    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (error) {
    if (error.class === 16 && error.number === 50000) {
      // Custom error from the stored procedure
      res
        .status(400)
        .json({ message: "company already exists", error: error.message });
    } else {
      // Handle unexpected errors
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
};

//code added by pavun 07-10-2024
const RoleUpdate = async (req, res) => {
  const { company_code, role_id, role_name, description, created_by, modified_by,} = req.body;
  let pool;
  try {
    pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("mode", sql.NVarChar, "U") // update mode
      .input("company_code", sql.NVarChar, company_code)
      .input("role_id", sql.NVarChar, role_id)
      .input("role_name", sql.NVarChar, role_name)
      .input("description", sql.NVarChar, description)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(
        `EXEC sp_Role_Info @mode,@company_code,@role_id,@role_name,@description,@created_by,@modified_by,'','',
          '','','','','',''`,
      );

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const UserUpdate = async (req, res) => {
  const { company_code, user_code, user_name, first_name, last_name, user_password, user_status, log_in_out, user_type, email_id, dob, gender, role_id, created_by, modified_by,} = req.body;

  let user_images = null;

  if (req.file) {
    user_images = req.file.buffer;
  }

  try {
    pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("mode", sql.NVarChar, "U") // update mode
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.NVarChar, user_code)
      .input("user_name", sql.NVarChar, user_name)
      .input("first_name", sql.NVarChar, first_name)
      .input("last_name", sql.NVarChar, last_name)
      .input("user_password", sql.NVarChar, user_password)
      .input("user_status", sql.NVarChar, user_status)
      .input("log_in_out", sql.NVarChar, log_in_out)
      .input("user_type", sql.NVarChar, user_type)
      .input("email_id", sql.NVarChar, email_id)
      .input("dob", sql.NVarChar, dob)
      .input("gender", sql.NVarChar, gender)
      .input("role_id", sql.NVarChar, role_id)
      .input("user_images", sql.VarBinary, user_images)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(
        `EXEC SP_user_info_hdr @mode,@company_code, @user_code, @user_name, @first_name, @last_name, @user_password, @user_status, @log_in_out, @user_type, 
            @email_id, @dob, @gender,@role_id,@user_images, @created_by, @modified_by, '', '', '', '', '', '', '', ''`,
      );
    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CompanyMappingUpdate = async (req, res) => {
  const { company_code, user_code, company_no, location_no, status, order_no, keyfiels, modified_by,} = req.body;
  let pool;
  try {
    pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.VarChar, user_code)
      .input("company_no", sql.NVarChar, company_no)
      .input("location_no", sql.VarChar, location_no)
      .input("status", sql.VarChar, status)
      .input("order_no", sql.Int, order_no)
      .input("keyfiels", sql.NVarChar, keyfiels)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_user_company_mapping @mode, @company_code, @user_code, @company_no, @location_no, 
          @status, @order_no,@keyfiels,'',@modified_by,'', '', '', '', '', '', '', ''`);
    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const RoleMappingUpdate = async (req, res) => {
  const { company_code, user_code, role_id, keyfield, modified_by } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.VarChar, user_code)
      .input("role_id", sql.VarChar, role_id)
      .input("keyfield", sql.VarChar, keyfield)
      .input("modified_by", sql.VarChar, modified_by)
      .query(
        `EXEC sp_user_rolemapping @mode,@company_code,@user_code,'',@role_id,'',@keyfield,'',@modified_by,'','','','','','','',''`,
      );

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const AttributeUpdate = async (req, res) => {
  const { company_code, attributeheader_code, attributedetails_code, attributedetails_name, descriptions, created_by, modified_by, } = req.body;

  let pool;
  try {
    pool = await connection.connectToDatabase();

    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("company_code", sql.NVarChar, company_code)
      .input("attributeheader_code", sql.NVarChar, attributeheader_code)
      .input("attributedetails_code", sql.NVarChar, attributedetails_code)
      .input("attributedetails_name", sql.NVarChar, attributedetails_name)
      .input("descriptions", sql.NVarChar, descriptions)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(
        `EXEC sp_attribute_Info @mode,@company_code, @attributeheader_code, @attributedetails_code, @attributedetails_name, @descriptions, @created_by,@modified_by, '', '', '', '', '', '', '', ''`,
      );
    res.status(200).json("Updated data successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getEvent = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Transactions Event','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code Ended By Harish 18-10-2024

const getsiblings = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Siblings','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getkids = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Kids','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getMartial = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Marital Status','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getSalaryType = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Salary Type','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getPayscale = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Payscale','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getLoanID = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'LoanID','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code added By Harish  18_11_2024
const getItem = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'product','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getDocumentType = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'document type','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getrelation = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Relationship','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getannoncementtype = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'AnnouncementType','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getAnnouncementDetail = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'AnnouncementDetail','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getAnnouncement_Msg = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Announcement_Msg','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getAnnouncement = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Annoucement','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getcompanyshift = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'ESS_SHIFT','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getOverallTAX = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'tax type','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getInvocieType = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Invoice Type','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// Code added by harish 27/12/2024
const TermsDC = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'TermsConditionDC','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const TermsQO = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'TermsConditionQO','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const TermsPO = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'TermsConditionsPO','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const TermsTI = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'TermsConditionTI','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code Added By Harish 30_12_24
const getLeaveType = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'LeaveType','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getSelectSlot = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Select_Slot','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getDashBoardType = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'DB Type','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getGST = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'GST','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getPartyName = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'PartyName','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getGSTReport = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'GF',@company_code,'GSTReport','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getType = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Type','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getAccrual = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'AccrualType','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getExceedLeave = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Exceed_Leave','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getLeaveReason = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Leave_Reason','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//code added by pavun 10/01/25
const getPendingStatus = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'PendingStatus','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//code ended by pavun

const getdefCustomer = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'DefaultCust','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//CODE ADDED BY PAVUN 22-01-2025
const getSalesMode = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'SalesMode','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//CODE ENDED BY PAVUN

//Code Added by pavun 30-01-2025
const getPurchaseAnalysis = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Purchase','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getTaskstatus = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Taskstatus','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code added by pavun 05-02-2025

const PendingCustomer = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'PendingCustomer','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code ended by pavun

// Code Added By harish 07-02-25
const getPriority = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'PriorityLevel','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
// Code Ended By harish 07-02-25

const Userdropdown = async (req, res) => {
  const { user_code } = req.body;
  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();
    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "MG")
      .input("user_code", sql.NVarChar, user_code)
      .query(`EXEC [SP_user_info_hdr] @mode,'',@user_code,'','','','','','','','','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL
`);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// Code Added By Harish 12/03/2025

const getAnnouncementDuration = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'AnnounceDuration','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//code ended by kathir on 09-04-25
const savePDFToPath = async (req, res) => {
  try {
    const file = req.file;
    const { SalaryMonth } = req.body;

    if (!file || !SalaryMonth) {
      return res.status(400).json({ message: "Missing PDF or SalaryMonth" });
    }

    // Base folder
    const baseFolder = path.resolve("D:/Payslip");

    // Create base Payslip folder if not exists
    if (!fs.existsSync(baseFolder)) {
      fs.mkdirSync(baseFolder, { recursive: true });
    }

    const monthFolder = path.join(baseFolder, SalaryMonth);

    // Create the month folder if not exists
    if (!fs.existsSync(monthFolder)) {
      fs.mkdirSync(monthFolder, { recursive: true });
    }

    const filePath = path.join(monthFolder, file.originalname);

    // Save PDF to disk
    fs.writeFileSync(filePath, file.buffer);

    return res.status(200).json({
      success: true,
      message: "PDF saved successfully",
      path: filePath,
    });
  } catch (err) {
    console.error("Error saving PDF:", err);
    return res.status(500).json({ message: err.message });
  }
};

//code added by pavun on 11-04-25

const sendPayslipEmails = async (req, res) => {
  const { SalaryMonth, payslips } = req.body;
  const baseFolder = path.resolve(`D:/Payslip/${SalaryMonth}`);

  try {
    for (const slip of payslips) {
      const fileName = `${slip.EmployeeId}_${slip.company_code}_Payslip_${SalaryMonth}.pdf`;
      const filePath = path.join(baseFolder, fileName);

      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        continue;
      }

      const mailOptions = {
        from: "harishkumar.s@yjktechnologies.com",
        to: slip.mail_id, // each employee gets their email
        cc: ["saraswathi.pv@yjktechnologies.com", "jk@yjktechnologies.com"], // this person is always copied
        subject: "Your Payslip",
        text: `Dear ${slip.employeename},\n\nPlease find attached your payslip for ${SalaryMonth}.`,
        attachments: [{ filename: fileName, path: filePath }],
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({ message: "Payslips emailed successfully" });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ message: err.message });
  }
};
//code ended by pavun on 11-04-25

//code added by pavun on 15-04-25

const getDocument = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'DocumentType','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//code ended by pavun on 15-04-25

//code added by pavun on 21-04-25
const sendAutoMail = async (req, res) => {
  const { email } = req.body;

  try {
    const mailOptions = {
      from: "harishkumar.s@yjktechnologies.com",
      to: email,
      subject: "Working Hours Exceeded",
      text: "You have worked more than 8 hours today. Please take a break!",
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Mail sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send mail", error });
  }
};
// code ended by pavun on 21-04-25

//code added by pavun on 10-05-25

const termsandCondition = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_attribute_Info 'F',@company_code,'Terms&Conditions','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//code ended by pavun on 10-05-25

//code added by mathu on 12-05-25

const getLockType = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Lock_Type','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//code ended by mathu on 12-05-25

const getPrint = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Print_options','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getcopies = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Print_copies','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
// Code Added by Harish on 19-05-2025

// Code Added by Harish on 14/06/25
const WeekOff = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Week_Off','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// Code Added by harish on 17-06-25
const GenerateEmployee = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'GenerateEmpId','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getLeaveStatus = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "F")
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'LeaveStatus','','', '' ,'','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// Code Added by Harish 06-08-25

const HMS_PaymentModeInsert = async (req, res) => {
  const { PaymentModeID, company_code, PaymentMode, Description, Status, Created_by, Created_date,} = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("PaymentModeID", sql.Int, PaymentModeID)
      .input("PaymentMode", sql.NVarChar, PaymentMode)
      .input("Description", sql.NVarChar, Description)
      .input("Status", sql.NVarChar, Status)
      .input("company_code", sql.NVarChar, company_code)
      .input("Created_by", sql.NVarChar, Created_by)
      .input("Created_date", sql.Date, Created_date)
      .query(
        `EXEC sp_HMS_PaymentMode @mode, @PaymentModeID, @PaymentMode, @Description, @Status, @company_code, @Created_by, @Created_date, '', ''`,
      );

    res
      .status(200)
      .json({ success: true, message: "Data insertd successfully" });
  } catch (err) {
    console.error("Error during insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const HMS_PaymentModeUpdate = async (req, res) => {
  const { PaymentModeID, company_code, PaymentMode, Description, Status, Modified_by, Modified_date,} = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("PaymentModeID", sql.Int, PaymentModeID)
      .input("PaymentMode", sql.NVarChar, PaymentMode)
      .input("Description", sql.NVarChar, Description)
      .input("Status", sql.NVarChar, Status)
      .input("company_code", sql.NVarChar, company_code)
      .input("Modified_by", sql.NVarChar, Modified_by)
      .input("Modified_date", sql.Date, Modified_date)
      .query(
        `EXEC sp_HMS_PaymentMode @mode, @PaymentModeID, @PaymentMode, @Description, @Status, @company_code, '', '', @Modified_by, @Modified_date`,
      );

    res
      .status(200)
      .json({ success: true, message: "Data updated successfully" });
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const HMS_PaymentModeDelete = async (req, res) => {
  const { PaymentModeID, company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "D")
      .input("PaymentModeID", sql.Int, PaymentModeID)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_HMS_PaymentMode @mode, @PaymentModeID,'','','',@company_code, '','','',''`,
      );

    res
      .status(200)
      .json({ success: true, message: "Data deleted successfully" });
  } catch (err) {
    console.error("Error during delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const HMS_ServiceInsert = async (req, res) => {
  const { ServiceID, company_code, Code, ServiceName, Department, Rate, TaxApplicable, Status, Created_by, Created_date,} = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("ServiceID", sql.NVarChar, ServiceID)
      .input("Code", sql.NVarChar, Code)
      .input("ServiceName", sql.NVarChar, ServiceName)
      .input("Department", sql.NVarChar, Department)
      .input("Rate", sql.Decimal(18, 2), Rate)
      .input("TaxApplicable", sql.Bit, TaxApplicable)
      .input("Status", sql.NVarChar, Status)
      .input("company_code", sql.NVarChar, company_code)
      .input("Created_by", sql.NVarChar, Created_by)
      .input("Created_date", sql.NVarChar, Created_date)
      .query(
        `EXEC sp_HMS_Service @mode, @ServiceID, @Code, @ServiceName, @Department, @Rate, @TaxApplicable, @Status, @company_code, @Created_by, @Created_date,'','' `,
      );

    res
      .status(200)
      .json({ success: true, message: "Data insertd successfully" });
  } catch (err) {
    console.error("Error during insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const HMS_ServiceUpdate = async (req, res) => {
  const { ServiceID, company_code, Code, ServiceName, Department, Rate, TaxApplicable, Status, Modified_by, Modified_date,} = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("ServiceID", sql.NVarChar, ServiceID)
      .input("Code", sql.NVarChar, Code)
      .input("ServiceName", sql.NVarChar, ServiceName)
      .input("Department", sql.NVarChar, Department)
      .input("Rate", sql.Decimal(18, 2), Rate)
      .input("TaxApplicable", sql.Bit, TaxApplicable)
      .input("Status", sql.NVarChar, Status)
      .input("company_code", sql.NVarChar, company_code)
      .input("Modified_by", sql.NVarChar, Modified_by)
      .input("Modified_date", sql.NVarChar, Modified_date)
      .query(
        `EXEC sp_HMS_Service @mode, @ServiceID, @Code, @ServiceName, @Department, @Rate, @TaxApplicable, @Status, @company_code, '', '', @Modified_by, @Modified_date`,
      );

    res
      .status(200)
      .json({ success: true, message: "Data updated successfully" });
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const HMS_ServiceDelete = async (req, res) => {
  const deletedServiceId = req.body.deletedServiceId;

  if (!deletedServiceId || !deletedServiceId.length) {
    return res.status(400).json("Invalid or empty deleted Service Id array.");
  }

  try {
    const pool = await sql.connect(dbConfig);
    for (const deletedRow of deletedServiceId) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "D")
        .input("ServiceID", sql.NVarChar, deletedRow.ServiceID)
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .query(
          `EXEC sp_HMS_Service @mode, @ServiceID,'','','',0,'','',@company_code,'','','','' `,
        );
    }
    res
      .status(200)
      .json({ success: true, message: "Data deleted successfully" });
  } catch (err) {
    console.error("Error during delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const HMS_BillHeaderInsert = async (req, res) => {
  const { BillNo, company_code, PatientID, PatientName, Gender, VisitNo, DoctorID, DoctorName, BillDate, ContactNumber, ClientID, ClientName, PaymentModeID,
    Cash, GrossAmount, Discount, NetAmount, ReceivedAmount, BalanceAmount, Barcode, age, created_by, created_date, BillDateFrom, BillDateTo,} = req.body;

  try {
    if (Number(Discount) >= 1000) {
      return res.status(500).json({
        message: "Discount cannot be greater than 999.99",
      });
    }

    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("BillNo", sql.Int, BillNo)
      .input("PatientID", sql.VarChar, PatientID)
      .input("PatientName", sql.VarChar, PatientName)
      .input("Gender", sql.NVarChar, Gender)
      .input("VisitNo", sql.NVarChar, VisitNo)
      .input("DoctorID", sql.VarChar, DoctorID)
      .input("DoctorName", sql.VarChar, DoctorName)
      .input("BillDate", sql.Date, BillDate)
      .input("ContactNumber", sql.NVarChar, ContactNumber)
      .input("ClientID", sql.VarChar, ClientID)
      .input("ClientName", sql.VarChar, ClientName)
      .input("PaymentModeID", sql.NVarChar, PaymentModeID)
      .input("Cash", sql.Decimal(18, 2), Cash)
      .input("GrossAmount", sql.Decimal(18, 2), GrossAmount)
      .input("Discount", sql.Decimal(5, 2), Discount)
      .input("NetAmount", sql.Decimal(18, 2), NetAmount)
      .input("ReceivedAmount", sql.Decimal(18, 2), ReceivedAmount)
      .input("BalanceAmount", sql.Decimal(18, 2), BalanceAmount)
      .input("Barcode", sql.NVarChar, Barcode)
      .input("company_code", sql.NVarChar, company_code)
      .input("age", sql.Int, age)
      .input("created_by", sql.NVarChar, created_by)
      .input("created_date", sql.NVarChar, created_date)
      .input("BillDateFrom", sql.NVarChar, BillDateFrom)
      .input("BillDateTo", sql.NVarChar, BillDateTo)
      .query(`EXEC sp_HMS_BillHeader @mode, @BillNo, @PatientID, @PatientName, @Gender, @VisitNo, @DoctorID, @DoctorName, 
        @BillDate, @ContactNumber, @ClientID, @ClientName, @PaymentModeID, @Cash, @GrossAmount, @Discount, @NetAmount, @ReceivedAmount, @BalanceAmount, 
        @Barcode, @company_code, @age, @created_by, @created_date,'','','',''`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    }
  } catch (err) {
    console.error("Error during insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const HMS_BillHeaderUpdate = async (req, res) => {
  const { BillNo, company_code, PatientID, PatientName, Gender, VisitNo, DoctorID, DoctorName, BillDate, ContactNumber, ClientID, ClientName, PaymentModeID,
    Cash, GrossAmount, Discount, NetAmount, ReceivedAmount, BalanceAmount, Barcode, age, modified_by, modified_date, BillDateFrom, BillDateTo,} = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("BillNo", sql.Int, BillNo)
      .input("PatientID", sql.Int, PatientID)
      .input("PatientName", sql.VarChar, PatientName)
      .input("Gender", sql.NVarChar, Gender)
      .input("VisitNo", sql.NVarChar, VisitNo)
      .input("DoctorID", sql.Int, DoctorID)
      .input("DoctorName", sql.VarChar, DoctorName)
      .input("BillDate", sql.Date, BillDate)
      .input("ContactNumber", sql.NVarChar, ContactNumber)
      .input("ClientID", sql.Int, ClientID)
      .input("ClientName", sql.VarChar, ClientName)
      .input("PaymentModeID", sql.NVarChar, PaymentModeID)
      .input("Cash", sql.Decimal(18, 2), Cash)
      .input("GrossAmount", sql.Decimal(18, 2), GrossAmount)
      .input("Discount", sql.Decimal(5, 2), Discount)
      .input("NetAmount", sql.Decimal(18, 2), NetAmount)
      .input("ReceivedAmount", sql.Decimal(18, 2), ReceivedAmount)
      .input("BalanceAmount", sql.Decimal(18, 2), BalanceAmount)
      .input("Barcode", sql.NVarChar, Barcode)
      .input("company_code", sql.NVarChar, company_code)
      .input("age", sql.Int, age)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("modified_date", sql.NVarChar, modified_date)
      .input("BillDateFrom", sql.NVarChar, BillDateFrom)
      .input("BillDateTo", sql.NVarChar, BillDateTo)
      .query(`EXEC sp_HMS_BillHeader @mode, @BillNo, @PatientID, @PatientName, @Gender, @VisitNo, @DoctorID, @DoctorName, @BillDate, 
        @ContactNumber, @ClientID, @ClientName, @PaymentModeID, @Cash, @GrossAmount, @Discount, @NetAmount, @ReceivedAmount, @BalanceAmount, @Barcode, 
        @company_code, @age, '', '', @modified_by, @modified_date,'',''`);

    res
      .status(200)
      .json({ success: true, message: "Data updated successfully" });
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const HMS_BillHeaderDelete = async (req, res) => {
  const { BillNo, company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "D")
      .input("BillNo", sql.Int, BillNo)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_HMS_BillHeader @mode,@BillNo,'','','','','','','','',0,'','',0,0,0,0,0,0,'',@company_code,0,'','','','','',''`,
      );

    res
      .status(200)
      .json({ success: true, message: "Data deleted successfully" });
  } catch (err) {
    console.error("Error during delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const HMS_BillDetailsInsert = async (req, res) => {
  const { BillNo, company_code, Sno, ServiceID, ServiceName, Amount, created_by, created_date,} = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("BillNo", sql.Int, BillNo)
      .input("Sno", sql.Int, Sno)
      .input("ServiceID", sql.NVarChar, ServiceID)
      .input("ServiceName", sql.NVarChar, ServiceName)
      .input("Amount", sql.Decimal(18, 2), Amount)
      .input("company_code", sql.NVarChar, company_code)
      .input("created_by", sql.NVarChar, created_by)
      .input("created_date", sql.NVarChar, created_date)
      .query(`EXEC sp_HMS_BillDetails @mode, @BillNo, @Sno, @ServiceID, @ServiceName, @Amount, @company_code, @created_by, @created_date, '', '' `,);

    res
      .status(200)
      .json({ success: true, message: "Data insertd successfully" });
  } catch (err) {
    console.error("Error during insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const HMS_BillDetailsUpdate = async (req, res) => {
  const { BillNo, company_code, Sno, ServiceID, ServiceName, Amount, modified_by, modified_date,} = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("BillNo", sql.Int, BillNo)
      .input("Sno", sql.Int, Sno)
      .input("ServiceID", sql.NVarChar, ServiceID)
      .input("ServiceName", sql.NVarChar, ServiceName)
      .input("Amount", sql.Decimal(18, 2), Amount)
      .input("company_code", sql.NVarChar, company_code)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("modified_date", sql.NVarChar, modified_date)
      .query(
        `EXEC sp_HMS_BillDetails @mode, @BillNo, @Sno, @ServiceID, @ServiceName, @Amount, @company_code, '', '', @modified_by, @modified_date`,
      );

    res
      .status(200)
      .json({ success: true, message: "Data updated successfully" });
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const HMS_BillDetailsDelete = async (req, res) => {
  const { BillNo, company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "D")
      .input("BillNo", sql.Int, BillNo)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_HMS_BillDetails @mode, @BillNo,'','','',0,@company_code,'','','',''`,
      );

    res
      .status(200)
      .json({ success: true, message: "Data deleted successfully" });
  } catch (err) {
    console.error("Error during delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code added by pavun on 06-08-2025
const PatientMasterInsert = async (req, res) => {
  const { PatientID, company_code, PatientName, Gender, DOB, ContactNumber, RCHID, address_1, address_2, address_3, city, state, country, age, Created_by, Created_date,} = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("PatientID", sql.VarChar, PatientID)
      .input("PatientName", sql.NVarChar, PatientName)
      .input("Gender", sql.NVarChar, Gender)
      .input("DOB", sql.Date, DOB)
      .input("ContactNumber", sql.NVarChar, ContactNumber)
      .input("RCHID", sql.NVarChar, RCHID)
      .input("company_code", sql.NVarChar, company_code)
      .input("address_1", sql.NVarChar, address_1)
      .input("address_2", sql.NVarChar, address_2)
      .input("address_3", sql.NVarChar, address_3)
      .input("city", sql.NVarChar, city)
      .input("state", sql.NVarChar, state)
      .input("country", sql.NVarChar, country)
      .input("age", sql.Int, age)
      .input("Created_by", sql.NVarChar, Created_by)
      .input("Created_date", sql.DateTime, Created_date)
      .query(`EXEC sp_HMS_PatientMaster @mode, @PatientID, @PatientName, @Gender, @DOB, @ContactNumber, @RCHID, @company_code, @address_1, @address_2, @address_3, @city,
        @state, @country, @age, @Created_by, @Created_date, '', ''`);

    res
      .status(200)
      .json({ success: true, message: "Data insertd successfully" });
  } catch (err) {
    console.error("Error during insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const PatientMasterUpdate = async (req, res) => {
  const { PatientID, company_code, PatientName, Gender, DOB, ContactNumber, RCHID, address_1, address_2, address_3, city, state, country, age, Modified_by, Modified_date,} = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("PatientID", sql.VarChar, PatientID)
      .input("PatientName", sql.NVarChar, PatientName)
      .input("Gender", sql.NVarChar, Gender)
      .input("DOB", sql.Date, DOB)
      .input("ContactNumber", sql.NVarChar, ContactNumber)
      .input("RCHID", sql.NVarChar, RCHID)
      .input("company_code", sql.NVarChar, company_code)
      .input("address_1", sql.NVarChar, address_1)
      .input("address_2", sql.NVarChar, address_2)
      .input("address_3", sql.NVarChar, address_3)
      .input("city", sql.NVarChar, city)
      .input("state", sql.NVarChar, state)
      .input("country", sql.NVarChar, country)
      .input("age", sql.Int, age)
      .input("Modified_by", sql.NVarChar, Modified_by)
      .input("Modified_date", sql.DateTime, Modified_date)
      .query(`EXEC sp_HMS_PatientMaster @mode, @PatientID, @PatientName, @Gender, @DOB, @ContactNumber, @RCHID, @company_code,
        @address_1, @address_2, @address_3, @city, @state, @country, @age, '', '', @Modified_by, @Modified_date`);

    res
      .status(200)
      .json({ success: true, message: "Data updated successfully" });
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const PatientMasterDelete = async (req, res) => {
  const deletedPatientID = req.body.deletedPatientID;

  if (!deletedPatientID || !deletedPatientID.length) {
    return res.status(400).json("Invalid or empty deleted Patient ID array.");
  }
  try {
    const pool = await sql.connect(dbConfig);
    for (const deletedRow of deletedPatientID) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "D")
        .input("PatientID", sql.VarChar, deletedRow.PatientID)
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .query(
          `EXEC sp_HMS_PatientMaster @mode, @PatientID, '', '', '', '', '', @company_code, '', '', '', '', '', '', 0, '', '', '', ''`,
        );
    }
    res
      .status(200)
      .json({ success: true, message: "Data deleted successfully" });
  } catch (err) {
    console.error("Error during delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const HMS_DoctorMasterInsert = async (req, res) => {
  const { DoctorID, DoctorName, Specialization, ContactNumber, Status, company_code, address_1, address_2, address_3, city, state, country, Created_by, Created_date,} = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("DoctorID", sql.VarChar, DoctorID)
      .input("DoctorName", sql.NVarChar, DoctorName)
      .input("Specialization", sql.NVarChar, Specialization)
      .input("ContactNumber", sql.NVarChar, ContactNumber)
      .input("Status", sql.VarChar, Status)
      .input("company_code", sql.NVarChar, company_code)
      .input("address_1", sql.NVarChar, address_1)
      .input("address_2", sql.NVarChar, address_2)
      .input("address_3", sql.NVarChar, address_3)
      .input("city", sql.NVarChar, city)
      .input("state", sql.NVarChar, state)
      .input("country", sql.NVarChar, country)
      .input("Created_by", sql.NVarChar, Created_by)
      .input("Created_date", sql.DateTime, Created_date)
      .query(`EXEC sp_HMS_DoctorMaster @mode, @DoctorID, @DoctorName, @Specialization, @ContactNumber, @Status, @company_code,
        @address_1, @address_2, @address_3, @city, @state, @country, @Created_by, @Created_date, '', ''`);

    res
      .status(200)
      .json({ success: true, message: "Data insertd successfully" });
  } catch (err) {
    console.error("Error during insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const HMS_DoctorMasterUpdate = async (req, res) => {
  const { DoctorID, DoctorName, Specialization, ContactNumber, Status, company_code, address_1, address_2, address_3, city, state, country, Modified_by, Modified_date,} = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("DoctorID", sql.VarChar, DoctorID)
      .input("DoctorName", sql.NVarChar, DoctorName)
      .input("Specialization", sql.NVarChar, Specialization)
      .input("ContactNumber", sql.NVarChar, ContactNumber)
      .input("Status", sql.VarChar, Status)
      .input("company_code", sql.NVarChar, company_code)
      .input("address_1", sql.NVarChar, address_1)
      .input("address_2", sql.NVarChar, address_2)
      .input("address_3", sql.NVarChar, address_3)
      .input("city", sql.NVarChar, city)
      .input("state", sql.NVarChar, state)
      .input("country", sql.NVarChar, country)
      .input("Modified_by", sql.NVarChar, Modified_by)
      .input("Modified_date", sql.DateTime, Modified_date)
      .query(`EXEC sp_HMS_DoctorMaster @mode, @DoctorID, @DoctorName, @Specialization, @ContactNumber, @Status, @company_code,
        @address_1, @address_2, @address_3, @city, @state, @country, '', '', @Modified_by, @Modified_date`);

    res
      .status(200)
      .json({ success: true, message: "Data updated successfully" });
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const HMS_DoctorMasterDelete = async (req, res) => {
  const deletedDoctorId = req.body.deletedDoctorId;

  if (!deletedDoctorId || !deletedDoctorId.length) {
    return res.status(400).json("Invalid or empty deleted Doctor Id array.");
  }

  try {
    const pool = await sql.connect(dbConfig);
    for (const deletedRow of deletedDoctorId) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "D")
        .input("DoctorID", sql.VarChar, deletedRow.DoctorID)
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .query(
          `EXEC sp_HMS_DoctorMaster @mode, @DoctorID, '', '', '', '', @company_code, '', '', '', '', '', '', '', '', '', ''`,
        );
    }
    res
      .status(200)
      .json({ success: true, message: "Data deleted successfully" });
  } catch (err) {
    console.error("Error during delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const HMS_ClientMasterInsert = async (req, res) => {
  const { ClientID, ClientName, ContactPerson, ContactNumber, AgreementType, company_code, address_1, address_2, address_3, city, state, country, Created_by, Created_date,} = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("ClientID", sql.VarChar, ClientID)
      .input("ClientName", sql.NVarChar, ClientName)
      .input("ContactPerson", sql.NVarChar, ContactPerson)
      .input("ContactNumber", sql.NVarChar, ContactNumber)
      .input("AgreementType", sql.NVarChar, AgreementType)
      .input("company_code", sql.NVarChar, company_code)
      .input("address_1", sql.NVarChar, address_1)
      .input("address_2", sql.NVarChar, address_2)
      .input("address_3", sql.NVarChar, address_3)
      .input("city", sql.NVarChar, city)
      .input("state", sql.NVarChar, state)
      .input("country", sql.NVarChar, country)
      .input("Created_by", sql.NVarChar, Created_by)
      .input("Created_date", sql.DateTime, Created_date)
      .query(`EXEC sp_HMS_ClientMaster @mode, @ClientID, @ClientName, @ContactPerson, @ContactNumber, @AgreementType, @company_code, 
        @address_1, @address_2, @address_3, @city, @state, @country, @Created_by, @Created_date, '', ''`);
    res
      .status(200)
      .json({ success: true, message: "Data insertd successfully" });
  } catch (err) {
    console.error("Error during insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const HMS_ClientMasterUpdate = async (req, res) => {
  const { ClientID, ClientName, ContactPerson, ContactNumber, AgreementType, company_code, address_1, address_2, address_3, city, state, country, Modified_by, Modified_date,} = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("ClientID", sql.VarChar, ClientID)
      .input("ClientName", sql.NVarChar, ClientName)
      .input("ContactPerson", sql.NVarChar, ContactPerson)
      .input("ContactNumber", sql.NVarChar, ContactNumber)
      .input("AgreementType", sql.NVarChar, AgreementType)
      .input("company_code", sql.NVarChar, company_code)
      .input("address_1", sql.NVarChar, address_1)
      .input("address_2", sql.NVarChar, address_2)
      .input("address_3", sql.NVarChar, address_3)
      .input("city", sql.NVarChar, city)
      .input("state", sql.NVarChar, state)
      .input("country", sql.NVarChar, country)
      .input("Modified_by", sql.NVarChar, Modified_by)
      .input("Modified_date", sql.DateTime, Modified_date)
      .query(`EXEC sp_HMS_ClientMaster @mode, @ClientID, @ClientName, @ContactPerson, @ContactNumber, @AgreementType, @company_code,
        @address_1, @address_2, @address_3, @city, @state, @country, '', '', @Modified_by, @Modified_date`);

    res
      .status(200)
      .json({ success: true, message: "Data updated successfully" });
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const HMS_ClientMasterDelete = async (req, res) => {
  const deletedClientID = req.body.deletedClientID;

  if (!deletedClientID || !deletedClientID.length) {
    return res.status(400).json("Invalid or empty deleted Service Id array.");
  }

  try {
    const pool = await sql.connect(dbConfig);
    for (const deletedRow of deletedClientID) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "D")
        .input("ClientID", sql.VarChar, deletedRow.ClientID)
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .query(
          `EXEC sp_HMS_ClientMaster @mode, @ClientID, '', '', '', '', @company_code, '', '', '', '', '', '', '', '', '', ''`,
        );
    }
    res
      .status(200)
      .json({ success: true, message: "Data deleted successfully" });
  } catch (err) {
    console.error("Error during delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by pavun on 06-08-2025

//Code added by pavun on 08-08-25
const ServiceSearchCreteria = async (req, res) => {
  const { ServiceID, Code, ServiceName, Department, Status, Rate, company_code,} = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("ServiceID", sql.NVarChar, ServiceID)
      .input("Code", sql.NVarChar, Code)
      .input("ServiceName", sql.NVarChar, ServiceName)
      .input("Department", sql.NVarChar, Department)
      .input("Status", sql.NVarChar, Status)
      .input("Rate", sql.Decimal(18, 2), Rate)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_HMS_Service @mode, @ServiceID, @Code, @ServiceName, @Department, @Rate, 0, @Status, @company_code, '', '', '', ''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by pavun on 08-08-25

//Code added by pavun on 09-08-25
const getBillingHeader = async (req, res) => {
  const { BillNo, company_code } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "BH")
      .input("BillNo", sql.Int, BillNo)
      .input("company_code", sql.NVarChar, company_code)
      .query(`EXEC sp_HMS_getdata_print @mode,@BillNo,@company_code`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getBillingDetail = async (req, res) => {
  const { BillNo, company_code } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "BD")
      .input("BillNo", sql.Int, BillNo)
      .input("company_code", sql.NVarChar, company_code)
      .query(`EXEC sp_HMS_getdata_print @mode,@BillNo,@company_code`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getBillingGetData = async (req, res) => {
  const { BillNo, company_code } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "BHD")
      .input("BillNo", sql.Int, BillNo)
      .input("company_code", sql.NVarChar, company_code)
      .query(`EXEC sp_HMS_getdata_print @mode,@BillNo,@company_code`);

    if (
      result.recordsets &&
      result.recordsets.length > 0 &&
      result.recordsets[0].length > 0
    ) {
      const data = {
        Header: result.recordsets[0],
        Detail: result.recordsets[1] || [],
      };
      res.status(200).json(data);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by pavun on 09-08-25

// Code Added BY Harish 09-08-25
const BillHdrSearchCreteria = async (req, res) => {
  const { BillNo, PatientID, Gender, DoctorID, company_code, BillDateFrom, BillDateTo, PatientName, DoctorName, ContactNumber, ClientName, GrossAmount, Discount, NetAmount, ReceivedAmount, BalanceAmount,} = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("BillNo", sql.Int, BillNo)
      .input("PatientID", sql.NVarChar, PatientID)
      .input("Gender", sql.NVarChar, Gender)
      .input("DoctorID", sql.NVarChar, DoctorID)
      .input("company_code", sql.NVarChar, company_code)
      .input("BillDateFrom", sql.NVarChar, BillDateFrom)
      .input("BillDateTo", sql.NVarChar, BillDateTo)
      .input("PatientName", sql.NVarChar, PatientName)
      .input("DoctorName", sql.NVarChar, DoctorName)
      .input("ContactNumber", sql.NVarChar, ContactNumber)
      .input("ClientName", sql.NVarChar, ClientName)
      .input("GrossAmount", sql.Decimal(18, 2), GrossAmount)
      .input("Discount", sql.Decimal(5, 2), Discount)
      .input("NetAmount", sql.Decimal(18, 2), NetAmount)
      .input("ReceivedAmount", sql.Decimal(18, 2), ReceivedAmount)
      .input("BalanceAmount", sql.Decimal(18, 2), BalanceAmount)
      .query(`EXEC sp_HMS_BillHeader @mode,@BillNo,@PatientID,@PatientName,@Gender,'',@DoctorID,@DoctorName,'',@ContactNumber,'',@ClientName,'',0,@GrossAmount,@Discount,
        @NetAmount,@ReceivedAmount,@BalanceAmount,'',@company_code,0,'','','','',@BillDateFrom,@BillDateTo`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
// Code Ended BY Harish 09-08-25

//Code added by pavun on 11-08-25
const PatientSearchCreteria = async (req, res) => {
  const { PatientID, PatientName, Gender, DOB, ContactNumber, RCHID, address_1, company_code,} = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("PatientID", sql.VarChar, PatientID)
      .input("PatientName", sql.NVarChar, PatientName)
      .input("Gender", sql.NVarChar, Gender)
      .input("DOB", sql.NVarChar, DOB)
      .input("ContactNumber", sql.NVarChar, ContactNumber)
      .input("RCHID", sql.NVarChar, RCHID)
      .input("company_code", sql.NVarChar, company_code)
      .input("address_1", sql.NVarChar, address_1)
      .query(
        `EXEC sp_HMS_PatientMaster @mode,@PatientID,@PatientName,@Gender,@DOB,@ContactNumber,@RCHID,@company_code,@address_1,'','','','','',0,'','','',''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const PaymentModeSearchCreteria = async (req, res) => {
  const { PaymentModeID, PaymentMode, Description, Status, company_code } =
    req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("PaymentModeID", sql.Int, PaymentModeID)
      .input("PaymentMode", sql.NVarChar, PaymentMode)
      .input("Description", sql.NVarChar, Description)
      .input("Status", sql.NVarChar, Status)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_HMS_PaymentMode @mode,@PaymentModeID,@PaymentMode,@Description,@Status,@company_code,'','','',''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code ended by pavun on 11-08-25

const getDoctorSearchdata = async (req, res) => {
  const { DoctorID, DoctorName, Specialization, ContactNumber, Status, company_code,} = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("DoctorID", sql.NVarChar, DoctorID)
      .input("DoctorName", sql.NVarChar, DoctorName)
      .input("Specialization", sql.NVarChar, Specialization)
      .input("ContactNumber", sql.NVarChar, ContactNumber)
      .input("Status", sql.VarChar, Status)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_HMS_DoctorMaster @mode,@DoctorID,@DoctorName,@Specialization,@ContactNumber,@Status,@company_code,'','','','','','','','','',''`,
      );

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getClientSearchdata = async (req, res) => {
  const { ClientID, ClientName, ContactPerson, ContactNumber, AgreementType, company_code, address_1,} = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("ClientID", sql.VarChar, ClientID)
      .input("ClientName", sql.NVarChar, ClientName)
      .input("ContactPerson", sql.NVarChar, ContactPerson)
      .input("ContactNumber", sql.NVarChar, ContactNumber)
      .input("AgreementType", sql.NVarChar, AgreementType)
      .input("company_code", sql.NVarChar, company_code)
      .input("address_1", sql.NVarChar, address_1)
      .query(
        `EXEC sp_HMS_ClientMaster @mode,@ClientID,@ClientName,@ContactPerson,@ContactNumber,@AgreementType,@company_code,@address_1,'','','','','','','','',''`,
      );

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//code by balaji - 11/08/2025

const HMS_DoctorMasterUpdate2 = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).send("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase(dbConfig);

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U") // Insert mode
        .input("DoctorID", sql.VarChar, updatedRow.DoctorID)
        .input("DoctorName", sql.NVarChar, updatedRow.DoctorName)
        .input("Specialization", sql.NVarChar, updatedRow.Specialization)
        .input("ContactNumber", sql.NVarChar, updatedRow.ContactNumber)
        .input("Status", sql.NVarChar, updatedRow.Status)
        .input("address_1", sql.NVarChar, updatedRow.address_1)
        .input("address_2", sql.NVarChar, updatedRow.address_2)
        .input("address_3", sql.NVarChar, updatedRow.address_3)
        .input("city", sql.NVarChar, updatedRow.city)
        .input("state", sql.NVarChar, updatedRow.state)
        .input("country", sql.NVarChar, updatedRow.country)
        .input("Modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .query(`EXEC sp_HMS_DoctorMaster @mode, @DoctorID, @DoctorName, @Specialization, @ContactNumber, @Status, @company_code,
        @address_1, @address_2, @address_3, @city, @state, @country, '', '', @Modified_by, ''`);
    }
    res.status(200).json("Edited data saved successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  } finally {
    connection.closeDatabaseConnection();
  }
};

const HMS_ClientMasterUpdate2 = async (req, res) => {
  try {
    // Ensure editedData exists
    let editedData = req.body.editedData;
    if (!Array.isArray(editedData)) {
      editedData = [editedData]; // wrap single object into an array
    }

    const pool = await connection.connectToDatabase(dbConfig);

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("ClientID", sql.VarChar, updatedRow.ClientID)
        .input("ClientName", sql.NVarChar, updatedRow.ClientName)
        .input("ContactPerson", sql.NVarChar, updatedRow.ContactPerson)
        .input("ContactNumber", sql.NVarChar, updatedRow.ContactNumber)
        .input("AgreementType", sql.NVarChar, updatedRow.AgreementType)
        .input("company_code", sql.NVarChar, updatedRow.company_code)
        .input("address_1", sql.NVarChar, updatedRow.address_1)
        .input("address_2", sql.NVarChar, updatedRow.address_2)
        .input("address_3", sql.NVarChar, updatedRow.address_3)
        .input("city", sql.NVarChar, updatedRow.city)
        .input("state", sql.NVarChar, updatedRow.state)
        .input("country", sql.NVarChar, updatedRow.country)
        .input("Modified_by", sql.NVarChar, updatedRow.Modified_by)
        .input("Modified_date", sql.NVarChar, updatedRow.Modified_date)
        .query(`EXEC sp_HMS_ClientMaster @mode, @ClientID, @ClientName, @ContactPerson, @ContactNumber, @AgreementType, @company_code,
            @address_1, @address_2, @address_3, @city, @state, @country, '', '', @Modified_by, @Modified_date`);
    }

    res.status(200).json("Edited data saved successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  } finally {
    connection.closeDatabaseConnection();
  }
};

//Code added by pavun on 12-08-25
const getPatientName = async (req, res) => {
  const { PatientID, company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GP")
      .input("PatientID", sql.VarChar, PatientID)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_HMS_PatientMaster @mode,@PatientID,'','','','','',@company_code,'','','','','','',0,'','','',''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getClientName = async (req, res) => {
  const { ClientID, company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GC")
      .input("ClientID", sql.VarChar, ClientID)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_HMS_ClientMaster @mode,@ClientID,'','','','',@company_code,'','','','','','','','','',''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getDoctorName = async (req, res) => {
  const { DoctorID, company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GD")
      .input("DoctorID", sql.VarChar, DoctorID)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_HMS_DoctorMaster @mode,@DoctorID,'','','','',@company_code,'','','','','','','','','',''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getServiceDetail = async (req, res) => {
  const { ServiceID, company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GS")
      .input("ServiceID", sql.NVarChar, ServiceID)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC [sp_HMS_Service] @mode,@ServiceID,'','','',0,'','',@company_code,'','','',''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by pavun on 12-08-25

// Code Added/Improved by Harish on 12/08/25
const TotalPatients = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "TP")
      .input("company_code", sql.NVarChar, company_code)
      .query(`EXEC sp_HMS_dashboard @mode,@company_code,'',''`);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const TotalDiscount = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "TD")
      .input("company_code", sql.NVarChar, company_code)
      .query(`EXEC sp_HMS_dashboard @mode,@company_code,'',''`);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const TotalIncome = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "TI")
      .input("company_code", sql.NVarChar, company_code)
      .query(`EXEC sp_HMS_dashboard @mode,@company_code,'',''`);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const NumberofPatients = async (req, res) => {
  const { company_code, StartDate, EndDate } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "NP")
      .input("company_code", sql.NVarChar, company_code)
      .input("StartDate", sql.Date, StartDate)
      .input("EndDate", sql.Date, EndDate)
      .query(`EXEC sp_HMS_dashboard @mode,@company_code,@StartDate,@EndDate`);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const NumberofService = async (req, res) => {
  const { company_code, StartDate, EndDate } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "NS")
      .input("company_code", sql.NVarChar, company_code)
      .input("StartDate", sql.Date, StartDate)
      .input("EndDate", sql.Date, EndDate)
      .query(`EXEC sp_HMS_dashboard @mode,@company_code,@StartDate,@EndDate`);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const TotalGender = async (req, res) => {
  const { company_code, StartDate, EndDate } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "MF")
      .input("company_code", sql.NVarChar, company_code)
      .input("StartDate", sql.Date, StartDate)
      .input("EndDate", sql.Date, EndDate)
      .query(`EXEC sp_HMS_dashboard @mode,@company_code,@StartDate,@EndDate`);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
// Code Ended by Harish on 12/08/25

//Code added on balaji on 12-08-25
const PatientSearchUpdate2 = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).send("Invalid or empty editedData array.");
    return;
  }
  try {
    const pool = await connection.connectToDatabase(dbConfig);

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("PatientID", sql.VarChar, updatedRow.PatientID)
        .input("PatientName", sql.NVarChar, updatedRow.PatientName)
        .input("Gender", sql.NVarChar, updatedRow.Gender)
        .input("DOB", sql.NVarChar, updatedRow.DOB)
        .input("ContactNumber", sql.NVarChar, updatedRow.ContactNumber)
        .input("RCHID", sql.NVarChar, updatedRow.RCHID)
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .input("address_1", sql.NVarChar, updatedRow.address_1)
        .input("address_2", sql.NVarChar, updatedRow.address_2)
        .input("address_3", sql.NVarChar, updatedRow.address_3)
        .input("city", sql.NVarChar, updatedRow.city)
        .input("state", sql.NVarChar, updatedRow.state)
        .input("country", sql.NVarChar, updatedRow.country)
        .input("age", sql.Int, updatedRow.age)
        .input("Modified_by", sql.NVarChar, req.headers["modified-by"])
        .query(`EXEC sp_HMS_PatientMaster @mode,@PatientID,@PatientName,@Gender,@DOB,@ContactNumber,@RCHID,@company_code,
        @address_1, @address_2, @address_3, @city, @state, @country, @age,'','',@Modified_by,''`);
    }

    res.status(200).json("Edited data saved successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  } finally {
    connection.closeDatabaseConnection();
  }
};
//Code ended on 12-08-25

//code added by pavun on 14-08-25
const updateServiceGrid = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).send("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("ServiceID", sql.NVarChar, updatedRow.ServiceID)
        .input("Code", sql.NVarChar, updatedRow.Code)
        .input("ServiceName", sql.NVarChar, updatedRow.ServiceName)
        .input("Department", sql.NVarChar, updatedRow.Department)
        .input("Rate", sql.Decimal(18, 2), updatedRow.Rate)
        .input("TaxApplicable", sql.Bit, updatedRow.TaxApplicable)
        .input("Status", sql.NVarChar, updatedRow.Status)
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .query(
          `EXEC sp_HMS_Service @mode, @ServiceID, @Code, @ServiceName, @Department, @Rate, @TaxApplicable, @Status, @company_code, '', '', @modified_by, ''`,
        );
    }

    res.status(200).send("Updated data saved successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message || "Internal Server Error");
  }
};

const deleteServiceGrid = async (req, res) => {
  const keyfieldsToDelete = req.body.ServiceID;

  try {
    const pool = await connection.connectToDatabase();

    for (const ServiceID of keyfieldsToDelete) {
      try {
        await pool
          .request()
          .input("mode", sql.NVarChar, "D")
          .input("ServiceID", sql.NVarChar, ServiceID)
          .input("company_code", sql.NVarChar, req.headers["Company_code"])
          .query(
            `EXEC sp_HMS_Service @mode, @ServiceID, '', '', '', 0, 0, '', @company_code, '', '', '', ''`,
          );
      } catch (err) {
        console.error("Error inserting data:", err);
        res.status(500).send(err.message || "Internal Server Error");
      }
    }
    res.status(200).send("District mapping deleted successfully");
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).send(err.message || "Internal Server Error");
  }
};
//code ended by pavun on 14-08-25

//Code added by pavun on 20-08-25
const getWeeks = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Weeks','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getDays = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Days','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getMaritalStatus = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'MaritalStatus ','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by pavun on 20-08-25

//Code added by harish on 20-08-25
const ANC_Mothers_ScanInsert = async (req, res) => {
  const { DateOfProcedure, FormFSlNo, Name, Address, Age, Reference_ID, Types_of_Scan, MaritalStatus, MobileNumber, RCHId, No_Of_Children_Male_Female, ReferredBy,
    ScanImpression_Weeks, ScanImpression_Days, LMP, MTPAdvice, Price, created_by, company_code, ReferredTo, PatientID, Gender,} = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("DateOfProcedure", sql.Date, DateOfProcedure)
      .input("FormFSlNo", sql.NVarChar, FormFSlNo)
      .input("Name", sql.NVarChar, Name)
      .input("Address", sql.NVarChar, Address)
      .input("Age", sql.Int, Age)
      .input("MaritalStatus", sql.NVarChar, MaritalStatus)
      .input("MobileNumber", sql.NVarChar, MobileNumber)
      .input("RCHId", sql.NVarChar, RCHId)
      .input("No_Of_Children_Male_Female",sql.NVarChar,No_Of_Children_Male_Female,)
      .input("ReferredBy", sql.NVarChar, ReferredBy)
      .input("ScanImpression_Weeks", sql.NVarChar, ScanImpression_Weeks)
      .input("ScanImpression_Days", sql.NVarChar, ScanImpression_Days)
      .input("LMP", sql.Date, LMP ? new Date(LMP) : null)
      .input("MTPAdvice", sql.NVarChar, MTPAdvice)
      .input("Reference_ID", sql.NVarChar, Reference_ID)
      .input("Types_of_Scan", sql.NVarChar, Types_of_Scan)
      .input("ReferredTo", sql.NVarChar, ReferredTo)
      .input("PatientID", sql.NVarChar, PatientID)
      .input("Price", sql.Decimal(18, 2), Price)
      .input("Gender", sql.NVarChar, Gender)
      .input("company_code", sql.NVarChar, company_code)
      .input("created_by", sql.NVarChar, created_by)
      .query(`EXEC sp_ANC_Mother_Scan @mode, 0 , @DateOfProcedure , @FormFSlNo , @Name, @Address, @Age , @MaritalStatus , @MobileNumber , @RCHId , @No_Of_Children_Male_Female, @ReferredBy , @ScanImpression_Weeks, @ScanImpression_Days, @LMP , @MTPAdvice ,@Reference_ID,@Types_of_Scan, @ReferredTo, @PatientID, @Price, @Gender, @created_by, 
      '', '', '', @company_code,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    }
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const GetSearchANC = async (req, res) => {
  const { SNo, FromDate, ToDate, company_code, FormFSlNo, Name, Address, Age, Types_of_Scan, MaritalStatus, MobileNumber, RCHId, No_Of_Children_Male_Female, ReferredBy, ScanImpression_Weeks, ScanImpression_Days,
    LMP, MTPAdvice, ReferredTo, PatientID, Price, Gender,} = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("SNo", sql.Int, SNo)
      .input("FormFSlNo", sql.NVarChar, FormFSlNo)
      .input("Name", sql.NVarChar, Name)
      .input("Address", sql.NVarChar, Address)
      .input("Age", sql.Int, Age)
      .input("MaritalStatus", sql.NVarChar, MaritalStatus)
      .input("MobileNumber", sql.NVarChar, MobileNumber)
      .input("RCHId", sql.NVarChar, RCHId)
      .input("No_Of_Children_Male_Female", sql.NVarChar, No_Of_Children_Male_Female,)
      .input("ReferredBy", sql.NVarChar, ReferredBy)
      .input("ScanImpression_Weeks", sql.NVarChar, ScanImpression_Weeks)
      .input("ScanImpression_Days", sql.NVarChar, ScanImpression_Days)
      .input("LMP", sql.NVarChar, LMP)
      .input("MTPAdvice", sql.NVarChar, MTPAdvice)
      .input("Types_of_Scan", sql.NVarChar, Types_of_Scan)
      .input("ReferredTo", sql.NVarChar, ReferredTo)
      .input("PatientID", sql.NVarChar, PatientID)
      .input("Price", sql.Decimal(18, 2), Price)
      .input("company_code", sql.NVarChar, company_code)
      .input("FromDate", sql.NVarChar, FromDate)
      .input("ToDate", sql.NVarChar, ToDate)
      .input("Gender", sql.NVarChar, Gender)
      .query(`EXEC sp_ANC_Mother_Scan @mode,@SNo,'',@FormFSlNo, @Name, @Address, @Age, @MaritalStatus, @MobileNumber, @RCHId, @No_Of_Children_Male_Female, @ReferredBy, 
        @ScanImpression_Weeks, @ScanImpression_Days, @LMP, @MTPAdvice, '', @Types_of_Scan, @ReferredTo, @PatientID,@Price,@Gender,'','','','', @company_code,
        @FromDate,@ToDate,NULL,NULL,NULL,NULL,NULL,NULL`);
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const ANC_Baby_ScanLoopUpdate = async (req, res) => {
  const ANC_Baby_ScanData = req.body.ANC_Baby_ScanData;

  if (!ANC_Baby_ScanData || !ANC_Baby_ScanData.length) {
    res.status(400).send("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await sql.connect(dbConfig);
    for (const updatedRow of ANC_Baby_ScanData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("SNo", updatedRow.SNo)
        .input("DateOfProcedure", updatedRow.DateOfProcedure)
        .input("FormFSlNo", updatedRow.FormFSlNo)
        .input("Name", updatedRow.Name)
        .input("Address", updatedRow.Address)
        .input("Age", updatedRow.Age)
        .input("MaritalStatus", updatedRow.MaritalStatus)
        .input("MobileNumber", updatedRow.MobileNumber)
        .input("RCHId", updatedRow.RCHId)
        .input("No_Of_Children_Male_Female", updatedRow.No_Of_Children_Male_Female,)
        .input("ReferredBy", updatedRow.ReferredBy)
        .input("ScanImpression_Weeks", updatedRow.ScanImpression_Weeks)
        .input("ScanImpression_Days", updatedRow.ScanImpression_Days)
        .input("LMP", updatedRow.LMP)
        .input("MTPAdvice", updatedRow.MTPAdvice)
        .input("Reference_ID", updatedRow.Reference_ID)
        .input("Types_of_Scan", updatedRow.Types_of_Scan)
        .input("ReferredTo", updatedRow.ReferredTo)
        .input("PatientID", updatedRow.PatientID)
        .input("Price", updatedRow.Price)
        .input("Gender", updatedRow.Gender)
        .input("modified_by", sql.NVarChar, req.headers["modified_by"])
        .input("modified_date", updatedRow.modified_date)
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .query(`EXEC sp_ANC_Mother_Scan @mode, @SNo , @DateOfProcedure , @FormFSlNo , @Name, @Address, @Age , @MaritalStatus , @MobileNumber , @RCHId , 
          @No_Of_Children_Male_Female, @ReferredBy,@ScanImpression_Weeks, @ScanImpression_Days, @LMP , @MTPAdvice ,@Reference_ID,@Types_of_Scan,@ReferredTo,
          @PatientID, @Price, @Gender, '','',@modified_by, '', @company_code,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);
    }
    res.status(200).json("ANC_Baby_Scan data updated successfully");
  } catch (err) {
    console.error("Error in ANC_Baby_ScanLoopUpdate:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const ANC_Baby_ScanLoopDelete = async (req, res) => {
  const ANC_Baby_ScanData = req.body.ANC_Baby_ScanData;

  if (!ANC_Baby_ScanData || !ANC_Baby_ScanData.length) {
    return res.status(400).json("Invalid or empty ANC_Baby_ScanData array.");
  }

  try {
    const pool = await sql.connect(dbConfig);
    for (const deletedRow of ANC_Baby_ScanData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "D")
        .input("SNo", deletedRow.SNo)
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .query(
          `EXEC sp_ANC_Mother_Scan @mode, @SNo,'','','','',0, '' ,'' ,'' ,'','','','','','','','','','',0,'','','','','', @company_code,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
        );
    }
    res.status(200).json("ANC_Baby_Scan data deleted successfully");
  } catch (err) {
    console.error("Error in ANC_Baby_ScanLoopDelete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const ANC_Mother_ScanUpdate = async (req, res) => {
  const { SNo, DateOfProcedure, FormFSlNo, Name, Address, Age, MaritalStatus, Reference_ID, Types_of_Scan, MobileNumber, RCHId, No_Of_Children_Male_Female, ReferredBy, ScanImpression_Weeks,
    ScanImpression_Days, LMP, MTPAdvice, modified_by, modified_date, company_code, Gender,} = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("SNo", sql.Int, SNo)
      .input("DateOfProcedure ", sql.Date, DateOfProcedure)
      .input("FormFSlNo ", sql.NVarChar, FormFSlNo)
      .input("Name", sql.NVarChar, Name)
      .input("Address", sql.NVarChar, Address)
      .input("Age", sql.Int, Age)
      .input("MaritalStatus", sql.NVarChar, MaritalStatus)
      .input("MobileNumber ", sql.NVarChar, MobileNumber)
      .input("RCHId", sql.NVarChar, RCHId)
      .input("No_Of_Children_Male_Female", sql.NVarChar, No_Of_Children_Male_Female,)
      .input("ReferredBy ", sql.NVarChar, ReferredBy)
      .input("ScanImpression_Weeks", sql.NVarChar, ScanImpression_Weeks)
      .input("ScanImpression_Days", sql.NVarChar, ScanImpression_Days)
      .input("LMP", sql.Date, LMP)
      .input("MTPAdvice", sql.NVarChar, MTPAdvice)
      .input("Reference_ID	", sql.NVarChar, Reference_ID)
      .input("Types_of_Scan", sql.NVarChar, Types_of_Scan)
      .input("Gender", sql.NVarChar, Gender)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("modified_date", sql.Date, modified_date)
      .input("company_code", sql.NVarChar, company_code)
      .query(`EXEC sp_ANC_Mother_Scan  @mode, @SNo , @DateOfProcedure , @FormFSlNo , @Name, @Address, @Age , @MaritalStatus , @MobileNumber , @RCHId , 
        @No_Of_Children_Male_Female,@ReferredBy,@ScanImpression_Weeks, @ScanImpression_Days, @LMP , @MTPAdvice @Reference_ID,@Types_of_Scan, '','',0,@Gender,'','', 
        @modified_by, @modified_date, @company_code`);
    res
      .status(200)
      .json({ success: true, message: "Data updated successfully" });
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const GetExcelMother_Scan = async (req, res) => {
  const { SNo, FromDate, ToDate, company_code, FormFSlNo, Name, Address, Age, Types_of_Scan, MaritalStatus, MobileNumber, RCHId, No_Of_Children_Male_Female, ReferredBy, ScanImpression_Weeks, ScanImpression_Days,
    LMP, MTPAdvice, ReferredTo, PatientID, Price, Gender,} = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "FA")
      .input("SNo", sql.Int, SNo)
      .input("FormFSlNo", sql.NVarChar, FormFSlNo)
      .input("Name", sql.NVarChar, Name)
      .input("Address", sql.NVarChar, Address)
      .input("Age", sql.Int, Age)
      .input("MaritalStatus", sql.NVarChar, MaritalStatus)
      .input("MobileNumber", sql.NVarChar, MobileNumber)
      .input("RCHId", sql.NVarChar, RCHId)
      .input("No_Of_Children_Male_Female", sql.NVarChar, No_Of_Children_Male_Female,)
      .input("ReferredBy", sql.NVarChar, ReferredBy)
      .input("ScanImpression_Weeks", sql.NVarChar, ScanImpression_Weeks)
      .input("ScanImpression_Days", sql.NVarChar, ScanImpression_Days)
      .input("LMP", sql.NVarChar, LMP)
      .input("MTPAdvice", sql.NVarChar, MTPAdvice)
      .input("Types_of_Scan", sql.NVarChar, Types_of_Scan)
      .input("ReferredTo", sql.NVarChar, ReferredTo)
      .input("PatientID", sql.NVarChar, PatientID)
      .input("Price", sql.Decimal(18, 2), Price)
      .input("company_code", sql.NVarChar, company_code)
      .input("FromDate", sql.NVarChar, FromDate)
      .input("ToDate", sql.NVarChar, ToDate)
      .input("Gender", sql.NVarChar, Gender)
      .query(`EXEC sp_ANC_Mother_Scan @mode,@SNo,'',@FormFSlNo, @Name, @Address, @Age, @MaritalStatus, @MobileNumber, @RCHId, @No_Of_Children_Male_Female, @ReferredBy, 
        @ScanImpression_Weeks, @ScanImpression_Days, @LMP, @MTPAdvice, '', @Types_of_Scan, @ReferredTo, @PatientID,@Price,@Gender,'','','','', @company_code,
        @FromDate,@ToDate,NULL,NULL,NULL,NULL,NULL,NULL`);
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code ended by harish on 20-08-25

//Code added by pavun on 21-08-25
const getTransactionType = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Transaction','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//code ended by pavun on 21-08-25

//Code added by pavun on 22-08-25
const GetBillingReport = async (req, res) => {
  const { BillNo, PatientName, StartDate, EndDate, company_code } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "TPR")
      .input("BillNo", sql.Int, BillNo)
      .input("PatientName", sql.NVarChar, PatientName)
      .input("company_code", sql.NVarChar, company_code)
      .input("StartDate", sql.NVarChar, StartDate)
      .input("EndDate", sql.NVarChar, EndDate)
      .query(
        `EXEC sp_HMS_Report @mode,'','',@BillNo,@PatientName,@company_code,@StartDate,@EndDate`,
      );
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//code ended by pavun on 22-08-25

//Code added by pavun on 23-08-25
const GetGenderReport = async (req, res) => {
  const { Gender, StartDate, EndDate, company_code } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "TG")
      .input("Gender", sql.NVarChar, Gender)
      .input("company_code", sql.NVarChar, company_code)
      .input("StartDate", sql.NVarChar, StartDate)
      .input("EndDate", sql.NVarChar, EndDate)
      .query(
        `EXEC sp_HMS_Report @mode,'',@Gender,0,'',@company_code,@StartDate,@EndDate`,
      );
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by pavun on 23-08-25

//code added by mathu- 23-08-2025
const GetServiceReport = async (req, res) => {
  const { ServiceID, StartDate, EndDate, company_code } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "TSR")
      .input("ServiceID", sql.NVarChar, ServiceID)
      .input("company_code", sql.NVarChar, company_code)
      .input("StartDate", sql.NVarChar, StartDate)
      .input("EndDate", sql.NVarChar, EndDate)
      .query(
        `EXEC sp_HMS_Report @mode,@ServiceID,'',0,'',@company_code,@StartDate,@EndDate`,
      );
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const GetServiceName = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SN")
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC [sp_HMS_Service] @mode,'','','','',0,'','',@company_code,'','','','' `,
      );
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//codeended by mathu- 23-08-2025

//Code added by pavun on 13-09-25
const getDoctorDropdown = async (req, res) => {
  const { company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "DD")
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_HMS_DoctorMaster @mode,'','','','','',@company_code,'','','','','','','','','',''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by pavun on 13-09-25

//code added by sakthi on 08-10-26
const getUserPermission = async (req, res) => {
  const { role_id } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "UP")
      .input("role_id", sql.NVarChar, role_id)
      .query(`EXEC sp_rolescreen_mapping @mode,'',@role_id,'','','','','',null,null,null,null,null,null,null,null
  `);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};

const adduserscreenmap = async (req, res) => {
  const { company_code, role_id, screen_type, permission_type, created_by, modified_by, tempstr1, tempstr2,
     tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4, } = req.body;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("role_id", sql.VarChar, role_id)
      .input("screen_type", sql.NVarChar, screen_type)
      .input("permission_type", sql.VarChar, permission_type)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(
        `EXEC sp_rolescreen_mapping @mode, @company_code,@role_id, @screen_type,@permission_type,'',@created_by,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);
    res.json({ success: true, message: "Data inserted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};

const getAlluserscreenmap = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query(`EXEC sp_rolescreen_mapping 'A','','','','','','','',
                                      null,null,null,null,null,null,null,null `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};

const saveEditeduserscreenmap = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("company_code", updatedRow.company_code)
        .input("role_id", updatedRow.role_id)
        .input("screen_type", updatedRow.screen_type)
        .input("permission_type", updatedRow.permission_type)
        .input("keyfield", updatedRow.keyfield)
        .input("modified_by", sql.NVarChar, req.headers['modified-by'])
        .input("tempstr1", updatedRow.tempstr1)
        .input("tempstr2", updatedRow.tempstr2)
        .input("tempstr3", updatedRow.tempstr3)
        .input("tempstr4", updatedRow.tempstr4)
        .input("datetime1", updatedRow.datetime1)
        .input("datetime2", updatedRow.datetime2)
        .input("datetime3", updatedRow.datetime3)
        .input("datetime4", updatedRow.datetime4)
        .query(`EXEC sp_rolescreen_mapping @mode,@company_code, @role_id, @screen_type, @permission_type, @keyfield,'', @modified_by,  
        @tempstr1, @tempstr2, @tempstr3, @tempstr4, @datetime1, @datetime2, @datetime3, @datetime4`);
    }

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};

const userscreenmapdeleteData = async (req, res) => {
  const keyfieldsToDelete = req.body.keyfield;

  // if (!keyfieldsToDelete || !keyfieldsToDelete.length) {
  //   res.status(400).json("Invalid or empty company_nos array.");
  //   return;
  // }

  try {
    const pool = await connection.connectToDatabase();

    for (const keyfield of keyfieldsToDelete) {
      try {
        await pool.request().input("keyfield", keyfield)
          .input("modified_by", sql.NVarChar, req.headers['modified-by'])
          .query(`EXEC sp_rolescreen_mapping 'D','','','','',@keyfield,'',@modified_by,null,null,null,null,null,null,null,null`);
      } catch (error) {
        if (error.number === 50000) {
          // Foreign key constraint violation
          res.status(400).json("The user rights cannot be deleted due to a link with another record");
          return;
        } else {
          throw error; // Rethrow other SQL errors
        }
      }
    }

    res.status(200).json("User screen mapping deleted successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};

const getuserscreensearchdata = async (req, res) => {
  const { company_code, role_id, screen_type, permission_type } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.VarChar, company_code)
      .input("role_id", sql.VarChar, role_id)
      .input("screen_type", sql.NVarChar, screen_type)
      .input("permission_type", sql.NVarChar, permission_type)
      .query(`EXEC sp_rolescreen_mapping @mode,@company_code,@role_id,@screen_type,@permission_type,'','','',
      null,null,null,null,null,null,null,null`);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};

const updateRoleRights = async (req, res) => {
  const { company_code, role_id, screen_type, permission_type, keyfield, modified_by } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("company_code", sql.VarChar, company_code)
      .input("role_id", sql.VarChar, role_id)
      .input("screen_type", sql.NVarChar, screen_type)
      .input("permission_type", sql.VarChar, permission_type)
      .input("keyfield", sql.VarChar, keyfield)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_rolescreen_mapping @mode,@company_code, @role_id, @screen_type, @permission_type, @keyfield,'', @modified_by,  
               NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL`)
    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};

const getDefaultScreens = async (req, res) => {
  const { role_id, company_code, Location_Code } = req.body;

  try {
    const pool = await connection.connectToDatabase();

    const result = await pool.request()
      .input("mode", sql.VarChar, "GDS")
      .input("role_id", sql.VarChar, role_id)
      .input("company_code", sql.VarChar, company_code)
      .input("Location_Code", sql.VarChar, Location_Code)
      .query(`EXEC sp_UserSettings @mode, '', '', @company_code, @Location_Code, '', '', '', @role_id, '', '', '', '' `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching default screens:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const userSettingsInsert = async (req, res) => {
  const { User_Code, Status, company_code, Location_Code, DefaultCompanyId, DefaultScreenId, role_id, created_by, } = req.body;

  try {
    const pool = await sql.connect(dbConfig);

    await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("User_Code", sql.NVarChar, User_Code)
      .input("Status", sql.NVarChar, Status)
      .input("company_code", sql.NVarChar, company_code)
      .input("Location_Code", sql.NVarChar, Location_Code)
      .input("keyfield", sql.NVarChar, company_code)
      .input("DefaultCompanyId", sql.NVarChar, DefaultCompanyId)
      .input("DefaultScreenId", sql.NVarChar, DefaultScreenId)
      .input("role_id", sql.NVarChar, role_id)
      .input("created_by", sql.NVarChar, created_by)
      .query(` EXEC sp_UserSettings @mode, @User_Code, @Status, @company_code, @Location_Code, @keyfield, 
        @DefaultCompanyId, @DefaultScreenId, @role_id, @created_by, '', '', '' `);

    res.status(200).json({
      success: true,
      message: "User Settings saved successfully",
    });
  } catch (err) {
    console.error("Error during User Settings insert:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

const getUserSettings = async (req, res) => {
  const { User_Code, company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "S")
      .input("company_code", sql.NVarChar, company_code)
      .input("User_Code", sql.NVarChar, User_Code)
      .query(` EXEC sp_UserSettings @mode, @User_Code, '', @company_code, '', '', '', '', '', '', '', '', '' `);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }
  } catch (err) {
    console.error("Error getting User Settings:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

const getDefaultUserCompany = async (req, res) => {
  const { user_code } = req.body;

  try {
    const pool = await connection.connectToDatabase();

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "UCLD")
      .input("user_code", sql.NVarChar, user_code)
      .query(` EXEC sp_user_company_mapping @mode, '', @user_code, '', '', '', 0, '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL `);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json({ message: "Default company not found" });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//code ended by sakthi on 08-10-26


module.exports = {
  login,
  forgetPassword,
  signUp,
  verifyOtp,
  getvariant,
  getuom,
  getCity,
  getCountry,
  getState,
  getStatus,
  getTransaction,
  getGender,
  getLoginorout,
  getAllData,
  addData,
  userAddData,
  getAlluserData,
  getAllWareHouseData,
  getAllRoleInfoData,
  AddRoleInfoData,
  RolesaveEditedData,
  saveEditedData,
  deleteData,
  UserdeleteData,
  UsersaveEditedData,
  getAllattributehdrData,
  addattrihdrData,
  getAllattributedetData,
  addattridetData,
  updattridetData,
  deleteAttriDetailData,
  gethdrcode,
  getDeletepermission,
  getregisterbrand,
  getourbrand,
  getsearchdata,
  getUsercode,
  getUsertype,
  getCompanyno,
  getLocationno,
  getAllCompanyMappingData,
  addCompanyMappingData,
  getPaytype,
  getPurchasetype,
  getSalestype,
  getordertype,
  getroleid,
  getAllUserRoleMappingData,
  addUserRoleMappingData,
  getlocationsearchdata,
  addlocationinfo,
  locationsaveEditedData,
  locationdeleteData,
  getUserrolesearchdata,
  getUsersearchdata,
  getRolesearchdata,
  roledeleteData,
  getcompanymappingsearchdata,
  getattributeSearchdata,
  gettranstype,
  getscreentype,
  Passwords,
  getusercompany,
  updcompanymapping,
  commappingdeleteData,
  getScreens,
  getPermissions,
  facereg,
  getacctype,
  getofftype,
  getItem,
  RollMappingDelete,
  updateRoleMapping,
  getUserRole,
  UpdateUserImage,
  getInventoryTransaction,
  getEmptype,
  getCondition,
  LocationUpdate,
  CompanyUpdate,
  UpdateCompanyImage,
  RoleUpdate,
  UserUpdate,
  CompanyMappingUpdate,
  RoleMappingUpdate,
  AttributeUpdate,
  getEvent,
  getsiblings,
  getkids,
  getMartial,
  getSalaryType,
  getPayscale,
  getLoanID,
  getShift,
  getDocumentType,
  getrelation,
  getannoncementtype,
  getAnnouncementDetail,
  getAnnouncement_Msg,
  getAnnouncement,
  getcompanyshift,
  getOverallTAX,
  getInvocieType,
  TermsDC,
  TermsQO,
  TermsPO,
  TermsTI,
  getLeaveType,
  getSelectSlot,
  getDashBoardType,
  getGST,
  getPartyName,
  getGSTReport,
  getType,
  getAccrual,
  getExceedLeave,
  getLeaveReason,
  getPendingStatus,
  getdefCustomer,
  getSalesMode,
  getPurchaseAnalysis,
  getTaskstatus,
  getPriority,
  PendingCustomer,
  getPriority,
  Userdropdown,
  getAnnouncementDuration,
  getboolean,
  savePDFToPath,
  sendPayslipEmails,
  getDocument,
  sendAutoMail,
  termsandCondition,
  getLockType,
  getPrint,
  getcopies,
  WeekOff,
  GenerateEmployee,
  getLeaveStatus,
  HMS_PaymentModeInsert,
  HMS_PaymentModeUpdate,
  HMS_PaymentModeDelete,
  HMS_ServiceInsert,
  HMS_ServiceUpdate,
  HMS_ServiceDelete,
  HMS_BillHeaderInsert,
  HMS_BillHeaderUpdate,
  HMS_BillHeaderDelete,
  HMS_BillDetailsInsert,
  HMS_BillDetailsUpdate,
  HMS_BillDetailsDelete,
  PatientMasterInsert,
  PatientMasterUpdate,
  PatientMasterDelete,
  HMS_DoctorMasterInsert,
  HMS_DoctorMasterUpdate,
  HMS_DoctorMasterDelete,
  HMS_ClientMasterInsert,
  HMS_ClientMasterUpdate,
  HMS_ClientMasterDelete,
  ServiceSearchCreteria,
  BillHdrSearchCreteria,
  getBillingHeader,
  getBillingDetail,
  getBillingGetData,
  // BillingDeleteDetailData,
  // BillingDeleteHDRData,
  PatientSearchCreteria,
  PaymentModeSearchCreteria,
  getTaxApplicable,
  getDoctorSearchdata,
  HMS_DoctorMasterUpdate2,
  getClientSearchdata,
  HMS_ClientMasterUpdate2,
  getPatientName,
  getClientName,
  getDoctorName,
  getServiceDetail,
  PatientSearchUpdate2,
  TotalPatients,
  TotalDiscount,
  TotalIncome,
  NumberofPatients,
  NumberofService,
  TotalGender,
  updateServiceGrid,
  deleteServiceGrid,
  getWeeks,
  getDays,
  getMaritalStatus,
  ANC_Mothers_ScanInsert,
  GetSearchANC,
  ANC_Baby_ScanLoopUpdate,
  ANC_Baby_ScanLoopDelete,
  ANC_Mother_ScanUpdate,
  GetExcelMother_Scan,
  getTransactionType,
  GetBillingReport,
  GetGenderReport,
  GetServiceReport,
  GetServiceName,
  getDoctorDropdown,
  getUserPermission,
  adduserscreenmap,
  getAlluserscreenmap,
  saveEditeduserscreenmap,
  userscreenmapdeleteData,
  getuserscreensearchdata,
  updateRoleRights,
  getDefaultScreens,
  userSettingsInsert,
  getUserSettings,
  getDefaultUserCompany

};