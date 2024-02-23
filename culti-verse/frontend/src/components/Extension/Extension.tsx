import {
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  InputGroup,
  InputRightElement,
  Tag,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import send from "../../assets/send_msg.svg";

export default function Extension() {
  const [inputMsg, setMsg] = useState<string>("");
  const [isWaiting, setWaiting] = useState<boolean>(false);

  //发送chat内容
  function handleSend() {
    setWaiting(true);
    setTimeout(() => {
      setWaiting(false);
    }, 3000);
  }
  //范式验证
  function checkNorm(opt: string) {
    switch (opt) {
      case "Appropriate":
        break;
      case "Emotion":
        break;
      case "Inference":
        break;
    }
  }

  return (
    <Flex className="extension-main app-item-main" direction={"column"}>
      <VStack flex={1}></VStack>
      <Box w={280}>
        <HStack mb={1}>
          {["Appropriate", "Emotion", "Inference"].map((option) => {
            return (
              <Tag
                key={option}
                // boxShadow={"base"}
                variant="outline"
                _hover={{
                  cursor: "pointer",
                  boxShadow: "md",
                }}
                borderWidth={1}
                colorScheme="black"
                onClick={() => checkNorm(option)}
              >
                {option}
              </Tag>
            );
          })}
        </HStack>
        <InputGroup>
          <Textarea
            rows={3}
            fontSize={"sm"}
            pr={"3.5rem"}
            resize={"vertical"}
            minH={"6em"}
            placeholder="Message ChatGPT..."
            value={inputMsg}
            onChange={(e) => {
              setMsg(e.target.value);
            }}
          />
          <InputRightElement m={1.5} mr={3}>
            <Flex align={"end"} style={{ height: "100%" }}>
              <IconButton
                aria-label="sendMsg"
                icon={
                  <Image
                    src={send}
                    objectFit={"contain"}
                    w={"1.5em"}
                    cursor={isWaiting ? "not-allowed" : "pointer"}
                    onClick={handleSend}
                  />
                }
              />
            </Flex>
          </InputRightElement>
        </InputGroup>
      </Box>
    </Flex>
  );
}
