//存放demo所需的静态数据
import monkey from "../assets/monkey.png";
import bee from "../assets/bee.png";

export interface targetItem {
  type: string; //转化方式
  text: string; //文本
}

//单个词转译的接口
export interface transferItem {
  picPieces: string; //画布中截取的部分，这里直接采用静态路径，之后改成坐标形式
  source: string; //本体
  targets: targetItem[];
}
//单个词转译
export const singleTrans: transferItem[] = [
  {
    picPieces: monkey,
    source: "Monkey",
    targets: [
      {
        type: "Homophonic Pun",
        text: "Marquis",
      },
      {
        type: "Homograph",
        text: "Monkey King",
      },
    ],
  },
  {
    picPieces: bee,
    source: "Bee",
    targets: [
      {
        type: "Homophonic Pun",
        text: "Enfeoff",
      },
      {
        type: "Homograph",
        text: "Hardworking",
      },
    ],
  },
];

//组合转译
export const combinationTrans: targetItem = {
  type: "Homophony",
  text: "Enfoeffment",
};
