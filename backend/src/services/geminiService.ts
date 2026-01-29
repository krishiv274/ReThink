import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY not found");
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export interface GenerateIdeasInput {
  imageUrl: string;
  title: string;
  material: string;
}

export interface GeneratedIdeas {
  ideas: string[];
  difficulties: string[];
  analyzed: boolean;
}

export async function generateReuseIdeas(
  input: GenerateIdeasInput
): Promise<GeneratedIdeas> {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const { title, material, imageUrl } = input;

      // ---- 1. Load Image ----
      const { imageBase64, mimeType } = await loadImage(imageUrl);

      // ---- 2. Build Prompt ----
      const prompt = buildPrompt(title, material);

      // ---- 3. Create Model ----
      const model = getGenAI().getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2000,
        },
      });

      // ---- 4. Call Gemini w/ timeout ----
      const result = await callGeminiWithTimeout(model, prompt, mimeType, imageBase64);

      // ---- 5. Parse Output ----
      const text = result.response.text();
      if (!text) throw new Error("Empty Gemini response");

      const { ideas, difficulties } = parseIdeasFromText(text);

      return {
        ideas,
        difficulties,
        analyzed: true,
      };
    } catch (err) {
      lastError = err as Error;
      console.error(`❌ Error on attempt ${attempt + 1}:`, lastError);

      if (attempt < maxRetries) {
        const backoff = 2000 * (attempt + 1);
        await sleep(backoff);
      }
    }
  }

  console.error("❌ All retries failed:", lastError);
  const fallback = getFallbackIdeas(input.material);

  return {
    ideas: fallback,
    difficulties: fallback.map(() => "Medium"),
    analyzed: false,
  };
}

//
// ------------------------------------------------------------
// Helper Functions
// ------------------------------------------------------------
//

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loadImage(imageUrl: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(imageUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`Image fetch failed: ${res.statusText}`);

    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    let mime = res.headers.get("content-type") || "";

    if (!mime.startsWith("image/")) {
      const ext = imageUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)?.[1];
      mime = `image/${ext === "jpg" ? "jpeg" : ext || "jpeg"}`;
    }

    return { imageBase64: base64, mimeType: mime };
  } catch (e) {
    throw new Error("Image load error: " + (e as Error).message);
  }
}

function buildPrompt(title: string, material: string) {
  return `
You are an expert sustainability consultant and creative upcycling specialist. 

TASK: Analyze the image and the item details to generate 5 innovative reuse ideas.

ITEM DETAILS:
- Name: "${title}"
- Material Type: ${material}

INSTRUCTIONS:
Look at the actual image. Consider size, shape, material, condition, and unique features.

Generate EXACTLY 5 creative reuse ideas. Each one must:
- Reference visible features of the item
- Include a 5–10 word title
- Provide 2–3 sentences of instructions
- Be doable at home with basic tools
- Include (Difficulty: Easy/Medium/Hard)

FORMAT EXACTLY:
1. **[Title]** (Difficulty: Easy/Medium/Hard)
[Explanation...]

2. **[Title]** (Difficulty: ...)

Start IMMEDIATELY with idea 1. No introduction.
`;
}

async function callGeminiWithTimeout(model: any, prompt: string, mimeType: string, imageBase64: string) {
  const apiCall = model.generateContent([
    prompt,
    {
      inlineData: { mimeType, data: imageBase64 },
    },
  ]);

  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("⏳ Gemini API timeout (30s)")), 30_000)
  );

  return Promise.race([apiCall, timeout]) as Promise<any>;
}

//
// ------------------------------------------------------------
// PARSER
// ------------------------------------------------------------
//

function parseIdeasFromText(text: string) {
  const ideas: string[] = [];
  const difficulties: string[] = [];

  const parts = text.split(/\d+\.\s+/).filter((p) => p.trim().length > 0);

  for (const part of parts.slice(0, 5)) {
    const diff = part.match(/\(Difficulty:\s*(Easy|Medium|Hard)\)/i)?.[1] || "Medium";
    const title = part.match(/\*\*([^*]+)\*\*/)?.[1] || "Untitled Idea";

    const desc = part
      .replace(/\*\*[^*]+\*\*/, "")
      .replace(/\(Difficulty:\s*(Easy|Medium|Hard)\)/i, "")
      .trim();

    ideas.push(`**${title}**\n${desc}`);
    difficulties.push(diff);
  }

  return { ideas, difficulties };
}

//
// ------------------------------------------------------------
// FALLBACK IDEAS (unchanged from your version)
// ------------------------------------------------------------
//

function getFallbackIdeas(material: string): string[] {
  const fallbackIdeasMap: { [key: string]: string[] } = {
    Plastic: [
      "Transform into a self-watering planter by cutting ...",
      "Create a DIY bird feeder with openings on each side...",
      "Make a storage container for small items...",
      "Craft a phone charging station with cable slot...",
      "Build a mini greenhouse for seedlings...",
    ],
  };

  return fallbackIdeasMap[material] || fallbackIdeasMap["Plastic"];
}

export default { generateReuseIdeas };
