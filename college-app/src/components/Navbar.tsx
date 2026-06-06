'use client';

import Link from 'next/link';
import { BookOpen, User, LogOut, Bookmark } from 'lucide-react';
import { useCompare } from '@/context/CompareContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { compareIds } = useCompare();
  const { user, logout } = useAuth();
  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">CollegeDiscover</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/colleges" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Find Colleges</Link>
            <Link href="/compare" className="text-gray-600 hover:text-blue-600 font-medium transition-colors relative">
              Compare
              {compareIds.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {compareIds.length}
                </span>
              )}
            </Link>
            <Link href="/predictor" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Predictor Tool</Link>
            
            <div className="h-6 w-px bg-gray-300 mx-2"></div>

            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/saved" className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium transition-colors">
                  <Bookmark className="w-4 h-4" /> Saved
                </Link>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">{user.name.split(' ')[0]}</span>
                </div>
                <button onClick={logout} className="text-gray-500 hover:text-red-600 transition-colors p-1" title="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Log in</Link>
                <Link href="/signup" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
