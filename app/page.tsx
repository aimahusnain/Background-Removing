'use client';

import React, { useState, useRef } from 'react';

const UploadForm: React.FC = () => {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleUpload = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!inputFileRef.current?.files?.[0]) {
            return; // No file selected
        }

        const file = inputFileRef.current.files[0];

        // Validate file size (e.g., limit to 4MB)
        if (file.size > 4 * 1024 * 1024) {
            alert("File size exceeds the 4MB limit.");
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/api/remove-background', {
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
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleUpload}>
                    <input
                        type="file"
                        ref={inputFileRef}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                        required
                    />
                    <button
                        type="submit"
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        {isLoading ? 'Processing...' : 'Upload and Remove Background'}
                    </button>
                </form>
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
