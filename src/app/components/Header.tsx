import React from "react";
import { Box, Flex, Spacer, Image, HStack } from "@chakra-ui/react";
import ConnectKK from "./ConnectKKButton";



const Header = () => {
    return (
        <Flex align="center" justifyContent={"space-between"} p={2} bg="black">
            <Image boxSize={"52px"} src="BOS.png" alt="Københavns Kommune" />

            <Box>
                <HStack >
                    <ConnectKK />
                </HStack>
            </Box>
        </Flex>
    );
};


export default Header;
