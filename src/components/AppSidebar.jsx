import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaSeedling,
  FaTshirt,
  FaFire,
  FaUtensils,
  FaConciergeBell,
  FaStore,
  FaCogs,
  FaWarehouse,
  FaBuilding,
  FaCarSide,
  FaMotorcycle,
  FaWrench,
  FaBullhorn,
  FaBolt,
  FaUsers,
  FaPhoneAlt,
  FaWhatsapp,
  FaExclamationTriangle,
  FaInfoCircle,
  FaChevronDown,
  FaTimes,
} from 'react-icons/fa';
import Logo from '../assets/screen.png';

const NAV = [
  {
    type: 'link',
    label: 'All Users',
    to: '/',
    icon: FaUsers,
  },
  {
    type: 'link',
    label: 'Dashboard',
    to: '/dashboard',
    icon: FaTachometerAlt,
  },
  {
    type: 'group',
    label: 'Catalog & Approvals',
    icon: FaWarehouse,
    items: [
      { label: 'Agric Products', to: '/agric', icon: FaSeedling },
      { label: 'Approved Agric', to: '/approved', icon: FaSeedling },
      { label: 'Fashion', to: '/fashion', icon: FaTshirt },
      { label: 'Approved Fashion', to: '/approvedfashion', icon: FaTshirt },
      { label: 'Hot Products', to: '/hot', icon: FaFire },
      { label: 'Food', to: '/food', icon: FaUtensils },
      { label: 'Services', to: '/services', icon: FaConciergeBell },
      { label: 'Approved Services', to: '/servicesapproved', icon: FaConciergeBell },
      { label: 'Shops', to: '/shop', icon: FaStore },
      { label: 'Spare Parts', to: '/spare', icon: FaCogs },
      { label: 'Equipment', to: '/quip', icon: FaWarehouse },
      { label: 'Buildings', to: '/building', icon: FaBuilding },
      { label: 'Boosted Products', to: '/boostproduct', icon: FaBolt },
    ],
  },
  {
    type: 'group',
    label: 'Transport',
    icon: FaCarSide,
    items: [
      { label: 'All Drivers', to: '/cars', icon: FaCarSide },
      { label: 'Approved Cars', to: '/approvedcars', icon: FaCarSide },
      { label: 'Car Rent', to: '/carrent', icon: FaCarSide },
      { label: 'Okada', to: '/okada', icon: FaMotorcycle },
      { label: 'New Mechanics', to: '/mecha', icon: FaWrench },
      { label: 'All Mechanics', to: '/mechanics', icon: FaWrench },
    ],
  },
  {
    type: 'group',
    label: 'Promotions',
    icon: FaBullhorn,
    items: [
      { label: 'Advert Page', to: '/advert', icon: FaBullhorn },
      { label: 'Post Advert', to: '/postadvert', icon: FaBullhorn },
    ],
  },
  {
    type: 'group',
    label: 'Users & Requests',
    icon: FaUsers,
    items: [
      { label: 'Calls', to: '/calls', icon: FaPhoneAlt },
      { label: 'WhatsApp', to: '/whatsap', icon: FaWhatsapp },
      { label: 'Reports', to: '/report', icon: FaExclamationTriangle },
      { label: 'Password Requests', to: '/reqt', icon: FaExclamationTriangle },
    ],
  },
  {
    type: 'link',
    label: 'About',
    to: '/about',
    icon: FaInfoCircle,
  },
];

const NavLink = ({ to, label, icon: Icon, active, indent }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
      indent ? 'ml-4' : ''
    } ${
      active
        ? 'bg-brand-500/15 text-brand-300'
        : 'text-ink-300 hover:bg-white/5 hover:text-white'
    }`}
  >
    {Icon && <Icon className="shrink-0 text-[15px]" />}
    <span className="truncate">{label}</span>
  </Link>
);

const NavGroup = ({ group, pathname }) => {
  const isActiveGroup = group.items.some((item) => pathname === item.to);
  const [open, setOpen] = useState(isActiveGroup);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
          isActiveGroup ? 'text-white' : 'text-ink-200 hover:text-white'
        }`}
      >
        <span className="flex items-center gap-3">
          <group.icon className="text-[15px]" />
          {group.label}
        </span>
        <FaChevronDown
          className={`text-[10px] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="mt-1 flex flex-col gap-0.5 border-l border-white/10 pl-2">
          {group.items.map((item) => (
            <NavLink
              key={item.to}
              {...item}
              indent
              active={pathname === item.to}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SidebarContent = ({ pathname }) => (
  <div className="flex h-full flex-col">
    <div className="flex items-center gap-3 px-5 py-6">
      <img src={Logo} alt="Linkpii" className="h-9 w-9 rounded-full object-cover ring-2 ring-brand-500/40" />
      <div>
        <p className="font-display text-base font-bold text-white">Linkpii</p>
        <p className="text-xs text-ink-400">Admin Console</p>
      </div>
    </div>
    <nav className="no-scrollbar flex-1 space-y-1 overflow-y-auto px-3 pb-6">
      {NAV.map((entry) =>
        entry.type === 'link' ? (
          <NavLink key={entry.to} {...entry} active={pathname === entry.to} />
        ) : (
          <NavGroup key={entry.label} group={entry} pathname={pathname} />
        )
      )}
    </nav>
  </div>
);

const AppSidebar = ({ mobileOpen, onCloseMobile }) => {
  const { pathname } = useLocation();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-72 lg:flex-col bg-ink-950">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink-950/60" onClick={onCloseMobile} />
          <div className="absolute inset-y-0 left-0 w-72 bg-ink-950 shadow-card-hover">
            <button
              onClick={onCloseMobile}
              className="absolute right-3 top-5 text-ink-300 hover:text-white"
              aria-label="Close menu"
            >
              <FaTimes />
            </button>
            <SidebarContent pathname={pathname} />
          </div>
        </div>
      )}
    </>
  );
};

export default AppSidebar;
