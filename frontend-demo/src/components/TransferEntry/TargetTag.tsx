//单个target的标签，包含生成AI示意图的功能
import "./TargetTag.css";
import imgIcon from "../../assets/img-icon.svg";
import expIcon from "../../assets/explain-icon.svg";
import searchIcon from "../../assets/search-icon.svg";
import loadingImg from "../../assets/img-loading.gif";
import OpenAI from "openai";
import config from "../../../config/request";
import { useEffect, useState } from "react";

interface TargetTagProps {
  id: number; //第x个喻体
  type: string; //转化方式
  text: string; //文本
  culture?: string; //所属文化
}

export default function TargetTag(props: TargetTagProps) {
  //ai图路径，不生成情况下不显示
  const [img, setImg] = useState<string | null>(null);
  //加载中
  const [isLoading, setLoading] = useState<boolean>(false);
  //显示在文本框里的单词
  const [word, setWord] = useState<string | null>(
    props.culture ? "Loading..." : props.text
  );
  //默认文化-chinese
  const culture = props.culture ?? "Chinese";

  //词汇需要转化成对应语言的单词
  useEffect(() => {
    const wordTransfer = async () => {
      if (props.culture) {
        const openai = new OpenAI(config);
        const res = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            { role: "system", content: "You are a Google translator." },
            {
              role: "user",
              content: `The writing style of "${props.text}" in ${culture} culture (answer using only one ${culture} word).`,
            },
          ],
          n: 1,
        });
        const word = res.choices[0].message.content;
        setWord(word);
      }
    };
    wordTransfer();
    //原来生成的图片都缩回去
    setImg(null);
  }, [props.culture]);

  //请求 gpt 生成 AI 示意图
  async function generateImg() {
    setLoading(true);
    const openai = new OpenAI(config);
    const res = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Please generate a schematic diagram of the image of the ${props.text} in the context of ${culture} culture`,
      n: 1,
      size: "1024x1024",
      // response_format: "b64_json",
    });
    const imgUrl = res.data[0].url!;
    setLoading(false);
    setImg(imgUrl);
  }

  return (
    <>
      <div className="target-main">
        <div className="target-header">
          <div className="target-type">{props.type}</div>
          <div className="target-icon">
            <img
              onClick={(e) => {
                e.stopPropagation(); //阻止冒泡
                generateImg();
              }}
              src={imgIcon}
            />
            <img src={expIcon} />
            <img src={searchIcon} />
          </div>
        </div>
        <div className="target-text">
          {/* <span>{props.id + 1}</span> */}
          <div>{word}</div>
        </div>
        {(img || isLoading) && (
          <img
            style={{ width: "100%", objectFit: "cover" }}
            src={isLoading ? loadingImg : img!}
          />
        )}
      </div>
    </>
  );
}
