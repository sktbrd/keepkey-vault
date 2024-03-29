// footer component

import React from 'react';
import { Box, Flex, Spacer, Text, Link, VStack } from "@chakra-ui/react";
import { FaGithub } from 'react-icons/fa';

const Footer = () => {
    return (
        <Flex direction="column" justify="center" align="stretch" m={10} bgGradient="linear(to-r, grey, limegreen)"  >
            <Box alignSelf="flex-end">
                <Link href="https://github.com/coinmastersguild/basic-sender" isExternal>
                    <FaGithub color="white" size="34px" />
                </Link>
            </Box>
        </Flex>
    );
}

export default Footer;