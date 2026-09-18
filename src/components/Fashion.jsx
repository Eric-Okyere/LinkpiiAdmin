import { useEffect, useState } from 'react';
import axios from 'axios';
import baseURL from '../assets/baseURL';
import { Link } from 'react-router-dom';
import {
  HiPhone,
  HiOutlineChatAlt2,
  HiOutlineEye,
  HiOutlineTag,
  HiOutlineLocationMarker,
  HiOutlineFire,
  HiOutlineLightningBolt,
  HiOutlineInformationCircle,
  HiTrash,
  HiPencilAlt,
} from 'react-icons/hi';
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

const Fashion = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal IDs
  const [deleteId, setDeleteId] = useState(null);
  const [hotId, setHotId] = useState(null);
  const [approveId, setApproveId] = useState(null);
  const [boostId, setBoostId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, countRes] = await Promise.all([
        fetch(`${baseURL}fashionpost`).then((res) => res.json()),
        fetch(`${baseURL}fashionpost/get/count`).then((res) => res.json()),
      ]);
      setData(productsRes);
      setProductFilter(productsRes);
      setProductCount(countRes);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = () => {
    const filtered = data.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setProductFilter(filtered);
  };

  const handleClear = () => {
    setSearchTerm('');
    setProductFilter(data);
  };

  const updateStatus = async (id, endpoint, field) => {
    try {
      await axios.put(`${baseURL}fashionpost/${id}/${endpoint}`);
      setProductFilter((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: true } : p)));
      if (endpoint === 'boost') alert('Product Boosted!');
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${baseURL}fashionpost/${deleteId}`);
      setProductFilter((prev) => prev.filter((item) => item.id !== deleteId));
      setProductCount((prev) => prev - 1);
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <Container>
      <PageHeader title="Fashion" total={productCount} totalLabel="Total Products" />

      <SearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onSearch={handleSearch}
        onClear={handleClear}
        placeholder="Find items or categories..."
        className="mb-6"
      />

      {loading ? (
        <Loader />
      ) : productFilter.length === 0 ? (
        <EmptyState title="No fashion listings found" subtitle="Try a different search term." />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productFilter.map((item) => {
            const originalPrice = parseFloat(item.price);
            const discount = parseFloat(item.discount || 0);
            const discountedPrice = originalPrice - (originalPrice * discount) / 100;

            return (
              <Card hover key={item.id} className="flex flex-col overflow-hidden">
                <Link to={`/detail/${item.id}`} className="relative block">
                  <img src={item.picture} alt={item.name} className="h-48 w-full object-cover" />
                  <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                    {item.hot && (
                      <Badge tone="danger">
                        <HiOutlineFire /> Hot
                      </Badge>
                    )}
                    {item.boost && (
                      <Badge tone="brand">
                        <HiOutlineLightningBolt /> Boosted
                      </Badge>
                    )}
                    {item.approved ? (
                      <Badge tone="success">Live</Badge>
                    ) : (
                      <Badge tone="warning">Pending Approval</Badge>
                    )}
                  </div>
                </Link>

                {item.video && (
                  <video className="w-full" controls>
                    <source src={item.video} type="video/mp4" />
                  </video>
                )}

                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/detail/${item.id}`}>
                      <h2 className="font-display font-semibold text-ink-900 hover:text-brand-600">
                        {item.name}
                      </h2>
                    </Link>
                    <span className="flex shrink-0 items-center gap-1 rounded-md bg-ink-100 px-2 py-1 text-xs font-semibold text-ink-500">
                      <HiOutlineEye /> {item.views}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-bold text-brand-600">Gh₵{discountedPrice.toFixed(2)}</span>
                    {discount > 0 && (
                      <span className="text-sm text-ink-400 line-through">Gh₵{originalPrice.toFixed(2)}</span>
                    )}
                  </div>

                  <div className="mt-3 space-y-1.5 border-t border-ink-100 pt-3 text-xs font-medium text-ink-500">
                    <p className="flex items-center gap-1.5">
                      <HiOutlineTag className="text-brand-500" /> {item.category?.name} · {item.condition}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <HiOutlineLocationMarker className="text-red-500" /> {item.town}, {item.region}
                    </p>
                    <p>Posted {formatDate(item.dateCreated)}</p>
                  </div>

                  <div className="mt-3 flex items-center justify-between rounded-xl bg-ink-50 p-2.5">
                    <Link
                      to={`/user-detail/${item.author?._id}`}
                      className="flex items-center gap-2 truncate text-xs font-semibold text-ink-700 hover:text-brand-600"
                    >
                      <FaUserCircle className="shrink-0 text-ink-400" />
                      {item.author?.name || 'Private User'}
                    </Link>
                    <div className="flex gap-1.5">
                      <a
                        href={`tel:${item.phone}`}
                        className="rounded-full border border-ink-200 bg-white p-1.5 text-brand-600"
                      >
                        <HiPhone size={14} />
                      </a>
                      <a
                        href={`https://wa.me/${item.whatsapp}?text=Linkpii will require your picture and a picture of your Ghana card before the approval of your product. Your documents are encrypted and secure. We do not share or misuse your data.`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-ink-200 bg-white p-1.5 text-emerald-600"
                      >
                        <HiOutlineChatAlt2 size={14} />
                      </a>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-4 gap-2">
                    <Link
                      to={`/detail/${item.id}`}
                      className="flex items-center justify-center rounded-xl bg-ink-100 py-2 text-ink-600 hover:bg-brand-50 hover:text-brand-600"
                    >
                      <HiOutlineInformationCircle size={18} />
                    </Link>
                    <Link
                      to={`/fashionedit/${item.id}`}
                      className="flex items-center justify-center rounded-xl bg-ink-100 py-2 text-ink-600 hover:bg-amber-50 hover:text-amber-600"
                    >
                      <HiPencilAlt size={16} />
                    </Link>
                    <button
                      onClick={() => setBoostId(item.id)}
                      className="flex items-center justify-center rounded-xl bg-brand-50 py-2 text-brand-600 hover:bg-brand-100"
                    >
                      <HiOutlineLightningBolt size={16} />
                    </button>
                    <button
                      onClick={() => setHotId(item.id)}
                      className="flex items-center justify-center rounded-xl bg-red-50 py-2 text-red-600 hover:bg-red-100"
                    >
                      <HiOutlineFire size={16} />
                    </button>
                  </div>

                  {!item.approved && (
                    <Button variant="primary" size="sm" className="mt-2 w-full" onClick={() => setApproveId(item.id)}>
                      Approve Listing
                    </Button>
                  )}
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="mt-2 flex items-center justify-center gap-1 text-xs font-semibold text-red-400 hover:text-red-600"
                  >
                    <HiTrash size={12} /> Delete
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={!!approveId}
        title="Approve this product?"
        confirmLabel="Approve"
        onConfirm={() => {
          updateStatus(approveId, 'approve', 'approved');
          setApproveId(null);
        }}
        onCancel={() => setApproveId(null)}
      />
      <ConfirmModal
        open={!!boostId}
        title="Boost this product?"
        confirmLabel="Boost"
        onConfirm={() => {
          updateStatus(boostId, 'boost', 'boost');
          setBoostId(null);
        }}
        onCancel={() => setBoostId(null)}
      />
      <ConfirmModal
        open={!!hotId}
        title="Mark this product as Hot?"
        confirmLabel="Mark as Hot"
        onConfirm={() => {
          updateStatus(hotId, 'hot', 'hot');
          setHotId(null);
        }}
        onCancel={() => setHotId(null)}
      />
      <ConfirmModal
        open={!!deleteId}
        title="Delete this product?"
        message="This removes the product and all associated media. This cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Container>
  );
};

export default Fashion;
