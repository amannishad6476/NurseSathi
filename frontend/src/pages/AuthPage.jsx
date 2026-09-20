import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const AuthPage = () => {
  const [registerMode, setRegisterMode] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'nurse' });
  const { saveAuth, showMessage } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = registerMode ? '/auth/register' : '/auth/login';
      const response = await api.post(endpoint, form);
      saveAuth(response.data);
      showMessage('Logged in successfully');
      navigate('/');
    } catch (error) {
      showMessage(error.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <section className="card" style={{ maxWidth: 520, margin: '0 auto' }}>
      <h2>{registerMode ? 'Create an account' : 'Login to your account'}</h2>
      <form onSubmit={handleSubmit}>
        {registerMode && (
          <div className="form-group">
            <label>Name</label>
            <input className="input" name="name" value={form.name} onChange={handleChange} required />
          </div>
        )}
        <div className="form-group">
          <label>Email</label>
          <input type="email" className="input" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" className="input" name="password" value={form.password} onChange={handleChange} required />
        </div>
        {registerMode && (
          <div className="form-group">
            <label>Role</label>
            <select className="select" name="role" value={form.role} onChange={handleChange}>
              <option value="nurse">Nurse</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>
        )}
        <button type="submit" className="btn">{registerMode ? 'Register' : 'Login'}</button>
      </form>
      <button className="btn" type="button" style={{ marginTop: 16, background: '#4b5563' }} onClick={() => setRegisterMode(!registerMode)}>
        {registerMode ? 'Already have an account? Login' : 'Create an account'}
      </button>
    </section>
  );
};

export default AuthPage;
