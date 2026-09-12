import React, { useRef, useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import Button from '../ui/Button';
import { toast } from 'react-toastify';

const FileUploader = ({ onFileSelect, initialFile = null, label = 'Upload File', allowedTypes = [] }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(initialFile);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        toast.error(`Invalid file type. Allowed: ${allowedTypes.map(type => type.split('/')[1]).join(', ')}`);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
        return;
      }
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const fileDisplay = selectedFile ? (
    <div className="flex items-center justify-between p-2 border border-gray-300 rounded-md bg-white">
      <span className="text-gray-700 text-sm truncate mr-2">{selectedFile.name}</span>
      <Button variant="ghost" size="sm" onClick={handleRemoveFile} type="button">
        <X size={16} />
      </Button>
    </div>
  ) : (
    <label
      htmlFor="file-upload"
      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <UploadCloud size={32} className="text-gray-400" />
        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
        <p className="text-xs text-gray-500">Max 100MB ({allowedTypes.map(type => type.split('/')[1]).join(', ') || 'Any'})</p>
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