import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

const Home = () => {
  useEffect(() => {
    document.title = "EventFlow — Discover Events";
  }, []);

  const { user } = useAuth();
  const initialFilters = {
    search: '',
    type: '',
    date_from: '',
    date_to: ''
  };
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await api.events.list(filters);
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchEvents();
    }, 300);
    return () => clearTimeout(debounce);
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-16 space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent leading-tight">
            Experience the <br /> Extraordinary
          </h1>
          <p className="text-text/60 text-lg md:text-xl max-w-2xl mx-auto">
            Join thousands of people discovering and hosting amazing workshops, concerts, and meetups every day.
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          <Link 
            to={user ? "/create-event" : "/register"} 
            className="bg-accent hover:bg-accent-hover px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-accent/30 hover:scale-[1.05]"
          >
            {user ? "Host an Event" : "Start Hosting"}
          </Link>
          <a href="#events" className="glass hover:bg-white/10 px-10 py-5 rounded-2xl font-bold text-lg transition-all">
            Explore Now
          </a>
        </div>
      </section>

      {/* Filters */}
      <div id="events" className="glass p-6 rounded-3xl flex flex-col md:flex-row gap-6 items-end">
        <div className="flex-1 w-full space-y-2">
          <label className="text-xs font-bold text-accent uppercase tracking-widest ml-1">Search</label>
          <input 
            type="text" 
            name="search"
            placeholder="Search events..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors"
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>
        <div className="w-full md:w-48 space-y-2">
          <label className="text-xs font-bold text-accent uppercase tracking-widest ml-1">Type</label>
          <select 
            name="type"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors appearance-none"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="">All Types</option>
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
            <option value="webinar">Webinar</option>
            <option value="meetup">Meetup</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="w-full md:w-48 space-y-2">
          <label className="text-xs font-bold text-accent uppercase tracking-widest ml-1">From Date</label>
          <input 
            type="date" 
            name="date_from"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors"
            value={filters.date_from}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => <LoadingSkeleton key={i} />)}
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass rounded-3xl space-y-6">
          <p className="text-text/40 text-xl font-heading">No events found. Try different filters.</p>
          <button 
            onClick={clearFilters}
            className="bg-accent/10 border border-accent/20 hover:bg-accent/20 text-accent px-8 py-3 rounded-xl transition-all font-bold"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
