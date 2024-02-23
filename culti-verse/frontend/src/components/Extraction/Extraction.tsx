import { Box, Flex, HStack, Heading, StackDivider } from "@chakra-ui/react";
import "./Extraction.css";

export default function Extraction() {
  return (
    <HStack
      className="extraction-main app-item-main"
      align={"start"}
      divider={<StackDivider borderColor="gray.200" />}
    >
      <Flex direction={"column"}>
        <Heading as="h5" size="sm">
          Element Feature
        </Heading>
        <Box w={"250px"}></Box>
        <Box flexGrow={1}></Box>
      </Flex>
      {/* min-content yyds */}
      <Box w={"min-content"}>
        <Heading as="h5" size="sm" whiteSpace={"nowrap"}>
          Element Selection
        </Heading>
        <Box minW={0}>
          {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. */}
        </Box>
      </Box>
    </HStack>
  );
}
