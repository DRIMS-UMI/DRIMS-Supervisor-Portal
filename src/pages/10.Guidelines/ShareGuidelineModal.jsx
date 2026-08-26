import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useShareGuideline, useGetAssignedStudents } from '../../store/tanstackStore/services/queries';

const ShareGuidelineModal = ({ isOpen, onClose, guideline, existingRecipientIds = [] }) => {
  const [mode, setMode] = useState('select');
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: assignedData, isLoading } = useGetAssignedStudents();
  const shareMutation = useShareGuideline();

  const students = assignedData?.students || [];

  useEffect(() => {
    if (isOpen) {
      setSelectedStudentIds([]);
      setSearchTerm('');
      setMode('select');
    }
  }, [isOpen]);

  const filteredStudents = students.filter((student) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      student.fullName?.toLowerCase().includes(term) ||
      student.registrationNumber?.toLowerCase().includes(term)
    );
  });

  const nonSharedStudents = filteredStudents.filter(
    (s) => !existingRecipientIds.includes(s.id)
  );

  const allNonSharedSelected =
    nonSharedStudents.length > 0 &&
    nonSharedStudents.every((s) => selectedStudentIds.includes(s.id));

  const handleToggleStudent = (studentId) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleToggleAll = () => {
    if (allNonSharedSelected) {
      setSelectedStudentIds((prev) =>
        prev.filter((id) => !nonSharedStudents.some((s) => s.id === id))
      );
    } else {
      setSelectedStudentIds((prev) => {
        const ids = new Set(prev);
        nonSharedStudents.forEach((s) => ids.add(s.id));
        return Array.from(ids);
      });
    }
  };

  const handleShare = () => {
    if (mode === 'all') {
      shareMutation.mutate(
        { guidelineId: guideline.id, shareWithAll: true },
        {
          onSuccess: () => {
            toast.success('Guideline shared with all assigned students');
            onClose();
          },
          onError: (error) => {
            toast.error(error?.response?.data?.message || 'Failed to share guideline');
          }
        }
      );
    } else {
      if (selectedStudentIds.length === 0) {
        toast.error('Please select at least one student');
        return;
      }
      shareMutation.mutate(
        { guidelineId: guideline.id, studentIds: selectedStudentIds },
        {
          onSuccess: () => {
            toast.success(`Guideline shared with ${selectedStudentIds.length} student${selectedStudentIds.length === 1 ? '' : 's'}`);
            onClose();
          },
          onError: (error) => {
            toast.error(error?.response?.data?.message || 'Failed to share guideline');
          }
        }
      );
    }
  };

  const handleClose = () => {
    setSelectedStudentIds([]);
    setSearchTerm('');
    setMode('select');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Share Guideline</h2>
              <p className="text-sm text-gray-500 mt-1">{guideline?.title}</p>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="flex border border-gray-200 rounded-lg overflow-hidden mb-4">
            <button
              onClick={() => setMode('select')}
              className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                mode === 'select'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              Select Specific Students
            </button>
            <button
              onClick={() => setMode('all')}
              className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                mode === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              Share with All
            </button>
          </div>

          {mode === 'all' ? (
            <div className="py-6 text-center">
              <svg className="mx-auto h-12 w-12 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm text-gray-600 mb-1">
                This will share with all assigned students who haven&apos;t received this guideline yet.
              </p>
              {existingRecipientIds.length > 0 && (
                <p className="text-xs text-gray-400">
                  {existingRecipientIds.length} student{existingRecipientIds.length === 1 ? '' : 's'} already have this guideline.
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="relative mb-3">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or registration number..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              {nonSharedStudents.length > 0 && (
                <label className="flex items-center gap-3 px-3 py-2 mb-1 bg-gray-50 rounded-md cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allNonSharedSelected}
                    onChange={handleToggleAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Select All</span>
                </label>
              )}

              <div className="border border-gray-200 rounded-md max-h-72 overflow-y-auto">
                {isLoading ? (
                  <div className="px-4 py-8 text-center text-sm text-gray-500">Loading students...</div>
                ) : filteredStudents.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-gray-500">
                    {searchTerm ? 'No students match your search.' : 'No assigned students found.'}
                  </div>
                ) : (
                  filteredStudents.map((student) => {
                    const isAlreadyShared = existingRecipientIds.includes(student.id);
                    const isChecked = isAlreadyShared || selectedStudentIds.includes(student.id);

                    return (
                      <label
                        key={student.id}
                        className={`flex items-center gap-3 px-3 py-2.5 border-b border-gray-100 last:border-b-0 ${
                          isAlreadyShared ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50 cursor-pointer'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isAlreadyShared}
                          onChange={() => handleToggleStudent(student.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{student.fullName}</p>
                          <p className="text-xs text-gray-500">{student.registrationNumber}</p>
                        </div>
                        {isAlreadyShared && (
                          <span className="text-xs text-gray-400 whitespace-nowrap">Already shared</span>
                        )}
                      </label>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {mode === 'select' && (
              <span>
                {selectedStudentIds.length} student{selectedStudentIds.length === 1 ? '' : 's'} selected
              </span>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleShare}
              disabled={shareMutation.isPending || (mode === 'select' && selectedStudentIds.length === 0)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {shareMutation.isPending
                ? 'Sharing...'
                : mode === 'all'
                  ? 'Share with All'
                  : `Share with ${selectedStudentIds.length || 0} Student${selectedStudentIds.length === 1 ? '' : 's'}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareGuidelineModal;
