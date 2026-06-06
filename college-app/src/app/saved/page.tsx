'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Bookmark, MapPin, IndianRupee, Star } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

type College = {
  id: string;
  name: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  imageUrl: string;
};

export default function SavedCollegesPage() {
  const { user, toggleSaveCollege } = useAuth();
  const [savedColleges, setSavedColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSavedColleges();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSavedColleges = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/user/saved-colleges`);
      setSavedColleges(res.data.savedColleges);
    } catch (error) {
      console.error('Error fetching saved colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 font-medium">Loading saved colleges...</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
        <p className="text-gray-600 mb-6">You need an account to save and view colleges.</p>
        <Link href="/login" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg">Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-100 p-3 rounded-lg">
          <Bookmark className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Saved Colleges</h1>
          <p className="text-gray-600">Review and compare the institutions you've bookmarked.</p>
        </div>
      </div>

      {savedColleges.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">No saved colleges yet</h2>
          <p className="text-gray-500 mb-6">Explore colleges and click the bookmark icon to save them here.</p>
          <Link href="/colleges" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
            Explore Colleges
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedColleges.map((college) => (
            <div key={college.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col">
              <div className="h-48 relative overflow-hidden">
                <img src={college.imageUrl} alt={college.name} className="w-full h-full object-cover" />
                <button
                  onClick={(e) => { 
                    e.preventDefault(); 
                    toggleSaveCollege(college.id);
                    setSavedColleges(prev => prev.filter(c => c.id !== college.id));
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-sm hover:scale-110 transition-transform z-10"
                  title="Remove Bookmark"
                >
                  <Bookmark className="w-5 h-5 fill-blue-600 text-blue-600" />
                </button>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{college.name}</h3>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <MapPin className="w-4 h-4 mr-1" /> {college.location}, {college.state}
                </div>
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 mb-4">
                  <div className="flex items-center font-semibold text-gray-900">
                    <IndianRupee className="w-4 h-4 mr-1" /> {college.fees.toLocaleString('en-IN')}/yr
                  </div>
                  <div className="flex items-center text-amber-500 font-medium">
                    <Star className="w-4 h-4 mr-1 fill-current" /> {college.rating}
                  </div>
                </div>
                <Link href={`/colleges/${college.id}`} className="w-full text-center bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium py-2 rounded-lg transition-colors">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
