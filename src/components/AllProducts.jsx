import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import baseURL from '../assets/baseURL';
import {
  Container,
  PageHeader,
  Card,
  Badge,
  Button,
  Loader,
  EmptyState,
  ConfirmModal,
} from './ui';

const AllProducts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [confirmationPopup, setConfirmationPopup] = useState({ visible: false, action: null, id: null });

  useEffect(() => {
    fetch(`${baseURL}send`)
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

    fetch(`${baseURL}send/get/count`)
      .then((res) => res.json())
      .then((count) => setProductCount(count))
      .catch((error) => console.error('Error fetching product count:', error));
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const handleDelete = (id) => {
    setConfirmationPopup({ visible: true, action: 'delete', id });
  };

  const confirmDelete = () => {
    const { id } = confirmationPopup;
    axios.delete(`${baseURL}send/${id}`)
      .then(() => {
        const updated = productFilter.filter(item => item.id !== id);
        setProductFilter(updated);
        setProductCount(prev => prev - 1);
      })
      .catch((error) => console.error(error));
  };

  const handleUpdateApproval = (id) => {
    setConfirmationPopup({ visible: true, action: 'approve', id });
  };

  const confirmApprove = () => {
    const { id } = confirmationPopup;
    axios.put(`${baseURL}send/${id}/approve`)
      .then(({ data }) => {
        const updated = productFilter.map(product =>
          product.id === id ? { ...product, approved: true } : product
        );
        setProductFilter(updated);
      })
      .catch((error) => console.error('Error approving product:', error));
  };

  const handleUpdateBoost = (id) => {
    setConfirmationPopup({ visible: true, action: 'boost', id });
  };

  const confirmBoost = () => {
    const { id } = confirmationPopup;
    axios.put(`${baseURL}send/${id}/boost`)
      .then(({ data }) => {
        const updated = productFilter.map(product =>
          product.id === id ? { ...product, boost: true } : product
        );
        setProductFilter(updated);
      })
      .catch((error) => console.error('Error boosting product:', error));
  };

  const handleEdit = (id) => {
    setConfirmationPopup({ visible: true, action: 'edit', id });
  };

  const closeConfirmation = () => setConfirmationPopup({ visible: false, action: null, id: null });

  const confirmAction = () => {
    const { action } = confirmationPopup;
    if (action === 'delete') confirmDelete();
    else if (action === 'approve') confirmApprove();
    else if (action === 'boost') confirmBoost();
    else if (action === 'edit') {
      window.location.href = `/agricedit/${confirmationPopup.id}`;
      return;
    }
    closeConfirmation();
  };

  const confirmCopy = {
    delete: { title: 'Delete this product?', message: 'This removes the listing permanently. This cannot be undone.', confirmLabel: 'Delete', danger: true },
    approve: { title: 'Approve this product?', message: 'The listing will become visible to buyers.', confirmLabel: 'Approve' },
    boost: { title: 'Boost this product?', message: 'This will feature the listing more prominently.', confirmLabel: 'Boost' },
    edit: { title: 'Edit this product?', message: 'You will be taken to the edit screen.', confirmLabel: 'Continue' },
  };
  const activeCopy = confirmCopy[confirmationPopup.action] || {};

  return (
    <Container>
      <PageHeader title="All Agric Products" total={productCount} totalLabel="Total" />

      {loading ? (
        <Loader />
      ) : productFilter.length === 0 ? (
        <EmptyState title="No products found" subtitle="Agric product listings will appear here." />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productFilter.map((item) => (
            <Card hover key={item.id} className="overflow-hidden">
              <div className="grid grid-cols-2 gap-0.5 bg-ink-100">
                <img src={item.picture} alt="Main" className="h-28 w-full object-cover" />
                <img src={item.picturesec} alt="Secondary" className="h-28 w-full object-cover" />
              </div>
              {item.video ? (
                <video className="h-40 w-full bg-black" controls>
                  <source src={item.video} type="video/mp4" />
                </video>
              ) : null}

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-display text-base font-semibold text-ink-900">{item.name}</h2>
                  {item.approved ? (
                    <Badge tone="success">Approved</Badge>
                  ) : (
                    <Badge tone="warning">Pending</Badge>
                  )}
                </div>
                <p className="mt-1 font-display text-lg font-bold text-brand-600">Gh₵{item.price}</p>
                <p className="mt-1 line-clamp-2 text-sm text-ink-600">{item.description}</p>
                <p className="mt-1 text-sm text-ink-500">{item.region}, {item.town}</p>
                <p className="mt-0.5 text-xs text-ink-400">{formatDate(item.dateCreated)}</p>

                <div className="mt-3 space-y-1 border-t border-ink-100 pt-3 text-sm text-ink-600">
                  <p>📞 {item.phone}</p>
                  <p>💬 {item.whatsapp}</p>
                  <p>📍 {item.location}</p>
                  <p>👁 Views: {item.views}</p>
                  <Link to={`/user-detail/${item.author?._id}`} className="block font-medium text-brand-600 hover:underline">
                    Author: {item?.author?.name}
                  </Link>
                  <p className="flex items-center gap-1">
                    Verified:
                    <Badge tone={item?.author?.verified ? 'success' : 'danger'}>
                      {item?.author?.verified ? 'Yes' : 'No'}
                    </Badge>
                  </p>
                  <p>📞 {item?.author?.phone}</p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>
                  {!item.approved && (
                    <Button size="sm" variant="primary" onClick={() => handleUpdateApproval(item.id)}>Approve</Button>
                  )}
                  <Button size="sm" variant="accent" onClick={() => handleUpdateBoost(item.id)}>Boost</Button>
                  <Button size="sm" variant="secondary" onClick={() => handleEdit(item.id)}>Edit</Button>
                </div>
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

export default AllProducts;
