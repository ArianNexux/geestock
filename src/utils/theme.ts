import { extendTheme } from "@chakra-ui/react";
import {
  primaryColor,
  primaryColorDisabled,
  secondaryColor,
  secondaryColorDisabled,
} from "./colors.ts";

export const theme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        color: "#fff",
        borderWidth: "2px",
      },
      variants: {
        primary: {
          bg: primaryColor,
          borderColor: primaryColor,
          _hover: {
            color: primaryColor,
            bg: "#fff",
            borderColor: primaryColor,
            _disabled: {
              color: "#fff",
              bg: primaryColorDisabled,
              borderColor: primaryColorDisabled,
            },
          },
          _disabled: {
            bg: primaryColorDisabled,
            borderColor: primaryColorDisabled,
          },
        },
        secondary: {
          bg: secondaryColor,
          borderColor: secondaryColor,
          _hover: {
            color: secondaryColor,
            bg: "#fff",
            borderColor: secondaryColor,
          },
        },
        link: {
          borderWidth: "0px",
          textDecoration: "underline",
        },
      },
      defaultProps: {
        variant: "primary",
      },
    },
    Link: {
      baseStyle: {
        textDecoration: "underline",
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            bg: "grey",
            borderColor: "hsl(0, 0%, 80%)",
            _disabled: {
              opacity: "1",
              color: "hsl(0, 0%, 60%)",
              bg: "hsl(0, 0%, 95%)",
              borderColor: "hsl(0, 0%, 90%)",
            },
          },
        },
      },
    },
  },
});
