'use client';

import React from 'react';

// Local types to avoid separate types file
interface Post {
  id: number;
  title: string;
  content: string;
  category: 'help' | 'project' | 'discussion';
  author: string;
  time: string;
  likes: number;
  comments: number;
  views: number;
  solved: boolean;
  image?: string;
}

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    help: '❓',
    project: '🚀',
    discussion: '💭'
  };
  return icons[category] || '📄';
};

const getCategoryStyles = (category: string) => {
  const styles: Record<string, string> = {
    help: 'bg-red-500/20 text-red-400',
    project: 'bg-blue-500/20 text-blue-400',
    discussion: 'bg-purple-500/20 text-purple-400'
  };
  return styles[category] || 'bg-gray-500/20 text-gray-400';
};

interface Props {
  filteredPosts: Post[];
  selectedFilter: string;
  setSelectedFilter: (v: string) => void;
  bookmarkedPosts: Set<number>;
  toggleBookmark: (postId: number, e: React.MouseEvent) => void;
  openPostModal: (post: Post) => void;
}

export default function MainContent({ filteredPosts, selectedFilter, setSelectedFilter, bookmarkedPosts, toggleBookmark, openPostModal }: Props) {
  return (
    <main className="bg-[#0E1217] overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 custom-scrollbar">
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[#2D3138] pb-2">
        {[
          { id: 'latest', label: '🕒 Latest' },
          { id: 'popular', label: '🔥 Popular' },
          { id: 'unsolved', label: '❓ Unsolved' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`px-3 md:px-5 py-2 rounded-md text-xs md:text-sm transition-all ${
              selectedFilter === filter.id
                ? 'bg-[#1C1F26] text-[#00ffc8] border-b-2 border-[#00ffc8]'
                : 'text-gray-400 hover:bg-[#1C1F26] hover:text-white'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-8">
        {filteredPosts.map(post => (
          <div
            key={post.id}
            onClick={() => openPostModal(post)}
            className="bg-[#1C1F26] border border-[#2D3138] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-4px] hover:border-[#00ffc8] hover:shadow-lg hover:shadow-[#00ffc8]/15 transition-all flex flex-col"
          >
            <div className="w-full h-[180px] bg-gradient-to-br from-[#1a1d29] to-[#2d1b4e] flex items-center justify-center text-5xl border-b border-[#2D3138] overflow-hidden">
              {post.image ? (
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                getCategoryIcon(post.category)
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <span className={`px-3 py-1 rounded-xl text-xs font-semibold ${getCategoryStyles(post.category)}`}>
                  {getCategoryIcon(post.category)} {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => toggleBookmark(post.id, e)}
                    className={`p-1.5 rounded-lg transition-all hover:scale-110 ${
                      bookmarkedPosts.has(post.id)
                        ? 'text-yellow-400 hover:text-yellow-300 bg-yellow-400/10'
                        : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10'
                    }`}
                    title={bookmarkedPosts.has(post.id) ? 'Remove bookmark' : 'Add bookmark'}
                  >
                    <span className="text-base">🔖</span>
                  </button>
                  <span className="text-xs text-gray-400">{post.time}</span>
                </div>
              </div>
              <h3 className="text-base font-semibold text-white mb-2 line-clamp-2 leading-snug">
                {post.title}
              </h3>
              <p className="text-sm text-gray-400 mb-4 flex-1 line-clamp-3 leading-relaxed">
                {post.content}
              </p>
              <div className="flex justify-between items-center pt-3 border-t border-[#2D3138]">
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>👍 {post.likes}</span>
                  <span>💬 {post.comments}</span>
                  <span>👁️ {post.views}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] rounded-full flex items-center justify-center text-xs">
                    👤
                  </div>
                  <span className="text-xs text-gray-400">{post.author}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
