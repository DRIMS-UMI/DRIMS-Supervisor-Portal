import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import NotificationStats from '../5.Notifications/NotificationStats';
import NotificationTable from '../5.Notifications/NotificationTable';
import NotificationsPopUp from '../5.Notifications/NotificationPopUp';
import NotificationSearchBar from './NotificationSearchBar';
import { useSocket } from '../../hooks/useSocket';

const Notifications = () => {
  const [topSearch, setTopSearch] = useState('');
  const [search, setSearch] = useState('');

  // Socket event handlers for document notifications
  const handleDocumentNotification = useCallback((data) => {
    console.log('Document notification received:', data);
    if (data.type === 'new_document_uploaded') {
      const document = data.document;
      toast.success(
        `New document uploaded by ${document.studentName}: ${document.title}`,
        {
          description: `Document type: ${document.type}`,
          action: {
            label: 'View',
            onClick: () => {
              // Navigate to student documents or show document details
              console.log('Navigate to document:', document.id);
            }
          }
        }
      );
    } else if (data.type === 'document_deleted' && data.studentName) {
      toast.info(`${data.studentName} deleted a document`);
    }
  }, []);

  // Initialize socket connection
  useSocket(handleDocumentNotification, null, null);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <NotificationSearchBar value={topSearch} onChange={e => setTopSearch(e.target.value)} />
      <h1 className="text-2xl font-semibold mb-6">Notifications</h1>
      
      {/* Stats Cards */}
      <div className="mb-6">
        <NotificationStats />
      </div>
      
      {/* Notifications Table */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="mb-2 font-semibold text-blue-700">System Notifications</div>
        <NotificationSearchBar value={search} onChange={e => setSearch(e.target.value)} />
        <NotificationTable search={search} />
      </div>
      
      {/* Notifications PopUp */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <NotificationsPopUp />
      </div>
    </div>
  );
};

export default Notifications;