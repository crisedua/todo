import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Text,
  VStack,
  HStack,
  Checkbox,
  Badge,
  IconButton,
  Card,
  CardBody,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Heading,
  Button,
  useColorModeValue,
  Skeleton,
  Icon,
  useToast,
  Divider,
  List,
  ListItem
} from '@chakra-ui/react';
import { 
  FiEdit2, 
  FiTrash2, 
  FiMoreVertical, 
  FiPlusCircle,
  FiCalendar,
  FiTag
} from 'react-icons/fi';
import { supabase } from '../supabaseClient';

function TaskList({ limit = 5 } = {}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  // Colores
  const bgCard = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const badgeBg = useColorModeValue('gray.100', 'gray.700');
  const textMutedColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuario no autenticado');

        let query = supabase
          .from('tareas')
          .select('*')
          .eq('user_id', user.id)
          .order('fecha_limite', { ascending: true });
          
        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) throw error;
        setTasks(data || []);
      } catch (error) {
        console.error('Error al obtener las tareas:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [limit]);

  const toggleTaskCompleted = async (taskId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('tareas')
        .update({ estado: !currentStatus ? 'completada' : 'pendiente' })
        .eq('id', taskId);

      if (error) throw error;

      // Actualizar el estado local
      setTasks(tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, estado: !currentStatus ? 'completada' : 'pendiente' };
        }
        return task;
      }));
      
      toast({
        title: !currentStatus ? 'Tarea completada' : 'Tarea marcada como pendiente',
        status: !currentStatus ? 'success' : 'info',
        duration: 2000,
        isClosable: true,
        position: 'bottom-right'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado de la tarea',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      console.error('Error al actualizar la tarea:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        const { error } = await supabase
          .from('tareas')
          .delete()
          .eq('id', taskId);

        if (error) throw error;

        // Actualizar el estado local
        setTasks(tasks.filter(task => task.id !== taskId));
        
        toast({
          title: 'Tarea eliminada',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'bottom-right'
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudo eliminar la tarea',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
        console.error('Error al eliminar la tarea:', error);
      }
    }
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Componente para mostrar cuando no hay tareas
  const EmptyState = () => (
    <Card bg={bgCard} boxShadow="sm" borderRadius="lg" mt={4}>
      <CardBody textAlign="center" py={8}>
        <Heading size="md" mb={4}>No hay tareas</Heading>
        <Text color={textMutedColor} mb={6}>
          Parece que no tienes tareas pendientes.
          ¡Crea una nueva para comenzar a organizar tu día!
        </Text>
        <Button
          as={Link}
          to="/tarea/nueva"
          leftIcon={<Icon as={FiPlusCircle} />}
          colorScheme="brand"
        >
          Crear nueva tarea
        </Button>
      </CardBody>
    </Card>
  );

  // Componente para mostrar durante la carga
  const LoadingState = () => (
    <VStack spacing={4} align="stretch" mt={4}>
      {Array(3).fill('').map((_, i) => (
        <Card key={i} bg={bgCard} borderColor={borderColor} boxShadow="sm" borderRadius="lg">
          <CardBody>
            <Flex justify="space-between" align="center">
              <HStack>
                <Skeleton height="20px" width="20px" borderRadius="md" />
                <Skeleton height="20px" width="180px" borderRadius="md" />
              </HStack>
              <Skeleton height="24px" width="24px" borderRadius="full" />
            </Flex>
            <Skeleton height="16px" width="120px" mt={4} borderRadius="md" />
          </CardBody>
        </Card>
      ))}
    </VStack>
  );

  // Componente para mostrar en caso de error
  const ErrorState = () => (
    <Card bg="red.50" color="red.600" borderRadius="lg" mt={4}>
      <CardBody textAlign="center">
        <Heading size="md" mb={2}>Error al cargar las tareas</Heading>
        <Text>{error}</Text>
        <Button mt={4} colorScheme="red" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </CardBody>
    </Card>
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;
  if (tasks.length === 0) return <EmptyState />;

  return (
    <VStack spacing={3} align="stretch">
      <List spacing={3}>
        {tasks.map(task => (
          <ListItem key={task.id}>
            <Card 
              bg={bgCard} 
              borderRadius="lg" 
              boxShadow="sm"
              borderLeft="4px solid" 
              borderLeftColor={task.estado === 'completada' ? 'green.400' : 'blue.400'}
              transition="all 0.2s"
              _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
            >
              <CardBody py={3}>
                <Flex justify="space-between" align="center">
                  <HStack spacing={4} flex={1}>
                    <Checkbox 
                      isChecked={task.estado === 'completada'}
                      onChange={() => toggleTaskCompleted(task.id, task.estado === 'completada')}
                      colorScheme="green"
                      size="lg"
                    />
                    <Box>
                      <Text 
                        fontSize="md" 
                        fontWeight="medium" 
                        textDecoration={task.estado === 'completada' ? 'line-through' : 'none'}
                        opacity={task.estado === 'completada' ? 0.7 : 1}
                        as={Link} 
                        to={`/tarea/${task.id}`} 
                        _hover={{ color: 'brand.500' }}
                      >
                        {task.titulo}
                      </Text>
                      
                      {/* Información adicional */}
                      <HStack spacing={3} mt={1} color={textMutedColor} fontSize="xs">
                        {task.fecha_limite && (
                          <HStack spacing={1}>
                            <Icon as={FiCalendar} />
                            <Text>{formatDate(task.fecha_limite)}</Text>
                          </HStack>
                        )}
                      </HStack>
                    </Box>
                  </HStack>
                  
                  <HStack spacing={1}>
                    <IconButton
                      icon={<FiEdit2 />}
                      aria-label="Editar tarea"
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/tarea/${task.id}`)}
                    />
                    <IconButton
                      icon={<FiTrash2 />}
                      aria-label="Eliminar tarea"
                      variant="ghost"
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDeleteTask(task.id)}
                    />
                  </HStack>
                </Flex>
              </CardBody>
            </Card>
          </ListItem>
        ))}
      </List>
      
      {limit && tasks.length >= limit && (
        <Box textAlign="center" mt={3}>
          <Button 
            as={Link} 
            to="/" 
            variant="ghost" 
            size="sm" 
            colorScheme="brand"
          >
            Ver todas las tareas
          </Button>
        </Box>
      )}
    </VStack>
  );
}

export default TaskList;
