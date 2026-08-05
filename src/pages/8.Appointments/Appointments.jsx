import React from 'react';
import { useSearchParams } from 'react-router-dom';
import UpcomingAppointments from './UpcomingAppointments';
import AvailabilitySettings from './AvailabilitySettings';
import AppointmentsCalendar from './AppointmentsCalendar';

const TABS = [
  { id: 'upcoming', label: 'Upcoming Appointments' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'availability', label: 'Availability Settings' },
];

const Appointments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = TABS.some((t) => t.id === searchParams.get('tab'))
    ? searchParams.get('tab')
    : 'upcoming';

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between py-6 px-6 pb-0 w-full h-[64px]">
        <p className="text-sm font-medium text-gray-900">Supervisor Portal</p>
        <p className="text-sm font-medium text-gray-600">Digital Research Information Management System</p>
      </div>

      {/* Horizontal Line */}
      <div className="my-6 border-t w-full border-gray-200"></div>

      {/* Title */}
      <div className="flex flex-col p-6 pb-2">
        <h1 className="text-2xl font-semibold mb-4">Appointments</h1>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`py-2 px-4 font-medium text-sm border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'upcoming' ? (
          <UpcomingAppointments />
        ) : activeTab === 'calendar' ? (
          <AppointmentsCalendar />
        ) : (
          <AvailabilitySettings />
        )}
      </div>
    </div>
  );
};

export default Appointments;
