import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Spinner, Badge } from 'flowbite-react';
import axios from 'axios';
import baseURL from '../assets/baseURL';
import { 
  HiOutlineChevronLeft, HiOutlineShoppingBag, HiOutlineLocationMarker, 
  HiOutlineCalendar, HiOutlineEye, HiOutlineCheckCircle, HiPhone, HiChatAlt2,
  HiOutlineTag,
  HiOutlineFire, HiOutlineLightningBolt, HiOutlineXCircle
} from "react-icons/hi";


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
        console.log("Fetched Product Data:", res.data);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Spinner size="xl" color="info" />
    </div>
  );

  if (!product) return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-black text-gray-300 uppercase">Product Not Found</h2>
      <button onClick={() => navigate(-1)} className="text-blue-600 font-bold underline">Go Back</button>
    </div>
  );

  const originalPrice = parseFloat(product.price);
  const discount = parseFloat(product.discount || 0);
  const discountedPrice = originalPrice - (originalPrice * discount / 100);

  const formatFullDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  };

 
  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-32">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <HiOutlineChevronLeft size={24} />
        </button>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Product Specification</span>
        <div className="w-10" />
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-10 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: MEDIA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100 relative group shadow-sm">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full h-auto object-contain max-h-[700px] transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-6 left-6 flex flex-col gap-2">
                {product.hot && <Badge color="failure" icon={HiOutlineFire} size="sm">HOT PICK</Badge>}
                {product.boost && <Badge color="indigo" icon={HiOutlineLightningBolt} size="sm">BOOSTED</Badge>}
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto py-2 no-scrollbar">
            {[product.picture, product.picturesec].filter(Boolean).map((img, index) => (
              <button 
                key={index} 
                onClick={() => setActiveImage(img)}
                className={`shrink-0 w-24 h-24 rounded-2xl border-2 overflow-hidden transition-all duration-300 ${activeImage === img ? 'border-blue-600 scale-95 shadow-lg' : 'border-gray-100 opacity-50 hover:opacity-100'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
              </button>
            ))}
          </div>

          {product.video && (
            <div className="rounded-[2.5rem] overflow-hidden bg-black aspect-video border-4 border-white shadow-xl">
              <video className="w-full h-full" controls>
                <source src={product.video} type="video/mp4" />
              </video>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: INFO */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-gray-50">
            
            <div className="flex justify-between items-center mb-6">
              <Badge color="info" icon={HiOutlineTag} className="uppercase">{product.category?.name}</Badge>
              <div className="flex items-center gap-1.5 text-gray-400 font-bold text-xs bg-gray-50 px-3 py-1 rounded-full">
                <HiOutlineEye size={14} /> {product.views} Views
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] uppercase mb-6 tracking-tighter">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-6 mb-10 pb-10 border-b border-gray-50">
              <div className="text-5xl font-black text-gray-900">₵{discountedPrice.toFixed(2)}</div>
              {discount > 0 && (
                <div className="flex flex-col">
                  <span className="text-xl text-gray-300 line-through font-bold">₵{originalPrice.toFixed(2)}</span>
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded mt-1 uppercase">SAVE {discount}%</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-12">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Location</p>
                <div className="flex items-center gap-2 font-bold text-gray-700">
                  <HiOutlineLocationMarker className="text-red-500" />
                  {product.location}, {product.town}, {product.region}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Condition</p>
                <div className="flex items-center gap-2 font-bold text-gray-700 capitalize">
                  <HiOutlineShoppingBag className="text-blue-500" />
                  {product.condition}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Phone Number</p>
                <a href={`tel:${product.phone}`} className="flex items-center gap-2 font-bold text-blue-600 hover:underline">
                  <HiPhone size={16} /> {product.phone}
                </a>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">WhatsApp Number</p>
                <a href={`https://wa.me/${product.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-bold text-green-600 hover:underline">
                  <HiChatAlt2 size={16} /> {product.whatsapp}
                </a>
              </div>
            </div>

            {/* --- ADMINISTRATIVE DATA (Approved/Not Approved) --- */}
            <div className="bg-gray-50 rounded-3xl p-6 mb-12 grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-100 shadow-inner">
               <div className="text-[11px] font-bold text-gray-500">
                  <p className="uppercase text-[9px] mb-1 text-gray-400 tracking-widest">Boost Analytics</p>
                  <p>🚀 Total Boosts: {product.numofBoost || 0}</p>
                  <p>📅 Last Boost: {formatFullDate(product.dateBoost)}</p>
               </div>
               <div className="text-[11px] font-bold text-gray-500">
                  <p className="uppercase text-[9px] mb-1 text-gray-400 tracking-widest">Trend Analytics</p>
                  <p>🔥 Total Hot: {product.numofHot || 0}</p>
                  <p>📅 Last Hot: {formatFullDate(product.dateHot)}</p>
               </div>
               <div className="col-span-full border-t border-gray-200 pt-3 mt-2 text-[11px] font-bold text-gray-400 flex justify-between items-center">
                  <span>Posted: {formatFullDate(product.dateCreated)}</span>
                  <div className="flex items-center gap-1">
                    <span className="uppercase text-[9px]">Product Status:</span>
                    <span className={product.approved ? "text-green-500" : "text-red-500"}>
                       {product.approved ? "APPROVED" : "NOT APPROVED"}
                    </span>
                  </div>
               </div>
            </div>

            <div className="mb-12">
              <h3 className="text-xs font-black text-gray-900 uppercase mb-4 flex items-center gap-2">
                <div className="w-6 h-[2px] bg-blue-600"></div>
                Product Description
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg font-medium">
                {product.description || 'No additional description provided.'}
              </p>
            </div>

            {/* --- SELLER CARD (Verified/Not Verified) --- */}
            <div className="bg-gray-900 rounded-[2.5rem] p-6 flex items-center justify-between border border-gray-800 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-xl font-black text-white">
                  {product.author?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <Link to={`/user-detail/${product.author?._id}`} className="text-white font-black uppercase text-sm hover:text-blue-400">
                      {product.author?.name}
                    </Link>
                    {product.author?.verified ? (
                       <HiOutlineCheckCircle className="text-blue-400" size={18} />
                    ) : (
                       <HiOutlineXCircle className="text-red-400" size={18} />
                    )}
                  </div>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${product.author?.verified ? 'text-blue-400' : 'text-red-400'}`}>
                    {product.author?.verified ? 'Verified Seller' : 'Not Verified'}
                  </p>
                </div>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-[10px] font-black text-gray-600 uppercase">Seller Since</p>
                <p className="text-xs font-bold text-white">{new Date(product.author?.dateCreated).getFullYear() || '2024'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING ACTION BAR */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-gray-900/95 backdrop-blur-2xl rounded-full p-2 flex gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.4)] z-[60] border border-white/10">
        <a href={`tel:${product.phone}`} className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/10 text-white rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-white/20 transition-all">
          <HiPhone size={18} className="text-blue-400" /> Call Seller
        </a>
        <a href={`https://wa.me/${product.whatsapp}?text=Hi, I am interested in "${product.name}".`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-3 py-4 bg-green-500 text-white rounded-full font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-green-600 transition-all">
          <HiChatAlt2 size={18} /> WhatsApp
        </a>
      </div>
    </div>
  );
};

export default Detail;