import {
  AspectRatio,
  Box,
  Text,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  IconButton,
  StackDivider,
  Tooltip,
  VStack,
  Image,
  Center,
  Spinner,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { useState } from "react";
import Cloud from "./Cloud";
import NetWork from "./Network";
import {
  CloudData,
  Edge,
  Node,
  PaintingType,
  seriesType,
} from "../../vite-env";
import { ArrowBackIcon } from "@chakra-ui/icons";
import Painting from "./Painting";
import Noumenon from "./Noumenon";
import { useExploreStore } from "../../stores/explore";
import useSWR from "swr";
import { getFetcher, origin } from "../../utils/request";
import { normColorMap, seriesIcon } from "../../stores/maps";
import Choice from "../Exchange/Choice";
import { useConditionsStore } from "../../stores/conditions";

//值得记录的写法+1
type SimplePic = Pick<
  PaintingType,
  Exclude<keyof PaintingType, "noumenons" | "combinations">
>;

const series: seriesType[] = ["Animal", "Plant", "Fruit", "Other"];

const picData1: PaintingType = {
  pid: "14",
  name: ["江帆亭", "Jiangfan Pavilion"],
  src: "https://www.freeimg.cn/i/2024/02/26/65dc8760d517a.jpg",
  noumenons: [
    {
      nid: "0",
      name: "landscape",
      positions: [
        [
          0.18494167923927307, 0.016178250312805176, 0.7066805958747864,
          0.9711191654205322,
        ],
      ],
      metaphors: [{ type: "Iconic", count: 1 }],
    },
  ],
  combinations: [],
};

export default function Extraction() {
  const exploreStore = useExploreStore();
  const conditionsStore = useConditionsStore();
  const [obj, setObj] = useState<string>(""); // 词云图中选中的物像id
  const [nid, setNid] = useState<string>(""); //网络图中选中的物像/组合
  const [isList, setIsList] = useState<boolean>(true); //画作列表态
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pid, setPid] = useState<string>(""); //选中的一幅画作id

  //获取词云图数据
  const { data: cloudData, isLoading: cloudLoading } = useSWR<CloudData[]>(
    "/objset/cloud",
    getFetcher<CloudData[]>
  );
  //获取网络图数据
  const { data: networkData, isLoading: networkLoading } = useSWR<{
    nodes: Node[];
    edges: Edge[];
  }>(
    obj !== "" ? `/objset/get/${obj}` : null,
    getFetcher<{ nodes: Node[]; edges: Edge[] }>
  );
  //获取画作列表
  const { data: picListData, isLoading: picListLoading } = useSWR<SimplePic[]>(
    nid !== "" ? `/pic/list/${nid}` : null,
    getFetcher<SimplePic[]>
  );
  //获取一幅画作
  const { data: picData, isLoading: picLoading } = useSWR<PaintingType>(
    pid !== "" ? `/pic/get/${pid}` : null,
    getFetcher<PaintingType>
  );

  return (
    <HStack
      className="extraction-main app-item-main"
      align={"start"}
      divider={<StackDivider borderColor="gray.200" />}
    >
      <Flex direction={"column"} align={"center"} h={"100%"} gap={1}>
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
        <Box border="1px" borderColor="gray.200" w={250} h={220}>
          {obj === "" ? (
            cloudLoading ? (
              <Center h={"100%"}>
                <Spinner speed="0.8s" color="gray.300" />
              </Center>
            ) : (
              <Flex direction={"column"} justify={"space-between"}>
                <HStack flexGrow={1}>
                  {series.map((s) => {
                    return (
                      <Flex align={"center"} gap={0.4} key={s}>
                        <Image
                          w={4}
                          objectFit={"cover"}
                          src={seriesIcon.get(s)}
                        />
                        <Text fontSize="xs">{s}</Text>
                      </Flex>
                    );
                  })}
                </HStack>
                <Cloud
                  data={cloudData ? cloudData : []}
                  select={(selected) => setObj(selected)}
                />
              </Flex>
            )
          ) : networkLoading ? (
            <Center h={"100%"}>
              <Spinner speed="0.8s" color="gray.300" />
            </Center>
          ) : (
            <NetWork
              nodes={networkData ? networkData.nodes : []}
              edges={networkData ? networkData.edges : []}
              select={(nid) => {
                setNid(nid);
                setIsList(true);
              }}
            />
          )}
        </Box>
        {/* 画幅canvas */}
        <Box flexGrow={1} w={"100%"} bgColor={"gray.100"} overflow={"auto"}>
          {isList ? (
            picListLoading ? (
              <Center>
                <Spinner
                  speed="0.8s"
                  color="gray.300"
                  thickness="5px"
                  size={"xl"}
                />
              </Center>
            ) : picListData ? (
              <Grid templateColumns={"repeat(3, 1fr)"} gap={1} p={1}>
                {picListData.map((pic) => {
                  return (
                    <GridItem key={pic.pid} bgColor={"gray.300"}>
                      <AspectRatio ratio={1}>
                        <Tooltip label={pic.name[0] + " " + pic.name[1]}>
                          <Image
                            src={origin + pic.src}
                            cursor={"pointer"}
                            _hover={{
                              filter: "brightness(1.2)",
                            }}
                            onClick={() => {
                              setPid(pic.pid);
                              setIsList(false);
                              exploreStore.setNoumenon("", "");
                            }}
                          />
                        </Tooltip>
                      </AspectRatio>
                    </GridItem>
                  );
                })}
              </Grid>
            ) : (
              <Flex
                h={"100%"}
                color={"gray.300"}
                align={"center"}
                justifyContent={"center"}
              >
                {nid === ""
                  ? "No selected noumenon"
                  : "No matching paintings found"}
              </Flex>
            )
          ) : picLoading ? (
            <Center h={"100%"}>
              <Spinner
                speed="0.8s"
                color="gray.300"
                thickness="5px"
                size={"xl"}
              />
            </Center>
          ) : (
            <Painting
              {...(picData ? { ...picData } : { ...picData1 })}
              returnList={() => setIsList(true)}
            />
          )}
        </Box>
      </Flex>
      {/* heading */}
      {/* min-content yyds 用以限制此列宽度被heading部分撑开*/}
      <Flex w={"min-content"} direction={"column"} h={"100%"}>
        <Heading as="h5" size="sm" whiteSpace={"nowrap"} mb={1} px={2}>
          {"Element Selection"}
        </Heading>
        <VStack spacing={0} align={"start"}>
          <HStack spacing={1.5}>
            <Badge variant="solid" colorScheme="blackAlpha">
              {2}
            </Badge>
            <Text fontSize={"sm"}>{"Image Frequency"}</Text>
          </HStack>
          <HStack spacing={1.5}>
            <Badge
              variant="solid"
              rounded={"full"}
              h={4}
              w={4}
              fontSize={"11px"}
              textAlign={"center"}
              bgColor={normColorMap.get("Homophony")}
            >
              {1}
            </Badge>
            <Text fontSize={"sm"}>{"Rhetoric Frequency"}</Text>
          </HStack>
        </VStack>
        <Flex w={"100%"} direction={"column"} align={"center"} my={2}>
          <Choice
            text={"element"}
            isRequired={false}
            isChecked={conditionsStore.keeping.element !== false}
            onToggle={() =>
              conditionsStore.setCondition({
                keeping: {
                  ...conditionsStore.keeping,
                  element: !conditionsStore.keeping.element,
                },
              })
            }
          />
          <Divider opacity={1} variant={"dashed"} mt={0.5} />
        </Flex>

        {/* 画作中的物像列表 */}
        <Flex
          flexGrow={1}
          overflow={"auto"}
          justify={"center"}
          align={"center"}
        >
          <VStack spacing={5} w={"95%"} h={"100%"}>
            {!isList ? (
              picLoading ? (
                <Center h={"100%"}>
                  <Spinner
                    speed="0.8s"
                    color="gray.300"
                    thickness="4px"
                    size={"lg"}
                  />
                </Center>
              ) : (
                [
                  ...picData!.noumenons.map((n) => {
                    return (
                      <Noumenon
                        key={n.nid}
                        nid={n.nid}
                        name={n.name}
                        occurences={n.positions}
                        type={"single"}
                        paintingSrc={picData!.src}
                        isSeleted={exploreStore.noumenon.nid === n.nid}
                        metaphors={n.metaphors.filter((t) => t.count > 0)}
                        select={() => exploreStore.setNoumenon(n.nid, n.name)}
                      />
                    );
                  }),
                  ...picData!.combinations.map((n) => {
                    return (
                      <Noumenon
                        key={n.nid}
                        nid={n.nid}
                        name={n.name}
                        occurences={[]}
                        type={"combination"}
                        paintingSrc=""
                        isSeleted={exploreStore.noumenon.nid === n.nid}
                        metaphors={n.metaphors.filter((t) => t.count > 0)}
                        select={() => exploreStore.setNoumenon(n.nid, n.name)}
                      />
                    );
                  }),
                ]
              )
            ) : (
              <Flex
                h={"100%"}
                color={"gray.300"}
                align={"center"}
                textAlign={"center"}
              >
                No selected painting
              </Flex>
            )}
          </VStack>
        </Flex>
      </Flex>
    </HStack>
  );
}
