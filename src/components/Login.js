import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Icon,
  InputGroup,
  InputRightElement,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorMode,
  IconButton,
  Image,
  Flex
} from '@chakra-ui/react';
import { FiEye, FiEyeOff, FiSun, FiMoon, FiCheckCircle } from 'react-icons/fi';
import { supabase } from '../supabaseClient';

function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();

  // Colores para tema claro/oscuro
  const bgColor = useColorModeValue('white', 'gray.800');
  const loginBgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const brandColor = useColorModeValue('brand.500', 'brand.300');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/');
    } catch (error) {
      setError(`Error al iniciar sesión: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      setSuccess('Revisa tu email para confirmar tu cuenta');
      // Cambiar a modo login después de registro exitoso
      setIsRegister(false);
    } catch (error) {
      setError(`Error al registrarse: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg={loginBgColor} py={12}>
      <Container maxW="md">
        <Flex justify="flex-end" mb={4}>
          <IconButton
            aria-label={`Cambiar a modo ${colorMode === 'light' ? 'oscuro' : 'claro'}`}
            icon={colorMode === 'light' ? <Icon as={FiMoon} /> : <Icon as={FiSun} />}
            variant="ghost"
            onClick={toggleColorMode}
          />
        </Flex>
        
        <VStack spacing={8}>
          <VStack spacing={2} align="center">
            <Heading 
              color={brandColor}
              fontSize="3xl"
              fontWeight="bold"
            >
              Gestor de Tareas
            </Heading>
            <Text fontSize="md" color={textColor}>
              {isRegister ? 'Crea tu cuenta para comenzar' : 'Inicia sesión para continuar'}
            </Text>
          </VStack>

          <Box 
            bg={bgColor} 
            p={8} 
            borderRadius="xl" 
            boxShadow="lg" 
            w="100%"
          >
            {error && (
              <Alert status="error" mb={4} borderRadius="md">
                <AlertIcon />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert status="success" mb={4} borderRadius="md">
                <AlertIcon as={FiCheckCircle} />
                <Box>
                  <AlertTitle>¡Registro exitoso!</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Box>
              </Alert>
            )}

            <Stack as="form" spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>Correo Electrónico</FormLabel>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  borderRadius="md"
                  placeholder="tu@email.com"
                  _focus={{ borderColor: brandColor }}
                />
              </FormControl>
              
              <FormControl id="password" isRequired>
                <FormLabel>Contraseña</FormLabel>
                <InputGroup>
                  <Input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    borderRadius="md"
                    placeholder="********"
                    _focus={{ borderColor: brandColor }}
                  />
                  <InputRightElement width="3rem">
                    <IconButton
                      h="1.5rem"
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      icon={showPassword ? <Icon as={FiEyeOff} /> : <Icon as={FiEye} />}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              
              <Button
                colorScheme="brand"
                isLoading={loading}
                loadingText={isRegister ? "Registrando..." : "Iniciando sesión..."}
                onClick={isRegister ? handleRegister : handleLogin}
                size="lg"
                w="100%"
                mt={2}
              >
                {isRegister ? 'Registrarse' : 'Iniciar Sesión'}
              </Button>
            </Stack>

            <HStack justify="center" mt={6}>
              <Text fontSize="sm" color={textColor}>
                {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
              </Text>
              <Button
                variant="link"
                colorScheme="brand"
                size="sm"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError(null);
                  setSuccess(null);
                }}
              >
                {isRegister ? 'Iniciar Sesión' : 'Registrarse'}
              </Button>
            </HStack>
          </Box>

          <Text fontSize="xs" color={textColor}>
            &copy; {new Date().getFullYear()} Gestor de Tareas. Todos los derechos reservados.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}

export default Login;
