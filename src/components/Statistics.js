import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

export default function Statistics() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      const { data, error } = await supabase
        .from('tareas')
        .select('*');
      if (!error) setTasks(data);
      setLoading(false);
    }
    fetchTasks();
  }, []);

  const completadas = tasks.filter(t => t.estado === 'completada').length;
  const pendientes = tasks.filter(t => t.estado !== 'completada').length;

  return (
    <main aria-label="Estadísticas de productividad">
      <h2>Estadísticas</h2>
      {loading ? <p>Cargando...</p> : (
        <div>
          <p><strong>Tareas completadas:</strong> {completadas}</p>
          <p><strong>Tareas pendientes:</strong> {pendientes}</p>
          <p><strong>Total de tareas:</strong> {tasks.length}</p>
        </div>
      )}
      <Link to="/">Volver al panel</Link>
    </main>
  );
}
