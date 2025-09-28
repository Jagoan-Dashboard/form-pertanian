import { Icon } from "@iconify/react";
import { useState } from "react";

// Drag & Drop Upload Component
export function ImageUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);


  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${isDragging
        ? 'border-green-600 bg-green-50'
        : 'border-gray-300 hover:border-green-400'
        }`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      {preview ? (
        <div className="relative">
          <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPreview(null);
            }}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
          >
            <Icon icon="mdi:close" className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon icon="mdi:cloud-upload" className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-1">
            Upload Foto Pertumbuhan
          </p>
          <p className="text-xs text-gray-500">
            Drag & drop atau klik untuk upload
          </p>
          <p className="text-xs text-gray-400 mt-2">
            PNG, JPG, JPEG (Max 5MB)
          </p>
        </div>
      )}
    </div>
  );
}