import { ModelInfo } from '@/types/model';

/**
 * This is a mock function that simulates generating text from a LLaMA model.
 * In a real application, this would connect to llama.cpp or a similar inference library.
 */
export async function generateText(prompt: string, model: ModelInfo): Promise<string> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // For demo purposes, return different responses based on model
  if (model.id === 'tinyllama-1.1b') {
    return generateTinyLlamaResponse(prompt);
  } else {
    return generateLlama3Response(prompt);
  }
}


function generateTinyLlamaResponse(prompt: string): string {
  const responses = [
    `I'm TinyLlama, a small but efficient language model. ${prompt} is an interesting topic. I'll try my best to help with this, though my knowledge is more limited than larger models.`,
    `Thanks for your question about "${prompt}". As a compact model, I can provide basic assistance. For more complex queries, you might want to use a larger model.`,
    `I'm processing your request about "${prompt}". Since I'm a smaller model (only 1.1B parameters), my responses might be simpler than what you'd get from larger LLMs.`,
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

function generateLlama3Response(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  // Different response types based on prompt content
  if (lowerPrompt.includes('hello') || lowerPrompt.includes('hi')) {
    return `Hello! I'm LLaMA 3, an open-source language model running directly on your device. How can I assist you today?`;
  } else if (lowerPrompt.includes('what') && (lowerPrompt.includes('you') || lowerPrompt.includes('llama'))) {
    return `I'm LLaMA 3, a language model developed by Meta AI. I'm designed to run efficiently on mobile and edge devices while still providing helpful responses. Unlike cloud-based AI, I process everything locally on your device, which enhances privacy and allows me to work offline.`;
  } else if (lowerPrompt.includes('how') && lowerPrompt.includes('work')) {
    return `I work by processing text using neural networks that have been optimized to run on mobile devices. The model has been quantized (reduced in precision) to fit in your device's memory while maintaining reasonable performance. When you send me a message, I analyze it and generate a response completely on-device, without sending your data to any servers.`;
  } else {
    return `Thank you for your message about "${prompt}". I'm processing this entirely on your device for privacy. Since I'm running locally, my capabilities might be different from cloud-based models, but I'll do my best to provide a helpful response. Is there anything specific about this topic you'd like me to explore further?`;
  }
}

export async function sendPromptToLLaMA(prompt: string): Promise<string> {
  try {
    const res = await fetch("http://localhost:8000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: prompt }),
    });

    const data = await res.json();
    return data.response.trim();
  } catch (err) {
    console.error("LLaMA API error:", err);
    return "Error: Failed to get a response from the model.";
  }
}

