const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');

/**
 * Serviço para integração com ElevenLabs TTS
 * Suporta múltiplas contas para maximizar uso gratuito
 */
class ElevenLabsService {
  constructor() {
    // Configurar Cloudinary (como o Akool usava) - usar CLOUDINARY_URL existente
    if (process.env.CLOUDINARY_URL) {
      // A configuração será feita automaticamente pela variável CLOUDINARY_URL
      console.log('🔧 Cloudinary configurado via CLOUDINARY_URL');
    }

    // Configuração de múltiplas contas ElevenLabs
    this.accounts = [
      {
        id: 1,
        apiKey: process.env.ELEVENLABS_API_KEY_1,
        used: 0,
        limit: 10000, // 10k caracteres por mês
        name: 'Conta 1'
      },
      {
        id: 2,
        apiKey: process.env.ELEVENLABS_API_KEY_2,
        used: 0,
        limit: 10000,
        name: 'Conta 2'
      },
      {
        id: 3,
        apiKey: process.env.ELEVENLABS_API_KEY_3,
        used: 0,
        limit: 10000,
        name: 'Conta 3'
      }
    ];

    // Vozes ElevenLabs com gêneros corretos (IDs reais)
    this.voices = {
      female: {
        id: 'x3mAOLD9WzlmrFCwA1S3', // Voz feminina portuguesa
        name: 'Feminina Premium',
        description: 'Voz feminina carinhosa e emotiva'
      },
      male: {
        id: 'CstacWqMhJQlnfLPxRG4', // Will - Deep - voz masculina portuguesa
        name: 'Masculina Premium (Will - Deep)',
        description: 'Voz masculina profunda e expressiva'
      }
    };

    this.baseUrl = 'https://api.elevenlabs.io/v1';
  }

  /**
   * Encontrar conta disponível com espaço suficiente
   */
  getAvailableAccount(textLength) {
    // Filtrar contas que têm API key configurada
    const validAccounts = this.accounts.filter(acc => acc.apiKey);

    if (validAccounts.length === 0) {
      throw new Error('Nenhuma API key do ElevenLabs configurada');
    }

    // Encontrar conta com espaço suficiente
    const availableAccount = validAccounts.find(acc =>
      acc.used + textLength <= acc.limit
    );

    if (!availableAccount) {
      // Se nenhuma conta tem espaço, usar a com mais espaço disponível
      const accountWithMostSpace = validAccounts.reduce((prev, current) =>
        (current.limit - current.used) > (prev.limit - prev.used) ? current : prev
      );

      console.warn(`⚠️ Todas as contas ElevenLabs próximas do limite. Usando ${accountWithMostSpace.name}`);
      return accountWithMostSpace;
    }

    console.log(`✅ Usando ${availableAccount.name} - Restam ${availableAccount.limit - availableAccount.used} caracteres`);
    return availableAccount;
  }

  /**
   * Gerar áudio usando ElevenLabs
   */
  async generateSpeech(text, voiceType = 'female') {
    try {
      const textLength = text.length;
      console.log(`🎙️ Gerando áudio ElevenLabs: ${textLength} caracteres`);

      // Encontrar conta disponível
      const account = this.getAvailableAccount(textLength);

      // Selecionar voz
      const voice = this.voices[voiceType] || this.voices.female;

      // Configurar request
      const requestData = {
        text: text,
        model_id: 'eleven_multilingual_v2', // Modelo que suporta português
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5, // Adiciona emoção
          use_speaker_boost: true
        }
      };

      const config = {
        method: 'POST',
        url: `${this.baseUrl}/text-to-speech/${voice.id}`,
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': account.apiKey
        },
        data: requestData,
        responseType: 'arraybuffer'
      };

      console.log(`🔊 Chamando ElevenLabs com voz: ${voice.name}`);

      const response = await axios(config);

      // Atualizar uso da conta
      account.used += textLength;

      console.log(`✅ Áudio gerado com sucesso! Conta ${account.name} usou ${textLength} caracteres`);

      return {
        audioBuffer: response.data,
        account: account.name,
        voice: voice.name,
        charactersUsed: textLength
      };

    } catch (error) {
      console.error('❌ Erro no ElevenLabs:', error.response?.data || error.message);

      if (error.response?.status === 401) {
        throw new Error('API key do ElevenLabs inválida');
      } else if (error.response?.status === 429) {
        throw new Error('Limite de rate do ElevenLabs atingido');
      } else if (error.response?.status === 422) {
        throw new Error('Limite de caracteres do ElevenLabs atingido');
      }

      throw error;
    }
  }

  /**
   * Salvar arquivo de áudio (upload para Cloudinary como Akool)
   */
  async saveAudioFile(audioBuffer, filename) {
    try {
      // Salvar temporariamente no disco
      const tempDir = path.join(process.cwd(), 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const tempFilePath = path.join(tempDir, filename);
      fs.writeFileSync(tempFilePath, audioBuffer);

      console.log(`🔄 Fazendo upload do áudio para Cloudinary...`);

      // Upload para Cloudinary (como o Akool fazia)
      const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
        resource_type: 'video', // Para arquivos de áudio
        folder: 'elevenlabs-voices',
        public_id: filename.replace('.mp3', ''),
        format: 'mp3'
      });

      // Remover arquivo temporário
      fs.unlinkSync(tempFilePath);

      const cloudinaryUrl = uploadResult.secure_url;
      console.log(`✅ Áudio enviado para Cloudinary: ${cloudinaryUrl}`);

      return cloudinaryUrl;
    } catch (error) {
      console.error('❌ Erro ao salvar áudio:', error);
      throw error;
    }
  }

  /**
   * Obter status de uso das contas
   */
  getUsageStatus() {
    const validAccounts = this.accounts.filter(acc => acc.apiKey);

    const status = {
      totalAccounts: validAccounts.length,
      totalUsed: validAccounts.reduce((sum, acc) => sum + acc.used, 0),
      totalLimit: validAccounts.reduce((sum, acc) => sum + acc.limit, 0),
      accounts: validAccounts.map(acc => ({
        name: acc.name,
        used: acc.used,
        remaining: acc.limit - acc.used,
        percentage: Math.round((acc.used / acc.limit) * 100)
      }))
    };

    status.totalRemaining = status.totalLimit - status.totalUsed;
    status.totalPercentage = Math.round((status.totalUsed / status.totalLimit) * 100);

    return status;
  }

  /**
   * Reset mensal do uso (chamar no dia 1º de cada mês)
   */
  resetMonthlyUsage() {
    this.accounts.forEach(acc => {
      acc.used = 0;
    });
    console.log('🔄 Uso mensal do ElevenLabs resetado');
  }

  /**
   * Verificar se há capacidade suficiente
   */
  hasCapacity(textLength) {
    const validAccounts = this.accounts.filter(acc => acc.apiKey);
    const totalRemaining = validAccounts.reduce((sum, acc) => sum + (acc.limit - acc.used), 0);
    return totalRemaining >= textLength;
  }
}

module.exports = ElevenLabsService;
