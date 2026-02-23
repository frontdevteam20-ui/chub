import HamburgerMenu from "../HamburgerMenu";
import Navbar from "../Navbar";
import React, { useEffect, useState, useMemo } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import PricingDashboardCards from "./PricingDashboardCards";
import QuotationsTable from "./QuotationsTable";
import QuotationsStep2Table from "./QuotationsStep2Table";
import DateRangePicker from "./DateRangePicker";
import { getStartOfWeek } from "../leads/utils";
import { filterByDateRange, getDateRangeDisplay } from "./utils";

// TODO: Replace with your new Firebase project config
const newFirebaseConfig = {
  apiKey: "AIzaSyBmC8_22Lg9ftdI9CAO5dSazUqSbZklgMk",
  authDomain: "tcerp-newversion.firebaseapp.com",
  projectId: "tcerp-newversion",
  storageBucket: "tcerp-newversion.firebasestorage.app",
  messagingSenderId: "870652555892",
  appId: "1:870652555892:web:e2ec66e914da10de84d721",
  measurementId: "G-80X9888HBR"
};

const newApp = initializeApp(newFirebaseConfig, "newAppInstance");
const newDb = getFirestore(newApp);

const Pricing = ({ handleLogout }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleUid, setVisibleUid] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [loadingQuotations, setLoadingQuotations] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

  // Function to manually refresh data
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setLoading(true);
    setLoadingQuotations(true);
  };

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const leadsRef = collection(newDb, "leads");
        const q = query(leadsRef, orderBy("createdAt", "desc"));
        
        // Use real-time listener instead of one-time fetch
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const leadsData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              companyName: data.companyName || "-",
              firstName: data.firstName || "-",
              industry: data.industry || "-",
              message: data.message || "-",
              phoneNumber: data.phoneNumber || "-",
              status: data.status || "-",
              createdAt: data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : null,
              updatedAt: data.updatedAt && data.updatedAt.toDate ? data.updatedAt.toDate() : null,
              userEmail: data.userEmail || "-",
              userId: data.userId || "-",
              ...data
            };
          });
          
         
          
          setLeads(leadsData);
          setLoading(false);
        }, (error) => {
          console.error("Error fetching leads:", error);
          setLeads([]);
          setLoading(false);
        });

        // Cleanup function to unsubscribe when component unmounts
        return unsubscribe;
      } catch (error) {
        console.error("Error setting up leads listener:", error);
        setLeads([]);
        setLoading(false);
      }
    };
    
    const unsubscribe = fetchLeads();
    
    // Cleanup function
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [refreshKey]); // Add refreshKey as dependency to re-run when refresh is triggered



  useEffect(() => {
    const fetchQuotations = async () => {
      setLoadingQuotations(true);
      try {
        const quotationsRef = collection(newDb, "quotations");
        const q = query(quotationsRef, orderBy("createdAt", "desc"));
        
        // Use real-time listener for quotations too
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const quotationsData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : null,
              updatedAt: data.updatedAt && data.updatedAt.toDate ? data.updatedAt.toDate() : null,
              submittedAt: data.submittedAt && data.submittedAt.toDate ? data.submittedAt.toDate() : null,
            };
          });
          
         
          
          setQuotations(quotationsData);
          setLoadingQuotations(false);
        }, (error) => {
          console.error("Error fetching quotations:", error);
          setQuotations([]);
          setLoadingQuotations(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error setting up quotations listener:", error);
        setQuotations([]);
        setLoadingQuotations(false);
      }
    };
    const unsubscribe = fetchQuotations();
    // Cleanup function
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [refreshKey]); // Add refreshKey as dependency to re-run when refresh is triggered

  // Filter data based on date range
  const filteredLeads = useMemo(() => {
    if (!dateRange.startDate || !dateRange.endDate) return leads;
    return leads.filter(lead => {
      if (!lead.createdAt) return false;
      const leadDate = new Date(lead.createdAt);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      
      // Set time to start and end of day for proper comparison
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      leadDate.setHours(12, 0, 0, 0);
      
      return leadDate >= startDate && leadDate <= endDate;
    });
  }, [leads, dateRange]);

  const filteredQuotations = useMemo(() => {
    if (!dateRange.startDate || !dateRange.endDate) return quotations;
    
    return quotations.filter(quotation => {
      if (!quotation.createdAt) return false;
      const quotationDate = new Date(quotation.createdAt);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      
      // Set time to start and end of day for proper comparison
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      quotationDate.setHours(12, 0, 0, 0);
      
      return quotationDate >= startDate && quotationDate <= endDate;
    });
  }, [quotations, dateRange]);

  // Dashboard stats - recalculate every time quotations change
  const totalQuotations = filteredQuotations.length;
  const startOfWeek = getStartOfWeek();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const quotationsToday = filteredQuotations.filter(quotation => quotation.createdAt && quotation.createdAt >= today).length;
  const quotationsThisMonth = filteredQuotations.filter(quotation => quotation.createdAt && quotation.createdAt >= startOfMonth).length;
  const newQuotationsThisWeek = filteredQuotations.filter(quotation => quotation.createdAt && quotation.createdAt >= startOfWeek).length;

  // Handle date range change
  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate });
  };

  // Example pricing submit handler (replace with your actual handler)
  const handlePricingSubmit = async (pricingData) => {
    // ... your pricing submission logic ...
    // After successful submission:
    addNotification(
      'pricing',
      'Pricing Quotation Submitted',
      `Pricing quotation from ${pricingData.companyName || 'Unknown Company'} - ${pricingData.firstName || 'Unknown'} (${pricingData.industry || 'Unknown Industry'})`,
      pricingData
    );
  };

  // Example lead submit handler (replace with your actual handler)
  const handleLeadSubmit = async (leadData) => {
    // ... your lead submission logic ...
    // After successful submission:
    addNotification(
      'lead',
      'Lead Submitted',
      `New lead from ${leadData.companyName || 'Unknown Company'} - ${leadData.firstName || 'Unknown'} (${leadData.industry || 'Unknown Industry'})`,
      leadData
    );
  };


  return (
    <div className="flex min-h-screen bg-gray-50 flex-col md:ml-64">
      {/* Navbar */}
      <Navbar handleLogout={handleLogout} />
      {/* Content below navbar */}
      <div className="flex flex-1 w-full pt-15">
        {/* Sidebar / Hamburger */}
        <div className="sm:block">
          <HamburgerMenu handleLogout={handleLogout} />
        </div>
        {/* Main Content */}
        <div className="flex-1 max-w-6xl mx-auto p-4 mt-3">
          <div className="flex justify-center items-center mb-6">
            <h1 className="text-2xl font-bold mb-4 sm:mb-0 text-center">Pricing</h1>
          </div>

          {/* Dashboard Cards */}
          <PricingDashboardCards
            loading={loadingQuotations}
            totalQuotations={totalQuotations}
            newQuotationsThisWeek={newQuotationsThisWeek}
            quotationsToday={quotationsToday}
            quotationsThisMonth={quotationsThisMonth}
          />
          {/* Leads Table */}
          <QuotationsTable
            leads={filteredLeads}
            loading={loading}
            visibleUid={visibleUid}
            setVisibleUid={setVisibleUid}
          />
          {/* Quotations Table (Step 2) */}
          <QuotationsStep2Table
            quotations={filteredQuotations}
            loading={loadingQuotations}
          />
        </div>
      </div>
    </div>
  );
};

export default Pricing; 