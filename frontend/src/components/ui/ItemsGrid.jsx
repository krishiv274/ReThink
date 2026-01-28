'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import {
  ItemCard,
  ItemsFilters,
  ItemsPagination,
  ItemFormModal,
  DeleteItemModal,
  EmptyState,
} from '@/components/items';

export default function ItemsGrid() {
  const router = useRouter();
  
  // State for items and pagination
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 6,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  // Modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form state
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Fetch items from API
  const fetchItems = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const result = await api.getMyItems({
        page,
        limit: 6,
        material: selectedMaterial !== 'All' ? selectedMaterial : undefined,
        sortBy,
        search: searchQuery || undefined,
      });

      setItems(result.items || []);
      setPagination(result.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 6,
        hasNextPage: false,
        hasPrevPage: false,
      });
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [selectedMaterial, sortBy, searchQuery]);

  // Initial fetch and refetch on filter changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchItems(1);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [fetchItems]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchItems(newPage);
    }
  };

  // Handle upload submit
  const handleUploadSubmit = async (formData) => {
    setFormLoading(true);
    setFormError('');

    try {
      await api.createItem(formData);
      setShowUploadModal(false);
      fetchItems(1);
    } catch (error) {
      setFormError(error.message || 'Failed to create item');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle edit submit
  const handleEditSubmit = async (formData) => {
    if (!selectedItem) return;

    setFormLoading(true);
    setFormError('');

    try {
      await api.updateItem(selectedItem._id, formData);
      setShowEditModal(false);
      setSelectedItem(null);
      fetchItems(pagination.currentPage);
    } catch (error) {
      setFormError(error.message || 'Failed to update item');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedItem) return;

    setFormLoading(true);
    try {
      await api.deleteItem(selectedItem._id);
      setShowDeleteModal(false);
      setSelectedItem(null);
      fetchItems(pagination.currentPage);
    } catch (error) {
      setFormError(error.message || 'Failed to delete item');
    } finally {
      setFormLoading(false);
    }
  };

  // View item detail
  const handleViewItem = (item) => {
    router.push(`/home/items/${item._id}`);
  };

  // Open edit modal with item data
  const handleEditItem = (item) => {
    setSelectedItem(item);
    setFormError('');
    setShowEditModal(true);
  };

  // Open delete confirmation
  const handleDeleteItem = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  // Open upload modal
  const handleOpenUpload = () => {
    setFormError('');
    setShowUploadModal(true);
  };

  // Check if filters are active
  const hasActiveFilters = searchQuery || selectedMaterial !== 'All';

  return (
    <div className="space-y-6">
      {/* Header with Upload Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Items</h2>
          <p className="text-gray-600">
            Manage your uploaded items and reuse ideas
            {pagination.totalItems > 0 && (
              <span className="ml-2 text-sm text-gray-400">
                ({pagination.totalItems} items)
              </span>
            )}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOpenUpload}
          className="flex items-center gap-2 px-5 py-3 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/50 transition-all"
        >
          <Plus className="w-5 h-5" />
          Upload New Item
        </motion.button>
      </div>

      {/* Filters */}
      <ItemsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedMaterial={selectedMaterial}
        onMaterialChange={setSelectedMaterial}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      )}

      {/* Empty State */}
      {!loading && items.length === 0 && (
        <EmptyState
          hasFilters={hasActiveFilters}
          onUploadClick={handleOpenUpload}
        />
      )}

      {/* Items Grid */}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <ItemCard
              key={item._id}
              item={item}
              index={index}
              onView={handleViewItem}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <ItemsPagination
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}

      {/* Upload Modal */}
      <ItemFormModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSubmit={handleUploadSubmit}
        mode="create"
        loading={formLoading}
        error={formError}
      />

      {/* Edit Modal */}
      <ItemFormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedItem(null);
        }}
        onSubmit={handleEditSubmit}
        mode="edit"
        initialData={selectedItem ? {
          title: selectedItem.title,
          material: selectedItem.material,
          imageUrl: selectedItem.imageUrl || '',
        } : undefined}
        loading={formLoading}
        error={formError}
      />

      {/* Delete Confirmation Modal */}
      <DeleteItemModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedItem(null);
        }}
        onConfirm={handleDelete}
        itemTitle={selectedItem?.title}
        loading={formLoading}
      />
    </div>
  );
}
