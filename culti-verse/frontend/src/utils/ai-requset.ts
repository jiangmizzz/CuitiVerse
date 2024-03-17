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

export async function translate(
  background: string,
  text: string
): Promise<string> {
  const context = [
    {
      role: "system",
      content:
        "Now you are a translator, required to translate content as accurately as possible.",
    },
    {
      role: "user",
      content: `Please translate the following text into the language of ${background}, and keep the format unchanged: ${text}`,
    },
  ] as ChatCompletionMessageParam[];
  return chat(context);
}
