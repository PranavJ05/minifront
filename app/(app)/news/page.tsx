// app/news/page.tsx
import Image from 'next/image';
import { Calendar, User, Tag, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { mockNews } from '@/lib/mockData';

export default function NewsPage() {
  const featured = mockNews[0];
  const rest = mockNews.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-navy-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-bold text-white mb-2">News & Announcements</h1>
          <p className="text-gray-400">Stay updated with our alumni community</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Featured */}
        {featured && (
          <div className="card overflow-hidden mb-8 grid lg:grid-cols-5">
            {featured.image && (
              <div className="lg:col-span-2 h-64 lg:h-auto relative">
                <Image src={featured.image} alt={featured.title} fill className="object-cover" />
              </div>
            )}
            <div className="lg:col-span-3 p-8">
              <span className="badge bg-gold-100 text-gold-700 mb-3 inline-block">{featured.category}</span>
              <h2 className="font-serif text-2xl font-bold text-navy-900 mb-3">{featured.title}</h2>
              <p className="text-gray-600 leading-relaxed mb-5">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-5">
                <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{featured.author}</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{featured.date}</span>
              </div>
              <button className="btn-primary flex items-center gap-2">
                Read Full Story <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['All', 'Announcement', 'Achievement', 'Programs', 'Events', 'Research'].map((cat, i) => (
            <button key={cat} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${i === 0 ? 'bg-navy-800 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-navy-300'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Rest of news */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((news) => (
            <article key={news.id} className="card overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              {news.image && (
                <div className="h-48 overflow-hidden">
                  <Image src={news.image} alt={news.title} width={400} height={192} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge bg-navy-50 text-navy-700 flex items-center gap-1">
                    <Tag className="h-3 w-3" />{news.category}
                  </span>
                </div>
                <h3 className="font-bold text-navy-900 mb-2 group-hover:text-navy-700 transition-colors">{news.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-3">{news.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{news.author}</span>
                  <span>{news.date}</span>
                </div>
              </div>
            </article>
          ))}

          {/* Placeholder cards */}
          {[1, 2].map((i) => (
            <article key={`placeholder-${i}`} className="card overflow-hidden">
              <div className="h-48 bg-gray-100 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-100 rounded w-20 animate-pulse" />
                <div className="h-5 bg-gray-100 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
              </div>
            </article>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
