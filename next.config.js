/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Suprimir advertencias específicas de hidratación
  onRecoverableError: (err, errorInfo) => {
    // Ignorar errores de hidratación relacionados con cz-shortcut-listen
    if (
      err.message && 
      typeof err.message === 'string' && 
      err.message.includes('Extra attributes from the server: cz-shortcut-listen')
    ) {
      return; // No hacer nada para estos errores
    }
    // Para otros errores, usar el manejador por defecto
    console.error('Error recuperable:', err, errorInfo);
  },
  // Configuración de webpack para ignorar los warnings específicos
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.ignoreWarnings = [
        { 
          module: /node_modules\/next\/dist\/client\/components\/react-dev-overlay\/internal\/container\/Errors.*\.js$/,
          message: /Extra attributes from the server: cz-shortcut-listen/
        }
      ];
    }
    return config;
  }
}

module.exports = nextConfig
