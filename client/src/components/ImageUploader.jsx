// 📁 components/ImageUploader.jsx
import { useState } from 'react';
import API from '../services/backenInt';


export default function ImageUploader({ onUpload }) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await API.post('/messages/upload', formData);
      onUpload(res.data.url);
      setFile(null);
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  return (
    <div className="flex items-center gap-2 mb-2">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="text-sm"
      />
      <button
        onClick={handleUpload}
        className="bg-gray-400 text-pink-700 px-2 py-1 rounded">
        Upload
      </button>
    </div>
  );
}
