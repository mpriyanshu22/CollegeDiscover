'use client';

import { useState } from 'react';
import { Search, TrendingUp, Award, MapPin } from 'lucide-react';
import axios from 'axios';

type College = {
  id: string;
  name: string;
  location: string;
  fees: number;
  imageUrl: string;
  nirfRank: number | null;
  rating: number;
};

export default function PredictorPage() {
  const [exam, setExam] = useState('JEE_MAIN');
  const [rank, setRank] = useState('');
  const [category, setCategory] = useState('General');
  const [results, setResults] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rank) return;
    
    setLoading(true);
    setHasSearched(true);
    
    try {
      const res = await axios.post('http://localhost:5000/api/predictor', {
        exam,
        rank: parseInt(rank),
        category
      });
      setResults(res.data.colleges);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">College Rank Predictor</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find out which colleges you can get into based on your entrance exam rank. Our AI-driven engine analyzes past year cutoffs to give you the most accurate predictions.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-10 mb-10">
          <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Exam</label>
              <select 
                className="w-full border-gray-300 rounded-lg shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500"
                value={exam}
                onChange={(e) => setExam(e.target.value)}
              >
                <option value="JEE_MAIN">JEE Main</option>
                <option value="JEE_ADV">JEE Advanced</option>
                <option value="NEET">NEET</option>
                <option value="CAT">CAT</option>
                <option value="CLAT">CLAT</option>
                <option value="CUET">CUET</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select 
                className="w-full border-gray-300 rounded-lg shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rank</label>
              <input 
                type="number"
                placeholder="e.g. 5000"
                required
                className="w-full border-gray-300 rounded-lg shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
              />
            </div>
            
            <div className="md:col-span-3 flex justify-center mt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-xl shadow-lg transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
              >
                {loading ? 'Analyzing Data...' : <><Search className="w-5 h-5" /> Predict Colleges</>}
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-4">
              {results.length > 0 ? `Good news! You have ${results.length} predicted colleges.` : 'No colleges found for this rank.'}
            </h2>
            
            {loading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white rounded-xl h-24 animate-pulse shadow-sm"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {results.map(college => (
                  <div key={college.id} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col sm:flex-row gap-5 items-center">
                    <img src={college.imageUrl} alt={college.name} className="w-24 h-24 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-bold text-lg text-gray-900">{college.name}</h3>
                      <div className="text-sm text-gray-500 flex items-center justify-center sm:justify-start mt-1 mb-2">
                        <MapPin className="w-4 h-4 mr-1" /> {college.location}
                      </div>
                      <div className="flex gap-3 justify-center sm:justify-start">
                        <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-1 rounded">High Chance</span>
                        {college.nirfRank && (
                          <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-1 rounded flex items-center">
                            <Award className="w-3 h-3 mr-1" /> NIRF {college.nirfRank}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <a href={`/colleges/${college.id}`} className="inline-block text-blue-600 bg-blue-50 hover:bg-blue-100 font-semibold px-5 py-2 rounded-lg transition text-sm">
                        View College
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
      </div>
    </div>
  );
}
