export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const time = parseInt(searchParams.get("time"), 10);
  const typedText = searchParams.get("typed_text") || "";
  const originalText = searchParams.get("original_text") || "";

  // Calculating metrics
  const wordsTyped = typedText.trim().split(/\s+/).length;
  const charsTyped = typedText.length;
  const originalChars = originalText.length;
  const correctChars = typedText
    .split("")
    .filter((char, index) => char === originalText[index]).length;

  const accuracy = ((correctChars / originalChars) * 100).toFixed(2);
  const wpm = Math.round((wordsTyped / (time / 60)));
  const cpm = Math.round((charsTyped / (time / 60)));
  const equivalentCpm = Math.round((originalChars / (time / 60)));
  const efficiency = ((correctChars / charsTyped) * 100).toFixed(2);

  return new Response(
    JSON.stringify({ accuracy, wpm, cpm, equivalentCpm, efficiency }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
