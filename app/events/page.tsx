// app/events/page.tsx
import Image from 'next/image';
import { Calendar, MapPin, Users, Star, Wifi, Plus } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { mockEvents } from '@/lib/mockData';

export default function EventsPage() {
  const upcoming = mockEvents.filter((_, i) => i < 3);
  const later = mockEvents.filter((_, i) => i >= 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-navy-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-white mb-2">Events & Reunions</h1>
            <p className="text-gray-400">Upcoming events for our alumni community</p>
          </div>
          <button className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-4 py-2 rounded-lg transition-colors">
            <Plus className="h-4 w-4" />
            Submit Event
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-8">
          {['Upcoming', 'My Events', 'Past'].map((tab, i) => (
            <button key={tab} className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${i === 0 ? 'border-navy-800 text-navy-900' : 'border-transparent text-gray-500 hover:text-navy-700'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* October events */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <Calendar className="h-4 w-4 text-gold-500" />
            <h2 className="font-bold text-navy-900 font-serif">October 2023</h2>
          </div>

          {/* Featured event */}
          {upcoming[0] && (
            <div className="card overflow-hidden mb-5">
              <div className="grid lg:grid-cols-2">
                {upcoming[0].image && (
                  <div className="h-64 lg:h-auto relative">
                    <Image src={upcoming[0].image} alt={upcoming[0].title} fill className="object-cover" />
                    <span className="absolute top-4 left-4 bg-gold-500 text-navy-950 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                      <Star className="h-3 w-3" /> Featured
                    </span>
                  </div>
                )}
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-navy-900 text-white text-lg font-bold px-3 py-1 rounded-lg w-14 text-center leading-tight">
                      <span className="block text-xs font-normal text-gray-400">OCT</span>15
                    </span>
                    <span className="badge bg-purple-100 text-purple-700 capitalize">{upcoming[0].type}</span>
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-navy-900 mb-3">{upcoming[0].title}</h2>
                  <div className="space-y-2 mb-5">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{upcoming[0].location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{upcoming[0].date} · {upcoming[0].time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="h-4 w-4" />
                      <span>{upcoming[0].attendees} attending</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">{upcoming[0].description}</p>
                  <button className="btn-gold">RSVP Now</button>
                </div>
              </div>
            </div>
          )}

          {/* Other Oct events */}
          <div className="grid md:grid-cols-2 gap-5">
            {upcoming.slice(1).map((event) => (
              <div key={event.id} className="card overflow-hidden">
                {event.image && (
                  <div className="h-44 relative">
                    <Image src={event.image} alt={event.title} fill className="object-cover" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-navy-900 text-white text-sm font-bold px-2 py-1 rounded-lg text-center">
                      <span className="block text-xs font-normal text-gray-400">OCT</span>
                      {event.date.split(' ')[1].replace(',', '')}
                    </span>
                    <span className={`badge capitalize ${event.type === 'networking' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{event.type}</span>
                    {event.isOnline && <span className="badge bg-gray-100 text-gray-500 flex items-center gap-1"><Wifi className="h-3 w-3" />Online</span>}
                  </div>
                  <h3 className="font-bold text-navy-900 text-lg mb-2">{event.title}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-7 h-7 bg-navy-700 rounded-full border-2 border-white flex items-center justify-center text-xs text-white">
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                      <div className="w-7 h-7 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs text-gray-600">
                        +{event.attendees - 3}
                      </div>
                    </div>
                    <button className="btn-primary text-xs py-2 px-4">RSVP</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* November events */}
        {later.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Calendar className="h-4 w-4 text-gold-500" />
              <h2 className="font-bold text-navy-900 font-serif">November 2023</h2>
            </div>
            <div className="space-y-3">
              {later.map((event) => (
                <div key={event.id} className="card p-5 flex items-center gap-5">
                  <div className="bg-navy-900 text-white text-center px-3 py-2 rounded-lg flex-shrink-0 w-14">
                    <span className="block text-xs text-gray-400">NOV</span>
                    <span className="text-lg font-bold leading-none">
                      {event.date.includes('November') ? event.date.split(' ')[1].replace(',', '') : '05'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {event.isOnline && <Wifi className="h-3.5 w-3.5 text-blue-500" />}
                      <h3 className="font-bold text-navy-900">{event.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500">{event.location} · {event.time}</p>
                  </div>
                  <button className="btn-outline text-sm py-2 px-4">
                    View →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
