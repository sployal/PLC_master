'use client';

import React from 'react';

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

interface Comment {
  author: string;
  text: string;
  time: string;
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
  selectedPost: Post | null;
  closePostModal: () => void;
  comments: Record<number, Comment[]>;
  bookmarkedPosts: Set<number>;
  toggleBookmark: (postId: number, e: React.MouseEvent) => void;
  handleAddComment: () => void;
  newComment: string;
  setNewComment: (v: string) => void;
}

export default function PostDetailModal({ selectedPost, closePostModal, comments, bookmarkedPosts, toggleBookmark, handleAddComment, newComment, setNewComment }: Props) {
  if (!selectedPost) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[1000] flex items-center justify-center p-0 md:p-4">
      <div className="bg-[#1C1F26] border-0 md:border border-[#2D3138] rounded-none md:rounded-2xl w-full h-full md:w-auto md:h-auto md:max-w-4xl md:max-h-[85vh] overflow-y-auto p-4 md:p-6 lg:p-8 relative custom-scrollbar">
        <div className="absolute right-4 top-4 md:right-6 md:top-6 flex items-center gap-3">
          <button
            onClick={(e) => selectedPost && toggleBookmark(selectedPost.id, e)}
            className={`p-2 rounded-lg transition-all hover:scale-110 ${
              selectedPost && bookmarkedPosts.has(selectedPost.id)
                ? 'text-yellow-400 hover:text-yellow-300 bg-yellow-400/10'
                : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10'
            }`}
            title={selectedPost && bookmarkedPosts.has(selectedPost.id) ? 'Remove bookmark' : 'Add bookmark'}
          >
            <span className="text-xl">🔖</span>
          </button>
          <button
            onClick={closePostModal}
            className="text-2xl text-gray-400 hover:text-[#00ffc8] hover:rotate-90 transition-all"
          >
            ×
          </button>
        </div>
        
        {/* Post Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] rounded-full flex items-center justify-center text-xl flex-shrink-0">
              👤
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">{selectedPost.author}</h3>
              <p className="text-sm text-gray-400">{selectedPost.time}</p>
            </div>
          </div>
          
          <span className={`inline-block px-3 py-1 rounded-xl text-xs font-semibold mb-4 ${getCategoryStyles(selectedPost.category)}`}>
            {getCategoryIcon(selectedPost.category)} {selectedPost.category.charAt(0).toUpperCase() + selectedPost.category.slice(1)}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{selectedPost.title}</h2>
          
          {/* Display Image if exists */}
          {selectedPost.image && (
            <div className="mb-6">
              <img 
                src={selectedPost.image} 
                alt={selectedPost.title} 
                className="w-full h-auto max-h-[500px] object-cover rounded-xl border border-[#2D3138]"
              />
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="bg-[#252930] p-4 md:p-6 rounded-xl mb-8 text-white/90 leading-relaxed text-sm md:text-base">
          {selectedPost.content}
        </div>

        {/* Post Stats */}
        <div className="flex gap-4 md:gap-6 items-center text-sm text-gray-400 mb-8 pb-8 border-b border-[#2D3138]">
          <span>👍 {selectedPost.likes}</span>
          <span>💬 {selectedPost.comments}</span>
          <span>👁️ {selectedPost.views}</span>
          <button
            onClick={(e) => toggleBookmark(selectedPost.id, e)}
            className={`ml-auto px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
              bookmarkedPosts.has(selectedPost.id)
                ? 'text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20'
                : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10'
            }`}
          >
            <span>🔖</span>
            <span className="text-xs">
              {bookmarkedPosts.has(selectedPost.id) ? 'Bookmarked' : 'Bookmark'}
            </span>
          </button>
        </div>

        {/* Comments Section */}
        <div>
          <h3 className="text-[#00ffc8] text-lg md:text-xl mb-6">
            💬 Comments ({comments[selectedPost.id]?.length || 0})
          </h3>

          {/* Comment Form */}
          <div className="mb-8">
            <textarea
              placeholder="Share your thoughts or solution..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-4 py-3 bg-[#252930] border border-[#2D3138] rounded-xl text-white mb-4 focus:outline-none focus:border-[#00ffc8] resize-none min-h-[100px] text-sm md:text-base"
            />
            <button
              onClick={handleAddComment}
              className="px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] rounded-lg text-[#0E1217] font-semibold hover:translate-y-[-2px] hover:shadow-lg hover:shadow-[#00ffc8]/40 transition-all text-sm md:text-base"
            >
              Post Comment
            </button>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {(comments[selectedPost.id] || []).map((comment, index) => (
              <div key={index} className="bg-[#252930] p-4 rounded-xl border-l-3 border-[#00ffc8]">
                <div className="flex justify-between mb-2">
                  <span className="text-[#00ffc8] font-semibold text-sm">{comment.author}</span>
                  <span className="text-gray-400 text-xs">{comment.time}</span>
                </div>
                <p className="text-white/80 leading-relaxed text-sm">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
