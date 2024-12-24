import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const lang = url.searchParams.get("lang") || "English";

    const prompt =
      lang === "English"
        ? "Generate a text that a user would type to practice typing. Approximately 60 words. As a response return only the text."
        : "Создайте текст, который пользователь будет набирать для практики печати. Примерно 60 слов. В ответе верните только текст.";

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 70, // Adjusted for a ~60-word response
      temperature: 0.7, // Optional: Adjust creativity level
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });

    // Extract generated text from OpenAI response
    const typingText = response.choices[0]?.message?.content?.trim();

    if (!typingText) {
      return new Response(
        JSON.stringify({ error: "Failed to generate text" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ text: typingText }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating typing text:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
