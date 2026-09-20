const Toast = ({ message }) => {
  if (!message) return null;
  return (
    <div style={{
      position: 'fixed',
      right: 24,
      top: 24,
      background: '#111827',
      color: '#fff',
      padding: '14px 18px',
      borderRadius: 12,
      zIndex: 1000,
      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    }}>
      {message}
    </div>
  );
};

export default Toast;
