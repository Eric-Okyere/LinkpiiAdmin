import React, { useState } from 'react';
import axios from 'axios';
import baseURL from '../assets/baseURL';
import { useNavigate } from 'react-router-dom';



const EmergencyPost = () => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();



  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    

    try {
      
      const response = await axios.post(`${baseURL}emergency`, { name, code });
      navigate('/emergency')
      
      setName('');
      setCode('');
      setError(null);
      setLoading(false);

      // Handle successful response from the server
      console.log('Airtel record created:', response.data);
      alert('Airtel record created successfully!');
    } catch (error) {
      console.error('Error creating Airtel record:', error);
      setError('Failed to create Airtel record. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container pt-20 flex flex-col space-y-5 items-center">
      <h1>POST EMERGENCY CODE</h1>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className="form-group ">
          
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder='name'
          />
        </div>
        <div className="form-group">
          
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            placeholder='code'
          />
        </div>
        <button type="submit" className='bg-black text-white py-2 px-4 rounded-sm ' disabled={loading}>
          {loading ? 'Creating...' : 'Create Airtel Record'}
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default EmergencyPost;
