import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  Box, 
  Flex, 
  VStack, 
  Icon, 
  Text, 
  Heading,
  Button,
  useColorModeValue,
  useColorMode,
  Tooltip,
  Avatar,
  Spacer
} from '@chakra-ui/react';
import { 
  FiHome, 
  FiCalendar, 
  FiPlusSquare,
  FiPieChart, 
  FiSettings, 
  FiLogOut,
  FiMoon,
  FiSun
} from 'react-icons/fi';
import { supabase } from '../supabaseClient';

function Sidebar({ session }) {
  const location = useLocation();
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const activeColor = useColorModeValue('brand.500', 'brand.300');
  const inactiveColor = useColorModeValue('gray.600', 'gray.400');

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const NavItem = ({ icon, label, to, exact = false }) => {
    const isActive = exact 
      ? location.pathname === to 
      : location.pathname.startsWith(to);

    return (
      <Tooltip label={label} placement="right" hasArrow>
        <Button
          as={RouterLink}
          to={to}
          variant="ghost"
          justifyContent="flex-start"
          w="full"
          py={3}
          my={1}
          color={isActive ? activeColor : inactiveColor}
          borderLeftWidth={isActive ? "4px" : "0px"}
          borderLeftColor={activeColor}
          borderRadius="0"
          _hover={{
            bg: useColorModeValue('gray.100', 'gray.700')
          }}
          leftIcon={<Icon as={icon} boxSize="20px" />}
        >
          <Text ml={2}>{label}</Text>
        </Button>
      </Tooltip>
    );
  };

  return (
    <Box
      w={{ base: "full", md: "60px", lg: "250px" }}
      h="100vh"
      position="sticky"
      top="0"
      bg={bgColor}
      borderRightWidth="1px"
      borderRightColor={borderColor}
      overflow="hidden"
      transition="width 0.2s"
      display={{ base: 'none', md: 'block' }}
    >
      <Flex direction="column" h="100%" py={4}>
        <Flex px={4} py={2} align="center" mb={6}>
          <Heading 
            as="h1" 
            fontSize={{ md: "0", lg: "xl" }}
            display={{ base: 'none', lg: 'block' }} 
            color={activeColor}
          >
            Gestor Tareas
          </Heading>
          <Icon 
            as={FiHome} 
            boxSize="24px"
            color={activeColor}
            display={{ base: 'block', lg: 'none' }} 
          />
        </Flex>

        <VStack spacing={1} align="stretch" px={2}>
          <NavItem icon={FiHome} label="Inicio" to="/" exact />
          <NavItem icon={FiPlusSquare} label="Nueva Tarea" to="/tarea/nueva" />
          <NavItem icon={FiCalendar} label="Calendario" to="/calendario" />
          <NavItem icon={FiPieChart} label="Estadísticas" to="/estadisticas" />
          <NavItem icon={FiSettings} label="Configuración" to="/configuracion" />
        </VStack>

        <Spacer />

        {session?.user && (
          <VStack spacing={2} align="center" px={4} py={2} mt={4}>
            <Avatar 
              size="sm" 
              name={session.user.email} 
              display={{ base: 'none', lg: 'block' }} 
            />
            <Text 
              fontSize="sm" 
              fontWeight="medium"
              display={{ base: 'none', lg: 'block' }}
              isTruncated
              maxW="100%"
            >
              {session.user.email}
            </Text>
            
            <Button 
              onClick={toggleColorMode} 
              size="sm" 
              variant="ghost" 
              leftIcon={<Icon as={colorMode === 'light' ? FiMoon : FiSun} />}
              display={{ base: 'none', lg: 'flex' }}
              w="full"
            >
              {colorMode === 'light' ? 'Modo oscuro' : 'Modo claro'}
            </Button>
            
            <Tooltip label={colorMode === 'light' ? 'Modo oscuro' : 'Modo claro'} placement="right" hasArrow>
              <Button 
                onClick={toggleColorMode}
                size="sm"
                p={2}
                display={{ base: 'flex', lg: 'none' }}
                justifyContent="center"
                variant="ghost"
              >
                <Icon as={colorMode === 'light' ? FiMoon : FiSun} />
              </Button>
            </Tooltip>
            
            <Button 
              onClick={handleLogout} 
              colorScheme="red" 
              size="sm" 
              leftIcon={<Icon as={FiLogOut} />}
              display={{ base: 'none', lg: 'flex' }}
              w="full"
              mt={2}
            >
              Cerrar sesión
            </Button>
            
            <Tooltip label="Cerrar sesión" placement="right" hasArrow>
              <Button 
                onClick={handleLogout}
                size="sm"
                p={2}
                colorScheme="red"
                display={{ base: 'flex', lg: 'none' }}
                justifyContent="center"
              >
                <Icon as={FiLogOut} />
              </Button>
            </Tooltip>
          </VStack>
        )}
      </Flex>
    </Box>
  );
}

export default Sidebar;
