import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  return (
    <article className="card">
      <h3>{job.title}</h3>
      <p>{job.hospital} • {job.location}</p>
      <p>{job.salary ? `Salary: ${job.salary}` : 'Salary negotiable'}</p>
      <p style={{ marginTop: 12 }}>{job.description.substring(0, 120)}...</p>
      <Link to={`/jobs/${job._id}`} className="btn" style={{ marginTop: 12, display: 'inline-block' }}>
        View details
      </Link>
    </article>
  );
};

export default JobCard;
