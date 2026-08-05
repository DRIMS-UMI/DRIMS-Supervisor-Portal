import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Loader2, FileText, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, addDays, differenceInDays } from "date-fns";

const typeStyles = {
  PROPOSAL: "bg-blue-100 text-blue-800",
  DISSERTATION: "bg-green-100 text-green-800",
  CHAPTER: "bg-purple-100 text-purple-800",
  OTHER: "bg-gray-100 text-gray-800",
  REVIEWED: "bg-orange-100 text-orange-800",
};

const typeLabels = {
  PROPOSAL: "Proposal",
  DISSERTATION: "Dissertation",
  CHAPTER: "Chapter",
  OTHER: "Other",
};

const REVIEW_WINDOW_DAYS = 14;

const getDueInfo = (uploadedAt) => {
  const dueDate = addDays(new Date(uploadedAt), REVIEW_WINDOW_DAYS);
  const daysLeft = differenceInDays(dueDate, new Date());
  if (daysLeft < 0) {
    return { label: `Overdue by ${Math.abs(daysLeft)} days`, className: "text-red-600 font-medium" };
  }
  if (daysLeft === 0) {
    return { label: "Due today", className: "text-orange-500 font-medium" };
  }
  if (daysLeft <= 3) {
    return { label: `Due in ${daysLeft} days`, className: "text-orange-500 font-medium" };
  }
  return { label: `Due in ${daysLeft} days`, className: "text-gray-500" };
};

const DashboardPendingReview = ({ data = [], isLoading = false, isError = false, onViewMore, onReview }) => {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col h-full shadow-sm rounded-lg border-0 bg-white">
      <CardHeader className="flex flex-row justify-between items-start gap-6 space-y-0 py-5">
        <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
          Pending Reviews
          {!isLoading && data.length > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#23388F] text-white text-xs font-medium">
              {data.length}
            </span>
          )}
        </CardTitle>

        <Button
          onClick={onViewMore}
          className="text-sm text-white bg-[#23388F] hover:bg-[#23388F]/80 flex items-center gap-1 px-3 py-1.5 rounded"
        >
          <span>View All</span>
          <ChevronsUpDown className="text-white w-4 h-4 ml-1" />
        </Button>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="text-center py-4 text-red-500">
            Error loading pending reviews. Please try again.
          </div>
        ) : data && data.length > 0 ? (
          <div className="space-y-3">
            {data.map((doc) => {
              const due = getDueInfo(doc.uploadedAt);
              return (
                <div
                  key={doc.id}
                  className="rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
                  onClick={() => navigate(`/students/profile/${doc.student.id}/documents`)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#23388F]/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-[#23388F]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              typeStyles[doc.type] || typeStyles.OTHER
                            }`}
                          >
                            {typeLabels[doc.type] || doc.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 truncate">{doc.student.fullName}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {format(new Date(doc.uploadedAt), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`text-xs whitespace-nowrap ${due.className}`}>{due.label}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReview(doc);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-md transition-colors cursor-pointer"
                        title="Review document"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <FileText className="w-10 h-10 text-gray-300 mb-2" />
            <div className="text-sm font-medium">No pending reviews</div>
            <div className="text-xs text-gray-400 mt-1">
              Documents uploaded by students will appear here
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardPendingReview;
