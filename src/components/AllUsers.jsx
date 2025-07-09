import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const [confirmationPopup, setConfirmationPopup] = useState({ visible: false, action: null, userId: null });
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
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const count = await response.json();
      setProductCount(count);
    } catch (error) {
      console.error('Error fetching product count:', error.message);
    }
  };

  useEffect(() => {
    apiGet();
    fetchProductCount();
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  const handleSearch = () => {
    const filtered = searchTerm === '' ? data : data.filter((item) => {
      const name = (item.name || '').toLowerCase();
      const email = (item.email || '').toLowerCase();
      const phone = (item.phone || '').toLowerCase();
      const term = searchTerm.toLowerCase();
      return name.includes(term) || email.includes(term) || phone.includes(term);
    });
    setProductFilter(filtered);
  };

  const handleClear = () => {
    setSearchTerm("");
    setProductFilter(data);
  };

  const confirmAction = async () => {
    const { action, userId } = confirmationPopup;
    try {
      if (action === 'delete') {
        await axios.delete(`${baseURL}deleteUser/${userId}`);
        setProductFilter((prev) => prev.filter((item) => item._id !== userId));
        setProductCount((prev) => prev - 1);
      } else if (action === 'report') {
        await axios.put(`${baseURL}${userId}/report`);
        updateUserReportStatus(userId, true);
      } else if (action === 'rectify') {
        await axios.put(`${baseURL}${userId}/rectify`);
        updateUserReportStatus(userId, false);
      } else if (action === 'whatsapp') {
        sendWhatsApp(userId);
      } else if (action === 'sms') {
        sendSMS(userId);
      } else if (action === 'edit') {
        navigate(`/user-update/${userId}`);
      } else if (action === 'password') {
        navigate(`/user-editpass/${userId}`);
      }
    } catch (error) {
      console.error(`Error during ${action}:`, error);
    } finally {
      setConfirmationPopup({ visible: false, action: null, userId: null });
    }
  };

  const updateUserReportStatus = (userId, status) => {
    setProductFilter((prev) => prev.map((user) => user._id === userId ? { ...user, report: status } : user));
  };

  const handleConfirmation = (action, userId) => {
    setConfirmationPopup({ visible: true, action, userId });
  };

  const sendWhatsApp = (phone) => {
    let formattedPhone = phone.startsWith('0') ? phone.slice(1) : phone;
    formattedPhone = formattedPhone.startsWith('+') ? formattedPhone.slice(1) : formattedPhone;
    const message = encodeURIComponent( "Welcome to Linkpii! It helps you post video and pictures of your work, products or shop. " +
    "You can also order a KIA driver by negotiation to convey your products. It helps you rent a room, book a hotel or buy an estate. " +
    "Our main aim is to promote agriculture. Can we know what you want to buy, sell or services you provide? " +
    "You can follow our Facebook page for more updates: https://www.facebook.com/p/Linkpii-100070660432401/"
  );
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, '_blank');
  };

  const sendSMS = (phone) => {
    if (!phone) return alert("Phone number is missing or invalid.");
    const message = encodeURIComponent( "Welcome to Linkpii! It helps you post video and pictures of your work, products or shop. " +
    "You can also order a KIA driver by negotiation to convey your products. It helps you rent a room, book a hotel or buy an estate. " +
    "Our main aim is to promote agriculture. Can we know what you want to buy, sell or services you provide? " +
    "You can follow our Facebook page for more updates: https://www.facebook.com/p/Linkpii-100070660432401/"
  );
    window.location.href = `sms:${phone}?&body=${message}`;
  };

  return (
    <div>
      <div className='flex justify-between mx-8 pt-16'>
        <h1 className='font-bold font-uniquifier'>ALL USERS</h1>
        <h2 className='bg-[#f2f2f2] font-bold rounded-lg p-4 font-uniquifier'>Total Users: {productCount}</h2>
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
      <div className="flex flex-wrap justify-around">
        {loading ? (
          <div className="flex items-center justify-center w-full h-full">
            <BeatLoader color={'#36D7B7'} loading={loading} />
          </div>
        ) : (
          productFilter.map((item) => (
            <Card className="max-w-sm m-4 flex flex-col bg-[#f2f2f2]" key={item._id}>
              <div className="flex items-center justify-center pt-1">
                {item.avatar ? <img width={40} height={40} className='rounded-full' src={item.avatar} alt="avatar" /> : <FaUserCircle size={40} className='text-center' />}
              </div>
              <div className='flex'>
                <Link to={`/user-detail/${item._id}`}>
                  <h3 className={`${myStyle} text-blue-600`}>{item.name} {item.lastname}</h3>
                </Link>
              </div>
              <a href={`mailto:${item.email}`} className={`${myStyle} line-clamp-2 break-words -mt-4  hover:underline`}>{item.email}</a>
              <a href={`tel:${item.phone}`} className={`${myStyle} -mt-4  hover:underline`}>📞 {item.phone}</a>
              <h3 className={`${myStyle} -mt-4`}>🗓️{formatDate(item.dateCreated)}</h3>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <button onClick={() => handleConfirmation('whatsapp', item.phone)} className="bg-green-500 text-xs text-white py-1 px-2 rounded">WhatsApp</button>
                <button onClick={() => handleConfirmation('sms', item.phone)} className="bg-purple-500 text-xs text-white py-1 px-2 rounded">SMS</button>
                <button onClick={() => handleConfirmation('edit', item._id)} className="bg-black text-xs text-white py-1 px-2 rounded">Edit</button>
                {!item.report ? (
                  <button onClick={() => handleConfirmation('report', item._id)} className="bg-blue-500 text-xs text-white py-1 px-2 rounded">Report</button>
                ) : (
                  <button onClick={() => handleConfirmation('rectify', item._id)} className="bg-red-500 text-xs text-white py-1 px-2 rounded">Rectify</button>
                )}
                <button onClick={() => handleConfirmation('password', item._id)} className="bg-green-700 text-xs text-white py-1 px-2 rounded">Password</button>
                <button onClick={() => handleConfirmation('delete', item._id)} className="bg-red-700 text-xs text-white py-1 px-2 rounded">Delete</button>
              </div>
            </Card>
          ))
        )}
      </div>

      {confirmationPopup.visible && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-lg">
            <p>Are you sure you want to proceed with this action?</p>
            <div className="flex justify-center mt-4">
              <button onClick={confirmAction} className="bg-red-500 text-white px-4 py-2 mr-4 rounded">Yes</button>
              <button onClick={() => setConfirmationPopup({ visible: false, action: null, userId: null })} className="bg-gray-500 text-white px-4 py-2 rounded">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
