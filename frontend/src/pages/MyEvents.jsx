import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import EventCard from '../components/EventCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

const MyEvents = () => {
  useEffect(() => {
    document.title = "EventFlow — My Registrations";
  }, []);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRegistrations = async () => {
      try {
        const data = await api.events.myRegistrations();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch my registrations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyRegistrations();
  }, []);

  return (
    <div className="space-y-12 py-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold font-heading">My Registered Events</h1>
        <p className="text-text/60">Keep track of all the events you're planning to attend.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => <LoadingSkeleton key={i} />)}
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 glass rounded-3xl space-y-6">
          <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <svg className="h-10 w-10 text-text/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2v4a2 2 0 002 2h4" />
            </svg>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xl font-bold font-heading">No registrations yet</p>
              <p className="text-text/40">You haven't registered for any events yet.</p>
            </div>
            <Link 
              to="/"
              className="inline-block bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-xl transition-all font-bold shadow-lg shadow-accent/20"
            >
              Browse Events
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
