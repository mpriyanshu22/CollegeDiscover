'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, Star, Globe, Calendar, GraduationCap, Building, Bookmark } from 'lucide-react';
import axios from 'axios';
import { useCompare } from '@/context/CompareContext';
import { useAuth } from '@/context/AuthContext';

type Course = { id: string; name: string; duration: string; fees: number; seats: number };
type Review = { id: string; author: string; rating: number; content: string; batch: number; createdAt: string };
type Cutoff = { id: string; exam: string; category: string; rankFrom: number; rankTo: number };

type CollegeDetail = {
  id: string;
  name: string;
  location: string;
  state: string;
  type: string;
  category: string;
  fees: number;
  rating: number;
  established: number;
  imageUrl: string;
  overview: string;
  website: string | null;
  naacGrade: string | null;
  nirfRank: number | null;
  placementAvgSalary: number | null;
  placementHighestSalary: number | null;
  placementPercent: number | null;
  courses: Course[];
  reviews: Review[];
  cutoffs: Cutoff[];
};

export default function CollegeDetailPage() {
  const params = useParams();
  const [college, setCollege] = useState<CollegeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { compareIds, addCompareId, removeCompareId } = useCompare();
  const { user, toggleSaveCollege } = useAuth();

  useEffect(() => {
    if (params.id) {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/colleges/${params.id}`)
        .then(res => {
          setCollege(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [params.id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-medium">Loading college details...</div>;
  }

  if (!college) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-medium text-red-500">College not found</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="h-64 md:h-80 w-full relative">
          <img src={college.imageUrl} alt={college.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-20">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="text-white">
                  <div className="flex items-center gap-3 mb-2">
                    {college.nirfRank && (
                      <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        NIRF #{college.nirfRank}
                      </span>
                    )}
                    {college.naacGrade && (
                      <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        NAAC {college.naacGrade}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold mb-2">{college.name}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-200">
                    <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {college.location}, {college.state}</span>
                    <span className="flex items-center"><Star className="w-4 h-4 mr-1 text-amber-400 fill-current" /> {college.rating} Rating</span>
                    <span className="flex items-center"><Building className="w-4 h-4 mr-1" /> {college.type}</span>
                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> Est. {college.established}</span>
                  </div>
                </div>
                <div className="flex gap-3 mt-4 md:mt-0">
                  <button 
                    onClick={() => toggleSaveCollege(college.id)}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-lg shadow transition flex items-center justify-center border border-white/20 backdrop-blur-sm"
                    title={user?.savedColleges.includes(college.id) ? "Remove Bookmark" : "Save College"}
                  >
                    <Bookmark className={`w-5 h-5 ${user?.savedColleges.includes(college.id) ? 'fill-white' : ''}`} />
                  </button>
                  <button 
                    onClick={() => compareIds.includes(college.id) ? removeCompareId(college.id) : addCompareId(college.id)}
                    className={`font-bold py-2 px-6 rounded-lg shadow transition ${
                      compareIds.includes(college.id) 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 border-2 border-white' 
                        : 'bg-white text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    {compareIds.includes(college.id) ? 'Remove Compare' : 'Add to Compare'}
                  </button>
                  <button 
                    onClick={() => alert(`Your application process for ${college.name} has been initiated!`)}
                    className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition border-2 border-transparent"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200">
            {['overview', 'courses', 'placements', 'cutoffs', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Content) */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-4">About {college.name}</h2>
                <div className="prose max-w-none text-gray-600 whitespace-pre-line">
                  {college.overview}
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6">Courses & Fees</h2>
                <div className="space-y-6">
                  {college.courses.map((course) => (
                    <div key={course.id} className="border border-gray-100 rounded-lg p-5 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{course.name}</h3>
                          <p className="text-sm text-gray-500">{course.duration} • Full Time</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">₹{course.fees.toLocaleString('en-IN')}</div>
                          <p className="text-xs text-gray-500">First Year Fees</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-100 flex items-center text-sm text-gray-600">
                        <GraduationCap className="w-4 h-4 mr-2 text-blue-600" /> Intake: {course.seats} Seats
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'placements' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6">Placement Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                    <div className="text-sm text-blue-600 font-medium mb-1">Highest Salary</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {college.placementHighestSalary ? `₹${(college.placementHighestSalary / 100000).toFixed(1)} LPA` : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-5 border border-green-100">
                    <div className="text-sm text-green-600 font-medium mb-1">Average Salary</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {college.placementAvgSalary ? `₹${(college.placementAvgSalary / 100000).toFixed(1)} LPA` : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-5 border border-purple-100">
                    <div className="text-sm text-purple-600 font-medium mb-1">Placement Rate</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {college.placementPercent ? `${college.placementPercent}%` : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center justify-between">
                  <span>Student Reviews</span>
                  <span className="flex items-center text-lg bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">
                    <Star className="w-5 h-5 text-amber-400 fill-current mr-2" /> {college.rating} / 5.0
                  </span>
                </h2>
                <div className="space-y-6">
                  {college.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-bold text-gray-900">{review.author}</div>
                          <div className="text-xs text-gray-500">Batch of {review.batch} • {new Date(review.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(review.rating) ? 'fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{review.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'cutoffs' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6">Exam Cutoffs</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-sm">
                        <th className="p-4 rounded-tl-lg font-semibold">Exam</th>
                        <th className="p-4 font-semibold">Category</th>
                        <th className="p-4 font-semibold">Opening Rank</th>
                        <th className="p-4 rounded-tr-lg font-semibold">Closing Rank</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {college.cutoffs.map((cutoff) => (
                        <tr key={cutoff.id} className="hover:bg-gray-50/50">
                          <td className="p-4 font-medium text-gray-900">{cutoff.exam}</td>
                          <td className="p-4 text-gray-600">{cutoff.category}</td>
                          <td className="p-4 text-gray-600">{cutoff.rankFrom}</td>
                          <td className="p-4 text-gray-600">{cutoff.rankTo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-lg mb-4 border-b border-gray-100 pb-2">Quick Facts</h3>
              <ul className="space-y-4">
                <li className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Category</span>
                  <span className="font-medium text-gray-900">{college.category}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Institution Type</span>
                  <span className="font-medium text-gray-900">{college.type}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">First Year Fees</span>
                  <span className="font-medium text-gray-900">₹{college.fees.toLocaleString('en-IN')}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Total Courses</span>
                  <span className="font-medium text-gray-900">{college.courses.length}</span>
                </li>
                {college.website && (
                  <li className="pt-4 mt-2 border-t border-gray-100">
                    <a href={college.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition text-sm font-medium">
                      <Globe className="w-4 h-4" /> Visit Official Website
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
