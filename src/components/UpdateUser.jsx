import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import baseURL from '../assets/baseURL';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // State to track form submission

  useEffect(() => {
    axios.get(`${baseURL}userbyid/${id}`)
      .then((response) => {
        setUser(response.data);
        setName(response.data.name);
        setLastname(response.data.lastname);
        setEmail(response.data.email);
        setPhone(response.data.phone);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setLoading(false);
      });
  }, [id]);

 

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    setIsLoading(true);
  
    try {
      const response = await axios.put(`${baseURL}card/${id}/details`, {
        name,
        lastname,
        email,
        phone
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('User updated successfully:', response.data);
      toast.success('User details updated successfully!');
  
      setIsLoading(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user details.');
      setIsLoading(false);
    }
  };
  





  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen">
         <ToastContainer />
      {user ? (
        <form onSubmit={handleSubmit} className="text-center p-8 bg-gray-100 shadow-2xl rounded-lg">
          <h1 className="text-3xl font-bold mb-4">Update User</h1>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="block mb-4 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            placeholder="Lastname"
            className="block mb-4 p-2 border border-gray-300 rounded"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="block mb-4 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            className="block mb-4 p-2 border border-gray-300 rounded"
          />

        

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update User'}
          </button>
        </form>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default UpdateUser;
