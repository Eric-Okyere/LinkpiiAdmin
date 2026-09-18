import { useEffect, useState } from 'react';
import baseURL from '../../assets/baseURL';
import axios from 'axios';
import { FaPhoneAlt } from 'react-icons/fa';
import {
  Container,
  PageHeader,
  Card,
  Badge,
  Button,
  Loader,
  EmptyState,
  ConfirmModal,
} from '../ui';

const Okada = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState([]);
  const [productCount, setProductCount] = useState(0); // New state for product count
  const [confirmationPopup, setConfirmationPopup] = useState({ visible: false, action: null, itemId: null });

  const apiGet = () => {
    fetch(`${baseURL}okada`)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setData(json);
        setProductFilter(json);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false); // Set loading to false in case of an error
      });
  };


  const fetchProductCount = async () => {
    try {
      const response = await fetch(`${baseURL}okada/get/countokada`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const productCount = await response.json();
      console.log('Product Count:', productCount);
      setProductCount(productCount); // Set the count in the state
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

  const handleConfirmation = (action, itemId) => {
    setConfirmationPopup({ visible: true, action, itemId });
  };

  const closeConfirmation = () => setConfirmationPopup({ visible: false, action: null, itemId: null });

  const confirmAction = async () => {
    const { action, itemId } = confirmationPopup;
    try {
      if (action === 'delete') {
        await axios.delete(`${baseURL}okada/${itemId}`);
        const products = productFilter.filter((item) => item.id !== itemId);
        setProductFilter(products);
      } else if (action === 'approve') {
        const response = await axios.put(`${baseURL}okada/${itemId}/approveokada`);
        console.log('Product approval updated:', response.data);
        setProductFilter((prev) => prev.map((item) => (item._id === itemId ? { ...item, approved: true } : item)));
      } else if (action === 'deactivate') {
        const response = await axios.put(`${baseURL}okada/${itemId}/deactivateokada`);
        console.log('Product approval updated:', response.data);
        setProductFilter((prev) => prev.map((item) => (item._id === itemId ? { ...item, deactivate: true } : item)));
      }
    } catch (error) {
      console.error(`Error during ${action}:`, error);
    } finally {
      closeConfirmation();
    }
  };

  const confirmCopy = {
    delete: { title: 'Delete this bike?', message: 'This removes the okada listing permanently. This cannot be undone.', confirmLabel: 'Delete', danger: true },
    approve: { title: 'Approve this bike?', message: 'This will make the okada listing visible to the public.', confirmLabel: 'Approve' },
    deactivate: { title: 'Deactivate this bike?', message: 'This will hide the okada listing from the public.', confirmLabel: 'Deactivate', danger: true },
  };
  const activeCopy = confirmCopy[confirmationPopup.action] || {};

  return (
    <Container>
      <PageHeader title="Okada Riders" total={productCount} totalLabel="Total Riders" />

      {loading ? (
        <Loader />
      ) : data.length === 0 ? (
        <EmptyState title="No okada riders found" subtitle="Okada listings will appear here once submitted." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((item) => (
            <Card hover key={item._id} className="flex flex-col p-5">
              <div className="flex gap-2">
                <img src={item.driverpic} className="h-28 w-1/2 rounded-xl object-cover" alt="Driver" />
                <img src={item.carpic} className="h-28 w-1/2 rounded-xl object-cover" alt="Bike" />
              </div>

              <div className="mt-4 space-y-1 text-sm text-ink-600">
                <p>Views: {item.view}</p>
                <p className="font-display text-base font-semibold text-ink-900">{item.name}</p>
                <a href={`tel:${item.phone}`} className="flex items-center gap-1.5 hover:text-brand-600 hover:underline">
                  <FaPhoneAlt className="text-ink-400" size={12} /> {item.phone}
                </a>
                <p>Car Number: {item.carnum}</p>
                <p>License: {item.card}</p>
                <p>Region: {item.region}</p>
                <p>Town: {item.town}</p>
                <p className="text-xs text-ink-400">Joined {formatDate(item.dateCreated)}</p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {item.approved && <Badge tone="success">Approved</Badge>}
                {item.deactivate && <Badge tone="danger">Deactivated</Badge>}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2">
                <Button size="sm" variant="danger" onClick={() => handleConfirmation('delete', item._id)}>Delete</Button>
                {!item.approved && (
                  <Button size="sm" variant="primary" onClick={() => handleConfirmation('approve', item._id)}>Approve</Button>
                )}
                {item.approved && !item.deactivate && (
                  <Button size="sm" variant="secondary" onClick={() => handleConfirmation('deactivate', item._id)}>Deactivate</Button>
                )}
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
        danger={!!activeCopy.danger}
        onConfirm={confirmAction}
        onCancel={closeConfirmation}
      />
    </Container>
  );
};

export default Okada;
