import { useEffect, useState } from 'react';
import axios from 'axios';
import baseURL from '../assets/baseURL';
import { FcCallTransfer } from "react-icons/fc";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Container, PageHeader, SearchInput, Card, Button, Badge, Loader, EmptyState, ConfirmModal } from '../components/ui';

const Call = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productFilter, setProductFilter] = useState([]);
    const [productCount, setProductCount] = useState(0);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

  const apiGet = () => {
    fetch(`${baseURL}call`)
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        setProductFilter(json);
        setLoading(false);
        console.log(data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  const fetchProductCount = async () => {
    try {
      const response = await fetch(`${baseURL}call/get/count`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const productCount = await response.json();
      setProductCount(productCount);
    } catch (error) {
      console.error('Error fetching product count:', error.message);
    }
  };

  useEffect(() => {
    apiGet();
    fetchProductCount();
  }, []);

  const formatDateTime = (dateTimeString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date(dateTimeString).toLocaleString(undefined, options);
};

const currentDateTime = new Date().toISOString(); // Get current date and time in ISO format
const currentTimeFormatted = formatDateTime(currentDateTime); // Format the current date and time
console.log(currentTimeFormatted);

const mapsUrl = (lat, lng) => `https://www.google.com/maps?q=${lat},${lng}`;

  const handleDelete = (id) => {
    setShowConfirmation(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    axios.delete(
      `${baseURL}call/${deleteId}`
    )
      .then((res) => {
        const products = productFilter.filter((item) => item._id !== deleteId);
        setProductCount(productCount - 1);
        setProductFilter(products);
        setShowConfirmation(false);
      })
      .catch((error) => console.log(error));
  };

  const handleSearch = () => {
    let filteredProducts;
    if (searchTerm === '') {
      // If search term is empty, display all products
      filteredProducts = data;
    } else {
      // If search term is provided, filter based on the original data array
      filteredProducts = data.filter((item) => {
        const itemName = (item.name || '').toLowerCase();

        const itemReceiverPhone = (item.receiverphone || '').toLowerCase();
        const itemPhone = (item.phone || '').toLowerCase();
        const itemRecname = (item.recname || '').toLowerCase();
        const searchTermLower = searchTerm.toLowerCase();

        return (
          itemName.includes(searchTermLower) ||
          itemRecname.includes(searchTermLower) ||
          itemReceiverPhone.includes(searchTermLower) ||
          itemPhone.includes(searchTermLower)
        );
      });
    }
    setProductFilter(filteredProducts);
  };

  const handleClear=()=> {
    setSearchTerm("")
    setProductFilter(data)
  }


  const handleWhatsApp = (phone, item) => {
    let formattedPhone = phone.startsWith('0') ? phone.slice(1) : phone;
    formattedPhone = formattedPhone.startsWith('+') ? formattedPhone.slice(1) : formattedPhone;
    const internationalPhone = `${formattedPhone}`;

    const message = encodeURIComponent(
      `Hello! You called ${item.recname} on Linkpii.com. Were you able to reach out to the business?`
    );

    const whatsappUrl = `https://wa.me/${internationalPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');  // Opens WhatsApp in a new tab
};


const handleCall = (phone) => {
  // Format phone number if needed, like removing spaces or adding country code
  const formattedPhone = phone ? phone : `+${phone}`;
  window.open(`tel:${formattedPhone}`, '_self');  // Opens phone dialer
console.log(formattedPhone)
};

const handleWhatsAppBusi = (receiverphone, item) => {
  let formattedPhone = receiverphone.startsWith('0') ? receiverphone.slice(1) : receiverphone;
  formattedPhone = formattedPhone.startsWith('+') ? formattedPhone.slice(1) : formattedPhone;
  const internationalPhone = `${formattedPhone}`;

  const message = encodeURIComponent(
    `Hello! You were whatsapped by ${item.name}on Linkpii.com. Was the client able to reach out to you?`
  );

  const whatsappUrl = `https://wa.me/${internationalPhone}?text=${message}`;
  window.open(whatsappUrl, '_blank');  // Opens WhatsApp in a new tab
};

  return (
    <Container>
      <PageHeader title="All Calls" total={productCount} totalLabel="Total Calls" />

      <SearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onSearch={handleSearch}
        onClear={handleClear}
        placeholder="Search by name or phone number"
        className="mb-6"
      />

      {loading ? (
        <Loader />
      ) : productFilter.length === 0 ? (
        <EmptyState title="No call requests found" subtitle="Try a different search term." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productFilter.map((item) => {
            const lat = item.userlocation?.latitude;
            const lng = item.userlocation?.longitude;
            const hasExactLocation = typeof lat === 'number' && typeof lng === 'number';

            return (
            <Card hover key={item._id} className="flex flex-col p-5">
              <div className="mb-2 flex items-center justify-between">
                <FcCallTransfer size={34} />
                <Badge tone={hasExactLocation ? 'success' : 'warning'}>
                  {hasExactLocation ? 'Exact location shared' : 'No GPS location'}
                </Badge>
              </div>
              <p className="text-sm text-ink-700">
                {item.name} with phone number: {item.phone} and mail: {item.email}
              </p>
              <p className="mt-1 text-sm font-semibold text-red-500">
                Called {item.recname} on {item.receiverphone}
              </p>
              <p className="mt-2 text-xs text-ink-400">{formatDateTime(item.dateCreated)}</p>
              <p className="text-xs text-ink-400">{item?.pagename}</p>

              <div className="mt-3 rounded-xl border border-dashed border-ink-200 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Exact GPS location</p>
                {hasExactLocation ? (
                  <>
                    <p className="mt-0.5 font-mono text-xs text-ink-600">
                      {lat.toFixed(6)}, {lng.toFixed(6)}
                    </p>
                    <a
                      href={mapsUrl(lat, lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline"
                    >
                      <FaMapMarkerAlt size={12} /> Open in Google Maps
                    </a>
                  </>
                ) : (
                  <p className="mt-0.5 text-sm text-ink-500">
                    The caller's device didn't share a GPS pin for this call.
                  </p>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button size="sm" variant="secondary" onClick={() => handleCall(item.phone)}>
                  Call
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  className="!bg-emerald-600 hover:!bg-emerald-700"
                  onClick={() => handleWhatsApp(item.phone, item)}
                >
                  WhatsApp
                </Button>
                <Button size="sm" variant="secondary" onClick={() => handleCall(item.receiverphone)}>
                  Call Business
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  className="!bg-emerald-600 hover:!bg-emerald-700"
                  onClick={() => handleWhatsAppBusi(item.receiverphone, item)}
                >
                  WhatsApp Business
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  className="col-span-2"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </Button>
              </div>
            </Card>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={showConfirmation}
        title="Delete this call record?"
        message="This removes the call request permanently. This cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirmation(false)}
      />
    </Container>
  );
};

export default Call;
