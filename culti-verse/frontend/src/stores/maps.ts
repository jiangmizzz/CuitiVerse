/**
 * 用于变量值映射的maps
 */
import defineIcon from "../assets/custom.svg";
import similarIcon from "../assets/similar.svg";
import gen_imgIcon from "../assets/image_generation.svg";
import chatIcon from "../assets/chat.svg";
import transformIcon from "../assets/transfer.svg";
import animalIcon from "../assets/animal.png";
import plantIcon from "../assets/plant.png";
import fruitIcon from "../assets/fruit.png";
import otherIcon from "../assets/other.png";
import negativeIcon from "../assets/negative.svg";
import neutralIcon from "../assets/neutral.svg";
import positiveIcon from "../assets/positive.svg";
import { emotionType, normType, optKey, seriesType } from "../vite-env";

//喻体类型与颜色
export const normColorMap = new Map<normType, string>([
  ["Iconic", "#dbbe9a"],
  ["Homophony", "#7292ac"],
  ["Homophonic pun", "#b67681"],
  ["Synonym", "#83a89a"],
  ["Homograph", "#d48d84"],
  ["Satire", "#a8b0bf"],
]);

//操作与对应的icon
export const optIconMap = new Map<optKey, string>([
  ["def", defineIcon],
  ["similar", similarIcon],
  ["gen_img", gen_imgIcon],
  ["chat", chatIcon],
  ["trans", transformIcon],
]);

//词云图类别与对应的图标
export const seriesIcon = new Map<seriesType, string>([
  ["Animal", animalIcon],
  ["Plant", plantIcon],
  ["Fruit", fruitIcon],
  ["Other", otherIcon],
]);

//emotion与对应图标
export const emotionIcon = new Map<emotionType, string>([
  ["Negative", negativeIcon],
  ["Neutral", neutralIcon],
  ["Positive", positiveIcon],
]);

export const faqs: { id: number; content: string }[] = [
  {
    id: 1,
    content: "What is ... ?",
  },
  {
    id: 2,
    content: "Relations between ... and ... ",
  },
  {
    id: 3,
    content: "More about the symbol ...",
  },
];

//样式配置
export const textBoxCfg = {
  borderWidth: 1,
  borderColor: "gray.200",
  borderRadius: "md",
  px: 2,
  py: 1.5,
  spacing: 1.5,
  align: "start",
};
