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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";
import { ExchangeItem, MetaphorType } from "../../vite-env";
import {
  emotionIcon,
  faqs,
  normColorMap,
  optIconMap,
  textBoxCfg,
} from "../../stores/maps";
import deleteIcon from "../../assets/delete.svg";
import refreshIcon from "../../assets/refresh.svg";
import send from "../../assets/send_msg.svg";
import { useExchangeStore } from "../../stores/exchange";
import { useEffect, useState } from "react";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import ImgPreviewer from "../ImgPreviewer/ImgPreviewer";
import { chat, generateImg, translate } from "../../utils/ai-requset";
import { useSettingStore } from "../../stores/setting";
import { ChevronRightIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useExploreStore } from "../../stores/explore";

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
              <VStack spacing={1}>
                <AspectRatio w={"100%"} ratio={1} bgColor={"gray.100"}>
                  <Center>
                    <Spinner {...spincfg} size={"xl"} thickness="5px" />
                  </Center>
                </AspectRatio>
                <Center {...textBoxCfg} w={"100%"}>
                  <Spinner {...spincfg} my={3} />
                </Center>
              </VStack>
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
              <VStack spacing={1}>
                <AspectRatio w={"100%"} ratio={1}>
                  <ImgPreviewer
                    imgSrc={props.item.content[0]}
                    trigger={
                      <Image
                        objectFit={"contain"}
                        src={props.item.content[0]}
                        cursor={"pointer"}
                        title="Click to preview"
                      />
                    }
                  />
                </AspectRatio>
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
          <Tooltip
            label={
              props.item.opt === "def" ? "Custom can not delete" : "Delete"
            }
            placement="right"
          >
            <Image
              src={deleteIcon}
              {...btnCfg}
              onClick={() => {
                if (props.item.opt !== "def") {
                  props.delete();
                }
              }}
              cursor={props.item.opt === "def" ? "not-allowed" : "pointer"}
            />
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
  const exploreStore = useExploreStore();
  const [inputMsg, setMsg] = useState<string>("");
  const [isWaiting, setWaiting] = useState<boolean>(false);
  const [isProducing, setProducing] = useState<{ id: number; state: boolean }>({
    id: 0,
    state: false,
  });

  useEffect(() => {
    //加载定义(第一条)
    if (!exchangeStore.exchangesMap.has(props.mid)) {
      exchangeStore.addItem(props.mid, {
        opt: "def",
        content: props.meaning[0] + `\n` + props.meaning[1],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        `Please generate a schematic diagram of the image of the main symbol: ${
          props.text[0] + "(" + props.text[1] + ")"
        } ${
          props.element
            ? "which relate slightly to " +
              props.element[0] +
              "(" +
              props.element[1] +
              ")"
            : ""
        } in the context of ${targetCulture} culture, which can make it easy for me to understand it.`
    );
    const descContext = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Please use ${
              settingStore.culture
            }'s language to summarize the content of this picture (tips on perspective of understanding: ${
              props.text[0]
            }-${props.text[1]}, ${
              props.element ? props.element[0] + "-" + props.element[1] : ""
            }).`,
          },
          { type: "image_url", image_url: { url: imgUrl, detail: "auto" } },
        ],
      },
    ] as ChatCompletionMessageParam[];
    const desc = await chat(descContext, true);
    exchangeStore.replaceImg(props.mid, id, {
      opt: "gen_img",
      content: [imgUrl, desc],
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
        content:
          // "This conversation is about traditional Chinese painting.
          "This is the context of this conversation.",
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

  //使用模板提问（进行翻译后填充）
  async function fillWithTemplate(id: number) {
    setMsg("loading...");
    setProducing({ id: id, state: true });
    let question = ``;
    switch (id) {
      case 1:
        question = `What exactly is ${props.text[1]}?`;
        break;
      case 2:
        question = `Can you please explain the specific relationship between ${
          props.element ? props.element[1] : exploreStore.noumenon.text[1]
        } and ${props.text[1]} in ${
          props.isForeign ? settingStore.culture : "China"
        }'s culture?`;
        break;
      case 3:
        question = `I want to know more about ${props.text[1]} in ${
          props.isForeign ? settingStore.culture : "China"
        }'s culture.`;
        break;
    }
    setMsg(await translate(settingStore.culture, question));
    setProducing({ id: 0, state: false });
  }

  return (
    <Flex w={"100%"} gap={2} align={"start"}>
      {/* 对于foreign symbol，添加 element 部分 */}
      {props.isForeign && (
        <Tag
          flexGrow={1}
          borderWidth={1}
          borderColor={"gray.300"}
          py={2.5}
          // px={0}
          bgColor={"transparent"}
        >
          <TagLabel>
            <Flex align={"center"}>
              <Text fontSize="md" textAlign={"center"} color={"black"}>
                {props.element![0] + " / " + props.element![1]}
              </Text>
            </Flex>
          </TagLabel>
        </Tag>
      )}
      <VStack flexGrow={4}>
        {/* tag */}
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
                ? "gray.200"
                : props.isSelected
                ? "gray.100"
                : "transparent"
            }
            justifyContent={"center"}
            cursor={"pointer"}
            onClick={props.select}
          >
            <TagLabel>
              <Flex align={"center"}>
                <Heading as="h5" size="sm" textAlign={"center"} color={"black"}>
                  {props.text[0] + " / " + props.text[1]}
                </Heading>
              </Flex>
            </TagLabel>
          </Tag>
          <Image
            src={emotionIcon.get(props.emotion)}
            w={4}
            ml={-4}
            position={"relative"}
            left={2}
            objectFit={"contain"}
          />
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
                  <InputGroup
                    flexGrow={1}
                    margin={"auto"}
                    position={"relative"} //防止menulist被其他symbol的Rhetoric Type和Emotion Type遮挡
                    zIndex={10}
                  >
                    <InputLeftElement>
                      <Menu closeOnSelect={false}>
                        <MenuButton
                          as={IconButton}
                          aria-label="FAQ"
                          title="templates"
                          icon={<HamburgerIcon />}
                          color={"gray.400"}
                          size={"xs"}
                          mt={-1.5}
                          bgColor={"transparent"}
                        />
                        <MenuList fontSize={"xs"}>
                          {faqs.map((faq) => {
                            return (
                              <MenuItem
                                onClick={() => fillWithTemplate(faq.id)}
                                key={faq.id}
                                isDisabled={isProducing.state}
                                icon={
                                  isProducing.state &&
                                  isProducing.id === faq.id ? (
                                    <Spinner size="xs" speed="1s" />
                                  ) : (
                                    <Icon as={ChevronRightIcon} boxSize={4} />
                                  )
                                }
                              >
                                {faq.content}
                              </MenuItem>
                            );
                          })}
                        </MenuList>
                      </Menu>
                    </InputLeftElement>
                    <Input
                      value={inputMsg}
                      pr={9}
                      size={"sm"}
                      onChange={(e) => setMsg(e.target.value)}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          !e.shiftKey &&
                          inputMsg !== "" &&
                          !isWaiting
                        ) {
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
    </Flex>
  );
}
