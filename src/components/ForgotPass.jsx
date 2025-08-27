import React, { useEffect, useState } from 'react';
import { Card } from 'flowbite-react';
import { BeatLoader } from 'react-spinners';
import axios from 'axios';
import baseURL from '../assets/baseURL';
import { Link } from 'react-router-dom';

const ForgotPass = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const myStyle = "font-bold font-uniquifier mx-4 text-gray-700 dark:text-gray-400 font-bold text-lg";

  // Updated API call
  const apiGet = () => {
    fetch(`${baseURL}requests`)
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          console.log(json.data);  // Output the data array to the console
          setData(json.data);
           console.log("First Item:", json.data[0]);
          setProductFilter(json.data);  // Set the data array for rendering the list
          setProductCount(json.data.length);  // Count the number of items
        } else {
          console.error('Error fetching data:', json.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    apiGet();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete = (id) => {
    setShowDeleteConfirmation(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    axios.delete(`${baseURL}reqts/${deleteId}`)
      .then(response => {
        if (response.data.success) {
          setProductFilter(productFilter.filter(item => item._id !== deleteId));
          setProductCount(productCount - 1);
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
      <div className="flex flex-wrap justify-around pt-20">
        {loading ? (
          <div className="flex items-center justify-center w-full h-full">
            <BeatLoader color={'#36D7B7'} loading={loading} />
          </div>
        ) : (
          Array.isArray(productFilter) && productFilter.length > 0 ? (
            productFilter.map((item) => (
              <Card className="max-w-sm m-4 flex flex-col bg-[#f2f2f2]" key={item._id}>
                 {/* <Link to={`/user-detail/${item.userId}` } > */}
                <h5 className={`${myStyle}, text-2xl`}>
                  Request from {item.phone}
                </h5>
              {/* </Link> */}
                <h3 className={myStyle}>{item.usermessage}</h3>
                <h3 className={myStyle}>
                  Created on {formatDate(item.dateCreated)}
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
          ) : (
            <p>No products available</p>
          )
        )}
      </div>
      {showDeleteConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-lg">
            <p>Are you sure you want to delete this request?</p>
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

export default ForgotPass;
