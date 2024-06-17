import {
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  InputGroup,
  InputRightElement,
  Tag,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import send from "../../assets/send_msg.svg";
import { ExtensionMsg, checkType } from "../../vite-env";
import Message from "./Message";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { useExploreStore } from "../../stores/explore";
import { useSettingStore } from "../../stores/setting";
// import { chat, translate } from "../../utils/ai-requset";
import { useAiStore } from "../../stores/aiconfig";

export default function Extension() {
  const exploreStore = useExploreStore();
  const settingStore = useSettingStore();
  const aiStore = useAiStore();
  const toast = useToast();
  const [inputMsg, setMsg] = useState<string>("");
  const [isWaiting, setWaiting] = useState<boolean>(false);
  const [isProducing, setProducing] = useState<boolean>(false);
  const [msgList, setMsgList] = useState<{
    counter: number;
    msgs: ExtensionMsg[];
  }>({
    counter: 0,
    msgs: [],
  });

  // 发送一条 chat 内容
  async function handleSend() {
    if (inputMsg !== "" && !isWaiting) {
      setMsg("");
      setWaiting(true);
      setMsgList((prev) => {
        return {
          counter: prev.counter + 2,
          msgs: [
            ...prev.msgs,
            ...([
              {
                id: prev.counter,
                sender: "user",
                content: inputMsg,
                isLoading: false,
              },
              {
                id: prev.counter + 1,
                sender: "robot",
                content: "",
                isLoading: true,
              },
            ] satisfies ExtensionMsg[]),
          ],
        };
      });
      const context = [
        {
          role: "system",
          content: "This is the context of this conversation.",
        },
        ...msgList.msgs.map((msg) => {
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
      ] as ChatCompletionMessageParam[];
      const answer = await aiStore.chat(context);
      setMsgList((prev) => {
        return {
          counter: prev.counter + 1,
          msgs: [
            ...prev.msgs.slice(0, prev.msgs.length - 1),
            {
              id: prev.counter,
              sender: "robot",
              content: answer,
              isLoading: false,
            },
          ],
        };
      });
      setWaiting(false);
    }
  }

  // 删除一条chat
  function handleDelete(id: number) {
    const index = msgList.msgs.findIndex((item) => item.id === id);
    if (index >= 0) {
      setMsgList((prev) => {
        return {
          counter: prev.counter,
          msgs: prev.msgs.slice(0, index).concat(prev.msgs.slice(index + 1)),
        };
      });
    }
  }

  //范式验证,将生成的文字填充/替换到输入框
  async function checkNorm(opt: checkType) {
    if (exploreStore.isCompleted()) {
      let head =
        "The translation path of traditional Chinese painting is: element (in a painting) --> symbol (in a certain way of rhetoric) --> foreign cultural symbol. ";
      let tail: string = "\n**Question**: \n";
      if (opt === "Appropriate") {
        head += `Now I need your help to determine whether the current translation path is appropriate for me.`;
        tail += `Please help me determine whether the current translation path is appropriate for me.`;
      } else if (opt === "Emotion") {
        head += `Now I need your help to determine the emotional tendencies contained in the current translation path.`;
        tail += `Please help me determine the emotional tendencies contained in the current translation path (make it easy for me to understand).`;
      } else {
        head += `Now I need you to help me think of more similar translation paths in Chinese paintings`;
        tail += `Please help me think of more similar translation paths in Chinese paintings (make it suitable for my understanding).`;
      }
      setProducing(true);
      let input =
        head +
        `The following are descriptions of current conditions.
      \n**Background**: 
      ${settingStore.generateDesc()}
      \n**Task**: 
      ${exploreStore.generateTrack()}${tail}`;
      //system语言非英语时需要翻译
      if (settingStore.language !== "English") {
        input = await aiStore.translate(settingStore.language, input);
      }
      setProducing(false);
      setMsg(input);
    } else {
      toast({
        title: "Incomplete norm",
        description:
          "You need to select an element, a symbol and one of its corresponding translation products to form a complete norm.",
        status: "info",
        duration: 5000,
        position: "bottom-right",
        isClosable: true,
      });
    }
  }

  return (
    <Flex
      className="extension-main app-item-main"
      direction={"column"}
      minW={0}
    >
      <VStack flex={1} overflow={"auto"} spacing={3} pb={2} maxW={300}>
        {msgList.msgs.map((msg) => {
          return (
            <Message
              key={msg.id}
              id={msg.id}
              sender={msg.sender}
              content={msg.content}
              isLoading={msg.isLoading}
              delete={() => handleDelete(msg.id)}
            />
          );
        })}
      </VStack>
      <Box minW={260} overflowX={"auto"}>
        <HStack mb={1}>
          {(["Appropriate", "Emotion", "Inference"] as checkType[]).map(
            (option) => {
              return (
                <Tag
                  key={option}
                  variant="outline"
                  _hover={{
                    cursor: "pointer",
                    boxShadow: "md",
                  }}
                  borderWidth={1}
                  colorScheme="black"
                  onClick={() => checkNorm(option)}
                  fontWeight={"bold"}
                >
                  {option}
                </Tag>
              );
            }
          )}
        </HStack>
        <InputGroup>
          <Textarea
            rows={3}
            fontSize={"sm"}
            pr={"3.5rem"}
            resize={"vertical"}
            minH={"6em"}
            placeholder="Message ChatGPT..."
            value={inputMsg}
            isDisabled={isProducing}
            cursor={isProducing ? "wait" : "default"}
            onChange={(e) => {
              setMsg(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <InputRightElement m={1.5} mr={3}>
            <Flex align={"end"} style={{ height: "100%" }}>
              <IconButton
                aria-label="sendMsg"
                isDisabled={isWaiting || inputMsg === ""}
                icon={
                  <Image
                    src={send}
                    objectFit={"contain"}
                    w={"1.5em"}
                    onClick={handleSend}
                  />
                }
              />
            </Flex>
          </InputRightElement>
        </InputGroup>
      </Box>
    </Flex>
  );
}
