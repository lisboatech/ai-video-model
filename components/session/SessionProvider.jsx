"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Criar o contexto da sessão
const SessionContext = createContext();

// Hook para usar o contexto da sessão
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession deve ser usado dentro de um SessionProvider');
  }
  return context;
};

// Componente provider da sessão
export function SessionProvider({ children }) {
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Inicializar o ID da sessão
  useEffect(() => {
    // Verificar se já existe um ID de sessão no localStorage
    let id = localStorage.getItem('sessionId');
    
    // Se não existir, criar um novo ID e armazenar no localStorage
    if (!id) {
      id = uuidv4();
      localStorage.setItem('sessionId', id);
    }
    
    setSessionId(id);
    setIsLoading(false);
  }, []);

  // Valor do contexto
  const value = {
    sessionId,
    isLoading
  };

  // Renderizar o provider com o valor do contexto
  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export default SessionProvider;
