import { useState, useRef, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

/**
 * ImageCropModal - Modal component for cropping images
 * Used for vibe images in the application form
 */
export default function ImageCropModal({ isOpen, onClose, imageSrc, onCropComplete, aspectRatio = 1 }) {
  const [crop, setCrop] = useState({
    unit: '%',
    width: 80,
    aspect: aspectRatio
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const onImageLoad = useCallback((e) => {
    imgRef.current = e.currentTarget;
  }, []);

  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
        onCropComplete(file);
        resolve();
      }, 'image/jpeg', 0.95);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-[#E5E7EB] p-6 rounded-t-3xl z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-[24px] md:text-[32px] font-bold text-[#242424]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Crop Your Image
            </h3>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F9FAFB] hover:bg-[#E5E7EB] transition-colors duration-200"
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '24px', fontWeight: 700 }}
            >
              ×
            </button>
          </div>
          <p className="text-[14px] text-[#787878] mt-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Drag to adjust the crop area, then click "Apply Crop" to save
          </p>
        </div>

        {/* Crop Area */}
        <div className="p-6">
          <div className="flex justify-center items-center bg-[#F9FAFB] rounded-2xl p-4 mb-6 min-h-[400px]">
            {imageSrc && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspectRatio}
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Crop preview"
                  onLoad={onImageLoad}
                  style={{ maxHeight: '500px', maxWidth: '100%' }}
                />
              </ReactCrop>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={async () => {
                await handleCropComplete();
                onClose();
              }}
              className="flex-1 px-8 py-4 bg-[#316EFF] text-white rounded-full hover:bg-[#3164DC] transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '18px' }}
            >
              ✓ Apply Crop
            </button>
            <button
              onClick={onClose}
              className="px-8 py-4 bg-[#EAEAEA] text-[#242424] rounded-full hover:bg-[#D1D1D1] transition-all duration-300 hover:scale-105"
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '18px' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
