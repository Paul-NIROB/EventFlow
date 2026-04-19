import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventData, regsData] = await Promise.all([
          api.events.get(id),
          user ? api.request(`/events/${id}/registrations`) : Promise.resolve([])
        ]);
        setEvent(eventData);
        setRegistrations(regsData);
        document.title = `EventFlow — ${eventData.title}`;
      } catch (error) {
        addToast(error.message, 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, addToast, navigate, user]);

  const handleRegister = async () => {
    if (!user) {
      addToast('Please login to register for events', 'info');
      navigate('/login');
      return;
    }

    setActionLoading(true);
    try {
      if (event.is_registered) {
        await api.events.unregister(id);
        setEvent({ ...event, is_registered: false, registration_count: event.registration_count - 1 });
        setRegistrations(prev => prev.filter(r => r.user_id !== user.id));
        addToast('Successfully unregistered', 'success');
      } else {
        await api.events.register(id);
        setEvent({ ...event, is_registered: true, registration_count: event.registration_count + 1 });
        // Fetch registrations again to show updated list
        const regsData = await api.request(`/events/${id}/registrations`);
        setRegistrations(regsData);
        addToast('Successfully registered for the event!', 'success');
      }
    } catch (error) {
      if (error.message.includes('Already registered')) {
        addToast('You are already registered for this event', 'error');
      } else {
        addToast(error.message, 'error');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await api.events.delete(id);
      addToast('Event deleted successfully', 'success');
      navigate('/');
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="h-96 bg-white/5 rounded-3xl" />
    <div className="h-12 bg-white/5 rounded-xl w-1/2" />
    <div className="h-32 bg-white/5 rounded-xl" />
  </div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="relative h-96 rounded-3xl overflow-hidden glass">
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent z-10" />
        <div className="absolute bottom-8 left-8 right-8 z-20 space-y-4">
          <span className="bg-accent px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest">
            {event.type}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-heading">{event.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-text/80">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {format(new Date(event.date), 'h:mm a')}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="glass p-8 rounded-3xl space-y-4">
            <h2 className="text-2xl font-bold font-heading">About this event</h2>
            <p className="text-text/70 leading-relaxed whitespace-pre-wrap">
              {event.description || "No description provided."}
            </p>
          </section>

          {user && (
            <section className="glass p-8 rounded-3xl space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-heading">Registrants</h2>
                <span className="bg-white/5 px-3 py-1 rounded-full text-sm text-text/60">
                  {registrations.length} total
                </span>
              </div>
              
              {registrations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {registrations.map((reg) => (
                    <div key={reg.id} className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                      <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                        {reg.user.name[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{reg.user.name}</span>
                        <span className="text-[10px] text-text/40 uppercase tracking-widest">
                          Joined {new Date(reg.registered_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text/40 text-center py-8 bg-white/5 rounded-2xl border border-dashed border-white/10">
                  No one has registered yet. Be the first!
                </p>
              )}
            </section>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass p-8 rounded-3xl space-y-6 sticky top-24">
            <div className="space-y-2">
              <p className="text-sm text-text/40 font-medium uppercase tracking-widest">Registration</p>
              <p className="text-3xl font-bold font-heading">{event.registration_count} <span className="text-sm font-normal text-text/60">Going</span></p>
            </div>

            {user?.id === event.creator_id ? (
              <div className="space-y-3">
                <p className="text-sm text-accent font-bold text-center py-2 bg-accent/10 rounded-xl border border-accent/20">You are the host</p>
                <button 
                  onClick={handleDelete}
                  className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold hover:bg-red-500/20 transition-all"
                >
                  Delete Event
                </button>
              </div>
            ) : (
              <button 
                onClick={handleRegister}
                disabled={actionLoading}
                className={`w-full py-4 rounded-2xl font-bold transition-all shadow-xl ${
                  event.is_registered 
                  ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20' 
                  : 'bg-accent text-white hover:bg-accent-hover shadow-accent/20'
                } disabled:opacity-50`}
              >
                {actionLoading ? 'Processing...' : event.is_registered ? 'Cancel Registration' : 'Register Now'}
              </button>
            )}

            <div className="pt-6 border-t border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-xl font-bold text-accent">
                {event.creator.name[0]}
              </div>
              <div>
                <p className="text-xs text-text/40 uppercase tracking-widest font-bold">Hosted by</p>
                <p className="font-bold">{event.creator.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
