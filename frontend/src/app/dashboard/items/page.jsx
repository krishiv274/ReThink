'use client';

import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';
import ItemsGrid from '@/components/ui/ItemsGrid';

export default function ItemsPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-green-50">
      <Sidebar activeSection="items" />
      
      <div className="flex-1 ml-64">
        <Header user={user} />
        
        <main className="p-8">
          <ItemsGrid />
        </main>
      </div>
    </div>
  );
}
