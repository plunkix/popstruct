'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  onUpload: (file: File) => void;
  acceptedFormats?: string[];
  maxSize?: number; // in MB
  loading?: boolean;
}

export function FileUploader({
  onUpload,
  acceptedFormats = ['.vcf', '.csv', '.txt'],
  maxSize = 100,
  loading = false,
}: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError('');

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === 'file-too-large') {
          setError(`File is too large. Maximum size is ${maxSize}MB`);
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          setError(
            `Invalid file type. Accepted formats: ${acceptedFormats.join(', ')}`
          );
        } else {
          setError('File upload failed. Please try again.');
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const uploadedFile = acceptedFiles[0];
        setFile(uploadedFile);
        setError('');
      }
    },
    [acceptedFormats, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats.reduce((acc, format) => {
      if (format === '.vcf') {
        acc['text/vcf'] = ['.vcf'];
        acc['application/x-gzip'] = ['.vcf.gz'];
      } else if (format === '.csv') {
        acc['text/csv'] = ['.csv'];
      } else if (format === '.txt') {
        acc['text/plain'] = ['.txt'];
      }
      return acc;
    }, {} as Record<string, string[]>),
    maxSize: maxSize * 1024 * 1024,
    multiple: false,
  });

  const handleUpload = () => {
    if (file) {
      onUpload(file);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setError('');
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
          }`}
        >
          <input {...getInputProps()} disabled={loading} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-lg text-blue-600 dark:text-blue-400">
              Drop the file here...
            </p>
          ) : (
            <>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Accepted formats: {acceptedFormats.join(', ')} (max {maxSize}MB)
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <File className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              disabled={loading}
              className="text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {file && !loading && (
        <button
          onClick={handleUpload}
          className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-semibold"
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          Upload File
        </button>
      )}

      {loading && (
        <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
          <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          <span>Uploading...</span>
        </div>
      )}
    </div>
  );
}
