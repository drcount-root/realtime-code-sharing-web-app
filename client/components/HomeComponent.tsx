'use client';

import { useRouter } from 'next/navigation';
import axios from 'axios';

const HomeComponent = () => {
    const router = useRouter();

    const createNewSession = async () => {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_BASE_URL + '/api/create');
      const { sessionId } = response.data;
      router.push(`/${sessionId}`);
    };
  
    return (
      <div>
        <button onClick={createNewSession}>Create New Session</button>
      </div>
    );
}

export default HomeComponent
