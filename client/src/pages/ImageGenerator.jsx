import { useState } from "react";
import { puter } from "@heyputer/puter.js";
import { ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;

    try {
      setLoading(true);
      setGeneratedPrompt(trimmedPrompt);

      // Generate image
      const imageElement = await puter.ai.txt2img(trimmedPrompt, {
        model: "gemini-2.5-flash-image-preview",
      });

      // Extract image src
      const imageUrl = imageElement.src;

      setImage(imageUrl);
      setPrompt("");

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen max-h-screen flex-col p-6">
      <h1 className="mb-6 text-3xl font-bold">
        AI Image Generator
      </h1>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex justify-start">
          <Card className="max-w-xl p-3">
            <div className="flex items-center gap-3 text-muted-foreground">
              <ImageIcon className="size-5 shrink-0" />
              <p className="text-sm">
                Enter a prompt below to generate an image.
              </p>
            </div>
          </Card>
        </div>

        {generatedPrompt && (
          <div className="mt-4 flex justify-end">
            <Card className="max-w-xl p-3">
              <p className="text-sm">{generatedPrompt}</p>
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

        {image && (
          <div className="mt-4 flex justify-start">
            <Card className="max-w-xl p-3">
              <img
                src={image}
                alt={generatedPrompt || "Generated image"}
                className="max-h-[420px] w-full rounded-lg object-contain"
              />
            </Card>
          </div>
        )}
      </div>

      <div className="flex gap-2 border-t p-4">
        <Input
          placeholder="Generate an image..."
          value={prompt}
          disabled={loading}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generateImage()}
        />

        <Button
          onClick={generateImage}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate"}
        </Button>
      </div>
    </div>
  );
}
