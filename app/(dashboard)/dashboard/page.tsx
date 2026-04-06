import React from "react";

export default function DashboardPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white font-sans">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 text-center max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
        <p className="text-gray-500 leading-relaxed">
          This is your private dashboard area. Notice that the public website Navbar is intentionally excluded from this layout.
        </p>
        <button className="mt-8 px-6 py-2 bg-zinc-950 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
          Return Home
        </button>
      </div>
    </div>
  );
}
