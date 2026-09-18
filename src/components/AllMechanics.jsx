import { useEffect, useState } from 'react';
import axios from 'axios';
import baseURL from '../assets/baseURL';
import {
  Container,
  PageHeader,
  Card,
  Button,
  Loader,
  EmptyState,
  ConfirmModal,
} from './ui';

const AllMechanics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState([]);
  const [productCount, setProductCount] = useState(0); // New state for product count
  const [confirmationPopup, setConfirmationPopup] = useState({ visible: false, action: null, itemId: null });

  const apiGet = () => {
    fetch(`${baseURL}mechanics`)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
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
      const response = await fetch(`${baseURL}mechanics/get/count`);
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

  const confirmAction = () => {
    const { action, itemId } = confirmationPopup;
    if (action === 'delete') {
      axios.delete(`${baseURL}mechanics/${itemId}`)
        .then(() => {
          const products = productFilter.filter((item) => item.id !== itemId);
          setProductCount(productCount - 1);
          setProductFilter(products);
          closeConfirmation();
        })
        .catch((error) => {
          console.log(error);
          closeConfirmation();
        });
    } else if (action === 'approve') {
      axios.put(`${baseURL}mechanics/${itemId}/approve`)
        .then((response) => {
          const updatedProduct = response.data;

          setProductFilter((prevProducts) => {
            return prevProducts.map((product) => {
              if (product.id === itemId) {
                return { ...product, approved: true };
              }
              return product;
            });
          });

          console.log('Product approval updated:', updatedProduct);
          closeConfirmation();
        })
        .catch((error) => {
          console.error('Error updating product approval:', error);
          closeConfirmation();
        });
    }
  };

  const confirmCopy = {
    delete: { title: 'Delete this mechanic?', message: 'This removes the mechanic listing permanently. This cannot be undone.', confirmLabel: 'Delete', danger: true },
    approve: { title: 'Approve this mechanic?', message: 'This will make the mechanic listing visible to the public.', confirmLabel: 'Approve' },
  };
  const activeCopy = confirmCopy[confirmationPopup.action] || {};

  return (
    <Container>
      <PageHeader title="All Mechanics" total={productCount} totalLabel="Total Mechanics" />

      {loading ? (
        <Loader />
      ) : productFilter.length === 0 ? (
        <EmptyState title="No mechanics found" subtitle="Mechanic listings will appear here once submitted." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productFilter.map((item) => (
            <Card hover key={item.id} className="flex flex-col p-5">
              <img width={500} height={500} src={item.picture} alt="Mechanic" className="h-40 w-full rounded-xl object-cover" />

              <p className="mt-4 font-display text-base font-semibold text-ink-900">{item.name}</p>

              <div className="mt-1 space-y-1 text-sm text-ink-600">
                <a href={`tel:${item.phone}`} className="block hover:text-brand-600 hover:underline">Phone: {item.phone}</a>
                <p>{item.region}</p>
                <p>{item.town}</p>
                <p>{item.location}</p>
                <p>{item.services}</p>
                <p>Views: {item.views}</p>
                <p className="text-xs text-ink-400">Joined {formatDate(item.dateCreated)}</p>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2">
                <Button size="sm" variant="danger" onClick={() => handleConfirmation('delete', item.id)}>Delete</Button>
                {!item.approved && (
                  <Button size="sm" variant="primary" onClick={() => handleConfirmation('approve', item.id)}>Approve</Button>
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
        danger={confirmationPopup.action === 'delete'}
        onConfirm={confirmAction}
        onCancel={closeConfirmation}
      />
    </Container>
  );
};

export default AllMechanics;
