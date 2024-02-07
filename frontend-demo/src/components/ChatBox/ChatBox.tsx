import "./ChatBox.css";
import exit from "../../assets/exit-pop.svg";
import send from "../../assets/sendMsg.svg";
import { useEffect, useState } from "react";
import Message from "./Message";
import OpenAI from "openai";
import config from "../../../config/request";
import { MessageProps } from "../../vite-env";
import { useHistoryStore } from "../../stores/chat-history";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

interface ChatBoxProps {
  ifShow: boolean;
  closePop: () => void;
}
export default function ChatBox(props: ChatBoxProps) {
  const historyStore = useHistoryStore();
  const [inputMsg, setMsg] = useState<string>("");
  const [isWaiting, setWaiting] = useState<boolean>(false);
  const [msgList, setMsgList] = useState<MessageProps[]>([]);

  //读取本session的历史对话
  useEffect(() => {
    for (const msgItem of historyStore.msgs) {
      setMsgList([
        ...msgList,
        { sender: msgItem.sender, content: msgItem.content, isLoading: false },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //发送对话
  async function handleSend() {
    if (!isWaiting && inputMsg != "") {
      //发送输入内容
      setMsg(""); //清空输入框
      setWaiting(true);
      setMsgList((prevMsgs) => [
        ...prevMsgs,
        ...([
          { sender: "user", content: inputMsg, isLoading: false },
          { sender: "robot", content: "", isLoading: true },
        ] satisfies MessageProps[]),
      ]);
      const openai = new OpenAI(config);
      const res = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "This is the context of this conversation.",
          },
          ...msgList.map((msg) => {
            return {
              role: msg.sender == "user" ? "user" : "assistant",
              content: msg.content,
            } as ChatCompletionMessageParam;
          }),
          {
            role: "system",
            content:
              "This is the question that the model needs to respond to truthfully: ",
          },
          {
            role: "user",
            content: inputMsg,
          },
        ],
        n: 1,
      });
      const answer = res.choices[0].message.content!;
      // console.log(msgList.slice(0, msgList.length));
      setMsgList((prevMsgs) => [
        ...prevMsgs.slice(0, prevMsgs.length - 1),
        { sender: "robot", content: answer, isLoading: false },
      ]);
      setWaiting(false);
    } else if (inputMsg == "") {
      alert("You can not send an empty message!");
    }
  }

  return (
    <>
      {props.ifShow && (
        <div className="chatbox-back">
          <div className="chatbox-card">
            <div className="chatbox-header">
              <span>Chat Board</span>
              <img
                src={exit}
                style={{ width: "1.8em", objectFit: "contain" }}
                onClick={() => {
                  historyStore.updateMsgs(msgList);
                  props.closePop();
                }}
              />
            </div>
            <div className="chatbox-list">
              {msgList.map((msg, index) => {
                return (
                  <Message
                    key={msg.content + index}
                    sender={msg.sender}
                    content={msg.content}
                    isLoading={msg.isLoading}
                    delete={() =>
                      setMsgList((prevMsgs) =>
                        prevMsgs
                          .slice(0, index)
                          .concat(prevMsgs.slice(index + 1))
                      )
                    }
                  />
                );
              })}
            </div>
            <div className="chatbox-input-area">
              <div>
                <textarea
                  rows={2}
                  placeholder="Message ChatGPT..."
                  value={inputMsg}
                  onChange={(e) => {
                    setMsg(e.target.value);
                  }}
                />
              </div>
              <img
                src={send}
                style={{
                  objectFit: "contain",
                  cursor: isWaiting ? "not-allowed" : "pointer",
                }}
                onClick={handleSend}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
