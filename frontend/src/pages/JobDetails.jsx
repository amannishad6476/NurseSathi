import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';

const JobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState('');
  const { user, showMessage } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const loadJob = async () => {
      try {
        const response = await api.get(`/jobs/${jobId}`);
        setJob(response.data);
      } catch (error) {
        showMessage(error.response?.data?.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [jobId]);

  const apply = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      await api.post(`/applications/apply/${jobId}`, { coverLetter });
      showMessage('Application submitted successfully');
    } catch (error) {
      showMessage(error.response?.data?.message || 'Unable to apply');
    }
  };

  if (loading) return <Loader />;
  if (!job) return <p>Job not found.</p>;

  return (
    <section className="card">
      <h2>{job.title}</h2>
      <p>{job.hospital} • {job.location}</p>
      <p>{job.description}</p>
      <p><strong>Salary:</strong> {job.salary || 'Negotiable'}</p>
      <div>
        <h3>Requirements</h3>
        <ul>
          {job.requirements?.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      </div>
      {user?.role === 'nurse' && (
        <div style={{ marginTop: 24 }}>
          <h3>Apply for this job</h3>
          <textarea className="textarea" rows="4" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="Write a short cover letter" />
          <button className="btn" onClick={apply}>Submit application</button>
        </div>
      )}
    </section>
  );
};

export default JobDetails;
