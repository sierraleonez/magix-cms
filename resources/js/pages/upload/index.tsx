// resources/js/components/YouTubeUploader.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function YouTubeUploader({ isAuthenticated }: { isAuthenticated: boolean }) {
    // State management
    // const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const [uploading, setUploading] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoFile, setVideoFile] = useState(null);

    // Fetch initial status when the component mounts
    // useEffect(() => {
    //     axios.get('/upload') // Assumes this route returns the JSON status
    //         .then(response => {
    //             setIsAuthenticated(response.data.isAuthenticated);
    //             setCsrfToken(response.data.csrfToken);
    //             setSuccessMessage(response.data.success || '');
    //             setErrorMessage(response.data.error || '');
    //         })
    //         .catch(error => {
    //             console.error("Error fetching initial status:", error);
    //             setErrorMessage("Could not connect to the server.");
    //         });
    // }, []);

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        setUploading(true);
        setSuccessMessage('');
        setErrorMessage('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('video', videoFile);
        formData.append('_token', csrfToken); // Include CSRF token

        axios.post(route('youtube.upload'),
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        )
            .then(response => {
                // Assuming Laravel redirects back with session flash data,
                // we re-fetch the status to get the new messages.
                // A better API would return the message directly.
                setSuccessMessage("Video uploaded successfully! Refreshing status...");
                setTitle('');
                setDescription('');
                setVideoFile(null);
                event.target.reset(); // Reset file input
            })
            .catch(error => {
                if (error.response && error.response.data.errors) {
                    // Handle Laravel validation errors
                    const messages = Object.values(error.response.data.errors).join(' ');
                    setErrorMessage(messages);
                } else {
                    setErrorMessage("An unknown error occurred during upload.");
                }
            })
            .finally(() => {
                setUploading(false);
            });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header text-center">
                            <h4>Upload Video to YouTube</h4>
                        </div>
                        <div className="card-body">
                            {/* Display Messages */}
                            {successMessage && <div className="alert alert-success">{successMessage}</div>}
                            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                            {/* Conditional Rendering */}
                            {!isAuthenticated ? (
                                <div className="text-center">
                                    <p>Please connect your YouTube account to upload videos.</p>
                                    <a href="/youtube/connect" className="btn btn-danger">Connect with YouTube</a>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="title" className="form-label">Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="title"
                                            name="title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            rows="3"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="video" className="form-label">Video File</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="video"
                                            name="video"
                                            onChange={(e) => setVideoFile(e.target.files[0])}
                                            required
                                            accept="video/*"
                                        />
                                    </div>
                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-primary" disabled={uploading}>
                                            {uploading ? 'Uploading...' : 'Upload Video'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default YouTubeUploader;