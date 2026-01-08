"use client";
import React from "react";
import {
  useSavedPaymentMethods,
  useSetDefaultPaymentMethod,
  useDeleteSavedPaymentMethod,
} from "@/src/hooks/useQueries";
import { toast } from "react-toastify";
import Button from "../common/button/Button";
import type { SavedPaymentMethod } from "@/src/types/paymentPreferences";

interface ManagePaymentMethodsProps {
  onMethodSelected?: (methodId: string) => void;
  showSelection?: boolean;
}

const ManagePaymentMethods: React.FC<ManagePaymentMethodsProps> = ({
  onMethodSelected,
  showSelection = false,
}) => {
  const {
    data: methodsData,
    isLoading,
    error,
    refetch,
  } = useSavedPaymentMethods();

  const { mutate: setDefault, isPending: isSettingDefault } =
    useSetDefaultPaymentMethod({
      onSuccess: () => {
        toast.success("Default payment method updated");
        refetch();
      },
      onError: (error) => {
        const msg = error instanceof Error ? error.message : String(error);
        toast.error(msg || "Failed to set default payment method");
      },
    });

  const { mutate: deleteMethod, isPending: isDeleting } =
    useDeleteSavedPaymentMethod({
      onSuccess: () => {
        toast.success("Payment method deleted successfully");
        refetch();
      },
      onError: (error) => {
        const msg = error instanceof Error ? error.message : String(error);
        toast.error(msg || "Failed to delete payment method");
      },
    });

  const handleSetDefault = (methodId: string) => {
    setDefault(methodId);
  };

  const handleDelete = (methodId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this payment method? This action cannot be undone.",
      )
    ) {
      deleteMethod(methodId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading payment methods...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 text-sm">
          Failed to load payment methods. Please try again.
        </p>
      </div>
    );
  }

  const methods = methodsData?.data || [];

  if (methods.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">
          No saved payment methods. You can save your card after completing a
          payment.
        </p>
      </div>
    );
  }

  return (
    <div className="manage-payment-methods">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Saved Payment Methods
      </h2>

      <div className="space-y-3">
        {methods.map((method: SavedPaymentMethod) => (
          <div
            key={method.id}
            className="payment-method-item border rounded-lg p-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {showSelection && (
                    <input
                      type="radio"
                      name="selectedPaymentMethod"
                      value={method.id}
                      onChange={() => {
                        if (onMethodSelected) {
                          onMethodSelected(method.id);
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                  )}
                  <div>
                    <span className="font-medium text-gray-900">
                      {method.brand?.toUpperCase() || "Card"} ••••{" "}
                      {method.last4}
                    </span>
                    {method.isDefault && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                        Default
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Added on {new Date(method.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!method.isDefault && (
                  <Button
                    variant="ternary"
                    onClick={() => handleSetDefault(method.id)}
                    disabled={isSettingDefault}
                    className="text-xs px-3 py-1 rounded-full !bg-gray-100 hover:!bg-gray-200"
                  >
                    Set as Default
                  </Button>
                )}
                <Button
                  variant="ternary"
                  onClick={() => handleDelete(method.id)}
                  disabled={isDeleting}
                  className="text-xs px-3 py-1 rounded-full !bg-red-100 hover:!bg-red-200 text-red-700"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagePaymentMethods;
