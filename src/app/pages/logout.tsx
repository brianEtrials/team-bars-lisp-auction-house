import React from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

export default function Logout() {
  const navigate = useNavigate();

  function handleLogout() {
    secureLocalStorage.removeItem("userCredentials");
    navigate("/", { replace: true });
    window.location.reload();
  }

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
