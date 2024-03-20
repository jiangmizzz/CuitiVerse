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
} from "@chakra-ui/react";
import {
  MetaphorType,
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
import { chat, generateImg } from "../../utils/ai-requset";
import { getFetcher } from "../../utils/request";
import { useSettingStore } from "../../stores/setting";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import useSWR from "swr";
import Choice from "./Choice";
import { useConditionsStore } from "../../stores/conditions";

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
  const toast = useToast();
  // 选中的喻体
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedM, setSelectedM] = useState<{
    mid: string;
    text: string[];
    isForeign: boolean;
  }>({ mid: "", text: [], isForeign: false });
  const [currentOpt, setCurrentOpt] = useState<optKey | null>(null);
  const [foreignM, setForeignM] = useState<MetaphorType[]>([]);
  const [isTransforming, setTransforming] = useState<boolean>(false);

  //更新选中物像时清空selectedM
  useEffect(() => {
    setSelectedM({ mid: "", text: [], isForeign: false });
  }, [exploreStore.noumenon.nid]);
  //更新本土喻体时清空原转译内容
  useEffect(() => {
    setForeignM([]);
  }, [exploreStore.metaphor.text]);

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
        const imgUrl = await generateImg(
          settingStore.generateDesc() +
            `Please generate a schematic diagram of the image of the ${
              selectedM.text[0] + "(" + selectedM.text[1] + ")"
            } in the context of ${targetCulture} culture, which can make it easy for me to understand it.`
        );
        exchangeStore.deleteItem(mid, loadingId);
        exchangeStore.addItem(mid, {
          opt: "gen_img",
          content: imgUrl,
        });
        break;
      }
      case "chat":
        currentOpt !== "chat" ? setCurrentOpt("chat") : setCurrentOpt(null);
        break;
      case "trans": {
        if (!selectedM.isForeign) {
          setTransforming(true);
          const context = [
            {
              role: "user",
              content: `A symbol in the Chinese context may have multiple symbols with similar meanings in other cultural contexts. Now I need you to provide me with the symbolic word of ${selectedM.text} in the context of ${settingStore.culture} culture.`,
            },
            {
              role: "user",
              content: `The format of your answer is: return at least 1 word, if there are multiple symbolic words, just separate them with commas, use the language of the specified cultural background, and do not include any other redundant sentences.`,
            },
          ] as ChatCompletionMessageParam[];
          const answer = await chat(context);
          setTransforming(false);
          setForeignM(
            answer.split(",").map((text) => {
              return {
                mid: selectedM.mid + text,
                text: [text],
                //TODO:这里的格式要再调整
                emotion: "Neutral",
                normType: "Homograph",
                meaning: ["", ""],
              } satisfies MetaphorType;
            })
          );
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
          {"Culture Source Explore"}
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
              <Tooltip label={opt.op} key={opt.key}>
                <IconButton
                  bgColor={"transparent"}
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
                    isTransforming ||
                    selectedM.mid === "" ||
                    ((opt.key === "def" || opt.key === "similar") &&
                      selectedM.isForeign === true)
                  }
                  onClick={() => optDispatch(opt.key)}
                />
              </Tooltip>
            );
          })}
        </HStack>
      </HStack>
      {/* transform choices */}
      <HStack mt={2} divider={<StackDivider borderColor="gray.200" />}>
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
        divider={<StackDivider borderColor="gray.200" />}
      >
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
            ) : (
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
                        text: m.text,
                        isForeign: false,
                      });
                    }}
                  />
                );
              })
            )
          ) : (
            <Flex h={"100%"} color={"gray.300"} align={"center"}>
              No selected noumenon
            </Flex>
          )}
        </VStack>
        <VStack {...vstackCfg} flex={5}>
          {foreignM.length !== 0 ? (
            foreignM.map((fm) => {
              return (
                <Metaphor
                  key={exploreStore.metaphor.mid + fm.mid}
                  mid={fm.mid}
                  text={fm.text}
                  normType={fm.normType}
                  emotion={fm.emotion}
                  meaning={fm.meaning}
                  history={exchangeStore.exchangesMap.get(fm.mid) ?? []}
                  isForeign={true}
                  isSelected={exploreStore.foreignMetaphor.text === fm.text}
                  isActive={selectedM.mid === fm.mid}
                  isChatting={selectedM.mid === fm.mid && currentOpt === "chat"}
                  select={() => {
                    //take in track
                    exploreStore.setForeign(fm.text);
                    //activate
                    setSelectedM({
                      mid: fm.mid,
                      text: fm.text,
                      isForeign: true,
                    });
                  }}
                />
              );
            })
          ) : isTransforming ? (
            <Center h={"100%"}>
              <Spinner
                speed="0.8s"
                color="gray.300"
                thickness="5px"
                size={"xl"}
              />
            </Center>
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
