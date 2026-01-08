/**
 * Validate payment amount matches quote amount
 */
export const validatePaymentAmount = (
  amount: number,
  quoteAmount: number,
  tolerance: number = 0.01,
): { valid: boolean; error?: string } => {
  if (isNaN(amount) || amount <= 0) {
    return { valid: false, error: "Amount must be a positive number" };
  }

  if (Math.abs(amount - quoteAmount) > tolerance) {
    return {
      valid: false,
      error: `Amount must match quote amount ($${quoteAmount.toFixed(2)})`,
    };
  }

  return { valid: true };
};

/**
 * Validate payment proof image
 */
export const validatePaymentProof = (
  proof: string | File | null,
): { valid: boolean; error?: string } => {
  if (!proof) {
    return { valid: false, error: "Payment proof is required" };
  }

  if (typeof proof === "string") {
    // Base64 string validation
    if (!proof.startsWith("data:image/")) {
      return {
        valid: false,
        error: "Payment proof must be a valid image file",
      };
    }

    // Check file size (approximate, base64 is ~33% larger)
    const base64Length = proof.length;
    const estimatedSize = (base64Length * 3) / 4;
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (estimatedSize > maxSize) {
      return {
        valid: false,
        error: "Image size must be less than 5MB",
      };
    }
  } else if (proof instanceof File) {
    // File validation
    if (!proof.type.startsWith("image/")) {
      return { valid: false, error: "Please upload an image file" };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (proof.size > maxSize) {
      return {
        valid: false,
        error: "Image size must be less than 5MB",
      };
    }
  }

  return { valid: true };
};

/**
 * Validate file before upload
 */
export const validateFile = (
  file: File,
): { valid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith("image/")) {
    return {
      valid: false,
      error: "Please select an image file (JPG, PNG, etc.)",
    };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File size must be less than 5MB. Please compress the image.",
    };
  }

  // Check file extension
  const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const fileExtension = file.name
    .toLowerCase()
    .substring(file.name.lastIndexOf("."));
  if (!validExtensions.includes(fileExtension)) {
    return {
      valid: false,
      error: "Invalid file type. Please use JPG, PNG, GIF, or WEBP.",
    };
  }

  return { valid: true };
};
