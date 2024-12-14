'use client'
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

interface UserId {
  id?: number;
}

const CloseAccount: React.FC<UserId> = ({ id }) => {
    const location = useLocation();
    const accountInfo = location.state;
    const navigate = useNavigate();
    const handleCloseAccount = async (e: React.MouseEvent<HTMLButtonElement>) => {
    let idToPass = null;
    if(id == undefined){
      idToPass = accountInfo.id;
    }
    else if(id != undefined){
      idToPass = id;
    }
    e.preventDefault(); // Prevent the default button action
    try {
      const response = await axios.post(
        "https://dyqqbfiore.execute-api.us-east-1.amazonaws.com/closeAccount/close",
        { idaccounts: idToPass },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const bodydata = JSON.parse(response.data.body);
      const message = bodydata.message;
      console.log("Parsed message:", message);
      alert(message)
      if ( message === "Account closed successfully")
      {
        navigate("/");
      }
      if(message==="Account closed successfully (no items or bids associated)"){
        navigate("/");
      }

    } catch (error) {
      console.error("Error during close account:", error);
    }
  };

  return (
    <button onClick={handleCloseAccount}>
      Close Account
    </button>
  );
};

export default CloseAccount;
