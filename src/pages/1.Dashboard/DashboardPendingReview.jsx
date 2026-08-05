import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Loader2, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const DashboardPendingReview = ({ data = [], isLoading = false, isError = false, onViewMore }) => {
  const navigate = useNavigate();

  const typeLabels = {
    PROPOSAL: "Proposal",
    DISSERTATION: "Dissertation",
    CHAPTER: "Chapter",
    OTHER: "Other",
  };

  return (
    <Card className="flex flex-col h-full shadow-sm rounded-lg border-0 bg-white">
      <CardHeader className="flex flex-row justify-between items-start gap-6 space-y-0 py-5">
        <CardTitle className="text-lg font-medium text-gray-900">
          Pending Reviews
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
            {data.map((doc) => (
              <div
                key={doc.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/students/profile/${doc.student.id}/documents`)}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#23388F]/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#23388F]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {doc.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {doc.student.fullName} · {typeLabels[doc.type] || doc.type}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {format(new Date(doc.uploadedAt), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
            ))}
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
