import {
  Box,
  // Button,
  Flex,
  HStack,
  Heading,
  IconButton,
  StackDivider,
  Tooltip,
} from "@chakra-ui/react";
import "./Extraction.css";
import { useState } from "react";
import Cloud from "./Cloud";
import NetWork from "./Network";
import { Edge, Node } from "../../vite-env";
import { ArrowBackIcon } from "@chakra-ui/icons";
const cloudData = [
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
const networkData: { nodes: Node[]; edges: Edge[] } = {
  nodes: [
    { id: "1", value: 2, label: "Algie" },
    { id: "2", value: 31, label: "Alston" },
    { id: "3", value: 12, label: "Barney" },
    { id: "4", value: 16, label: "Coley" },
    { id: "5", value: 17, label: "Grant" },
    { id: "6", value: 15, label: "Langdon" },
    { id: "7", value: 6, label: "Lee" },
    { id: "8", value: 5, label: "Merlin" },
    { id: "9", value: 30, label: "Mick" },
    { id: "10", value: 18, label: "Tod" },
  ],
  edges: [
    { from: "2", to: "8", value: 3, title: "3 emails per week" },
    { from: "2", to: "9", value: 5, title: "5 emails per week" },
    { from: "2", to: "10", value: 1, title: "1 emails per week" },
    { from: "4", to: "6", value: 8, title: "8 emails per week" },
    { from: "5", to: "7", value: 2, title: "2 emails per week" },
    { from: "4", to: "5", value: 1, title: "1 emails per week" },
    { from: "9", to: "10", value: 2, title: "2 emails per week" },
    { from: "2", to: "3", value: 6, title: "6 emails per week" },
    { from: "3", to: "9", value: 4, title: "4 emails per week" },
    { from: "5", to: "3", value: 1, title: "1 emails per week" },
    { from: "2", to: "7", value: 4, title: "4 emails per week" },
  ].map((edge) => {
    return { ...edge, id: edge.from + "+" + edge.to };
  }),
};
export default function Extraction() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [obj, setObj] = useState<string>(""); // 词云图中选中的物像
  const [nid, setNid] = useState<string>(""); //网络图中选中的物像/组合
  console.log(nid);
  return (
    <HStack
      className="extraction-main app-item-main"
      align={"start"}
      divider={<StackDivider borderColor="gray.200" />}
    >
      <Flex direction={"column"}>
        <HStack mb={1}>
          <Heading as="h5" size="sm" mb={1}>
            {"Element Feature"}
          </Heading>
          {obj !== "" && (
            <Tooltip label={"Return"} placement="right">
              <IconButton
                color={"gray.500"}
                // rounded={"full"}
                size={"xs"}
                aria-label={"return"}
                icon={<ArrowBackIcon />}
                onClick={() => setObj("")}
              />
            </Tooltip>
          )}
        </HStack>
        {/* 物像集 */}
        <Box border="1px" borderColor="gray.200">
          {obj === "" ? (
            <Cloud
              data={cloudData.map((i) => {
                return { name: i.name, value: i.value, nid: i.name };
              })}
              select={(selected) => setObj(selected)}
            />
          ) : (
            <NetWork
              nodes={networkData.nodes}
              edges={networkData.edges}
              select={(nid) => setNid(nid)}
            />
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
          pariatur. Excepteur sint occaecat cupicloudDatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. */}
        </Box>
      </Box>
    </HStack>
  );
}
