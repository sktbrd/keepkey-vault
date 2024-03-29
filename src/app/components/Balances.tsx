// path: src/app/components/Balances.tsx
import React, { useState, useEffect } from "react";
import { Card, Tooltip, Center, Box, Flex, Spacer, Text, HStack, Grid, Button, TableContainer, Image, Table, Tr, Th, Tbody, Thead, Td, Avatar, Badge, Input, VStack, Divider } from "@chakra-ui/react";
import { useKeepKeyWallet } from "../contexts/WalletProvider";
import { handleCopy } from "../utils/handleCopy";
import { FaCopy } from "react-icons/fa";
import { useToast } from "@chakra-ui/react";
// @ts-ignore
import { COIN_MAP_LONG } from '@pioneer-platform/pioneer-coins';
import TransferModal from "./TransferModal";
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';
import { usePrices } from "../contexts/PricesContext";

interface Balance {
    symbol: string;
    value: string;
    chain: string;
    address: any;
    usdValue?: number | null;
    price?: number | null;
}


type SortOrder = {
    column: string | null;
    direction: 'none' | 'asc' | 'desc';
};


const Balances: React.FC = () => {
    const { keepkeyInstance } = useKeepKeyWallet();
    const toast = useToast();
    const [balances, setBalances] = useState<Balance[]>([]);
    const [asset, setAsset] = useState<any>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [sendingWallet, setSendingWallet] = useState("");
    const [chain, setChain] = useState("");
    const [symbol, setSymbol] = useState("");
    const { prices, fetchPrices } = usePrices();
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const chainColorMap = {
        BTC: 'orange.400', // Bitcoin
        ETH: 'blue.200', // Ethereum
        USDT: 'green.500', // Tether
        THOR: 'teal.400', // ThorChain
        LTC: 'blue.100',  // Litecoin
        DOGE: 'yellow.400', // Dogecoin
        CACAO: 'brown.400', // Cacao
        MAYA: 'brown.400', // Cacao
    };


    useEffect(() => {
        if (keepkeyInstance) {
            const loadBalances = async () => {
                const newBalances: Balance[] = [];
                Object.keys(keepkeyInstance).forEach((key) => {
                    keepkeyInstance[key].wallet.balance.forEach((balance: any) => {
                        if (balance.ticker) {
                            newBalances.push({
                                chain: balance.chain,
                                symbol: balance.ticker,
                                value: balance.getValue('string'),
                                address: keepkeyInstance[key].wallet.address,
                            });
                        } else {
                            console.error("Bad Balance: ", balance);
                        }
                    });
                });

                const updatedBalances = newBalances.map(balance => {
                    const price = prices[balance.symbol.toUpperCase()] || 0; // Using global prices
                    const usdValue = price * parseFloat(balance.value);
                    return {
                        ...balance,
                        usdValue: isNaN(usdValue) ? null : usdValue, // Handle potential NaN values
                        price: price,
                    };
                });

                setBalances(updatedBalances);
            };

            loadBalances();
        }
    }, [keepkeyInstance, prices]);

    const totalUsdValue = balances.reduce((acc: number, balance: Balance) => {
        return acc + (balance.usdValue || 0);
    }, 0);


    const showToast = (message: string) => {
        toast({
            title: message,
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "bottom-left",
            variant: "subtle",
        });
    };
    const groupedBalances: { [key: string]: Balance[] } = balances.reduce((acc, balance) => {
        // Use the chain as the key for grouping
        if (!acc[balance.chain]) {
            acc[balance.chain] = [];
        }
        acc[balance.chain].push(balance);
        return acc;
    }, {} as { [key: string]: Balance[] });

    // This function converts a file to a base64 string
    const convertFileToBase64 = (file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setImageBase64(reader.result as string);
        };
        console.log("imageBase64", imageBase64);
        reader.onerror = (error) => {
            console.error('Error converting file to base64:', error);
        };
    };

    const [srcData, setSrcData] = useState([]);

    const getWalletSRC = async (address: string) => {
        try {
            const url = `https://stampchain.io/api/v2/src20/balance/${address}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("PORRA:", data.data)
            setSrcData(data.data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    const SRCtokensModal = ({ srcData }: { srcData: any[] }) => {
        return (
            <Box p={2}>
                <Grid templateColumns={{ base: "repeat(auto-fit, minmax(250px, 1fr))", md: "repeat(5, 1fr)" }} gap={4}>
                    {srcData.map((token) => (
                        <Card key={token.id} borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
                            <Box>

                                <Center>

                                    <Text fontSize="lg" fontWeight="bold">
                                        {parseFloat(token.amt).toLocaleString()} {token.tick.toUpperCase()}
                                    </Text>
                                </Center>
                                <Text color="black" fontSize="sm">
                                    Block Time: {new Date(token.block_time).toLocaleString()}
                                </Text>
                                <Text fontSize="sm">
                                    Last Update Block: {token.last_update}
                                </Text>
                            </Box>
                        </Card>
                    ))}
                </Grid>
            </Box>
        );
    };

    const [stampsData, setStampsData] = useState([]);

    const getWalletStamps = async (address: string) => {
        try {
            const url = `https://stampchain.io/api/v2/stamps/balance/${address}?limit=50&page=1`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("data", data);
            setStampsData(data.data); // Assuming 'data.data' is the correct path to the stamps array
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    useEffect(() => {
        getWalletStamps("1CAYBK3kChrrPFHfz1dY5pccFDxCRyG5Fd");
        getWalletSRC("1CAYBK3kChrrPFHfz1dY5pccFDxCRyG5Fd");
        console.log()
    }, []);

    const StampsModal = ({ stampsData }: { stampsData: any[] }) => {
        return (
            <Box>
                <Grid templateColumns={{ base: "repeat(auto-fit, minmax(250px, 1fr))", md: "repeat(4, 1fr)", xl: "repeat(5, 1fr)" }} gap={4}>
                    {stampsData.map((stamp) => (
                        <Box key={stamp.cpid} borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
                            {stamp.stamp_base64 && (
                                <Image
                                    src={`data:image/png;base64,${stamp.stamp_base64}`}
                                    alt="Stamp Image"
                                    boxSize="140px"
                                    objectFit="cover"
                                    m="auto"
                                    border={"2px solid black"}
                                />
                            )}
                            <Box mt={4}>
                                <Text color="black" fontSize="sm">
                                    Stamp ID: {stamp.cpid}
                                </Text>
                                <Text fontSize="sm" >
                                    Creator: {stamp.creator || 'Unknown'}
                                </Text>
                                <Text fontSize="sm">
                                    Supply: {stamp.supply}
                                </Text>
                            </Box>
                        </Box>
                    ))}
                </Grid>
            </Box>
        );
    };

    return (
        <Flex
            direction="column"
            align="center"
            justify="space-between"
            p={{ base: 4, md: 8 }}
            minHeight="100vh" // Ensures it takes the full viewport height
            width="full" // Takes full width
            className='gradient-bg'
            sx={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
            <Box
                minWidth={{ base: "100%", md: "100%" }}

            >
                <Center mb="4">
                    <VStack>
                        <Image src="BOS.png" alt="Københavns Kommune" aspectRatio='{4:9}' />
                        <Badge
                            background="white"
                            color="white"
                            p={4}
                            borderRadius="lg"
                            mb={4}
                            border="2px solid black"
                            boxShadow="lg"
                            textAlign="center"
                        >
                            <Text color={"black"} fontSize="xl" fontWeight="bold" >
                                Total Balance: {totalUsdValue.toFixed(2)} USD
                            </Text>
                        </Badge>
                    </VStack>
                </Center>
                <Spacer />
                <TransferModal
                    isModalOpen={isModalOpen}
                    setModalOpen={setModalOpen}
                    sendingWallet={sendingWallet}
                    asset={asset}
                    symbol={symbol}
                    chain={chain}
                />
                <Center>

                    <TableContainer
                        border={"2px solid black"}
                        borderRadius={"20px"}
                        w={"100%"}
                    >
                        <Accordion allowMultiple  >
                            {Object.entries(groupedBalances).map(([chain, tokens]) => (
                                <AccordionItem key={chain} border={'none'}>
                                    <h1>
                                        <AccordionButton>
                                            <Box flex="1" textAlign="left" color={"white"} >
                                                <Flex justifyContent={"space-between"} >
                                                    <Box>

                                                        <Avatar
                                                            key={chain}
                                                            size="xs"
                                                            src={`https://pioneers.dev/coins/${COIN_MAP_LONG[chain]}.png`}
                                                            mr={2}
                                                        />
                                                        {chain}
                                                    </Box>

                                                    <Badge
                                                        borderRadius={"10px"}
                                                        border={"2px solid black"}
                                                        bg={"white"}
                                                        color={"black"}
                                                        fontSize={"26px"}>
                                                        $
                                                        {tokens
                                                            .reduce(
                                                                (acc: number, token: any) =>
                                                                    acc + (token.usdValue || 0),
                                                                0
                                                            )
                                                            .toFixed(2)}
                                                    </Badge>
                                                </Flex>
                                            </Box>

                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h1>
                                    <AccordionPanel pb={4}>
                                        <VStack>
                                            <Table variant="" >
                                                <Thead color={"white"}>
                                                    <Tr>
                                                        <Th>
                                                            Amount
                                                        </Th>
                                                        <Th>
                                                            USD Value
                                                        </Th>
                                                        <Th>
                                                            Address
                                                        </Th>

                                                    </Tr>
                                                </Thead>
                                                <Tbody color={"blue.200"}>
                                                    {tokens.map((token, index) => (
                                                        <Tr color={chainColorMap[chain as keyof typeof chainColorMap] || 'gray'} key={index}>
                                                            <Td>
                                                                <Box w={"100px"}>
                                                                    <Text
                                                                        fontSize={"30px"}
                                                                        color={"black"}
                                                                    >
                                                                        {token.value}
                                                                    </Text>
                                                                </Box>
                                                            </Td>
                                                            <Td>
                                                                <Text
                                                                    fontSize={"30px"}
                                                                    color={"black"}
                                                                >

                                                                    $
                                                                    {token.usdValue ? token.usdValue.toFixed(2) : "0.00"}
                                                                </Text>
                                                            </Td>

                                                            <Td>
                                                                <Flex align="center">
                                                                    <Button
                                                                        size="sm"
                                                                        bg={"transparent"}
                                                                        onClick={() => {
                                                                            console.log(token)
                                                                            navigator.clipboard.writeText(token.address);
                                                                            showToast("Address copied to clipboard");
                                                                        }}
                                                                        _hover={{ bg: "transparent" }}
                                                                    >
                                                                        <FaCopy color="white" />
                                                                    </Button>
                                                                    <Input
                                                                        value={token.address}
                                                                        isReadOnly
                                                                        borderRadius={"10px"}
                                                                        size="120px"
                                                                        height={"30px"}
                                                                        w={"320px"}
                                                                        mr={2}
                                                                        padding={2}
                                                                        color={"black"}
                                                                    />
                                                                </Flex>
                                                            </Td>
                                                            <Td>
                                                                <Button
                                                                    size="sm"
                                                                    bg={"green.200"}
                                                                    color={"black"}
                                                                    onClick={() => {
                                                                        setAsset(token);
                                                                        setModalOpen(true);
                                                                        setSendingWallet(token.address);
                                                                        setChain(token.chain);
                                                                        setSymbol(token.symbol);
                                                                    }}
                                                                >
                                                                    Send
                                                                </Button>
                                                                <Button
                                                                    leftIcon={<Image boxSize={'24px'} src="https://i.pinimg.com/originals/4b/52/17/4b5217cc5d784890f44aeb01a5ad7db6.png" />}
                                                                    size="sm"
                                                                    color={"black"}
                                                                    marginLeft={"10px"}
                                                                    colorScheme="green"
                                                                    variant={'outline'}
                                                                >
                                                                    Stamp
                                                                </Button>

                                                            </Td>
                                                        </Tr>
                                                    ))}
                                                </Tbody>
                                            </Table>
                                            <Divider />
                                            <Text > STAMPS </Text>
                                            <input
                                                type="file"
                                                style={{ color: 'white' }}
                                                onChange={(event) => {
                                                    const file = event.target.files?.[0];
                                                    if (file) {
                                                        convertFileToBase64(file);
                                                    }
                                                }}
                                            />
                                            {imageBase64 && (
                                                <img src={imageBase64} alt="Selected" style={{ width: '100px', height: '100px' }} />
                                            )}

                                            <Input
                                                placeholder="OP_RETURN"
                                                size="md"
                                                color={"white"}

                                            />
                                            <SRCtokensModal srcData={srcData}></SRCtokensModal>

                                            <StampsModal stampsData={stampsData}></StampsModal>
                                        </VStack >
                                    </AccordionPanel>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </TableContainer>
                </Center>

            </Box>
        </Flex >
    );
};

export default Balances;
