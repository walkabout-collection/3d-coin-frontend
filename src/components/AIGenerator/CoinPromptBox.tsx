// "use client";
// import React, { useState } from "react";
// import Button from "../common/button/Button";
// import { Paperclip } from "lucide-react";
// import Image from "next/image";
// import ChatbotDrawer from "./ChatbotDrawer";
// import { chatbotQuestions, initialChatbotState } from "./data";
// import { z } from "zod";
// import { toast } from "react-toastify";
// import { useGenerateFromPrompt } from "@/src/hooks/useQueries";

// interface CoinPromptBoxProps {
//   onGenerate: (variants?: string[]) => void;
// }

// interface ChatbotState {
//   isDrawerOpen: boolean;
// }

// const imageSchema = z.instanceof(File, { message: "Please upload an image" });

// const CoinPromptBox: React.FC<CoinPromptBoxProps> = ({ onGenerate }) => {
//   const [uploadedImage, setUploadedImage] = useState<File | null>(null);
//   const [previewImage, setPreviewImage] = useState<string | null>(null);
//   const [chatbotState, setChatbotState] =
//     useState<ChatbotState>(initialChatbotState);
//   const [error, setError] = useState<{ message: string } | undefined>(
//     undefined
//   );
//   const [prompt, setPrompt] = useState("");

//   const { mutate: generateFromPromptMutate, isPending: isGenerating } =
//     useGenerateFromPrompt({
//       onSuccess: (data) => {
//         toast.success("Generated successfully!");
//         setError(undefined);
//         onGenerate(data.variants);
//       },
//       onError: () => {
//         setError({
//           message: "Failed to generate from prompt. Please try again.",
//         });
//         toast.error("Failed to generate from prompt.");
//       },
//     });

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setUploadedImage(file);

//       const imageUrl = URL.createObjectURL(file);
//       setPreviewImage(imageUrl);

//       setError(undefined);
//     } else {
//       setUploadedImage(null);
//       setPreviewImage(null);
//     }
//   };

//   // Toggle chatbot drawer
//   const handleChatbotClick = () => {
//     setChatbotState((prev) => ({
//       ...prev,
//       isDrawerOpen: !prev.isDrawerOpen,
//     }));
//   };

//   const handleGenerateClick = () => {
//     const validation = imageSchema.safeParse(uploadedImage);

//     if (prompt.trim().length > 0 || validation.success) {
//       setError(undefined);

//       generateFromPromptMutate({
//         prompt,
//         imageUrl: previewImage || "",
//       });
//     } else {
//       setError({
//         message: "Please provide a prompt or upload an image to generate.",
//       });
//     }
//   };

//   // Handle question insertion from chatbot drawer
//   const handleQuestionInsert = (question: string) => {
//     setPrompt(question);
//     setChatbotState({ ...chatbotState, isDrawerOpen: false });
//   };

//   return (
//     <div className="relative">
//       <div className="py-16 min-h-screen text-center max-w-2xl mx-auto">
//         <h2 className="text-4xl font-semibold mb-6 mt-8">
//           START YOUR JOURNEY OF COLLECTING UNIQUE COINS, ONE POCKET AT A TIME
//         </h2>

//         <div className="flex flex-col">
//           <div className="relative mb-8 mt-10">
//             <div className="w-full border-2 border-yellow-500 shadow-lg shadow-yellow-400/20 rounded-xl p-4 text-left">
//               {previewImage && (
//                 <div className="mb-3">
//                   <Image
//                     src={previewImage || "/placeholder.png"}
//                     alt="Attached Preview"
//                     width={64}
//                     height={64}
//                     className="object-cover rounded-md border border-gray-300 shadow"
//                   />
//                 </div>
//               )}

//               {/* Textarea */}
//               <textarea
//                 className="w-full bg-transparent outline-none resize-none text-lg placeholder-gray-400"
//                 placeholder="Ask anything…"
//                 rows={4}
//                 value={prompt}
//                 onChange={(e) => setPrompt(e.target.value)}
//               />
//             </div>

//             {/* Actions */}
//             <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
//               <button
//                 className="mt-5 flex items-center gap-2 bg-gray-200 hover:bg-yellow-400 hover:text-black text-gray-700 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer"
//                 onClick={() => document.getElementById("image-upload")?.click()}
//               >
//                 <Paperclip size={16} />
//                 <span className="text-sm font-medium">Attach</span>
//               </button>

//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 className="hidden"
//                 id="image-upload"
//               />

//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={handleChatbotClick}
//                   className="hover:scale-105 transition-transform duration-200"
//                 >
//                   <Image
//                     src="/images/home/bot-icon.svg"
//                     alt="Chatbot Assistant"
//                     width={48}
//                     height={48}
//                     className="cursor-pointer mt-5"
//                   />
//                 </button>

//                 <Button
//                   onClick={handleGenerateClick}
//                   type="button"
//                   variant="primary"
//                   className="mt-5 max-w-[120px] w-full text-sm font-base items-center justify-center flex mx-auto"
//                   disabled={isGenerating}
//                 >
//                   {isGenerating ? "Processing..." : "GENERATE"}
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {error && (
//             <div className="mt-1 text-red-500 text-sm" aria-live="polite">
//               <span>{error.message}</span>
//             </div>
//           )}
//         </div>
//       </div>

//       <ChatbotDrawer
//         isOpen={chatbotState.isDrawerOpen}
//         onClose={handleChatbotClick}
//         questions={chatbotQuestions.questions}
//         onQuestionClick={handleQuestionInsert}
//       />
//     </div>
//   );
// };

// export default CoinPromptBox;



"use client";
import React, { useState } from "react";
import Button from "../common/button/Button";
import { Paperclip } from "lucide-react";
import Image from "next/image";
import ChatbotDrawer from "./ChatbotDrawer";
import { chatbotQuestions, initialChatbotState } from "./data";
import { z } from "zod";
import { toast } from "react-toastify";
import { useUploadImage } from "@/src/hooks/useQueries";
import { useCoinStore } from "@/src/store/useCoinStore";

interface CoinPromptBoxProps {
  onGenerate?: (variants?: string[]) => void;
}

interface ChatbotState {
  isDrawerOpen: boolean;
}

const imageSchema = z.instanceof(File, { message: "Please upload an image" });

const base64ToFile = (base64String: string, fileName: string): File => {
  const matches = base64String.match(/^data:(.*?);base64,(.*)$/);
  if (!matches) {
    throw new Error("Invalid base64 string");
  }
  const mime = matches[1];
  const data = matches[2];
  const byteString = atob(data);
  const n = byteString.length;
  const u8arr = new Uint8Array(n);

  for (let i = 0; i < n; i++) {
    u8arr[i] = byteString.charCodeAt(i);
  }

  return new File([u8arr], fileName, { type: mime });
};

const CoinPromptBox: React.FC<CoinPromptBoxProps> = ({ onGenerate }) => {
  const { coinImages, addCoinImage } = useCoinStore();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [chatbotState, setChatbotState] =
    useState<ChatbotState>(initialChatbotState);
  const [error, setError] = useState<{ message: string } | undefined>(undefined);
  const [prompt, setPrompt] = useState("");

  const { mutate: uploadImageMutate, isPending: isGenerating } = useUploadImage(
    {
      onSuccess: (res) => {
        toast.success("Generated successfully!");
        setError(undefined);

        const file = res.data?.data?.buffer;
        if (file instanceof File) {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            addCoinImage(base64);
            setPreviewImage(base64);
            if (onGenerate) onGenerate([base64]); 
          };
          reader.readAsDataURL(file);
        } else {
          console.error("No buffer returned from API");
        }
      },
      onError: () => {
        setError({ message: "Failed to generate from prompt. Please try again." });
        toast.error("Failed to generate from prompt.");
      },
    }
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setError(undefined);
    } else {
      setUploadedFile(null);
      setPreviewImage(null);
    }
  };

  const handleGenerateClick = () => {
    if (!prompt.trim() && !uploadedFile && !previewImage) {
      setError({ message: "Please provide a prompt or upload an image." });
      return;
    }

    let fileToSend: File | undefined;
    if (previewImage && previewImage.startsWith("data:")) {
      fileToSend = base64ToFile(previewImage, "preview.png");
    } else if (uploadedFile) {
      fileToSend = uploadedFile;
    }

    uploadImageMutate({ image: fileToSend, prompt });
  };

  const handleChatbotClick = () => {
    setChatbotState((prev) => ({ ...prev, isDrawerOpen: !prev.isDrawerOpen }));
  };

  const handleQuestionInsert = (question: string) => {
    setPrompt(question);
    setChatbotState({ ...chatbotState, isDrawerOpen: false });
  };

  return (
    <div className="relative">
      <div className="py-16 min-h-screen text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-semibold mb-6 mt-8">
          START YOUR JOURNEY OF COLLECTING UNIQUE COINS, ONE POCKET AT A TIME
        </h2>

        <div className="flex flex-col">
          <div className="relative mb-8 mt-10">
            <div className="w-full border-2 border-yellow-500 shadow-lg shadow-yellow-400/20 rounded-xl p-4 text-left">
              {previewImage && (
                <div className="mb-3">
                  <Image
                    src={previewImage}
                    alt="Attached Preview"
                    width={64}
                    height={64}
                    className="object-cover rounded-md border border-gray-300 shadow"
                  />
                </div>
              )}

              <textarea
                className="w-full bg-transparent outline-none resize-none text-lg placeholder-gray-400"
                placeholder="Ask anything…"
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <button
                className="mt-5 flex items-center gap-2 bg-gray-200 hover:bg-yellow-400 hover:text-black text-gray-700 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                <Paperclip size={16} />
                <span className="text-sm font-medium">Attach</span>
              </button>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
              />

              <div className="flex items-center gap-2">
                <button
                  onClick={handleChatbotClick}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <Image
                    src="/images/home/bot-icon.svg"
                    alt="Chatbot Assistant"
                    width={48}
                    height={48}
                    className="cursor-pointer mt-5"
                  />
                </button>

                <Button
                  onClick={handleGenerateClick}
                  type="button"
                  variant="primary"
                  className="mt-5 max-w-[120px] w-full text-sm font-base items-center justify-center flex mx-auto"
                  disabled={isGenerating}
                >
                  {isGenerating ? "Processing..." : "GENERATE"}
                </Button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-1 text-red-500 text-sm" aria-live="polite">
              <span>{error.message}</span>
            </div>
          )}
        </div>
      </div>

      <ChatbotDrawer
        isOpen={chatbotState.isDrawerOpen}
        onClose={handleChatbotClick}
        questions={chatbotQuestions.questions}
        onQuestionClick={handleQuestionInsert}
      />
    </div>
  );
};

export default CoinPromptBox;
