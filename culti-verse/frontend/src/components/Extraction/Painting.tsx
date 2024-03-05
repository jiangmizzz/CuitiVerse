/**
 * 画幅展示部分，基于canvas实现
 */

import { useEffect, useRef, useState } from "react";
import { PaintingType } from "../../vite-env";
import {
  Button,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { origin } from "../../utils/request";
import ImgPreviewer from "../ImgPreviewer/ImgPreviewer";
import { ArrowBackIcon, ChatIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";

interface PaintingProps extends PaintingType {
  returnList: () => void;
}

const btnCfg = {
  size: "sm",
  rounded: "full",
  bgColor: "gray.200",
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
        const width = n.name.length;
        for (const rect of n.positions) {
          //绘制
          context.fillStyle = "rgba(200, 0, 0, 0.5)";
          const fontPlus = fontSize + 2;
          context.fillRect(
            rect[0] * imageWidth,
            rect[1] * imageHeight - fontPlus * scaleX,
            width * fontPlus * scaleX,
            fontPlus * scaleX
          );
          context.fillStyle = "white";
          context.fillText(
            n.name,
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
  return (
    <VStack
      h={"100%"}
      w={250}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      spacing={0}
    >
      <Modal isOpen={openModal} onClose={() => setOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>123</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
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
