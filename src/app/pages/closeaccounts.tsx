import React from "react";
import axios from "axios";

interface UserId {
  id?: number;
}

const CloseAccount: React.FC<UserId> = ({ id }) => {
  const handleCloseAccount = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent the default button action
    try {
      const response = await axios.delete(
        "https://dyqqbfiore.execute-api.us-east-1.amazonaws.com/closeAccount/close",
        {
          headers: { "Content-Type": "application/json" },
          data: id,
        }
      );
      console.log(response.data);
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
