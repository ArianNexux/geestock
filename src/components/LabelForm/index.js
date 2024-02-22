import { Flex, FormLabel, Text } from "@chakra-ui/react";

function LabelForm({
  title,
  fontSize = "sm",
  isRequired = false,
  helper,
  isDisabled = false,
  showLabel = true,
  sx = {}
}) {
  return (
    showLabel && <FormLabel sx={sx}>
      <Flex>
        <Text as="b" fontSize={fontSize} textTransform="uppercase" me={1}>
          {title}
        </Text>
        {isRequired && <Text fontSize="sm">(obrigatório)</Text>}
      </Flex>
      {helper && !isDisabled && <Text fontSize="sm">{helper}</Text>}
    </FormLabel>
  );
}

export default LabelForm;
