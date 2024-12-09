import React from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import logout from '../../../img/logout.png'

export default function Logout() {
  const navigate = useNavigate();

  function handleLogout() {
    secureLocalStorage.removeItem("userCredentials");
    navigate("/", { replace: true });
    window.location.reload();
  }

  return (
    <div>
      {/* <button onClick={handleLogout}>Logout</button> */}
      <img src={logout.src} onClick={handleLogout} width="30px" height="30px" className="position-absolute top-7 end-14" title="logout"/>
    </div>
  );
}
