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

//词云和网络图配色
export const seriesColorMap = new Map<string, string>([
  //常规色 - border
  ["Animal", "#dbbe9a"],
  ["Plant", "#96a48b"],
  ["Fruit", "#a0c1d2"],
  ["Other", "#6682a8"],
  //bgcolor
  ["Animalb", "#dfdbbc"],
  ["Plantb", "#c2ddac"],
  ["Fruitb", "#a9d2e6"],
  ["Otherb", "#8a9eba"],
  //chosen bgcolor
  ["Animalcb", "#ecefde"],
  ["Plantcb", "#d4e4c7"],
  ["Fruitcb", "#c9e0ec"],
  ["Othercb", "#aac0df"],
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
