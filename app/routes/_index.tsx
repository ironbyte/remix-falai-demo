import * as fal from "@fal-ai/serverless-client";
import type { MetaFunction } from "@remix-run/node";
import { useState, useMemo } from "react";

import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

fal.config({
  proxyUrl: "/fal/proxy",
});

const DEFAULT_PROMPT = "Anthropomorphic cat dressed as a pilot";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix x Fal.ai Demo" },
    { name: "description", content: "Welcome!" },
  ];
};

export default function Index() {
  // Input state
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT);
  // Result state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<unknown>(null);

  const image = useMemo(() => {
    if (!result) {
      return null;
    }

    // @ts-expect-error Laziness
    return result.images[0];
  }, [result]);

  const reset = () => {
    setLoading(false);
    setResult(null);
  };

  const generateImage = async () => {
    reset();
    setLoading(true);
    try {
      const result = await fal.subscribe("110602490-lora", {
        input: {
          prompt,
          model_name: "stabilityai/stable-diffusion-xl-base-1.0",
          image_size: "square_hd",
        },
        pollInterval: 1000,
        logs: true,
        onQueueUpdate(update) {
          console.log(update);
        },
      });
      setResult(result);
    } catch (error: unknown) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center gap-2 flex-col py-4">
      <h1 className="text-fuchsia-600 text-4xl font-bold">Remix + Fal.ai</h1>
      <div className="w-2/3 space-y-6">
        <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <Button onClick={generateImage} variant="secondary">
          Generate
        </Button>
      </div>
      <div>
        {loading && <div>Loading...</div>}
        {image && (
          <div>
            <img src={image.url} alt="" width={750} height={750} />
          </div>
        )}
      </div>
    </div>
  );
}
