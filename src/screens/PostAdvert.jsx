import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import baseURL from '../assets/baseURL';

const PostAdvert = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); 
  const [name, setName] = useState()
  const [phone, setPhone] = useState("")
  const [whatsapp, setWhatsapp] = useState("")


  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const previewURL = URL.createObjectURL(selectedFile);
    setPreviewImage(previewURL);
    setIsFileSelected(true); // Set isFileSelected to true when a file is selected
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Set loading state to true when form submission starts

    try {
      const formData = new FormData();
      formData.append('picture', file);
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('whatsapp', whatsapp);

      const response = await axios.post(`${baseURL}advert`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Post successful:', response.data);

      navigate('/advert');
    } catch (error) {
      console.error('Error posting data:', error);
    } finally {
      setIsLoading(false); // Set loading state to false when form submission ends
    }
  };

  return (
    <div className='flex justify-center'>
      <div className='mt-32 p-6 bg-[#f2f2f2]'>
        <h1 className='text-center text-lg font-bold'>Post Page</h1>
        <form onSubmit={handleFormSubmit} className='flex flex-col space-y-4'>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder='Enter name'
          />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder='Enter Phone Number'
          />
          <input
            type="text"
            value={whatsapp}
            onChange={(e) => {
              const inputValue = e.target.value;
              
              // Check if input contains zero at the beginning or only zero
              if (inputValue === "0") {
                return; // Do nothing if input is zero
              }
          
              // If input is valid (not starting with or being zero), update state
              setWhatsapp(inputValue);
            }}
            required
            placeholder='Enter Whatsapp Number'
          />

          <label>
            Choose a picture:
            <input type="file" onChange={handleFileChange} accept="image/*" />
          </label>
          <br />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="mt-2 max-w-full px-6 h-auto lg:h-60 rounded"
            />
          )}
          <br />
          {/* Render the "Post" button only if a file is selected and the form submission is not in progress */}
          {isFileSelected && !isLoading && (
            <button className='bg-black text-white mt-4 rounded-lg p-2 sm:p-4 lg:p-2 xl:p-2 w-full' type="submit">
              Post
            </button>
          )}
          {/* Show a loading indicator while the form submission is in progress */}
          {isLoading && (
            <div className="mt-4 text-center">
              <span className="text-black">Posting...</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostAdvert;
