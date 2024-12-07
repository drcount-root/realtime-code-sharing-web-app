'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import io from 'socket.io-client';
import axios from 'axios';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL as string);

console.log("process.env.NEXT_PUBLIC_API_BASE_URL", process.env.NEXT_PUBLIC_API_BASE_URL)

export default function CodeEditor() {
  const params = useParams();
  const sessionId = params.sessionId;
  const [code, setCode] = useState('');

  useEffect(() => {
    if (!sessionId) return;

    // Join the session room
    socket.emit('join', sessionId);

    // Listen for code updates
    socket.on('codeUpdate', (newCode: any) => {
      setCode(newCode);
    });

    // Fetch initial code for the session
    axios.get(process.env.NEXT_PUBLIC_API_BASE_URL + `/api/code/${sessionId}`)
      .then(response => {
        setCode(response.data.code);
      })
      .catch(error => {
        console.error('Error fetching code:', error);
      });

    return () => {
      socket.off('codeUpdate');
      socket.emit('leave', sessionId);
    };
  }, [sessionId]);

  const handleEditorChange = (value: any) => {
    setCode(value);
    socket.emit('codeChange', value);
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
