import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, location }) => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isAgricOpen, setIsAgricOpen] = useState(false);
  const [isCarOpen, setIsCarOpen] = useState(false);
  const [isMechaOpen, setIsMechaOpen] = useState(false);
  const [isCodesOpen, setIsCodesOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const toggleServicesDropdown = () => {
    setIsServicesOpen(!isServicesOpen);
    // Close the Agriculture dropdown when opening Services dropdown
    setIsAgricOpen(false);
  };

  const toggleAgricDropdown = () => {
    setIsAgricOpen(!isAgricOpen);
    
    setIsCarOpen(false);
  };
  const toggleCarDropdown = () => {
    setIsCarOpen(!isCarOpen);
    
    setIsAgricOpen(false);
  };

  const toggleMechaDropdown = () => {
    setIsMechaOpen(!isMechaOpen);
    
    setIsAgricOpen(false);
  };
  const toggleCodesDropdown = () => {
    setIsCodesOpen(!isCodesOpen);
    
    setIsAgricOpen(false);
  };


  const toggleReportDropdown = () => {
    setIsReportOpen(!isReportOpen);
  };

  return (
    <div className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-[#f2f2f2] overflow-y-auto z-30 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Sidebar Content */}
      <ul className="py-4 font-uniquifier font-bold">
        <li className={`px-4 py-2 text-gray-700 hover:text-gray-200 ${location.pathname === '/calls' ? 'bg-green-300' : ''}`}>
          <Link to="/calls">Calls</Link>
        </li>
        <li className={`px-4 py-2 text-gray-700 hover:text-gray-200 ${location.pathname === '/whatsap' ? 'bg-green-300' : ''}`}>
          <Link to="/whatsap">Whatsapp</Link>
        </li>
        <li className={`px-4 py-2 text-gray-700 hover:text-gray-200 ${location.pathname === '/fashion' ? 'bg-green-300' : ''}`}>
          <Link to="/fashion">General</Link>
        </li>

        <li className={`px-4 py-2 text-gray-700 hover:text-black relative ${isReportOpen ? 'bg-green-300' : ''}`}>
          <span onClick={toggleReportDropdown}>Requests</span>
          {isReportOpen && (
            <ul className="absolute left-0 top-full bg-[#f2f2f2] shadow-lg py-2 rounded-md z-40">
              <li className="px-4 py-2">
                <Link to="/reqt">Password Requests</Link>
              </li>
              <li className="px-4 py-2">
                <Link to="/report">Report Alert</Link>
              </li>
              {/* <li className="px-4 py-2">
              <Link to="/shop">All Shops</Link>
              </li>
              <li className="px-4 py-2">
              <Link to="/building">All Buildings</Link>
              </li>
              <li className="px-4 py-2">
              <Link to="/quip">All Equipments</Link>
              </li>
              <li className="px-4 py-2">
              <Link to="/carrent">Car Rent</Link>
              </li>

              <li className="px-4 py-2">
              <Link to="/boostproduct">Boosted Products</Link>
              </li> */}
            </ul>
          )}
        </li>

        <li className={`px-4 py-2 text-gray-700 hover:text-black relative ${isServicesOpen ? 'bg-green-300' : ''}`}>
          <span onClick={toggleServicesDropdown}>All</span>
          {isServicesOpen && (
            <ul className="absolute left-0 top-full bg-[#f2f2f2] shadow-lg py-2 rounded-md z-40">
              <li className="px-4 py-2">
                <Link to="/services">All Services</Link>
              </li>
              <li className="px-4 py-2">
                <Link to="/servicesapproved">Approved Services</Link>
              </li>
              <li className="px-4 py-2">
              <Link to="/shop">All Shops</Link>
              </li>
              <li className="px-4 py-2">
              <Link to="/building">All Buildings</Link>
              </li>
              <li className="px-4 py-2">
              <Link to="/quip">All Equipments</Link>
              </li>
              <li className="px-4 py-2">
              <Link to="/carrent">Car Rent</Link>
              </li>

              <li className="px-4 py-2">
              <Link to="/boostproduct">Boosted Products</Link>
              </li>
            </ul>
          )}
        </li>
        <li className={`px-4 py-2 text-gray-700 hover:text-black relative ${isAgricOpen ? 'bg-green-300' : ''}`}>
          <span onClick={toggleAgricDropdown}>Agriculture</span>
          {isAgricOpen && (
            <ul className="absolute left-0 top-full bg-[#f2f2f2] shadow-lg py-2 rounded-md z-40">
              <li className="px-4 py-2">
                <Link to="/">All Agric</Link>
              </li>
              <li className="px-4 py-2">
                <Link to="/approved">Approved Agric</Link>
              </li>
            </ul>
          )}
        </li>
        <li className={`px-4 py-2 text-gray-700 hover:text-black relative ${isCarOpen ? 'bg-green-300' : ''}`}>
          <span onClick={toggleCarDropdown}>Cars</span>
          {isCarOpen && (
            <ul className="absolute left-0 top-full bg-[#f2f2f2] shadow-lg py-2 rounded-md z-40">
              <li className="px-4 py-2">
                <Link to="/cars">All Cars</Link>
              </li>
              <li className="px-4 py-2">
                <Link to="/approvedcars">Approved Cars</Link>
              </li>
              <li className="px-4 py-2">
                <Link to="/mecha">Mechanics</Link>
              </li>
            </ul>
          )}
        </li>
        <li className={`px-4 py-2 text-gray-700 hover:text-black relative ${isMechaOpen ? 'bg-green-300' : ''}`}>
          <span onClick={toggleMechaDropdown}>Mechas</span>
          {isMechaOpen && (
            <ul className="absolute left-0 top-full bg-[#f2f2f2] shadow-lg py-2 rounded-md z-40">
              <li className="px-4 py-2">
                <Link to="/mechanics">All Mechanics</Link>
              </li>
              <li className="px-4 py-2">
                <Link to="/mechanics">Approved Mechanics</Link>
              </li>
            </ul>
          )}
        </li>
      
        <li className={`px-4 py-2 text-gray-700 hover:text-gray-200 ${location.pathname === '/okada' ? 'bg-green-300' : ''}`}>
          <Link to="/okada">All Okada</Link>
        </li>
        <li className={`px-4 py-2 text-gray-700 hover:text-gray-200 ${location.pathname === '/mechanics' ? 'bg-green-300' : ''}`}>
          <Link to="/spare">Spare Parts</Link>
        </li>
        <li className={`px-4 py-2 text-gray-700 hover:text-gray-200 ${location.pathname === '/postadvert' ? 'bg-green-300' : ''}`}>
          <Link to="/postadvert">Post Advert</Link>
        </li>
        <li className={`px-4 py-2 text-gray-700 hover:text-gray-200 ${location.pathname === '/advert' ? 'bg-green-300' : ''}`}>
          <Link to="/advert">Advert Page</Link>
        </li>
        <li className={`px-4 py-2 text-gray-700 hover:text-gray-200 ${location.pathname === '/users' ? 'bg-green-300' : ''}`}>
          <Link to="/users">All Users</Link>
        </li>
        <li className={`px-4 py-2 text-gray-700 hover:text-black relative ${isCodesOpen ? 'bg-green-300' : ''}`}>
          <span onClick={toggleCodesDropdown}>Codes</span>
          {isCodesOpen && (
            <ul className="absolute left-0 top-full bg-[#f2f2f2] shadow-lg py-2 rounded-md z-40">
              <li className="px-4 py-2">
                <Link to="/airtel">AT</Link>
              </li>
              <li className="px-4 py-2">
                <Link to="/airtelcode">AT Codes</Link>
              </li>
              <li className="px-4 py-2">
                <Link to="/mtn">MTN </Link>
              </li>
              <li className="px-4 py-2">
                <Link to="/mtnpost">MTN Post</Link>
              </li>
              <li className="px-4 py-2">
                <Link to="/vodafone">Vodafone</Link>
              </li>
              <li className="px-4 py-2">
                <Link to="/vodafonepost">Vodafone Post</Link>
              </li>
              <li className="px-4 py-2">
                <Link to="/emergency">Emergency</Link>
              </li>
              <li className="px-4 py-2">
                <Link to="/emergencypost">Emergency Post</Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
