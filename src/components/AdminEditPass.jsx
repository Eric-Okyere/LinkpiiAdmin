import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import baseURL from '../assets/baseURL';

const AdminEditPass = () => {
  const [password, setPassword] = useState("");
  const { id: userId } = useParams(); // Extracts 'id' parameter from the URL

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`${baseURL}editpass/${userId}`, {
        newPassword: password,
      });

      if (response.data.success) {
        toast.success("Password edited successfully!");
      } else {
        toast.error("Failed to update password: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("An error occurred while updating the password.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="text-center p-8 bg-gray-100 shadow-2xl rounded-lg">
        <h1 className="text-3xl font-bold mb-4">Update Password</h1>
        
        <input
          type="password"
          placeholder="Enter New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block mb-4 p-2 border border-gray-300 rounded"
        />
        
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Update Password
        </button>
      </form>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default AdminEditPass;
