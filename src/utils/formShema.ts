import { z } from "zod";


export const formSchema = z.object({
  // Basic Information
  coinShape: z.string().min(1, "Coin shape is required"),
  subject: z.string().min(1, "Subject is required"),
  metalFinishes: z.string().min(1, "Metal finish is required"),
  coinStyles: z.string().min(1, "Coin style is required"),
  detailLevel: z.string().min(1, "Detail level is required"),


  // Front Side
  frontDescription: z.string().min(1, "Front description is required"),
  frontReferenceImage: z.instanceof(File).nullable().optional(),
  frontReferenceImageImpact: z.string().optional(),
  frontTextInsideArtwork: z.string().optional(),
  frontTextStyle: z.string().optional(),
  frontCompositionNotes: z.string().optional(),


  // Back Side
  backDescription: z.string().min(1, "Back description is required"),
  backReferenceImage: z.instanceof(File).nullable().optional(), // ✅ FIXED
  backReferenceImageImpact: z.string().optional(),
  backTextInsideArtwork: z.string().optional(),
  backTextStyle: z.string().optional(),
  backCompositionNotes: z.string().optional(),


  // Additional Information
  prohibitedContent: z.string().optional(),
});


export type FormValues = z.infer<typeof formSchema>;