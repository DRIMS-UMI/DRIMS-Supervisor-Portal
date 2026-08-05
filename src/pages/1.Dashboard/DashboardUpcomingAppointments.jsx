import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CalendarDays, ArrowRight, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, startOfToday } from "date-fns";
import { useGetAppointments } from "../../store/tanstackStore/services/queries";
import { format12HourTime } from "../../utils/formatTime";

const statusBadge = (status) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-100 text-green-700';
    case 'NO_SHOW':
      return 'bg-red-100 text-red-700';
    case 'CANCELLED':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-blue-100 text-blue-700';
  }
};

const DashboardUpcomingAppointments = () => {
  const { data: appointments, isLoading } = useGetAppointments();
  const navigate = useNavigate();

  const upcoming = useMemo(() => {
    const today = startOfToday();
    return (appointments || [])
      .filter(
        (apt) =>
          apt.status === 'CONFIRMED' &&
          new Date(apt.date) >= today
      )
      .sort((a, b) => {
        const dateCompare = new Date(a.date) - new Date(b.date);
        if (dateCompare !== 0) return dateCompare;
        return (a.startTime || '').localeCompare(b.startTime || '');
      })
      .slice(0, 4);
  }, [appointments]);

  return (
    <Card className="flex flex-col h-full shadow-sm rounded-lg border-0 bg-white">
      <CardHeader className="flex flex-row justify-between items-start gap-6 space-y-0 py-5">
        <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
          Upcoming Appointments
          {!isLoading && upcoming.length > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#23388F] text-white text-xs font-medium">
              {upcoming.length}
            </span>
          )}
        </CardTitle>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={() => navigate('/appointments?tab=calendar')}
            className="text-sm text-white bg-[#23388F] hover:bg-[#23388F]/80 flex items-center gap-1 px-3 py-1.5 rounded"
          >
            <Calendar className="w-4 h-4" />
            <span>Calendar</span>
          </Button>
          <Button
            onClick={() => navigate('/appointments')}
            className="text-sm text-white bg-[#23388F] hover:bg-[#23388F]/80 flex items-center gap-1 px-3 py-1.5 rounded"
          >
            <span>View More</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : upcoming.length > 0 ? (
          <div className="space-y-3">
            {upcoming.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
                onClick={() => navigate('/appointments')}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#23388F]/10 flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-[#23388F]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {apt.student?.fullName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {format(new Date(apt.date), 'EEE, MMM d')} · {format12HourTime(apt.startTime)} - {format12HourTime(apt.endTime)}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${statusBadge(apt.status)}`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <CalendarDays className="w-10 h-10 text-gray-300 mb-2" />
            <div className="text-sm font-medium">No upcoming appointments</div>
            <div className="text-xs text-gray-400 mt-1">
              Confirmed bookings will appear here
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardUpcomingAppointments;
