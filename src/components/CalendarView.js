import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

export default function CalendarView() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      const { data, error } = await supabase
        .from('tareas')
        .select('*')
        .order('fecha_limite', { ascending: true });
      if (!error) setTasks(data);
      setLoading(false);
    }
    fetchTasks();
  }, []);

  // Agrupa tareas por fecha (YYYY-MM-DD)
  const grouped = tasks.reduce((acc, task) => {
    const date = task.fecha_limite ? task.fecha_limite.substring(0, 10) : 'Sin fecha';
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {});

  return (
    <main aria-label="Calendario de tareas">
      <h2>Calendario</h2>
      {loading ? <p>Cargando...</p> : (
        <div>
          {Object.keys(grouped).map(date => (
            <section key={date} style={{marginBottom: '1.5em'}}>
              <h3>{date === 'Sin fecha' ? 'Sin fecha límite' : new Date(date).toLocaleDateString()}</h3>
              <ul>
                {grouped[date].map(task => (
                  <li key={task.id}>
                    <Link to={`/tarea/${task.id}`}>{task.titulo}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
      <Link to="/">Volver al panel</Link>
    </main>
  );
}
