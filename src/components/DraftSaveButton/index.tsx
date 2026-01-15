"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSaveDraft, useUpdateDraft } from "@/src/hooks/useQueries";
import Button from "@/src/components/common/button/Button";
import { Save, Loader2, Check } from "lucide-react";
import { toast } from "react-toastify";
import { SaveDraftRequest } from "@/src/services/apiServices";

interface DraftSaveButtonProps {
  draftId?: string | null; // If provided, will update; otherwise creates new
  designData: SaveDraftRequest;
  onSuccess?: (draftId: string) => void;
  autoSave?: boolean; // Enable auto-save
  autoSaveInterval?: number; // Auto-save interval in ms (default: 30000)
  className?: string;
  variant?: "primary" | "secondary" | "ternary";
}

const DraftSaveButton: React.FC<DraftSaveButtonProps> = ({
  draftId,
  designData,
  onSuccess,
  autoSave = false,
  autoSaveInterval = 30000,
  className = "",
  variant = "ternary",
}) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveDraft = useSaveDraft({
    onSuccess: (data) => {
      setLastSaved(new Date());
      if (onSuccess && data.id) {
        onSuccess(data.id);
      }
    },
  });
  const updateDraft = useUpdateDraft({
    onSuccess: () => {
      setLastSaved(new Date());
    },
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastDataRef = useRef<string>("");

  // Compare current data with last saved to avoid unnecessary saves
  const getDataHash = (data: SaveDraftRequest): string => {
    return JSON.stringify(data);
  };

  const handleSave = useCallback(
    async (silent: boolean = false) => {
      try {
        if (draftId) {
          // Update existing draft
          await updateDraft.mutateAsync({
            draftId,
            data: designData,
          });
          if (!silent) {
            toast.success("Draft updated successfully");
          }
        } else {
          // Create new draft
          const newDraft = await saveDraft.mutateAsync(designData);
          if (!silent) {
            toast.success("Draft saved successfully");
          }
          if (onSuccess && newDraft.id) {
            onSuccess(newDraft.id);
          }
        }
        setLastSaved(new Date());
        lastDataRef.current = getDataHash(designData);
      } catch (error: unknown) {
        if (!silent) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to save draft";
          toast.error(errorMessage);
        }
      }
    },
    [draftId, designData, updateDraft, saveDraft, onSuccess],
  );

  // Auto-save effect
  useEffect(() => {
    if (!autoSave || !draftId) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const currentHash = getDataHash(designData);
    if (currentHash === lastDataRef.current) {
      return; // No changes, skip save
    }

    const intervalFn = () => {
      const hash = getDataHash(designData);
      if (hash !== lastDataRef.current) {
        handleSave(true); // Silent save
        lastDataRef.current = hash;
      }
    };

    intervalRef.current = setInterval(intervalFn, autoSaveInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSave, draftId, autoSaveInterval, handleSave]); // designData is captured in handleSave closure

  const isSaving = saveDraft.isPending || updateDraft.isPending;

  // Format time ago
  const formatTimeAgo = (date: Date): string => {
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
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        onClick={() => handleSave(false)}
        disabled={isSaving}
        variant={variant}
        type="button"
        className="flex items-center gap-2"
      >
        {isSaving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            <span>{draftId ? "Update Draft" : "Save Draft"}</span>
          </>
        )}
      </Button>
      {lastSaved && (
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Check className="h-3 w-3" />
          Saved {formatTimeAgo(lastSaved)}
        </span>
      )}
      {autoSave && draftId && (
        <span className="text-xs text-gray-400">Auto-saving...</span>
      )}
    </div>
  );
};

export default DraftSaveButton;
