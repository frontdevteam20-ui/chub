import React, { useState } from "react";
import { storage } from "../../../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import styles from "./Form.module.css";

const ImageUpload = ({ image, setImage }) => {
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    uploadImage(selectedFile);
  };

  const uploadImage = (file) => {
    const storageRef = ref(storage, `blogs_images/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(percent);
      },
      (error) => {
        console.error("Upload error:", error);
        alert("❌ Image upload failed!");
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setImage(downloadURL);
        alert("✅ Image uploaded successfully!");
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-5 mb-5 rounded-lg bg-white font-sans shadow flex flex-col items-start">
      <input
        type="file"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 mb-2"
      />
      {progress > 0 && <p className="text-sm text-orange-600 mb-2">Uploading: {Math.round(progress)}%</p>}
      {image && <img src={image} alt="Uploaded" className="w-28 h-28 object-cover rounded-lg mt-4 border-2 border-gray-200" />}
    </div>
  );
};

export default ImageUpload;