import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Eye, ImagePlus, Send, X } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function VisionService() {
  const [prompt, setPrompt] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submittedPrompt, setSubmittedPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setResponse("");
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const analyzeImage = async () => {
    if (!imageFile) {
      toast.error("Upload an image first");
      return;
    }

    const trimmedPrompt = prompt.trim();
    const formData = new FormData();
    formData.append("image", imageFile);
    if (trimmedPrompt) formData.append("prompt", trimmedPrompt);

    try {
      setLoading(true);
      setResponse("");
      setSubmittedPrompt(trimmedPrompt || "Describe this image in detail");

      const res = await fetch("/api/vision", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Unable to analyze image");
      }

      setResponse(data.response);
      setPrompt("");
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Unable to analyze image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full max-h-screen flex-col p-6">
      <h1 className="mb-6 text-3xl font-bold">Vision Service</h1>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex justify-start">
          <Card className="max-w-xl p-3">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Eye className="size-5 shrink-0" />
              <p className="text-sm">
                Upload an image and ask what you want to understand about it.
              </p>
            </div>
          </Card>
        </div>

        {imagePreview && (
          <div className="mt-4 flex justify-end">
            <Card className="max-w-xl p-3">
              <img
                src={imagePreview}
                alt={imageFile?.name || "Uploaded image"}
                className="max-h-[320px] w-full rounded-lg object-contain"
              />
              <p className="mt-2 truncate text-xs text-muted-foreground">
                {imageFile?.name}
              </p>
            </Card>
          </div>
        )}

        {submittedPrompt && (
          <div className="mt-4 flex justify-end">
            <Card className="max-w-xl p-3">
              <p className="text-sm">{submittedPrompt}</p>
            </Card>
          </div>
        )}

        {loading && (
          <div className="mt-4 flex justify-start">
            <Card className="max-w-xl bg-gray-900 p-3 text-white">
              <div className="flex gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
              </div>
            </Card>
          </div>
        )}

        {response && (
          <div className="mt-4 flex justify-start">
            <Card className="prose max-w-xl p-3 dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {response}
              </ReactMarkdown>
            </Card>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t p-4">
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            <ImagePlus className="size-4" />
            {imageFile ? "Change Image" : "Upload Image"}
          </Button>

          {imageFile && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearImage}
              disabled={loading}
              aria-label="Remove image"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Ask about the image..."
            value={prompt}
            disabled={loading}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && analyzeImage()}
          />

          <Button onClick={analyzeImage} disabled={loading || !imageFile}>
            <Send className="size-4" />
            {loading ? "Analyzing..." : "Analyze"}
          </Button>
        </div>
      </div>
    </div>
  );
}
