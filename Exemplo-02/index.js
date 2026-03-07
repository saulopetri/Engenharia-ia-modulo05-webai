
/**
 * Web AI Demo - Aplicação de demonstração da API LanguageModel
 *
 * Este arquivo gerencia a interface principal da aplicação, integrando
 * o modelo de linguagem nativo do Chrome com um componente de gravação de voz.
 *
 * @module WebAIDemo
 */

import { VoiceRecorder } from './components/VoiceRecorder.js';

/**
 * Contexto global para gerenciar o estado da sessão de IA
 * Mantém referências à sessão ativa, controlador de abortamento e estado de geração
 */
const aiContext = {
    session: null,           // Sessão ativa do LanguageModel
    abortController: null,   // Controlador para cancelar requisições em andamento
    isGenerating: false,     // Flag que indica se uma geração está em progresso
};

/**
 * Mapa de elementos do DOM para acesso rápido
 * Centraliza todas as referências a elementos da interface
 */
const elements = {
    // Controles de parâmetros do modelo
    temperature: document.getElementById('temperature'),
    temperatureValue: document.getElementById('temp-value'),
    topKValue: document.getElementById('topk-value'),
    topK: document.getElementById('topK'),
    
    // Elementos do formulário principal
    form: document.getElementById('question-form'),
    questionInput: document.getElementById('question'),
    output: document.getElementById('output'),
    button: document.getElementById('ask-button'),
    year: document.getElementById('year'),
    
    // Elementos do Voice Recorder
    voiceRecorder: document.getElementById('voice-recorder'),
    voiceRecordBtn: document.getElementById('voice-record-btn'),
    voiceBtnText: document.getElementById('voice-btn-text'),
    voiceClearBtn: document.getElementById('voice-clear-btn'),
    voiceTranscript: document.getElementById('voice-transcript'),
    voiceError: document.getElementById('voice-error'),
    voiceStatus: document.getElementById('voice-status'),
    voiceContinuous: document.getElementById('voice-continuous'),
    voiceLanguage: document.getElementById('voice-language'),
};

/**
 * Configura todos os event listeners da aplicação
 * Inclui controles de parâmetros, formulário e botões de gravação de voz
 */
async function setupEventListeners() {
    // Atualiza exibição dos valores dos controles deslizantes
    elements.temperature.addEventListener('input', (e) => {
        elements.temperatureValue.textContent = e.target.value;
    });

    elements.topK.addEventListener('input', (e) => {
        elements.topKValue.textContent = e.target.value;
    });

    // Manipula o envio do formulário de pergunta
    elements.form.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Se já estiver gerando, interrompe a geração atual
        if (aiContext.isGenerating) {
            toggleSendOrStopButton(false);
            return;
        }

        onSubmitQuestion();
    });

    // Event listeners do Voice Recorder
    if (elements.voiceRecordBtn) {
        elements.voiceRecordBtn.addEventListener('click', () => {
            if (voiceRecorder) voiceRecorder.toggle();
        });
    }

    if (elements.voiceClearBtn) {
        elements.voiceClearBtn.addEventListener('click', () => {
            if (voiceRecorder) voiceRecorder.clear();
            elements.voiceTranscript.innerHTML = '';
            hideVoiceError();
        });
    }

    // Seletor de idioma removido da interface (usado valor padrão)
}

/**
 * Processa o envio da pergunta do usuário
 * Obtém os parâmetros do formulário, inicia a geração da resposta
 * e atualiza a interface com o streaming de resultados
 */
async function onSubmitQuestion() {
    const questionInput = elements.questionInput;
    const output = elements.output;
    const question = questionInput.value;

    // Valida se a pergunta não está vazia
    if (!question.trim()) {
        return;
    }

    // Obtém parâmetros do formulário
    const temperature = parseFloat(elements.temperature.value);
    const topK = parseInt(elements.topK.value);
    console.log('Usando parâmetros:', { temperature, topK });

    // Altera o botão para modo de parada
    toggleSendOrStopButton(true);

    output.textContent = 'Processando sua pergunta...';
    const aiResponseChunks = await askAI(question, temperature, topK);
    output.textContent = '';

    // Processa o streaming de resposta chunk por chunk
    for await (const chunk of aiResponseChunks) {
        if (aiContext.abortController.signal.aborted) {
            break;
        }
        console.log('Chunk recebido:', chunk);
        output.textContent += chunk;
    }

    toggleSendOrStopButton(false);
}

/**
 * Instância global do VoiceRecorder
 * Gerenciada durante a inicialização da aplicação
 */
let voiceRecorder;

/**
 * Alterna o botão entre os modos "Enviar" e "Parar"
 * @param {boolean} isGenerating - Se true, ativa modo de parada; se false, retorna ao modo envio
 */
function toggleSendOrStopButton(isGenerating) {
    if (isGenerating) {
        // Ativa modo de parada
        aiContext.isGenerating = isGenerating;
        elements.button.textContent = 'Parar';
        elements.button.classList.add('stop-button');
    } else {
        // Retorna ao modo de envio
        aiContext.abortController?.abort();
        aiContext.isGenerating = isGenerating;
        elements.button.textContent = 'Enviar';
        elements.button.classList.remove('stop-button');
    }
}
/**
 * Gera resposta da IA usando streaming
 * Cria uma nova sessão do LanguageModel com os parâmetros fornecidos
 * e retorna um generator que produz chunks de resposta
 *
 * @param {string} question - A pergunta do usuário
 * @param {number} temperature - Controla a criatividade (0-2)
 * @param {number} topK - Limita seleção às K palavras mais prováveis
 * @returns {AsyncGenerator<string>} Generator que produz chunks de texto
 */
async function* askAI(question, temperature, topK) {
    // Cancela requisição anterior se existir
    aiContext.abortController?.abort();
    aiContext.abortController = new AbortController();

    // Destrói sessão anterior e cria nova com parâmetros atualizados
    if (aiContext.session) {
        aiContext.session.destroy();
    }

    const session = await LanguageModel.create({
        expectedInputLanguages: ["pt"],
        temperature: temperature,
        topK: topK,
        initialPrompts: [
            {
                role: 'system',
                content: `
                Você é um assistente de IA que responde de forma clara e objetiva.
                Responda sempre em formato de texto ao invés de markdown`
            },
        ],
    });

    // Armazena a sessão no contexto para gerenciamento posterior
    aiContext.session = session;

    const responseStream = await session.promptStreaming(
        [
            {
                role: 'user',
                content: question,
            },
        ],
        {
            signal: aiContext.abortController.signal,
        }
    );

    // Produz chunks de resposta conforme chegam
    for await (const chunk of responseStream) {
        if (aiContext.abortController.signal.aborted) {
            break;
        }
        yield chunk;
    }
}

/**
 * Verifica se o ambiente atende aos requisitos para usar a API LanguageModel
 * Inclui verificação de navegador, disponibilidade da API e do modelo
 *
 * @returns {Array<string>|null} Lista de erros ou null se tudo estiver ok
 */
async function checkRequirements() {
    const errors = [];
    const returnResults = () => errors.length ? errors : null;

    // Verifica se está no Chrome/Chromium
    // @ts-ignore - window.chrome é específico do Chrome
    const isChrome = !!window.chrome;
    if (!isChrome) {
        errors.push("⚠️ Este recurso só funciona no Google Chrome ou Chrome Canary (versão recente).");
    }
    
    // Verifica se a API LanguageModel está disponível
    if (!('LanguageModel' in self)) {
        errors.push("⚠️ As APIs nativas de IA não estão ativas.");
        errors.push("Ative a seguinte flag em chrome://flags/:");
        errors.push("- Prompt API for Gemini Nano (chrome://flags/#prompt-api-for-gemini-nano)");
        errors.push("Depois reinicie o Chrome e tente novamente.");
        return returnResults();
    }

    // Verifica disponibilidade do modelo para o idioma português
    const availability = await LanguageModel.availability({ languages: ["pt"] });
    console.log('Disponibilidade do Language Model:', availability);
    
    if (availability === 'available') {
        return returnResults();
    }

    if (availability === 'unavailable') {
        errors.push(`⚠️ O seu dispositivo não suporta modelos de linguagem nativos de IA.`);
    }

    if (availability === 'downloading') {
        errors.push(`⚠️ O modelo de linguagem de IA está sendo baixado. Por favor, aguarde alguns minutos e tente novamente.`);
    }

    // Se o modelo ainda não foi baixado, inicia o download
    if (availability === 'downloadable') {
        errors.push(`⚠️ O modelo de linguagem de IA precisa ser baixado, baixando agora... (acompanhe o progresso no terminal do chrome)`);
        try {
            const session = await LanguageModel.create({
                expectedInputLanguages: ["pt"],
                monitor(m) {
                    m.addEventListener('downloadprogress', (e) => {
                        const percent = ((e.loaded / e.total) * 100).toFixed(0);
                        console.log(`Baixado ${percent}%`);
                    });
                }
            });
            await session.prompt('Olá');
            session.destroy();

            // Revalida disponibilidade após o download
            const newAvailability = await LanguageModel.availability({ languages: ["pt"] });
            if (newAvailability === 'available') {
                return null; // Download bem-sucedido
            }
        } catch (error) {
            console.error('Erro ao baixar modelo:', error);
            errors.push(`⚠️ Erro ao baixar o modelo: ${error.message}`);
        }
    }

    return returnResults();
}

/**
 * Helpers da interface do Voice Recorder
 * Funções auxiliares para gerenciar a UI do gravador de voz
 */

/**
 * Atualiza o indicador de status do gravador de voz
 * @param {string} status - Estado: 'recording', 'processing', 'error' ou 'idle'
 * @param {string} message - Mensagem a ser exibida
 */
function updateVoiceStatus(status, message) {
    if (!elements.voiceStatus) return;
    
    elements.voiceStatus.textContent = message;
    elements.voiceStatus.className = 'voice-recorder-status';
    
    if (status === 'recording') {
        elements.voiceStatus.classList.add('recording');
    } else if (status === 'processing') {
        elements.voiceStatus.classList.add('processing');
    } else if (status === 'error') {
        elements.voiceStatus.classList.add('error');
    }
}

/**
 * Exibe uma mensagem de erro do gravador de voz
 * @param {string} message - Mensagem de erro a ser exibida
 */
function showVoiceError(message) {
    if (!elements.voiceError) return;
    elements.voiceError.textContent = message;
    elements.voiceError.style.display = 'block';
}

/**
 * Oculta a mensagem de erro do gravador de voz
 */
function hideVoiceError() {
    if (!elements.voiceError) return;
    elements.voiceError.style.display = 'none';
}

/**
 * Atualiza a transcrição com texto final e intermediário
 * @param {string} final - Texto final já transcrito
 * @param {string} interim - Texto intermediário ainda em transcrição
 */
function updateVoiceTranscript(final, interim) {
    if (!elements.voiceTranscript) return;
    
    let html = '';
    if (final) {
        html += `<div>${escapeHtml(final)}</div>`;
    }
    if (interim) {
        html += `<div class="interim">${escapeHtml(interim)}</div>`;
    }
    elements.voiceTranscript.innerHTML = html;
    
    // Auto-scroll para o final
    elements.voiceTranscript.scrollTop = elements.voiceTranscript.scrollHeight;
}

/**
 * Escapa caracteres HTML para prevenir XSS
 * @param {string} text - Texto a ser escapado
 * @returns {string} Texto com caracteres HTML escapados
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Inicializa o componente VoiceRecorder
 * Configura a instância com callbacks para gerenciar a UI
 */
function initVoiceRecorder() {
    if (!elements.voiceRecordBtn) {
        console.log('Elementos do Voice Recorder não encontrados, pulando inicialização');
        return;
    }

    // Obtém configurações da UI (com valores padrão caso elementos não existam)
    const continuous = elements.voiceContinuous?.checked ?? true;
    const language = elements.voiceLanguage?.value ?? 'pt-BR';

    voiceRecorder = new VoiceRecorder({
        language: language,
        continuous: continuous,
        interimResults: true,
        
        // Callback: início da gravação
        onStart: () => {
            updateVoiceStatus('recording', 'Gravando...');
            elements.voiceRecordBtn.classList.add('recording');
            elements.voiceRecordBtn.disabled = false;
            hideVoiceError();
        },
        
        // Callback: resultado da transcrição
        onResult: ({ final, interim }) => {
            updateVoiceTranscript(final, interim);
        },
        
        // Callback: erro na gravação
        onError: ({ type, message }) => {
            console.error('Erro no Voice Recorder:', type, message);
            updateVoiceStatus('error', 'Erro');
            showVoiceError(message);
            resetVoiceButton();
        },
        
        // Callback: fim da gravação
        onEnd: ({ final }) => {
            updateVoiceStatus('idle', 'Pronto');
            resetVoiceButton();
            
            // Se temos transcrição final, adiciona ao campo de pergunta
            if (final && elements.questionInput) {
                const currentValue = elements.questionInput.value;
                const separator = currentValue.trim() ? '\n' : '';
                elements.questionInput.value = currentValue + separator + final;
            }
        }
    });

    // Verifica se o Speech Recognition é suportado
    if (!voiceRecorder.recognition) {
        showVoiceError('Seu navegador não suporta gravação de voz. Use Google Chrome ou Edge.');
        elements.voiceRecordBtn.disabled = true;
    }
}

/**
 * Reseta o estado visual do botão de gravação
 */
function resetVoiceButton() {
    if (!elements.voiceRecordBtn) return;
    elements.voiceRecordBtn.classList.remove('recording');
    elements.voiceRecordBtn.disabled = false;
}

/**
 * Função principal de inicialização da aplicação
 * IIFE - Executa automaticamente quando o módulo é carregado
 */
(async function main() {
    // Atualiza o ano no rodapé
    elements.year.textContent = new Date().getFullYear();

    // Verifica requisitos do sistema
    const reqErrors = await checkRequirements();
    if (reqErrors) {
        elements.output.innerHTML = reqErrors.join('<br/>');
        elements.button.disabled = true;
        return;
    }

    // Obtém parâmetros padrão do LanguageModel
    const params = await LanguageModel.params();
    console.log('Parâmetros do Language Model:', params);
    /*
    defaultTemperature: 1
    defaultTopK: 3
    maxTemperature: 2
    maxTopK: 128
    */

    // Configura controle de TopK
    elements.topK.max = params.maxTopK;
    elements.topK.min = 1;
    elements.topK.value = params.defaultTopK;
    elements.topKValue.textContent = params.defaultTopK;

    // Configura controle de Temperature
    elements.temperatureValue.textContent = params.defaultTemperature;
    elements.temperature.max = params.maxTemperature;
    elements.temperature.min = 0;
    elements.temperature.value = params.defaultTemperature;
    
    // Configura event listeners
    await setupEventListeners();
    
    // Inicializa o VoiceRecorder após o DOM estar pronto
    initVoiceRecorder();
})();

