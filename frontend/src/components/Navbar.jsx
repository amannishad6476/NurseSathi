import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="card" style={{ margin: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" style={{ fontWeight: 700, textDecoration: 'none', color: '#111827' }}>
        Nursing Job Portal
      </Link>
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
        <Link to="/jobs">Jobs</Link>
        {user && <Link to="/profile">Profile</Link>}
        {user?.role === 'recruiter' && <Link to="/recruiter">Recruiter</Link>}
        {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
        {!user ? (
          <Link to="/auth">Login / Register</Link>
        ) : (
          <button className="btn" onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
