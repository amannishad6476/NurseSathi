import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import Loader from '../components/Loader';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({ keyword: '', location: '', hospital: '' });

  const page = Number(searchParams.get('page') || 1);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ ...filters, page }).toString();
      const response = await api.get(`/jobs?${query}&limit=8`);
      setJobs(response.data.jobs);
      setPagination({ page: response.data.page, pages: response.data.pages });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ ...filters, page: 1 });
  };

  return (
    <section>
      <div className="card">
        <h2>Find nursing roles</h2>
        <form onSubmit={handleSearch} style={{ display: 'grid', gap: 16 }}>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <input className="input" placeholder="Keyword" value={filters.keyword} onChange={(e) => setFilters({ ...filters, keyword: e.target.value })} />
            <input className="input" placeholder="Location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
          </div>
          <input className="input" placeholder="Hospital" value={filters.hospital} onChange={(e) => setFilters({ ...filters, hospital: e.target.value })} />
          <button className="btn" type="submit">Search</button>
        </form>
      </div>
      {loading ? <Loader /> : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {jobs.length ? jobs.map((job) => <JobCard key={job._id} job={job} />) : <p>No jobs found.</p>}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 18 }}>
        <button className="btn" disabled={pagination.page <= 1} onClick={() => setSearchParams({ ...Object.fromEntries(searchParams.entries()), page: pagination.page - 1 })}>Previous</button>
        <span>Page {pagination.page} / {pagination.pages}</span>
        <button className="btn" disabled={pagination.page >= pagination.pages} onClick={() => setSearchParams({ ...Object.fromEntries(searchParams.entries()), page: pagination.page + 1 })}>Next</button>
      </div>
    </section>
  );
};

export default Jobs;
