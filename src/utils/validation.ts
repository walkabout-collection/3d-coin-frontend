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

// --- AI Generation Validation Utilities ---

export interface AIGenerationValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate prompt for AI generation
 */
export const validateAIGenerationPrompt = (
  prompt: string,
): AIGenerationValidationResult => {
  const errors: string[] = [];

  if (!prompt || prompt.trim().length === 0) {
    errors.push("Prompt is required");
  } else {
    const trimmed = prompt.trim();
    if (trimmed.length < 10) {
      errors.push("Prompt must be at least 10 characters long");
    }
    if (trimmed.length > 1000) {
      errors.push("Prompt must not exceed 1000 characters");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate image file for AI generation
 */
export const validateAIGenerationImageFile = (
  file: File | null,
): AIGenerationValidationResult => {
  const errors: string[] = [];

  if (!file) {
    return { isValid: true, errors: [] }; // File is optional
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    errors.push("Image file size must not exceed 10MB");
  }

  // Check file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    errors.push("Image must be in JPG, PNG, or WebP format");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate image dimensions
 */
export const validateAIGenerationImageDimensions = async (
  file: File,
): Promise<AIGenerationValidationResult> => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const maxDimension = 4096;

      if (img.width > maxDimension || img.height > maxDimension) {
        resolve({
          isValid: false,
          errors: [
            `Image dimensions must not exceed ${maxDimension}x${maxDimension}`,
          ],
        });
      } else {
        resolve({ isValid: true, errors: [] });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        isValid: false,
        errors: ["Failed to load image"],
      });
    };

    img.src = url;
  });
};

/**
 * Validate image URL
 */
export const validateAIGenerationImageUrl = (
  url: string,
): AIGenerationValidationResult => {
  const errors: string[] = [];

  if (!url || url.trim().length === 0) {
    return { isValid: true, errors: [] }; // URL is optional
  }

  try {
    const parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      errors.push("Image URL must use HTTP or HTTPS");
    }
  } catch {
    errors.push("Invalid image URL format");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate all inputs for AI generation
 */
export const validateAIGenerationInput = async (
  prompt?: string,
  imageFile?: File | null,
  imageUrl?: string,
): Promise<AIGenerationValidationResult> => {
  const errors: string[] = [];

  // At least one input required
  if (!prompt && !imageFile && !imageUrl) {
    errors.push("At least one of prompt, image file, or image URL is required");
    return { isValid: false, errors };
  }

  // Validate prompt
  if (prompt) {
    const promptValidation = validateAIGenerationPrompt(prompt);
    if (!promptValidation.isValid) {
      errors.push(...promptValidation.errors);
    }
  }

  // Validate image file
  if (imageFile) {
    const fileValidation = validateAIGenerationImageFile(imageFile);
    if (!fileValidation.isValid) {
      errors.push(...fileValidation.errors);
    } else {
      // Validate dimensions
      const dimensionValidation =
        await validateAIGenerationImageDimensions(imageFile);
      if (!dimensionValidation.isValid) {
        errors.push(...dimensionValidation.errors);
      }
    }
  }

  // Validate image URL
  if (imageUrl) {
    const urlValidation = validateAIGenerationImageUrl(imageUrl);
    if (!urlValidation.isValid) {
      errors.push(...urlValidation.errors);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
