import OpenAI from "openai";
import apiConfig from "../../config/api-key";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export async function generateImg(prompt: string): Promise<string> {
  const openai = new OpenAI(apiConfig);
  const res = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
  });
  return res.data[0].url!;
}

export async function chat(
  context: ChatCompletionMessageParam[]
): Promise<string> {
  const openai = new OpenAI(apiConfig);
  const res = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: context,
    n: 1,
  });
  return res.choices[0].message.content!;
}
