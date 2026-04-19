import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const EventCard = ({ event }) => {
  const typeConfigs = {
    conference: { gradient: 'from-[#1e3a5f] to-[#2d6a9f]', emoji: '🎤' },
    workshop: { gradient: 'from-[#3d1f00] to-[#8b4513]', emoji: '🛠️' },
    webinar: { gradient: 'from-[#1a0533] to-[#6b21a8]', emoji: '💻' },
    meetup: { gradient: 'from-[#003d1f] to-[#15803d]', emoji: '🤝' },
    other: { gradient: 'from-[#1a1a2e] to-[#4a4a6a]', emoji: '📅' }
  };

  const config = typeConfigs[event.type.toLowerCase()] || typeConfigs.other;

  return (
    <Link 
      to={`/events/${event.id}`}
      className="glass group rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 block"
    >
      <div className={`relative aspect-video bg-gradient-to-br ${config.gradient} flex items-center justify-center text-5xl`}>
        {/* Event Type Badge */}
        <span className="absolute top-4 left-4 bg-black/30 backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-white">
          {event.type}
        </span>
        
        <span className="group-hover:scale-110 transition-transform duration-300">
          {config.emoji}
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 text-accent text-sm font-medium mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {format(new Date(event.date), 'MMM d, yyyy • h:mm a')}
        </div>
        
        <h3 className="text-xl font-heading font-bold mb-3 group-hover:text-accent transition-colors">
          {event.title}
        </h3>
        
        <p className="text-text/60 line-clamp-2 mb-4 text-sm leading-relaxed">
          {event.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold">
              {event.creator.name[0]}
            </div>
            <span className="text-xs text-text/40">{event.creator.name}</span>
          </div>
          <div className="text-xs text-text/40 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {event.registration_count} registered
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
