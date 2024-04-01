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
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Cloud from "./Cloud";
import NetWork from "./Network";
import {
  CloudData,
  Edge,
  Node,
  NoumenonType,
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
import { translate } from "../../utils/ai-requset";

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
      name: ["亭子", "landscape"],
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
  const [cloudType, setCloudType] = useState<seriesType>("Animal");
  const [obj, setObj] = useState<string>(""); // 词云图中选中的物像id
  const [nid, setNid] = useState<string>(""); //网络图中选中的物像/组合
  const [isList, setIsList] = useState<boolean>(true); //画作列表态
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pid, setPid] = useState<string>(""); //选中的一幅画作id
  //单个物像列表
  const [noumenons, setNoumenons] = useState<
    (NoumenonType & {
      positions: number[][];
    })[]
  >([]);
  //组合物像列表
  const [combinations, setCombinations] = useState<
    (NoumenonType & {
      elements: string[];
    })[]
  >([]);
  const [canvasMutating, setMutating] = useState<boolean>(false);

  //画作更新时同步刷新选择的物像
  useEffect(() => {
    exploreStore.setNoumenon("", []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pid]);

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
    getFetcher<PaintingType>,
    { revalidateOnFocus: false }
  );

  //更换画作时清空
  useEffect(() => {
    setMutating(true);
    setTimeout(() => {
      setMutating(false);
    }, 500);
    setNoumenons([]);
    setCombinations([]);
  }, [pid]);

  //数据更新时获取新的物像列表和物像组合列表
  useEffect(() => {
    if (picData !== undefined) {
      setMutating(true);
      // setMutating(true);
      setNoumenons(picData.noumenons);
      setCombinations(picData.combinations);
      // setMutating(false);
      setTimeout(() => {
        setMutating(false);
      }, 500);
    }
  }, [picData]);

  interface AddElementRes {
    newNoumenon: NoumenonType;
    combinations: (NoumenonType & {
      //组合物象
      elements: string[]; //组合中包含的nid
    })[];
  }
  //新添加一个物像
  async function addElement(text: string, position: number[]): Promise<void> {
    const usText = await translate("United States", text); //转译成英文
    const nList: string = noumenons.map((n) => n.nid).toString() + "," + usText;
    const res = await getFetcher<AddElementRes>("/pic/add/" + nList);

    //添加物像的几种可能
    let existed = false;
    const positionsArray: number[][] = []; //新位置数组
    noumenons.forEach((n) => {
      if (n.nid === res.newNoumenon.nid || n.name[1] === usText) {
        existed = true;
        n.positions.forEach((pos) => {
          positionsArray.push(pos);
        });
        positionsArray.push(position);
        //console.log(positionsArray);
      }
    });
    //1. 该物像已经存在, position+1
    if (existed) {
      setNoumenons(
        noumenons.map((n) => {
          if (n.nid === res.newNoumenon.nid || n.name[1] === usText) {
            return { ...n, positions: [...positionsArray] };
          } else {
            return { ...n };
          }
        })
      );
    } else if (res.newNoumenon.nid === "") {
      //2. 物像不在库中
      const zhText = await translate("China", usText);
      setNoumenons([
        ...noumenons,
        {
          nid: usText,
          name: [zhText, usText],
          metaphors: [],
          positions: [[...position]],
        },
      ]);
    } else {
      //3. 匹配到了新物像
      setNoumenons([
        ...noumenons,
        {
          ...res.newNoumenon,
          positions: [[...position]],
        },
      ]);
      //如有组合则更新
      if (res.combinations.length > 0) {
        setCombinations([...res.combinations]);
      }
    }
    setMutating(true);
    //令canvas延时出现，避免绘制尺寸异常
    setTimeout(() => {
      setMutating(false);
    }, 300);
  }

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
                <HStack
                  flexGrow={1}
                  align={"center"}
                  pt={1}
                  // pl={2}
                  px={1}
                  justify={"space-around"}
                >
                  {series.map((s) => {
                    return (
                      <Button
                        variant={"outline"}
                        key={s}
                        size={"sm"}
                        px={0.5}
                        h={"2em"}
                        bgColor={cloudType === s ? "gray.100" : "transparent"}
                        onClick={() => setCloudType(s)}
                      >
                        <Flex align={"center"} gap={0.2}>
                          <Image
                            w={4}
                            objectFit={"cover"}
                            src={seriesIcon.get(s)}
                          />
                          <Text fontSize="xs">{s}</Text>
                        </Flex>
                      </Button>
                    );
                  })}
                </HStack>
                <Cloud
                  data={
                    cloudData
                      ? cloudData.filter((data) => data.type === cloudType)
                      : []
                  }
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
              <Center h={"100%"}>
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
          ) : //此处最后一个条件用来确保canvas首次渲染时字体不会异常放大
          picLoading || canvasMutating || noumenons.length === 0 ? (
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
              {...(picData
                ? { ...picData, noumenons: noumenons }
                : { ...picData1 })}
              returnList={() => setIsList(true)}
              addElement={(text, position) => addElement(text, position)}
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
            <Badge
              variant="solid"
              h={4}
              w={4}
              fontSize={"11px"}
              fontFamily={"Arial"}
              textAlign={"center"}
              colorScheme="blackAlpha"
            >
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
              fontFamily={"Arial"}
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
            {pid !== "" ? (
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
                  ...noumenons.map((n) => {
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
                        select={() =>
                          exploreStore.setNoumenon(n.nid, [...n.name])
                        }
                      />
                    );
                  }),
                  ...combinations.map((n) => {
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
                        select={() =>
                          exploreStore.setNoumenon(n.nid, [...n.name])
                        }
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
