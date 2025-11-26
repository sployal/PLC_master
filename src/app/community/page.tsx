'use client';

import { useState } from 'react';

// Types
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
  const getCategoryIcon = (category: string) => {
    const icons = {
      help: '❓',
      project: '🚀',
      discussion: '💭'
    };
    return icons[category as keyof typeof icons] || '📄';
  };

  const getCategoryStyles = (category: string) => {
    const styles = {
      help: 'bg-red-500/20 text-red-400',
      project: 'bg-blue-500/20 text-blue-400',
      discussion: 'bg-purple-500/20 text-purple-400'
    };
    return styles[category as keyof typeof styles] || 'bg-gray-500/20 text-gray-400';
  };

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
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-2 md:px-5 md:py-2 bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] rounded-lg text-[#0E1217] font-semibold hover:translate-y-[-2px] hover:shadow-lg hover:shadow-[#00ffc8]/40 transition-all text-xs md:text-sm whitespace-nowrap"
          >
            ➕ New post
          </button>
          <div className="flex items-center gap-2 md:gap-3">
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

      {/* Main Container */}
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] h-screen pt-[60px] overflow-hidden">
        {/* Left Sidebar */}
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
              className={`flex items-center px-4 py-3 transition-colors cursor-pointer gap-3 ${
                showBookmarks 
                  ? 'text-[#00ffc8] bg-[#2A2D35] border-l-3 border-[#00ffc8]' 
                  : 'text-gray-400 hover:bg-[#252930] hover:text-white'
              }`}
            >
              <span className="text-xl">🔖</span>
              <span className="text-sm">Bookmarks</span>
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

        {/* Main Content */}
        <main className="bg-[#0E1217] overflow-y-auto p-4 md:p-6 custom-scrollbar">
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
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-[#1C1F26] border border-[#2D3138] rounded-2xl w-full max-w-2xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute right-4 top-4 md:right-6 md:top-6 text-2xl text-gray-400 hover:text-[#00ffc8] hover:rotate-90 transition-all"
            >
              ×
            </button>
            <h3 className="text-[#00ffc8] text-xl md:text-2xl mb-6">✏️ Share Your Thoughts</h3>
            <div>
              <input
                type="text"
                placeholder="What's your question or project about?"
                value={newPostTitle}
                onChange={(e) => {
                  setNewPostTitle(e.target.value);
                  setFormErrors(prev => ({ ...prev, title: false }));
                }}
                className={`w-full px-4 py-3 bg-[#252930] border rounded-lg text-white mb-1 focus:outline-none focus:bg-[#2A2D35] transition-all text-sm md:text-base ${
                  formErrors.title ? 'border-red-500 focus:border-red-500' : 'border-[#2D3138] focus:border-[#00ffc8]'
                }`}
              />
              {formErrors.title && (
                <p className="text-red-400 text-xs mb-3 px-1">⚠️ Please enter a title</p>
              )}
              {!formErrors.title && <div className="mb-3"></div>}
              
              <textarea
                placeholder="Describe your issue or share your project details..."
                value={newPostContent}
                onChange={(e) => {
                  setNewPostContent(e.target.value);
                  setFormErrors(prev => ({ ...prev, content: false }));
                }}
                rows={6}
                className={`w-full px-4 py-3 bg-[#252930] border rounded-lg text-white mb-1 focus:outline-none focus:bg-[#2A2D35] transition-all resize-none text-sm md:text-base ${
                  formErrors.content ? 'border-red-500 focus:border-red-500' : 'border-[#2D3138] focus:border-[#00ffc8]'
                }`}
              />
              {formErrors.content && (
                <p className="text-red-400 text-xs mb-3 px-1">⚠️ Please enter content</p>
              )}
              {!formErrors.content && <div className="mb-3"></div>}
              
              {/* Image Upload Section */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">📷 Add Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="block w-full px-4 py-3 bg-[#252930] border border-[#2D3138] rounded-lg text-gray-400 cursor-pointer hover:border-[#00ffc8] transition-all text-sm md:text-base text-center"
                >
                  {newPostImage ? '✅ Image Selected - Click to Change' : '📤 Click to Upload Image'}
                </label>
                {newPostImage && (
                  <div className="mt-4 relative">
                    <img src={newPostImage} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                    <button
                      onClick={() => setNewPostImage('')}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-all"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
                <div>
                  <select
                    value={newPostCategory}
                    onChange={(e) => {
                      setNewPostCategory(e.target.value as any);
                      setFormErrors(prev => ({ ...prev, category: false }));
                    }}
                    className={`w-full px-4 py-3 bg-[#252930] border rounded-lg text-white focus:outline-none focus:bg-[#2A2D35] transition-all text-sm md:text-base ${
                      formErrors.category ? 'border-red-500 focus:border-red-500' : 'border-[#2D3138] focus:border-[#00ffc8]'
                    }`}
                  >
                    <option value="">Select Category</option>
                    <option value="help">❓ Help Needed</option>
                    <option value="project">🚀 Project Showcase</option>
                    <option value="discussion">💭 Discussion</option>
                  </select>
                  {formErrors.category && (
                    <p className="text-red-400 text-xs mt-1 px-1">⚠️ Select category</p>
                  )}
                </div>
                <button
                  onClick={handleCreatePost}
                  className="px-8 py-3 bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] rounded-lg text-[#0E1217] font-semibold hover:translate-y-[-2px] hover:shadow-lg hover:shadow-[#00ffc8]/40 transition-all text-sm md:text-base"
                >
                  Post to Community
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Detail Modal */}
      {showPostModal && selectedPost && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-[#1C1F26] border border-[#2D3138] rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto p-6 md:p-8 relative custom-scrollbar">
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
                onClick={() => setShowPostModal(false)}
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
      )}
    </div>
  );
}