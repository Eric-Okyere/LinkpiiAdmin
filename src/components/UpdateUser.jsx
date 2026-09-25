import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import baseURL from '../assets/baseURL';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Card, Button, Loader, EmptyState } from './ui';

const UpdateUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // State to track form submission

  useEffect(() => {
    axios.get(`${baseURL}userbyid/${id}`)
      .then((response) => {
        setUser(response.data);
        setName(response.data.name);
        setLastname(response.data.lastname);
        setEmail(response.data.email);
        setPhone(response.data.phone);
        setGender(response.data.gender || '');
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
        phone,
        gender
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


  const inputClasses =
    'w-full rounded-xl border border-ink-200 px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100';

  if (loading) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }

  return (
    <Container>
      <ToastContainer />
      <div className="flex min-h-[60vh] items-center justify-center">
        {user ? (
          <Card className="w-full max-w-md p-8">
            <h1 className="mb-6 font-display text-2xl font-bold text-ink-900">Update User</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className={inputClasses}
              />
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Lastname"
                className={inputClasses}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={inputClasses}
              />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className={inputClasses}
              />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={inputClasses}
              >
                <option value="">Gender not set</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update User'}
              </Button>
            </form>
          </Card>
        ) : (
          <EmptyState title="User not found" />
        )}
      </div>
    </Container>
  );
};

export default UpdateUser;
