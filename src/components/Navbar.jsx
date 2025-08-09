import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/screen.png';
import Sidebar from './Sidebar';
import { FaAngleDown } from "react-icons/fa6";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [carDrop, setcarDrop] = useState(false);
  const location = useLocation();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const toggleServicesDropdown = () => {
    setIsServicesOpen(!isServicesOpen);
  };
  const toggleReportDropdown = () => {
    setIsReportOpen(!isReportOpen);
  };

  const toggleCarsDropdown = () => {
    setcarDrop(!carDrop);
  };

  return (
    <nav className="bg-[#f2f2f2] p-4 fixed w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-black flex w-7 text-xl font-bold font-serif">
          <img className='rounded-full' src={Logo} alt="logo" />
          <h1>LinkPii</h1>
        </div>

        {/* Responsive Toggle Button */}
        <button className="lg:hidden text-black focus:outline-none" onClick={toggleNavbar}>
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>

        {/* Navigation Links */}
        <ul className={`lg:flex hidden space-x-4 ${isOpen ? 'hidden' : 'lg:flex'}`}>
          <li className={`text-black hover:text-black  font-bold font-uniquifier ${location.pathname === '/calls' ? 'bg-green-300' : ''}`}>
            <Link to="/calls">Calls</Link>
          </li>
          <li className={`text-black hover:text-black  font-bold font-uniquifier ${location.pathname === '/whatsap' ? 'bg-green-300' : ''}`}>
            <Link to="/whatsap">Whatsapp</Link>
          </li>

          {/* <li className={`text-black hover:text-black  font-bold font-uniquifier ${location.pathname === '/report' ? 'bg-green-300' : ''}`}>
            <Link to="/report">Reports</Link>
          </li> */}


          <li
            className={`text-black font-bold font-uniquifier hover:text-black relative ${location.pathname.startsWith('/report') ? 'bg-green-300' : ''}`}
            onClick={toggleReportDropdown}
          >
            <span className='flex'>Requests
            <span className='pt-1' >
            <FaAngleDown  />
            </span>
            </span>
            {isReportOpen && (
              <ul className="absolute left-0 top-full bg-white shadow-lg py-2 rounded-md">
                <li className="px-4 py-2">
                <Link to="/report">Report</Link>
                </li>
                <li className="px-4 py-2">
                  <Link to="/reqt">Reset Password</Link>
                </li>
               {/*  <li className="px-4 py-2">
                  <Link to="/servicesapproved">Approved Services</Link>
                </li>
                <li className="px-4 py-2">
                  <Link to="/shop">All Shops</Link>
                </li>
                <li className="px-4 py-2">
                  <Link to="/building">Buildings</Link>
                </li>
                <li className="px-4 py-2">
                  <Link to="/carrent">Rent Cars</Link>
                </li>
                <li className="px-4 py-2">
                  <Link to="/quip">Equiments</Link>
                </li> */}
              </ul>
            )}
          </li>

         
          {/* Services dropdown */}
          <li
            className={`text-black font-bold font-uniquifier hover:text-black relative ${location.pathname.startsWith('/services') ? 'bg-green-300' : ''}`}
            onClick={toggleServicesDropdown}
          >
            <span className='flex'>All
            <span className='pt-1' >
            <FaAngleDown  />
            </span>
            </span>
            {isServicesOpen && (
              <ul className="absolute left-0 top-full bg-white shadow-lg py-2 rounded-md">
                <li className="px-4 py-2">
                <Link to="/food">Food</Link>
                </li>
                <li className="px-4 py-2">
                <Link to="/">General</Link>
                </li>

                <li className="px-4 py-2">
                <Link to="hot">Hot Products</Link>
                </li>

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
                  <Link to="/building">Buildings</Link>
                </li>
                <li className="px-4 py-2">
                  <Link to="/carrent">Rent Cars</Link>
                </li>
                <li className="px-4 py-2">
                  <Link to="/quip">Equiments</Link>
                </li>
              </ul>
            )}
          </li>



          {/* End Services dropdown */}

          {/* All Cars */}
          <li
            className={`text-black font-bold font-uniquifier hover:text-black relative ${location.pathname.startsWith('/services') ? 'bg-green-300' : ''}`}
            onClick={toggleCarsDropdown}
          >
            <span className='flex'>All CARS
            <span className='pt-1' >
            <FaAngleDown  />
            </span>
            </span>
            {carDrop && (
              <ul className="absolute left-0 top-full bg-white shadow-lg py-2 rounded-md">
                <li className="px-4 py-2">
                <Link to="/cars">All Drivers</Link>
                </li>
                <li className="px-4 py-2">
                  <Link to="/carrent">CAR Rent</Link>
                </li>
                <li className="px-4 py-2">
                <Link to="/okada">All Okada</Link>
                </li>
                <li className="px-4 py-2">
                <Link to="/mecha">New Mechanics</Link>
                </li>
                <li className="px-4 py-2">
                <Link to="/mechanics">All Mechanics</Link>
                </li>
                <li className="px-4 py-2">
                <Link to="/approved">Approved Agric</Link>
                </li>
              </ul>
            )}
          </li>

          <li className={`text-black hover:text-blue-200 font-bold font-uniquifier ${location.pathname === '/agric' ? 'bg-green-300' : ''}`}>
            <Link to="/agric">All Agric</Link>
          </li>
          <li className={`text-black font-bold font-uniquifier hover:text-blue-200  ${location.pathname === '/approved' ? 'bg-green-300' : ''}`}>
            <Link to="/boostproduct">Boosted Products</Link>
          </li>
          <li className={`text-black hover:text-blue-200 font-bold font-uniquifier ${location.pathname === '/spare' ? 'bg-green-300' : ''}`}>
            <Link to="/spare">Spare Parts</Link>
          </li>
          <li className={`text-black hover:text-blue-200 font-bold font-uniquifier ${location.pathname === '/postadvert' ? 'bg-green-300' : ''}`}>
            <Link to="/postadvert">Post Advert</Link>
          </li>
          <li className={`text-black hover:text-blue-200 font-bold font-uniquifier ${location.pathname === '/advert' ? 'bg-green-300' : ''}`}>
            <Link to="/advert">Advert Page</Link>
          </li>
          <li className={`text-black font-bold font-uniquifier hover:text-blue-200 ${location.pathname === '/users' ? 'bg-green-300' : ''}`}>
            <Link to="/users">All Users</Link>
          </li>
        </ul>

        {/* Render the Sidebar component */}
        <Sidebar isOpen={isOpen} location={location} />
        {/* End Sidebar */}
      </div>
    </nav>
  );
};

export default Navbar;
