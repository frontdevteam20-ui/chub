"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import Navbar from "../Navbar";
import HamburgerMenu from "../HamburgerMenu";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Firebase config
const UpdatefirebaseConfig = {
  apiKey: "AIzaSyBmC8_22Lg9ftdI9CAO5dSazUqSbZklgMk",
  authDomain: "tcerp-newversion.firebaseapp.com",
  projectId: "tcerp-newversion",
  storageBucket: "tcerp-newversion.firebasestorage.app",
  messagingSenderId: "870652555892",
  appId: "1:870652555892:web:e2ec66e914da10de84d721",
  measurementId: "G-80X9888HBR"
};

// Initialize Firebase
const app = initializeApp(UpdatefirebaseConfig, "newAppInstance");
const db = getFirestore(app);

const ImportLeads = ({ handleLogout }) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      location: "",
      industry: "",
      phn_no: "",
      email: "",
      message: "",
      companyName: "",
      source: "",
      website: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      location: Yup.string().required("Required"),
      industry: Yup.string().required("Required"),
      phn_no: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      message: Yup.string().required("Required"),
      companyName: Yup.string().required("Required"),
      source: Yup.string().required("Required"),
      website: Yup.string().url("Invalid URL"),
    }),
    onSubmit: async (values, { resetForm }) => {
      console.log("Submitting values:", values);

      try {
        // Map fields to match your Firestore document format
        const mappedLead = {
          companyName: values.companyName,
          firstName: values.name,
          industry: values.industry,
          message: values.message,
          phoneNumber: values.phn_no,
          status: "new",
          userEmail: values.email,
          userId: "-",
          location: values.location,
          source: values.source,
          website: values.website,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        // Save the document to Firestore
        const docRef = await addDoc(collection(db, "leads-form"), mappedLead);

        // Update the same document with its auto ID as userId
        await import("firebase/firestore").then(({ updateDoc, doc }) =>
          updateDoc(doc(db, "leads-form", docRef.id), { userId: docRef.id })
        );

        console.log("Document written with ID: ", docRef.id);
        alert("Lead submitted successfully!");
        
        toast.success("✅ Lead submitted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        resetForm();
      } catch (error) {

        toast.error("❌ Failed to submit lead. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.error("Error saving lead:", error);
        alert("Failed to submit lead.");
      }
    }
  });

  return (
    <>
      {/* Navbar */}
      <div className="flex min-h-screen bg-gray-50 flex-col md:ml-64">
        <div className="flex flex-1 w-full pt-15">
      <Navbar handleLogout={handleLogout} />
      <div className="sm:block">
           {/* Hamburger menu */}
          <HamburgerMenu handleLogout={handleLogout} />
        </div>
   
    

      {/* Main form container */}

        <div className="flex-1 max-w-6xl mx-auto p-4 mt-3 w-full max-w-5xl bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-6 md:p-8 my-6 relative overflow-hidden border border-white/20">
          {/* Enhanced decorative elements */}
          <div className="absolute -top-16 -left-16 w-40 h-40 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-pulse"></div>
          <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-24 -right-12 w-28 h-28 bg-gradient-to-r from-indigo-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-pulse" style={{animationDelay: '4s'}}></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent"> New Lead</h2>
             
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                {/* Form Fields */}
                {[ 
                  { name: 'name', placeholder: 'John Doe',  label: 'Full Name' },
                  { name: 'companyName', placeholder: 'Acme Inc.',  label: 'Company Name' },
                  { name: 'email', placeholder: ' john.doe@example.com',  label: 'Email Address' },
                  { name: 'phn_no', placeholder: ' +91 1234567890',  label: 'Phone Number' },
                  { name: 'location', placeholder: ' New York, USA',  label: 'Location' },
                  { name: 'industry', placeholder: ' Technology', label: 'Industry' },
                  { name: 'website', placeholder: ' https://acme.com',  label: 'Website' },
                  { name: 'source', placeholder: 'Select a source', type: 'select', label: 'Lead Source' },
                ].map(field => (
                  <div key={field.name} className="group">
                    <label className="block text-sm font-bold text-left text-slate-700 mb-1.5 group-focus-within:text-cyan-600 transition-colors duration-200">
                      {field.label}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-cyan-500 transition-colors duration-200 z-10">{field.icon}</div>
                      {field.type === 'select' ? (
                        <select
                          name={field.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values[field.name]}
                          className={`w-full pl-2 pr-4 py-3 rounded-xl border-2 bg-white/70 backdrop-blur-sm transition-all duration-300 text-slate-700 font-medium shadow-sm hover:shadow-md ${formik.touched[field.name] && formik.errors[field.name] ? 'border-red-400 ring-4 ring-red-100 bg-red-50/50' : 'border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 hover:border-slate-300'} focus:outline-none`}
                        >
                          <option value="" className="text-slate-400">{field.placeholder}</option>
                          <option value="Direct">🎯 Direct</option>
                          <option value="Referral">🤝 Referral</option>
                          <option value="Organic">🌱 Organic</option>
                          <option value="Socials">📱 Social Media</option>
                          <option value="Others">📋 Others</option>
                        </select>
                      ) : (
                        <input
                          type={field.name === 'email' ? 'email' : 'text'}
                          name={field.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values[field.name]}
                          className={`w-full pl-2 pr-4 py-3 rounded-xl border-2 bg-white/70 backdrop-blur-sm transition-all duration-300 text-slate-700 font-medium shadow-sm hover:shadow-md ${formik.touched[field.name] && formik.errors[field.name] ? 'border-red-400 ring-4 ring-red-100 bg-red-50/50' : 'border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 hover:border-slate-300'} focus:outline-none placeholder:text-slate-400`}
                          placeholder={field.placeholder}
                        />
                      )}
                      {/* Success indicator */}
                      {formik.touched[field.name] && !formik.errors[field.name] && formik.values[field.name] && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {formik.touched[field.name] && formik.errors[field.name] && (
                      <div className="flex items-center mt-1.5 text-red-600 text-sm font-medium">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {formik.errors[field.name]}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Message */}
              <div className="group">
                <label className="block text-sm font-bold text-left text-slate-700 mb-1.5 group-focus-within:text-cyan-600 transition-colors duration-200">
                  Additional Notes
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  {/* <div className="absolute top-3 left-4 pointer-events-none text-slate-400 group-focus-within:text-cyan-500 transition-colors duration-200 z-10">💬</div> */}
                  <textarea
                    name="message"
                    rows={5}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.message}
                    className={`w-full pl-2 pr-4 py-3 rounded-xl border-2 bg-white/70 backdrop-blur-sm transition-all duration-300 text-slate-700 font-medium shadow-sm hover:shadow-md resize-none ${formik.touched.message && formik.errors.message ? 'border-red-400 ring-4 ring-red-100 bg-red-50/50' : 'border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 hover:border-slate-300'} focus:outline-none placeholder:text-slate-400`}
                    placeholder="Share any additional details, requirements, or context about this lead..."
                  />
                  {/* Success indicator */}
                  {formik.touched.message && !formik.errors.message && formik.values.message && (
                    <div className="absolute top-3 right-4 pointer-events-none">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {formik.touched.message && formik.errors.message && (
                  <div className="flex items-center mt-1.5 text-red-600 text-sm font-medium">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {formik.errors.message}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => formik.resetForm()}
                  className="w-full sm:w-auto px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 font-bold rounded-xl shadow-sm hover:shadow-md hover:border-slate-400 hover:bg-slate-50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-200 group"
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Clear Form
                  </span>
                </button>
                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="w-full sm:w-auto px-10 py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center">
                    {formik.isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                       
                        Submit Lead
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ImportLeads;
