/**
 * 画幅展示部分，基于canvas实现
 */

import { useEffect, useRef, useState } from "react";
import { PaintingType } from "../../vite-env";
import {
  Center,
  Flex,
  Text,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tooltip,
  VStack,
  Divider,
  As,
} from "@chakra-ui/react";
import { getFetcher, origin } from "../../utils/request";
import ImgPreviewer from "../ImgPreviewer/ImgPreviewer";
import { ArrowBackIcon, ChatIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import useSWR from "swr";

interface PaintingProps extends PaintingType {
  returnList: () => void;
}
interface PaintingInfo {
  name: string[];
  material: string[];
  color: string[];
  size: string[];
  dynasty: string[];
  author: string[];
  collection: string[];
}
const btnCfg = {
  size: "sm",
  rounded: "full",
  bgColor: "gray.200",
};
const attrCfg: {
  as: As;
  whiteSpace: string;
} = {
  as: "b",
  whiteSpace: "nowrap",
};

export default function Painting(props: PaintingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showToolBar, setShow] = useState<boolean>(false);
  const [openModal, setOpen] = useState<boolean>(false);
  //渲染canvas
  useEffect(() => {
    const canvas = canvasRef.current!;
    const context: CanvasRenderingContext2D = canvas.getContext("2d")!;
    const fontSize = 16;

    const img = new Image();
    img.src = origin + props.src;
    //设置 Canvas 的显示大小与实际大小一致

    img.onload = function () {
      // 清空画布               //画布大小
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);

      const imageWidth = img.width; //图像大小
      const imageHeight = img.height;
      const clientWidth = canvas.clientWidth; //显示区域大小
      // const clientHeight = canvas.clientHeight;

      /**计算合适的显示尺寸 */
      canvas.width = imageWidth; //实际尺寸
      canvas.height = imageHeight;
      canvas.style.width = "240px"; //显示尺寸
      canvas.style.height = `${(imageHeight / imageWidth) * 240}px`;

      const scaleX = canvas.width / clientWidth;
      context.font = `bold ${fontSize * scaleX}px Arial`;
      // console.log(scaleX, scaleY);

      // 绘制图片到画布
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      //绘制矩形选框
      context.lineWidth = 1.5 * scaleX;
      context.strokeStyle = "red";
      for (const n of props.noumenons) {
        const width = context.measureText(n.name[1]).width;
        for (const rect of n.positions) {
          //绘制
          context.fillStyle = "rgba(200, 0, 0, 0.5)";
          const fontPlus = fontSize + 2;
          context.fillRect(
            rect[0] * imageWidth,
            rect[1] * imageHeight - fontPlus * scaleX,
            width + 2 * scaleX,
            fontPlus * scaleX
          );
          context.fillStyle = "white";
          context.fillText(
            n.name[1],
            rect[0] * imageWidth + scaleX,
            rect[1] * imageHeight - 2 * scaleX
          );
          //绘制选框
          context.strokeRect(
            rect[0] * imageWidth, //x
            rect[1] * imageHeight, //y
            rect[2] * imageWidth, //w
            rect[3] * imageHeight //h
          );
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: infoData, isLoading: infoLoading } = useSWR<PaintingInfo>(
    openModal ? `/pic/info/${props.pid}` : null,
    getFetcher<PaintingInfo>
  );
  return (
    <VStack
      h={"100%"}
      w={250}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      spacing={0}
    >
      <Modal
        size={"lg"}
        isOpen={openModal}
        onClose={() => setOpen(false)}
        isCentered
      >
        <ModalOverlay />
        {infoLoading ? (
          <Center h={"100%"}>
            <Spinner
              speed="0.8s"
              color="gray.300"
              thickness="4px"
              size={"lg"}
            />
          </Center>
        ) : (
          infoData && (
            <ModalContent>
              <ModalHeader py={3} bgColor={"gray.200"} borderTopRadius={"md"}>
                {infoData.name[0] + " / " + infoData.name[1]}
              </ModalHeader>
              <ModalCloseButton />
              <Divider mb={3} />
              <ModalBody>
                <VStack align={"start"}>
                  <HStack align={"start"}>
                    <Text {...attrCfg}>{"材料 (Material): "}</Text>
                    <Text>
                      {infoData.material[0] + " / " + infoData.material[1]}
                    </Text>
                  </HStack>
                  <HStack align={"start"}>
                    <Text {...attrCfg}>{"色彩 (Color): "}</Text>
                    <Text>{infoData.color[0] + " / " + infoData.color[1]}</Text>
                  </HStack>
                  <HStack align={"start"}>
                    <Text {...attrCfg}>{"尺寸 (Size): "}</Text>
                    <Text>{infoData.size[0] + " / " + infoData.size[1]}</Text>
                  </HStack>
                  <HStack align={"start"}>
                    <Text {...attrCfg}>{"朝代 (Dynasty): "}</Text>
                    <Text>
                      {infoData.dynasty[0] + " / " + infoData.dynasty[1]}
                    </Text>
                  </HStack>
                  <HStack align={"start"}>
                    <Text {...attrCfg}>{"作者 (Author): "}</Text>
                    <Text>
                      {infoData.author[0] + " / " + infoData.author[1]}
                    </Text>
                  </HStack>
                  <HStack align={"start"}>
                    <Text {...attrCfg}>{"馆藏地 (Collection): "}</Text>
                    <Text>
                      {infoData.collection[0] + " / " + infoData.collection[1]}
                    </Text>
                  </HStack>
                </VStack>
              </ModalBody>

              <ModalFooter></ModalFooter>
            </ModalContent>
          )
        )}
      </Modal>
      {/* toolbar */}
      <Flex
        h={10}
        mb={-10}
        opacity={showToolBar ? 0.6 : 0}
        ml={"auto"}
        bgColor={"white"}
        borderBottomLeftRadius={"md"}
        align={"center"}
        px={1}
        mr={"5px"}
        gap={1}
      >
        <Tooltip label="Return to list" placement="top">
          <IconButton
            {...btnCfg}
            aria-label={"return to list"}
            icon={<ArrowBackIcon />}
            onClick={props.returnList}
          />
        </Tooltip>

        <ImgPreviewer
          imgSrc={origin + props.src}
          trigger={
            <Flex>
              <Tooltip label="Preview the picture" placement="top">
                <IconButton
                  {...btnCfg}
                  aria-label={"preview"}
                  icon={<ViewIcon />}
                />
              </Tooltip>
            </Flex>
          }
        />

        <Tooltip label="Get info about it" placement="top">
          <IconButton
            {...btnCfg}
            aria-label={"get info"}
            icon={<ChatIcon />}
            onClick={() => setOpen(true)}
          />
        </Tooltip>
        <Tooltip label="Select by yourself" placement="top">
          <IconButton
            {...btnCfg}
            aria-label={"frame selection"}
            icon={<EditIcon />}
          />
        </Tooltip>
      </Flex>
      <Flex
        w={250}
        h={"100%"}
        // align={"center"}
        justify={"center"}
        overflowX={"hidden"}
      >
        <canvas ref={canvasRef} />
      </Flex>
    </VStack>
  );
}
