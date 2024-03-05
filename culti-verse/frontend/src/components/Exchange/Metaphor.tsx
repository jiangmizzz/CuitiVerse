import {
  Box,
  Flex,
  Heading,
  SlideFade,
  Tag,
  Text,
  TagLabel,
  VStack,
  Image,
  Tooltip,
  AspectRatio,
  Spinner,
  Center,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { ExchangeItem, MetaphorType } from "../../vite-env";
import { normColorMap, optIconMap, textBoxCfg } from "../../stores/maps";
import deleteIcon from "../../assets/delete.svg";
import refreshIcon from "../../assets/refresh.svg";
import send from "../../assets/send_msg.svg";
import { useExchangeStore } from "../../stores/exchange";
import { useState } from "react";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import ImgPreviewer from "../ImgPreviewer/ImgPreviewer";
import { chat, generateImg } from "../../utils/ai-requset";
import { useSettingStore } from "../../stores/setting";

const textCfg = {
  fontSize: "xs",
  color: "gray.500",
  lineHeight: "1.2em",
};

const btnCfg = {
  cursor: "pointer",
  _hover: { opacity: "0.7" },
};

const spincfg = {
  speed: "0.8s",
  color: "gray.300",
};

interface ExchangeEntryProps {
  item: ExchangeItem;
  delete: () => void;
  regenImg: () => void;
}

//单条用户操作历史
function ExchangeEntry(props: ExchangeEntryProps) {
  if (props.item.isLoading === true) {
    //loading态的信息
    return (
      <Flex align={"start"} gap={1} w={"100%"}>
        <Image
          src={optIconMap.get(props.item.opt)}
          w={5}
          objectFit={"contain"}
        />
        <Box flexGrow={1} w={300} margin={"auto"}>
          {
            //type narrowing
            props.item.opt === "def" ? (
              <Center {...textBoxCfg}>
                <Spinner {...spincfg} my={3} />
              </Center>
            ) : props.item.opt === "gen_img" ? (
              <AspectRatio ratio={1} bgColor={"gray.100"}>
                <Center>
                  <Spinner {...spincfg} size={"xl"} thickness="5px" />
                </Center>
              </AspectRatio>
            ) : props.item.opt === "chat" ? (
              <VStack spacing={1}>
                <VStack {...textBoxCfg} w={"100%"}>
                  {props.item.content[0].split("\n").map((l, index) => {
                    return (
                      <Text key={l + index + props.item.id} {...textCfg}>
                        {l}
                      </Text>
                    );
                  })}
                </VStack>
                <Center {...textBoxCfg} w={"100%"}>
                  <Spinner {...spincfg} my={3} />
                </Center>
              </VStack>
            ) : (
              //props.item.opt === "similar"
              <Center bgColor={"gray.100"}>
                <Spinner {...spincfg} thickness="4px" my={5} />
              </Center>
            )
          }
        </Box>
        <Image src={deleteIcon} opacity={0} />
      </Flex>
    );
  } else {
    //正常加载的操作信息
    return (
      <Flex align={"start"} gap={1} w={"100%"}>
        <Image
          src={optIconMap.get(props.item.opt)}
          w={5}
          objectFit={"contain"}
        />
        <Box flexGrow={1} w={300} margin={"auto"}>
          {
            //type narrowing
            props.item.opt === "def" ? (
              <VStack {...textBoxCfg}>
                {props.item.content.split("\n").map((l, index) => {
                  return (
                    <Text key={l + index + props.item.id} {...textCfg}>
                      {l}
                    </Text>
                  );
                })}
              </VStack>
            ) : props.item.opt === "gen_img" ? (
              <AspectRatio ratio={1}>
                <ImgPreviewer
                  imgSrc={props.item.content}
                  trigger={
                    <Image
                      objectFit={"contain"}
                      src={props.item.content}
                      cursor={"pointer"}
                      title="Click to preview"
                    />
                  }
                />
              </AspectRatio>
            ) : props.item.opt === "chat" ? (
              <VStack spacing={1}>
                <VStack {...textBoxCfg} w={"100%"}>
                  {props.item.content[0].split("\n").map((l, index) => {
                    return (
                      <Text key={l + index + props.item.id} {...textCfg}>
                        {l}
                      </Text>
                    );
                  })}
                </VStack>
                <VStack {...textBoxCfg} w={"100%"}>
                  {props.item.content[1].split("\n").map((l, index) => {
                    return (
                      <Text key={l + index + props.item.id} {...textCfg}>
                        {l}
                      </Text>
                    );
                  })}
                </VStack>
              </VStack>
            ) : (
              <Box>{props.item.opt === "similar"}</Box>
            )
          }
        </Box>
        <VStack>
          <Tooltip label={"Delete"} placement="right">
            <Image src={deleteIcon} {...btnCfg} onClick={props.delete} />
          </Tooltip>
          {props.item.opt === "gen_img" && (
            <Tooltip label={"Regenerate"} placement="right">
              <Image src={refreshIcon} {...btnCfg} onClick={props.regenImg} />
            </Tooltip>
          )}
        </VStack>
      </Flex>
    );
  }
}

interface MetaphorProps extends MetaphorType {
  history: ExchangeItem[];
  isForeign: boolean;
  isSelected: boolean;
  isActive: boolean;
  isChatting: boolean; //chating state，显示对话输入框
  select: () => void;
}
//喻体对象组件
export default function Metaphor(props: MetaphorProps) {
  const exchangeStore = useExchangeStore();
  const settingStore = useSettingStore();
  const [inputMsg, setMsg] = useState<string>("");
  const [isWaiting, setWaiting] = useState<boolean>(false);

  //重新生成图片
  async function handleRegenImg(id: number) {
    //加载态
    exchangeStore.replaceImg(props.mid, id, {
      opt: "gen_img",
      content: "",
      isLoading: true,
    });
    const targetCulture = props.isForeign ? settingStore.culture : "China";
    const imgUrl = await generateImg(
      settingStore.generateDesc() +
        `Please generate a schematic diagram of the image of the ${props.text} in the context of ${targetCulture} culture, which can make it easy for me to understand it.`
    );
    //再次更换
    exchangeStore.replaceImg(props.mid, id, {
      opt: "gen_img",
      content: imgUrl,
      isLoading: false,
    });
  }

  //发送信息，令回答尽可能简短
  async function handleSend() {
    //加载态
    setMsg("");
    setWaiting(true);
    const loadingId = exchangeStore.addLoading(props.mid, "chat", inputMsg);
    //注意filter用法: 若无{}则不需写return，否则需要显式写return
    const chatMsgs = props.history.filter((item) => item.opt === "chat");
    const context: ChatCompletionMessageParam[] = [];
    chatMsgs.forEach((msg) => {
      context.push({ role: "user", content: msg.content[0] });
      context.push({ role: "assistant", content: msg.content[1] });
    });
    const messages = [
      {
        role: "system",
        content: "This is the context of this conversation.",
      },
      ...context,
      {
        role: "system",
        content:
          "This is the question that the model needs to respond to truthfully, and keep the responses concise and short as possible (without using markdown syntax): ",
      },
      {
        role: "user",
        content: inputMsg,
      },
    ] as ChatCompletionMessageParam[];
    const answer = await chat(messages);
    exchangeStore.deleteItem(props.mid, loadingId);
    exchangeStore.addItem(props.mid, {
      opt: "chat",
      content: [inputMsg, answer],
    });
    setWaiting(false);
  }

  return (
    <VStack w={"100%"}>
      <Flex w={"90%"} align={"center"}>
        {props.normType && (
          <Box
            w={3}
            h={3}
            mr={-3}
            rounded={"full"}
            position={"relative"}
            right={1.5}
            bgColor={normColorMap.get(props.normType)}
          />
        )}
        <Tag
          w={"100%"}
          py={2.5}
          borderWidth={1}
          boxShadow={"base"}
          variant="outline"
          bgColor={
            props.isActive
              ? "orange.200"
              : props.isSelected
              ? "orange.100"
              : "transparent"
          }
          justifyContent={"center"}
          cursor={"pointer"}
          onClick={props.select}
        >
          <TagLabel>
            <Flex align={"center"}>
              <Heading as="h5" size="sm" textAlign={"center"} color={"black"}>
                {props.text}
              </Heading>
            </Flex>
          </TagLabel>
        </Tag>
      </Flex>
      {/* 防止产生额外的spacing */}
      {(props.history.length > 0 || props.isChatting) && (
        <VStack w={"100%"}>
          {props.history.map((e) => {
            return (
              <SlideFade
                key={e.id}
                //好耶,有用!
                in={props.history.findIndex((h) => h.id === e.id) !== -1}
                style={{ width: "100%" }}
              >
                <ExchangeEntry
                  item={e}
                  delete={() => {
                    exchangeStore.deleteItem(props.mid, e.id);
                  }}
                  regenImg={() => handleRegenImg(e.id)}
                />
              </SlideFade>
            );
          })}
          {props.isChatting && (
            <SlideFade in={props.isChatting} style={{ width: "100%" }}>
              <Flex align={"start"} gap={1} w={"100%"}>
                <Box w={5} />
                <InputGroup flexGrow={1} w={300} margin={"auto"}>
                  <Input
                    value={inputMsg}
                    pr={9}
                    size={"sm"}
                    onChange={(e) => setMsg(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label="sendMsg"
                      size={"xs"}
                      mt={-1.5}
                      bgColor={"transparent"}
                      isDisabled={isWaiting || inputMsg === ""}
                      onClick={handleSend}
                      icon={
                        <Image src={send} objectFit={"contain"} w={"1.5em"} />
                      }
                    />
                  </InputRightElement>
                </InputGroup>
                <Image src={deleteIcon} opacity={0} />
              </Flex>
            </SlideFade>
          )}
        </VStack>
      )}
    </VStack>
  );
}
