import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { PlusIcon, TrashIcon, PencilIcon, LinkIcon } from '@heroicons/react/24/outline';

export default function PortfolioGallery({ memberId, isOwner = false }) {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAddingItem, setIsAddingItem] = useState(false);

  useEffect(() => {
    fetchPortfolioItems();
  }, [memberId]);

  const fetchPortfolioItems = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('member_id', memberId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setPortfolioItems(data || []);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;

    try {
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setPortfolioItems(portfolioItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      alert('Failed to delete portfolio item');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-2xl md:rounded-3xl aspect-[4/3]"></div>
            <div className="mt-4 h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  // Don't show portfolio section at all if there are no items and user is not the owner
  if (portfolioItems.length === 0 && !isOwner) {
    return null;
  }

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-[28px] md:text-[36px] lg:text-[40px] font-medium text-[#242424]" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.1' }}>
          Portfolio
        </h2>
        {isOwner && (
          <button
            onClick={() => setIsAddingItem(true)}
            className="flex items-center gap-2 px-5 py-3 bg-[#316EFF] text-white rounded-full hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{ fontFamily: 'Space Grotesk', fontSize: '16px', fontWeight: 500 }}
          >
            <PlusIcon className="h-5 w-5" />
            Add Project
          </button>
        )}
      </div>

      {/* Gallery Grid */}
      {portfolioItems.length === 0 ? (
        <div className="text-center py-16 md:py-20 bg-gray-50 rounded-2xl md:rounded-3xl border-2 border-gray-200">
          <p className="text-[16px] md:text-[18px] text-[#787878]" style={{ fontFamily: 'Space Grotesk' }}>
            No portfolio items yet. Click "Add Project" to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {portfolioItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-2xl md:rounded-3xl overflow-hidden border-2 border-gray-200 hover:border-[#316EFF] transition-all duration-300 cursor-pointer hover:shadow-xl"
              onClick={() => setSelectedItem(item)}
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={item.image_url || '/assets/portfolio-placeholder.jpg'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-5 md:p-6">
                <h3 className="text-[18px] md:text-[20px] font-semibold text-[#242424] mb-2 group-hover:text-[#316EFF] transition-colors duration-300" style={{ fontFamily: 'Space Grotesk' }}>
                  {item.title}
                </h3>
                {item.category && (
                  <span className="inline-block px-3 py-1.5 text-[12px] md:text-[14px] bg-blue-50 text-[#316EFF] rounded-full font-medium" style={{ fontFamily: 'Space Grotesk' }}>
                    {item.category}
                  </span>
                )}
              </div>

              {/* Owner Actions */}
              {isOwner && (
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Edit functionality
                    }}
                    className="p-2.5 bg-white rounded-xl shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    <PencilIcon className="h-4 w-4 text-gray-700" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item.id);
                    }}
                    className="p-2.5 bg-white rounded-xl shadow-lg hover:bg-red-50 transition-colors"
                  >
                    <TrashIcon className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-2xl md:rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative">
              <img
                src={selectedItem.image_url || '/assets/portfolio-placeholder.jpg'}
                alt={selectedItem.title}
                className="w-full h-64 md:h-80 object-cover"
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8">
              <h2 className="text-[24px] md:text-[28px] lg:text-[32px] font-medium text-[#242424] mb-3" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.1' }}>
                {selectedItem.title}
              </h2>

              {selectedItem.category && (
                <span className="inline-block px-4 py-1.5 bg-blue-50 text-[#316EFF] rounded-full text-[14px] font-medium mb-5" style={{ fontFamily: 'Space Grotesk' }}>
                  {selectedItem.category}
                </span>
              )}

              {selectedItem.description && (
                <p className="text-[16px] md:text-[18px] text-[#787878] mb-6 leading-relaxed" style={{ fontFamily: 'Space Grotesk' }}>
                  {selectedItem.description}
                </p>
              )}

              {selectedItem.tools_used && selectedItem.tools_used.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-[18px] md:text-[20px] font-medium text-[#242424] mb-3" style={{ fontFamily: 'Space Grotesk' }}>Tools Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.tools_used.map((tool, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-gray-100 text-[#242424] rounded-full text-[14px] font-medium"
                        style={{ fontFamily: 'Space Grotesk' }}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedItem.project_url && (
                <a
                  href={selectedItem.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#316EFF] text-white rounded-full hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg text-[16px] font-medium"
                  style={{ fontFamily: 'Space Grotesk' }}
                >
                  <LinkIcon className="h-5 w-5" />
                  View Project
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {isAddingItem && (
        <AddPortfolioModal
          memberId={memberId}
          onClose={() => setIsAddingItem(false)}
          onAdd={(newItem) => {
            setPortfolioItems([...portfolioItems, newItem]);
            setIsAddingItem(false);
          }}
        />
      )}
    </div>
  );
}

// Add Portfolio Modal Component
function AddPortfolioModal({ memberId, onClose, onAdd }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    project_url: '',
    tools_used: '',
    image_url: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .insert({
          member_id: memberId,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          project_url: formData.project_url,
          tools_used: formData.tools_used ? formData.tools_used.split(',').map(t => t.trim()) : [],
          image_url: formData.image_url || '/assets/portfolio-placeholder.jpg'
        })
        .select()
        .single();

      if (error) throw error;
      onAdd(data);
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      alert('Failed to add portfolio item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#242424] mb-4">
            Add Portfolio Item
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#242424] mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#316EFF]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#242424] mb-2">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#316EFF]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#242424] mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#316EFF]"
              >
                <option value="">Select Category</option>
                <option value="UI Design">UI Design</option>
                <option value="UX Research">UX Research</option>
                <option value="Branding">Branding</option>
                <option value="Web Design">Web Design</option>
                <option value="Mobile Design">Mobile Design</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#242424] mb-2">
                Project URL
              </label>
              <input
                type="url"
                value={formData.project_url}
                onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#316EFF]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#242424] mb-2">
                Tools Used (comma separated)
              </label>
              <input
                type="text"
                value={formData.tools_used}
                onChange={(e) => setFormData({ ...formData, tools_used: e.target.value })}
                placeholder="Figma, Sketch, Adobe XD"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#316EFF]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#242424] mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#316EFF]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-[#316EFF] text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}