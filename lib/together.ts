import { OpenAI } from "openai";

export const client = new OpenAI({
  baseURL: "https://api.together.xyz/v1",
  apiKey: process.env.TOGETHER_API_KEY,
});

const DEFAULT_PROMPT = "Extract all readable text from this image and format it as clean, well-structured Markdown. Preserve any formatting, headings, lists, or structure you can identify. If there are tables, format them as Markdown tables. Return only the extracted text in Markdown format.";

export async function ocrTextFromImage(imageUrl: string): Promise<string> {
  try {
    const response = await client.chat.completions.create({
      model: "meta-llama/Llama-Vision-Free",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: DEFAULT_PROMPT
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      max_tokens: 4000,
      temperature: 0.1,
    });

    return response.choices[0]?.message?.content || "No text could be extracted from the image.";
  } catch (error) {
    console.error("OCR Error:", error);
    throw new Error("Failed to extract text from image");
  }
}

interface CustomSettings {
  provider: string;
  apiKey: string;
  model: string;
  customEndpoint?: string | null;
  prompt: string;
}

export async function ocrWithCustomSettings(imageUrl: string, settings: CustomSettings): Promise<string> {
  try {
    let customClient: OpenAI;

    // Configure client based on provider
    switch (settings.provider) {
      case 'together':
        customClient = new OpenAI({
          baseURL: 'https://api.together.xyz/v1',
          apiKey: settings.apiKey,
        });
        break;
      
      case 'groq':
        customClient = new OpenAI({
          baseURL: 'https://api.groq.com/openai/v1',
          apiKey: settings.apiKey,
        });
        break;
      
      case 'openai':
        customClient = new OpenAI({
          apiKey: settings.apiKey,
        });
        break;
      
      case 'custom':
        if (!settings.customEndpoint) {
          throw new Error('Custom endpoint is required for custom provider');
        }
        customClient = new OpenAI({
          baseURL: settings.customEndpoint,
          apiKey: settings.apiKey,
        });
        break;
      
      default:
        throw new Error(`Unsupported provider: ${settings.provider}`);
    }

    const response = await customClient.chat.completions.create({
      model: settings.model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: settings.prompt || DEFAULT_PROMPT
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      max_tokens: 4000,
      temperature: 0.1,
    });

    return response.choices[0]?.message?.content || "No text could be extracted from the image.";
  } catch (error) {
    console.error("Custom OCR Error:", error);
    throw new Error(`Failed to extract text from image using ${settings.provider}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}