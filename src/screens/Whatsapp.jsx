import  { useEffect, useState } from 'react';
import { Card } from 'flowbite-react';
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



  const handleWhatsApp = (phone, item) => {
    let formattedPhone = phone.startsWith('0') ? phone.slice(1) : phone;
    formattedPhone = formattedPhone.startsWith('+') ? formattedPhone.slice(1) : formattedPhone;
    const internationalPhone = `${formattedPhone}`;
    
    const message = encodeURIComponent(
      `Hello! You whatsapped ${item.recname} on Linkpii. Were you able to reach out to the business?`
    );

    const whatsappUrl = `https://wa.me/${internationalPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');  // Opens WhatsApp in a new tab
};


  const handleWhatsAppBusi = (receiverphone, item) => {
    let formattedPhone = receiverphone.startsWith('0') ? receiverphone.slice(1) : receiverphone;
    formattedPhone = formattedPhone.startsWith('+') ? formattedPhone.slice(1) : formattedPhone;
    const internationalPhone = `${formattedPhone}`;
    
    const message = encodeURIComponent(
      `Hello! You were whatsapped by ${item.name}on Linkpii. Was the client able to reach out to you?`
    );

    const whatsappUrl = `https://wa.me/${internationalPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');  // Opens WhatsApp in a new tab
};


    const handleCall = (phone) => {
        // Format phone number if needed, like removing spaces or adding country code
        const formattedPhone = phone ? phone : `+${phone}`;
        window.open(`tel:${formattedPhone}`, '_self');  // Opens phone dialer
     console.log(formattedPhone)
      };

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
              <h3 className={myStyle}>
              {item?.pagename}
                </h3>
              


             <button
              onClick={() => handleCall(item.phone)}
              className="bg-blue-500 font-uniquifier mb-2 w-full text-white p-2 rounded"
          >
              Call Client
          </button>


                <button
              onClick={() => handleWhatsApp(item.phone, item)}
              className="bg-green-500 font-uniquifier mb-2 w-full text-white p-2 rounded"
            >
              WhatsApp Client
            </button>

            <button
              onClick={() => handleCall(item.receiverphone)}
              className="bg-blue-500 font-uniquifier mb-2 w-full text-white p-2 rounded"
          >
              Call Business
          </button>


          <button
              onClick={() => handleWhatsAppBusi(item.receiverphone, item)}
              className="bg-green-500 font-uniquifier mb-2 w-full text-white p-2 rounded"
            >
              WhatsApp Business
            </button>

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
