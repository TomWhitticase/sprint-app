import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  components: {
    Button: {
      variants: {
        black: {
          bg: "black",
          color: "white",
          border: "2px solid black",
          _hover: {
            bg: "white",
            color: "black",
          },
        },
        white: {
          bg: "white",
          color: "#333333",
          border: "2px solid #CCCCCC",
          _hover: {
            bg: "white",
            color: "black",
            border: "2px solid black",
          },
        },
      },
    },
  },
});

export default theme;
