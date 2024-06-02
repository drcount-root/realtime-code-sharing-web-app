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

    socket.emit('join', sessionId);

    socket.on('codeUpdate', (newCode: any) => {
      setCode(newCode);
    });

    axios.get(`http://localhost:4000/api/code/${sessionId}`).then(response => {
      setCode(response.data.code);
    });

    return () => socket.off('codeUpdate');
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
