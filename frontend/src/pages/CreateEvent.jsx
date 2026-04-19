import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useToast } from '../context/ToastContext';

const CreateEvent = () => {
  useEffect(() => {
    document.title = "EventFlow — Host an Event";
  }, []);

  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Helper to get current date-time in YYYY-MM-DDTHH:mm format for input
  const getDefaultDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    title: '',
    date: getDefaultDateTime(),
    type: 'workshop',
    description: ''
  });

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Event title is required";
    
    const selectedDate = new Date(formData.date);
    if (selectedDate < new Date()) {
      newErrors.date = "Event date cannot be in the past";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      const newEvent = await api.events.create(formData);
      addToast('Event created successfully!', 'success');
      navigate(`/events/${newEvent.id}`);
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="glass p-8 md:p-12 rounded-3xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-heading">Create New Event</h1>
          <p className="text-text/60">Fill in the details below to host your amazing event.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-accent uppercase tracking-widest ml-1">Event Title</label>
            <input 
              type="text" 
              name="title"
              placeholder="e.g. Modern Web Development Workshop" 
              className={`w-full bg-white/5 border ${errors.title ? 'border-red-500' : 'border-white/10'} rounded-2xl px-5 py-4 focus:outline-none focus:border-accent transition-colors`}
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <p className="text-red-500 text-xs ml-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-accent uppercase tracking-widest ml-1">Date & Time</label>
              <input 
                type="datetime-local" 
                name="date"
                className={`w-full bg-white/5 border ${errors.date ? 'border-red-500' : 'border-white/10'} rounded-2xl px-5 py-4 focus:outline-none focus:border-accent transition-colors`}
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().slice(0, 16)}
              />
              {errors.date && <p className="text-red-500 text-xs ml-1">{errors.date}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-accent uppercase tracking-widest ml-1">Event Type</label>
              <select 
                name="type"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-accent transition-colors appearance-none"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="webinar">Webinar</option>
                <option value="meetup">Meetup</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end ml-1">
              <label className="text-sm font-bold text-accent uppercase tracking-widest">Description</label>
              <span className={`text-xs ${formData.description.length > 500 ? 'text-red-500' : 'text-text/40'}`}>
                {formData.description.length}/500
              </span>
            </div>
            <textarea 
              name="description"
              rows="5"
              placeholder="Tell people what your event is about..." 
              className={`w-full bg-white/5 border ${errors.description ? 'border-red-500' : 'border-white/10'} rounded-2xl px-5 py-4 focus:outline-none focus:border-accent transition-colors resize-none`}
              value={formData.description}
              onChange={handleChange}
              maxLength="500"
            />
            {errors.description && <p className="text-red-500 text-xs ml-1">{errors.description}</p>}
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 rounded-2xl bg-accent hover:bg-accent-hover text-white font-bold text-lg transition-all shadow-xl shadow-accent/20 disabled:opacity-50"
          >
            {loading ? 'Creating Event...' : 'Launch Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
