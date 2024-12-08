"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import io from "socket.io-client";
import { toast } from "sonner";
import { getCode } from "@/utils/api_utils";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL as string);

export default function CodeEditor() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [code, setCode] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!sessionId) return;

    // Join the session room
    socket.emit("join", sessionId);

    // Listen for code updates
    socket.on("codeUpdate", (newCode: any) => {
      setCode(newCode);
    });

    // Fetch initial code for the session
    getCode(sessionId)
      .then((newCode) => {
        setCode(newCode);
      })
      .catch((error) => {
        toast.error("Uh oh! Something went wrong");
        console.error("Error fetching code:", error);
        setTimeout(() => router.push("/"), 1000);
      });

    return () => {
      socket.off("codeUpdate");
      socket.emit("leave", sessionId);
    };
  }, [sessionId]);

  const handleEditorChange = (value: any) => {
    setCode(value);
    socket.emit("codeChange", value);
  };

  return (
    <div>
      <Editor
        height="90vh"
        language="javascript"
        value={code}
        onChange={handleEditorChange}
      />
    </div>
  );
}
