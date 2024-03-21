import { Flex, Heading, Image } from "@chakra-ui/react";
import noKeepIcon from "../../assets/regular.svg";
import noRequireIcon from "../../assets/noquestion.svg";
import { conditionType } from "../../vite-env";

interface ChoiceProps {
  text: conditionType;
  isRequired: boolean;
  isChecked: boolean;
  onToggle: () => void;
}

export default function Choice(props: ChoiceProps) {
  return (
    <Flex
      gap={0.5}
      borderWidth={1}
      borderColor={"gray.400"}
      borderRadius={"full"}
      px={"4px"}
      py={1}
      cursor={"pointer"}
      onClick={props.onToggle}
      bgColor={props.isChecked ? "gray.300" : "transparent"}
      boxShadow={"base"}
      direction={props.isChecked ? "row-reverse" : "row"}
    >
      <Image
        w={4}
        objectFit={"contain"}
        cursor={"pointer"}
        src={props.isRequired ? noRequireIcon : noKeepIcon}
      />
      <Heading fontSize="14px" color={props.isChecked ? "black" : "gray.500"}>
        {props.text.charAt(0).toUpperCase() + props.text.slice(1)}
      </Heading>
    </Flex>
  );
}
