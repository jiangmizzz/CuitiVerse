import {
  AspectRatio,
  Box,
  // Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  IconButton,
  StackDivider,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Cloud from "./Cloud";
import NetWork from "./Network";
import { Edge, Node, normType } from "../../vite-env";
import { ArrowBackIcon } from "@chakra-ui/icons";
import Painting from "./Painting";
import Noumenon from "./Noumenon";
import { useExploreStore } from "../../stores/explore";

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
const noumenonData = [
  {
    nid: "1",
    name: "Monkey",
    type: "single" as "single" | "combination",
    metaphors: [
      { type: "Identity", count: 1 },
      { type: "Homophony", count: 1 },
      { type: "Homophonic pun", count: 3 },
      { type: "Synonym", count: 2 },
      { type: "Homograph", count: 1 },
      { type: "Satire", count: 1 },
    ] as { type: normType; count: number }[],
    positions: [
      [1, 2, 3, 4],
      [1, 2, 3, 4],
    ],
  },
  {
    nid: "2",
    name: "Monkey / Bee ",
    type: "combination" as "single" | "combination",
    metaphors: [
      { type: "Identity", count: 1 },
      { type: "Homophony", count: 2 },
      { type: "Homophonic pun", count: 0 },
      { type: "Synonym", count: 2 },
      { type: "Homograph", count: 3 },
      { type: "Satire", count: 0 },
    ] as { type: normType; count: number }[],
    positions: [],
  },
];
export default function Extraction() {
  const exploreStore = useExploreStore();
  const [obj, setObj] = useState<string>(""); // 词云图中选中的物像
  const [nid, setNid] = useState<string>(""); //网络图中选中的物像/组合
  const [isList, setList] = useState<boolean>(true); //画作列表态
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pid, setPid] = useState<string>(""); //选中的一幅画作id

  //每次重选物像都将返回列表态
  useEffect(() => {
    setList(true);
  }, [nid]);
  console.log(pid);
  return (
    <HStack
      className="extraction-main app-item-main"
      align={"start"}
      divider={<StackDivider borderColor="gray.200" />}
    >
      <Flex direction={"column"} h={"100%"} gap={1}>
        <HStack>
          <Heading as="h5" size="sm">
            {"Element Feature"}
          </Heading>
          {obj !== "" && (
            <Tooltip label={"Return"} placement="right">
              <IconButton
                color={"gray.500"}
                h={"100%"}
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
        <Box flexGrow={1} bgColor={"gray.200"} overflow={"auto"}>
          {isList ? (
            <Grid templateColumns={"repeat(3, 1fr)"} gap={1} p={1}>
              {[
                //TODO:添加空状态
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
                // 12, 13, 14, 15, 16, 17, 18,19, 20,
              ].map((pic) => {
                return (
                  <GridItem key={pic} bgColor={"gray.300"}>
                    <AspectRatio ratio={1}>
                      <img
                        src={
                          "https://www.freeimg.cn/i/2024/02/26/65dc8760d517a.jpg"
                        }
                      />
                    </AspectRatio>
                  </GridItem>
                );
              })}
            </Grid>
          ) : (
            <Painting />
          )}
        </Box>
      </Flex>
      {/* min-content yyds 用以限制此列宽度被heading部分撑开*/}
      <Flex w={"min-content"} direction={"column"} h={"100%"}>
        <Heading as="h5" size="sm" whiteSpace={"nowrap"} mb={1}>
          {"Element Selection"}
        </Heading>
        {/* 画作中的物像列表 */}
        <Flex
          flexGrow={1}
          overflow={"auto"}
          justify={"center"}
          align={"center"}
        >
          <VStack spacing={5} w={"95%"} h={"100%"}>
            {noumenonData.map((n) => {
              return (
                <Noumenon
                  key={n.nid}
                  nid={n.nid}
                  name={n.name}
                  occurences={n.positions.length}
                  type={n.type}
                  isSeleted={exploreStore.noumenon.nid === n.nid}
                  metaphors={n.metaphors.filter((t) => t.count > 0)}
                  select={() => exploreStore.setNoumenon(n.nid, n.name)}
                />
              );
            })}
          </VStack>
        </Flex>
      </Flex>
    </HStack>
  );
}
