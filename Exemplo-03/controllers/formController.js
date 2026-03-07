/**
 * FormController
 *
 * Controlador responsável por gerenciar a lógica do formulário de interação com a IA.
 * Coordena a comunicação entre a View, Services de IA e tradução.
 *
 * @class FormController
 */
export class FormController {
    /**
     * Construtor do FormController
     *
     * @param {Object} aiService - Serviço de IA responsável pela criação de sessões e geração de respostas
     * @param {Object} translationService - Serviço de tradução para conversão de respostas para português
     * @param {Object} view - Instância da View para manipulação da interface
     */
    constructor(aiService, translationService, view) {
        this.aiService = aiService;
        this.translationService = translationService;
        this.view = view;
        this.isGenerating = false;
    }

    /**
     * Configura todos os event listeners da interface
     * Inclui controles de parâmetros, upload de arquivos, gravação de voz e submissão do formulário
     */
    setupEventListeners() {
        // Update display values for range inputs
        this.view.onTemperatureChange((e) => {
            this.view.updateTemperatureDisplay(e.target.value);
        });

        this.view.onTopKChange((e) => {
            this.view.updateTopKDisplay(e.target.value);
        });

        // File input handlers
        this.view.onFileChange((event) => {
            this.view.handleFilePreview(event);
        });

        this.view.onFileButtonClick(() => {
            this.view.triggerFileInput();
        });
        
        // Voice recorder button
        this.view.onVoiceButtonClick();

        // Form submit handler
        this.view.onFormSubmit(async (event) => {
            event.preventDefault();

            if (this.isGenerating) {
                this.stopGeneration();
                return;
            }

            await this.handleSubmit();
        });
    }

    /**
     * Processa a submissão do formulário
     * Obtém a pergunta e parâmetros, inicia sessão com IA, faz streaming de resposta
     * e traduz o resultado final para português
     */
    async handleSubmit() {
        const question = this.view.getQuestionText();

        if (!question.trim()) {
            return;
        }

        // Get parameters from form
        const temperature = this.view.getTemperature();
        const topK = this.view.getTopK();
        const file = this.view.getFile();

        console.log('Using parameters:', { temperature, topK });

        // Change button to stop mode
        this.toggleButton(true);

        this.view.setOutput('Processing your question...');

        try {
            const aiResponseChunks = await this.aiService.createSession(
                question,
                temperature,
                topK,
                file
            );

            this.view.setOutput('');

            let fullResponse = '';
            for await (const chunk of aiResponseChunks) {
                if (this.aiService.isAborted()) {
                    break;
                }
                console.log('Received chunk:', chunk);
                fullResponse += chunk;
                this.view.setOutput(fullResponse);
            }

            // Translate the full response to Portuguese
            if (fullResponse && !this.aiService.isAborted()) {
                this.view.setOutput('Traduzindo resposta...');
                const translatedResponse = await this.translationService.translateToPortuguese(fullResponse);
                this.view.setOutput(translatedResponse);
            }
        } catch (error) {
            console.error('Error during AI generation:', error);
            this.view.setOutput(`Erro: ${error.message}`);
        }

        this.toggleButton(false);
    }

    /**
     * Interrompe a geração de resposta em andamento
     * Aborta a sessão de IA e restaura o estado do botão
     */
    stopGeneration() {
        this.aiService.abort();
        this.toggleButton(false);
    }

    /**
     * Alterna o estado do botão entre modos Enviar/Parar
     *
     * @param {boolean} isGenerating - Se true, ativa modo de parada; se false, ativa modo de envio
     */
    toggleButton(isGenerating) {
        this.isGenerating = isGenerating;

        if (isGenerating) {
            this.view.setButtonToStopMode();
        } else {
            this.view.setButtonToSendMode();
        }
    }
}
