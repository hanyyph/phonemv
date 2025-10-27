// Fix: Changed from `import type` to a static import to adhere to the Gemini API coding guidelines.
// This simplifies the module and removes the need for dynamic imports.
import { GoogleGenAI, Type } from "@google/genai";

// Module-level cache for the initialized client.
// `undefined` is the initial state, `null` means initialization was attempted but failed or had no key.
let ai: GoogleGenAI | null | undefined = undefined;

// The client initializer, now synchronous.
const getAiClient = (): GoogleGenAI | null => {
  // If we've already tried to initialize, return the cached instance.
  if (ai !== undefined) {
    return ai;
  }

  // Access the API key using Vite's syntax for environment variables.
  // The user must set VITE_API_KEY in their Vercel environment.
  const API_KEY = import.meta.env.VITE_API_KEY;

  if (API_KEY) {
    try {
      // Initialize the GoogleGenAI client.
      ai = new GoogleGenAI({ apiKey: API_KEY });
    } catch (error) {
      console.error("Failed to initialize GoogleGenAI:", error);
      ai = null; // Mark as initialized-but-failed
    }
  } else {
    console.warn("VITE_API_KEY environment variable not set. Using mock Gemini service.");
    ai = null; // Mark as initialized-and-no-key
  }
  return ai;
};


export const fetchPhoneSpecs = async (phoneName: string): Promise<string> => {
  // Fix: `getAiClient` is now synchronous.
  const aiClient = getAiClient();
  // Fix: The `Type` enum is now always available via static import, so no need to check for its existence.
  if (!aiClient) {
    // Mock response for environments without an API key
    return new Promise((resolve) =>
      setTimeout(() => {
        const mockSpecs = {
          "Display": "6.7-inch Super Retina XDR, ProMotion",
          "Processor": "A17 Pro chip",
          "RAM": "8GB",
          "Storage": "256GB / 512GB / 1TB",
          "Main Camera": "48MP Main, 12MP Ultra Wide, 12MP Telephoto",
          "Front Camera": "12MP TrueDepth",
          "Battery": "Up to 29 hours video playback"
        };
        resolve(JSON.stringify(mockSpecs, null, 2));
      }, 1000)
    );
  }
  
  const specsSchema = {
      type: Type.OBJECT,
      properties: {
        "Display": { type: Type.STRING },
        "Processor": { type: Type.STRING },
        "RAM": { type: Type.STRING },
        "Storage": { type: Type.STRING },
        "Main Camera": { type: Type.STRING },
        "Front Camera": { type: Type.STRING },
        "Battery": { type: Type.STRING },
      },
      required: ["Display", "Processor", "RAM", "Storage", "Main Camera", "Front Camera", "Battery"]
  };

  try {
    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate the key technical specifications for the phone: ${phoneName}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: specsSchema,
      },
    });

    // The response text is a JSON string, which we will format nicely
    const jsonSpecs = JSON.parse(response.text);
    return JSON.stringify(jsonSpecs, null, 2);

  } catch (error) {
    console.error("Error fetching phone specs from Gemini API:", error);
    throw new Error("Failed to generate phone specifications. Please try again or enter them manually.");
  }
};

// This interface is fine at the top level.
export interface GeneratedPhoneDetails {
    brand: string;
    model: string;
    imageSearchQuery: string;
    specs: Record<string, string>;
}

export const generatePhoneDetails = async (phoneName: string): Promise<GeneratedPhoneDetails> => {
    // Fix: `getAiClient` is now synchronous.
    const aiClient = getAiClient();
    // Fix: The `Type` enum is now always available via static import, so no need to check for its existence.
    if (!aiClient) {
        // Mock response
        return new Promise((resolve) =>
            setTimeout(() => {
                const mockDetails: GeneratedPhoneDetails = {
                    brand: phoneName.split(' ')[0] || 'MockBrand',
                    model: phoneName.substring(phoneName.indexOf(' ') + 1) || 'MockModel',
                    imageSearchQuery: `${phoneName} official product photo`,
                    specs: {
                        "Display": "6.5-inch Mock Display",
                        "Processor": "MockChip 9000",
                        "RAM": "8GB",
                        "Storage": "128GB",
                        "Main Camera": "50MP Mock Camera",
                        "Front Camera": "16MP Mock Camera",
                        "Battery": "5000mAh"
                    }
                };
                resolve(mockDetails);
            }, 1500)
        );
    }
    
    const specsSchema = {
      type: Type.OBJECT,
      properties: {
        "Display": { type: Type.STRING },
        "Processor": { type: Type.STRING },
        "RAM": { type: Type.STRING },
        "Storage": { type: Type.STRING },
        "Main Camera": { type: Type.STRING },
        "Front Camera": { type: Type.STRING },
        "Battery": { type: Type.STRING },
      },
      required: ["Display", "Processor", "RAM", "Storage", "Main Camera", "Front Camera", "Battery"]
    };

    const phoneDetailsSchema = {
        type: Type.OBJECT,
        properties: {
            brand: { type: Type.STRING, description: "The brand name of the phone, e.g., 'Apple'." },
            model: { type: Type.STRING, description: "The model name of the phone, e.g., 'iPhone 15 Pro'." },
            imageSearchQuery: { type: Type.STRING, description: "A concise search query for a high-quality product image of the phone. e.g. 'Samsung Galaxy S24 Ultra silver'." },
            specs: specsSchema
        },
        required: ["brand", "model", "specs", "imageSearchQuery"]
    };

    try {
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate detailed information for the phone: ${phoneName}. Identify its brand, model, a concise image search query, and key technical specifications.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: phoneDetailsSchema,
            },
        });

        const jsonResponse = JSON.parse(response.text);
        return jsonResponse as GeneratedPhoneDetails;

    } catch (error) {
        console.error("Error generating phone details from Gemini API:", error);
        throw new Error("Failed to generate phone details with AI. The model may not recognize this phone, or there was a service error.");
    }
};
