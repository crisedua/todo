import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function TaskForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      setLoading(true);
      supabase
        .from('tareas')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (data) {
            setTitulo(data.titulo || '');
            setDescripcion(data.descripcion || '');
            setFechaLimite(data.fecha_limite ? data.fecha_limite.substring(0, 16) : '');
          }
          setLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!titulo) {
      setError('El título es obligatorio.');
      setLoading(false);
      return;
    }
    const tarea = {
      titulo,
      descripcion,
      fecha_limite: fechaLimite ? new Date(fechaLimite).toISOString() : null,
    };
    let result;
    if (id) {
      result = await supabase.from('tareas').update(tarea).eq('id', id);
    } else {
      result = await supabase.from('tareas').insert([tarea]);
    }
    if (result.error) setError(result.error.message);
    else navigate('/');
    setLoading(false);
  };

  return (
    <main aria-label={id ? 'Editar tarea' : 'Crear tarea'}>
      <h2>{id ? 'Editar tarea' : 'Nueva tarea'}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="titulo">Título</label>
        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          required
        />
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
        />
        <label htmlFor="fecha_limite">Fecha límite</label>
        <input
          id="fecha_limite"
          type="datetime-local"
          value={fechaLimite}
          onChange={e => setFechaLimite(e.target.value)}
        />
        {error && <div role="alert" style={{color: 'red'}}>{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
        <button type="button" onClick={() => navigate('/')} style={{marginLeft: '1em'}}>Cancelar</button>
      </form>
    </main>
  );
}
