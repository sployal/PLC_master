'use client';

import React from 'react';

interface Props {
  setShowCreateModal: (v: boolean) => void;
  newPostTitle: string;
  setNewPostTitle: (v: string) => void;
  newPostContent: string;
  setNewPostContent: (v: string) => void;
  newPostCategory: string;
  setNewPostCategory: (v: any) => void;
  newPostImage: string;
  setNewPostImage: (v: string) => void;
  formErrors: { title: boolean; content: boolean; category: boolean };
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCreatePost: () => void;
}

export default function CreatePostModal({ setShowCreateModal, newPostTitle, setNewPostTitle, newPostContent, setNewPostContent, newPostCategory, setNewPostCategory, newPostImage, setNewPostImage, formErrors, handleImageUpload, handleCreatePost }: Props) {
  return (
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
  );
}
