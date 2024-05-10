//保存ai配置并封装相关方法
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { create } from "zustand";

interface aiconfigState {
  config: {
    apiKey: string;
    organization?: string;
    baseURL: string;
    dangerouslyAllowBrowser: true;
  };
  setConfig: (apiKey: string, organization?: string) => void;
  generateImg: (prompt: string) => Promise<string>;
  chat: (
    context: ChatCompletionMessageParam[],
    opt?: boolean
  ) => Promise<string>;
  translate: (background: string, text: string) => Promise<string>;
}

export const useAiStore = create<aiconfigState>()((set, get) => ({
  config: {
    apiKey: "",
    // organization: "",
    baseURL: "https://api.jarvis73.com/v1",
    dangerouslyAllowBrowser: true,
  },
  //设置api参数
  setConfig: (apiKey, organization) => {
    set((prevState) => {
      if (organization) {
        return {
          config: {
            ...prevState.config,
            apiKey: apiKey,
            organization: organization,
          },
        };
      } else {
        return {
          config: {
            ...prevState.config,
            apiKey: apiKey,
          },
        };
      }
    });
  },
  generateImg: async (prompt) => {
    const openai = new OpenAI(get().config);
    const res = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    return res.data[0].url!;
  },
  chat: async (context: ChatCompletionMessageParam[], opt?: boolean) => {
    const openai = new OpenAI(get().config);
    let res;
    if (opt) {
      res = await openai.chat.completions.create({
        model: "gpt-4-vision-preview", //只有这个medel能图生文字
        messages: context,
        max_tokens: 300,
      });
    } else {
      res = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview", //只有这个model能成功转译
        messages: context,
        n: 1,
      });
    }
    return res.choices[0].message.content!;
  },
  translate: async (background: string, text: string) => {
    const context = [
      {
        role: "system",
        content:
          "Now you are a translator, required to translate content as accurately as possible.",
      },
      {
        role: "user",
        content: `Please translate the following text into ${background}, and keep the format unchanged: ${text}`,
      },
      {
        role: "user",
        content: `Note: you should not provide any extra sentences or words other than translation results!`,
      },
    ] as ChatCompletionMessageParam[];
    return get().chat(context);
  },
}));
