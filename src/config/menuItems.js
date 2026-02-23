import { 
  MdDashboard, 
  MdArticle, 
  MdPeopleAlt, 
  MdAnalytics, 
  MdAttachMoney, 
  MdBusinessCenter, 
  MdContactMail,
  MdEventAvailable,
  MdChat,
  MdEmail,
  MdMessage,
  MdLogout
} from 'react-icons/md';

export const menuSections = [
  {
    title: 'Menu',
    items: [
      {
        to: '/admin/dashboard',
        icon: MdDashboard,
        label: 'Overview'
      },
      {
        to: '/admin/blogs',
        icon: MdArticle,
        label: 'Blogs'
      },
      {
        to: '/admin/users',
        icon: MdPeopleAlt,
        label: 'User Management'
      },
      {
        to: '/admin/leads',
        icon: MdPeopleAlt,
        label: 'Leads',
        hasDropdown: true,
        dropdownItems: [
          { to: '/admin/leads', label: 'All Leads' },
          { to: '/admin/leads/import', label: 'Import Leads' }
        ]
      },
      {
        to: '/admin/pricing',
        icon: MdAttachMoney,
        label: 'Pricing'
      },
      {
        to: '/admin/brochures',
        icon: MdBusinessCenter,
        label: 'Industry Brochures'
      },
      {
        to: '/admin/forms',
        icon: MdContactMail,
        label: 'Forms'
      },
      {
        to: '/admin/calendly-demos',
        icon: MdEventAvailable,
        label: 'Calendly Demos'
      },
      {
        to: '/admin/chatbot',
        icon: MdChat,
        label: 'Chatbot'
      },
      {
        to: '/admin/mailchimp',
        icon: MdEmail,
        label: 'Mailchimp'
      },
      {
        to: '/admin/whatsapp',
        icon: MdMessage,
        label: 'WhatsApp'
      },
    ]
  },
  {
    title: 'Integrations',
    items: [
      {
        to: '/admin/analytics',
        icon: MdAnalytics,
        label: 'Web Analytics',
        hasDropdown: true,
        dropdownItems: [
          { to: '/admin/analytics', label: 'Overview' },
          { to: '/admin/analytics/geo', label: 'Geographic Data' },
          { to: '/admin/analytics/acquisition', label: 'Acquisition' }
        ]
      }
    ]
  }
];
