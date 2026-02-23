import { useEffect, useState, useCallback, useMemo } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";

const newFirebaseConfig = {
  apiKey: "AIzaSyBmC8_22Lg9ftdI9CAO5dSazUqSbZklgMk",
  authDomain: "tcerp-newversion.firebaseapp.com",
  projectId: "tcerp-newversion",
  storageBucket: "tcerp-newversion.firebasestorage.app",
  messagingSenderId: "870652555892",
  appId: "1:870652555892:web:e2ec66e914da10de84d721",
  measurementId: "G-80X9888HBR"
};

const newApp = initializeApp(newFirebaseConfig, "newAppInstanceBrochures");
const newDb = getFirestore(newApp);

export default function useBrochures() {
  const [brochures, setBrochures] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBrochures = useCallback(async () => {
    console.log('🚀 Starting to fetch brochures from Firebase...');
    setLoading(true);
    try {
      const brochuresRef = collection(newDb, "industry_applications");
      const q = query(brochuresRef, orderBy("submittedAt", "desc"));
      const querySnapshot = await getDocs(q);
      console.log('📊 Firebase query snapshot:', querySnapshot);
      console.log('📊 Number of documents:', querySnapshot.docs.length);
      const data = querySnapshot.docs.map(doc => {
        const d = doc.data();
        console.log('📄 Processing brochure doc:', d);
        return {
          id: doc.id,
          brochureTitle: d.brochureTitle || "-",
          companyName: d.companyName || "-",
          email: d.email || "-",
          firstName: d.firstName || "-",
          industry: d.industry || "-",
          message: d.message || "-",
          phoneNumber: d.phoneNumber || "-",
          source: d.source || "-",
          submittedAt: d.submittedAt && d.submittedAt.toDate ? d.submittedAt.toDate() : null,
        };
      });
      console.log('✅ Processed brochures data:', data);
      setBrochures(data);
    } catch (error) {
      console.error("❌ Error fetching brochures:", error);
      setBrochures([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate industry statistics
  const industryStats = useMemo(() => {
    return brochures.reduce((acc, brochure) => {
      if (brochure.industry && brochure.industry !== "-") {
        acc[brochure.industry] = (acc[brochure.industry] || 0) + 1;
      }
      return acc;
    }, {});
  }, [brochures]);

  // Get sorted industries by brochure count
  const sortedIndustries = useMemo(() => {
    return Object.entries(industryStats)
      .sort(([,a], [,b]) => b - a)
      .map(([industry]) => industry);
  }, [industryStats]);

  // Get unique industries for filtering
  const uniqueIndustries = useMemo(() => {
    return ["all", ...new Set(brochures.map(b => b.industry).filter(industry => industry && industry !== "-"))];
  }, [brochures]);

  useEffect(() => {
    fetchBrochures();
  }, [fetchBrochures]);

  return { 
    brochures, 
    loading, 
    refetch: fetchBrochures,
    industryStats,
    sortedIndustries,
    uniqueIndustries
  };
} 