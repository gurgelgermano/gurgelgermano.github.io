//Ator - vaquinha
let xAtor = 90;
let yAtor = 366;
let colisao = false;
let pontos = 0;

function mostraAtor(){
    image(imagemAtor, xAtor, yAtor, 30, 30);
  }

function movimentaAtor(){
    if(keyIsDown(UP_ARROW)){
        yAtor -= 3;
    }
    if(keyIsDown(DOWN_ARROW)){
        yAtor += 3;
        if(yAtor > 366){
            yAtor = 366;
        }      
    }
}

function colisaoAtor(){
    //collideRectCircle(x1, y1, width1, height1, cx, cy, diameter)
    for(let i = 0; i < imagemCarros.length; i++){
        colisao = collideRectCircle(xCarros[i], yCarros[i], largCarro, altCarro, xAtor, yAtor, 15);
        if(colisao){
            perdePontos();
            somPerdePonto.play();
        }
    }
}

function perdePontos(){
    if(colisao){
        yAtor = 366;
        if(pontos > 0){
            pontos -= 1;
        }
    }
}

function incluiPontos(){
    textFont("Arial Black")
    fill(color(255,240,200))
    textAlign(CENTER);
    textSize(25);
    text(pontos, width / 5, 27);
    marcaPonto();
}

function marcaPonto(){
    if(yAtor < 10){
        pontos++;
        yAtor = 366;
        somPonto.play();
    }
}