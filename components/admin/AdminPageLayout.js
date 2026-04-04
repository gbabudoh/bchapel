'use client';
import AdminSidebar from './AdminSidebar';

export default function AdminPageLayout({ title, description, action, children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
          </div>
          {action && <div>{action}</div>}
        </header>

        {/* Page content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
