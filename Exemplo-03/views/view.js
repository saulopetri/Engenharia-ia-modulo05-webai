import { VoiceRecorder } from '../components/VoiceRecorder.js';

/**
 * View
 *
 * Classe responsável por gerenciar a interface do usuário.
 * Fornece métodos para acessar e manipular elementos DOM,
 * além de encapsular a lógica de apresentação.
 *
 * @class View
 */
export class View {
    /**
     * Construtor da View
     * Inicializa referências aos elementos DOM e configura o VoiceRecorder
     */
    constructor() {
        this.elements = {
            temperature: document.getElementById('temperature'),
            temperatureValue: document.getElementById('temp-value'),
            topKValue: document.getElementById('topk-value'),
            topK: document.getElementById('topK'),
            form: document.getElementById('question-form'),
            questionInput: document.getElementById('question'),
            output: document.getElementById('output'),
            button: document.getElementById('ask-button'),
            year: document.getElementById('year'),
            fileInput: document.getElementById('file-input'),
            filePreview: document.getElementById('file-preview'),
            fileUploadBtn: document.getElementById('file-upload-btn'),
            fileSelectedName: document.getElementById('file-selected-name'),
            voiceBtn: document.getElementById('voice-record-btn')
        };

        /**
         * Instância do VoiceRecorder para gravação de áudio
         * @type {VoiceRecorder}
         */
        this.voiceRecorder = new VoiceRecorder({
            onStart: () => {
                if (this.elements.voiceBtn) {
                    this.elements.voiceBtn.classList.add('recording');
                }
            },
            onStop: (file) => {
                if (this.elements.voiceBtn) {
                    this.elements.voiceBtn.classList.remove('recording');
                }
                this.attachRecordedFile(file);
            },
            onError: (err) => {
                console.error('Voice recording error:', err);
            }
        });
    }

    /**
     * Define o ano atual no rodapé
     */
    setYear() {
        this.elements.year.textContent = new Date().getFullYear();
    }

    /**
     * Inicializa os parâmetros do formulário com valores padrão e limites
     *
     * @param {Object} params - Objeto contendo: defaultTemperature, maxTemperature, defaultTopK, maxTopK
     */
    initializeParameters(params) {
        this.elements.topK.max = params.maxTopK;
        this.elements.topK.min = 1;
        this.elements.topK.value = params.defaultTopK;
        this.elements.topKValue.textContent = params.defaultTopK;

        this.elements.temperatureValue.textContent = params.defaultTemperature;
        this.elements.temperature.max = params.maxTemperature;
        this.elements.temperature.min = 0;
        this.elements.temperature.value = params.defaultTemperature;
    }

    /**
     * Atualiza o display do valor de temperature
     *
     * @param {string|number} value - Valor a ser exibido
     */
    updateTemperatureDisplay(value) {
        this.elements.temperatureValue.textContent = value;
    }

    /**
     * Atualiza o display do valor de topK
     *
     * @param {string|number} value - Valor a ser exibido
     */
    updateTopKDisplay(value) {
        this.elements.topKValue.textContent = value;
    }

    /**
     * Obtém o texto da pergunta digitada
     *
     * @returns {string} Texto da pergunta
     */
    getQuestionText() {
        return this.elements.questionInput.value;
    }

    /**
     * Obtém o valor de temperature do formulário
     *
     * @returns {number} Valor da temperature
     */
    getTemperature() {
        return parseFloat(this.elements.temperature.value);
    }

    /**
     * Obtém o valor de topK do formulário
     *
     * @returns {number} Valor do topK
     */
    getTopK() {
        return parseInt(this.elements.topK.value);
    }

    /**
     * Obtém o arquivo selecionado (imagem ou áudio)
     *
     * @returns {File|null} Arquivo selecionado ou null se nenhum
     */
    getFile() {
        return this.elements.fileInput.files[0];
    }

    /**
     * Define o texto de saída (resposta da IA)
     *
     * @param {string} text - Texto a ser exibido
     */
    setOutput(text) {
        this.elements.output.textContent = text;
    }

    /**
     * Adiciona texto ao final da saída atual
     *
     * @param {string} text - Texto a ser concatenado
     */
    appendOutput(text) {
        this.elements.output.textContent += text;
    }

    /**
     * Exibe mensagens de erro na interface
     *
     * @param {string[]} errors - Array de mensagens de erro
     */
    showError(errors) {
        this.elements.output.innerHTML = errors.join('<br/>');
        this.elements.button.disabled = true;
    }

    /**
     * Altera o botão para o modo de parada (interromper geração)
     */
    setButtonToStopMode() {
        this.elements.button.textContent = 'Parar';
        this.elements.button.classList.add('stop-button');
    }

    /**
     * Altera o botão para o modo de envio
     */
    setButtonToSendMode() {
        this.elements.button.textContent = 'Enviar';
        this.elements.button.classList.remove('stop-button');
    }

    /**
     * Processa a pré-visualização do arquivo selecionado
     * Exibe imagem ou player de áudio com opção de remover
     *
     * @param {Event} event - Evento de change do input de arquivo
     */
    handleFilePreview(event) {
        const file = event.target.files[0];
        this.elements.filePreview.innerHTML = '';
        this.elements.fileSelectedName.textContent = '';

        if (!file) return;

        // Show selected file name
        this.elements.fileSelectedName.textContent = `✓ ${file.name}`;
        this.elements.fileSelectedName.classList.add('selected');

        const fileType = file.type.split('/')[0];
        const fileInfo = document.createElement('div');
        fileInfo.className = 'file-info';

        if (fileType === 'image') {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.className = 'preview-image';
            fileInfo.appendChild(img);
        } else if (fileType === 'audio') {
            const audio = document.createElement('audio');
            audio.src = URL.createObjectURL(file);
            audio.controls = true;
            audio.className = 'preview-audio';
            fileInfo.appendChild(audio);
        }

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-file-btn';
        removeBtn.textContent = '× Remover arquivo';
        removeBtn.onclick = () => {
            this.elements.fileInput.value = '';
            this.elements.filePreview.innerHTML = '';
            this.elements.fileSelectedName.textContent = '';
            this.elements.fileSelectedName.classList.remove('selected');
        };
        fileInfo.appendChild(removeBtn);

        this.elements.filePreview.appendChild(fileInfo);
    }

    /**
     * Dispara o clique no input de arquivo oculto
     */
    triggerFileInput() {
        this.elements.fileInput.click();
    }

    /**
     * Anexa um arquivo gravado ao input de arquivo
     * Usa DataTransfer para simular seleção de arquivo
     *
     * @param {File} file - Arquivo de áudio gravado
     */
    attachRecordedFile(file) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        this.elements.fileInput.files = dataTransfer.files;

        this.handleFilePreview({
            target: {
                files: dataTransfer.files
            }
        });
    }

    /**
     * Configura o event listener do botão de gravação de voz
     * Conecta o clique ao método toggle do VoiceRecorder
     */
    onVoiceButtonClick() {
        if (!this.elements.voiceBtn) return;

        this.elements.voiceBtn.addEventListener('click', () => {
            this.voiceRecorder.toggle();
        });
    }

    /**
     * Registra callback para mudanças no controle de temperature
     *
     * @param {Function} callback - Função a ser chamada no evento input
     */
    onTemperatureChange(callback) {
        this.elements.temperature.addEventListener('input', callback);
    }

    /**
     * Registra callback para mudanças no controle de topK
     *
     * @param {Function} callback - Função a ser chamada no evento input
     */
    onTopKChange(callback) {
        this.elements.topK.addEventListener('input', callback);
    }

    /**
     * Registra callback para mudanças no input de arquivo
     *
     * @param {Function} callback - Função a ser chamada no evento change
     */
    onFileChange(callback) {
        this.elements.fileInput.addEventListener('change', callback);
    }

    /**
     * Registra callback para cliques no botão de upload de arquivo
     *
     * @param {Function} callback - Função a ser chamada no evento click
     */
    onFileButtonClick(callback) {
        this.elements.fileUploadBtn.addEventListener('click', callback);
    }

    /**
     * Registra callback para submissão do formulário
     *
     * @param {Function} callback - Função a ser chamada no evento submit
     */
    onFormSubmit(callback) {
        this.elements.form.addEventListener('submit', callback);
    }
}
