"use client";
import React from "react";
import { useQueuePosition } from "@/src/hooks/useQueries";
import { Clock, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

const RequestQueue: React.FC = () => {
  const { data: queueData, isLoading } = useQueuePosition();

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <span className="text-sm text-gray-600">Loading queue status...</span>
        </div>
      </div>
    );
  }

  if (!queueData?.data || queueData.data.activeRequests === 0) {
    return null; // Don't show if no active requests
  }

  const queueInfo = queueData.data;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-5 w-5 text-blue-600" />
        <h3 className="text-sm font-semibold text-gray-900">
          Generation Queue
        </h3>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Your Position:</span>
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              queueInfo.queuePosition > 0
                ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                : "bg-green-100 text-green-800 border border-green-200"
            }`}
          >
            {queueInfo.queuePosition > 0 ? (
              <>
                <Clock className="h-3 w-3 mr-1" />#{queueInfo.queuePosition} in
                queue
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Processing
              </>
            )}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Active Requests:</span>
          <span className="font-medium text-sm text-gray-900">
            {queueInfo.activeRequests}
          </span>
        </div>
        {queueInfo.queueStats.queued > 0 && (
          <div className="text-xs text-gray-500 pt-1 border-t border-gray-100">
            {queueInfo.queueStats.queued} request
            {queueInfo.queueStats.queued !== 1 ? "s" : ""} waiting in queue
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestQueue;
