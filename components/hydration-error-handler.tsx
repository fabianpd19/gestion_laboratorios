'use client';

import { useEffect } from 'react';

export function HydrationErrorHandler() {
  useEffect(() => {
    // Función para limpiar atributos no deseados
    const cleanupAttributes = () => {
      // Eliminar atributos específicos del body
      if (typeof document !== 'undefined') {
        document.body?.removeAttribute('cz-shortcut-listen');
        document.documentElement?.removeAttribute('cz-shortcut-listen');
      }
    };

    // Limpiar atributos inmediatamente
    cleanupAttributes();

    // Configurar un MutationObserver para limpiar atributos si se vuelven a añadir
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'cz-shortcut-listen' || 
             mutation.attributeName === 'style')) {
          cleanupAttributes();
        }
      });
    });

    // Observar cambios en el body y html
    if (typeof document !== 'undefined') {
      if (document.body) {
        observer.observe(document.body, { 
          attributes: true, 
          attributeFilter: ['cz-shortcut-listen', 'style'] 
        });
      }
      
      if (document.documentElement) {
        observer.observe(document.documentElement, { 
          attributes: true, 
          attributeFilter: ['cz-shortcut-listen', 'style'] 
        });
      }
    }

    // Sobrescribir console.error para filtrar advertencias de hidratación
    const originalConsoleError = window.console.error;
    
    window.console.error = function (...args) {
      // Filtrar mensajes de error de hidratación específicos
      if (
        typeof args[0] === 'string' &&
        (args[0].includes('Extra attributes from the server') ||
         args[0].includes('cz-shortcut-listen'))
      ) {
        // No mostrar estos errores en consola
        return;
      }
      
      // Llamar a la implementación original para otros errores
      originalConsoleError.apply(window.console, args);
    };

    // Limpieza al desmontar
    return () => {
      observer.disconnect();
      window.console.error = originalConsoleError;
    };
  }, []);

  return null;
}
