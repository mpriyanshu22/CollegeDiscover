'use client';

import { useEffect, useState } from 'react';
import { Plus, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCompare } from '@/context/CompareContext';
import axios from 'axios';

type College = {
  id: string; name: string; category: string; fees: number; rating: number; nirfRank: number | null;
  placementAvgSalary: number; placementHighestSalary: number; type: string;
};

export default function ComparePage() {
  const { compareIds, removeCompareId, clearCompare } = useCompare();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (compareIds.length === 0) {
      setColleges([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/compare?ids=${compareIds.join(',')}`)
      .then(res => {
        setColleges(res.data.colleges);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [compareIds]);

  if (loading) return <div className="text-center py-20 text-xl font-semibold">Loading comparison...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Compare Colleges</h1>
            <p className="text-gray-600">Side-by-side comparison of your selected institutions.</p>
          </div>
          <div className="flex gap-4">
            {colleges.length > 0 && (
              <button onClick={clearCompare} className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors font-medium">
                Clear All
              </button>
            )}
            <Link href="/colleges" className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors font-medium">
              <ArrowLeft className="w-5 h-5" /> Back to Search
            </Link>
          </div>
        </div>

        {colleges.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-medium text-gray-700 mb-2">No colleges selected for comparison</h2>
            <p className="mb-6">Go to the colleges directory and click &quot;Compare&quot; on up to 3 colleges.</p>
            <Link href="/colleges" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow transition-colors">
              Find Colleges to Compare
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="p-6 border-b border-gray-200 bg-gray-50 text-gray-500 font-medium w-1/4">Features</th>
                  {colleges.map(c => (
                    <th key={c.id} className="p-6 border-b border-gray-200 border-l relative w-1/4">
                      <button onClick={() => removeCompareId(c.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <h3 className="text-xl font-bold text-gray-900 mt-4">{c.name}</h3>
                      <p className="text-blue-600 font-medium">{c.category}</p>
                    </th>
                  ))}
                  {/* Fill empty columns if less than 3 colleges */}
                  {Array.from({ length: 3 - colleges.length }).map((_, i) => (
                    <th key={`empty-${i}`} className="p-6 border-b border-gray-200 border-l bg-gray-50/50 w-1/4 text-center">
                      <Link href="/colleges" className="inline-flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 transition-colors">
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mb-2">
                          <Plus className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium">Add College</span>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-6 border-b border-gray-200 bg-gray-50 font-medium text-gray-700">Institution Type</td>
                  {colleges.map(c => <td key={c.id} className="p-6 border-b border-gray-200 border-l font-semibold text-gray-900">{c.type}</td>)}
                  {Array.from({ length: 3 - colleges.length }).map((_, i) => <td key={`e1-${i}`} className="p-6 border-b border-gray-200 border-l bg-gray-50/50"></td>)}
                </tr>
                <tr>
                  <td className="p-6 border-b border-gray-200 bg-gray-50 font-medium text-gray-700">NIRF Ranking</td>
                  {colleges.map(c => <td key={c.id} className="p-6 border-b border-gray-200 border-l font-semibold text-gray-900">{c.nirfRank ? `#${c.nirfRank}` : 'N/A'}</td>)}
                  {Array.from({ length: 3 - colleges.length }).map((_, i) => <td key={`e2-${i}`} className="p-6 border-b border-gray-200 border-l bg-gray-50/50"></td>)}
                </tr>
                <tr>
                  <td className="p-6 border-b border-gray-200 bg-gray-50 font-medium text-gray-700">Rating</td>
                  {colleges.map(c => <td key={c.id} className="p-6 border-b border-gray-200 border-l"><span className="bg-green-100 text-green-800 font-bold px-2 py-1 rounded">{c.rating} / 5</span></td>)}
                  {Array.from({ length: 3 - colleges.length }).map((_, i) => <td key={`e3-${i}`} className="p-6 border-b border-gray-200 border-l bg-gray-50/50"></td>)}
                </tr>
                <tr>
                  <td className="p-6 border-b border-gray-200 bg-gray-50 font-medium text-gray-700">Annual Fees</td>
                  {colleges.map(c => <td key={c.id} className="p-6 border-b border-gray-200 border-l font-semibold text-gray-900">₹{c.fees?.toLocaleString('en-IN') || 'N/A'}</td>)}
                  {Array.from({ length: 3 - colleges.length }).map((_, i) => <td key={`e4-${i}`} className="p-6 border-b border-gray-200 border-l bg-gray-50/50"></td>)}
                </tr>
                <tr>
                  <td className="p-6 border-b border-gray-200 bg-gray-50 font-medium text-gray-700">Average Salary</td>
                  {colleges.map(c => <td key={c.id} className="p-6 border-b border-gray-200 border-l font-semibold text-blue-700">₹{c.placementAvgSalary?.toLocaleString('en-IN') || 'N/A'}</td>)}
                  {Array.from({ length: 3 - colleges.length }).map((_, i) => <td key={`e5-${i}`} className="p-6 border-b border-gray-200 border-l bg-gray-50/50"></td>)}
                </tr>
                <tr>
                  <td className="p-6 border-gray-200 bg-gray-50 font-medium text-gray-700">Highest Salary</td>
                  {colleges.map(c => <td key={c.id} className="p-6 border-gray-200 border-l font-semibold text-green-700">₹{c.placementHighestSalary?.toLocaleString('en-IN') || 'N/A'}</td>)}
                  {Array.from({ length: 3 - colleges.length }).map((_, i) => <td key={`e6-${i}`} className="p-6 border-gray-200 border-l bg-gray-50/50"></td>)}
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
