import { useToast } from "@chakra-ui/react";

export const Toast = () => {
  const toast = useToast();

  const addToast = ({ title, status }) => {
    toast({
      title,
      status,
      position: "top-right",
      isClosable: true,
    });
  };

  return { addToast };
};
