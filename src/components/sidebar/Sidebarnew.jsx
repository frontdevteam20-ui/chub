import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MdDashboard, 
  MdArticle, 
  MdPeopleAlt, 
  MdAnalytics, 
  MdAttachMoney, 
  MdBusinessCenter, 
  MdContactMail,
  MdExpandMore,
  MdEventAvailable,
  MdChat,
  MdEmail,
  MdMessage,
  MdMenu,
  MdClose,
  MdLogout
} from 'react-icons/md';
import { useRBAC } from '../../contexts/RBACContext';
import logo from '../../assets/logo.png';

function HamburgerMenu({ handleLogout, user }) {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('');
  const [leadsDropdown, setLeadsDropdown] = useState(false);
  const [analyticsDropdown, setAnalyticsDropdown] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const leadsDropdownRef = useRef(null);
  const analyticsDropdownRef = useRef(null);
  const { userRole, loading } = useRBAC();
  
  if (loading) return null;
  
  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? '' : menu);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (leadsDropdownRef.current && !leadsDropdownRef.current.contains(event.target)) {
        setLeadsDropdown(false);
      }
      if (analyticsDropdownRef.current && !analyticsDropdownRef.current.contains(event.target)) {
        setAnalyticsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Hamburger Icon - positioned below navbar */}
      <button
        className={`fixed top-2 right-4 p-2 focus:outline-none bg-white shadow-lg md:hidden transition-all duration-300 hover:bg-gray-100 active:scale-95 rounded-full w-12 h-12 flex items-center justify-center ${open ? 'transform rotate-90' : ''}`}
        style={{
          zIndex: 999,
          marginRight: 'env(safe-area-inset-right)'
        }}
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Overlay - only on mobile when open, now with blur */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden transition-opacity duration-300 bg-black/10 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar Menu: right side on mobile, left on desktop */}
      <nav
        className={`fixed top-16 z-51 right-0 h-[calc(100vh-4rem)] w-11/12 max-w-xs bg-white transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}
          md:translate-x-0 md:fixed md:top-16 md:left-0 md:right-auto md:shadow-xl md:bg-white md:w-64 md:h-[calc(100vh-4rem)] md:rounded-none md:border-r md:border-gray-200`}
        onClick={e => e.stopPropagation()}
        style={{
          pointerEvents: open || window.innerWidth >= 768 ? 'auto' : 'none',
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
      >
        <div className="flex flex-col h-full p-6 gap-3 text-left overflow-y-auto" style={{
          maxHeight: 'calc(100vh - 4rem - env(safe-area-inset-bottom))',
          marginTop: '0'
        }}>
          {/* Logo with border and shadow */}
          <div className="flex justify-center mb-6">
            <div className="p-2  rounded-lg "
              style={ {boxShadow: 'rgba(0, 0, 0, 0.01) -1px 0px 25px 0px inset, rgb(90, 200, 250) -1px -1px 4px, rgb(234, 155, 147) 1px 2px 8px, rgb(240, 246, 251) 0px 2px 16px'}}>
              
              <img 
                src={logo} 
                alt="Logo" 
                className="h-20 w-auto"
                style={ { margin: '10px' }}
              />
            </div>
          </div>
          
          {/* Menu Section */}
          <div className="mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">Menu</h3>
            <div className="space-y-2">
              <Link
                to="/admin/dashboard"
                className={`block w-full text-sm font-medium transition py-3 px-4 rounded-lg focus:outline-none ${location.pathname.startsWith('/admin/dashboard') ? 'font-bold' : 'text-gray-700'}`}
                style={{
                  color: location.pathname.startsWith('/admin/dashboard') ? '#ef5226' : undefined,
                  backgroundColor: location.pathname.startsWith('/admin/dashboard') ? '#fef2f2' : undefined
                }}
                onMouseEnter={(e) => {
                  if (!location.pathname.startsWith('/admin/dashboard')) {
                  
                   
                  }
                }}
                onMouseLeave={(e) => {
                  if (!location.pathname.startsWith('/admin/dashboard')) {
                  
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
                onClick={() => setOpen(false)}
              >
                <span className="inline-flex items-center gap-2">
                  <MdDashboard className="text-xl" style={{color: '#ef5226'}} /> Overview
                </span>
              </Link>
              
              <Link
                to="/admin/blogs"
                className={`block w-full text-sm font-medium transition py-3 px-4 rounded-lg focus:outline-none ${location.pathname.startsWith('/admin/blogs') ? 'font-bold' : 'text-gray-700'}`}
                style={{
                  color: location.pathname.startsWith('/admin/blogs') ? '#ef5226' : undefined,
                  backgroundColor: location.pathname.startsWith('/admin/blogs') ? '#fef2f2' : undefined
                }}
                onMouseEnter={(e) => {
                  if (!location.pathname.startsWith('/admin/blogs')) {
                   
                  }
                }}
                onMouseLeave={(e) => {
                  if (!location.pathname.startsWith('/admin/blogs')) {
                  
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
                onClick={() => setOpen(false)}
              >
                <span className="inline-flex items-center gap-2">
                  <MdArticle className="text-xl" style={{color: '#ef5226'}} /> Blogs
                </span>
              </Link>
              {(userRole === 'admin' || userRole !== 'editor') && (
            <div className="relative" ref={leadsDropdownRef}>
              <button
                type="button"
                className={`block w-full text-left text-sm font-medium transition py-3 px-4 rounded-lg focus:outline-none ${location.pathname.startsWith('/admin/leads') ? 'font-bold' : 'text-gray-700'} flex items-center justify-between`}
                style={{
                  color: location.pathname.startsWith('/admin/leads') ? '#ef5226' : undefined,
                  backgroundColor: location.pathname.startsWith('/admin/leads') ? '#fef2f2' : undefined
                }}
                onMouseEnter={(e) => {
                  if (!location.pathname.startsWith('/admin/leads')) {
                  
                   
                  }
                }}
                onMouseLeave={(e) => {
                  if (!location.pathname.startsWith('/admin/leads')) {
                  
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
                onClick={() => {
                  setAnalyticsDropdown(false); // Close other dropdown
                  setLeadsDropdown((prev) => !prev);
                }}
                onMouseDown={(e) => {
                  // Prevent dropdown from closing when clicking on the button itself
                  e.preventDefault();
                }}
              >
                <span className="inline-flex items-center gap-2">
                  <MdPeopleAlt className="text-xl" style={{color: '#ef5226'}} /> Leads
                </span>
                <MdExpandMore className={`ml-2 transition-transform ${leadsDropdown ? 'rotate-180' : ''}`} />
              </button>
              {leadsDropdown && (
                <ul className="ml-6 mt-2 space-y-1 border-l-2 border-green-200 pl-4">
                  <li>
                    <Link 
                      to="/admin/leads" 
                      className="block w-full py-2.5 px-3 text-sm text-gray-600 rounded-md transition-colors"
                      onMouseEnter={(e) => {
                      
                       
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = '#4b5563';
                        e.target.style.backgroundColor = 'transparent';
                      }} 
                      onClick={() => { 
                        setOpen(false); 
                        setLeadsDropdown(false); 
                      }}
                    >
                      All Leads
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/admin/leads/import" 
                      className="block w-full py-2.5 px-3 text-sm text-gray-600 rounded-md transition-colors"
                      onMouseEnter={(e) => {
                      
                       
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = '#4b5563';
                        e.target.style.backgroundColor = 'transparent';
                      }} 
                      onClick={() => { setOpen(false); setLeadsDropdown(false); }}
                    >
                      Import Leads
                    </Link>
                  </li>
                
                </ul>
              )}
            </div>
          )}
            </div>
          </div>
          
          {/* Integrations Section */}
          <div className="mb-2">
            <h3 className="text-xs font-semibold text-black-500 uppercase tracking-wider mb-3 px-4">Integrations</h3>
            <div className="relative" ref={analyticsDropdownRef}>
            <button
              type="button"
              className={`block w-full text-left text-sm font-medium transition py-3 px-4 rounded-lg focus:outline-none ${location.pathname.startsWith('/admin/analytics') ? 'font-bold' : 'text-gray-700'} flex items-center justify-between`}
              style={{
                color: location.pathname.startsWith('/admin/analytics') ? '#ef5226' : undefined,
                backgroundColor: location.pathname.startsWith('/admin/analytics') ? '#fef2f2' : undefined
              }}
              onMouseEnter={(e) => {
                if (!location.pathname.startsWith('/admin/analytics')) {
                
                 
                }
              }}
              onMouseLeave={(e) => {
                if (!location.pathname.startsWith('/admin/analytics')) {
                
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
              onClick={() => {
                setLeadsDropdown(false); // Close other dropdown
                setAnalyticsDropdown((prev) => !prev);
              }}
              onMouseDown={(e) => {
                // Prevent dropdown from closing when clicking on the button itself
                e.preventDefault();
              }}
            >
              <span className="inline-flex items-center gap-2">
                <MdAnalytics className="text-xl" style={{color: '#ef5226'}} /> Web Analytics
              </span>
              <MdExpandMore className={`ml-2 transition-transform ${analyticsDropdown ? 'rotate-180' : ''}`} />
            </button>
            {analyticsDropdown && (
              <ul className="ml-6 space-y-1 border-l-2 border-purple-200 pl-4">
                <li>
                  <Link 
                    to="/admin/analytics" 
                    className="block w-full py-2.5 px-3 text-sm text-gray-600 rounded-md transition-colors"
                    onMouseEnter={(e) => {
                    
                     
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#4b5563';
                      e.target.style.backgroundColor = 'transparent';
                    }} 
                    onClick={() => { setOpen(false); setAnalyticsDropdown(false); }}
                  >
                    Overview
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/admin/analytics/geo" 
                    className="block w-full py-2.5 px-3 text-sm text-gray-600 rounded-md transition-colors"
                    onMouseEnter={(e) => {
                    
                     
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#4b5563';
                      e.target.style.backgroundColor = 'transparent';
                    }} 
                    onClick={() => { setOpen(false); setAnalyticsDropdown(false); }}
                  >
                    Geo View
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/admin/analytics/acquisition" 
                    className="block w-full py-2.5 px-3 text-sm text-gray-600 rounded-md transition-colors"
                    onMouseEnter={(e) => {
                    
                     
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#4b5563';
                      e.target.style.backgroundColor = 'transparent';
                    }} 
                    onClick={() => { setOpen(false); setAnalyticsDropdown(false); }}
                  >
                    Acquisition
                  </Link>
                </li>
               
              </ul>
            )}
          </div>
          </div>
     
        
          <Link
            to="/admin/pricing"
            className={`block text-sm font-medium transition py-2 px-3 rounded-lg focus:outline-none ${location.pathname.startsWith('/admin/pricing') ? 'font-bold' : 'text-gray-700'}`}
            style={{
              color: location.pathname.startsWith('/admin/pricing') ? '#ef5226' : undefined,
              backgroundColor: location.pathname.startsWith('/admin/pricing') ? '#fef2f2' : undefined
            }}
            onMouseEnter={(e) => {
              if (!location.pathname.startsWith('/admin/pricing')) {
              
               
              }
            }}
            onMouseLeave={(e) => {
              if (!location.pathname.startsWith('/admin/pricing')) {
              
                e.target.style.backgroundColor = 'transparent';
              }
            }}
            onClick={() => setOpen(false)}
          >
            <span className="inline-flex items-center gap-2">
              <MdAttachMoney className="text-xl" style={{color: '#ef5226'}} /> Pricing Quotations
            </span>
          </Link>
          <Link
            to="/admin/brochures"
            className={`block text-sm font-medium transition py-2 px-3 rounded-lg focus:outline-none ${location.pathname.startsWith('/admin/brochures') ? 'font-bold' : 'text-gray-700'}`}
            style={{
              color: location.pathname.startsWith('/admin/brochures') ? '#ef5226' : undefined,
              backgroundColor: location.pathname.startsWith('/admin/brochures') ? '#fef2f2' : undefined
            }}
            onMouseEnter={(e) => {
              if (!location.pathname.startsWith('/admin/brochures')) {
              
               
              }
            }}
            onMouseLeave={(e) => {
              if (!location.pathname.startsWith('/admin/brochures')) {
              
                e.target.style.backgroundColor = 'transparent';
              }
            }}
            onClick={() => setOpen(false)}
          >
            <span className="inline-flex items-center gap-2">
              {/* Using MdBusinessCenter as a suitable icon for brochures */}
              <MdBusinessCenter className="text-xl" style={{color: '#ef5226'}} /> Industry Brochures
            </span>
          </Link>

      
          <Link
            to="/admin/forms"
            className={`block text-sm font-medium transition py-2 px-3 rounded-lg focus:outline-none ${location.pathname.startsWith('/admin/forms') ? 'font-bold' : 'text-gray-700'}`}
            style={{
              color: location.pathname.startsWith('/admin/forms') ? '#ef5226' : undefined,
              backgroundColor: location.pathname.startsWith('/admin/forms') ? '#fef2f2' : undefined
            }}
            onMouseEnter={(e) => {
              if (!location.pathname.startsWith('/admin/forms')) {
              
               
              }
            }}
            onMouseLeave={(e) => {
              if (!location.pathname.startsWith('/admin/forms')) {
              
                e.target.style.backgroundColor = 'transparent';
              }
            }}
            onClick={() => setOpen(false)}
          >
            <span className="inline-flex items-center gap-2">
              {/* Using MdContactMail as a suitable icon for contact forms */}
              <MdContactMail className="text-xl" style={{color: '#ef5226'}} />Contact Forms
            </span>
          </Link>
        
          {/* Calendly Demos - show for admin, hide for editor */}
          {(userRole === 'admin' || userRole !== 'editor') && (
            <Link
              to="/admin/calendly-demos"
              className={`block text-sm font-medium transition py-2 px-3 rounded-lg focus:outline-none ${location.pathname.startsWith('/admin/calendly-demos') ? 'font-bold' : 'text-gray-700'}`}
              style={{
                color: location.pathname.startsWith('/admin/calendly-demos') ? '#ef5226' : undefined,
                backgroundColor: location.pathname.startsWith('/admin/calendly-demos') ? '#fef2f2' : undefined
              }}
              onMouseEnter={(e) => {
                if (!location.pathname.startsWith('/admin/calendly-demos')) {
                
                 
                }
              }}
              onMouseLeave={(e) => {
                if (!location.pathname.startsWith('/admin/calendly-demos')) {
                
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
              onClick={() => setOpen(false)}
            >
              <span className="inline-flex items-center gap-2">
                <MdEventAvailable className="text-xl" style={{color: '#ef5226'}} /> Calendly Demos
              </span>
            </Link>
          )}
              {/* Chatbot - show for admin, hide for editor */}
              {(userRole === 'admin' || userRole !== 'editor') && (
            <Link
              to="/admin/chatbot"
              className={`block text-sm font-medium transition py-2 px-3 rounded-lg focus:outline-none ${location.pathname.startsWith('/admin/chatbot') ? 'font-bold' : 'text-gray-700'}`}
              style={{
                color: location.pathname.startsWith('/admin/chatbot') ? '#ef5226' : undefined,
                backgroundColor: location.pathname.startsWith('/admin/chatbot') ? '#fef2f2' : undefined
              }}
              onMouseEnter={(e) => {
                if (!location.pathname.startsWith('/admin/chatbot')) {
                
                 
                }
              }}
              onMouseLeave={(e) => {
                if (!location.pathname.startsWith('/admin/chatbot')) {
                
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
              onClick={() => setOpen(false)}
            >
              <span className="inline-flex items-center gap-2">
                <MdChat className="text-xl" style={{color: '#ef5226'}} /> Chatbot
              </span>
            </Link>
          )}
          {/* MailChimp - show for admin, hide for editor */}
          {(userRole === 'admin' || userRole !== 'editor') && (
            <Link
              to="/admin/mailchimp"
              className={`block text-sm font-medium transition py-2 px-3 rounded-lg focus:outline-none ${location.pathname.startsWith('/admin/mailchimp') ? 'font-bold' : 'text-gray-700'}`}
              style={{
                color: location.pathname.startsWith('/admin/mailchimp') ? '#ef5226' : undefined,
                backgroundColor: location.pathname.startsWith('/admin/mailchimp') ? '#fef2f2' : undefined
              }}
              onMouseEnter={(e) => {
                if (!location.pathname.startsWith('/admin/mailchimp')) {
                
                 
                }
              }}
              onMouseLeave={(e) => {
                if (!location.pathname.startsWith('/admin/mailchimp')) {
                
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
              onClick={() => setOpen(false)}
            >
              <span className="inline-flex items-center gap-2">
                <MdEmail className="text-xl" style={{color: '#ef5226'}} /> MailChimp
              </span>
            </Link>
          )}

          {/* WhatsApp Integration - show for admin, hide for editor */}
          {(userRole === 'admin' || userRole !== 'editor') && (
            <Link
              to="/admin/whatsapp"
              className={`block text-sm font-medium transition py-2 px-3 rounded-lg focus:outline-none ${location.pathname.startsWith('/admin/whatsapp') ? 'font-bold' : 'text-gray-700'}`}
              style={{
                color: location.pathname.startsWith('/admin/whatsapp') ? '#ef5226' : undefined,
                backgroundColor: location.pathname.startsWith('/admin/whatsapp') ? '#fef2f2' : undefined
              }}
              onMouseEnter={(e) => {
                if (!location.pathname.startsWith('/admin/whatsapp')) {
                
                 
                }
              }}
              onMouseLeave={(e) => {
                if (!location.pathname.startsWith('/admin/whatsapp')) {
                
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
              onClick={() => setOpen(false)}
            >
              <span className="inline-flex items-center gap-2">
                <MdMessage className="text-xl" style={{color: '#ef5226'}} /> WhatsApp Updates
              </span>
            </Link>
          )}
       

          {/* General Section */}
          <div className="mb-0">
            <h3 className="text-xs font-bold text-black-500 uppercase tracking-wider mb-3 px-3">General</h3>
              {/* User Management */}
              <Link
                to="/admin/users"
                className={`block w-full text-sm font-medium transition py-3 px-4 rounded-lg focus:outline-none ${location.pathname.startsWith('/admin/users') ? 'font-bold' : 'text-gray-700'}`}
                style={{
                  color: location.pathname.startsWith('/admin/users') ? '#ef5226' : undefined,
                  backgroundColor: location.pathname.startsWith('/admin/users') ? '#fef2f2' : undefined
                }}
                onMouseEnter={(e) => {
                  if (!location.pathname.startsWith('/admin/users')) {
                   
                  }
                }}
                onMouseLeave={(e) => {
                  if (!location.pathname.startsWith('/admin/users')) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
                onClick={() => setOpen(false)}
              >
                <span className="inline-flex items-center gap-2">
                  <MdPeopleAlt className="text-xl" style={{color: '#ef5226'}} /> User Management
                </span>
              </Link>
          </div>
         
          
          {/* Logout only on mobile */}
          <div className="flex flex-col gap-2 mt-8 md:hidden">
            <button className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600 transition" onClick={handleLogout}>Logout</button>
          </div>
          {/* Add more menu items here as needed */}
          {/* User info at the bottom */}
          {user && (
            <div className="mt-8 p-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-sm">
              <div className="flex items-center justify-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Logged in as</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default HamburgerMenu;