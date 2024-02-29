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
} from "@chakra-ui/react";
import { MetaphorType, normType, optKey } from "../../vite-env";
import { normColorMap, optIconMap } from "../../stores/maps";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import Metaphor from "./Metaphor";
import { useExploreStore } from "../../stores/explore";
import { useExchangeStore } from "../../stores/exchange";

const vstackCfg = {
  flex: 1,
  h: "100%",
  overflow: "auto",
  spacing: 5,
};

const normTypes: normType[] = [
  "Identity",
  "Homophony",
  "Homophonic pun",
  "Synonym",
  "Homograph",
  "Satire",
];
const opts: {
  key: optKey;
  op: string;
  icon: string;
}[] = [
  { key: "def", op: "Get Definition", icon: optIconMap.get("def")! },
  { key: "similar", op: "Similar Images", icon: optIconMap.get("similar")! },
  { key: "gen_img", op: "Generate AI Image", icon: optIconMap.get("gen_img")! },
  { key: "chat", op: "Chat", icon: optIconMap.get("chat")! },
  { key: "trans", op: "Cultural Transform", icon: optIconMap.get("trans")! },
];

const metaphorsData: MetaphorType[] = [
  {
    mid: "1",
    text: "Zhuhou",
    normType: "Homophony",
  },
  {
    mid: "2",
    text: "Monkey",
    normType: "Identity",
  },
  {
    mid: "3",
    text: "Monkey King",
    normType: "Synonym",
  },
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
  // 选中的喻体
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedM, setSelectedM] = useState<{
    mid: string;
    isForeign: boolean;
  }>({ mid: "", isForeign: false });
  const [currentOpt, setCurrentOpt] = useState<optKey | null>(null);
  const [foreignM, setForeignM] = useState<MetaphorType[]>([]);
  const [isTransforming, setTransforming] = useState<boolean>(false);
  useEffect(() => {
    setSelectedM({ mid: "", isForeign: false });
  }, [exploreStore.noumenon.nid]);
  useEffect(() => {
    if (!selectedM.isForeign) {
      setForeignM([]);
    }
  }, [selectedM]);

  // 操作分发
  function optDispatch(key: optKey) {
    setCurrentOpt(key);
    switch (key) {
      case "def":
        break;
      case "similar":
        break;
      case "gen_img":
        break;
      case "chat":
        currentOpt !== "chat" ? setCurrentOpt("chat") : setCurrentOpt(null);
        break;
      case "trans":
        setTransforming(true);
        //获取喻体转译
        setTimeout(() => {
          setTransforming(false);
          setForeignM([...metaphorsData]);
        }, 2000);

        break;
    }
    // console.log(key);
  }

  return (
    <Flex
      className="exchange-main app-item-main"
      px={"1em"}
      direction={"column"}
      // style={{ width: "750px" }}
    >
      <HStack justify={"space-between"}>
        <HStack spacing={1.5}>
          {normTypes.map((type) => {
            return <TypeEntry key={type} type={type} />;
          })}
          <Tooltip
            label="Colors represent different type of norms"
            placement="top"
          >
            <QuestionOutlineIcon color={"gray.300"} />
          </Tooltip>
        </HStack>
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
      <HStack
        mt={2}
        flexGrow={1}
        overflow={"auto"}
        divider={<StackDivider borderColor="gray.200" />}
      >
        <VStack {...vstackCfg}>
          {exploreStore.noumenon.nid !== "" ? (
            metaphorsData.map((m) => {
              return (
                <Metaphor
                  key={m.mid}
                  mid={m.mid}
                  text={m.text}
                  history={exchangeStore.exchangesMap.get(m.mid) ?? []}
                  isSelected={exploreStore.metaphor.mid === m.mid}
                  isActive={selectedM.mid === m.mid}
                  isChatting={selectedM.mid === m.mid && currentOpt === "chat"}
                  select={() => {
                    //take in track
                    exploreStore.setMetaphor({
                      mid: m.mid,
                      text: m.text,
                      normType: m.normType,
                    });
                    //activate
                    setSelectedM({ mid: m.mid, isForeign: false });
                  }}
                  normType={m.normType}
                />
              );
            })
          ) : (
            <Flex h={"100%"} color={"gray.300"} align={"center"}>
              No selected noumenon
            </Flex>
          )}
        </VStack>
        <VStack {...vstackCfg}>
          {foreignM.length !== 0 ? (
            foreignM.map((fm) => {
              //TODO:换掉数据mock
              const fmid = fm.mid + "foreign";
              const text = fm.text + "'f";
              return (
                <Metaphor
                  key={exploreStore.metaphor.mid + fm.mid}
                  mid={fmid}
                  text={text}
                  history={exchangeStore.exchangesMap.get(fmid) ?? []}
                  isSelected={exploreStore.foreignMetaphor.text === fm.text}
                  isActive={selectedM.mid === fmid}
                  isChatting={selectedM.mid === fmid && currentOpt === "chat"}
                  select={() => {
                    //take in track
                    exploreStore.setForeign(text);
                    //activate
                    setSelectedM({ mid: fmid, isForeign: true });
                  }}
                  normType={fm.normType}
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
