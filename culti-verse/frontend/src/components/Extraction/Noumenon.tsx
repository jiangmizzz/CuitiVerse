import {
  AspectRatio,
  Badge,
  Box,
  Flex,
  HStack,
  Heading,
  Image as CImage,
  Tag,
  VStack,
} from "@chakra-ui/react";
import { NoumenonType } from "../../vite-env";
import combination from "../../assets/group_element.svg";
import { normColorMap } from "../../stores/maps";
import { useEffect, useRef } from "react";
import { origin } from "../../utils/request";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination } from "swiper";
//添加指示点至swiper组件中
SwiperCore.use([Pagination]);

interface NoumenonProps extends NoumenonType {
  occurences: number[][]; //画中出现的位置
  type: "single" | "combination";
  paintingSrc: string; //画作src
  isSeleted: boolean; //当前是否被选中
  select: () => void;
}

export default function Noumenon(props: NoumenonProps) {
  // const [refs, setRefs] = useState<RefObject<HTMLCanvasElement>[]>([]);
  const refs = useRef<HTMLCanvasElement[]>([]);

  //初始化
  useEffect(() => {
    //只有single才需要显示物像图
    if (props.type === "single") {
      const img = new Image();
      img.src = origin + props.paintingSrc;
      img.onload = function () {
        const imageWidth_o = img.width; //原图像大小
        const imageHeight_o = img.height;
        props.occurences.map((pos, index) => {
          const canvas = refs.current[index];
          const context: CanvasRenderingContext2D = canvas.getContext("2d")!;
          const cropImgWidth = imageWidth_o * pos[2]; //裁切后图像的大小
          const cropImgHeight = imageHeight_o * pos[3];
          let cropMax = 0;
          //保持图像在画布中居中
          if (cropImgWidth > cropImgHeight) {
            cropMax = cropImgWidth;
          } else {
            cropMax = cropImgHeight;
          }
          canvas.width = cropMax;
          canvas.height = cropMax;
          canvas.style.width = "100%"; //显示尺寸
          canvas.style.height = "100%";
          //绘制图像
          context.drawImage(
            img,
            imageWidth_o * pos[0],
            imageHeight_o * pos[1],
            cropImgWidth,
            cropImgHeight,
            (cropMax - cropImgWidth) / 2,
            (cropMax - cropImgHeight) / 2,
            cropImgWidth,
            cropImgHeight
          );
        });
      };
    }
  }, [props.occurences, props.paintingSrc, props.type]);

  return (
    <VStack w={"100%"} spacing={0.5} align={"end"}>
      <HStack align={"end"} justify={"space-between"} w={"90%"}>
        {/* 物像出现次数 */}
        {props.type === "single" ? (
          <Badge variant="solid" px={0.5} colorScheme="blackAlpha">
            {props.occurences.length}
          </Badge>
        ) : (
          <Badge px={0.5} bg={"transparent"} />
        )}
        {/* 喻体分布 */}
        <HStack align={"end"} spacing={1}>
          {props.metaphors.map((m) => {
            return (
              <Badge
                key={m.type}
                variant="solid"
                rounded={"full"}
                h={4}
                w={4}
                fontSize={"11px"}
                textAlign={"center"}
                bgColor={normColorMap.get(m.type)}
              >
                {m.count}
              </Badge>
            );
          })}
        </HStack>
      </HStack>
      {props.type === "single" && (
        <AspectRatio ratio={1} w={"90%"}>
          <Box p={1} rounded={"md"} borderWidth={1} borderColor={"gray.200"}>
            <Swiper
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#EDF2F7",
              }}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              autoplay={false}
            >
              {props.occurences.map((_, index) => {
                return (
                  <SwiperSlide key={_.toString()}>
                    <canvas
                      ref={(ele) => {
                        if (ele) {
                          //第一次为null, 需要条件判断
                          refs.current[index] = ele;
                        }
                      }}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Box>
        </AspectRatio>
      )}
      <Flex w={"90%"} align={"center"}>
        {props.type === "combination" && (
          <CImage
            src={combination}
            // 值得记录的写法*1
            w={5}
            h={5}
            mr={-5}
            zIndex={2}
            position={"relative"}
            left={-3.5}
            bgColor={"white"}
            rounded={"full"}
          />
        )}
        <Tag
          w={"100%"}
          py={2.5}
          bgColor={props.isSeleted ? "orange.100" : "transparent"}
          borderWidth={1}
          boxShadow={"base"}
          justifyContent={"center"}
          cursor={"pointer"}
          onClick={props.select}
        >
          <Flex direction={"column"}>
            <Heading as="h6" size="xs" textAlign={"center"}>
              {props.name[0]}
            </Heading>
            <Heading as="h6" size="xs" textAlign={"center"}>
              {props.name[1]}
            </Heading>
          </Flex>
        </Tag>
      </Flex>
    </VStack>
  );
}
