import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, X } from 'lucide-react';
import Button from '../ui/Button';
import { toast } from 'react-toastify';

// Cloudinary Free plan image limit is 10 MB.
// Server will compress images, but we still warn early for very large files.
const MAX_IMAGE_BYTES = 25 * 1024 * 1024; // 25 MB – server compresses down to <10 MB
const MAX_OTHER_BYTES = 20 * 1024 * 1024; // 20 MB for PDFs, docs, video

const FileUploader = ({
  onFileSelect,
  initialFile = null,
  label = 'Upload File',
  allowedTypes = [],
}) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(initialFile);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Keep preview in sync when parent resets / provides initialFile
  useEffect(() => {
    if (initialFile && initialFile.url && !selectedFile?.name) {
      setSelectedFile(initialFile);
      if (initialFile.type?.startsWith?.('image/') || initialFile.url.match(/\.(jpe?g|png|gif|webp)$/i)) {
        setPreviewUrl(initialFile.url);
      }
    }
  }, [initialFile]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Type check
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      toast.error(
        `Invalid file type. Allowed: ${allowedTypes.map((t) => t.split('/')[1]).join(', ')}`
      );
      resetInput();
      return;
    }

    // Size check (client-side early feedback)
    const isImage = file.type.startsWith('image/');
    const limit = isImage ? MAX_IMAGE_BYTES : MAX_OTHER_BYTES;
    if (file.size > limit) {
      const limitMB = Math.round(limit / (1024 * 1024));
      toast.error(
        `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed is ${limitMB} MB.`
      );
      resetInput();
      return;
    }

    // Soft warning for images that will be compressed on the server
    if (isImage && file.size > 10 * 1024 * 1024) {
      toast.info('Large image detected – it will be automatically compressed before upload.');
    }

    setSelectedFile(file);
    onFileSelect(file);

    if (isImage) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const resetInput = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleRemoveFile = () => {
    resetInput();
  };

  const fileDisplay = selectedFile ? (
    <div className="border border-gray-300 rounded-md bg-white overflow-hidden">
      {previewUrl ? (
        <div className="relative">
          <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={handleRemoveFile}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3">
          <span className="text-gray-700 text-sm truncate mr-2">
            {selectedFile.name || selectedFile.url || 'Selected file'}
          </span>
          <Button variant="ghost" size="sm" onClick={handleRemoveFile} type="button">
            <X size={16} />
          </Button>
        </div>
      )}
      {previewUrl && (
        <div className="p-2 text-xs text-gray-500 truncate border-t">
          {selectedFile.name}
          {selectedFile.size
            ? ` (${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)`
            : ''}
        </div>
      )}
    </div>
  ) : (
    <label
      htmlFor="file-upload"
      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <UploadCloud size={32} className="text-gray-400" />
        <p className="mb-2 text-sm text-gray-500">
          <span className="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500">Images, PDF, Doc, Video (images auto-compressed if large)</p>
      </div>
      <input
        id="file-upload"
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
    </label>
  );

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {fileDisplay}
    </div>
  );
};

export default FileUploader;
