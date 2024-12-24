"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

function ResultContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      const payload = {
        time: searchParams.get("time"),
        typed_text: searchParams.get("typed_text"),
        original_text: searchParams.get("original_text"),
      };

      try {
        const response = await fetch("/api/process", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        setResult(data);
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };

    fetchResults();
  }, [searchParams]);

  if (!result) return <p>Loading results...</p>;

  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex flex-col items-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-5xl w-full text-center">
        <h1 className="text-2xl font-semibold text-purple-400 mb-6">
          Typing Test Results
        </h1>

        {/* Text Display Section */}
        <div className="grid md:grid-cols-3 gap-6 text-left text-gray-300 mb-8">
          <div>
            <h2 className="font-semibold text-lg mb-2">Your Typed Text:</h2>
            <p className="bg-gray-700 p-4 rounded-lg">{searchParams.get("typed_text")}</p>
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-2">AI-Corrected Text:</h2>
            <p className="bg-gray-700 p-4 rounded-lg">{result.ai_corrected_text}</p>
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-2">Original Text:</h2>
            <p className="bg-gray-700 p-4 rounded-lg">{searchParams.get("original_text")}</p>
          </div>
        </div>

        {/* Metrics Display Section */}
        <ul className="text-lg text-gray-300 space-y-4">
          <li>
            <strong>Elapsed Time:</strong> {searchParams.get("time")}s
          </li>
          <li>
            <strong>Your Text Accuracy:</strong> {result.userMetrics.accuracy}%
          </li>
          <li>
            <strong>Your Text WPM:</strong> {result.userMetrics.wpm}
          </li>
          <li>
            <strong>Your Text CPM:</strong> {result.userMetrics.cpm}
          </li>
          <li>
            <strong>AI Text Accuracy:</strong> {result.aiMetrics.accuracy}%
          </li>
          <li>
            <strong>AI Text Efficiency:</strong> {result.aiMetrics.efficiency}%
          </li>
          <li>
            <strong>AI Text CPM:</strong> {result.aiMetrics.cpm}
          </li>
          <li>
            <strong>AI Text WPM:</strong> {result.aiMetrics.wpm}
          </li>
        </ul>

        <Link
          href="/"
          className="mt-6 inline-block bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition hover:bg-purple-700"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}

export default function Result() {
  return (
    <Suspense fallback={<p className="text-white">Loading page...</p>}>
      <ResultContent />
    </Suspense>
  );
}
