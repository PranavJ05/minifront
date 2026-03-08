// components/alumni/AlumniCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Briefcase, MessageSquare, UserPlus } from 'lucide-react';
import { Alumni } from '@/types';
import { getInitials } from '@/lib/utils';

interface AlumniCardProps {
  alumni: Alumni;
  variant?: 'grid' | 'list';
}

export default function AlumniCard({ alumni, variant = 'grid' }: AlumniCardProps) {
  if (variant === 'list') {
    return (
      <div className="card p-4 flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-navy-200">
            {alumni.profilePicture ? (
              <Image src={alumni.profilePicture} alt={alumni.fullName} width={56} height={56} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full bg-navy-800 flex items-center justify-center text-white font-bold">
                {getInitials(alumni.fullName)}
              </div>
            )}
          </div>
          {alumni.isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gold-600 font-semibold uppercase tracking-wider">
            CLASS OF {alumni.graduationYear} · {alumni.department}
          </p>
          <h3 className="font-bold text-navy-900 text-base">{alumni.fullName}</h3>
          <p className="text-gray-500 text-sm truncate">{alumni.currentRole} at {alumni.currentCompany}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button className="flex items-center gap-1.5 border border-navy-800 text-navy-800 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-navy-800 hover:text-white transition-colors">
            <MessageSquare className="h-3.5 w-3.5" />
            Message
          </button>
          <Link
            href={`/alumni/${alumni.id}`}
            className="flex items-center gap-1.5 bg-navy-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-navy-700 transition-colors"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Connect
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/alumni/${alumni.id}`} className="card block group overflow-hidden">
      {/* Header */}
      <div className="bg-navy-800 h-16 relative">
        <div className="absolute -bottom-8 left-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white shadow-md bg-navy-200 border-[3px]">
            {alumni.profilePicture ? (
              <Image src={alumni.profilePicture} alt={alumni.fullName} width={64} height={64} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full bg-navy-700 flex items-center justify-center text-white font-bold text-lg">
                {getInitials(alumni.fullName)}
              </div>
            )}
          </div>
          {alumni.isOnline && (
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-10">
        <p className="text-xs text-gold-600 font-semibold uppercase tracking-wider mb-1">
          CLASS OF {alumni.graduationYear} · {alumni.department}
        </p>
        <h3 className="font-bold text-navy-900 text-base group-hover:text-navy-700 transition-colors">
          {alumni.fullName}
        </h3>
        <p className="text-gray-500 text-sm mb-2">{alumni.currentRole}</p>

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
          <Briefcase className="h-3.5 w-3.5" />
          <span>{alumni.currentCompany}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <MapPin className="h-3.5 w-3.5" />
          <span>{alumni.location}</span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {alumni.skills.slice(0, 3).map((skill) => (
            <span key={skill} className="badge bg-navy-50 text-navy-700">{skill}</span>
          ))}
          {alumni.skills.length > 3 && (
            <span className="badge bg-gray-100 text-gray-500">+{alumni.skills.length - 3}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            className="flex-1 flex items-center justify-center gap-1.5 border border-navy-300 text-navy-700 text-xs font-semibold py-2 rounded-lg hover:border-navy-800 hover:bg-navy-50 transition-colors"
            onClick={(e) => { e.preventDefault(); }}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Message
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-1.5 bg-navy-800 text-white text-xs font-semibold py-2 rounded-lg hover:bg-navy-700 transition-colors"
            onClick={(e) => { e.preventDefault(); }}
          >
            <UserPlus className="h-3.5 w-3.5" />
            Connect
          </button>
        </div>
      </div>
    </Link>
  );
}
