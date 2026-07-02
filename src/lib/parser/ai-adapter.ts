import { providerClient } from "@/lib/providers/providerClient";

const SYSTEM_PROMPT = `You are a strict Resume Parsing Engine.
Your only job is to extract data from the provided raw resume text and return a perfectly formatted JSON object. 
DO NOT include any markdown formatting like \`\`\`json. Return RAW JSON.

Required Schema:
{
  "personal_information": {
    "name": "string or null",
    "email": "string or null",
    "phone": "string or null",
    "linkedin": "string or null",
    "location": "string or null"
  },
  "skills": ["string"],
  "experience": [
    {
      "company": "string",
      "position": "string",
      "startDate": "YYYY-MM or null",
      "endDate": "YYYY-MM or null",
      "description": "string"
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "graduationYear": "YYYY or null"
    }
  ],
  "certifications": ["string"],
  "languages": ["string"]
}

If a field is missing in the resume, use null or an empty array. Do not invent data.`;

export class AiAdapter {
  /**
   * Routes the raw resume text to the appropriate provider format and executes the request.
   */
  async parseResume(providerName: string, modelName: string, rawText: string) {
    const providerLower = providerName.toLowerCase();

    try {
      if (providerLower === "openai" || providerLower === "deepseek") {
        return await this.callOpenAiFormat(providerName, modelName, rawText);
      } else if (providerLower === "gemini") {
        return await this.callGeminiFormat(providerName, modelName, rawText);
      } else {
        throw new Error(`Unsupported provider adapter: ${providerName}`);
      }
    } catch (error: any) {
      throw new Error(`AI Parsing Failed: ${error.message}`);
    }
  }

  private async callOpenAiFormat(providerName: string, modelName: string, rawText: string) {
    // Determine the base URL. DeepSeek uses a different base URL than OpenAI.
    let endpoint = "https://api.openai.com/v1/chat/completions";
    if (providerName.toLowerCase() === "deepseek") {
      endpoint = "https://api.deepseek.com/v1/chat/completions";
    }

    const payload = {
      model: modelName,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Raw Resume Text:\n\n${rawText}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1
    };

    const response = await providerClient.executeWithFailover(providerName, modelName, {
      endpoint,
      body: payload
    });

    const rawAIResponse = response;
    const content = response.choices[0].message.content;
    
    // Attempt to parse the content as JSON
    const parsedData = JSON.parse(content);
    return { parsedData, rawAIResponse };
  }

  private async callGeminiFormat(providerName: string, modelName: string, rawText: string) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;

    const payload = {
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }]
      },
      contents: [{
        parts: [{ text: `Raw Resume Text:\n\n${rawText}` }]
      }],
      generationConfig: {
        response_mime_type: "application/json",
        temperature: 0.1
      }
    };

    const response = await providerClient.executeWithFailover(providerName, modelName, {
      endpoint,
      body: payload
    });

    const rawAIResponse = response;
    const content = response.candidates[0].content.parts[0].text;
    
    const parsedData = JSON.parse(content);
    return { parsedData, rawAIResponse };
  }
}

export const aiAdapter = new AiAdapter();
