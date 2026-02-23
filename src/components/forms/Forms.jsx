import HamburgerMenu from "../HamburgerMenu";
import Navbar from "../Navbar";
import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";
import FormsDashboardCards from "./FormsDashboardCards";
import FormsAccordion from "./FormsAccordion";

// Firebase config (same as Leads)
const newFirebaseConfig = {
  apiKey: "AIzaSyBmC8_22Lg9ftdI9CAO5dSazUqSbZklgMk",
  authDomain: "tcerp-newversion.firebaseapp.com",
  projectId: "tcerp-newversion",
  storageBucket: "tcerp-newversion.firebasestorage.app",
  messagingSenderId: "870652555892",
  appId: "1:870652555892:web:e2ec66e914da10de84d721",
  measurementId: "G-80X9888HBR"
};

const newApp = initializeApp(newFirebaseConfig, "newAppInstanceForms");
const newDb = getFirestore(newApp);

const Forms = ({ handleLogout }) => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleUid, setVisibleUid] = useState(null);

  useEffect(() => {
    const fetchForms = async () => {
      setLoading(true);
      try {
        const formsRef = collection(newDb, "contact_applications");
        const q = query(formsRef, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const formsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            companyName: data.companyName || "-",
            email: data.email || "-",
            message: data.message || "-",
            name: data.name || "-",
            phone: data.phone || "-",
            subject: data.subject || "-",
            timestamp: data.timestamp && data.timestamp.toDate ? data.timestamp.toDate() : null,
            ...data
          };
        });
        setForms(formsData);
      } catch (error) {
        setForms([]);
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  const totalForms = forms.length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const formsToday = forms.filter(form => form.timestamp && form.timestamp >= today).length;
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const formsThisMonth = forms.filter(form => form.timestamp && form.timestamp >= startOfMonth).length;

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
          <h1 className="text-2xl font-bold mb-4">Contact Forms</h1>

          {/* Dashboard Cards */}
          <FormsDashboardCards
            loading={loading}
            totalForms={totalForms}
            formsToday={formsToday}
            formsThisMonth={formsThisMonth}
          />

          {/* Forms Accordion/List View */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">All Contact Forms</h2>
            <FormsAccordion forms={forms} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forms;
