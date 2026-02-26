import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Maps a Gemini-suggested category to the correct Department enum value.
 */
const CATEGORY_TO_DEPARTMENT = {
    ROAD: 'ROADS_AND_INFRASTRUCTURE',
    WATER: 'WATER_SUPPLY',
    GARBAGE: 'SOLID_WASTE_MANAGEMENT',
    STREETLIGHT: 'STREET_LIGHTING',
    SANITATION: 'SANITATION',
    OTHER: 'SANITATION', // fallback
};

/**
 * Classify a complaint using Gemini AI.
 *
 * @param {{ description: string, imageUrl?: string, latitude: number, longitude: number }}
 * @returns {Promise<{ category: string, department: string, priority: number, reasoning: string }>}
 */
async function classifyComplaint({ description, imageUrl, latitude, longitude }) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a municipal grievance classification AI.
Analyze this citizen complaint and classify it.

Complaint description: "${description}"
${imageUrl ? `Image URL: ${imageUrl}` : 'No image provided.'}
Location: latitude ${latitude}, longitude ${longitude}

Respond ONLY with valid JSON (no markdown, no code fences) in this exact format:
{
  "category": "one of: ROAD, WATER, GARBAGE, STREETLIGHT, SANITATION, OTHER",
  "priority": <integer from 1 to 10 where 10 is most urgent>,
  "reasoning": "brief explanation of your classification"
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        // Strip markdown code fences if Gemini wraps them
        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleaned);

        // Normalize & clamp
        const category = String(parsed.category || 'OTHER').toUpperCase();
        const priority = Math.max(1, Math.min(10, parseInt(parsed.priority, 10) || 3));
        const department = CATEGORY_TO_DEPARTMENT[category] || 'SANITATION';
        const reasoning = parsed.reasoning || 'AI classification completed.';

        return { category, department, priority, reasoning };
    } catch (error) {
        console.error('Gemini classification error:', error);

        // Graceful fallback so the complaint still gets created
        return {
            category: 'OTHER',
            department: 'SANITATION',
            priority: 5,
            reasoning: 'AI classification failed — defaults applied.',
        };
    }
}

export default { classifyComplaint };
