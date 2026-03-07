/**
 * VoiceRecorder - Componente para gravação de voz usando Web Speech API
 *
 * Encapsula a funcionalidade de SpeechRecognition fornecendo uma interface
 * simples com callbacks para eventos de gravação, transcrição e erros.
 * Suporta transcrição contínua e resultados intermediários.
 *
 * @class VoiceRecorder
 */
export class VoiceRecorder {
  /**
   * Cria uma nova instância do VoiceRecorder
   * @param {Object} options - Opções de configuração
   * @param {string} options.language - Idioma para reconhecimento (padrão: 'pt-BR')
   * @param {boolean} options.continuous - Se a gravação é contínua (padrão: true)
   * @param {boolean} options.interimResults - Se retorna resultados intermediários (padrão: true)
   * @param {Function} options.onStart - Callback chamado ao iniciar gravação
   * @param {Function} options.onResult - Callback chamado com resultados de transcrição
   * @param {Function} options.onEnd - Callback chamado ao encerrar gravação
   * @param {Function} options.onError - Callback chamado em caso de erro
   */
  constructor(options = {}) {
    // Obtém a API de SpeechRecognition (compatibilidade Chrome/Edge)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    // Configurações padrão mescladas com opções fornecidas
    this.options = {
      language: 'pt-BR',
      continuous: true,
      interimResults: true,
      onStart: () => {},
      onResult: () => {},
      onEnd: () => {},
      onError: () => {},
      ...options
    };

    // Estado da gravação
    this.isRecording = false;
    this.finalTranscript = '';   // Texto final já transcrito
    this.interimTranscript = ''; // Texto intermediário em transcrição

    // Se o navegador não suporta SpeechRecognition, marca como null
    if (!SpeechRecognition) {
      this.recognition = null;
      return;
    }

    // Cria instância do reconhecedor de fala
    this.recognition = new SpeechRecognition();
    this.configure();
    this.attachEvents();
  }

  /**
   * Configura as propriedades do SpeechRecognition com as opções
   */
  configure() {
    if (!this.recognition) return;

    this.recognition.lang = this.options.language;
    this.recognition.continuous = this.options.continuous;
    this.recognition.interimResults = this.options.interimResults;
  }

  /**
   * Registra callbacks para eventos do SpeechRecognition
   */
  attachEvents() {
    if (!this.recognition) return;

    // Evento: início do reconhecimento
    this.recognition.onstart = () => {
      this.isRecording = true;
      this.options.onStart();
    };

    // Evento: resultado da transcrição
    this.recognition.onresult = (event) => {
      let interim = '';
      let finalChunk = '';

      // Processa todos os resultados desde o último índice
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalChunk += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      // Acumula texto final e armazena intermediário
      if (finalChunk) {
        this.finalTranscript += finalChunk;
      }

      this.interimTranscript = interim;

      // Notifica callback com textos final e intermediário
      this.options.onResult({
        final: this.finalTranscript.trim(),
        interim: this.interimTranscript
      });
    };

    // Evento: erro no reconhecimento
    this.recognition.onerror = (event) => {
      this.options.onError({
        type: event.error,
        message: event.message || event.error
      });
    };

    // Evento: fim do reconhecimento
    this.recognition.onend = () => {
      const final = this.finalTranscript.trim();

      this.isRecording = false;

      this.options.onEnd({ final });

      // Se modo contínuo e há texto final, reinicia gravação
      if (this.options.continuous && final && this.isRecording) {
        try {
          this.recognition.start();
        } catch {}
      }
    };
  }

  /**
   * Inicia a gravação de voz
   * Limpa transcrições anteriores e inicia o SpeechRecognition
   */
  start() {
    if (!this.recognition) return;

    this.finalTranscript = '';
    this.interimTranscript = '';

    try {
      this.recognition.start();
    } catch {}
  }

  /**
   * Para a gravação de voz
   * Interrompe o SpeechRecognition e atualiza estado
   */
  stop() {
    if (!this.recognition) return;

    try {
      this.recognition.stop();
    } catch {}

    this.isRecording = false;
  }

  /**
   * Alterna entre iniciar e parar gravação
   */
  toggle() {
    if (this.isRecording) {
      this.stop();
    } else {
      this.start();
    }
  }

  /**
   * Limpa as transcrições acumuladas
   */
  clear() {
    this.finalTranscript = '';
    this.interimTranscript = '';
  }

  /**
   * Altera o idioma do reconhecimento
   * @param {string} lang - Código do idioma (ex: 'pt-BR', 'en-US')
   */
  setLanguage(lang) {
    this.options.language = lang;

    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }
}
