"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/src/components/common/button/Button";
import { Calendar, Edit2, Trash2, Clock, FileText, Eye } from "lucide-react";
import { DraftDesign } from "@/src/services/apiServices";
import { useDeleteDraft } from "@/src/hooks/useQueries";
import { toast } from "react-toastify";

interface DraftCardProps {
  draft: DraftDesign;
  onEdit?: (draftId: string) => void;
  onDelete?: () => void;
}

const DraftCard: React.FC<DraftCardProps> = ({ draft, onEdit, onDelete }) => {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const deleteDraftMutation = useDeleteDraft({
    onSuccess: () => {
      toast.success("Draft deleted successfully");
      onDelete?.();
      setShowDeleteConfirm(false);
    },
    onError: (error: unknown) => {
      let errorMessage = "Failed to delete draft";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        errorMessage = String(error.message);
      }

      // Show user-friendly error message
      toast.error(errorMessage, {
        autoClose: 5000,
      });
    },
  });

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "just now";
      if (diffMins < 60)
        return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
      if (diffHours < 24)
        return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    } catch {
      return "Unknown";
    }
  };

  // Get preview image from draft data
  const getPreviewImage = () => {
    // API returns presigned URLs directly
    if (draft.previewImage) {
      return draft.previewImage;
    }
    if (draft.frontImage) {
      return draft.frontImage;
    }
    if (draft.backImage) {
      return draft.backImage;
    }
    if (draft.generatorImage) {
      return draft.generatorImage;
    }
    return "/images/home/coin-design.png"; // Default placeholder
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteDraftMutation.mutate(draft.id);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(draft.id);
    }
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/drafts/${draft.id}`);
  };

  const handleCardClick = () => {
    router.push(`/drafts/${draft.id}`);
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Preview Image */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 md:w-24 md:h-24 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            <Image
              src={getPreviewImage()}
              alt={draft.name || "Draft Preview"}
              width={96}
              height={96}
              className="object-cover w-full h-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/home/coin-design.png";
              }}
            />
          </div>
        </div>

        {/* Draft Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {draft.name || "Untitled Draft"}
            </h3>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200 ml-2">
              DRAFT
            </span>
          </div>

          {/* Metadata */}
          <div className="space-y-1 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Last saved: {formatDate(draft.updatedAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Created: {formatDate(draft.createdAt)}</span>
            </div>
            {draft.totalCoins && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="h-4 w-4" />
                <span>Coins: {draft.totalCoins}</span>
              </div>
            )}
          </div>

          {/* Draft Type Indicator */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <FileText className="h-3 w-3" />
            <span>
              {draft.generatorPrompt || draft.generatorImage
                ? "AI Generator"
                : "Standard Builder"}
            </span>
          </div>

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 mb-2">
                Are you sure you want to delete this draft? This action cannot
                be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="ternary"
                  onClick={handleConfirmDelete}
                  disabled={deleteDraftMutation.isPending}
                  className="!bg-red-600 !text-white hover:!bg-red-700 text-sm px-4 py-2"
                >
                  {deleteDraftMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
                <Button
                  variant="ternary"
                  onClick={handleCancelDelete}
                  disabled={deleteDraftMutation.isPending}
                  className="text-sm px-4 py-2"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!showDeleteConfirm && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleView}
                className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                title="View"
              >
                <Eye className="h-5 w-5" />
              </button>
              <button
                onClick={handleEdit}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                title="Edit"
              >
                <Edit2 className="h-5 w-5" />
              </button>
              <button
                onClick={handleDeleteClick}
                disabled={deleteDraftMutation.isPending}
                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DraftCard;
