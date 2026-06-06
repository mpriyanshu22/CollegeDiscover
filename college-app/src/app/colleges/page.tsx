'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, IndianRupee, Star, Filter, Plus, Check, Bookmark } from 'lucide-react';
import axios from 'axios';
import { useCompare } from '@/context/CompareContext';
import { useAuth } from '@/context/AuthContext';

type College = {
  id: string;
  name: string;
  location: string;
  state: string;
  type: string;
  category: string;
  fees: number;
  rating: number;
  imageUrl: string;
  nirfRank: number | null;
};

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const { compareIds, addCompareId, removeCompareId } = useCompare();
  const { user, toggleSaveCollege } = useAuth();

  useEffect(() => {
    fetchColleges();
  }, [search, category]);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('q', search);
      if (category) params.append('category', category);
      
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/colleges?${params.toString()}`);
      setColleges(res.data.colleges);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Filter className="w-5 h-5"/> Filters</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select 
                className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Engineering">Engineering</option>
                <option value="Medical">Medical</option>
                <option value="Management">Management</option>
                <option value="Law">Law</option>
                <option value="Arts">Arts</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-8 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
              placeholder="Search colleges by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="bg-white rounded-xl h-80 shadow-sm animate-pulse border border-gray-100"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colleges.map((college) => (
                <div key={college.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col">
                  <div className="h-48 relative overflow-hidden">
                    <img src={college.imageUrl} alt={college.name} className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => { e.preventDefault(); toggleSaveCollege(college.id); }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-sm hover:bg-white hover:scale-110 transition-all z-10"
                      title={user?.savedColleges.includes(college.id) ? "Remove Bookmark" : "Save College"}
                    >
                      <Bookmark className={`w-5 h-5 ${user?.savedColleges.includes(college.id) ? 'fill-blue-600 text-blue-600' : 'text-gray-600'}`} />
                    </button>
                    {college.nirfRank && (
                      <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                        NIRF #{college.nirfRank}
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{college.name}</h3>
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <MapPin className="w-4 h-4 mr-1" /> {college.location}, {college.state}
                    </div>
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
                      <div className="flex items-center font-semibold text-gray-900">
                        <IndianRupee className="w-4 h-4 mr-1" /> {college.fees.toLocaleString('en-IN')}/yr
                      </div>
                      <div className="flex items-center text-amber-500 font-medium">
                        <Star className="w-4 h-4 mr-1 fill-current" /> {college.rating}
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Link href={`/colleges/${college.id}`} className="flex-1 text-center bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium py-2 rounded-lg transition-colors">
                        View Details
                      </Link>
                      <button 
                        onClick={() => compareIds.includes(college.id) ? removeCompareId(college.id) : addCompareId(college.id)}
                        className={`p-2 rounded-lg transition-colors flex items-center justify-center border ${
                          compareIds.includes(college.id) 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                        }`}
                        title={compareIds.includes(college.id) ? "Remove from Compare" : "Add to Compare"}
                      >
                        {compareIds.includes(college.id) ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {colleges.length === 0 && (
                <div className="col-span-full py-20 text-center text-gray-500">
                  No colleges found matching your criteria.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Compare Action Button */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-8 right-8 z-50">
          <Link href="/compare" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center gap-2 hover:scale-105 transition-transform border-4 border-white">
            <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm">
              {compareIds.length}
            </span>
            View Comparison
          </Link>
        </div>
      )}
    </div>
  );
}
