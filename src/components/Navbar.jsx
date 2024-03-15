import React from "react";
import { Link } from "react-router-dom";
import LogsIcon from "../assets/icons/list-active.png";
import MetricsIcon from "../assets/icons/metrics.png";
import TrueFoundryLogo from "../assets/icons/truefoundry.png"; // Import True Foundry logo

const Navbar = ({ selectedScreen, setSelectedScreen }) => {
  const handleLogoClick = () => {
    
  };

  return (
    <nav className="flex justify-between items-center py-4 px-8 bg-gray-900 text-white">
      <div className="flex items-center">
        {}
        <div className="flex items-center mr-auto">
          <a href="/" onClick={handleLogoClick}>
            <img
              src={TrueFoundryLogo}
              alt="True Foundry Logo"
              className="w-50 h-10 mr-2 cursor-pointer" 
            />
          </a>
          <span className="text-lg font-bold"></span> {}
        </div>
      </div>

      {}
      <div className="flex items-center justify-center">
        <Link
          to="/logs"
          className={`mx-4 ${selectedScreen === "Logs" ? "font-bold" : ""}`}
          onClick={() => setSelectedScreen("Logs")}
        >
          <img src={LogsIcon} alt="Logs" className="w-8 h-8 mr-2" />
          Logs
        </Link>
        <Link
          to="/metrics"
          className={`mx-4 ${selectedScreen === "Metrics" ? "font-bold" : ""}`}
          onClick={() => setSelectedScreen("Metrics")}
        >
          <img src={MetricsIcon} alt="Metrics" className="w-8 h-8 mr-2" /> {}
          Metrics
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
