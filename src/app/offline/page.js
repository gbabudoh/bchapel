'use client';
export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-6">
      <img src="/icons/icon-192x192.png" alt="Battersea Chapel" className="w-24 h-24 mb-6 rounded-2xl" />
      <h1 className="text-3xl font-bold text-gray-900 mb-3">You&apos;re offline</h1>
      <p className="text-gray-500 text-lg max-w-sm mb-8">
        It looks like you&apos;re not connected to the internet. Please check your connection and try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-lime-500 hover:bg-lime-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-200"
      >
        Try Again
      </button>
    </div>
  );
}
