'use client';

import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Home() {
  const router = useRouter();

  const createNewSession = async () => {
    const response = await axios.post('http://localhost:4000/api/create');
    const { sessionId } = response.data;
    router.push(`/${sessionId}`);
  };

  return (
    <div>
      <button onClick={createNewSession}>Create New Session</button>
    </div>
  );
}