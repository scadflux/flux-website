import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import ImageCropModal from '../components/modals/ImageCropModal';
import { submitApplication, uploadMemberPhoto, uploadVibeImage } from '../services/members';
import { subscribeToEmailList } from '../services/emailList';

/**
 * Application form validation schema
 */
const applicationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  year: z.string().optional(),
  campus: z.string().min(1, 'Please select a campus'),
  major: z.string().min(2, 'Major is required'),
  minor: z.string().optional(),
  is_alumni: z.boolean().optional(),
  graduation_year: z.string().optional(),
  bio: z.string().min(1, 'Bio is required'),
  portfolio_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  linkedin_url: z.string().url('Must be a valid LinkedIn URL').optional().or(z.literal('')),
  instagram_url: z.string().optional().or(z.literal('')),
  custom_section_title: z.string().optional().or(z.literal('')),
  custom_section_description: z.string().optional().or(z.literal(''))
}).refine((data) => {
  // If not alumni, year is required
  if (!data.is_alumni && (!data.year || data.year === '')) {
    return false;
  }
  return true;
}, {
  message: 'Please select your academic year',
  path: ['year']
});

export default function Apply() {
  const navigate = useNavigate();
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [vibeFiles, setVibeFiles] = useState([]);
  const [vibePreviews, setVibePreviews] = useState([]);
  const [customSectionFiles, setCustomSectionFiles] = useState([]);
  const [customSectionPreviews, setCustomSectionPreviews] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [bioLength, setBioLength] = useState(0);
  const [isAlumni, setIsAlumni] = useState(false);

  // Image crop modal state for vibe images
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState(null);
  const [pendingImages, setPendingImages] = useState([]);

  // Image crop modal state for profile photo
  const [photoCropModalOpen, setPhotoCropModalOpen] = useState(false);
  const [photoImageSrc, setPhotoImageSrc] = useState(null);

  // Image crop modal state for custom section images
  const [customSectionCropModalOpen, setCustomSectionCropModalOpen] = useState(false);
  const [customSectionImageSrc, setCustomSectionImageSrc] = useState(null);
  const [pendingCustomSectionImages, setPendingCustomSectionImages] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm({
    resolver: zodResolver(applicationSchema)
  });

  // Watch bio field for character count
  const bioValue = watch('bio', '');

  useEffect(() => {
    setBioLength(bioValue?.length || 0);
  }, [bioValue]);

  // Mutation for submitting application
  const submitMutation = useMutation({
    mutationFn: async (data) => {
      console.log('Submitting application with data:', data);
      let photoUrl = null;
      let vibeImageUrls = [];
      let customSectionImageUrls = [];
      let portfolioData = [];

      // Upload profile photo if provided
      if (photoFile) {
        console.log('Uploading profile photo...');
        const tempUserId = `temp-${Date.now()}`;
        photoUrl = await uploadMemberPhoto(photoFile, tempUserId);
        console.log('Photo uploaded:', photoUrl);
      }

      // Upload vibe images if provided
      if (vibeFiles.length > 0) {
        console.log(`Uploading ${vibeFiles.length} vibe images...`);
        const tempUserId = `temp-${Date.now()}`;
        const uploadPromises = vibeFiles.map(file => uploadVibeImage(file, tempUserId));
        vibeImageUrls = await Promise.all(uploadPromises);
        console.log('Vibe images uploaded:', vibeImageUrls);
      }

      // Upload custom section images if provided
      if (customSectionFiles.length > 0) {
        console.log(`Uploading ${customSectionFiles.length} custom section images...`);
        const tempUserId = `temp-${Date.now()}`;
        const uploadPromises = customSectionFiles.map(file => uploadVibeImage(file, tempUserId));
        customSectionImageUrls = await Promise.all(uploadPromises);
        console.log('Custom section images uploaded:', customSectionImageUrls);
      }

      // Process portfolio items - upload images and prepare data
      if (portfolioItems.length > 0) {
        console.log(`Processing ${portfolioItems.length} portfolio items...`);
        const tempUserId = `temp-${Date.now()}`;

        portfolioData = await Promise.all(
          portfolioItems.map(async (item, index) => {
            let imageUrl = null;

            // Upload portfolio item image if provided
            if (item.image) {
              console.log(`Uploading portfolio item ${index + 1} image...`);
              imageUrl = await uploadVibeImage(item.image, tempUserId);
              console.log(`Portfolio item ${index + 1} image uploaded:`, imageUrl);
            }

            return {
              title: item.title,
              description: item.description || null,
              category: item.category || null,
              project_url: item.project_url || null,
              tools_used: item.tools_used ? item.tools_used.split(',').map(t => t.trim()).filter(Boolean) : [],
              image_url: imageUrl,
              display_order: index
            };
          })
        );
        console.log('Portfolio data prepared:', portfolioData);
      }

      // Submit application
      console.log('Submitting to database...');
      const result = await submitApplication({
        ...data,
        photo_url: photoUrl,
        vibe_images: vibeImageUrls,
        custom_section_images: customSectionImageUrls,
        portfolio_items: portfolioData
      });
      console.log('Application submitted successfully:', result);

      // Subscribe to email list (don't await - let it happen in background)
      subscribeToEmailList(data.email, data.name)
        .then(() => console.log('Successfully subscribed to email list'))
        .catch(err => console.error('Failed to subscribe to email list:', err));

      return result;
    },
    onSuccess: () => {
      console.log('Mutation succeeded!');
      setSubmitSuccess(true);
      reset();
      setPhotoFile(null);
      setPhotoPreview(null);
      setVibeFiles([]);
      setVibePreviews([]);
      setCustomSectionFiles([]);
      setCustomSectionPreviews([]);
      setPortfolioItems([]);
      window.scrollTo(0, 0);
    },
    onError: (error) => {
      console.error('Mutation failed with error:', error);
      console.error('Error details:', error.message, error.code, error.details);
    }
  });

  const onSubmit = (data) => {
    console.log('Form submitted with data:', data);
    console.log('Photo file:', photoFile);
    console.log('Is alumni:', isAlumni);
    console.log('Form errors:', errors);

    // Check if profile photo is provided
    if (!photoFile) {
      alert('Please upload a profile photo');
      return;
    }

    console.log('Submitting to mutation...');
    submitMutation.mutate(data);
  };

  const handleFormError = (errors) => {
    console.log('Form validation errors:', errors);
    // Show first error to user
    const firstError = Object.values(errors)[0];
    if (firstError) {
      alert(`Form error: ${firstError.message}`);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Photo must be less than 5MB');
        e.target.value = '';
        return;
      }

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert('Photo must be JPEG, PNG, or WebP');
        e.target.value = '';
        return;
      }

      // Open crop modal for profile photo
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoImageSrc(reader.result);
        setPhotoCropModalOpen(true);
      };
      reader.readAsDataURL(file);

      // Reset input
      e.target.value = '';
    }
  };

  const handlePhotoCropComplete = (croppedFile) => {
    // Set cropped file as profile photo
    setPhotoFile(croppedFile);

    // Create preview for cropped file
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(croppedFile);

    // Close modal
    setPhotoCropModalOpen(false);
    setPhotoImageSrc(null);
  };

  const handlePhotoCropCancel = () => {
    setPhotoCropModalOpen(false);
    setPhotoImageSrc(null);
  };

  const handleVibeImagesChange = (e) => {
    const files = Array.from(e.target.files);

    // Limit to 5 images total
    const remainingSlots = 5 - vibeFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);

    // Validate each file
    const validFiles = [];

    for (const file of filesToAdd) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Max size is 5MB.`);
        continue;
      }

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert(`${file.name} must be JPEG, PNG, or WebP`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      // Set pending images and open crop modal for first image
      setPendingImages(validFiles);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentImageSrc(reader.result);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(validFiles[0]);
    }

    // Reset input
    e.target.value = '';
  };

  const handleCropComplete = (croppedFile) => {
    // Add cropped file to vibeFiles
    setVibeFiles([...vibeFiles, croppedFile]);

    // Create preview for cropped file
    const reader = new FileReader();
    reader.onloadend = () => {
      setVibePreviews([...vibePreviews, reader.result]);
    };
    reader.readAsDataURL(croppedFile);

    // Check if there are more images to crop
    const remaining = pendingImages.slice(1);
    if (remaining.length > 0) {
      setPendingImages(remaining);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentImageSrc(reader.result);
      };
      reader.readAsDataURL(remaining[0]);
    } else {
      // All images cropped, close modal
      setCropModalOpen(false);
      setPendingImages([]);
      setCurrentImageSrc(null);
    }
  };

  const handleCropCancel = () => {
    setCropModalOpen(false);
    setPendingImages([]);
    setCurrentImageSrc(null);
  };

  const removeVibeImage = (index) => {
    setVibeFiles(vibeFiles.filter((_, i) => i !== index));
    setVibePreviews(vibePreviews.filter((_, i) => i !== index));
  };

  const handleCustomSectionImagesChange = (e) => {
    const files = Array.from(e.target.files);

    // Limit to 5 images total
    const remainingSlots = 5 - customSectionFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);

    // Validate each file
    const validFiles = [];

    for (const file of filesToAdd) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Max size is 5MB.`);
        continue;
      }

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert(`${file.name} must be JPEG, PNG, or WebP`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      // Set pending images and open crop modal for first image
      setPendingCustomSectionImages(validFiles);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomSectionImageSrc(reader.result);
        setCustomSectionCropModalOpen(true);
      };
      reader.readAsDataURL(validFiles[0]);
    }

    // Reset input
    e.target.value = '';
  };

  const handleCustomSectionCropComplete = (croppedFile) => {
    // Add cropped file to customSectionFiles
    setCustomSectionFiles([...customSectionFiles, croppedFile]);

    // Create preview for cropped file
    const reader = new FileReader();
    reader.onloadend = () => {
      setCustomSectionPreviews([...customSectionPreviews, reader.result]);
    };
    reader.readAsDataURL(croppedFile);

    // Check if there are more images to crop
    const remaining = pendingCustomSectionImages.slice(1);
    if (remaining.length > 0) {
      setPendingCustomSectionImages(remaining);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomSectionImageSrc(reader.result);
      };
      reader.readAsDataURL(remaining[0]);
    } else {
      // All images cropped, close modal
      setCustomSectionCropModalOpen(false);
      setPendingCustomSectionImages([]);
      setCustomSectionImageSrc(null);
    }
  };

  const handleCustomSectionCropCancel = () => {
    setCustomSectionCropModalOpen(false);
    setPendingCustomSectionImages([]);
    setCustomSectionImageSrc(null);
  };

  const removeCustomSectionImage = (index) => {
    setCustomSectionFiles(customSectionFiles.filter((_, i) => i !== index));
    setCustomSectionPreviews(customSectionPreviews.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      {/* Background Shapes */}
      <div
        className="absolute left-0 w-full pointer-events-none hidden md:block"
        style={{
          zIndex: 0,
          top: '0',
          height: '800px'
        }}
      >
        <img src="/assets/flux-shape-left.png" alt="" className="absolute left-0" style={{ top: '-40px', height: '800px', maxWidth: '30%', objectFit: 'contain', objectPosition: 'top', opacity: 0.3 }} />
        <img src="/assets/flux-shape-right.png" alt="" className="absolute right-0" style={{ top: '-40px', height: '800px', maxWidth: '30%', objectFit: 'contain', objectPosition: 'top', opacity: 0.3 }} />
      </div>

      <div className="relative">
        <Navigation />
      </div>

      <main className="max-w-[900px] mx-auto px-4 md:px-8 py-12 md:py-20 relative" style={{ zIndex: 1 }}>
        {/* Header */}
        <section className="text-center mb-16">
          <p className="text-[#969696] text-[14px] md:text-[16px] uppercase mb-4 tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, letterSpacing: '0.1em' }}>
            JOIN THE COMMUNITY
          </p>
          <h1 className="text-[36px] md:text-[48px] lg:text-[60px]" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, lineHeight: '1.1' }}>
            <span className="text-[#242424]">Apply to </span>
            <span style={{ color: '#316EFF' }}>FLUX</span>
          </h1>
        </section>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-12 p-8 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-300 rounded-3xl shadow-lg">
            <div className="text-center">
              <div className="text-[48px] mb-4">🎉</div>
              <h3 className="text-[28px] font-bold text-green-800 mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Application Submitted!
              </h3>
              <p className="text-[18px] text-green-700 mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Thank you for applying to FLUX! We'll review your application and get back to you soon.
              </p>
              <button
                onClick={() => navigate('/community')}
                className="cursor-pointer px-8 py-4 bg-[#316EFF] text-white rounded-full hover:bg-[#3164DC] transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '18px' }}
              >
                View Community
              </button>
            </div>
          </div>
        )}

        {/* Application Form */}
        <form onSubmit={handleSubmit(onSubmit, handleFormError)} className="space-y-10">
          {/* Personal Information */}
          <div className="bg-white border-2 border-[#E5E7EB] rounded-3xl p-6 md:p-10 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[#316EFF] rounded-full flex items-center justify-center text-white text-[20px]" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>
                1
              </div>
              <h2 className="text-[28px] md:text-[36px] font-bold text-[#242424]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Personal Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="md:col-span-2">
                <label className="block text-[16px] font-medium text-[#242424] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Full Name <span className="text-[#316EFF]">*</span>
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-5 py-4 border-2 border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#316EFF] transition-colors duration-200 text-[16px]"
                  placeholder="Clark Delashment"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <span>⚠️</span> {errors.name.message}
                  </p>
                )}
              </div>

              {/* Alumni Status */}
              <div className="md:col-span-2">
                <div className="flex items-start gap-4 p-5 bg-blue-50 border-2 border-blue-200 rounded-2xl">
                  <input
                    {...register('is_alumni')}
                    type="checkbox"
                    id="is_alumni"
                    checked={isAlumni}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setIsAlumni(checked);
                      setValue('is_alumni', checked);
                      // Clear year field when alumni is checked
                      if (checked) {
                        setValue('year', '');
                      }
                    }}
                    className="mt-1 w-5 h-5 text-[#316EFF] border-2 border-gray-300 rounded focus:ring-[#316EFF] cursor-pointer"
                  />
                  <div className="flex-1">
                    <label htmlFor="is_alumni" className="cursor-pointer">
                      <span className="block text-[16px] font-semibold text-[#242424] mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        I am a SCAD Alumni
                      </span>
                      <span className="block text-[14px] text-[#787878]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        Check this if you've already graduated from SCAD
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Graduation Year (only show if alumni) */}
              {isAlumni && (
                <div className="md:col-span-2">
                  <label className="block text-[16px] font-medium text-[#242424] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Graduation Year <span className="text-[#316EFF]">*</span>
                  </label>
                  <select
                    {...register('graduation_year')}
                    className="custom-select w-full px-5 py-4 border-2 border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#316EFF] transition-colors duration-200 text-[16px] bg-white"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    <option value="">Select graduation year</option>
                    {(() => {
                      const currentYear = new Date().getFullYear();
                      const years = [];
                      for (let year = currentYear; year >= currentYear - 50; year--) {
                        years.push(<option key={year} value={year}>{year}</option>);
                      }
                      return years;
                    })()}
                  </select>
                  <p className="mt-2 text-sm text-[#787878]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    📅 What year did you graduate from SCAD?
                  </p>
                </div>
              )}

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-[16px] font-medium text-[#242424] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {isAlumni ? 'Email Address' : 'University Email'} <span className="text-[#316EFF]">*</span>
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-5 py-4 border-2 border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#316EFF] transition-colors duration-200 text-[16px]"
                  placeholder={isAlumni ? "your.email@example.com" : "clark.delashment@scad.edu"}
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <span>⚠️</span> {errors.email.message}
                  </p>
                )}
              </div>

              {/* Year - Only show for non-alumni */}
              {!isAlumni && (
                <div>
                  <label className="block text-[16px] font-medium text-[#242424] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Academic Year <span className="text-[#316EFF]">*</span>
                  </label>
                  <select
                    {...register('year')}
                    className="custom-select w-full px-5 py-4 border-2 border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#316EFF] transition-colors duration-200 text-[16px] bg-white"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    <option value="">Select your year</option>
                    <option value="FRESHMAN">Freshman</option>
                    <option value="SOPHOMORE">Sophomore</option>
                    <option value="JUNIOR">Junior</option>
                    <option value="SENIOR">Senior</option>
                    <option value="MASTERS">Masters</option>
                    <option value="MASTERS FIRST-YEAR">Masters First-Year</option>
                    <option value="MASTERS FINAL-YEAR">Masters Final-Year</option>
                  </select>
                  {errors.year && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      <span>⚠️</span> {errors.year.message}
                    </p>
                  )}
                </div>
              )}

              {/* Campus */}
              <div>
                <label className="block text-[16px] font-medium text-[#242424] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Campus <span className="text-[#316EFF]">*</span>
                </label>
                <select
                  {...register('campus')}
                  className="custom-select w-full px-5 py-4 border-2 border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#316EFF] transition-colors duration-200 text-[16px] bg-white"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  <option value="">Select your campus</option>
                  <option value="SAV CAMPUS">Savannah Campus</option>
                  <option value="ATL CAMPUS">Atlanta Campus</option>
                  <option value="ONLINE">Online</option>
                </select>
                {errors.campus && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <span>⚠️</span> {errors.campus.message}
                  </p>
                )}
              </div>

              {/* Major */}
              <div>
                <label className="block text-[16px] font-medium text-[#242424] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Major <span className="text-[#316EFF]">*</span>
                </label>
                <input
                  {...register('major')}
                  type="text"
                  className="w-full px-5 py-4 border-2 border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#316EFF] transition-colors duration-200 text-[16px]"
                  placeholder="UX Design"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                />
                {errors.major && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <span>⚠️</span> {errors.major.message}
                  </p>
                )}
              </div>

              {/* Minor */}
              <div>
                <label className="block text-[16px] font-medium text-[#242424] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Minor <span className="text-[#787878]">(Optional)</span>
                </label>
                <input
                  {...register('minor')}
                  type="text"
                  className="w-full px-5 py-4 border-2 border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#316EFF] transition-colors duration-200 text-[16px]"
                  placeholder="Graphic Design"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                />
              </div>

              {/* Profile Photo Upload */}
              <div className="md:col-span-2">
                <label className="block text-[16px] font-medium text-[#242424] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Profile Photo <span className="text-[#316EFF]">*</span>
                </label>
                <div className="flex flex-col md:flex-row items-start gap-6">
                  {photoPreview && (
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 border-2 border-[#E5E7EB] flex-shrink-0">
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoFile(null);
                          setPhotoPreview(null);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                        style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                  <div className="flex-1 w-full">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePhotoChange}
                        className="w-full px-5 py-4 border-2 border-dashed border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#316EFF] transition-colors duration-200 cursor-pointer hover:border-[#316EFF] hover:bg-blue-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#316EFF] file:text-white hover:file:bg-[#3164DC] file:cursor-pointer"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      />
                    </div>
                    <p className="mt-3 text-sm text-[#787878]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      📸 Required • You'll be able to crop the image after uploading
                    </p>
                    <p className="mt-1 text-sm text-[#787878]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      Max 5MB. Accepted formats: JPEG, PNG, WebP
                    </p>
                  </div>
                </div>
                {!photoFile && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <span>⚠️</span> Profile photo is required
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* About You */}
          <div className="bg-white border-2 border-[#E5E7EB] rounded-3xl p-6 md:p-10 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[#316EFF] rounded-full flex items-center justify-center text-white text-[20px]" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>
                2
              </div>
              <h2 className="text-[28px] md:text-[36px] font-bold text-[#242424]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                About You
              </h2>
            </div>

            <div className="space-y-6">
              {/* Bio */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-[16px] font-medium text-[#242424]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Bio <span className="text-[#316EFF]">*</span>
                  </label>
                  <span className="text-sm text-[#787878]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {bioLength} characters
                  </span>
                </div>
                <textarea
                  {...register('bio')}
                  rows={5}
                  className="w-full px-5 py-4 border-2 border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#316EFF] transition-colors duration-200 text-[16px] resize-none"
                  placeholder="Tell us about yourself, your interests in UX, and what you're studying..."
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                />
                <div className="flex justify-between items-start mt-2">
                  <div className="flex-1">
                    {errors.bio && (
                      <p className="text-sm text-red-500 flex items-center gap-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        <span>⚠️</span> {errors.bio.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Portfolio URL */}
              <div>
                <label className="block text-[16px] font-medium text-[#242424] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Portfolio URL <span className="text-[#787878]">(Optional)</span>
                </label>
                <input
                  {...register('portfolio_url')}
                  type="url"
                  className="w-full px-5 py-4 border-2 border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#316EFF] transition-colors duration-200 text-[16px]"
                  placeholder="https://yourportfolio.com"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                />
                {errors.portfolio_url && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <span>⚠️</span> {errors.portfolio_url.message}
                  </p>
                )}
                <p className="mt-3 text-sm text-[#787878]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  🔗 Share your Behance, personal website, or any portfolio showcasing your work
                </p>
              </div>

              {/* LinkedIn URL */}
              <div>
                <label className="block text-[16px] font-medium text-[#242424] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  LinkedIn Profile URL <span className="text-[#787878]">(Optional)</span>
                </label>
                <input
                  {...register('linkedin_url')}
                  type="url"
                  className="w-full px-5 py-4 border-2 border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#316EFF] transition-colors duration-200 text-[16px]"
                  placeholder="https://linkedin.com/in/yourprofile"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                />
                {errors.linkedin_url && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <span>⚠️</span> {errors.linkedin_url.message}
                  </p>
                )}
              </div>

              {/* Instagram URL */}
              <div>
                <label className="block text-[16px] font-medium text-[#242424] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Instagram Handle <span className="text-[#787878]">(Optional)</span>
                </label>
                <input
                  {...register('instagram_url')}
                  type="text"
                  className="w-full px-5 py-4 border-2 border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#316EFF] transition-colors duration-200 text-[16px]"
                  placeholder="@yourhandle or https://instagram.com/yourhandle"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                />
              </div>
            </div>
          </div>

          {/* Custom Section */}
          <div className="bg-white border-2 border-[#E5E7EB] rounded-3xl p-6 md:p-10 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[#316EFF] rounded-full flex items-center justify-center text-white text-[20px]" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>
                3
              </div>
              <h2 className="text-[28px] md:text-[36px] font-bold text-[#242424]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Custom Section
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-[16px] text-[#787878]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Create a personalized section for your profile! Add a title, description, and images to showcase your work, projects, or anything you'd like to highlight.
              </p>

              {/* Custom Section Title */}
              <div>
                <label className="block text-[16px] font-medium text-[#242424] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Section Title <span className="text-[#787878]">(Optional)</span>
                </label>
                <input
                  {...register('custom_section_title')}
                  type="text"
                  className="w-full px-5 py-4 border-2 border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#316EFF] transition-colors duration-200 text-[16px]"
                  placeholder="e.g., My Work, Projects, Creative Process, Inspiration..."
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                />
              </div>

              {/* Custom Section Description */}
              <div>
                <label className="block text-[16px] font-medium text-[#242424] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Section Description <span className="text-[#787878]">(Optional)</span>
                </label>
                <textarea
                  {...register('custom_section_description')}
                  rows={4}
                  className="w-full px-5 py-4 border-2 border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#316EFF] transition-colors duration-200 text-[16px] resize-none"
                  placeholder="Describe this section and what you want to showcase..."
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                />
              </div>

              {/* Custom Section Images Upload */}
              {customSectionFiles.length < 5 && (
                <div>
                  <label className="block text-[16px] font-medium text-[#242424] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Section Images <span className="text-[#787878]">(Optional)</span>
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleCustomSectionImagesChange}
                    className="w-full px-5 py-4 border-2 border-dashed border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#316EFF] transition-colors duration-200 cursor-pointer hover:border-[#316EFF] hover:bg-blue-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#316EFF] file:text-white hover:file:bg-[#3164DC] file:cursor-pointer"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  />
                  <p className="mt-3 text-sm text-[#787878]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    📸 {customSectionFiles.length}/5 images uploaded. Max 5MB each. Accepted formats: JPEG, PNG, WebP
                  </p>
                </div>
              )}

              {/* Custom Section Images Preview */}
              {customSectionPreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {customSectionPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-[#E5E7EB]">
                        <img src={preview} alt={`Custom section ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCustomSectionImage(index)}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                        style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Portfolio Section */}
          <div className="bg-white border-2 border-[#E5E7EB] rounded-3xl p-6 md:p-10 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[#316EFF] rounded-full flex items-center justify-center text-white text-[20px]" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>
                4
              </div>
              <h2 className="text-[28px] md:text-[36px] font-bold text-[#242424]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Portfolio
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-[16px] text-[#787878]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Add portfolio items to showcase your work! These will be displayed in your portfolio gallery when your application is approved.
              </p>

              {/* Portfolio Items List */}
              {portfolioItems.length > 0 && (
                <div className="space-y-4">
                  {portfolioItems.map((item, index) => (
                    <div key={index} className="border-2 border-[#E5E7EB] rounded-2xl p-4 md:p-5 bg-gray-50">
                      <div className="flex gap-4">
                        {item.preview && (
                          <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                            <img src={item.preview} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <h3 className="text-[16px] md:text-[18px] font-bold text-[#242424] truncate" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                              {item.title}
                            </h3>
                            <button
                              type="button"
                              onClick={() => setPortfolioItems(portfolioItems.filter((_, i) => i !== index))}
                              className="text-red-500 hover:text-red-700 font-bold px-2"
                            >
                              ×
                            </button>
                          </div>
                          {item.category && (
                            <span className="inline-block px-3 py-1 bg-blue-50 text-[#316EFF] rounded-full text-[12px] font-medium mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                              {item.category}
                            </span>
                          )}
                          {item.description && (
                            <p className="text-[14px] text-[#787878] line-clamp-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Portfolio Item Button */}
              {portfolioItems.length < 10 && (
                <button
                  type="button"
                  onClick={() => {
                    const newItem = {
                      title: '',
                      description: '',
                      category: '',
                      project_url: '',
                      tools_used: '',
                      image: null,
                      preview: null,
                      isEditing: true
                    };
                    setPortfolioItems([...portfolioItems, newItem]);
                  }}
                  className="w-full px-5 py-4 border-2 border-dashed border-[#316EFF] rounded-2xl text-[#316EFF] font-semibold hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center gap-2"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  <span className="text-[24px]">+</span>
                  Add Portfolio Item ({portfolioItems.length}/10)
                </button>
              )}

              {/* Portfolio Item Form Modal */}
              {portfolioItems.some(item => item.isEditing) && (
                <PortfolioItemForm
                  item={portfolioItems.find(item => item.isEditing)}
                  onSave={(updatedItem) => {
                    const index = portfolioItems.findIndex(item => item.isEditing);
                    const newItems = [...portfolioItems];
                    newItems[index] = { ...updatedItem, isEditing: false };
                    setPortfolioItems(newItems);
                  }}
                  onCancel={() => {
                    setPortfolioItems(portfolioItems.filter(item => !item.isEditing));
                  }}
                />
              )}
            </div>
          </div>

          {/* Vibe Images Section */}
          <div className="bg-white border-2 border-[#E5E7EB] rounded-3xl p-6 md:p-10 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[#316EFF] rounded-full flex items-center justify-center text-white text-[20px]" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>
                5
              </div>
              <h2 className="text-[28px] md:text-[36px] font-bold text-[#242424]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Vibe Images
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-[16px] text-[#787878]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Share up to 5 images that represent you, your work, or your creative vibe! These will be displayed on your profile page.
              </p>

              {/* Vibe Images Upload */}
              {vibeFiles.length < 5 && (
                <div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleVibeImagesChange}
                    className="w-full px-5 py-4 border-2 border-dashed border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#316EFF] transition-colors duration-200 cursor-pointer hover:border-[#316EFF] hover:bg-blue-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#316EFF] file:text-white hover:file:bg-[#3164DC] file:cursor-pointer"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  />
                  <p className="mt-3 text-sm text-[#787878]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    📷 {vibeFiles.length}/5 images uploaded. Max 5MB each. Accepted formats: JPEG, PNG, WebP
                  </p>
                </div>
              )}

              {/* Vibe Images Preview */}
              {vibePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {vibePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-[#E5E7EB]">
                        <img src={preview} alt={`Vibe ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVibeImage(index)}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                        style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {submitMutation.isError && (
            <div className="p-6 bg-red-50 border-2 border-red-200 rounded-2xl">
              <p className="text-red-700 text-[16px] flex items-center gap-2 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <span>❌</span> Failed to submit application. Please try again.
              </p>
              {submitMutation.error && (
                <p className="text-red-600 text-[14px] font-mono" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Error: {submitMutation.error.message || JSON.stringify(submitMutation.error)}
                </p>
              )}
              <p className="text-red-600 text-[14px] mt-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Please check the browser console (F12) for more details.
              </p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex flex-col md:flex-row gap-4 pt-6">
            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="cursor-pointer flex-1 px-10 py-5 bg-[#316EFF] text-white rounded-full hover:bg-[#3164DC] transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '20px' }}
            >
              {submitMutation.isPending ? '⏳ Submitting...' : '✓ Submit Application'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/community')}
              className="cursor-pointer px-10 py-5 bg-[#EAEAEA] text-[#242424] rounded-full hover:bg-[#D1D1D1] transition-all duration-300 hover:scale-105"
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '20px' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </main>

      {/* Shapes Section */}
      <div style={{ width: '100%', height: '100%', position: 'relative', marginBottom: '108px' }}>
        <img src="/assets/shapes.png" alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>

      <Footer />

      {/* Image Crop Modal for Vibe Images */}
      <ImageCropModal
        isOpen={cropModalOpen}
        onClose={handleCropCancel}
        imageSrc={currentImageSrc}
        onCropComplete={handleCropComplete}
        aspectRatio={1}
      />

      {/* Image Crop Modal for Profile Photo */}
      <ImageCropModal
        isOpen={photoCropModalOpen}
        onClose={handlePhotoCropCancel}
        imageSrc={photoImageSrc}
        onCropComplete={handlePhotoCropComplete}
        aspectRatio={1}
      />

      {/* Image Crop Modal for Custom Section Images */}
      <ImageCropModal
        isOpen={customSectionCropModalOpen}
        onClose={handleCustomSectionCropCancel}
        imageSrc={customSectionImageSrc}
        onCropComplete={handleCustomSectionCropComplete}
        aspectRatio={1}
      />
    </div>
  );
}

// Portfolio Item Form Component
function PortfolioItemForm({ item, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    description: item?.description || '',
    category: item?.category || '',
    project_url: item?.project_url || '',
    tools_used: item?.tools_used || '',
    image: item?.image || null,
    preview: item?.preview || null
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        e.target.value = '';
        return;
      }

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert('Image must be JPEG, PNG, or WebP');
        e.target.value = '';
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          preview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert('Please enter a title for your portfolio item');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl md:rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8">
          <h3 className="text-[24px] md:text-[28px] font-bold text-[#242424] mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Add Portfolio Item
          </h3>

          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-[16px] font-medium text-[#242424] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Project Title <span className="text-[#316EFF]">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-5 py-4 border-2 border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#316EFF] transition-colors duration-200 text-[16px]"
                placeholder="e.g., Mobile App Design"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[16px] font-medium text-[#242424] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Category <span className="text-[#787878]">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-5 py-4 border-2 border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#316EFF] transition-colors duration-200 text-[16px]"
                placeholder="e.g., UX/UI Design, Web Design, Branding"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[16px] font-medium text-[#242424] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Description <span className="text-[#787878]">(Optional)</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-5 py-4 border-2 border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#316EFF] transition-colors duration-200 text-[16px] resize-none"
                placeholder="Describe your project..."
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              />
            </div>

            {/* Tools Used */}
            <div>
              <label className="block text-[16px] font-medium text-[#242424] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Tools Used <span className="text-[#787878]">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.tools_used}
                onChange={(e) => setFormData(prev => ({ ...prev, tools_used: e.target.value }))}
                className="w-full px-5 py-4 border-2 border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#316EFF] transition-colors duration-200 text-[16px]"
                placeholder="e.g., Figma, Sketch, Adobe XD (comma-separated)"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              />
              <p className="mt-2 text-sm text-[#787878]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Separate multiple tools with commas
              </p>
            </div>

            {/* Project URL */}
            <div>
              <label className="block text-[16px] font-medium text-[#242424] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Project URL <span className="text-[#787878]">(Optional)</span>
              </label>
              <input
                type="url"
                value={formData.project_url}
                onChange={(e) => setFormData(prev => ({ ...prev, project_url: e.target.value }))}
                className="w-full px-5 py-4 border-2 border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#316EFF] transition-colors duration-200 text-[16px]"
                placeholder="https://..."
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-[16px] font-medium text-[#242424] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Project Image <span className="text-[#787878]">(Optional)</span>
              </label>

              {formData.preview && (
                <div className="mb-4">
                  <div className="relative group inline-block">
                    <div className="w-48 h-32 rounded-2xl overflow-hidden bg-gray-100 border-2 border-[#E5E7EB]">
                      <img src={formData.preview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: null, preview: null }))}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="w-full px-5 py-4 border-2 border-dashed border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#316EFF] transition-colors duration-200 cursor-pointer hover:border-[#316EFF] hover:bg-blue-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#316EFF] file:text-white hover:file:bg-[#3164DC] file:cursor-pointer"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              />
              <p className="mt-3 text-sm text-[#787878]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Max 5MB. Accepted formats: JPEG, PNG, WebP
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-[#316EFF] text-white rounded-full hover:bg-blue-700 transition-all duration-300 hover:scale-105 font-semibold"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-200 text-[#242424] rounded-full hover:bg-gray-300 transition-all duration-300 font-semibold"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
