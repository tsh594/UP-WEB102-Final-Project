import React from 'react';
import DeepSeekChat from '../components/DeepSeekChat';
import Layout from '../components/Layout';

const DeepSeekChatPage = () => {
  const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || 'your-api-key-here';

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">DeepSeek Chat</h1>
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <DeepSeekChat apiKey={DEEPSEEK_API_KEY} />
        </div>
      </div>
    </Layout>
  );
};

export default DeepSeekChatPage;