/**
 * 用于变量值映射的maps
 */
import defineIcon from "../assets/definition.svg";
import similarIcon from "../assets/similar.svg";
import gen_imgIcon from "../assets/image_generation.svg";
import chatIcon from "../assets/chat.svg";
import transformIcon from "../assets/transfer.svg";
import { normType, optKey } from "../vite-env";

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
