let currentScreen = 'menu-screen';
let playerName = '';
let score = 0;
let currentCardIndex = 0;
let revealedTipsCount = 0;
let revealedTipsForCurrentCard = [];

const cards = [
    {
        tema: "Pessoa",
        dicas: ["É considerada a primeira programadora da história.", "Trabalhou nas anotações sobre a Máquina Analítica de Charles Babbage.", "Filha do poeta Lord Byron.", "Suas anotações são cruciais para a história da computação.", "Um idioma de programação foi nomeado em sua homenagem."],
        resposta: "Ada Lovelace"
    },
    {
        tema: "Coisa",
        dicas: ["É uma rede global de computadores.", "Permite a troca de informações em todo o mundo.", "Surgiu a partir de um projeto militar nos EUA (ARPANET).", "É fundamental para a comunicação moderna.", "Você está usando ela para ler isso."],
        resposta: "Internet"
    },
    {
        tema: "Ano",
        dicas: ["Foi o ano de lançamento do Windows 95.", "O JavaScript foi criado neste ano.", "O eBay e a Amazon foram fundados neste ano.", "Marca um boom inicial da internet comercial.", "Lançamento da primeira versão do Java."],
        resposta: "1995"
    },
    {
        tema: "Lugar",
        dicas: ["Região no sul da Baía de São Francisco, Califórnia.", "Abriga muitas das maiores empresas de tecnologia do mundo.", "É um centro de inovação e startups.", "Recebeu seu nome devido à grande quantidade de empresas de semicondutores.", "Empresas como Apple, Google e Facebook nasceram aqui."],
        resposta: "Vale do Silício"
    },
    {
        tema: "Coisa",
        dicas: ["Campo da ciência da computação que se dedica a criar máquinas que simulam o raciocínio humano.", "Inclui áreas como aprendizado de máquina e redes neurais.", "Alimentado por grandes volumes de dados (Big Data).", "Está presente em assistentes virtuais e recomendações de streaming."],
        resposta: "Inteligência Artificial"
    },
    {
        tema: "Pessoa",
        dicas: ["Cofundador de uma das maiores empresas de software do mundo.", "Conhecido por sua filantropia e esforços em saúde global.", "Esteve à frente da 'revolução do computador pessoal'.", "Fundou a Microsoft.", "Um dos homens mais ricos do mundo."],
        resposta: "Bill Gates"
    }
];

let history = [];

// Exibe a tela inicial
document.addEventListener('DOMContentLoaded', () => {
    showScreen('menu-screen');

    const playerNameInput = document.getElementById('player-name');
    if (playerNameInput) {
        playerNameInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter' || event.keyCode === 13) {
                startGame();
            }
        });
    }

    // NOVO: Event listener para o campo de resposta na tela do jogo
    const answerInput = document.getElementById('answer-input');
    if (answerInput) {
        answerInput.addEventListener('keypress', function(event) {
            // Verifica se a tecla pressionada é "Enter" (código 13 ou "key" "Enter")
            if (event.key === 'Enter' || event.keyCode === 13) {
                checkAnswer(); // Chama a função que verifica a resposta
            }
        });
    }
});

function showScreen(screenId) {
    document.getElementById(currentScreen).classList.remove('active');
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;
}

function startGame() {
    playerName = document.getElementById('player-name').value.trim();
    if (playerName === '') {
        showPopup("Por favor, digite seu nome.");
        return;
    }
    score = 0;
    currentCardIndex = 0;
    history = [];
    shuffleCards();
    showNextCard();
    showScreen('game-screen');
    updateHeader();
}

function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
}

function updateHeader() {
    document.getElementById('player-display').textContent = "Jogador: " + playerName;
    document.getElementById('score-display').textContent = "Pontos: " + score;
}

function showNextCard() {
    if (currentCardIndex >= cards.length) {
        finishGame();
        return;
    }

    revealedTipsCount = 0;
    revealedTipsForCurrentCard = [];

    const card = cards[currentCardIndex];
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
    const card = cards[currentCardIndex];
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
    const correctAnswer = cards[currentCardIndex].resposta.toLowerCase();

    if (userAnswer === '') {
        showPopup("Por favor, digite sua resposta.");
        return;
    }

    if (userAnswer === correctAnswer) {
        const points = 6 - revealedTipsCount;
        score += Math.max(points, 1);
        history.push({ carta: cards[currentCardIndex], resposta: userAnswer, pontos: Math.max(points, 1), acertou: true });
        showPopup("Resposta correta! +" + Math.max(points, 1) + " pontos", "success.png", [
            { text: "OK", className: "popup-ok", callback: () => {
                currentCardIndex++;
                updateHeader();
                showNextCard();
            }}
        ]);
    } else {
        history.push({ carta: cards[currentCardIndex], resposta: userAnswer, pontos: 0, acertou: false });
        showPopup("Resposta incorreta!", "error.png", [
            { text: "OK", className: "popup-ok", callback: () => {} }
        ]);
    }
    answerInput.value = '';
}

function skipCard() {
    history.push({ carta: cards[currentCardIndex], resposta: "Pulou", pontos: 0, acertou: false });
    showPopup("Carta pulada.", "info.png", [
        { text: "OK", className: "popup-ok", callback: () => {
            currentCardIndex++;
            updateHeader();
            showNextCard();
        }}
    ]);
}

function showCorrectAnswer() {
    const correctAnswer = cards[currentCardIndex].resposta;
    history.push({ carta: cards[currentCardIndex], resposta: "Desistiu", pontos: 0, acertou: false });
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

        // Pega a resposta do item do histórico (que é a última tentativa para aquela carta)
        const respostaDoJogador = item.resposta;

        // Construir a lista de dicas
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