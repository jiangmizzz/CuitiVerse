import {
  Box,
  Center,
  Flex,
  Image,
  Spinner,
  CloseButton,
} from "@chakra-ui/react";
import { ExtensionMsg } from "../../vite-env";
import robot from "../../assets/chat_gpt.svg";
import user from "../../assets/user_avatar.svg";
import { textBoxCfg } from "../../stores/maps";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import { useEffect, useRef } from "react";

export default function Message(props: ExtensionMsg & { delete: () => void }) {
  const markdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const parser = new MarkdownIt({
      html: true,
      breaks: true,
      linkify: true,
      //代码高亮
      highlight: (code, lang) => {
        let result = null;
        if (lang && hljs.getLanguage(lang)) {
          result = hljs.highlight(lang, code, true).value;
        } else if (!lang) {
          result = hljs.highlightAuto(code).value;
        }
        return `<pre class="hljs " style="padding: 12px; border-radius: 4px; background-color: #EDF2F7 "><code>${result}</code></pre>`;
      },
    });
    const html = parser.render(props.content);
    if (markdownRef.current) {
      markdownRef.current.innerHTML = html;
    }
  }, [props.content]);

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
          <Flex
            ref={markdownRef}
            direction={"column"}
            fontSize={"sm"}
            color={"gray.600"}
            lineHeight={"1.2em"}
            gap={2}
          />
        )}
      </Box>
    </Flex>
  );
}
