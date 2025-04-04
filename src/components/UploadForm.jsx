import React, { useState } from 'react';
import { uploadImage } from '../services/api';
import './UploadForm.css';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [resultUrl, setResultUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('remove');

  const handleChange = (e) => setFile(e.target.files[0]);
  const handleModeChange = (e) => setMode(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', mode);

    try {
      setLoading(true);
      const res = await uploadImage(formData);
      setResultUrl(res.data.image_url);
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

          {/* Styled dropdown */}
          <div className="dropdown-container">
            <label htmlFor="mode" className="dropdown-label">Choose Effect</label>
            <select id="mode" value={mode} onChange={handleModeChange} className="dropdown-select">
              <option value="remove">🧼 Transparent Background</option>
              <option value="blue">🔵 Add Blue Background</option>
              <option value="sci-fi">🛸 Add Sci-Fi Background</option>
            </select>
          </div>

          <button type="submit" className="submit-button">Process Image</button>
        </form>

        {loading && <p className="loading-text">Processing...</p>}

        {resultUrl && (
          <div className="result-container">
            <button onClick={handleDownload} className="submit-button" style={{ marginTop: '20px' }}>
              Download Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadForm;
