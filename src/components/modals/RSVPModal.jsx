import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * RSVP Modal Component
 * Modal for event registration with name, email, and phone
 */
export default function RSVPModal({ isOpen, onClose, onSubmit, event, isLoading }) {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_phone: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.user_name.trim()) {
      newErrors.user_name = 'Name is required';
    }

    if (!formData.user_email.trim()) {
      newErrors.user_email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email)) {
      newErrors.user_email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        user_name: '',
        user_email: '',
        user_phone: ''
      });
      setErrors({});
    } catch (error) {
      // Error handling is done in parent component
      console.error('Registration error:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      user_name: '',
      user_email: '',
      user_phone: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-white text-[20px] md:text-[24px] font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            RSVP for Event
          </h2>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Event Info */}
        {event && (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-[18px] font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {event.title}
            </h3>
            <p className="text-[14px] text-gray-600" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {new Date(event.event_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </p>
            {event.location && (
              <p className="text-[14px] text-gray-600 mt-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                📍 {event.location}
              </p>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6">
          {/* Name */}
          <div className="mb-4">
            <label className="block text-[14px] font-medium text-gray-700 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.user_name ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            />
            {errors.user_name && (
              <p className="text-red-500 text-[12px] mt-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {errors.user_name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-[14px] font-medium text-gray-700 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="user_email"
              value={formData.user_email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.user_email ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            />
            {errors.user_email && (
              <p className="text-red-500 text-[12px] mt-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {errors.user_email}
              </p>
            )}
          </div>

          {/* Phone (Optional) */}
          <div className="mb-6">
            <label className="block text-[14px] font-medium text-gray-700 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Phone Number <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              type="tel"
              name="user_phone"
              value={formData.user_phone}
              onChange={handleChange}
              placeholder="(123) 456-7890"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Confirm RSVP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
