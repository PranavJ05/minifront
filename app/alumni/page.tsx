'use client';
// app/alumni/page.tsx
import { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AlumniCard from '@/components/alumni/AlumniCard';
import AlumniFiltersPanel from '@/components/alumni/AlumniFilters';
import { mockAlumni } from '@/lib/mockData';
import { AlumniFilters } from '@/types';
import { Grid3X3, List, Users } from 'lucide-react';

export default function AlumniDirectoryPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<AlumniFilters>({
    search: '', batch: '', department: '', company: '', location: '',
  });

  const filteredAlumni = useMemo(() => {
    return mockAlumni.filter((alumni) => {
      const searchLower = filters.search.toLowerCase();
      if (filters.search && !(
        alumni.fullName.toLowerCase().includes(searchLower) ||
        alumni.currentCompany.toLowerCase().includes(searchLower) ||
        alumni.currentRole.toLowerCase().includes(searchLower) ||
        alumni.department.toLowerCase().includes(searchLower)
      )) return false;
      if (filters.batch && alumni.graduationYear !== filters.batch) return false;
      if (filters.department && alumni.department !== filters.department) return false;
      if (filters.company && alumni.currentCompany !== filters.company) return false;
      if (filters.location && alumni.location !== filters.location) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-navy-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gold-500/20 p-2 rounded-lg">
              <Users className="h-6 w-6 text-gold-400" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-white">Alumni Directory</h1>
          </div>
          <p className="text-gray-400">
            Connect with {mockAlumni.length.toLocaleString()}+ verified alumni across industries and locations
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="card p-5 mb-6">
          <AlumniFiltersPanel filters={filters} onFilterChange={setFilters} />
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-navy-800 font-semibold">{filteredAlumni.length} alumni found</p>
            <p className="text-sm text-gray-500">
              {Object.values(filters).some(v => v) ? 'Filtered results' : 'Showing all alumni'}
            </p>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-navy-800' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-navy-800' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Alumni grid/list */}
        {filteredAlumni.length > 0 ? (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
            : 'space-y-3'
          }>
            {filteredAlumni.map((alumni) => (
              <AlumniCard key={alumni.id} alumni={alumni} variant={viewMode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-bold text-navy-900 text-lg mb-2">No alumni found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filters or search terms.</p>
            <button
              onClick={() => setFilters({ search: '', batch: '', department: '', company: '', location: '' })}
              className="btn-outline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
