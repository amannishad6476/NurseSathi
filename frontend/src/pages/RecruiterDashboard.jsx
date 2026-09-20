import { useEffect, useState } from 'react';
import api from '../api/axios';
import Loader from '../components/Loader';

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [form, setForm] = useState({ title: '', hospital: '', location: '', salary: '', description: '', requirements: '' });
  const [loading, setLoading] = useState(false);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/jobs/recruiter/list');
      setJobs(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/jobs', form);
      setForm({ title: '', hospital: '', location: '', salary: '', description: '', requirements: '' });
      loadJobs();
    } catch (error) {
      console.error(error);
    }
  };

  const viewApplicants = async (jobId) => {
    setSelectedJobId(jobId);
    const response = await api.get(`/applications/job/${jobId}`);
    setApplicants(response.data);
  };

  const updateStatus = async (applicationId, status) => {
    await api.put(`/applications/${applicationId}/status`, { status });
    viewApplicants(selectedJobId);
  };

  const deleteJob = async (jobId) => {
    await api.delete(`/jobs/${jobId}`);
    loadJobs();
  };

  return (
    <section>
      <div className="card">
        <h2>Recruiter Dashboard</h2>
        <p>Create and manage jobs, view applicants, accept or reject applications.</p>
      </div>
      <div className="card" style={{ marginTop: 18 }}>
        <h3>Post a new job</h3>
        <form onSubmit={handleSubmit} className="grid">
          {['title', 'hospital', 'location', 'salary'].map((field) => (
            <div key={field} className="form-group">
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input className="input" value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} required={field !== 'salary'} />
            </div>
          ))}
          <div className="form-group">
            <label>Description</label>
            <textarea className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="3" required />
          </div>
          <div className="form-group">
            <label>Requirements (comma separated)</label>
            <input className="input" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
          </div>
          <button className="btn" type="submit">Create job</button>
        </form>
      </div>
      <div className="card" style={{ marginTop: 18 }}>
        <h3>Your Jobs</h3>
        {loading ? <Loader /> : jobs.length ? jobs.map((job) => (
          <div key={job._id} style={{ borderBottom: '1px solid #e5e7eb', padding: '12px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <h4>{job.title}</h4>
                <p>{job.hospital} • {job.location}</p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn" type="button" onClick={() => viewApplicants(job._id)}>View applicants</button>
                <button className="btn" type="button" onClick={() => deleteJob(job._id)} style={{ background: '#dc2626' }}>Delete</button>
              </div>
            </div>
          </div>
        )) : <p>No jobs created yet.</p>}
      </div>
      {selectedJobId && (
        <div className="card" style={{ marginTop: 18 }}>
          <h3>Applicants</h3>
          {applicants.length ? applicants.map((application) => (
            <div key={application._id} style={{ borderBottom: '1px solid #e5e7eb', padding: '12px 0' }}>
              <p><strong>{application.nurse.name}</strong> • {application.nurse.email}</p>
              <p>Status: <span className={`status-pill status-${application.status}`}>{application.status}</span></p>
              <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn" onClick={() => updateStatus(application._id, 'accepted')}>Accept</button>
                <button className="btn" style={{ background: '#dc2626' }} onClick={() => updateStatus(application._id, 'rejected')}>Reject</button>
              </div>
            </div>
          )) : <p>No applicants yet.</p>}
        </div>
      )}
    </section>
  );
};

export default RecruiterDashboard;
