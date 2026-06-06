import Link from 'next/link';
import { Search, Award, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Find Your Dream College</h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Discover top colleges, compare fees, check NIRF rankings, and predict your admission chances all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/colleges" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <Search className="w-5 h-5" /> Explore Colleges
            </Link>
            <Link href="/predictor" className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" /> Predict Admission
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Discovery</h3>
              <p className="text-gray-600">Filter through hundreds of colleges by location, category, fees, and more.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Side-by-side Compare</h3>
              <p className="text-gray-600">Confused between colleges? Compare them side-by-side on 15+ different parameters.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Rank Predictor</h3>
              <p className="text-gray-600">Enter your JEE, NEET, or CAT rank and find out which colleges you can get into.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
