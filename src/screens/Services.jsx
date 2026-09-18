import { useEffect, useState } from 'react';
import axios from 'axios';
import baseURL from '../assets/baseURL';
import { Link } from 'react-router-dom';
import {
  Container,
  PageHeader,
  Card,
  Badge,
  Button,
  Loader,
  EmptyState,
  ConfirmModal,
} from '../components/ui';

const Services = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetch(`${baseURL}services`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setProductFilter(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });

    fetch(`${baseURL}services/get/count`)
      .then((res) => res.json())
      .then((count) => setProductCount(count))
      .catch((err) => console.error('Error fetching count:', err));
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const handleDelete = (id) => setDeleteId(id);

  const confirmDelete = () => {
    axios.delete(`${baseURL}services/${deleteId}`)
      .then(() => {
        setProductFilter(prev => prev.filter(item => item.id !== deleteId));
        setProductCount(prev => prev - 1);
        setDeleteId(null);
      })
      .catch((err) => console.error(err));
  };

  const handleUpdateApproval = async (id) => {
    try {
      const response = await axios.put(`${baseURL}services/${id}/approve`);
      setProductFilter(prev =>
        prev.map(p => (p.id === id ? { ...p, approved: true } : p))
      );
    } catch (err) {
      console.error('Error approving service:', err);
    }
  };

  const handleUpdateBoost = async (id) => {
    try {
      const response = await axios.put(`${baseURL}services/${id}/boost`);
      const boostedProduct = data.find((p) => p.id === id);
      await axios.post(`${baseURL}boost`, {
        productname: boostedProduct.name,
        pagename: 'services',
      });
      alert(`${boostedProduct.name} Boosted Successfully`);
      setProductFilter(prev =>
        prev.map(p => (p.id === id ? { ...p, boost: true } : p))
      );
    } catch (err) {
      console.error('Error boosting service:', err);
    }
  };

  return (
    <Container>
      <PageHeader title="All Services" total={productCount} totalLabel="Total" />

      {loading ? (
        <Loader />
      ) : productFilter.length === 0 ? (
        <EmptyState title="No services found" subtitle="Service listings will appear here." />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productFilter.map((item) => (
            <Card hover key={item.id} className="overflow-hidden">
              <div className="grid grid-cols-2 gap-0.5 bg-ink-100">
                <img src={item.picture} alt="Main" className="h-32 w-full object-cover" />
                <img src={item.picturesec} alt="Secondary" className="h-32 w-full object-cover" />
              </div>
              {item.video ? (
                <video className="h-40 w-full bg-black" controls>
                  <source src={item.video} type="video/mp4" />
                </video>
              ) : null}
              <div className="space-y-1 p-4 text-sm text-ink-600">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-display text-base font-semibold text-ink-900">{item.name}</h2>
                  {item.approved ? <Badge tone="success">Approved</Badge> : <Badge tone="warning">Pending</Badge>}
                </div>
                <p>{item.description}</p>
                <p>{item.region}, {item.town}</p>
                <p>Phone: <a href={`tel:${item.phone}`} className="text-brand-600 hover:underline">{item.phone}</a></p>
                <p>
                  WhatsApp:{' '}
                  <a
                    href={`https://wa.me/${item.whatsapp}?text=Linkpii will require your picture and a picture of your Ghana card before the approval of ${item.name}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600 hover:underline"
                  >
                    {item.whatsapp}
                  </a>
                </p>
                <p>📍 {item.location}</p>
                <p>👁 Views: {item.views}</p>
                <Link to={`/user-detail/${item.author?._id}`} className="block font-medium text-brand-600 hover:underline">
                  Author: {item.author?.name}
                </Link>
                <p className="flex items-center gap-1">
                  Verified:
                  <Badge tone={item.author?.verified ? 'success' : 'danger'}>
                    {item.author?.verified ? 'Yes' : 'No'}
                  </Badge>
                </p>
                <p>Author Phone: {item.author?.phone}</p>
                <p className="text-xs text-ink-400">Posted: {formatDate(item.dateCreated)}</p>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>
                  {!item.approved && (
                    <Button size="sm" variant="primary" onClick={() => handleUpdateApproval(item.id)}>Approve</Button>
                  )}
                  <Button size="sm" variant="accent" onClick={() => handleUpdateBoost(item.id)}>Boost</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        title="Delete this service?"
        message="This removes the listing permanently. This cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Container>
  );
};

export default Services;
