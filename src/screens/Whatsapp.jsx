import React, { useEffect, useState } from 'react';
import { Button, Card } from 'flowbite-react';
import { BeatLoader } from 'react-spinners';
import axios from 'axios';
import baseURL from '../assets/baseURL';
import { FcCallTransfer } from "react-icons/fc";

const Whatsapp = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productFilter, setProductFilter] = useState([]);
    const [productCount, setProductCount] = useState(0);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

  const myStyle = "font-bold mx-4 text-black font-uniquifier text-lg";

  const apiGet = () => {
    fetch(`${baseURL}whatsapp`)
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        setProductFilter(json);
        setLoading(false);
        console.log(data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  const fetchProductCount = async () => {
    try {
      const response = await fetch(`${baseURL}whatsapp/get/count`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const productCount = await response.json();
      setProductCount(productCount);
    } catch (error) {
      console.error('Error fetching product count:', error.message);
    }
  };

  useEffect(() => {
    apiGet();
    fetchProductCount();
  }, []);

  const formatDateTime = (dateTimeString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date(dateTimeString).toLocaleString(undefined, options);
};

const currentDateTime = new Date().toISOString(); // Get current date and time in ISO format
const currentTimeFormatted = formatDateTime(currentDateTime); // Format the current date and time
console.log(currentTimeFormatted);

  const handleDelete = (id) => {
    setShowConfirmation(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    axios.delete(
      `${baseURL}whatsapp/${deleteId}`
    )
      .then((res) => {
        const products = productFilter.filter((item) => item._id !== deleteId);
        setProductCount(productCount - 1);
        setProductFilter(products);
        setShowConfirmation(false);

      })
      .catch((error) => console.log(error));
  };

  const handleSearch = () => {
    let filteredProducts;
    if (searchTerm === '') {
      // If search term is empty, display all products
      filteredProducts = data;
    } else {
      // If search term is provided, filter based on the original data array
      filteredProducts = data.filter((item) => {
        const itemName = (item.name || '').toLowerCase(); 
        
        const itemReceiverPhone = (item.whatsapp || '').toLowerCase(); 
        const itemPhone = (item.phone || '').toLowerCase(); 
        const itemRecname = (item.recname || '').toLowerCase(); 
        const searchTermLower = searchTerm.toLowerCase();
  
        return (
          itemName.includes(searchTermLower) ||
          itemRecname.includes(searchTermLower) ||
          whatsapp.includes(searchTermLower) ||
          itemPhone.includes(searchTermLower)
        );
      });
    }
    setProductFilter(filteredProducts);
  };
  
  const handleClear=()=> {
    setSearchTerm("")
    setProductFilter(data)
  }



  return (
    <div>
      <div className='flex justify-between mx-8 pt-16'>
        <h1 className='font-bold font-uniquifier'>ALL CALLS</h1>
        <h2 className=' bg-[#f2f2f2] font-bold rounded-lg p-4 font-uniquifier'>Total Whatsapp: {productCount}</h2>
      </div>
      <div className="mx-8 mt-4">
        <input
          type="text"
          placeholder="Search by name or phone number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-full"
        />
       <div className='flex justify-between'>
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 ml-2 rounded-lg">Search</button>
        <button onClick={handleClear} className="bg-red-500 text-white px-4 py-2 ml-2 rounded-lg">Clear</button>
        </div> </div>
      <div className="flex flex-wrap justify-around ">
        {loading ? (
          <div className="flex items-center justify-center w-full h-full">
            <BeatLoader color={'#36D7B7'} loading={loading} />
          </div>
        ) : (
          productFilter.map((item) => (
            <Card className="max-w-sm m-4 flex flex-col bg-[#f2f2f2]" key={item._id}>
              <div className="flex items-center justify-center pt-1">
              {/* <Feather name="phone-call" size={24} color="black" /> */}
            <FcCallTransfer  size={34}/>
              </div>
              <h3 className={myStyle}>{item.name} with phone number:{item.phone} and mail:{item.email} 
              <p className='text-red-500'>Whatsapped</p>
              {item.recname} on {item.receiverphone}</h3>
              <h3 className={myStyle}>
              {formatDateTime(item.dateCreated)}
                </h3>
              
              <button
                onClick={() => handleDelete(item._id)}
                className="bg-red-500 font-uniquifier w-full text-white p-2 rounded"
              >
                Delete
              </button>
            </Card>
          ))
        )}
      </div>
      {/* Confirmation popup */}
      {showConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-lg">
            <p>Are you sure you want to delete this item?</p>
            <div className="flex justify-center mt-4">
              <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 mr-4 rounded">Yes</button>
              <button onClick={() => setShowConfirmation(false)} className="bg-gray-500 text-white px-4 py-2 rounded">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Whatsapp;
