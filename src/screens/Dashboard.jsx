import { useEffect, useState } from 'react';
import {
  FaSeedling,
  FaTshirt,
  FaUtensils,
  FaConciergeBell,
  FaStore,
  FaCogs,
  FaWarehouse,
  FaBuilding,
  FaBolt,
  FaCarSide,
  FaMotorcycle,
  FaWrench,
  FaBullhorn,
  FaUsers,
  FaPhoneAlt,
  FaWhatsapp,
  FaExclamationTriangle,
  FaMars,
  FaVenus,
  FaGenderless,
} from 'react-icons/fa';
import { Container, PageHeader, StatTile, Card } from '../components/ui';
import baseURL from '../assets/baseURL';

const STAT_GROUPS = [
  {
    title: 'People',
    stats: [{ key: 'users', label: 'Registered Users', to: '/users', icon: FaUsers, endpoint: 'getUsers/count' }],
  },
  {
    title: 'Catalog & Approvals',
    stats: [
      { key: 'agric', label: 'Agric Products', to: '/agric', icon: FaSeedling, endpoint: 'send/get/count' },
      { key: 'fashion', label: 'Fashion Listings', to: '/fashion', icon: FaTshirt, endpoint: 'fashionpost/get/count' },
      { key: 'food', label: 'Food Listings', to: '/food', icon: FaUtensils, endpoint: 'food/get/count' },
      { key: 'services', label: 'Services', to: '/services', icon: FaConciergeBell, endpoint: 'services/get/count' },
      { key: 'shops', label: 'Shops', to: '/shop', icon: FaStore, endpoint: 'shops/get/count' },
      { key: 'spare', label: 'Spare Parts', to: '/spare', icon: FaCogs, endpoint: 'sparepartsmainpost/get/count' },
      { key: 'equipment', label: 'Equipment', to: '/quip', icon: FaWarehouse, endpoint: 'equipmentmain/get/count' },
      { key: 'buildings', label: 'Buildings', to: '/building', icon: FaBuilding, endpoint: 'buildings/get/count' },
      { key: 'boost', label: 'Boosted Products', to: '/boostproduct', icon: FaBolt, endpoint: 'boost/count' },
    ],
  },
  {
    title: 'Transport',
    stats: [
      { key: 'cars', label: 'Drivers', to: '/cars', icon: FaCarSide, endpoint: 'cars/get/countcar' },
      { key: 'rentcars', label: 'Rental Cars', to: '/carrent', icon: FaCarSide, endpoint: 'rentcar/get/count' },
      { key: 'okada', label: 'Okada Riders', to: '/okada', icon: FaMotorcycle, endpoint: 'okada/get/countokada' },
      { key: 'mechanics', label: 'Mechanics', to: '/mechanics', icon: FaWrench, endpoint: 'mechanics/get/count' },
      { key: 'newmecha', label: 'New Mechanics', to: '/mecha', icon: FaWrench, endpoint: 'newmechmain/get/count' },
    ],
  },
  {
    title: 'Promotions',
    stats: [{ key: 'advert', label: 'Adverts', to: '/advert', icon: FaBullhorn, endpoint: 'advert/count' }],
  },
  {
    title: 'Requests',
    stats: [
      { key: 'calls', label: 'Call Requests', to: '/calls', icon: FaPhoneAlt, endpoint: 'call/get/count' },
      { key: 'whatsapp', label: 'WhatsApp Requests', to: '/whatsap', icon: FaWhatsapp, endpoint: 'whatsapp/get/count' },
      { key: 'reports', label: 'Reports', to: '/report', icon: FaExclamationTriangle, endpoint: 'compliants/get/count' },
    ],
  },
];

const ALL_STATS = STAT_GROUPS.flatMap((g) => g.stats);

const GENDER_TILES = [
  { key: 'Male', label: 'Male Users', icon: FaMars },
  { key: 'Female', label: 'Female Users', icon: FaVenus },
  { key: 'Other', label: 'Other', icon: FaGenderless },
  { key: 'Unspecified', label: 'Gender Not Set', icon: FaGenderless },
];

const Dashboard = () => {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [genderCounts, setGenderCounts] = useState({});
  const [genderLoading, setGenderLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled(
      ALL_STATS.map((stat) =>
        fetch(`${baseURL}${stat.endpoint}`)
          .then((res) => res.json())
          .then((value) => ({ key: stat.key, value }))
      )
    ).then((results) => {
      if (cancelled) return;
      const next = {};
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          next[result.value.key] = result.value.value;
        }
      });
      setCounts(next);
      setLoading(false);
    });

    fetch(`${baseURL}getUsers`)
      .then((res) => res.json())
      .then((users) => {
        if (cancelled || !Array.isArray(users)) return;
        const tally = { Male: 0, Female: 0, Other: 0, Unspecified: 0 };
        users.forEach((user) => {
          if (user.gender === 'Male' || user.gender === 'Female' || user.gender === 'Other') {
            tally[user.gender] += 1;
          } else {
            tally.Unspecified += 1;
          }
        });
        setGenderCounts(tally);
        setGenderLoading(false);
      })
      .catch(() => {
        if (!cancelled) setGenderLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Container>
      <PageHeader
        title="Dashboard"
        subtitle="A quick look across every part of Linkpii."
      />

      {STAT_GROUPS.map((group) => (
        <div key={group.title} className="mb-8">
          <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-ink-500">
            {group.title}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {group.stats.map((stat) => (
              <StatTile
                key={stat.key}
                icon={stat.icon}
                label={stat.label}
                to={stat.to}
                value={counts[stat.key]}
                loading={loading}
              />
            ))}
            {group.title === 'People' &&
              GENDER_TILES.map((tile) => (
                <StatTile
                  key={tile.key}
                  icon={tile.icon}
                  label={tile.label}
                  to="/users"
                  value={genderCounts[tile.key]}
                  loading={genderLoading}
                />
              ))}
          </div>
        </div>
      ))}

      <Card className="p-5 text-sm text-ink-500">
        Counts are pulled live from the Linkpii API. If a tile shows a dash, that
        endpoint didn't respond — open the section directly to check on it.
      </Card>
    </Container>
  );
};

export default Dashboard;
