import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Import Link from react-router-dom
import { Card } from 'flowbite-react';
import { BeatLoader } from 'react-spinners';
import axios from 'axios';
import baseURL from '../assets/baseURL';
import { FaUserCircle } from "react-icons/fa";

const AllUsers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const myStyle = "font-bold mx-4 text-black font-uniquifier text-lg";

  const apiGet = () => {
    fetch(`${baseURL}getUsers`)
      .then((response) => response.json())
      .then((json) => {
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
      const response = await fetch(`${baseURL}getUsers/count`);
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete = (id) => {
    setShowConfirmation(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    axios.delete(
      `${baseURL}deleteUser/${deleteId}`
    )
      .then((res) => {
        const products = productFilter.filter((item) => item._id !== deleteId);
        setProductFilter(products);
        setShowConfirmation(false);
        setProductCount(productCount - 1)
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
        const itemEmail = (item.email || '').toLowerCase(); // Handle potential undefined value
        const itemPhone = (item.phone || '').toLowerCase(); // Handle potential undefined value
        const searchTermLower = searchTerm.toLowerCase();

        return (
          itemName.includes(searchTermLower) ||
          itemEmail.includes(searchTermLower) ||
          itemPhone.includes(searchTermLower)
        );
      });
    }
    setProductFilter(filteredProducts);
  };

  const handleClear = () => {
    setSearchTerm("")
    setProductFilter(data)
  }

  const handleReport = async (id) => {
    try {
      const response = await axios.put(`${baseURL}${id}/report`);
      const updatedProduct = response.data;

      setProductFilter((prevProducts) => {
        return prevProducts.map((product) => {
          if (product.id === id) {
            return { ...product, report: true };
          }
          return product;
        });
      });

      console.log('Product approval updated:', updatedProduct);
    } catch (error) {
      console.error('Error updating product approval:', error);
    }
  };

  const handleRectify = async (id) => {
    try {
      const response = await axios.put(`${baseURL}${id}/rectify`);
      const updatedProduct = response.data;

      setProductFilter((prevProducts) => {
        return prevProducts.map((product) => {
          if (product.id === id) {
            return { ...product, report: false };
          }
          return product;
        });
      });

      console.log('Product approval updated:', updatedProduct);
    } catch (error) {
      console.error('Error updating product approval:', error);
    }
  };


  const handleEdit = (id) => {
    navigate(`/user-update/${id}`);
  };

  const handleUpdateUserpass = (id) => {
    navigate(`/user-editpass/${id}`);
  };

 
  const handleWhatsApp = (phone) => {
    // Remove the first '0' if it exists
    let formattedPhone = phone.startsWith('0') ? phone.slice(1) : phone;
  
    // Remove any '+' character if it exists at the beginning
    formattedPhone = formattedPhone.startsWith('+') ? formattedPhone.slice(1) : formattedPhone;
  
    console.log('Formatted Phone:', formattedPhone);
  
    // Format the phone number for WhatsApp
    const internationalPhone = `${formattedPhone}`; // No '+' attached
  
    console.log('International Phone:', internationalPhone);
  const message = encodeURIComponent("Welcome to Linkpii! It helps you post video and pictures of your work, products or shop. You can also order a KIA driver by negotiation. It helps you rent a room, book a hotel or buy estate. Our main aim is to promote agrictulture. ");
    const whatsappUrl = `https://wa.me/${internationalPhone}?text=${message}`;
  
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  };
  
  




  return (
    <div>
      <div className='flex justify-between mx-8 pt-16'>
        <h1 className='font-bold font-uniquifier'>ALL USERS</h1>
        <h2 className=' bg-[#f2f2f2] font-bold rounded-lg p-4 font-uniquifier'>Total Users: {productCount}</h2>
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
        </div>
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
                {item.avatar?(
                   <img width={40} height={40} className='rounded-full' src={item.avatar} alt="image 1" />
                ):(<FaUserCircle size={40} className='text-center' />)}
                
              </div>
              <div className='flex'>
                <Link to={`/user-detail/${item._id}`}>
                  <h3 className={myStyle}>{item.name} {item.lastname}</h3>
                </Link>
              </div>
              <h3 className={`${myStyle} line-clamp-2 break-words`}>{item.email}</h3>
              <h3 className={myStyle}>{item.phone}</h3>
              <h3 className={myStyle}>
                {formatDate(item.dateCreated)}
              </h3>

              <button
              onClick={() => handleWhatsApp(item.phone)}
              className="bg-green-500 font-uniquifier m-2 w-full text-white p-2 rounded"
            >
              WhatsApp
            </button>



              <button
                onClick={() => handleEdit(item._id)}
                className="bg-black font-uniquifier m-2 w-full text-white p-2 rounded"
              >
                Edit
              </button>
              
              {!item.report && (
                <button
                  onClick={() => handleReport(item._id)}
                  className="bg-blue-500 font-uniquifier m-2 w-full text-white p-2 rounded"
                >
                  Report
                </button>
              )}

              {item.report && (
                <button
                  onClick={() => handleRectify(item._id)}
                  className="bg-green-500 font-uniquifier m-2 w-full text-white p-2 rounded"
                >
                  Rectify
                </button>
              )}

              <button
                onClick={() => handleUpdateUserpass(item._id)}
                className="bg-green-500 font-uniquifier m-2 w-full text-white p-2 rounded"
              >
                Change Password
              </button>

              <button
                onClick={() => handleDelete(item._id)}
                className="bg-red-500 font-uniquifier m-2 w-full text-white p-2 rounded"
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

export default AllUsers;
