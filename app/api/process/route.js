import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import stringSimilarity from "string-similarity";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { time, typed_text, original_text } = await req.json();

    // Generate AI-corrected text using OpenAI's o1 model
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 500,
      messages: [
        { role: "developer", content: "You are a helpful assistant." },
        {
            role: "user",
            content: `Correct the following text to match the original as closely as possible (it should include all correct punctuation, as output give only the fixed text):\nTyped Text:\n${typed_text}`,
        },
    ],
    });

    const ai_corrected_text = aiResponse.choices[0].message?.content?.trim();

    // Calculate metrics
    const calculateMetrics = (text, referenceText, time) => {
        const wordsTyped = text.trim().split(/\s+/).length;
        const charsTyped = text.length;
        const referenceChars = referenceText.length;

        // Calculate similarity using string-similarity
        const similarity = stringSimilarity.compareTwoStrings(text, referenceText);
        const accuracy = (similarity * 100).toFixed(2);

        const wpm = Math.round(wordsTyped / (time / 60));
        const cpm = Math.round(charsTyped / (time / 60));
        const efficiency = ((charsTyped / referenceChars) * 100).toFixed(2);

        return { accuracy, wpm, cpm, efficiency };
    };

    const userMetrics = calculateMetrics(typed_text, original_text, time);
    const aiMetrics = calculateMetrics(ai_corrected_text, original_text, time);
    aiMetrics.efficiency = ((ai_corrected_text.length / original_text.length) * 100).toFixed(2);

    return NextResponse.json({
      userMetrics,
      aiMetrics,
      ai_corrected_text,
    });
  } catch (error) {
    console.error('Error processing text:', error);
    return NextResponse.error();
  }
}
