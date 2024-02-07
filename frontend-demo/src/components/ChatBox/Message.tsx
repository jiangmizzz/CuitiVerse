import "./Message.css";
import robot from "../../assets/chat-gpt.svg";
import user from "../../assets/user-avatar.svg";
import deleteMsg from "../../assets/msg-delete.svg";
import loading from "../../assets/chat-loading.gif";
import { MessageProps } from "../../vite-env";

interface Message extends MessageProps {
  delete: () => void;
}

export default function Message(props: Message) {
  return (
    <>
      <div
        className="msg-main"
        style={{
          flexDirection: props.sender == "user" ? "row-reverse" : "row",
        }}
      >
        <div className="msg-avatar">
          <img
            src={props.sender == "user" ? user : robot}
            style={{ width: "2em", objectFit: "contain" }}
          />
        </div>
        <div
          className={
            //聊天框样式差分
            "msg-content " +
            (props.sender == "robot" ? "msg-theme-bot" : "msg-theme-user")
          }
          style={{ flexGrow: props.isLoading ? "1" : "0" }}
        >
          {props.isLoading && (
            <img
              style={{ width: "100%", height: "4em", objectFit: "contain" }}
              src={loading}
            />
          )}
          {!props.isLoading &&
            props.content.split("\n").map((para) => {
              return (
                <>
                  <div>{para}</div>
                </>
              );
            })}
        </div>
        <img
          src={deleteMsg}
          style={{
            cursor: props.isLoading ? "not-allowed" : "pointer",
          }}
          onClick={() => {
            if (!props.isLoading) {
              props.delete();
            }
          }}
          className={
            "msg-delete " +
            (props.sender == "robot" ? "msg-del-bot" : "msg-del-user")
          }
        />
      </div>
    </>
  );
}
