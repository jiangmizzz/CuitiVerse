import defineIcon from "../../assets/definition.svg";
import similarIcon from "../../assets/similar.svg";
import gen_imgIcon from "../../assets/image_generation.svg";
import chatIcon from "../../assets/chat.svg";
import transformIcon from "../../assets/transfer.svg";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  StackDivider,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { normType } from "../../vite-env";
import { normColorMap } from "../../stores/maps";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { useState } from "react";

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
type optKey = "def" | "similar" | "gen_img" | "chat" | "trans";
const opts: {
  key: optKey;
  op: string;
  icon: string;
}[] = [
  { key: "def", op: "Get Definition", icon: defineIcon },
  { key: "similar", op: "Similar Images", icon: similarIcon },
  { key: "gen_img", op: "Generate AI Image", icon: gen_imgIcon },
  { key: "chat", op: "Chat", icon: chatIcon },
  { key: "trans", op: "Cultural Transform", icon: transformIcon },
];

// norm type sample
function TypeEntry(props: { type: string }) {
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
  // 选中的喻体
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedM, setSelectedM] = useState<{
    mid: string;
    isForeign: boolean;
  }>({ mid: "", isForeign: false });

  // 操作分发
  function optDispatch(key: optKey) {
    switch (key) {
      case "def":
        break;
      case "similar":
        break;
      case "gen_img":
        break;
      case "chat":
        break;
      case "trans":
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
          <Tooltip label="Colors represent different normTypes" placement="top">
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
        divider={<StackDivider borderColor="gray.200" />}
      >
        <VStack {...vstackCfg}>{/* <Box>111</Box> */}</VStack>
        <VStack {...vstackCfg}></VStack>
      </HStack>
    </Flex>
  );
}
