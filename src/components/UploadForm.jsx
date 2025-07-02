import { useState, useRef } from 'react';

function isAbnormal(value, range, parameter) {
  const num = parseFloat(value);
  if (!value || !range || isNaN(num)) return false;
  const between = range.match(/^(\d+(\.\d+)?)[-–](\d+(\.\d+)?)/);
  if (between) {
    const min = parseFloat(between[1]);
    const max = parseFloat(between[3]);
    return num < min || num > max;
  }
  const less = range.match(/^<\s*(\d+(\.\d+)?)/);
  if (less) {
    return num >= parseFloat(less[1]);
  }
  const more = range.match(/^>\s*(\d+(\.\d+)?)/);
  if (more) {
    return num <= parseFloat(more[1]);
  }
  return false;
}

function getFileIcon(file) {
  if (!file) return null;
  if (file.type === 'application/pdf') return '📄';
  if (file.type.startsWith('image/')) return '🖼️';
  return '📁';
}

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toastTimeout = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setExtractedData(null);
  };

  const handleClearFile = () => {
    setFile(null);
    setMessage('');
    setExtractedData(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setMessage('');
      setExtractedData(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const showToastMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setShowToast(true);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setShowToast(false), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setMessage('');
    setMessageType('info');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/v1/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setExtractedData(result);
      showToastMessage('Upload successful!', 'success');
      setFile(null);
    } catch (error) {
      showToastMessage('Upload error: ' + error.message, 'error');
      setExtractedData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Toast notification */}
      {showToast && (
        <div
          style={{
            ...styles.toast,
            ...(messageType === 'success' ? styles.success : {}),
            ...(messageType === 'error' ? styles.error : {}),
          }}
        >
          {messageType === 'success' && <span style={styles.icon}>✔️</span>}
          {messageType === 'error' && <span style={styles.icon}>❌</span>}
          {message}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        style={styles.form}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <h2 style={styles.title}>Upload Health Report</h2>
        <div
          style={{
            ...styles.fileRow,
            ...(dragActive ? styles.dragActive : {}),
          }}
        >
          <input
            type="file"
            accept=".pdf,.jpg,.png"
            onChange={handleFileChange}
            key={file ? file.name : ''}
            style={styles.input}
            disabled={loading}
          />
          {file && (
            <span style={styles.fileName}>
              <span style={styles.fileIcon}>{getFileIcon(file)}</span>
              {file.name}
              <button type="button" onClick={handleClearFile} style={styles.clearBtn} title="Clear file">&times;</button>
            </span>
          )}
          {!file && (
            <span style={styles.dropText}>
              {dragActive ? 'Drop your file here...' : 'or drag & drop here'}
            </span>
          )}
        </div>
        <button type="submit" style={styles.button} disabled={loading || !file}>
          {loading ? <span style={styles.spinner}></span> : 'Upload Report'}
        </button>
      </form>
      {extractedData && Array.isArray(extractedData) && extractedData.length > 0 && (
        <div style={styles.tableContainer}>
          {/* Heartbeat wave SVG */}
          <svg
            width="320"
            height="40"
            viewBox="0 0 320 40"
            style={{
              display: 'block',
              margin: '0 auto 12px auto',
              opacity: 0.35,
              filter: 'drop-shadow(0 2px 8px #ff6b8133)',
            }}
          >
            <polyline
              fill="none"
              stroke="#ff6b81"
              strokeWidth="4"
              strokeLinejoin="round"
              strokeLinecap="round"
              points="0,20 30,20 40,5 50,35 60,20 100,20 110,10 120,30 130,20 170,20 180,5 190,35 200,20 320,20"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-320"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-dasharray"
                values="0,320;320,0;0,320"
                dur="2s"
                repeatCount="indefinite"
              />
            </polyline>
          </svg>
          <h3 style={styles.tableTitle}>Extracted Health Parameters</h3>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Parameter</th>
                  <th style={styles.th}>Value</th>
                  <th style={styles.th}>Unit</th>
                  <th style={styles.th}>Range</th>
                  <th style={styles.th}>Insight</th>
                </tr>
              </thead>
              <tbody>
                {extractedData.map((item, idx) => {
                  const abnormal = isAbnormal(item.value, item.range, item.parameter);
                  return (
                    <tr
                      key={idx}
                      style={{
                        ...styles.tr,
                        ...(abnormal ? styles.abnormalRow : {}),
                      }}
                      onMouseOver={e => (e.currentTarget.style.background = '#e0eafc')}
                      onMouseOut={e => (e.currentTarget.style.background = abnormal ? '#fff3cd' : '#fafbfc')}
                      onClick={() => alert(
                        `${item.parameter}\nValue: ${item.value} ${item.unit}\nRange: ${item.range}\nInsight: ${abnormal ? 'Needs Attention' : 'Normal'}`
                      )}
                      title="Click for details"
                    >
                      <td style={styles.td}>{item.parameter}</td>
                      <td style={styles.td}>{item.value}</td>
                      <td style={styles.td}>{item.unit}</td>
                      <td style={styles.td}>{item.range}</td>
                      <td style={styles.td}>
                        {abnormal ? (
                          <span style={styles.attention}>
                            Needs Attention&nbsp;⚠️
                          </span>
                        ) : (
                          <span style={styles.normal}>Normal</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {extractedData && Array.isArray(extractedData) && extractedData.length === 0 && (
        <div style={styles.noData}>No health parameters found.</div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '40px',
  },
  toast: {
    position: 'fixed',
    top: '32px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
    padding: '14px 28px',
    fontWeight: 600,
    fontSize: '1.1rem',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    animation: 'fadeIn 0.5s',
  },
  form: {
    background: '#fff',
    boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
    borderRadius: '18px',
    padding: '32px 24px',
    width: '340px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    alignItems: 'center',
    marginBottom: '32px',
    animation: 'fadeIn 1.2s',
  },
  title: {
    margin: 0,
    fontWeight: 700,
    color: '#007BFF',
    fontSize: '1.4rem',
    letterSpacing: '0.5px',
  },
  fileRow: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    position: 'relative',
    border: '2px dashed #a1c4fd',
    borderRadius: '10px',
    background: '#f8fafd',
    minHeight: '48px',
    justifyContent: 'center',
    transition: 'border 0.2s, background 0.2s',
  },
  dragActive: {
    border: '2.5px solid #007BFF',
    background: '#e0eafc',
  },
  dropText: {
    color: '#888',
    fontSize: '0.98rem',
    fontStyle: 'italic',
    marginLeft: '8px',
  },
  input: {
    padding: '8px',
    border: 'none',
    borderRadius: '6px',
    width: '100%',
    fontSize: '1rem',
    background: 'transparent',
    outline: 'none',
  },
  fileName: {
    marginLeft: '8px',
    fontSize: '0.95rem',
    color: '#555',
    background: '#f2f8ff',
    borderRadius: '6px',
    padding: '4px 8px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  fileIcon: {
    fontSize: '1.2rem',
    marginRight: '4px',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: '#b00',
    fontSize: '1.1rem',
    cursor: 'pointer',
    marginLeft: '4px',
    lineHeight: 1,
  },
  button: {
    padding: '12px 0',
    background: 'linear-gradient(90deg, #007BFF 0%, #0056b3 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%',
    fontWeight: 600,
    fontSize: '1rem',
    transition: 'background 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '3px solid #fff',
    borderTop: '3px solid #007BFF',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    display: 'inline-block',
  },
  message: {
    marginTop: '8px',
    color: '#007BFF',
    fontWeight: 500,
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  success: {
    color: '#28a745',
  },
  error: {
    color: '#b00',
  },
  icon: {
    fontSize: '1.2rem',
    marginRight: '4px',
  },
  tableContainer: {
    marginTop: '32px',
    background: '#fff',
    borderRadius: '18px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
    padding: '24px',
    width: '90%',
    maxWidth: '700px',
    animation: 'fadeIn 1.2s',
  },
  tableTitle: {
    margin: '0 0 16px 0',
    color: '#333',
    fontWeight: 600,
    fontSize: '1.2rem',
    textAlign: 'center',
    letterSpacing: '0.5px',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '1rem',
    minWidth: '480px',
    background: 'rgba(255,255,255,0.98)',
    borderRadius: '12px',
    boxShadow: '0 2px 8px #007bff11',
  },
  th: {
    borderBottom: '2px solid #007BFF',
    padding: '10px 8px',
    background: '#f2f8ff',
    color: '#007BFF',
    textAlign: 'left',
    fontWeight: 600,
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  td: {
    borderBottom: '1px solid #e0e0e0',
    padding: '10px 8px',
    color: '#333',
    background: '#fafbfc',
    transition: 'background 0.2s',
  },
  tr: {
    transition: 'background 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  abnormalRow: {
    background: '#fff3cd',
  },
  attention: {
    color: '#b00',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
  },
  normal: {
    color: '#28a745',
    fontWeight: 500,
  },
  noData: {
    marginTop: '24px',
    color: '#b00',
    fontWeight: 500,
    fontSize: '1.1rem',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};
