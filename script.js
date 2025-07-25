let currentScreen = 'menu-screen';
let playerName = '';
let score = 0;
let currentCardIndex = 0;
let revealedTipsCount = 0;
let revealedTipsForCurrentCard = [];
const maxCardsPerGame = 10; // Máximo de cartas na rodada (para o modo solo)

let shuffledCardsForCurrentGame = [];

// Removidas: Variáveis relacionadas ao modo multiplayer (hostedGameCards, currentRoomCode, BASE_URL_FOR_QR, minCardsForHostedGame)

// Array de cartas padrão (mantido o mesmo)
const defaultCards = [
    {
        tema: "Pessoa",
        dicas: ["É considerada a primeira programadora da história.", "Trabalhou nas anotações sobre a Máquina Analítica de Charles Babbage.", "Filha do poeta Lord Byron.", "Suas anotações são cruciais para a história da computação.", "Um idioma de programação foi nomeado em sua homenagem."],
        resposta: "Ada Lovelace"
    },
    {
    tema: "Pessoa",
    dicas: ["Foi um matemático, filósofo, inventor e engenheiro mecânico britânico.", "É frequentemente chamado de 'pai do computador'.", "Projetou a Máquina Diferencial e a Máquina Analítica.", "Seus projetos, embora não totalmente construídos em sua época, foram visionários.", "Ada Lovelace trabalhou em suas anotações e viu o potencial de sua máquina."],
    resposta: "Charles Babbage"
    },
    {
    tema: "Pessoa",
    dicas: ["Foi um brilhante matemático britânico.", "Desempenhou um papel crucial na quebra de códigos durante a Segunda Guerra Mundial.", "Sua 'Máquina' é um conceito fundamental na ciência da computação.", "É considerado o pai da inteligência artificial.", "Sofreu perseguição por sua orientação sexual."],
    resposta: "Alan Turing"
    },
    {
    tema: "Pessoa",
    dicas: ["Foi uma almirante da Marinha dos EUA.", "Desenvolveu o primeiro compilador para linguagem de programação.", "Popularizou a ideia de linguagens de programação baseadas em inglês.", "É famosa por ter encontrado o primeiro 'bug' real em um computador (uma mariposa).", "Uma linguagem de programação orientada a negócios tem suas iniciais no nome."],
    resposta: "Grace Hopper"
    },
    {
    tema: "Pessoa",
    dicas: ["Co-fundou uma das maiores empresas de software do mundo.", "Sua empresa é famosa pelo sistema operacional Windows.", "Abandonou Harvard para perseguir sua paixão pela computação.", "É também um grande filantropo, junto com sua ex-esposa.", "Sua empresa dominou o mercado de software de computador pessoal por décadas."],
    resposta: "Bill Gates"
    },
    {
    tema: "Pessoa",
    dicas: ["Co-fundou uma empresa de tecnologia famosa por seus produtos inovadores e design.", "Era conhecido por suas apresentações carismáticas de novos produtos.", "Liderou a criação do Macintosh, iPod, iPhone e iPad.", "Foi forçado a sair da própria empresa em um período e depois retornou.", "Sua visão transformou a indústria da música e dos telefones celulares."],
    resposta: "Steve Jobs"
    },
    {
        tema: "Coisa",
        dicas: ["É uma rede global de computadores.", "Permite a troca de informações em todo o mundo.", "Surgiu a partir de um projeto militar nos EUA (ARPANET).", "É fundamental para a comunicação moderna.", "Você está usando ela para ler isso."],
        resposta: "Internet"
    },
    {
        tema: "Coisa",
        dicas: ["É um componente eletrônico fundamental.", "Substituiu as válvulas termiônicas em muitos circuitos.", "Sua invenção em 1947 revolucionou a eletrônica.", "Permitiu a miniaturização e o aumento da eficiência dos dispositivos.", "É a base de todos os microchips modernos."],
        resposta: "Transistor"
    },
    {
        tema: "Coisa",
        dicas: ["É um dispositivo de entrada essencial para computadores.", "Foi desenvolvido por Douglas Engelbart nos anos 60.", "Permite a interação intuitiva com interfaces gráficas.", "Sua popularização veio com o Macintosh da Apple.", "Seu nome se assemelha a um roedor."],
        resposta: "Mouse"
    },
    {
        tema: "Coisa",
        dicas: ["É o 'cérebro' de um computador.", "O Intel 4004 foi um dos primeiros.", "Contém milhões de transistores em um único chip.", "É responsável por executar instruções e realizar cálculos.", "Sua evolução segue a Lei de Moore."],
        resposta: "Microprocessador"
    },
    {
        tema: "Coisa",
        dicas: ["É um conjunto de instruções que os computadores podem entender.", "Existem centenas delas, como Python, Java e C++.", "Permite que os humanos deem comandos aos computadores.", "Converte ideias abstratas em código executável.", "Existem de baixo e de alto nível."],
        resposta: "Linguagem de Programação"
    },
    {
        tema: "Ano",
        dicas: ["Foi o ano de lançamento do Windows 95.", "O JavaScript foi criado neste ano.", "O eBay e a Amazon foram fundados neste ano.", "Marca um boom inicial da internet comercial.", "Lançamento da primeira versão do Java."],
        resposta: "1995"
    },
    {
        tema: "Ano",
        dicas: ["Foi um marco na eletrônica.", "Um componente eletrônico essencial foi inventado neste ano.", "Três cientistas da Bell Labs foram os responsáveis.", "Abriu caminho para a miniaturização de dispositivos.", "O nome do componente começa com a letra 'T'."],
        resposta: "1947"
    },
    {
        tema: "Ano",
        dicas: ["O cérebro de muitos computadores modernos teve sua primeira versão.", "Uma empresa americana de semicondutores foi a criadora.", "Foi um grande passo para a popularização dos computadores pessoais.", "O nome deste componente tem '4004' no final.", "Antes dele, a computação era baseada em válvulas e transistores discretos."],
        resposta: "1971"
    },
    {
        tema: "Ano",
        dicas: ["Uma gigante da tecnologia lançou seu primeiro computador pessoal de sucesso.", "Ele rodava um sistema operacional chamado DOS.", "O lançamento ajudou a padronizar a arquitetura de PCs.", "O nome do computador era composto por três letras maiúsculas.", "Seu lançamento popularizou a ideia de ter um computador em casa."],
        resposta: "1981"
    },
    {
        tema: "Ano",
        dicas: ["Um jovem estudante finlandês criou a base de um sistema operacional.", "Ele começou como um projeto pessoal para o seu computador.", "É um exemplo famoso de software de código aberto.", "O nome é uma combinação do sobrenome do criador e 'Unix'.", "É amplamente usado em servidores e dispositivos móveis hoje."],
        resposta: "1991"
    },
    {
        tema: "Ano",
        dicas: ["Uma empresa de tecnologia lançou um smartphone revolucionário.", "Ele tinha uma tela multitoque e dispensava teclados físicos.", "Mudou a forma como interagimos com a tecnologia móvel.", "O evento de lançamento foi apresentado por Steve Jobs.", "Abriu caminho para a era dos aplicativos móveis."],
        resposta: "2007"
    },
    {
        tema: "Lugar",
        dicas: ["Região no sul da Baía de São Francisco, Califórnia.", "Abriga muitas das maiores empresas de tecnologia do mundo.", "É um centro de inovação e startups.", "Recebeu seu nome devido à grande quantidade de empresas de semicondutores.", "Empresas como Apple, Google e Facebook nasceram aqui."],
        resposta: "Vale do Silício"
    },
    {
        tema: "Lugar",
        dicas: ["Uma propriedade rural no Reino Unido.", "Foi um centro secreto de quebra de códigos durante a Segunda Guerra Mundial.", "Alan Turing e sua equipe trabalharam intensamente aqui.", "Máquinas como a Bombe e o Colossus foram desenvolvidas e usadas neste local.", "As informações decifradas aqui foram cruciais para o esforço de guerra aliado."],
        resposta: "Bletchley Park"
    },
    {
        tema: "Lugar",
        dicas: ["Uma cidade no Vale do Silício, Califórnia.", "É o lar da Universidade de Stanford.", "Empresas como Hewlett-Packard (HP) e Tesla foram fundadas aqui.", "É um centro de pesquisa e desenvolvimento de alta tecnologia.", "Considerado por muitos como o berço da inovação tecnológica."],
        resposta: "Palo Alto"
    },
    {
        tema: "Lugar",
        dicas: ["Uma cidade em Massachusetts, perto de Boston.", "Abriga duas das universidades mais prestigiadas do mundo: MIT e Harvard.", "Teve um papel fundamental no desenvolvimento da ARPANET.", "É um importante polo de pesquisa em inteligência artificial e biotecnologia.", "Muitos laureados com o Prêmio Nobel em ciências da computação vêm de suas instituições."],
        resposta: "Cambridge"
    },
    {
        tema: "Lugar",
        dicas: ["Uma grande cidade no sul da Índia.", "Conhecida como o 'Vale do Silício da Índia'.", "É um centro global de tecnologia da informação e serviços de software.", "Possui um grande número de empresas de TI multinacionais e startups.", "Atrai talentos em engenharia de software de todo o país."],
        resposta: "Bangalore"
    },
    {
        tema: "Coisa",
        dicas: ["Campo da ciência da computação que se dedica a criar máquinas que simulam o raciocínio humano.", "Inclui áreas como aprendizado de máquina e redes neurais.", "Alimentado por grandes volumes de dados (Big Data).", "Está presente em assistentes virtuais e recomendações de streaming."],
        resposta: "Inteligência Artificial"
    }
];

let customCards = []; // Array para cartas personalizadas (persistente via localStorage)
let allAvailableCards = []; // Array que combinará cartas padrão e personalizadas (para o modo solo)

let history = [];

// =========================================================
// Inicialização e Event Listeners
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    loadCustomCards(); // Carrega as cartas personalizadas ao iniciar
    updateAllAvailableCards(); // Combina as cartas padrão e personalizadas

    // Removida: Lógica de verificar código de sala na URL
    showScreen('menu-screen'); // Sempre começa pelo menu

    // Event listener para o campo de nome do jogador solo
    const playerNameInput = document.getElementById('player-name');
    if (playerNameInput) {
        playerNameInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter' || event.keyCode === 13) {
                startGame();
            }
        });
    }

    // Removido: Event listener para o campo de nome do jogador em sala (join)

    // Event listener para o campo de resposta na tela do jogo
    const answerInput = document.getElementById('answer-input');
    if (answerInput) {
        answerInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter' || event.keyCode === 13) {
                checkAnswer();
            }
        });
    }
    // Removido: Inicialização do contador de cartas do host
});

// Funções de controle de tela
function showScreen(screenId) {
    const activeScreen = document.getElementById(currentScreen);
    if (activeScreen) {
        activeScreen.classList.remove('active');
    }

    const newActiveScreen = document.getElementById(screenId);
    if (newActiveScreen) {
        newActiveScreen.classList.add('active');
        currentScreen = screenId;

        // Renderiza a lista de cartas personalizadas ao entrar na tela
        if (screenId === 'custom-cards-screen') {
            renderCustomCardsList();
        }
    } else {
        console.error("Erro: Tela com ID '" + screenId + "' não encontrada.");
    }
}

// =========================================================
// Lógica do Modo Solo
// =========================================================

function startGame() { // Esta é a função para 'Jogar Solo'
    playerName = document.getElementById('player-name').value.trim();
    if (playerName === '') {
        showPopup("Por favor, digite seu nome.");
        return;
    }
    score = 0;
    currentCardIndex = 0;
    history = [];

    // Para o modo solo, embaralhamos e selecionamos das cartas padrão + personalizadas salvas
    shuffleAndSelectSoloCards();

    if (shuffledCardsForCurrentGame.length === 0) {
        return; // showPopup já foi chamado dentro de shuffleAndSelectSoloCards
    }
    showNextCard();
    showScreen('game-screen');
    updateHeader();
}

function shuffleAndSelectSoloCards() {
    updateAllAvailableCards(); // Atualiza allAvailableCards combinando default e custom

    if (allAvailableCards.length === 0) {
        showPopup("Não há cartas disponíveis para jogar solo! Adicione algumas cartas ou recarregue para usar as padrão.", "error.png", [
            { text: "OK", className: "popup-ok", callback: () => showScreen('menu-screen') }
        ]);
        shuffledCardsForCurrentGame = [];
        return;
    }

    const shuffledAllCards = [...allAvailableCards];
    for (let i = shuffledAllCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledAllCards[i], shuffledAllCards[j]] = [shuffledAllCards[j], shuffledAllCards[i]];
    }

    shuffledCardsForCurrentGame = shuffledAllCards.slice(0, Math.min(maxCardsPerGame, shuffledAllCards.length));
}

// =========================================================
// Removidas: Lógica do Modo Multiplayer (Funções relacionadas a sala, host, convidados, QR Code)
// =========================================================
// showPlayWithFriendsOptions() - REMOVIDA
// addHostCard() - REMOVIDA
// updateHostCardCount() - REMOVIDA
// updateHostCardListSummary() - REMOVIDA
// generateRoomCode() - REMOVIDA
// startHostedGame() - REMOVIDA
// attemptJoinGame() - REMOVIDA


// =========================================================
// Funções Gerais do Jogo (mantidas)
// =========================================================

function updateHeader() {
    document.getElementById('player-display').textContent = "Jogador: " + playerName;
    document.getElementById('score-display').textContent = "Pontos: " + score;
}

function showNextCard() {
    if (!shuffledCardsForCurrentGame || shuffledCardsForCurrentGame.length === 0 || currentCardIndex >= shuffledCardsForCurrentGame.length) {
        finishGame();
        return;
    }

    revealedTipsCount = 0;
    revealedTipsForCurrentCard = [];

    const card = shuffledCardsForCurrentGame[currentCardIndex];
    document.getElementById('theme-label').textContent = "Categoria: " + card.tema;

    const dicasArea = document.getElementById('dicas-area');
    dicasArea.innerHTML = 'Clique nos números para revelar as dicas!';

    const dicaButtons = document.getElementById('dica-buttons');
    dicaButtons.innerHTML = '';
    for (let i = 0; i < card.dicas.length; i++) {
        const btn = document.createElement('button');
        btn.textContent = (i + 1);
        btn.dataset.tipIndex = i;
        btn.onclick = () => revealTip(i, btn);
        dicaButtons.appendChild(btn);
    }
    document.getElementById('answer-input').value = '';
}

function revealTip(index, buttonElement) {
    const card = shuffledCardsForCurrentGame[currentCardIndex];
    const dicasArea = document.getElementById('dicas-area');

    if (revealedTipsCount === 0) {
        dicasArea.innerHTML = '';
    }

    if (!revealedTipsForCurrentCard.includes(index)) {
        dicasArea.innerHTML += `<p>${card.dicas[index]}</p>`;
        revealedTipsCount++;
        revealedTipsForCurrentCard.push(index);
        buttonElement.disabled = true;
    }
}

function checkAnswer() {
    const answerInput = document.getElementById('answer-input');
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = shuffledCardsForCurrentGame[currentCardIndex].resposta.toLowerCase();

    if (userAnswer === '') {
        showPopup("Por favor, digite sua resposta.");
        return;
    }

    if (userAnswer === correctAnswer) {
        const points = 6 - revealedTipsCount;
        score += Math.max(points, 1);
        history.push({ carta: shuffledCardsForCurrentGame[currentCardIndex], resposta: userAnswer, pontos: Math.max(points, 1), acertou: true });
        showPopup("Resposta correta! +" + Math.max(points, 1) + " pontos", "success.png", [
            { text: "OK", className: "popup-ok", callback: () => {
                currentCardIndex++;
                updateHeader();
                showNextCard();
            }}
        ]);
    } else {
        history.push({ carta: shuffledCardsForCurrentGame[currentCardIndex], resposta: userAnswer, pontos: 0, acertou: false });
        showPopup("Resposta incorreta!", "error.png", [
            { text: "OK", className: "popup-ok", callback: () => {} }
        ]);
    }
    answerInput.value = '';
}

function skipCard() {
    history.push({ carta: shuffledCardsForCurrentGame[currentCardIndex], resposta: "Pulou", pontos: 0, acertou: false });
    showPopup("Carta pulada.", "info.png", [
        { text: "OK", className: "popup-ok", callback: () => {
            currentCardIndex++;
            updateHeader();
            showNextCard();
        }}
    ]);
}

function showCorrectAnswer() {
    const correctAnswer = shuffledCardsForCurrentGame[currentCardIndex].resposta;
    history.push({ carta: shuffledCardsForCurrentGame[currentCardIndex], resposta: "Desistiu", pontos: 0, acertou: false });
    showPopup("A resposta era: " + correctAnswer, "info.png", [
        { text: "OK", className: "popup-ok", callback: () => {
            currentCardIndex++;
            updateHeader();
            showNextCard();
        }}
    ]);
}

function confirmExit() {
    showPopup("Tem certeza que quer sair do jogo?", "question.png", [
        { text: "Sim", className: "popup-ok", callback: () => showScreen('menu-screen') },
        { text: "Não", className: "popup-cancel", callback: () => {} }
    ]);
}

function finishGame() {
    document.getElementById('final-score').textContent = `Sua pontuação final: ${score} pontos`;
    const recapList = document.getElementById('recap-list');
    recapList.innerHTML = '';

    history.forEach((item, index) => {
        const status = item.acertou ? 'Correta' : item.resposta === 'Pulou' ? 'Pulada' : item.resposta === 'Desistiu' ? 'Desistiu' : 'Incorreta';

        const respostaDoJogador = item.resposta;

        let dicasHtml = '<ul>';
        item.carta.dicas.forEach((dica, dicaIndex) => {
            dicasHtml += `<li>Dica ${dicaIndex + 1}: ${dica}</li>`;
        });
        dicasHtml += '</ul>';

        recapList.innerHTML += `
            <p>
                <strong>Carta ${index + 1}:</strong> ${item.carta.tema} - ${item.carta.resposta}<br>
                ${dicasHtml}
                Sua última resposta: ${respostaDoJogador} (${status}) | Pontos: ${item.pontos}
            </p>
            <hr> `;
    });
    showScreen('recap-screen');
}

function showPopup(message, icon = null, buttons = [{ text: "OK", className: "popup-ok", callback: () => {} }]) {
    const popup = document.getElementById('popup');
    document.getElementById('popup-message').textContent = message;
    const iconElement = document.getElementById('popup-icon');

    if (icon) {
        iconElement.src = icon;
        iconElement.style.display = 'block';
    } else {
        iconElement.style.display = 'none';
    }

    const popupButtonsContainer = document.getElementById('popup-buttons');
    popupButtonsContainer.innerHTML = '';
    buttons.forEach(btnConfig => {
        const btn = document.createElement('button');
        btn.textContent = btnConfig.text;
        btn.className = btnConfig.className;
        btn.onclick = () => {
            popup.classList.add('hidden');
            if (btnConfig.callback) btnConfig.callback();
        };
        popupButtonsContainer.appendChild(btn);
    });

    popup.classList.remove('hidden');
}

// =========================================================
// Funções de Cartas Personalizadas (via LocalStorage)
// =========================================================

function loadCustomCards() {
    const storedCards = localStorage.getItem('customCodexCards');
    if (storedCards) {
        customCards = JSON.parse(storedCards);
    }
}

function saveCustomCards() {
    localStorage.setItem('customCodexCards', JSON.stringify(customCards));
}

function updateAllAvailableCards() {
    // As cartas personalizadas agora virão antes das cartas padrão
    allAvailableCards = [...customCards, ...defaultCards];
}

function addNewCard() { // Para adicionar cartas ao pool padrão (localStorage)
    const theme = document.getElementById('new-card-theme').value;
    const answer = document.getElementById('new-card-answer').value.trim();
    const tips = [];

    for (let i = 1; i <= 5; i++) {
        const tipInput = document.getElementById(`new-card-tip${i}`).value.trim();
        if (tipInput !== '') {
            tips.push(tipInput);
        }
    }

    if (answer === '' || tips.length < 2) {
        showPopup("Por favor, preencha o tema, a resposta e pelo menos 2 dicas para a nova carta.");
        return;
    }

    const newCard = {
        tema: theme,
        dicas: tips,
        resposta: answer
    };

    customCards.push(newCard);
    saveCustomCards();
    updateAllAvailableCards(); // Atualiza a lista de cartas disponíveis para o modo solo

    showPopup("Carta adicionada com sucesso ao seu acervo!", "success.png", [
        { text: "OK", className: "popup-ok", callback: () => {
            // Limpa os campos após adicionar a carta
            document.getElementById('new-card-theme').value = 'Pessoa';
            document.getElementById('new-card-answer').value = '';
            for (let i = 1; i <= 5; i++) {
                document.getElementById(`new-card-tip${i}`).value = '';
            }
            renderCustomCardsList(); // Atualiza a lista de cartas exibidas
        }}
    ]);
}

// Função para renderizar a lista de cartas personalizadas
function renderCustomCardsList() {
    const customCardsListDiv = document.getElementById('custom-cards-list');
    customCardsListDiv.innerHTML = ''; // Limpa a lista existente

    if (customCards.length === 0) {
        customCardsListDiv.innerHTML = '<p>Nenhuma carta personalizada ainda. Crie uma abaixo!</p>';
        return;
    }

    customCards.forEach((card, index) => {
        const cardItem = document.createElement('div');
        cardItem.classList.add('custom-card-item');

        const cardInfo = document.createElement('span');
        cardInfo.classList.add('card-info');
        cardInfo.innerHTML = `<strong>${card.tema}:</strong> ${card.resposta}`;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = 'Excluir';
        deleteButton.onclick = () => confirmDeleteCard(index); // Chama a confirmação de exclusão

        cardItem.appendChild(cardInfo);
        cardItem.appendChild(deleteButton);
        customCardsListDiv.appendChild(cardItem);
    });
}

// Função para confirmar e excluir uma carta
function confirmDeleteCard(index) {
    const cardToDelete = customCards[index];
    showPopup(`Tem certeza que deseja excluir a carta "${cardToDelete.resposta}"?`, "question.png", [
        { text: "Sim", className: "popup-ok", callback: () => deleteCustomCard(index) },
        { text: "Não", className: "popup-cancel", callback: () => {} }
    ]);
}

// Função para excluir uma carta
function deleteCustomCard(index) {
    customCards.splice(index, 1); // Remove a carta do array
    saveCustomCards(); // Salva o array atualizado no localStorage
    updateAllAvailableCards(); // Atualiza a lista de cartas disponíveis para o jogo
    renderCustomCardsList(); // Re-renderiza a lista na tela

    showPopup("Carta excluída com sucesso!", "success.png");
}