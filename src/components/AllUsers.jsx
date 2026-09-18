import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseURL from '../assets/baseURL';
import { FaUserCircle } from 'react-icons/fa';
import {
  Container,
  PageHeader,
  SearchInput,
  Card,
  Badge,
  Button,
  Loader,
  EmptyState,
  ConfirmModal,
} from './ui';

const AllUsers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [confirmationPopup, setConfirmationPopup] = useState({ visible: false, action: null, userId: null });
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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
    setSearchTerm('');
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
    if (!phone) return alert('Phone number is missing or invalid.');
    const message = encodeURIComponent( "Welcome to Linkpii! It helps you post video and pictures of your work, products or shop. " +
    "You can also order a KIA driver by negotiation to convey your products. It helps you rent a room, book a hotel or buy an estate. " +
    "Our main aim is to promote agriculture. Can we know what you want to buy, sell or services you provide? " +
    "You can follow our Facebook page for more updates: https://www.facebook.com/p/Linkpii-100070660432401/"
  );
    window.location.href = `sms:${phone}?&body=${message}`;
  };

  const confirmCopy = {
    delete: { title: 'Delete this user?', message: 'This removes the account permanently. This cannot be undone.', confirmLabel: 'Delete', danger: true },
    report: { title: 'Report this user?', message: 'This will flag the account as reported.', confirmLabel: 'Report' },
    rectify: { title: 'Clear this report?', message: 'This removes the report flag from the account.', confirmLabel: 'Clear report' },
    whatsapp: { title: 'Message on WhatsApp?', message: "This opens WhatsApp with Linkpii's welcome message pre-filled.", confirmLabel: 'Open WhatsApp' },
    sms: { title: 'Send an SMS?', message: "This opens your SMS app with Linkpii's welcome message pre-filled.", confirmLabel: 'Send SMS' },
    edit: { title: 'Edit this user?', message: 'You will be taken to the edit screen.', confirmLabel: 'Continue' },
    password: { title: 'Reset this user’s password?', message: 'You will be taken to the password screen.', confirmLabel: 'Continue' },
  };
  const activeCopy = confirmCopy[confirmationPopup.action] || {};

  return (
    <Container>
      <PageHeader title="All Users" total={productCount} totalLabel="Total Users" />

      <SearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onSearch={handleSearch}
        onClear={handleClear}
        placeholder="Search by name, email or phone number"
        className="mb-6"
      />

      {loading ? (
        <Loader />
      ) : productFilter.length === 0 ? (
        <EmptyState title="No users found" subtitle="Try a different search term." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productFilter.map((item) => (
            <Card hover key={item._id} className="flex flex-col items-center p-5 text-center">
              {item.avatar ? (
                <img width={56} height={56} className="h-14 w-14 rounded-full object-cover" src={item.avatar} alt="avatar" />
              ) : (
                <FaUserCircle size={56} className="text-ink-300" />
              )}
              <Link to={`/user-detail/${item._id}`} className="mt-3 font-display font-semibold text-ink-900 hover:text-brand-600">
                {item.name} {item.lastname}
              </Link>
              <a href={`mailto:${item.email}`} className="mt-1 line-clamp-1 break-all text-sm text-ink-500 hover:underline">
                {item.email}
              </a>
              <a href={`tel:${item.phone}`} className="mt-0.5 text-sm text-ink-500 hover:underline">
                📞 {item.phone}
              </a>
              <p className="mt-1 text-xs text-ink-400">Joined {formatDate(item.dateCreated)}</p>
              {item.report && (
                <Badge tone="danger" className="mt-2">Reported</Badge>
              )}

              <div className="mt-4 grid w-full grid-cols-3 gap-2">
                <Button size="sm" variant="primary" className="!bg-emerald-600 hover:!bg-emerald-700" onClick={() => handleConfirmation('whatsapp', item.phone)}>WhatsApp</Button>
                <Button size="sm" variant="outline" onClick={() => handleConfirmation('sms', item.phone)}>SMS</Button>
                <Button size="sm" variant="secondary" onClick={() => handleConfirmation('edit', item._id)}>Edit</Button>
                {!item.report ? (
                  <Button size="sm" variant="outline" onClick={() => handleConfirmation('report', item._id)}>Report</Button>
                ) : (
                  <Button size="sm" variant="danger" onClick={() => handleConfirmation('rectify', item._id)}>Rectify</Button>
                )}
                <Button size="sm" variant="outline" onClick={() => handleConfirmation('password', item._id)}>Password</Button>
                <Button size="sm" variant="danger" onClick={() => handleConfirmation('delete', item._id)}>Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmModal
        open={confirmationPopup.visible}
        title={activeCopy.title}
        message={activeCopy.message}
        confirmLabel={activeCopy.confirmLabel}
        danger={confirmationPopup.action === 'delete'}
        onConfirm={confirmAction}
        onCancel={() => setConfirmationPopup({ visible: false, action: null, userId: null })}
      />
    </Container>
  );
};

export default AllUsers;
