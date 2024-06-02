'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import io from 'socket.io-client';
import axios from 'axios';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const socket: any = io('http://localhost:4000');

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
    axios.get(`http://localhost:4000/api/code/${sessionId}`)
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
