import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  useGetSupervisorGuidelines,
  useGetAssignedStudents
} from '../../store/tanstackStore/services/queries';
import CreateGuidelineModal from './CreateGuidelineModal';
import GuidelineDetail from './GuidelineDetail';

const Guidelines = () => {
  const [selectedGuideline, setSelectedGuideline] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: guidelinesData, isLoading } = useGetSupervisorGuidelines();
  const guidelines = guidelinesData?.guidelines || [];

  const handleCreated = () => {
    setIsCreateModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (selectedGuideline) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <GuidelineDetail
          guideline={selectedGuideline}
          onBack={() => setSelectedGuideline(null)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Guidelines</h1>
          <p className="text-gray-600 mt-1">Share guidelines documents with your students</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Guideline
        </button>
      </div>

      {guidelines.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <svg
              className="mx-auto h-14 w-14 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No guidelines yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create your first guidelines document to share with students.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 cursor-pointer"
            >
              Create Guideline
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Guidelines List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Your Guidelines</h2>
                <p className="text-sm text-gray-500 mt-1">{guidelines.length} document(s)</p>
              </div>
              <div className="divide-y divide-gray-100">
                {guidelines.map((g) => {
                  const recipientCount = g.recipients?.length || 0;
                  const viewedCount = g.recipients?.filter(r => r.viewedAt).length || 0;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGuideline(g)}
                      className={`w-full text-left p-4 transition-colors cursor-pointer ${
                        selectedGuideline?.id === g.id
                          ? 'bg-blue-50 border-l-4 border-blue-500'
                          : 'hover:bg-gray-50 border-l-4 border-transparent'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {g.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(g.createdAt), 'MMM dd, yyyy')}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span>{recipientCount} shared</span>
                          <span>{viewedCount} viewed</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <svg
                  className="mx-auto h-14 w-14 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Select a guideline</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Choose a guideline from the list to view details and recipients.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <CreateGuidelineModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
};

export default Guidelines;
