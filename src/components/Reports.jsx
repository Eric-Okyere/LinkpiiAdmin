import React, { useEffect, useState } from 'react';
import { Card } from 'flowbite-react';
import { BeatLoader } from 'react-spinners';
import axios from 'axios';
import baseURL from '../assets/baseURL';

const Reports = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const myStyle = "font-bold font-uniquifier mx-4 text-gray-700 dark:text-gray-400 font-bold text-lg";

  const apiGet = () => {
    fetch(`${baseURL}compliants`)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setData(json);
        setProductFilter(json);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  const fetchProductCount = async () => {
    try {
      const response = await fetch(`${baseURL}compliants/get/count`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const productCount = await response.json();
      console.log('Product Count:', productCount);
      setProductCount(productCount);
    } catch (error) {
      console.error('Error fetching product count:', error.message);
    }
  };

  useEffect(() => {
    apiGet();
    fetchProductCount();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete = (id) => {
    console.log(`Setting deleteId to: ${id}`);  
    setShowDeleteConfirmation(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    console.log(`Deleting complaint with ID: ${deleteId}`);  
    axios.delete(`${baseURL}compliants/${deleteId}`)
      .then(response => {
        if (response.data.success) {
          setProductFilter(productFilter.filter(item => item._id !== deleteId));
          setProductCount(productCount - 1); // Update the product count
        } else {
          console.error('Error deleting the report:', response.data.message);
        }
        setShowDeleteConfirmation(false);
      })
      .catch(error => {
        console.error('Error deleting the report:', error);
        setShowDeleteConfirmation(false);
      });
  };

  return (
    <div>
      <div className='flex justify-between mx-8 pt-16'>
        <h1 className='font-bold'>ALL PRODUCTS</h1>
        <h2 className=' bg-[#f2f2f2] rounded-lg p-4'>Total Complaints: {productCount}</h2>
      </div>
      <div className="flex flex-wrap justify-around">
        {loading ? (
          <div className="flex items-center justify-center w-full h-full">
            <BeatLoader color={'#36D7B7'} loading={loading} />
          </div>
        ) : (
          productFilter.map((item) => (
            <Card className="max-w-sm m-4 flex flex-col bg-[#f2f2f2]" key={item._id}>
              <h5 className={`${myStyle}, text-2xl`}>
                {item.name}
              </h5>
              <h3 className={myStyle}>{item.sendername} with phone number {item.senderphone} <span className='text-red-500'>blocked</span>  {item.product} phone: {item.productphone}</h3>
              <h3 className={myStyle}>Reason: {item.complaint}</h3>
              <h3 className={myStyle}>
                {formatDate(item.dateCreated)}
              </h3>
              <div className="mt-4 space-y-4">
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 font-uniquifier w-full text-white p-2 rounded"
                >
                  Delete
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
      {showDeleteConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-lg">
            <p>Are you sure you want to delete this product?</p>
            <div className="flex justify-center mt-4">
              <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 mr-4 rounded">Yes</button>
              <button onClick={() => setShowDeleteConfirmation(false)} className="bg-gray-500 text-white px-4 py-2 rounded">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
