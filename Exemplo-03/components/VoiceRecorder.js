/**
 * VoiceRecorder
 *
 * Componente para gravação de áudio no navegador usando a MediaRecorder API.
 * Fornece uma interface simples para iniciar, parar e alternar gravações,
 * com callbacks para integração com outros componentes.
 *
 * @class VoiceRecorder
 */
export class VoiceRecorder {
  /**
   * Construtor do VoiceRecorder
   *
   * @param {Object} options - Opções de configuração
   * @param {Function} options.onStart - Callback chamado quando a gravação inicia
   * @param {Function} options.onStop - Callback chamado quando a gravação para, recebe o arquivo gravado
   * @param {Function} options.onError - Callback chamado em caso de erro
   */
  constructor(options = {}) {
    this.options = {
      onStart: () => {},
      onStop: () => {},
      onError: () => {},
      ...options
    };

    /**
     * Instância do MediaRecorder
     * @type {MediaRecorder|null}
     */
    this.mediaRecorder = null;

    /**
     * Stream de mídia do microfone
     * @type {MediaStream|null}
     */
    this.stream = null;

    /**
     * Array de chunks de dados de áudio
     * @type {Blob[]}
     */
    this.chunks = [];

    /**
     * Estado de gravação
     * @type {boolean}
     */
    this.isRecording = false;
  }

  /**
   * Inicia a gravação de áudio
   * Solicita permissão para acessar o microfone e configura o MediaRecorder
   */
  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      this.mediaRecorder = new MediaRecorder(this.stream);
      this.chunks = [];

      this.mediaRecorder.ondataavailable = (e) => {
        this.chunks.push(e.data);
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: 'audio/webm' });

        const file = new File([blob], `voice-${Date.now()}.webm`, {
          type: 'audio/webm'
        });

        this.options.onStop(file);
      };

      this.mediaRecorder.start();
      this.isRecording = true;

      this.options.onStart();

    } catch (error) {
      this.options.onError(error);
    }
  }

  /**
   * Para a gravação em andamento
   * Interrompe o MediaRecorder e libera os recursos do microfone
   */
  stop() {
    if (!this.mediaRecorder) return;

    this.mediaRecorder.stop();

    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
    }

    this.isRecording = false;
  }

  /**
   * Alterna entre iniciar e parar a gravação
   * Se estiver gravando, para; se não estiver, inicia
   */
  toggle() {
    if (this.isRecording) {
      this.stop();
    } else {
      this.start();
    }
  }
}
