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
  context: ChatCompletionMessageParam[],
  opt?: boolean
): Promise<string> {
  const openai = new OpenAI(apiConfig);
  let res;
  if (opt) {
    res = await openai.chat.completions.create({
      model: "gpt-4-vision-preview", //只有这个medel能图生文字
      messages: context,
      max_tokens: 200,
    });
  } else {
    res = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview", //只有这个model能成功转译
      messages: context,
      n: 1,
    });
  }
  return res.choices[0].message.content!;
}
