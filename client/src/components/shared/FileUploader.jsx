import React, { useRef, useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import Button from '../ui/Button';
import { toast } from 'react-toastify';

const FileUploader = ({ onFileSelect, initialFile = null, label = 'Upload File', allowedTypes = [] }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(initialFile);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        toast.error(`Invalid file type. Allowed: ${allowedTypes.map(type => type.split('/')[1]).join(', ')}`);
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
        return;
      }
      setSelectedFile(file);
      onFileSelect(file);

      // Generate preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
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
          <span className="text-gray-700 text-sm truncate mr-2">{selectedFile.name}</span>
          <Button variant="ghost" size="sm" onClick={handleRemoveFile} type="button">
            <X size={16} />
          </Button>
        </div>
      )}
      {previewUrl && (
        <div className="p-2 text-xs text-gray-500 truncate border-t">{selectedFile.name}</div>
      )}
    </div>
  ) : (
    <label
      htmlFor="file-upload"
      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <UploadCloud size={32} className="text-gray-400" />
        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
        <p className="text-xs text-gray-500">Images, PDF, Doc, Video etc.</p>
      </div>
      <input id="file-upload" type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
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
