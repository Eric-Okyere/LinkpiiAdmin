import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import baseURL from '../assets/baseURL';
import { Container, Card, Button } from '../components/ui';

const PostAdvert = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState()
  const [phone, setPhone] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [author, setAuthor] = useState("")


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
      formData.append('author', author);
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
    <Container className="flex justify-center py-10">
      <Card className="w-full max-w-2xl p-6 sm:p-8">
        <h1 className="mb-6 text-center font-display text-xl font-bold text-ink-900">Post an Advert</h1>
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink-700">Company name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter name of the company"
              className="w-full rounded-xl border border-ink-200 bg-ink-50 p-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-ink-700">Posted by</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              placeholder="Enter name of the user"
              className="w-full rounded-xl border border-ink-200 bg-ink-50 p-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-ink-700">Phone number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="Enter phone number"
              className="w-full rounded-xl border border-ink-200 bg-ink-50 p-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-ink-700">WhatsApp number</label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required
              placeholder="Enter WhatsApp number"
              className="w-full rounded-xl border border-ink-200 bg-ink-50 p-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-ink-700">Choose a picture</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full rounded-xl border border-dashed border-ink-200 bg-ink-50 p-3 text-sm text-ink-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
            />
          </div>

          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="h-56 w-full rounded-xl object-cover"
            />
          )}

          {/* Render the "Post" button only if a file is selected and the form submission is not in progress */}
          {isFileSelected && !isLoading && (
            <Button type="submit" variant="primary" size="lg" className="w-full">
              Post
            </Button>
          )}
          {/* Show a loading indicator while the form submission is in progress */}
          {isLoading && (
            <p className="text-center text-sm text-ink-500">Posting...</p>
          )}
        </form>
      </Card>
    </Container>
  );
};

export default PostAdvert;
