'use client';

import ProtectedRoute from '@/src/components/ProtectedRoute';

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold">Cài đặt</h1>
        </div>
      </div>
    </ProtectedRoute>
  );
}
