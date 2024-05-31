'use client'

import React, { useState } from 'react';

const UploadForm: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleUpload = async () => {
        if (!file) {
            return; // No file selected
        }

        setIsLoading(true); // Show loading indicator

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('http://localhost:3000/api/remove-background', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                setProcessedImage(imageUrl);
            } else {
                console.error("Failed to remove background:", response.statusText);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setIsLoading(false); // Hide loading indicator
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" 
                />
                <button 
                    onClick={handleUpload} 
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {isLoading ? 'Processing...' : 'Remove Background'}
                </button>
            </div>
            {isLoading && (
                <div className="mt-4 text-gray-700">
                    Processing your image, please wait...
                </div>
            )}
            {processedImage && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Processed Image</h3>
                    <img src={processedImage} alt="Processed" className="max-w-full h-auto rounded-lg shadow-md" />
                    <a 
                        href={processedImage} 
                        download="processed_image.png" 
                        className="mt-2 inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Download Processed Image
                    </a>
                </div>
            )}
        </div>
    );
};

export default UploadForm;