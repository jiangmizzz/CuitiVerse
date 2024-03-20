/**
 * 用于编辑用户文化背景
 */
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  PopoverFooter,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
} from "@chakra-ui/react";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import { Settings, eduType } from "../../vite-env";
import { useSettingStore } from "../../stores/setting";

const eduOption: eduType[] = [
  "elementary",
  "secondary",
  "bachelor's degree",
  "master's degree",
  "Ph.D.",
];

const markCfg = {
  mt: "2",
  fontSize: "sm",
};

const markPair = (
  <>
    <SliderMark value={1} ml={-3.5} {...markCfg}>
      1
    </SliderMark>
    <SliderMark value={5} ml={2} {...markCfg}>
      5
    </SliderMark>
  </>
);

export default function Setting() {
  const settingStore = useSettingStore();
  const [isOpen, setOpen] = useState<boolean>(false);
  const [formValue, setFormValue] = useState<Settings>(
    settingStore as Settings
  );
  const toast = useToast();

  //比较是否与store里的值一致
  function isSame(): boolean {
    for (const key in formValue) {
      const formKey: keyof Settings = key as keyof Settings;
      if (formValue[formKey] != settingStore[formKey]) {
        return false;
      }
    }
    return true;
  }

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Button
            size="sm"
            onClick={() => setOpen(!isOpen)}
            fontFamily={"Avenir"}
            opacity={0.7}
          >
            <div style={{ width: "15em", textAlign: "start" }}>
              {"| Backround Setting"}
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent w={420} p={5}>
          <PopoverArrow />
          <PopoverBody>
            <Stack spacing={2} fontFamily={"Times New Roman"}>
              <FormControl>
                <FormLabel fontWeight={"bold"}>{"Culture"}</FormLabel>
                <Input
                  size={"sm"}
                  placeholder="Enter your country"
                  value={formValue.culture}
                  onChange={(e) =>
                    setFormValue({ ...formValue, culture: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"bold"}>{"Age"}</FormLabel>
                <NumberInput
                  min={0}
                  size={"sm"}
                  value={formValue.age}
                  onChange={(_, e) => {
                    setFormValue({
                      ...formValue,
                      age: Number.isNaN(e) ? 0 : e,
                    });
                  }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"bold"}>{"Education level"}</FormLabel>
                <Select
                  size="sm"
                  variant="filled"
                  value={formValue.edu}
                  onChange={(e) =>
                    setFormValue({
                      ...formValue,
                      edu: e.target.value as eduType,
                    })
                  }
                >
                  {eduOption.map((level) => {
                    return (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"bold"}>
                  {"Understanding of Chinese culture"}
                </FormLabel>
                <Slider
                  aria-label="Understanding of Chinese culture"
                  value={formValue.u1}
                  max={5}
                  min={1}
                  onChange={(e) => setFormValue({ ...formValue, u1: e })}
                >
                  <Box mt={-5}>{markPair}</Box>
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
                <FormHelperText>
                  Larger value indicates better understanding
                </FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel fontWeight={"bold"}>
                  {"Understanding of traditional Chinese painting"}
                </FormLabel>
                <Slider
                  aria-label="Understanding of traditional Chinese painting"
                  colorScheme="cyan"
                  value={formValue.u2}
                  max={5}
                  min={1}
                  onChange={(e) => setFormValue({ ...formValue, u2: e })}
                >
                  <Box mt={-5}>{markPair}</Box>
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
                <FormHelperText>
                  Larger value indicates better understanding
                </FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"bold"}>
                  <HStack>
                    <Text>{"Remark"}</Text>
                    <Text fontSize={"xs"} color={"gray.400"}>
                      {"(optional)"}
                    </Text>
                  </HStack>
                </FormLabel>
                <Textarea
                  size={"sm"}
                  placeholder="Your special cultural background"
                  mb={3}
                  value={formValue.remark}
                  onChange={(e) =>
                    setFormValue({ ...formValue, remark: e.target.value })
                  }
                />
              </FormControl>
            </Stack>
          </PopoverBody>
          {/* <PopoverFooter> */}
          {!isSame() && (
            <PopoverFooter color={"red.400"}>{"Have not saved!"}</PopoverFooter>
          )}
          <ButtonGroup display="flex" justifyContent="flex-end">
            <Button
              variant="outline"
              onClick={() => setFormValue({ ...settingStore })}
            >
              Cancel
            </Button>
            <Button
              colorScheme="teal"
              isDisabled={formValue.culture == "" || formValue.age == 0}
              onClick={() => {
                settingStore.updateInfo(formValue);
                toast({
                  title: "Update successfully",
                  status: "success",
                  duration: 1500,
                  position: "top-right",
                  isClosable: true,
                });
              }}
            >
              {"Save"}
            </Button>
          </ButtonGroup>
          {/* </PopoverFooter> */}
        </PopoverContent>
      </Popover>
    </>
  );
}
