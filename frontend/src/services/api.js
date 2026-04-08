const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://cadatro-de-visitantes-e-gest-o-de.onrender.com";

if (!import.meta.env.VITE_API_URL) {
  console.warn("⚠️ VITE_API_URL não definida. Usando URL de fallback.");
}

export const API_URL = `${BASE_URL}/api`;
export default BASE_URL;