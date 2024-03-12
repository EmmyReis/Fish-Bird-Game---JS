// Board - vamos determinar algumas variaveis

// Declaração de variáveis para o objeto "Board" e as dimensões do tabuleiro
var board;
var boardWidth = 360;
var boardHeight = 640;

// Declaração de uma variável para o contexto de desenho 2D
var context;

//Fish - vamos determinar algumas variaveis

// Define a largura do peixe em pixels
var fishwidth = 54;

// Define a altura do peixe em pixels
var fishheight = 44;

// Define a posição horizontal inicial do peixe
// Dividindo a largura do tabuleiro por 8, para posicionar o peixe a um oitavo do caminho na horizontal
var fishX = boardWidth/8;

// Define a posição vertical inicial do peixe
// Dividindo a altura do tabuleiro por 2, para posicionar o peixe no centro verticalmente
var fishY = boardHeight/2;

// Cria um objeto 'fish' para representar as informações do peixe
var fish = {
    // Define a posição horizontal do peixe com base na variável 'fishX'
    x: fishX,
    // Define a posição vertical do peixe com base na variável 'fishY'
    y: fishY,
    // Define a largura do peixe com base na variável 'fishwidth'
    width: fishwidth,
    // Define a altura do peixe com base na variável 'fishheight'
    height: fishheight
};

//pipes
//definiu as variaveis e posição dos pipes com base na proporção
var pipeArray = [];
var pipeWidth = 64; //widht/height ratio = 384/3072 = 1/8
var pipeHeight = 512;
var pipeX = boardWidth;
var pipeY = 0;

//Fisica do jogo
var velocityX = -2; //velocidade dos tubos movendo para a esquerda
//// Define a velocidade horizontal do objeto, onde -2 representa o movimento para a esquerda.

var velocityY = 0; //velocidade do pulo do passaro

var gravity = 0.2  //definindo a gravidade do pulo

var gameOver = false; // definindo variavel de game over

var score = 0; //adicionando variavel de score


//vamos definir as variaveis para o load images de pipe
var topPipeImg;
var bottomPipeImg;


// O evento "window.onload" é usado para executar o código quando a página HTML é completamente carregada
    window.onload = function(){
    // Obtém a referência para o elemento HTML com o id "board" (presume-se que seja um <canvas>)
    board = document.getElementById("board");
    
    // Define a altura e a largura do elemento "board" com base nas variáveis definidas acima
    board.height = boardHeight;
    board.width = boardWidth;

    // Obtém o contexto de desenho 2D do elemento "board" para que possamos desenhar nele
    context = board.getContext("2d"); // "2d" especifica que queremos um contexto de desenho 2D

    //draw fish bird (usado apenas para demarcar espaço antes de aplciar o codigo de load images)
    //context.fillStyle = "green";
    //context.fillRect(fish.x, fish.y, fish.width, fish.height);


    
// Código para carregar e desenhar uma imagem de peixe em um contexto de desenho 2D

// Criando um novo objeto Image para representar a imagem do peixe
    fishImg = new Image();

// Definindo o caminho da imagem que o objeto fishImg deve carregar
    fishImg.src = "./PeixeBird.png";

// Definindo um manipulador de eventos para ser chamado quando a imagem for completamente carregada
    fishImg.onload = function () {
    // Dentro da função de carregamento da imagem, desenha-se a imagem do peixe no contexto de desenho
    // Os parâmetros passados para drawImage especificam a imagem, suas coordenadas x e y, e suas dimensões
    context.drawImage(fishImg, fish.x, fish.y, fish.width, fish.height);
}

//load images para os pipes
    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //a cada 1,5 segundos
    document.addEventListener("keydown", moveFish); //Este código adiciona um ouvinte de evento para capturar eventos de tecla pressionada.
}

// Define a função de atualização que será chamada repetidamente para atualizar a animação
function update() {
    // Solicita ao navegador para chamar novamente a função update antes do próximo quadro de animação
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }

// Este comando limpa o conteúdo do canvas antes de desenhar novos elementos.
// O método clearRect() é usado para desenhar um retângulo transparente que cobre toda a área do canvas.
// Ele recebe quatro argumentos: (x, y, largura, altura), que representam as coordenadas e as dimensões do retângulo.
// No caso deste código, o retângulo começa na posição (0, 0) no canto superior esquerdo do canvas e tem a mesma largura e altura que o próprio canvas, limpando assim toda a área do canvas.
// Isso é importante para garantir que não haja sobreposição ou acumulação de elementos desenhados em quadros de animação anteriores, garantindo que a animação seja renderizada corretamente.

    context.clearRect(0, 0, boardWidth, boardHeight);
 
    //Fish

    // Determinado a velocidade e gravidade do peixe
    fish.y += velocityY;
    velocityY += gravity;

    // Esta linha calcula a nova posição vertical do peixe após aplicar a velocidade vertical (velocityY).
    // A função Math.max() é usada para garantir que a nova posição não seja menor que 0.
    // Isso impede que o peixe saia da tela para cima.
    fish.y = Math.max(fish.y + velocityY, 0);

    // Desenha a imagem do peixe no contexto de desenho 2D
    // usando as coordenadas e dimensões especificadas
    context.drawImage(fishImg, fish.x, fish.y, fish.width, fish.height);

    if (fish.y > board.height) {
        gameOver = true ;
    } //determinando o game over 

    //Pipes

    //estrutura de codigo para loops
    // Loop que itera sobre cada elemento do array pipeArray
    for (var i = 0; i < pipeArray.length; i++) {
    // Obtém o elemento atual do array e o armazena na variável pipe
    var pipe = pipeArray[i]; // Atribui o cano atual do array 'pipeArray' à variável 'pipe' para acessar suas propriedades durante a iteração do loop.
    pipe.x += velocityX; //// Atualiza a posição horizontal do cano atual, movendo-o para a esquerda com base na velocidade horizontal (velocityX).

    
    // Desenha a imagem do cano na tela
    // Utiliza o método drawImage do contexto do canvas
    // Passa os parâmetros: imagem a ser desenhada, coordenadas x e y, largura e altura do cano
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

// Verifica se o tubo (pipe) não foi passado pelo peixe (fish) e se a posição x do peixe é maior que a posição x do tubo mais a largura do tubo
// Isso significa que o peixe passou pelo tubo e ainda não o passou
if (!pipe.passed && fish.x > pipe.x + pipe.width) {
    // Se as condições acima forem atendidas:
    
    // Adiciona 0.5 à pontuação (score)
    score += 0.5;
    
    // Marca o tubo como passado para evitar que a pontuação seja contada repetidamente para o mesmo tubo
    pipe.passed = true;
}


   // Verifica se houve uma colisão entre o peixe (fish) e o tubo (pipe)
    if (detectColission(fish, pipe)) {
    // Se houver uma colisão, define a variável 'gameOver' como true
    // para indicar que o jogo acabou
    gameOver = true;
}

    }

    // clear pipes
    // Limpa os tubos que já passaram do peixe e saíram da tela
    // O loop while verifica duas condições:
    // 1. Se ainda há tubos no array (pipeArray.length > 0)
    // 2. Se o primeiro tubo no array (pipeArray[0]) saiu completamente da tela (pipeArray[0].x < 0)
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    // Se ambas as condições forem verdadeiras:
    
    // Remove o primeiro tubo do array usando o método shift()
    // Isso remove o primeiro elemento do array e desloca todos os outros elementos para trás, mantendo a ordem dos índices
    pipeArray.shift();
}


    //score

    // Define a cor do texto como branco
    context.fillStyle = "White";

    // Define a fonte e o tamanho do texto
    context.font = "45px helvetica sans-serif";

    // Desenha o texto na tela
    // O método fillText() desenha o texto especificado na tela, preenchendo-o com a cor definida anteriormente.
    // Os parâmetros passados para fillText são: (texto, posiçãoX, posiçãoY)
    // Nesse caso, o texto é a variável score (pontuação do jogo), e a posição (5, 45) é onde o texto será desenhado na tela.
    context.fillText(score, 5, 45);

    if(gameOver) {
        context.fillText("GAME OVER", 5, 90);
        context.font = "45px helvetica sans-serif";
    }

    
}


function placePipes() {
    if(gameOver) {
        return;
    }

// Calcula uma posição vertical aleatória para os canos, com base na posição original do cano superior e sua altura,
// adicionando um valor aleatório entre 0 e metade da altura do cano. Isso cria uma variação na posição dos canos.
    var randomPipeY = pipeY - pipeHeight/4 - Math.random() * (pipeHeight/2);

    var openingSpace = board.height/4;


    // Declaração de um objeto 'topPipe'
    var topPipe = {
        // Propriedade 'img' que armazena a imagem do cano superior
        img: topPipeImg,
        // Propriedade 'x' que armazena a posição horizontal do cano superior
        x: pipeX,
        // Propriedade 'y' que armazena a posição vertical do cano superior
        y: randomPipeY,
        // Propriedade 'width' que armazena a largura do cano superior
        width: pipeWidth,
        // Propriedade 'height' que armazena a altura do cano superior
        height: pipeHeight,
        // Propriedade 'passed' que armazena um valor booleano indicando se o jogador já passou pelo cano superior
        passed: false
    }

    // Adiciona o objeto 'topPipe' ao array 'pipeArray'
    //.push(topPipe): Este método adiciona o objeto topPipe ao final do array 
    pipeArray.push(topPipe);

    var bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y:randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);

}

// Função chamada quando uma tecla é pressionada.
function moveFish(e) {
    // O parâmetro 'e' contém informações sobre o evento de tecla pressionada.
    
    //jump
    // Verifica se a tecla pressionada é a barra de espaço, seta para cima ou a tecla X.
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        // Se a tecla pressionada for uma das teclas desejadas:
        
        // Ação de pulo do pássaro: 
        // Define a velocidade vertical (velocityY) como negativa para fazer o pássaro subir.
        velocityY = -3; // O valor negativo faz o pássaro subir mais rapidamente.
    }
    // Você pode adicionar mais condições aqui conforme necessário para outras teclas.

    //reset game
    if (gameOver) {
        fish.y = fish.y;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }

}


function detectColission (a,b) {
    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y ;

} // logica para colisao


