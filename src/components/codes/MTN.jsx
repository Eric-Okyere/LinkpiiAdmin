import React, { useEffect, useState } from 'react';
import { Card } from 'flowbite-react';
import { BeatLoader } from 'react-spinners';

import baseURL from '../../assets/baseURL';
import { TbCircleLetterA } from "react-icons/tb";
const MTN = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState([]);



  const myStyle = "font-bold mx-4 text-black font-uniquifier text-lg";

  const apiGet = () => {
    fetch(`${baseURL}mtn`)
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

  useEffect(() => {
    apiGet(); 
  }, []);

  const handleDelete = (id) => {
    fetch(`${baseURL}mtn/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        const updatedProducts = productFilter.filter(item => item._id !== id);
        setProductFilter(updatedProducts);
      })
      .catch((error) => console.error('Error deleting data:', error));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <div className='flex justify-between mx-8 pt-16'>
        <h1 className='font-bold font-uniquifier'>MTN Codes</h1>
      </div>
      <div className="flex flex-wrap justify-around ">
        {loading ? (
          <div className="flex items-center justify-center w-full h-full">
            <BeatLoader color={'#36D7B7'} loading={loading} />
          </div>
        ) : (
          productFilter.map((item) => (
            <Card className="max-w-sm m-4 flex flex-col bg-[#f2f2f2]" key={item._id}>
              <div className="flex items-center justify-center pt-1">
              <TbCircleLetterA size={40}/>

              </div>
              <h3 className={myStyle}>{item.name}</h3>
              <h3 className={myStyle}>{item.code}</h3>
              <h3 className={myStyle}>
                {formatDate(item.dateCreated)}
              </h3>
              <button className='bg-red-500 font-uniquifier text-lg mt-4 rounded-md' onClick={() => handleDelete(item._id)}>Delete</button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MTN;
