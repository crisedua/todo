import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Settings() {
  // Futuro: integración con preferencias reales del usuario
  const [tema, setTema] = useState('claro');
  const [idioma, setIdioma] = useState('es');

  return (
    <main aria-label="Configuración de usuario">
      <h2>Configuración</h2>
      <form>
        <label htmlFor="tema">Tema</label>
        <select id="tema" value={tema} onChange={e => setTema(e.target.value)}>
          <option value="claro">Claro</option>
          <option value="oscuro">Oscuro</option>
        </select>
        <label htmlFor="idioma">Idioma</label>
        <select id="idioma" value={idioma} onChange={e => setIdioma(e.target.value)}>
          <option value="es">Español</option>
          <option value="en">Inglés (próximamente)</option>
        </select>
      </form>
      <Link to="/">Volver al panel</Link>
    </main>
  );
}
