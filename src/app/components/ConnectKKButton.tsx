import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItemOption,
  MenuOptionGroup,
  Spinner,
  Box,
  HStack,
  Avatar,
  Flex,
  Text
} from '@chakra-ui/react';
import { useKeepKeyWallet } from '../contexts/WalletProvider';
import { FaArrowDown } from 'react-icons/fa6';
//@ts-ignore
import { COIN_MAP_LONG } from '@pioneer-platform/pioneer-coins';

const availableChains = ['BTC', 'ETH', 'OSMO', 'GAIA', 'MAYA', 'THOR', 'BNB', 'LTC', 'DASH', 'DOGE', 'XRP', 'ZEC'];

export default function ConnectKK() {
  const { connectWallet, disconnectWallet, keepkeyInstance } = useKeepKeyWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedChains, setSelectedChains] = useState(['ETH']);

  const handleChainChange = (values: any) => {
    setSelectedChains(values);
  };

  // Determine the src for the first selected chain's logo
  const firstSelectedChainLogo = selectedChains.length > 0
    ? `https://pioneers.dev/coins/${COIN_MAP_LONG[selectedChains[0]]}.png`
    : '';

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={4}>
      {keepkeyInstance ? (
        selectedChains.length !== 0 ? (

          <HStack>
            {selectedChains.map(chain => (
              <Avatar key={chain} size="xs" src={`https://pioneers.dev/coins/${COIN_MAP_LONG[chain]}.png`} mr={2} />
            ))}
            <Button
              colorScheme="red"
              onClick={async () => {
                await disconnectWallet();
              }}
            >
              Disconnect
            </Button>
          </HStack>
        ) : 'Select Chains'
      ) : (
        <HStack>
          <Menu closeOnSelect={false}>
            <MenuButton mt={"10px"} _hover={{ bg: "transparente" }} bg={"darkgrey"} border={"1px solid white"} as={Button} rightIcon={<FaArrowDown color='white' />} isLoading={isConnecting}>
              {selectedChains.length > 0 ? (
                <HStack>
                  {selectedChains.map(chain => (
                    <Avatar key={chain} size="xs" src={`https://pioneers.dev/coins/${COIN_MAP_LONG[chain]}.png`} mr={2} />
                  ))}
                </HStack>
              ) : 'Select Chains'}
            </MenuButton>
            <MenuList minWidth="240px" zIndex={2}>
              <MenuOptionGroup defaultValue={[]} type="checkbox" value={selectedChains} onChange={handleChainChange}>
                {availableChains.map((chain) => (
                  <MenuItemOption key={chain} value={chain}>
                    <Flex align="center">
                      <Avatar size="xs" src={`https://pioneers.dev/coins/${COIN_MAP_LONG[chain]}.png`} mr={2} />
                      <Text>{chain}</Text>
                    </Flex>
                  </MenuItemOption>
                ))}
              </MenuOptionGroup>
            </MenuList>
            <Button
              mt={2}
              colorScheme="blue"
              isDisabled={selectedChains.length === 0 || isConnecting}
              onClick={async () => {
                setIsConnecting(true);
                try {
                  await connectWallet(selectedChains);
                } catch (error) {
                  console.error(error);
                } finally {
                  setIsConnecting(false);
                }
              }}
            >
              Confirm & Connect
            </Button>
          </Menu>
        </HStack>
      )
      }
    </Box >
  );
}
