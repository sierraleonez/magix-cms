import React from 'react';

// A simple SVG icon component for the 404 page.
const NotFoundIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-24 w-24 mx-auto text-destructive"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.828 12.172a.5.5 0 00-.707 0l-1.414 1.414a.5.5 0 000 .707l.707.707a.5.5 0 00.707 0l1.414-1.414a.5.5 0 000-.707l-.707-.707z"
    />
  </svg>
);


// The main 404 Not Found Page component.
export default function NotFoundPage() {
  return (
    <div className="bg-card-foreground min-h-screen flex items-center justify-center font-sans">
      <div className="bg-card p-8 sm:p-12 rounded-2xl shadow-xl text-center max-w-md w-full mx-4">
        
        {/* Icon */}
        <NotFoundIcon />

        {/* Heading */}
        <h1 className="text-8xl font-extrabold text-destructive tracking-wider my-4">
          404
        </h1>

        {/* Subheading */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Page Not Found
        </h2>

        {/* Content message from the user prompt */}
        <p className="text-primary mb-6">
          The resource you are looking for could not be found.
        </p>

        {/* Action Button */}
        <a
          href="/"
          className="inline-block px-6 py-3 bg-destructive-foreground text-secondary font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
};

