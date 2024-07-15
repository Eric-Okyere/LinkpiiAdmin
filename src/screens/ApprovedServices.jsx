import React, { useEffect, useState } from 'react';
import { Card } from 'flowbite-react';
import { BeatLoader } from 'react-spinners';
import axios from 'axios';
import baseURL from '../assets/baseURL';

const ApprovedServices = () => {
  const [approvedProducts, setApprovedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedProducts = async () => {
      try {
        const response = await axios.get(`${baseURL}services/approved`);
        setApprovedProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching approved products:', error);
        setLoading(false);
      }
    };

    fetchApprovedProducts();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
    <div>
        <h1 className='pt-16 text-center font-bold font-uniquifier'>APPROVED SERVICES</h1>
      </div>
    <div className="flex flex-wrap justify-around pt-16">
      
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <BeatLoader color={'#36D7B7'} loading={loading} />
        </div>
      ) : (
        approvedProducts.map((item) => (
          <Card className="max-w-sm m-4 flex flex-col bg-[#f2f2f2]" key={item.id}>
            {/* Display approved product details */}
            <img width={500} height={500} src={item.picture} alt="image 1" />
            <h5 className="font-bold font-serif mx-4 text-gray-700 dark:text-gray-400 text-lg">
              {item.name}
            </h5>
            <h3 className="font-bold mx-4 text-gray-700 font-uniquifier dark:text-gray-400"> Views:{item.views}</h3>
            <h3 className="font-bold mx-4 text-gray-700 font-uniquifier dark:text-gray-400"> Gh₵{item.price}</h3>
            <h3 className="font-bold mx-4 text-gray-700 font-uniquifier dark:text-gray-400">{item.description}</h3>
            <h3 className="font-bold mx-4 text-gray-700 font-uniquifier dark:text-gray-400">{item.region}</h3>
            <h3 className="font-bold mx-4 text-gray-700 font-uniquifier dark:text-gray-400">{item.town}</h3>
            <h3 className="font-bold mx-4 text-gray-700 font-uniquifier dark:text-gray-400">{item.location}</h3>
            <h3 className="font-bold mx-4 text-gray-700 font-uniquifier dark:text-gray-400">
              {formatDate(item.dateCreated)}
            </h3>
          </Card>
        ))
      )}
    </div>
    </>
  );
};

export default ApprovedServices;
