"use client";
import React, { useState, useMemo, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/src/components/common/button/Button";
import {
  Calendar,
  Edit2,
  Trash2,
  Clock,
  FileText,
  Eye,
  Send,
} from "lucide-react";
import { DraftDesign } from "@/src/services/apiServices";
import { useDeleteDraft } from "@/src/hooks/useQueries";
import { toast } from "react-toastify";

interface DraftCardProps {
  draft: DraftDesign;
  onEdit?: (draftId: string) => void;
  onDelete?: () => void;
  onSubmit?: (draftId: string) => void;
}

const DraftCard: React.FC<DraftCardProps> = ({
  draft,
  onEdit,
  onDelete,
  onSubmit,
}) => {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageErrorRef = useRef(false);

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

  // Validate image URL - must start with /, http://, https://, or data:
  const validateImageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    if (
      url.startsWith("/") ||
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("data:")
    ) {
      return url;
    }
    return null;
  };

  // Memoize preview image to prevent recalculation on every render
  const previewImage = useMemo(() => {
    // If image has errored, use placeholder immediately
    if (imageErrorRef.current) {
      return "/images/home/coin-design.png";
    }

    // API returns presigned URLs directly
    const preview = validateImageUrl(draft.previewImage);
    if (preview) return preview;

    const front = validateImageUrl(draft.frontImage);
    if (front) return front;

    const back = validateImageUrl(draft.backImage);
    if (back) return back;

    const generator = validateImageUrl(draft.generatorImage);
    if (generator) return generator;

    return "/images/home/coin-design.png"; // Default placeholder
  }, [
    draft.previewImage,
    draft.frontImage,
    draft.backImage,
    draft.generatorImage,
  ]);

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

  const handleSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSubmit) {
      onSubmit(draft.id);
    }
  };

  const handleCardClick = () => {
    router.push(`/drafts/${draft.id}`);
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col h-full"
      onClick={handleCardClick}
    >
      {/* Preview Image Section */}
      <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex-shrink-0">
        {previewImage.startsWith("data:") ? (
          // Use regular img tag for data URLs to avoid Next.js optimization issues
          <img
            src={previewImage}
            alt={draft.name || "Draft Preview"}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={() => {
              if (!imageErrorRef.current) {
                imageErrorRef.current = true;
                setImageError(true);
              }
            }}
          />
        ) : (
          <Image
            src={previewImage}
            alt={draft.name || "Draft Preview"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            loading={
              previewImage === "/images/home/coin-design.png" ? "eager" : "lazy"
            }
            onError={() => {
              // Prevent infinite loops by tracking error state
              if (!imageErrorRef.current) {
                imageErrorRef.current = true;
                setImageError(true);
              }
            }}
          />
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        {/* Draft Badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#1a2a3a] text-white shadow-md">
            DRAFT
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title and Type */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
            {draft.name || "Untitled Draft"}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FileText className="h-3.5 w-3.5" />
            <span className="uppercase tracking-wide">
              {draft.generatorPrompt || draft.generatorImage
                ? "AI Generator"
                : "Standard Builder"}
            </span>
          </div>
        </div>

        {/* Metadata */}
        <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">
              Last saved: {formatDate(draft.updatedAt)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">
              Created: {formatDate(draft.createdAt)}
            </span>
          </div>
          {draft.totalCoins && draft.totalCoins > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span>
                {draft.totalCoins} {draft.totalCoins === 1 ? "Coin" : "Coins"}
              </span>
            </div>
          )}
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg mt-auto">
            <p className="text-sm text-red-800 mb-3 font-medium">
              Are you sure you want to delete this draft? This action cannot be
              undone.
            </p>
            <div className="flex gap-2">
              <Button
                variant="ternary"
                onClick={handleConfirmDelete}
                disabled={deleteDraftMutation.isPending}
                className="!bg-red-600 !text-white hover:!bg-red-700 text-sm px-4 py-2 flex-1"
                width="w-auto"
              >
                {deleteDraftMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
              <Button
                variant="ternary"
                onClick={handleCancelDelete}
                disabled={deleteDraftMutation.isPending}
                className="text-sm px-4 py-2 flex-1"
                width="w-auto"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!showDeleteConfirm && (
          <div className="space-y-2 pt-2 mt-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={handleView}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#1a2a3a] text-white hover:bg-[#2a3a4a] transition-colors text-sm font-medium shadow-sm cursor-pointer"
                title="View"
              >
                <Eye className="h-4 w-4" />
                <span>View</span>
              </button>
              <button
                onClick={handleEdit}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm font-medium cursor-pointer"
                title="Edit"
              >
                <Edit2 className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDeleteClick}
                disabled={deleteDraftMutation.isPending}
                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {onSubmit && (
              <button
                onClick={handleSubmit}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#121C2A] via-[#193359] to-[#244978] text-white hover:from-[#193359] hover:via-[#244978] hover:to-[#2d5b94] transition-all text-sm font-semibold shadow-md hover:shadow-lg cursor-pointer"
                title="Submit Draft"
              >
                <Send className="h-4 w-4" />
                <span>Submit for Quote</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DraftCard;
