import {
  Box,
  Center,
  Flex,
  HStack,
  IconButton,
  Spinner,
  StackDivider,
  Text,
  Tooltip,
  VStack,
  useToast,
  Image,
  Heading,
  Divider,
  TabPanels,
  TabPanel,
  Icon,
  Badge,
} from "@chakra-ui/react";
import {
  MetaphorType,
  Norm,
  conditionType,
  emotionType,
  normType,
  optKey,
} from "../../vite-env";
import { emotionIcon, normColorMap, optIconMap } from "../../stores/maps";
import { useEffect, useState } from "react";
import Metaphor from "./Metaphor";
import { useExploreStore } from "../../stores/explore";
import { useExchangeStore } from "../../stores/exchange";
// import { chat, generateImg } from "../../utils/ai-requset";
import { getFetcher } from "../../utils/request";
import { useSettingStore } from "../../stores/setting";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import useSWR from "swr";
import Choice from "./Choice";
import { useConditionsStore } from "../../stores/conditions";
import { Tabs, TabList, Tab } from "@chakra-ui/react";
import { useTransformStore } from "../../stores/transform";
import { CloseIcon } from "@chakra-ui/icons";
import keepIcon from "../../assets/select.svg";
import requireIcon from "../../assets/question.svg";
import { useAiStore } from "../../stores/aiconfig";

const vstackCfg = {
  h: "100%",
  overflow: "auto",
  spacing: 5,
};

const normTypes: normType[] = [
  "Iconic",
  "Homophony",
  "Homophonic pun",
  "Synonym",
  "Homograph",
  "Satire",
];
const emotionTypes: emotionType[] = ["Positive", "Neutral", "Negative"];
const opts: {
  key: optKey;
  op: string;
  icon: string;
}[] = [
  { key: "gen_img", op: "Generate AI Image", icon: optIconMap.get("gen_img")! },
  { key: "chat", op: "Chat", icon: optIconMap.get("chat")! },
  { key: "trans", op: "Cultural Transform", icon: optIconMap.get("trans")! },
];

const conditions: conditionType[] = [
  "element",
  "rhetoric",
  "symbol",
  "custom",
  "emotion",
];

// norm type sample
function TypeEntry(props: { type: normType }) {
  return (
    <Flex align={"center"} gap={0.4}>
      <Box
        w={2}
        h={2}
        rounded={"full"}
        bgColor={normColorMap.get(props.type)}
      />
      <Text fontSize="sm">{props.type}</Text>
    </Flex>
  );
}

export default function Exchange() {
  const exploreStore = useExploreStore();
  const exchangeStore = useExchangeStore();
  const settingStore = useSettingStore();
  const conditionsStore = useConditionsStore();
  const tranformStore = useTransformStore();
  const aiStore = useAiStore();
  const toast = useToast();
  // 选中的喻体
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedM, setSelectedM] = useState<{
    mid: string;
    text: string[];
    meaning: string[];
    element?: string[];
    isForeign: boolean;
  }>({ mid: "", text: [], meaning: [], isForeign: false });
  const [currentOpt, setCurrentOpt] = useState<optKey | null>(null);
  const [isTransforming, setTransforming] = useState<boolean>(false);
  //当前被选中的tab索引和对应的tid
  const [selectTab, setTab] = useState<{ index: number; tid: string }>({
    index: 0,
    tid: "",
  });

  //更新选中物像时清空selectedM
  useEffect(() => {
    setSelectedM({ mid: "", text: [], meaning: [], isForeign: false });
  }, [exploreStore.noumenon.nid]);
  //更新本土喻体时重置selectedTab
  useEffect(() => {
    if (tranformStore.tabsMap.has(exploreStore.metaphor.mid)) {
      const tabs = tranformStore.tabsMap.get(exploreStore.metaphor.mid)!.tabs;
      setTab({ index: 0, tid: tabs[0].tid });
    } else {
      setTab({ index: 0, tid: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exploreStore.metaphor.mid]);

  // 获取喻体数据
  const { data: metaphorsData, isLoading: metaphorsLoading } = useSWR<
    MetaphorType[]
  >(
    // null,
    exploreStore.noumenon.nid !== ""
      ? `/pic/metaphors?nid=${exploreStore.noumenon.nid}&name=${exploreStore.noumenon.text}`
      : null,
    getFetcher<MetaphorType[]>
  );

  // 操作分发
  async function optDispatch(key: optKey) {
    setCurrentOpt(key);
    const mid = selectedM.mid;
    switch (key) {
      case "def": {
        const loadingId = exchangeStore.addLoading(mid, "def", "");
        const res = await getFetcher<string>(
          `/pic/meaning?nid=${exploreStore.noumenon.nid}&mid=${mid}`
        );
        exchangeStore.deleteItem(mid, loadingId);
        exchangeStore.addItem(mid, { opt: "def", content: res });
        break;
      }
      case "similar": {
        toast({
          title: "Please stay tuned...",
          status: "info",
          duration: 1500,
          position: "top",
          isClosable: true,
        });
        break;
      }
      case "gen_img": {
        const loadingId = exchangeStore.addLoading(mid, "gen_img", "");
        const targetCulture = selectedM.isForeign
          ? settingStore.culture
          : "China";
        const imgUrl = await aiStore.generateImg(
          settingStore.generateDesc() +
            `Please generate a schematic diagram of the image of the main symbol: ${
              selectedM.text[0] + "(" + selectedM.text[1] + ")"
            } ${
              selectedM.element
                ? "which relate slightly to " +
                  selectedM.element[0] +
                  "(" +
                  selectedM.element[1] +
                  ")"
                : ""
            } in the context of ${targetCulture} culture, which can make it easy for me to understand it.`
        );
        //生成对图像的描述
        const descContext = [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Please use ${
                  settingStore.language
                } to summarize the content of this picture (tips on perspective of understanding: ${
                  selectedM.text[0]
                }-${selectedM.text[1]}, ${
                  selectedM.element
                    ? selectedM.element[0] + "-" + selectedM.element[1]
                    : ""
                }).`,
              },
              { type: "image_url", image_url: { url: imgUrl, detail: "auto" } },
            ],
          },
        ] as ChatCompletionMessageParam[];
        const desc = await aiStore.chat(descContext, true);
        exchangeStore.deleteItem(mid, loadingId);
        exchangeStore.addItem(mid, {
          opt: "gen_img",
          content: [imgUrl, desc],
        });
        break;
      }
      case "chat":
        currentOpt !== "chat" ? setCurrentOpt("chat") : setCurrentOpt(null);
        break;
      case "trans": {
        //一定是chinese symbol才能转译
        if (
          //最多5个tab
          !tranformStore.tabsMap.has(selectedM.mid) ||
          tranformStore.tabsMap.get(selectedM.mid)!.tabs.length < 5
        ) {
          //转译条件检查
          if (conditionsStore.isNoKeeping()) {
            toast({
              title: "Check your conditions!",
              description: "Have not selected keeping conditions",
              variant: "subtle",
              status: "info",
              duration: 1500,
              position: "top",
              isClosable: true,
            });
            break;
          } else if (conditionsStore.isNoReq()) {
            toast({
              title: "Check your conditions!",
              description: "Have not selected required conditions",
              variant: "subtle",
              status: "info",
              duration: 1500,
              position: "top",
              isClosable: true,
            });
            break;
          } else if (conditionsStore.isRepeated()) {
            toast({
              title: "Check your conditions!",
              description:
                "Can not select one condition in both keeping and required sides",
              variant: "subtle",
              status: "info",
              duration: 2000,
              position: "top",
              isClosable: true,
            });
            break;
          }

          //开始转译
          //1. 确定keeping和requirment的attr
          setTransforming(true);
          const keepings = Object.keys(conditionsStore.keeping).filter(
            (key) => conditionsStore.keeping[key as conditionType] === true
          ) as conditionType[];
          const requirement = Object.keys(conditionsStore.requirement).filter(
            (key) => conditionsStore.requirement[key as conditionType] === true
          ) as conditionType[];
          const newTid = tranformStore.addTab(selectedM.mid, {
            culture: settingStore.culture,
            keeping: keepings as conditionType[],
            requirement: requirement as conditionType[],
          });
          //手动设置tid，默认每次转化后转换到最新生成的tab内容
          if (newTid === "1") {
            setTab({ index: 0, tid: newTid });
          } else {
            setTab({
              index: tranformStore.tabsMap.get(selectedM.mid)!.tabs.length - 1,
              tid: newTid,
            });
          }
          //2.获取 explore 中对应的值，形成 prompt
          let conditions: string = "";
          let questions: string = `In the context of ${settingStore.culture}'s culture, to form norms that meet the above conditions: `;
          keepings.map((k, index) => {
            switch (k) {
              case "element": {
                conditions += `Condition${index + 1}: ${k} is ${
                  exploreStore.noumenon.text[0]
                }(${exploreStore.noumenon.text[1]}).\n`;
                break;
              }
              case "symbol": {
                conditions += `Condition${index + 1}: ${k} is ${
                  exploreStore.metaphor.text[0]
                }(${exploreStore.metaphor.text[1]}).\n`;
                break;
              }
              case "custom": {
                conditions += `Condition${index + 1}: ${k} of the symbol is ${
                  exploreStore.metaphor.meaning[1]
                }.\n`;
                break;
              }
              case "emotion": {
                conditions += `Condition${index + 1}: ${k} of the symbol is ${
                  exploreStore.metaphor.emotion
                }.\n`;
                break;
              }
              case "rhetoric": {
                conditions += `Condition${
                  index + 1
                }: ${k} used in transformation is ${
                  exploreStore.metaphor.normType
                }.\n`;
                break;
              }
            }
          });
          requirement.map((r) => {
            switch (r) {
              case "element":
              case "symbol": {
                questions += `Are there any ${r}s?\n`;
                break;
              }
              case "custom": {
                questions += `What are the customs of these norms?\n`;
                break;
              }
              case "rhetoric": {
                questions += `What rhetoric are used in these norm?\n`;
                break;
              }
              case "emotion": {
                questions += `What emotions do these norms express?\n`;
                break;
              }
            }
          });

          const context = [
            {
              //背景描述
              role: "user",
              content: `In Chinese culture, there is a 'Norm', which consists of the following form:
              {
                element: 猴,Monkey; 
                rhetoric: Homophony; 
                symbol: 侯,Marquis;
                custom: Monkey(猴 hóu) and marquis(侯 hóu) sound the same in Chinese, wishing each other to be promoted as officials;
                emotion: Positive.
              }`,
            },
            {
              //提供转译中的自变量(keepings)和因变量(required)
              role: "user",
              content: `Now our conditions and questions are as follows:\n
              **Conditions**: ${conditions}; **Questions**: ${questions}`,
            },
            {
              //返回格式规定+枚举值rhetoric中各个值的含义解释
              role: "user",
              content: `Now, please answer me in the form of norms table (list as many such norms as possible, at least one; using json format).\n
              And please meet the following format: \n
              <code>
              norms: {
                element: string[2]; //element[0] is in ${settingStore.language} , element[1] is in English
                symbol: string[2]; //symbol[0] is in ${settingStore.language}, symbol[1] is in English
                emotion: "Positive" | "Neutral" | "Negative";
                rhetoric: "Iconic"| "Homophony"| "Homophonic pun"| "Synonym" | "Homograph" | "Satire";
                custom: string[2]; //custom[0] is in ${settingStore.language}, symbol[1] is in English
              }[]
              </code>\n
              (Here are the definitions of the options of rehtoric, which help you to select a suitable one among them: 
              Iconic: Symbol is the same as the original meaning of element;
              Homophony: Two different words have the same pronunciation but different meanings, origins, or spelling; 
              Homophonic pun: A type of pun that exploits the fact that words sound similar but have different meanings; 
              Synonym: A word that means exactly or nearly the same as another word; 
              Homograph: A word that shares the same form as another word but has a different meaning; 
              Satire: A word with a satirical meaning often reflects negative aspects of society; 
              )
              `,
            },
            {
              //最后再对格式进行提示
              role: "user",
              content:
                "Note: do not include any other redundant sentences or words in your answer, only json format (even without ```json``` or ```typescript```)!",
            },
          ] as ChatCompletionMessageParam[];
          const answer = await aiStore.chat(context);
          // console.log(answer);
          const normTable: { norms: Norm[] } = JSON.parse(answer);
          //3. 更新fsMap
          tranformStore.setFs(
            selectedM.mid,
            newTid,
            normTable.norms.map((norm) => {
              return {
                mid:
                  selectedM.mid +
                  "/" +
                  newTid +
                  "/" +
                  keepings.toString() +
                  questions.toString() +
                  JSON.stringify(norm), //必须是唯一的mid --> 包含所有的生成条件和生成结果(对内容签名)
                text: [norm.symbol[0], norm.symbol[1]],
                normType: norm.rhetoric,
                emotion: norm.emotion,
                meaning: [norm.custom[0], norm.custom[1]],
                element: [norm.element[0], norm.element[1]],
              };
            })
          );
          setTransforming(false);
        } else {
          toast({
            title: "Tab bar is full",
            description: "Please delete one of them and try again!",
            status: "warning",
            duration: 2500,
            position: "top",
            isClosable: true,
          });
        }
        break;
      }
    }
  }

  return (
    <Flex
      className="exchange-main app-item-main"
      px={"0.7em"}
      direction={"column"}
    >
      {/* view title */}
      <Flex w={"100%"} mb={1}>
        <Heading as="h5" size="sm" flexGrow={4} textAlign={"center"}>
          {"Source Culture Explore"}
        </Heading>
        <Heading as="h5" size="sm" flexGrow={5} textAlign={"center"}>
          {"Culture Transfer"}
        </Heading>
      </Flex>
      {/* samples */}
      <HStack justify={"space-between"}>
        <VStack align={"start"} spacing={0}>
          <HStack spacing={1.5}>
            <Text as={"b"} fontSize={"sm"}>
              {"Rhetoric Type: "}
            </Text>
            {normTypes.map((type) => {
              return <TypeEntry key={type} type={type} />;
            })}
          </HStack>
          <HStack align={"center"}>
            <Text as={"b"} fontSize={"sm"}>
              {"Custom: "}
            </Text>
            <Image src={optIconMap.get("def")} />
            <Text as={"b"} fontSize={"sm"} ml={2}>
              {"Emotion Type: "}
            </Text>
            {emotionTypes.map((e) => {
              return (
                <Flex align={"center"} gap={0.4} key={e}>
                  <Image src={emotionIcon.get(e)} />
                  <Text fontSize="sm">{e}</Text>
                </Flex>
              );
            })}
          </HStack>
        </VStack>
        <HStack spacing={0.5} divider={<StackDivider borderColor="gray.200" />}>
          {opts.map((opt) => {
            return (
              <Tooltip label={opt.op} key={opt.key} placement="top">
                <IconButton
                  // bgColor={"transparent"}
                  shadow={"base"}
                  rounded={"full"}
                  size={"sm"}
                  aria-label={opt.key}
                  icon={
                    <img
                      style={{ width: "1.2em", objectFit: "contain" }}
                      src={opt.icon}
                    />
                  }
                  isDisabled={
                    (opt.key === "trans" && isTransforming) ||
                    selectedM.mid === "" ||
                    (opt.key === "trans" && selectedM.isForeign === true)
                  }
                  onClick={() => optDispatch(opt.key)}
                />
              </Tooltip>
            );
          })}
        </HStack>
      </HStack>
      {/* transform choices */}
      <HStack mt={2} divider={<StackDivider borderColor="gray.400" />}>
        <HStack flexGrow={4} justify={"space-between"}>
          {conditions.slice(1).map((c) => {
            return (
              <Choice
                key={c}
                text={c}
                isRequired={false}
                isChecked={conditionsStore.keeping[c] !== false}
                onToggle={() => {
                  const newCondition = { ...conditionsStore.keeping };
                  newCondition[c] = !conditionsStore.keeping[c];
                  conditionsStore.setCondition({
                    keeping: {
                      ...newCondition,
                    },
                  });
                }}
              />
            );
          })}
        </HStack>
        <HStack flexGrow={5} justify={"space-between"}>
          {conditions.map((c) => {
            return (
              <Choice
                key={c}
                text={c}
                isRequired={true}
                isChecked={conditionsStore.requirement[c] !== false}
                onToggle={() => {
                  const newCondition = { ...conditionsStore.requirement };
                  newCondition[c] = !conditionsStore.requirement[c];
                  conditionsStore.setCondition({
                    requirement: {
                      ...newCondition,
                    },
                  });
                }}
              />
            );
          })}
        </HStack>
      </HStack>
      <Divider opacity={1} variant={"dashed"} mt={0.5} />
      <HStack
        mt={2}
        flexGrow={1}
        overflow={"auto"}
        divider={<StackDivider borderColor="gray.400" />}
      >
        {/* chinese symbols */}
        <VStack {...vstackCfg} flex={4}>
          {exploreStore.noumenon.nid !== "" ? (
            metaphorsLoading ? (
              <Center h={"100%"}>
                <Spinner
                  speed="0.8s"
                  color="gray.300"
                  thickness="5px"
                  size={"xl"}
                />
              </Center>
            ) : metaphorsData?.length !== 0 ? (
              (metaphorsData ?? []).map((m) => {
                return (
                  <Metaphor
                    key={m.mid}
                    mid={m.mid}
                    text={m.text}
                    normType={m.normType}
                    emotion={m.emotion}
                    meaning={m.meaning}
                    history={exchangeStore.exchangesMap.get(m.mid) ?? []}
                    isForeign={false}
                    isSelected={exploreStore.metaphor.mid === m.mid}
                    isActive={selectedM.mid === m.mid}
                    isChatting={
                      selectedM.mid === m.mid && currentOpt === "chat"
                    }
                    select={() => {
                      //take in track
                      exploreStore.setMetaphor({
                        mid: m.mid,
                        text: m.text,
                        normType: m.normType,
                        emotion: m.emotion,
                        meaning: m.meaning,
                      });
                      //activate
                      setSelectedM({
                        mid: m.mid,
                        text: [...m.text],
                        meaning: [...m.meaning],
                        isForeign: false,
                      });
                    }}
                  />
                );
              })
            ) : (
              <Flex h={"100%"} color={"gray.300"} align={"center"}>
                The element has no symbols
              </Flex>
            )
          ) : (
            <Flex h={"100%"} color={"gray.300"} align={"center"}>
              No selected noumenon
            </Flex>
          )}
        </VStack>
        {/* foreign symbols */}
        <VStack {...vstackCfg} flex={5}>
          {tranformStore.tabsMap.has(exploreStore.metaphor.mid) ? (
            <Flex
              direction={"column"}
              w={"100%"}
              h={"100%"}
              overflow={"auto"}
              gap={5}
            >
              {/* 最多显示5个tab */}
              <Tabs
                w={"100%"}
                size={"sm"}
                variant="enclosed"
                index={selectTab.index}
                mb={-4}
              >
                <TabList>
                  {tranformStore.tabsMap
                    .get(exploreStore.metaphor.mid)!
                    .tabs.map((tab, index, arr) => {
                      return (
                        <Tab
                          key={exploreStore.metaphor.mid + tab.tid}
                          pl={1.5}
                          onClick={() => setTab({ index: index, tid: tab.tid })}
                        >
                          <HStack spacing={1}>
                            <Flex
                              p={1}
                              w={5}
                              h={5}
                              alignItems={"center"}
                              justify={"center"}
                              rounded={"full"}
                              _hover={{ backgroundColor: "gray.100" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                tranformStore.deleteTab(
                                  exploreStore.metaphor.mid,
                                  tab.tid
                                );
                                if (index !== 0) {
                                  //删除的不是首个tab
                                  setTab({ index: 0, tid: arr[0].tid });
                                } else if (arr.length > 1) {
                                  //删的是首个tab，并且由渲染条件可以保证不是最后一个tab(否则不渲染)
                                  setTab({ index: 0, tid: arr[1].tid });
                                } else {
                                  setTab({ index: 0, tid: "" });
                                }
                              }}
                            >
                              <Icon as={CloseIcon} boxSize={2.5} />
                            </Flex>
                            <Text>{"Res" + tab.tid}</Text>
                          </HStack>
                        </Tab>
                      );
                    })}
                </TabList>
                <TabPanels>
                  {tranformStore.tabsMap
                    .get(exploreStore.metaphor.mid)!
                    .tabs!.map((i) => {
                      return (
                        <TabPanel key={exploreStore.metaphor.mid + i.tid}>
                          <Flex align={"start"} justify={"space-between"}>
                            <VStack
                              align={"start"}
                              spacing={0}
                              flex={1}
                              fontSize={"sm"}
                            >
                              <HStack alignItems={"start"}>
                                <Image
                                  src={keepIcon}
                                  mt={1}
                                  w={3}
                                  objectFit={"contain"}
                                />
                                <b>{"keepings: "}</b>
                                <Text>
                                  {i.keeping.toString().replace(/,/g, ", ")}
                                </Text>
                              </HStack>
                              <HStack alignItems={"start"}>
                                <Image
                                  src={requireIcon}
                                  mt={1}
                                  w={3}
                                  objectFit={"contain"}
                                />{" "}
                                <b>{"required: "}</b>
                                <Text>
                                  {i.requirement.toString().replace(/,/g, ", ")}
                                </Text>
                              </HStack>
                            </VStack>
                            <Badge variant="outline">{i.culture}</Badge>
                          </Flex>
                        </TabPanel>
                      );
                    })}
                </TabPanels>
              </Tabs>
              {isTransforming &&
              !tranformStore.fsMap.has(
                exploreStore.metaphor.mid + selectTab.tid
              ) ? ( //加载某个tab时其他tab内容不受影响
                <Center h={"100%"}>
                  <Spinner
                    speed="0.8s"
                    color="gray.300"
                    thickness="5px"
                    size={"xl"}
                  />
                </Center>
              ) : (
                // wait for the useEffect ending

                (
                  tranformStore.fsMap.get(
                    exploreStore.metaphor.mid + selectTab.tid
                  ) ?? []
                ).map((fm) => {
                  return (
                    <Metaphor
                      key={fm.mid}
                      mid={fm.mid}
                      text={fm.text}
                      normType={fm.normType}
                      emotion={fm.emotion}
                      meaning={fm.meaning}
                      element={fm.element}
                      history={exchangeStore.exchangesMap.get(fm.mid) ?? []}
                      isForeign={true}
                      isSelected={exploreStore.foreignMetaphor.mid === fm.mid}
                      isActive={selectedM.mid === fm.mid}
                      isChatting={
                        selectedM.mid === fm.mid && currentOpt === "chat"
                      }
                      select={() => {
                        //take in track
                        exploreStore.setForeign({
                          mid: fm.mid,
                          text: fm.text,
                          normType: fm.normType,
                          emotion: fm.emotion,
                          meaning: fm.meaning,
                          element: fm.element,
                        });
                        //activate
                        setSelectedM({
                          mid: fm.mid,
                          text: [...fm.text],
                          meaning: [...fm.meaning],
                          element: [...fm.element!],
                          isForeign: true,
                        });
                      }}
                    />
                  );
                })
              )}
            </Flex>
          ) : (
            <Flex h={"100%"} color={"gray.300"} align={"center"}>
              Not translated yet
            </Flex>
          )}
        </VStack>
      </HStack>
    </Flex>
  );
}
