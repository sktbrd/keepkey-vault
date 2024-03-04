import React from "react";
import { Box, Flex, Spacer, Image } from "@chakra-ui/react";
import ConnectKK from "./ConnectKKButton";



const Header = () => {
    return (
        <Flex align="center" justify="space-between" p={4} bgGradient="linear(to-r, black, grey)">
            <Box>
                <Image boxSize={"36px"} src="/keepkey_logo.avif" alt="CoinMasters" />
            </Box>
            <Box>
                <ConnectKK />
            </Box>
        </Flex>
    );
};


export default Header;
