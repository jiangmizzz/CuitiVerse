import {
  Box,
  Center,
  Flex,
  Image,
  Spinner,
  VStack,
  Text,
  CloseButton,
} from "@chakra-ui/react";
import { ExtensionMsg } from "../../vite-env";
import robot from "../../assets/chat_gpt.svg";
import user from "../../assets/user_avatar.svg";
import { textBoxCfg } from "../../stores/maps";

export default function Message(props: ExtensionMsg & { delete: () => void }) {
  return (
    <Flex
      width={"100%"}
      {...(props.sender === "user"
        ? { direction: "row-reverse", pl: 4 }
        : { direction: "row", pr: 4 })}
      gap={1}
      align={"start"}
    >
      <Image
        src={props.sender === "user" ? user : robot}
        rounded={"full"}
        w={5}
        objectFit={"contain"}
      />
      <Box
        {...textBoxCfg}
        p={3}
        borderColor={
          props.sender === "user" ? "gray.200" : "rgb(223, 171, 137)"
        }
        flexGrow={props.isLoading ? 1 : 0}
      >
        <CloseButton
          rounded={"full"}
          w={5}
          h={5}
          size={"sm"}
          position={"relative"}
          top={-2.5}
          mb={-2.5}
          {...(props.sender === "user"
            ? { mr: "auto", color: "gray.400", left: -2.5 }
            : { ml: "auto", color: "rgb(223, 171, 137)", right: -2.5 })}
          isDisabled={props.isLoading}
          onClick={props.delete}
        />
        {props.isLoading ? (
          <Center>
            <Spinner
              speed="0.8s"
              color="orange.200"
              emptyColor="gray.300"
              opacity={0.7}
              size={"lg"}
              thickness="4px"
            />
          </Center>
        ) : (
          <VStack spacing={2} align={"start"}>
            {props.content.split("\n").map((para, index) => {
              return (
                <Text
                  fontSize={"sm"}
                  color={"gray.600"}
                  lineHeight={"1.2em"}
                  key={para + index}
                >
                  {para}
                </Text>
              );
            })}
          </VStack>
        )}
      </Box>
    </Flex>
  );
}
