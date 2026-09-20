import { useEffect, useState } from 'react';
import api from '../api/axios';
import Loader from '../components/Loader';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([api.get('/admin/users'), api.get('/admin/stats')]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const approveRecruiter = async (userId) => {
    await api.put(`/admin/recruiter/${userId}/approve`);
    loadData();
  };

  const deleteUser = async (userId) => {
    await api.delete(`/admin/user/${userId}`);
    loadData();
  };

  return (
    <section>
      <div className="card">
        <h2>Admin Dashboard</h2>
        {stats && (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <div className="card">Total users: {stats.totalUsers}</div>
            <div className="card">Total jobs: {stats.totalJobs}</div>
            <div className="card">Applications: {stats.totalApplications}</div>
            <div className="card">Pending recruiters: {stats.pendingRecruiters}</div>
          </div>
        )}
      </div>
      <div className="card" style={{ marginTop: 18 }}>
        <h3>All users</h3>
        {loading ? <Loader /> : users.length ? users.map((user) => (
          <div key={user._id} style={{ borderBottom: '1px solid #e5e7eb', padding: '14px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <p><strong>{user.name}</strong> ({user.role})</p>
                <p>{user.email}</p>
                {user.role === 'recruiter' && <p>{user.isApproved ? 'Approved' : 'Pending approval'}</p>}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {user.role === 'recruiter' && !user.isApproved && (
                  <button className="btn" onClick={() => approveRecruiter(user._id)}>Approve</button>
                )}
                <button className="btn" style={{ background: '#dc2626' }} onClick={() => deleteUser(user._id)}>Delete</button>
              </div>
            </div>
          </div>
        )) : <p>No users found.</p>}
      </div>
    </section>
  );
};

export default AdminDashboard;
