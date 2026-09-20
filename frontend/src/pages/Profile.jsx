import { useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';

const Profile = () => {
  const { user, showMessage } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ summary: '', location: '', skills: '', education: '[]', experience: '[]' });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get('/profile/me');
        setProfile(response.data);
        setForm({
          summary: response.data.summary || '',
          location: response.data.location || '',
          skills: response.data.skills?.join(', ') || '',
          education: JSON.stringify(response.data.education || [], null, 2),
          experience: JSON.stringify(response.data.experience || [], null, 2),
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      JSON.parse(form.education);
      JSON.parse(form.experience);
    } catch (error) {
      showMessage('Education and experience must be valid JSON arrays');
      return;
    }

    const data = new FormData();
    data.append('summary', form.summary);
    data.append('location', form.location);
    data.append('skills', form.skills);
    data.append('education', form.education);
    data.append('experience', form.experience);
    if (form.resumeFile) {
      data.append('resume', form.resumeFile);
    }

    try {
      const response = await api.post('/profile/me', data);
      setProfile(response.data);
      showMessage('Profile updated successfully');
    } catch (error) {
      showMessage(error.response?.data?.message || 'Unable to save profile');
    }
  };

  if (loading) return <Loader />;

  return (
    <section className="card">
      <h2>My Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Location</label>
          <input className="input" name="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Professional summary</label>
          <textarea className="textarea" name="summary" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows="4" />
        </div>
        <div className="form-group">
          <label>Skills (comma separated)</label>
          <input className="input" name="skills" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Education (JSON array)</label>
          <textarea className="textarea" name="education" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} rows="4" />
        </div>
        <div className="form-group">
          <label>Experience (JSON array)</label>
          <textarea className="textarea" name="experience" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} rows="4" />
        </div>
        <div className="form-group">
          <label>Upload Resume (PDF)</label>
          <input type="file" className="input" name="resume" accept="application/pdf" onChange={(e) => setForm({ ...form, resumeFile: e.target.files[0] })} />
        </div>
        <button className="btn" type="submit">Save profile</button>
      </form>
    </section>
  );
};

export default Profile;
