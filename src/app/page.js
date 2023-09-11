"use client";

import dynamic from "next/dynamic";

const STTComponent = dynamic(() => import("./STTComponent"), {
  ssr: false, // This line is important. It disables server-side rendering for this component.
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <STTComponent />
      {/* rest of your component */}
    </main>
  );
}
