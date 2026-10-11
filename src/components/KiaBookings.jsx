import { useEffect, useMemo, useState } from 'react';
import baseURL from '../assets/baseURL';
import axios from 'axios';
import { FaPhoneAlt, FaMapMarkerAlt, FaCopy } from 'react-icons/fa';
import {
  Container,
  PageHeader,
  Card,
  Badge,
  Button,
  Loader,
  EmptyState,
  ConfirmModal,
  SearchInput,
} from './ui';

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown date';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const mapsUrl = (lat, lng) => `https://www.google.com/maps?q=${lat},${lng}`;

const buildDriverSummary = (item) => {
  const lat = item.userlocation?.latitude;
  const lng = item.userlocation?.longitude;
  const lines = [
    `Pickup for ${item.username || 'customer'} (${item.userphone || 'no phone'}):`,
    [item.location, item.town, item.region].filter(Boolean).join(', ') || null,
    item.product ? `Carrying: ${item.product}${item.packagesize ? ` - ${item.packagesize}` : ''}` : null,
    item.datepick || item.time ? `When: ${[item.datepick, item.time].filter(Boolean).join(' at ')}` : null,
    `Drop-off: ${[item.deslocation, item.destown, item.desregion].filter(Boolean).join(', ')}`,
    lat != null && lng != null ? `Exact location: ${mapsUrl(lat, lng)}` : null,
  ].filter(Boolean);
  return lines.join('\n');
};

const KiaBookings = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirmationPopup, setConfirmationPopup] = useState({ visible: false, itemId: null });
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetch(`${baseURL}appointment`)
      .then((response) => response.json())
      .then((json) => {
        const sorted = [...json].sort((a, b) => new Date(b.date) - new Date(a.date));
        setData(sorted);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((item) => {
      const haystack = [
        item.username,
        item.drivername,
        item.product,
        item.region,
        item.town,
        item.location,
        item.desregion,
        item.destown,
        item.deslocation,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [data, search]);

  const handleDelete = (itemId) => setConfirmationPopup({ visible: true, itemId });
  const closeConfirmation = () => setConfirmationPopup({ visible: false, itemId: null });

  const confirmDelete = async () => {
    const { itemId } = confirmationPopup;
    try {
      await axios.delete(`${baseURL}appointment/${itemId}`);
      setData((prev) => prev.filter((item) => item._id !== itemId));
    } catch (error) {
      console.error('Error deleting booking:', error);
    } finally {
      closeConfirmation();
    }
  };

  const handleCopy = async (item) => {
    try {
      await navigator.clipboard.writeText(buildDriverSummary(item));
      setCopiedId(item._id);
      setTimeout(() => setCopiedId((id) => (id === item._id ? null : id)), 2000);
    } catch (error) {
      console.error('Clipboard write failed:', error);
    }
  };

  return (
    <Container>
      <PageHeader
        title="KIA Bookings"
        subtitle="Appointments booked for KIA pickups - find the customer's exact location here to pass on to the driver."
        total={data.length}
        totalLabel="Total Bookings"
      />

      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch('')}
        placeholder="Search by customer, driver, or location..."
        className="mb-6"
      />

      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No bookings found"
          subtitle={
            data.length === 0
              ? 'Bookings will appear here once customers order a KIA to move their products.'
              : 'No bookings match your search.'
          }
          icon={FaMapMarkerAlt}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((item) => {
            const lat = item.userlocation?.latitude;
            const lng = item.userlocation?.longitude;
            const hasExactLocation = typeof lat === 'number' && typeof lng === 'number';

            return (
              <Card key={item._id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-base font-semibold text-ink-900">
                      {item.username || 'Unknown customer'}
                    </p>
                    <p className="text-xs text-ink-400">Booked {formatDate(item.date)}</p>
                  </div>
                  <Badge tone={hasExactLocation ? 'success' : 'warning'}>
                    {hasExactLocation ? 'Exact location shared' : 'No GPS location'}
                  </Badge>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-ink-600 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Customer</p>
                    <a
                      href={`tel:${item.userphone}`}
                      className="flex items-center gap-1.5 hover:text-brand-600 hover:underline"
                    >
                      <FaPhoneAlt className="text-ink-400" size={11} /> {item.userphone || 'No phone'}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Driver</p>
                    <p className="font-semibold text-ink-800">{item.drivername}</p>
                    <a
                      href={`tel:${item.driverphone}`}
                      className="flex items-center gap-1.5 hover:text-brand-600 hover:underline"
                    >
                      <FaPhoneAlt className="text-ink-400" size={11} /> {item.driverphone || 'No phone'}
                    </a>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-ink-50 p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Carrying</p>
                  <p className="mt-0.5 text-sm text-ink-800">{item.product || 'Not specified'}</p>
                  {item.packagesize && (
                    <Badge tone="brand" className="mt-1.5">
                      {item.packagesize}
                    </Badge>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Pickup</p>
                    <p className="text-sm text-ink-800">
                      {[item.location, item.town, item.region].filter(Boolean).join(', ') || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Destination</p>
                    <p className="text-sm text-ink-800">
                      {[item.deslocation, item.destown, item.desregion].filter(Boolean).join(', ') ||
                        'Not specified'}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-xs text-ink-500">
                  Pickup window:{' '}
                  <span className="font-semibold text-ink-700">
                    {item.datepick || '—'} {item.time}
                  </span>
                </p>

                <div className="mt-4 rounded-xl border border-dashed border-ink-200 p-3">
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
                      The customer's device didn't share a GPS pin for this booking - use the pickup address above.
                    </p>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button size="sm" variant="primary" onClick={() => handleCopy(item)}>
                    <FaCopy size={11} /> {copiedId === item._id ? 'Copied!' : 'Copy for driver'}
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(item._id)}>
                    Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={confirmationPopup.visible}
        title="Delete this booking?"
        message="This removes the booking record permanently. This cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={closeConfirmation}
      />
    </Container>
  );
};

export default KiaBookings;
