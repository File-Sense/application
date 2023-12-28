"use client";
import { Button } from "#/components/ui/button";
import { pingAtom } from "#/lib/atoms";
import { invoke } from "@tauri-apps/api/tauri";
import { useAtom } from "jotai";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState<string | undefined>();
  const [{ data }] = useAtom(pingAtom);
  // const {} = useQuery({
  //   queryKey: ["PING"],
  //   queryFn: ping,
  //   refetchInterval: 2000,
  //   retry: true,
  // });

  const handleClick = async () => {
    console.log("🤬 ~ file: page.tsx:11 ~ Home ~ data:", data?.ping);
    setText(data?.ping);
    // const response = await invoke<string>("greet", { name: "Pasindu" });
    // setText(response);
  };

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="flex flex-col items-center justify-between pt-5"
    >
      <div>Test Page</div>
      {text && <div>{text}</div>}
      <Button onClick={handleClick}>Click Me</Button>
    </div>
  );
}
