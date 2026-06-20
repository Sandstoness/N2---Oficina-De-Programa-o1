// lista de frutas - sao 8, cada uma aparece 2 vezes
var emojis = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉', '🍑', '🍒'];

// contadores e cartas que o jogador clicou
var totalTentativas = 0;
var acertos = 0;
var carta1 = null;
var carta2 = null;
var travado = false; // true quando ta esperando virar de volta

// pegando as coisas do html pra usar no js
var tabuleiro = document.getElementById('tabuleiro');
var textoTentativas = document.getElementById('tentativas');
var msgVitoria = document.getElementById('msg-vitoria');

// roda quando a pagina carrega
window.onload = function () {
    iniciarJogo();
};

// funcao principal - monta o jogo do zero
function iniciarJogo() {

    // limpa tudo antes de comecar de novo
    totalTentativas = 0;
    acertos = 0;
    carta1 = null;
    carta2 = null;
    travado = false;
    textoTentativas.innerHTML = '0';
    msgVitoria.innerHTML = '';
    tabuleiro.innerHTML = '';

    // primeiro coloco todas as frutas duplicadas num array
    var baralho = [];
    for (var i = 0; i < emojis.length; i++) {
        baralho.push(emojis[i]);
        baralho.push(emojis[i]); // a mesma fruta de novo pra formar par
    }

    // embaralha - vi esse jeito na internet, funciona
    baralho.sort(function () {
        return 0.5 - Math.random();
    });

    // agora crio uma div pra cada carta
    for (var j = 0; j < baralho.length; j++) {
        var div = document.createElement('div');
        div.className = 'carta';
        div.innerHTML = '?'; // comeca virada pra baixo
        div.setAttribute('data-emoji', baralho[j]); // guardo a fruta aqui escondida
        div.onclick = function () {
            clicouNaCarta(this);
        };
        tabuleiro.appendChild(div);
    }
}

// essa funcao roda toda vez que clica numa carta
function clicouNaCarta(carta) {

    // se tiver travado nao faz nada (esperando virar)
    if (travado == true) {
        return;
    }

    // se ja virou essa carta nao deixa clicar de novo
    if (carta.className.indexOf('virada') != -1) {
        return;
    }

    // se ja acertou esse par tambem nao deixa
    if (carta.className.indexOf('acertou') != -1) {
        return;
    }

    // mostra a fruta da carta
    carta.className = 'carta virada';
    carta.innerHTML = carta.getAttribute('data-emoji');

    // se ainda nao tinha clicado em nenhuma, guarda essa
    if (carta1 == null) {
        carta1 = carta;
    } else {
        // senao eh a segunda carta, ai compara
        carta2 = carta;
        travado = true;

        totalTentativas = totalTentativas + 1;
        textoTentativas.innerHTML = totalTentativas;

        verificar();
    }
}

// ve se as duas cartas sao iguais
function verificar() {

    var emoji1 = carta1.getAttribute('data-emoji');
    var emoji2 = carta2.getAttribute('data-emoji');

    if (emoji1 == emoji2) {
        // deu match!
        carta1.className = 'carta virada acertou';
        carta2.className = 'carta virada acertou';
        acertos = acertos + 1;

        carta1 = null;
        carta2 = null;
        travado = false;

        // se acertou todos os pares, ganhou
        if (acertos == emojis.length) {
            msgVitoria.innerHTML = 'Parabéns! Você ganhou em ' + totalTentativas + ' tentativas!';
        }

    } else {
        // errou, espera um pouco e desvira
        setTimeout(virarDeVolta, 1000);
    }
}

// volta as cartas erradas pro "?"
function virarDeVolta() {
    carta1.className = 'carta';
    carta2.className = 'carta';
    carta1.innerHTML = '?';
    carta2.innerHTML = '?';

    carta1 = null;
    carta2 = null;
    travado = false;
}

// botao reiniciar chama essa
function reiniciar() {
    iniciarJogo();
}
