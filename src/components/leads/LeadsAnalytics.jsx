import React, { useEffect, useState } from 'react';
import HamburgerMenu from "../HamburgerMenu";
import Navbar from "../Navbar";
import LeadsDashboardCards from "./LeadsDashboardCards";
import LeadsTable from "./LeadsTable";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { formatDateTime } from "./utils";

// Firebase config (reuse from ImportLeads)
const firebaseConfig = {
  apiKey: "AIzaSyBmC8_22Lg9ftdI9CAO5dSazUqSbZklgMk",
  authDomain: "tcerp-newversion.firebaseapp.com",
  projectId: "tcerp-newversion",
  storageBucket: "tcerp-newversion.firebasestorage.app",
  messagingSenderId: "870652555892",
  appId: "1:870652555892:web:e2ec66e914da10de84d721",
  measurementId: "G-80X9888HBR"
};
const app = initializeApp(firebaseConfig, "newAppInstance");
const db = getFirestore(app);

function getStartOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

const LeadsAnalytics = ({ handleLogout }) => {
  const [importLeads, setImportLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleUid, setVisibleUid] = useState(null);

  useEffect(() => {
    setLoading(true);
    const leadsRef = collection(db, "leads-form");
    const q = query(leadsRef, orderBy("createdAt", "desc"));
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
          userEmail: data.userEmail || "-",
          userId: data.userId || "-",
          location: data.location || "-",
          source: data.source || "Import",
          website: data.website || "-",
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
      });
      setImportLeads(leadsData);
      setLoading(false);
    }, (error) => {
      setImportLeads([]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Analytics calculations
  const totalLeads = importLeads.length;
  const now = new Date();
  const startOfWeek = getStartOfWeek(now);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const isToday = (date) => {
    if (!date) return false;
    const d = (typeof date.toDate === 'function') ? date.toDate() : new Date(date);
    return d.toDateString() === now.toDateString();
  };
  const isThisWeek = (date) => {
    if (!date) return false;
    const d = (typeof date.toDate === 'function') ? date.toDate() : new Date(date);
    return d >= startOfWeek && d <= now;
  };
  const isThisMonth = (date) => {
    if (!date) return false;
    const d = (typeof date.toDate === 'function') ? date.toDate() : new Date(date);
    return d >= startOfMonth && d <= now;
  };
  const leadsToday = importLeads.filter(l => isToday(l.createdAt)).length;
  const newLeadsThisWeek = importLeads.filter(l => isThisWeek(l.createdAt)).length;
  const leadsThisMonth = importLeads.filter(l => isThisMonth(l.createdAt)).length;

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
          <h1 className="text-2xl font-bold mb-4">Import Leads Analytics</h1>

          <LeadsDashboardCards
            loading={loading}
            totalLeads={totalLeads}
            newLeadsThisWeek={newLeadsThisWeek}
            leadsToday={leadsToday}
            leadsThisMonth={leadsThisMonth}
          />

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Imported Leads Table</h2>
            <LeadsTable
              leads={importLeads}
              loading={loading}
              visibleUid={visibleUid}
              setVisibleUid={setVisibleUid}
              formatDateTime={formatDateTime}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsAnalytics;