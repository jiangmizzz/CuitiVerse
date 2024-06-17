// import { useState } from "react";
import "./App.css";
import "./assets/reset.css";
import headLogo from "./assets/logo.svg";
import Setting from "./components/Setting/Setting";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import Extraction from "./components/Extraction/Extraction";
import Exchange from "./components/Exchange/Exchange";
import Extension from "./components/Extension/Extension";
import { useAiStore } from "./stores/aiconfig";
import { useState } from "react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

const boxCfg = {
  borderWidth: "1px",
  rounded: "md",
  boxShadow: "base",
  overflow: "hidden",
  fontFamily: "Times New Roman",
};

function BoxHeader(props: { title: string; position: "l" | "m" | "r" }) {
  return (
    <Center
      //*需要将h改为minH，否则header部分高度会被下方内容压窄
      minH={"2em"}
      bg={
        props.position === "l"
          ? "#9B8267"
          : props.position === "r"
          ? "#4E7063"
          : ""
      }
      bgGradient={
        props.position === "m" ? "linear(to-l, #4E7063, #E3E3E3, #9B8267)" : ""
      }
    >
      <Heading
        as="h4"
        size={props.position === "r" ? "sm" : "md"}
        whiteSpace={"nowrap"}
        color={props.position === "m" ? "black" : "white"}
      >
        {props.title}
      </Heading>
    </Center>
  );
}

function App() {
  const aiStore = useAiStore();
  const [configValue, setConfig] = useState<{
    apiKey: string;
    organization: string;
  }>({
    apiKey: "",
    organization: "",
  });

  return (
    <>
      <div className="main">
        <div className="app-header">
          <div className="app-logo">
            <img
              src={headLogo}
              style={{
                height: "2.3em",
                objectFit: "cover",
              }}
            />
          </div>
          <Setting />
        </div>
        {aiStore.config.apiKey == "" ? (
          <Flex justify={"center"} align={"center"}>
            <Card maxW={"lg"} padding={5} mt={10}>
              <CardHeader minW={0}>
                <Center flexDirection={"column"}>
                  <Heading size={"lg"} mb={2}>
                    {"Your profile configuration"}
                  </Heading>
                  <Text
                    textAlign={"justify"}
                    color={"gray.500"}
                    fontFamily={"Times New Roman"}
                  >
                    {
                      "In order to use the built-in AI function of this system normally, you need to configure the API key and organizationID you created on the openai platform."
                    }
                  </Text>
                </Center>
              </CardHeader>
              <CardBody>
                <VStack spacing={3}>
                  <FormControl isRequired>
                    <FormLabel fontWeight={"bold"}>{"API key"}</FormLabel>
                    <Input
                      // size={"sm"}
                      placeholder="Enter your API key"
                      value={configValue.apiKey}
                      onChange={(e) =>
                        setConfig({ ...configValue, apiKey: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontWeight={"bold"}>
                      <HStack>
                        <Text>{"Organization ID"}</Text>
                        <Text fontSize={"xs"} color={"gray.400"}>
                          {"(optional)"}
                        </Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      // size={"sm"}
                      placeholder="Enter the organization ID if you have joined one"
                      value={configValue.organization}
                      onChange={(e) =>
                        setConfig({
                          ...configValue,
                          organization: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                </VStack>
              </CardBody>
              <CardFooter justify={"end"}>
                <Button
                  variant="solid"
                  colorScheme="teal"
                  rightIcon={<ArrowForwardIcon />}
                  isDisabled={configValue.apiKey === ""}
                  onClick={() =>
                    aiStore.setConfig(
                      configValue.apiKey,
                      configValue.organization
                    )
                  }
                >
                  {"Confirm & Continue"}
                </Button>
              </CardFooter>
            </Card>
          </Flex>
        ) : (
          <Flex m={"0.5em"} flexGrow={1} gap={2} minH={0}>
            <Flex direction={"column"} {...boxCfg}>
              <BoxHeader title="Source Culture Extraction" position="l" />
              <Extraction />
            </Flex>
            <Flex
              className="app-main-box"
              flexGrow={1}
              // flexShrink={0}
              direction={"column"}
              {...boxCfg}
            >
              <BoxHeader title="Culture Exchange" position="m" />
              <Exchange />
            </Flex>
            <Flex direction={"column"} {...boxCfg}>
              <BoxHeader title="Target Culture Extrapolate" position="r" />
              <Extension />
            </Flex>
          </Flex>
        )}
      </div>
    </>
  );
}

export default App;
