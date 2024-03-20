import { HStack, Heading, Image } from "@chakra-ui/react";
import keepIcon from "../../assets/select.svg";
import noKeepIcon from "../../assets/regular.svg";
import requireIcon from "../../assets/question.svg";
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
    <HStack spacing={0.5}>
      <Image
        w={4}
        objectFit={"contain"}
        cursor={"pointer"}
        src={
          props.isRequired
            ? props.isChecked
              ? requireIcon
              : noRequireIcon
            : props.isChecked
            ? keepIcon
            : noKeepIcon
        }
        onClick={props.onToggle}
      />
      <Heading fontSize="14px">
        {props.text.charAt(0).toUpperCase() + props.text.slice(1)}
      </Heading>
    </HStack>
  );
}
