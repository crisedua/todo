import { createClient } from '@supabase/supabase-js';

// Obtener las variables de entorno o usar valores predeterminados para desarrollo
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciO...tu-clave-aqui';

// Validar URL para prevenir errores
let validUrl;
try {
  // Verificar si la URL es válida
  validUrl = new URL(supabaseUrl).toString();
} catch (error) {
  // Si no es válida, usar una URL predeterminada (esto evitará errores en desarrollo)
  console.error('URL de Supabase inválida:', supabaseUrl);
  console.error('Por favor, actualiza tu archivo .env con valores correctos.');
  validUrl = 'http://localhost:3000'; // URL temporal para evitar errores
}

export const supabase = createClient(validUrl, supabaseAnonKey);
