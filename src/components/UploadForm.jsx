import React, { useState } from 'react';
import { uploadImage } from '../services/api';
import './UploadForm.css';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [bgFile, setBgFile] = useState(null);
  const [resultUrl, setResultUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('remove');

  const handleChange = (e) => setFile(e.target.files[0]);
  const handleBgChange = (e) => setBgFile(e.target.files[0]);
  const handleModeChange = (e) => {
    setMode(e.target.value);
    if (e.target.value !== 'custom') {
      setBgFile(null); // Reset if not in custom mode
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload an image");

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      if (mode === 'custom') {
        if (!bgFile) return alert("Please upload a background image");
        formData.append('bg', bgFile);

        const res = await fetch("http://13.60.221.0:8080/replace-bg", {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
if (res.ok) {
  setResultUrl(data.image_url);
} else {
  alert(data.error || "Something went wrong");
}

      } else {
        formData.append('mode', mode);
        const res = await uploadImage(formData); // Calls your /upload API
        setResultUrl(res.data.image_url);
      }
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(resultUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'processed_image.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download image');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', height: '100vh' }}>
      <div className="upload-form">
        <h1 className="upload-title">Remove Background</h1>
        <p className="upload-tagline" style={{ margin: '20px 0' }}>
          Clean. Simple. Background-Free or Add a New One.
        </p>

        <form onSubmit={handleSubmit} className="upload-form-content">
          <label className="custom-file-upload">
            <input type="file" accept="image/*" onChange={handleChange} />
            Choose File
          </label>
          <span className="file-name">{file ? file.name : "No file chosen"}</span>

          <div className="dropdown-container">
            <label htmlFor="mode" className="dropdown-label">Choose Effect</label>
            <select id="mode" value={mode} onChange={handleModeChange} className="dropdown-select">
              <option value="remove">🧼 Transparent Background</option>
              <option value="blue">🔵 Add Blue Background</option>
              <option value="sci-fi">🛸 Add Sci-Fi Background</option>
              <option value="custom">🖼️ Upload My Own Background</option>
            </select>
          </div>

          {mode === 'custom' && (
            <>
              <label className="custom-file-upload">
                <input type="file" accept="image/*" onChange={handleBgChange} />
                Upload Background Image
              </label>
              <span className="file-name">{bgFile ? bgFile.name : "No background image chosen"}</span>
            </>
          )}

          <button type="submit" className="submit-button">Let’s Edit</button>
        </form>

        {loading && (
  <div className="loading-spinner-container">
    <div className="magic-spinner"></div>
    <p className="loading-text">Casting background magic...</p>
  </div>
)}


        {resultUrl && (
          <div className="result-container">
            <button onClick={handleDownload} className="submit-button" style={{ marginTop: '20px' }}>
              Download Image
            </button>
          </div>
        )}
        <p className="upload-coming-soon">
  What’s in your mind can be your background — coming soon.
</p>

      </div>
    </div>
  );
};

export default UploadForm;
