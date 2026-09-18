import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import baseURL from '../assets/baseURL';
import {
  HiOutlineChevronLeft,
  HiOutlineShoppingBag,
  HiOutlineLocationMarker,
  HiOutlineEye,
  HiOutlineCheckCircle,
  HiPhone,
  HiChatAlt2,
  HiOutlineTag,
  HiOutlineFire,
  HiOutlineLightningBolt,
  HiOutlineXCircle,
} from 'react-icons/hi';
import { Container, Card, Badge, Loader } from './ui';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${baseURL}fashionpost/${id}`);
        setProduct(res.data);
        setActiveImage(res.data.picture);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Container>
        <Loader height="h-96" />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <div className="flex h-96 flex-col items-center justify-center gap-4">
          <h2 className="font-display text-xl font-bold text-ink-400">Product not found</h2>
          <button onClick={() => navigate(-1)} className="font-semibold text-brand-600 hover:underline">
            Go back
          </button>
        </div>
      </Container>
    );
  }

  const originalPrice = parseFloat(product.price);
  const discount = parseFloat(product.discount || 0);
  const discountedPrice = originalPrice - (originalPrice * discount) / 100;

  const formatFullDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Container className="pb-28">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1 text-sm font-semibold text-ink-500 hover:text-ink-900"
      >
        <HiOutlineChevronLeft /> Back
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* LEFT: media */}
        <div className="space-y-4 lg:col-span-5">
          <Card className="relative overflow-hidden">
            <img src={activeImage} alt={product.name} className="max-h-[560px] w-full object-contain" />
            <div className="absolute left-4 top-4 flex flex-col gap-1.5">
              {product.hot && (
                <Badge tone="danger">
                  <HiOutlineFire /> Hot Pick
                </Badge>
              )}
              {product.boost && (
                <Badge tone="brand">
                  <HiOutlineLightningBolt /> Boosted
                </Badge>
              )}
            </div>
          </Card>

          <div className="no-scrollbar flex gap-3 overflow-x-auto">
            {[product.picture, product.picturesec].filter(Boolean).map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(img)}
                className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                  activeImage === img ? 'border-brand-500' : 'border-ink-100 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} className="h-full w-full object-cover" alt="thumbnail" />
              </button>
            ))}
          </div>

          {product.video && (
            <Card className="overflow-hidden bg-ink-950">
              <video className="w-full" controls>
                <source src={product.video} type="video/mp4" />
              </video>
            </Card>
          )}
        </div>

        {/* RIGHT: info */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-8">
            <div className="mb-4 flex items-center justify-between">
              <Badge tone="brand">
                <HiOutlineTag /> {product.category?.name}
              </Badge>
              <span className="flex items-center gap-1.5 rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold text-ink-500">
                <HiOutlineEye /> {product.views} views
              </span>
            </div>

            <h1 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">{product.name}</h1>

            <div className="mb-8 mt-4 flex flex-wrap items-center gap-4 border-b border-ink-100 pb-8">
              <span className="font-display text-3xl font-bold text-brand-600">Gh₵{discountedPrice.toFixed(2)}</span>
              {discount > 0 && (
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-ink-400 line-through">Gh₵{originalPrice.toFixed(2)}</span>
                  <Badge tone="danger" className="mt-1 w-fit">
                    Save {discount}%
                  </Badge>
                </div>
              )}
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Location</p>
                <p className="mt-1 flex items-center gap-2 font-semibold text-ink-800">
                  <HiOutlineLocationMarker className="text-red-500" />
                  {product.location}, {product.town}, {product.region}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Condition</p>
                <p className="mt-1 flex items-center gap-2 font-semibold capitalize text-ink-800">
                  <HiOutlineShoppingBag className="text-brand-500" />
                  {product.condition}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Phone Number</p>
                <a href={`tel:${product.phone}`} className="mt-1 flex items-center gap-2 font-semibold text-brand-600 hover:underline">
                  <HiPhone size={16} /> {product.phone}
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">WhatsApp Number</p>
                <a
                  href={`https://wa.me/${product.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 flex items-center gap-2 font-semibold text-emerald-600 hover:underline"
                >
                  <HiChatAlt2 size={16} /> {product.whatsapp}
                </a>
              </div>
            </div>

            <Card className="mb-8 grid grid-cols-1 gap-4 bg-ink-50 p-5 sm:grid-cols-2">
              <div className="text-xs font-medium text-ink-500">
                <p className="mb-1 text-[10px] uppercase tracking-widest text-ink-400">Boost Analytics</p>
                <p>🚀 Total Boosts: {product.numofBoost || 0}</p>
                <p>📅 Last Boost: {formatFullDate(product.dateBoost)}</p>
              </div>
              <div className="text-xs font-medium text-ink-500">
                <p className="mb-1 text-[10px] uppercase tracking-widest text-ink-400">Trend Analytics</p>
                <p>🔥 Total Hot: {product.numofHot || 0}</p>
                <p>📅 Last Hot: {formatFullDate(product.dateHot)}</p>
              </div>
              <div className="col-span-full flex items-center justify-between border-t border-ink-200 pt-3 text-xs font-medium text-ink-500">
                <span>Posted: {formatFullDate(product.dateCreated)}</span>
                <Badge tone={product.approved ? 'success' : 'danger'}>
                  {product.approved ? 'Approved' : 'Not Approved'}
                </Badge>
              </div>
            </Card>

            <div className="mb-8">
              <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-900">
                <span className="h-0.5 w-6 bg-brand-500" /> Product Description
              </h3>
              <p className="leading-relaxed text-ink-600">{product.description || 'No additional description provided.'}</p>
            </div>

            <Card className="flex items-center justify-between bg-ink-950 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 font-display text-lg font-bold text-white">
                  {product.author?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <Link to={`/user-detail/${product.author?._id}`} className="font-display text-sm font-bold text-white hover:text-brand-300">
                      {product.author?.name}
                    </Link>
                    {product.author?.verified ? (
                      <HiOutlineCheckCircle className="text-brand-400" size={16} />
                    ) : (
                      <HiOutlineXCircle className="text-red-400" size={16} />
                    )}
                  </div>
                  <p className={`mt-0.5 text-xs font-semibold uppercase tracking-wide ${product.author?.verified ? 'text-brand-400' : 'text-red-400'}`}>
                    {product.author?.verified ? 'Verified Seller' : 'Not Verified'}
                  </p>
                </div>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-[10px] font-bold uppercase text-ink-400">Seller Since</p>
                <p className="text-xs font-semibold text-white">
                  {product.author?.dateCreated ? new Date(product.author.dateCreated).getFullYear() : '—'}
                </p>
              </div>
            </Card>
          </Card>
        </div>
      </div>

      {/* Floating action bar */}
      <div className="fixed bottom-6 left-1/2 z-40 flex w-[92%] max-w-lg -translate-x-1/2 gap-2 rounded-full border border-white/10 bg-ink-950/95 p-2 shadow-card-hover backdrop-blur">
        <a
          href={`tel:${product.phone}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white/10 py-3.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-white/20"
        >
          <HiPhone size={16} className="text-brand-400" /> Call Seller
        </a>
        <a
          href={`https://wa.me/${product.whatsapp}?text=Hi, I am interested in "${product.name}".`}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-500 py-3.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-emerald-600"
        >
          <HiChatAlt2 size={16} /> WhatsApp
        </a>
      </div>
    </Container>
  );
};

export default Detail;
