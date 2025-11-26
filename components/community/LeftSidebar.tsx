'use client';

import React from 'react';

interface Props {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  showBookmarks: boolean;
  setShowBookmarks: (v: boolean) => void;
  bookmarkedCount: number;
}

export default function LeftSidebar({ selectedCategory, setSelectedCategory, showBookmarks, setShowBookmarks, bookmarkedCount }: Props) {
  return (
    <aside className="hidden md:flex bg-[#1C1F26] border-r border-[#2D3138] overflow-y-auto flex-col py-4 no-scrollbar">
      {/* Navigation */}
      <nav className="py-4 border-b border-[#2D3138]">
        <div 
          onClick={() => {
            setShowBookmarks(false);
            setSelectedCategory('all');
          }}
          className={`flex items-center px-4 py-3 transition-colors cursor-pointer gap-3 ${
            !showBookmarks 
              ? 'text-[#00ffc8] bg-[#2A2D35] border-l-3 border-[#00ffc8]' 
              : 'text-gray-400 hover:bg-[#252930] hover:text-white'
          }`}
        >
          <span className="text-xl">📱</span>
          <span className="text-sm">For You</span>
        </div>
        <div className="flex items-center px-4 py-3 text-gray-400 hover:bg-[#252930] hover:text-white transition-colors cursor-pointer gap-3">
          <span className="text-xl">👥</span>
          <span className="text-sm">Following</span>
        </div>
        <div className="flex items-center px-4 py-3 text-gray-400 hover:bg-[#252930] hover:text-white transition-colors cursor-pointer gap-3">
          <span className="text-xl">🔥</span>
          <span className="text-sm">Explore</span>
        </div>
        <div 
          onClick={() => {
            setShowBookmarks(!showBookmarks);
            setSelectedCategory('all');
          }}
          className={`flex items-center justify-between px-4 py-3 transition-colors cursor-pointer gap-3 ${
            showBookmarks 
              ? 'text-[#00ffc8] bg-[#2A2D35] border-l-3 border-[#00ffc8]' 
              : 'text-gray-400 hover:bg-[#252930] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🔖</span>
            <span className="text-sm">Bookmarks</span>
          </div>
          <span className="bg-[#2D3138] px-2 py-0.5 rounded-full text-xs text-gray-400">
            {bookmarkedCount}
          </span>
        </div>
      </nav>

      {/* Categories */}
      <div className="py-4 border-b border-[#2D3138]">
        <div className="flex justify-between items-center px-4 pb-3">
          <h4 className="text-xs text-gray-400 uppercase tracking-wider">📊 Categories</h4>
          <button className="text-xs text-gray-400">▼</button>
        </div>
        <ul>
          {[
            { id: 'all', label: '🌐 All Topics', count: 45 },
            { id: 'help', label: '❓ Help Needed', count: 18 },
            { id: 'project', label: '🚀 Projects', count: 15 },
            { id: 'discussion', label: '💭 Discussions', count: 12 }
          ].map(cat => (
            <li
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex justify-between items-center px-4 py-3 cursor-pointer transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#2A2D35] text-[#00ffc8] border-l-3 border-[#00ffc8]'
                  : 'text-gray-400 hover:bg-[#252930] hover:text-white'
              }`}
            >
              <span className="text-sm">{cat.label}</span>
              <span className="bg-[#2D3138] px-2 py-0.5 rounded-full text-xs">{cat.count}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* User Profile */}
      <div className="mt-auto mx-4 mb-4 p-4 bg-[#252930] rounded-lg flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] rounded-full flex items-center justify-center text-lg flex-shrink-0">
          👤
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white mb-1">Welcome, Engineer!</h3>
          <p className="text-xs text-gray-400 flex gap-2">
            <span>🏆 50 Points</span>
            <span>💬 12 Posts</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
