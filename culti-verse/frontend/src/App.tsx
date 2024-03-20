// import { useState } from "react";
import "./App.css";
import "./assets/reset.css";
import headLogo from "./assets/logo.svg";
import Setting from "./components/Setting/Setting";
import { Center, Flex, Heading } from "@chakra-ui/react";
import Extraction from "./components/Extraction/Extraction";
import Exchange from "./components/Exchange/Exchange";
import Extension from "./components/Extension/Extension";

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
        size="md"
        whiteSpace={"nowrap"}
        color={props.position === "m" ? "black" : "white"}
      >
        {props.title}
      </Heading>
    </Center>
  );
}

function App() {
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
        <Flex m={"0.5em"} flexGrow={1} gap={2} minH={0}>
          <Flex direction={"column"} {...boxCfg}>
            <BoxHeader title="Culture Source Analyze" position="l" />
            <Extraction />
          </Flex>
          <Flex
            className="app-main-box"
            flexGrow={1}
            // flexShrink={0}
            direction={"column"}
            {...boxCfg}
          >
            <BoxHeader title="Culture Adapt" position="m" />
            <Exchange />
          </Flex>
          <Flex direction={"column"} {...boxCfg}>
            <BoxHeader title="Culture Assimilate" position="r" />
            <Extension />
          </Flex>
        </Flex>
      </div>
    </>
  );
}

export default App;
