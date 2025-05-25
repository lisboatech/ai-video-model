'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const VoiceContext = createContext();

export const useVoices = () => {
    const context = useContext(VoiceContext);
    if (!context) {
        throw new Error('useVoices must be used within a VoiceProvider');
    }
    return context;
};

export const VoiceProvider = ({ children }) => {
    const [voices, setVoices] = useState([]);
    const [loading, setLoading] = useState(true); // Inicia como true
    const [loaded, setLoaded] = useState(false);

    const loadVoices = async () => {
        if (loaded) return voices;

        try {
            console.log("🎙️ Iniciando carregamento das vozes...");
            const result = await axios.get('/api/get-voice-list');
            console.log("✅ Vozes carregadas no contexto:", result.data);

            // Garantir que sempre temos um array, mesmo que vazio
            const voicesArray = Array.isArray(result.data) ? result.data : [];
            setVoices(voicesArray);
            setLoaded(true);

            if (voicesArray.length === 0) {
                console.log("ℹ️ Nenhuma voz Akool carregada (usando apenas ElevenLabs)");
            }

            return voicesArray;
        } catch (error) {
            console.error("❌ Erro ao carregar vozes:", error);
            console.log("ℹ️ Continuando apenas com vozes ElevenLabs...");

            // Em caso de erro, definir array vazio para não quebrar o componente
            setVoices([]);
            setLoaded(true);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Pre-load voices IMEDIATAMENTE when component mounts
    useEffect(() => {
        loadVoices();
    }, []);

    const value = {
        voices,
        loading,
        loaded,
        loadVoices
    };

    return (
        <VoiceContext.Provider value={value}>
            {children}
        </VoiceContext.Provider>
    );
};
