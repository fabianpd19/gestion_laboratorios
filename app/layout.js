import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Gestión de Laboratorios',
  description: 'Sistema de gestión de laboratorios',
}

// Script que se ejecutará antes de la hidratación
const cleanupScript = `
  // Función para limpiar atributos no deseados
  (function() {
    try {
      // Eliminar atributos del body
      const body = document.body;
      if (body) {
        body.removeAttribute('cz-shortcut-listen');
        body.removeAttribute('style');
      }
      
      // Eliminar atributos del html
      const html = document.documentElement;
      if (html) {
        html.removeAttribute('cz-shortcut-listen');
        html.removeAttribute('style');
      }
      
      // Configurar MutationObserver para limpieza continua
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'attributes' && 
              (mutation.attributeName === 'cz-shortcut-listen' || 
               mutation.attributeName === 'style')) {
            mutation.target.removeAttribute(mutation.attributeName);
          }
        });
      });
      
      // Observar body y html
      if (body) {
        observer.observe(body, { 
          attributes: true,
          attributeFilter: ['cz-shortcut-listen', 'style']
        });
      }
      
      if (html) {
        observer.observe(html, { 
          attributes: true,
          attributeFilter: ['cz-shortcut-listen', 'style']
        });
      }
      
      // Sobrescribir console.error para filtrar advertencias
      const originalError = console.error;
      console.error = function() {
        if (arguments[0] && 
            typeof arguments[0] === 'string' && 
            (arguments[0].includes('Extra attributes') || 
             arguments[0].includes('cz-shortcut-listen'))) {
          return;
        }
        originalError.apply(console, arguments);
      };
      
    } catch (e) {
      console.warn('Error en el script de limpieza:', e);
    }
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <Script 
          id="cleanup-script" 
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: cleanupScript }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
