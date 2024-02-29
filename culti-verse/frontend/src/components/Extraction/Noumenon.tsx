import {
  Badge,
  Box,
  Flex,
  HStack,
  Heading,
  Image,
  Tag,
  VStack,
} from "@chakra-ui/react";
import { NoumenonType } from "../../vite-env";
import combination from "../../assets/group_element.svg";
import { normColorMap } from "../../stores/maps";

interface NoumenonProps extends NoumenonType {
  occurences: number; //画中出现次数
  type: "single" | "combination";
  isSeleted: boolean; //当前是否被选中
  select: () => void;
}

export default function Noumenon(props: NoumenonProps) {
  return (
    <VStack w={"100%"} spacing={0.5} align={"end"}>
      <HStack align={"end"} justify={"space-between"} w={"90%"}>
        {/* 物像出现次数 */}
        {props.type === "single" ? (
          <Badge variant="solid" px={0.5} colorScheme="blackAlpha">
            {props.occurences}
          </Badge>
        ) : (
          <Badge px={0.5} bg={"transparent"} />
        )}
        {/* 喻体分布 */}
        <HStack align={"end"} spacing={1}>
          {props.metaphors.map((m) => {
            return (
              <Box
                key={m.type}
                w={3}
                h={m.count * 3}
                bgColor={normColorMap.get(m.type)}
                opacity={0.7}
              />
            );
          })}
        </HStack>
      </HStack>
      <Flex w={"90%"} align={"center"}>
        {props.type === "combination" && (
          <Image
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
          <Heading as="h6" size="xs" textAlign={"center"}>
            {props.name}
          </Heading>
        </Tag>
      </Flex>
    </VStack>
  );
}
