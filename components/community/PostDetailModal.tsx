'use client';

import React, { useEffect } from 'react';

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

// Function to detect and linkify URLs in text
const renderContentWithLinks = (text: string) => {
  // Regex to detect URLs (http, https, and www)
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
  
  const parts = text.split(urlRegex).filter(Boolean);
  
  return parts.map((part, index) => {
    // Check if this part is a URL
    if (part && part.match(urlRegex)) {
      // Add https:// prefix if it's a www link without protocol
      const href = part.startsWith('www.') ? `https://${part}` : part;
      
      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline hover:no-underline transition-colors"
        >
          {part}
        </a>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
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

export default function PostDetailModal({
  selectedPost,
  closePostModal,
  comments,
  bookmarkedPosts,
  toggleBookmark,
  handleAddComment,
  newComment,
  setNewComment
}: Props) {
  // Hide bottom nav bar on mobile when modal is open
  useEffect(() => {
    if (selectedPost) {
      // Add class to body to hide bottom nav (mobile only)
      document.body.classList.add('modal-open');
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      // Cleanup: remove class and restore scroll
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    };
  }, [selectedPost]);

  if (!selectedPost) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center overflow-hidden"
        onClick={closePostModal}
      >
        {/* Scrollable wrapper - full viewport height */}
        <div className="w-full h-full overflow-y-auto external-scrollbar">
          {/* Modal Container - full screen on mobile, centered on desktop */}
          <div className="max-w-4xl mx-auto h-full flex items-stretch md:px-4">
            <div 
              className="w-full bg-[#1C1F26] shadow-2xl my-0 md:rounded-xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Section */}
              <div className="p-6 border-b border-[#2D3138] flex-shrink-0 bg-[#1C1F26]">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] rounded-full flex items-center justify-center text-lg">
                      👤
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{selectedPost.author}</h3>
                      <p className="text-gray-400 text-sm">{selectedPost.time}</p>
                    </div>
                    <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${getCategoryStyles(selectedPost.category)}`}>
                      {getCategoryIcon(selectedPost.category)} {selectedPost.category.charAt(0).toUpperCase() + selectedPost.category.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => selectedPost && toggleBookmark(selectedPost.id, e)}
                      className={`p-2 rounded-lg transition-all hover:scale-110 ${
                        selectedPost && bookmarkedPosts.has(selectedPost.id)
                          ? 'text-yellow-400 hover:text-yellow-300 bg-yellow-400/10'
                          : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10'
                      }`}
                      title={selectedPost && bookmarkedPosts.has(selectedPost.id) ? 'Remove bookmark' : 'Add bookmark'}
                    >
                      🔖
                    </button>
                    <button
                      onClick={closePostModal}
                      className="w-10 h-10 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all text-red-400 hover:text-red-300 text-2xl hover:rotate-90 duration-300"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>

              {/* Post Content Section */}
              <div className="p-6 border-b border-[#2D3138] flex-shrink-0 bg-[#1C1F26]">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                  {selectedPost.title}
                </h1>

                {/* Display Image if exists */}
                {selectedPost.image && (
                  <div className="mb-6 rounded-xl overflow-hidden">
                    <img 
                      src={selectedPost.image} 
                      alt="Post attachment" 
                      className="w-full h-auto max-h-96 object-cover"
                    />
                  </div>
                )}

                <div className="text-white/90 leading-relaxed text-base md:text-lg whitespace-pre-wrap">
                  {renderContentWithLinks(selectedPost.content)}
                </div>

                {/* Post Stats */}
                <div className="flex items-center gap-6 mt-6 pt-6 border-t border-[#2D3138] bg-[#1C1F26]">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    👍 {selectedPost.likes}
                  </span>
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    💬 {selectedPost.comments}
                  </span>
                  <button
                    onClick={(e) => toggleBookmark(selectedPost.id, e)}
                    className={`ml-auto px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                      bookmarkedPosts.has(selectedPost.id)
                        ? 'text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20'
                        : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10'
                    }`}
                  >
                    🔖 {bookmarkedPosts.has(selectedPost.id) ? 'Bookmarked' : 'Bookmark'}
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="p-6 flex-1 bg-[#1C1F26]">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  💬 Comments ({comments[selectedPost.id]?.length || 0})
                </h2>

                {/* Comment Form */}
                <div className="mb-6">
                  <textarea
                    placeholder="Share your thoughts..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-4 py-3 bg-[#252930] border border-[#2D3138] rounded-xl text-white mb-4 focus:outline-none focus:border-[#00ffc8] resize-none min-h-[100px]"
                  />
                  <button
                    onClick={handleAddComment}
                    className="px-8 py-3 bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] rounded-lg text-[#0E1217] font-semibold hover:translate-y-[-2px] hover:shadow-lg hover:shadow-[#00ffc8]/40 transition-all"
                  >
                    Post Comment
                  </button>
                </div>

                {/* Comments List */}
                <div className="space-y-4 pb-24 md:pb-6">
                  {(comments[selectedPost.id] || []).map((comment, index) => (
                    <div 
                      key={index} 
                      className="bg-[#252930] p-4 rounded-xl border-l-4 border-[#00ffc8] hover:bg-[#2A2D35] transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] rounded-full flex items-center justify-center text-sm">
                            👤
                          </div>
                          <span className="text-[#00ffc8] font-semibold">{comment.author}</span>
                        </div>
                        <span className="text-gray-400 text-xs">{comment.time}</span>
                      </div>
                      <div className="text-white/80 leading-relaxed ml-10">
                        {renderContentWithLinks(comment.text)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          /* Hide bottom nav ONLY on mobile when modal is open */
          @media (max-width: 767px) {
            body.modal-open nav.fixed.bottom-0 {
              display: none !important;
            }
          }
          
          /* Hide scrollbar on mobile */
          @media (max-width: 767px) {
            .external-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .external-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          }
          
          /* Show scrollbar on desktop */
          @media (min-width: 768px) {
            .external-scrollbar::-webkit-scrollbar {
              width: 14px;
            }
            
            .external-scrollbar::-webkit-scrollbar-track {
              background: rgba(0, 0, 0, 0.3);
            }
            
            .external-scrollbar::-webkit-scrollbar-thumb {
              background: #4a5568;
              border-radius: 7px;
              border: 3px solid rgba(0, 0, 0, 0.3);
            }
            
            .external-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #5a6678;
            }

            .external-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: #4a5568 rgba(0, 0, 0, 0.3);
            }
          }
        `}</style>
      </div>
    </>
  );
}