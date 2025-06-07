import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Button,
  Icon,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Progress,
  useColorModeValue,
  Skeleton,
  HStack,
  Divider
} from '@chakra-ui/react';
import { FiPlusCircle, FiCalendar, FiClock, FiCheckCircle } from 'react-icons/fi';
import { supabase } from '../supabaseClient';
import TaskList from './TaskList';

function Dashboard() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    dueSoonTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const bgCard = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    // Cargar datos del usuario y estadísticas cuando el componente se monta
    const loadUserData = async () => {
      try {
        // Obtener la sesión actual
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserName(user.email?.split('@')[0] || 'Usuario');

          // Obtener estadísticas de tareas del usuario
          const { data: tasks, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', user.id);

          if (error) throw error;

          if (tasks) {
            const now = new Date();
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);

            // Calcular estadísticas
            const completed = tasks.filter(task => task.completed).length;
            const dueSoon = tasks.filter(task => {
              if (!task.due_date || task.completed) return false;
              const dueDate = new Date(task.due_date);
              return dueDate >= now && dueDate <= nextWeek;
            }).length;

            setStats({
              totalTasks: tasks.length,
              completedTasks: completed,
              pendingTasks: tasks.length - completed,
              dueSoonTasks: dueSoon
            });
          }
        }
      } catch (error) {
        console.error('Error cargando datos del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Calcular porcentaje de tareas completadas
  const completionPercentage = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  // Obtener saludo según la hora del día
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "¡Buenos días";
    if (hour < 18) return "¡Buenas tardes";
    return "¡Buenas noches";
  };

  // Calcular fecha actual en formato legible
  const today = new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Capitalizar primera letra
  const formattedDate = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <Box>
      {/* Encabezado con saludo personalizado */}
      <Box mb={8}>
        <Heading as="h1" size="xl" mb={2}>
          {getGreeting()}, {loading ? (
            <Skeleton display="inline" height="1.5rem" w="150px" />
          ) : (
            userName
          )}!
        </Heading>
        <Text color={textColorSecondary}>{formattedDate}</Text>
      </Box>

      {/* Tarjetas de estadísticas */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
        <Stat
          px={4}
          py={3}
          bg={bgCard}
          borderRadius="lg"
          boxShadow="sm"
          border="1px solid"
          borderColor={borderColor}
        >
          <StatLabel color={textColorSecondary} fontWeight="medium" isTruncated>
            Tareas Totales
          </StatLabel>
          <Flex align="center">
            <StatNumber fontSize="2xl" fontWeight="bold">
              {loading ? <Skeleton height="1.5rem" w="3rem" /> : stats.totalTasks}
            </StatNumber>
          </Flex>
        </Stat>

        <Stat
          px={4}
          py={3}
          bg={bgCard}
          borderRadius="lg"
          boxShadow="sm"
          border="1px solid"
          borderColor={borderColor}
        >
          <StatLabel color={textColorSecondary} fontWeight="medium" isTruncated>
            Tareas Completadas
          </StatLabel>
          <Flex align="center">
            <StatNumber fontSize="2xl" fontWeight="bold" color="green.500">
              {loading ? <Skeleton height="1.5rem" w="3rem" /> : stats.completedTasks}
            </StatNumber>
          </Flex>
        </Stat>

        <Stat
          px={4}
          py={3}
          bg={bgCard}
          borderRadius="lg"
          boxShadow="sm"
          border="1px solid"
          borderColor={borderColor}
        >
          <StatLabel color={textColorSecondary} fontWeight="medium" isTruncated>
            Tareas Pendientes
          </StatLabel>
          <Flex align="center">
            <StatNumber fontSize="2xl" fontWeight="bold" color="orange.500">
              {loading ? <Skeleton height="1.5rem" w="3rem" /> : stats.pendingTasks}
            </StatNumber>
          </Flex>
        </Stat>

        <Stat
          px={4}
          py={3}
          bg={bgCard}
          borderRadius="lg"
          boxShadow="sm"
          border="1px solid"
          borderColor={borderColor}
        >
          <StatLabel color={textColorSecondary} fontWeight="medium" isTruncated>
            Tareas Próximas a Vencer
          </StatLabel>
          <Flex align="center">
            <StatNumber fontSize="2xl" fontWeight="bold" color="blue.500">
              {loading ? <Skeleton height="1.5rem" w="3rem" /> : stats.dueSoonTasks}
            </StatNumber>
          </Flex>
        </Stat>
      </SimpleGrid>

      {/* Tarjeta de progreso */}
      <Card mb={8} bg={bgCard} boxShadow="sm" borderRadius="lg">
        <CardHeader pb={0}>
          <Heading size="md">Tu Progreso</Heading>
        </CardHeader>
        <CardBody>
          <Text mb={2}>{completionPercentage}% de tareas completadas</Text>
          <Progress 
            value={completionPercentage} 
            colorScheme="brand" 
            borderRadius="full" 
            size="lg" 
            mb={4}
          />
          
          <HStack spacing={4} mt={4}>
            <Button
              as={Link}
              to="/tarea/nueva"
              leftIcon={<Icon as={FiPlusCircle} />}
              colorScheme="brand"
              size="sm"
            >
              Nueva Tarea
            </Button>
            <Button
              as={Link}
              to="/calendario"
              leftIcon={<Icon as={FiCalendar} />}
              variant="outline"
              colorScheme="brand"
              size="sm"
            >
              Ver Calendario
            </Button>
          </HStack>
        </CardBody>
      </Card>

      {/* Lista de tareas */}
      <Box>
        <Heading as="h2" size="md" mb={4}>
          Tus Tareas
        </Heading>
        <TaskList />
      </Box>
    </Box>
  );
}

export default Dashboard;
