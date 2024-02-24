import { Box, Flex, HStack, Heading, StackDivider } from "@chakra-ui/react";
import "./Extraction.css";
import { useState } from "react";
import Cloud from "./Cloud";
const data = [
  { value: 50, name: "华为" },
  { value: 30, name: "VIVO" },
  { value: 29, name: "OPPO" },
  { value: 28, name: "HONOR" },
  { value: 27, name: "红米" },
  { value: 26, name: "小米" },
  { value: 25, name: "美图" },
  { value: 24, name: "ONEPLUS" },
  { value: 23, name: "魅族" },
  { value: 22, name: "红手指" },
  { value: 21, name: "SAMSUNG" },
  { value: 20, name: "金立" },
  { value: 16, name: "BLACKBERRY" },
  { value: 15, name: "诺基亚" },
  { value: 14, name: "锤子" },
  { value: 13, name: "大疆" },
  { value: 12, name: "361" },
  { value: 11, name: "摩托罗拉" },
  { value: 10, name: "联想" },
  { value: 9, name: "玩家国度" },
];

export default function Extraction() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [obj, setObj] = useState<string>(""); // 物像集中选中的物像
  console.log(obj);
  return (
    <HStack
      className="extraction-main app-item-main"
      align={"start"}
      divider={<StackDivider borderColor="gray.200" />}
    >
      <Flex direction={"column"}>
        <Heading as="h5" size="sm" mb={1}>
          Element Feature
        </Heading>
        {/* 物像集 */}
        <Box border="1px" borderColor="gray.200">
          {obj === "" ? (
            <Cloud
              data={data.map((i) => {
                return { name: i.name, value: i.value, nid: i.name };
              })}
              select={(selected) => setObj(selected)}
            />
          ) : (
            <></>
          )}
        </Box>
        {/* 画幅canvas */}
        <Box flexGrow={1}></Box>
      </Flex>
      {/* min-content yyds */}
      <Box w={"min-content"}>
        <Heading as="h5" size="sm" whiteSpace={"nowrap"}>
          Element Selection
        </Heading>
        <Box minW={0}>
          {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. */}
        </Box>
      </Box>
    </HStack>
  );
}
