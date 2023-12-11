"use client";
import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState<string | undefined>();

  const handleClick = async () => {
    const response = await invoke<string>("greet", { name: "Pasindu" });
    setText(response);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>Test Page</div>
      {text && <div>{text}</div>}
      <button
        className="rounded-full bg-blue-500 p-2 text-white hover:bg-blue-700"
        onClick={handleClick}
      >
        Click Me
      </button>
    </main>
  );
}
