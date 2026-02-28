import OpenAI from 'openai';
import { config } from '../config';
import { logger } from '../utils/logger';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

class AIService {
  private client: OpenAI;
  
  constructor() {
    this.client = new OpenAI({
      apiKey: config.ai.apiKey,
      baseURL: config.ai.provider === 'kimi' ? 'https://api.moonshot.cn/v1' : undefined
    });
  }

  async generateResponse(message: string, history: Message[], personality: string = 'default'): Promise<string> {
    try {
      const personalities: Record<string, string> = {
        default: 'You are a helpful, friendly AI assistant. Be concise but informative.',
        professional: 'You are a professional business assistant. Be formal, precise, and focus on practical solutions.',
        creative: 'You are a creative companion with a vivid imagination. Be expressive, inspiring, and think outside the box.',
        friendly: 'You are a casual, warm friend. Use emojis, be supportive, and chat like a real person.',
        sarcastic: 'You are a witty assistant with a playful, sarcastic tone. Be clever but not mean-spirited.',
        expert: 'You are a technical expert. Provide detailed, accurate information with examples where helpful.'
      };

      const systemMessage: Message = {
        role: 'system',
        content: personalities[personality] || personalities.default
      };

      const messages: Message[] = [
        systemMessage,
        ...history.slice(-config.ai.maxContextMessages),
        { role: 'user', content: message }
      ];

      const response = await this.client.chat.completions.create({
        model: config.ai.model,
        messages: messages,
        max_tokens: 1500,
        temperature: 0.7
      });

      return response.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
    } catch (error) {
      logger.error('AI Service Error:', error);
      throw new Error('Failed to generate AI response');
    }
  }
}

export const aiService = new AIService();
