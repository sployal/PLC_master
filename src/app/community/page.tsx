 'use client';

import { useState, useEffect } from 'react';
import LeftSidebar from '../../../components/community/LeftSidebar';
import MainContent from '../../../components/community/MainContent';
import CreatePostModal from '../../../components/community/CreatePostModal';
import PostDetailModal from '../../../components/community/PostDetailModal';

// Local types (moved back here per request)
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

// Initial data
const initialPosts: Post[] = [
  {
    id: 1,
    title: "Help with TIA Portal V18 Connection Issues",
    content: "I'm having trouble connecting my S7-1200 PLC to TIA Portal V18. The device is showing up in the network but I can't establish a connection. I've checked the IP addresses and they're correct. Has anyone faced this issue before?",
    category: "help",
    author: "John Doe",
    time: "2 hours ago",
    likes: 12,
    comments: 5,
    views: 45,
    solved: false
  },
  {
    id: 2,
    title: "My Conveyor Belt Automation Project",
    content: "Just finished a complete automation project for a conveyor belt system using S7-1500 PLC. Implemented speed control, emergency stops, and material detection. Would love to share the ladder logic and get feedback from the community!",
    category: "project",
    author: "Sarah Engineer",
    time: "5 hours ago",
    likes: 28,
    comments: 12,
    views: 120,
    solved: false
  },
  {
    id: 3,
    title: "Best Practices for HMI Design?",
    content: "What are your best practices when designing HMI screens? I'm working on a water treatment plant SCADA system and want to ensure the interface is intuitive and professional. Any recommendations for color schemes, button layouts, and alarm management?",
    category: "discussion",
    author: "Mike Tech",
    time: "1 day ago",
    likes: 35,
    comments: 18,
    views: 200,
    solved: false
  },
  {
    id: 4,
    title: "Ladder Logic for Sequential Process Control",
    content: "Need help creating a ladder logic program for a sequential manufacturing process with 5 stations. Each station needs to complete before the next one starts. I'm stuck on implementing the sequencer function.",
    category: "help",
    author: "Alex Automation",
    time: "3 hours ago",
    likes: 8,
    comments: 3,
    views: 32,
    solved: false
  },
  {
    id: 5,
    title: "SCADA System Security Best Practices",
    content: "Looking for recommendations on securing industrial SCADA systems. What are the most important security measures you implement in your projects?",
    category: "discussion",
    author: "Security Pro",
    time: "6 hours ago",
    likes: 22,
    comments: 9,
    views: 78,
    solved: false
  },
  {
    id: 6,
    title: "PID Tuning for Temperature Control",
    content: "Working on a temperature control system and struggling with PID tuning. The system oscillates too much. Any tips on finding the right parameters?",
    category: "help",
    author: "Control Engineer",
    time: "4 hours ago",
    likes: 15,
    comments: 7,
    views: 56,
    solved: false
  }
];

const initialComments: Record<number, Comment[]> = {
  1: [
    { author: "Tech Helper", text: "Have you tried pinging the PLC IP address from your computer? This will help verify network connectivity.", time: "1 hour ago" },
    { author: "PLC Guru", text: "Check your firewall settings. Windows Firewall sometimes blocks TIA Portal communication. Add an exception for the application.", time: "45 minutes ago" }
  ],
  2: [
    { author: "Engineer Bob", text: "Impressive project! Would love to see the code. Did you implement any safety interlocks?", time: "4 hours ago" },
    { author: "Sarah Engineer", text: "Yes! Multiple safety interlocks including light curtains and emergency stop circuits. I'll share the full documentation soon.", time: "3 hours ago" }
  ],
  3: [
    { author: "UX Designer", text: "Keep it simple! Use consistent color coding - red for alarms, green for good status, yellow for warnings. Avoid cluttered screens.", time: "12 hours ago" }
  ],
  4: [
    { author: "Ladder Logic Pro", text: "Use SET and RESET coils for each station with interlock logic. I can share an example if you'd like.", time: "2 hours ago" }
  ],
  5: [
    { author: "InfoSec Expert", text: "Network segmentation is crucial. Keep your SCADA network separate from corporate IT networks.", time: "5 hours ago" }
  ],
  6: [
    { author: "PID Master", text: "Start with the Ziegler-Nichols method for initial tuning, then fine-tune based on system response.", time: "3 hours ago" }
  ]
};

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [comments, setComments] = useState<Record<number, Comment[]>>(initialComments);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFilter, setSelectedFilter] = useState<string>('latest');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState('');
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<number>>(new Set());
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'home' | 'explore' | 'bookmarks' | 'activity' | 'profile'>('home');

  // Form states
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<'help' | 'project' | 'discussion' | ''>('');
  const [newPostImage, setNewPostImage] = useState<string>('');
  const [formErrors, setFormErrors] = useState({
    title: false,
    content: false,
    category: false
  });

  // Helper functions
  // helper functions now live in component utilities

  // Toggle bookmark
  const toggleBookmark = (postId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening post modal when clicking bookmark
    setBookmarkedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  // Filter and search posts
  const getFilteredPosts = () => {
    let filtered = [...posts];

    // Filter by bookmarks if bookmarks view is active
    if (showBookmarks) {
      filtered = filtered.filter(post => bookmarkedPosts.has(post.id));
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedFilter === 'popular') {
      filtered.sort((a, b) => b.likes - a.likes);
    } else if (selectedFilter === 'unsolved') {
      filtered = filtered.filter(post => post.category === 'help' && !post.solved);
    }

    return filtered;
  };

  // Handle create post
  const handleCreatePost = () => {
    const errors = {
      title: !newPostTitle,
      content: !newPostContent,
      category: !newPostCategory
    };
    
    setFormErrors(errors);
    
    if (errors.title || errors.content || errors.category) {
      return;
    }

    const newPost: Post = {
      id: posts.length + 1,
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory as 'help' | 'project' | 'discussion',
      author: "You",
      time: "Just now",
      likes: 0,
      comments: 0,
      views: 0,
      solved: false,
      image: newPostImage || undefined
    };

    setPosts([newPost, ...posts]);
    setShowCreateModal(false);
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostCategory('');
    setNewPostImage('');
    setFormErrors({ title: false, content: false, category: false });
    alert('🎉 Your post has been published to the community!');
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPostImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle add comment
  const handleAddComment = () => {
    if (!selectedPost || !newComment.trim()) {
      alert('Please write a comment before posting!');
      return;
    }

    const comment: Comment = {
      author: "You",
      text: newComment,
      time: "Just now"
    };

    setComments(prev => ({
      ...prev,
      [selectedPost.id]: [comment, ...(prev[selectedPost.id] || [])]
    }));

    setPosts(prev => prev.map(post =>
      post.id === selectedPost.id
        ? { ...post, comments: post.comments + 1 }
        : post
    ));

    setNewComment('');
  };

  // Open post modal
  const openPostModal = (post: Post) => {
    setSelectedPost(post);
    setShowPostModal(true);
    // Push state to history for back button support
    if (typeof window !== 'undefined') {
      window.history.pushState({ modalOpen: true }, '');
    }
  };

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (showPostModal) {
        setShowPostModal(false);
        setSelectedPost(null);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [showPostModal]);

  // Clean up history when modal closes normally (not via back button)
  const closePostModal = () => {
    setShowPostModal(false);
    setSelectedPost(null);
    // Replace current state instead of going back to avoid navigation issues
    if (typeof window !== 'undefined' && window.history.state?.modalOpen) {
      window.history.replaceState({}, '');
    }
  };

  const filteredPosts = getFilteredPosts();

  return (
    <div className="min-h-screen bg-[#0E1217] text-white">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #4a5568 0%, #2d3748 100%);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #5a6678 0%, #3d4758 100%);
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #4a5568 transparent;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-[60px] bg-[#1C1F26] border-b border-[#2D3138] flex justify-between items-center px-4 md:px-8 z-50">
        <div className="flex items-center gap-4 md:gap-8 flex-1">
          <div className="text-lg md:text-xl font-bold bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] bg-clip-text text-transparent whitespace-nowrap">
            ⚡ PLC Master
          </div>
          {/* Mobile Search */}
          <div className="flex-1 max-w-md md:hidden">
            <input
              type="text"
              placeholder="🔍 Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#252930] border border-[#2D3138] rounded-lg text-white text-xs focus:outline-none focus:border-[#00ffc8] focus:bg-[#2A2D35] transition-all"
            />
          </div>
          {/* Desktop Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <input
              type="text"
              placeholder="🔍 Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-[#252930] border border-[#2D3138] rounded-lg text-white text-sm focus:outline-none focus:border-[#00ffc8] focus:bg-[#2A2D35] transition-all"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-[#252930] rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-2 md:px-5 md:py-2 bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] rounded-lg text-[#0E1217] font-semibold hover:translate-y-[-2px] hover:shadow-lg hover:shadow-[#00ffc8]/40 transition-all text-xs md:text-sm whitespace-nowrap"
          >
            <span className="hidden md:inline">➕ New post</span>
            <span className="md:hidden">➕</span>
          </button>
          <div className="hidden md:flex items-center gap-2 md:gap-3">
            <button className="p-1.5 md:p-2 hover:bg-[#252930] rounded-lg transition-colors text-gray-400 hover:text-white text-base md:text-lg">
              🔔
            </button>
            <button className="p-1.5 md:p-2 hover:bg-[#252930] rounded-lg transition-colors text-gray-400 hover:text-white text-base md:text-lg">
              📌
            </button>
            <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
              👤
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="fixed right-0 top-[60px] bottom-0 w-64 bg-[#1C1F26] border-l border-[#2D3138] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="py-4 border-b border-[#2D3138]">
              <div 
                onClick={() => {
                  setShowBookmarks(false);
                  setSelectedCategory('all');
                  setActiveMobileTab('home');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center px-4 py-3 transition-colors cursor-pointer gap-3 ${
                  !showBookmarks && activeMobileTab === 'home'
                    ? 'text-[#00ffc8] bg-[#2A2D35] border-l-3 border-[#00ffc8]' 
                    : 'text-gray-400 hover:bg-[#252930] hover:text-white'
                }`}
              >
                <span className="text-xl">📱</span>
                <span className="text-sm">For You</span>
              </div>
              <div 
                onClick={() => {
                  setActiveMobileTab('explore');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center px-4 py-3 transition-colors cursor-pointer gap-3 ${
                  activeMobileTab === 'explore'
                    ? 'text-[#00ffc8] bg-[#2A2D35] border-l-3 border-[#00ffc8]' 
                    : 'text-gray-400 hover:bg-[#252930] hover:text-white'
                }`}
              >
                <span className="text-xl">🔥</span>
                <span className="text-sm">Explore</span>
              </div>
              <div 
                onClick={() => {
                  setShowBookmarks(!showBookmarks);
                  setSelectedCategory('all');
                  setActiveMobileTab('bookmarks');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-3 transition-colors cursor-pointer gap-3 ${
                  showBookmarks || activeMobileTab === 'bookmarks'
                    ? 'text-[#00ffc8] bg-[#2A2D35] border-l-3 border-[#00ffc8]' 
                    : 'text-gray-400 hover:bg-[#252930] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🔖</span>
                  <span className="text-sm">Bookmarks</span>
                </div>
                <span className="bg-[#2D3138] px-2 py-0.5 rounded-full text-xs text-gray-400">
                  {bookmarkedPosts.size}
                </span>
              </div>
              <div 
                onClick={() => {
                  setActiveMobileTab('activity');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center px-4 py-3 transition-colors cursor-pointer gap-3 ${
                  activeMobileTab === 'activity'
                    ? 'text-[#00ffc8] bg-[#2A2D35] border-l-3 border-[#00ffc8]' 
                    : 'text-gray-400 hover:bg-[#252930] hover:text-white'
                }`}
              >
                <span className="text-xl">🔔</span>
                <span className="text-sm">Activity</span>
              </div>
              <div 
                onClick={() => {
                  setActiveMobileTab('profile');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center px-4 py-3 transition-colors cursor-pointer gap-3 ${
                  activeMobileTab === 'profile'
                    ? 'text-[#00ffc8] bg-[#2A2D35] border-l-3 border-[#00ffc8]' 
                    : 'text-gray-400 hover:bg-[#252930] hover:text-white'
                }`}
              >
                <span className="text-xl">👤</span>
                <span className="text-sm">Profile</span>
              </div>
            </nav>
            {/* Categories in Mobile Menu */}
            <div className="py-4 border-b border-[#2D3138]">
              <div className="flex justify-between items-center px-4 pb-3">
                <h4 className="text-xs text-gray-400 uppercase tracking-wider">📊 Categories</h4>
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
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setMobileMenuOpen(false);
                    }}
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
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] h-screen pt-[60px] overflow-hidden">
        {/* Left Sidebar */}
        <LeftSidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          showBookmarks={showBookmarks}
          setShowBookmarks={setShowBookmarks}
          bookmarkedCount={bookmarkedPosts.size}
        />
        

        {/* Main Content */}
        <MainContent
          filteredPosts={filteredPosts}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          bookmarkedPosts={bookmarkedPosts}
          toggleBookmark={toggleBookmark}
          openPostModal={openPostModal}
        />
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal
          setShowCreateModal={setShowCreateModal}
          newPostTitle={newPostTitle}
          setNewPostTitle={setNewPostTitle}
          newPostContent={newPostContent}
          setNewPostContent={setNewPostContent}
          newPostCategory={newPostCategory}
          setNewPostCategory={setNewPostCategory}
          newPostImage={newPostImage}
          setNewPostImage={setNewPostImage}
          formErrors={formErrors}
          handleImageUpload={handleImageUpload}
          handleCreatePost={handleCreatePost}
        />
      )}

      {/* Post Detail Modal */}
      {showPostModal && selectedPost && (
        <PostDetailModal
          selectedPost={selectedPost}
          closePostModal={closePostModal}
          comments={comments}
          bookmarkedPosts={bookmarkedPosts}
          toggleBookmark={toggleBookmark}
          handleAddComment={handleAddComment}
          newComment={newComment}
          setNewComment={setNewComment}
        />
      )}

      {/* Bottom Navigation Bar - Mobile Only */}
      <nav className="fixed bottom-0 left-0 right-0 h-[70px] bg-[#1C1F26] border-t border-[#2D3138] rounded-t-2xl flex items-center justify-around md:hidden z-50 safe-area-inset-bottom">
        <button
          onClick={() => {
            setShowBookmarks(false);
            setSelectedCategory('all');
            setActiveMobileTab('home');
          }}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-4 transition-colors ${
            !showBookmarks && activeMobileTab === 'home'
              ? 'text-[#00ffc8]'
              : 'text-gray-400'
          }`}
        >
          <span className="text-2xl">🏠</span>
          <span className="text-xs font-medium">Home</span>
        </button>
        <button
          onClick={() => {
            setActiveMobileTab('explore');
            setShowBookmarks(false);
          }}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-4 transition-colors ${
            activeMobileTab === 'explore'
              ? 'text-[#00ffc8]'
              : 'text-gray-400'
          }`}
        >
          <span className="text-2xl">🔍</span>
          <span className="text-xs font-medium">Explore</span>
        </button>
        <button
          onClick={() => {
            setShowBookmarks(!showBookmarks);
            setSelectedCategory('all');
            setActiveMobileTab('bookmarks');
          }}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-4 transition-colors relative ${
            showBookmarks || activeMobileTab === 'bookmarks'
              ? 'text-[#00ffc8]'
              : 'text-gray-400'
          }`}
        >
          <span className="text-2xl">🔖</span>
          {bookmarkedPosts.size > 0 && (
            <span className="absolute top-0 right-2 bg-[#00ffc8] text-[#0E1217] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {bookmarkedPosts.size}
            </span>
          )}
          <span className="text-xs font-medium">Bookmarks</span>
        </button>
        <button
          onClick={() => {
            setActiveMobileTab('activity');
            setShowBookmarks(false);
          }}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-4 transition-colors ${
            activeMobileTab === 'activity'
              ? 'text-[#00ffc8]'
              : 'text-gray-400'
          }`}
        >
          <span className="text-2xl">🔔</span>
          <span className="text-xs font-medium">Activity</span>
        </button>
        <button
          onClick={() => {
            setActiveMobileTab('profile');
            setShowBookmarks(false);
          }}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-4 transition-colors ${
            activeMobileTab === 'profile'
              ? 'text-[#00ffc8]'
              : 'text-gray-400'
          }`}
        >
          <span className="text-2xl">👤</span>
          <span className="text-xs font-medium">Profile</span>
        </button>
      </nav>
    </div>
  );
}