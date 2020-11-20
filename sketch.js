//variaveis da bolinha
let xBolinha = 300;
let yBolinha = 200;
let rBolinha = 20;
let raio = rBolinha/2;

//velocidade da bolinha
let velocidadeXBolinha = 5;
let velocidadeYBolinha = 5;

//variaveis da raquete player1
let xRaquete1 = 10;
let yRaquete1 = 150;
let compRaquete = 10;
let altRaquete = 100;

//variaveis da raquete CPU
let xRaqueteCPU = 590;
let yRaqueteCPU = 150;
let velocidadeYCPU = 0;

let colide = false;

//placar do jogo
let meusPontos = 0;
let cpuPontos = 0;

//sons do jogo
let raqueteSom;
let ponto;
let trilha;
let pontoCPU;

//chances de erro CPU
let chanceDeErrar = 30;

function calculaChanceDeErrar() {
  if(cpuPontos >= meusPontos) {
    chanceDeErrar += 5;
    if (chanceDeErrar >= 10){
    chanceDeErrar = 50;
    }
  } else {
    chanceDeErrar -= 5;
    if (chanceDeErrar <= 10){
    chanceDeErrar = 10;
    }
  }
}

function preload(){
  trilha = loadSound("BossaNova.mp3");
  ponto = loadSound("ponto.mp3");
  raqueteSom = loadSound("raquetada.mp3");
  pontoCPU = loadSound("pontoCPU.mp3");
}


function setup() {
  createCanvas(600, 400);
  trilha.loop();
}

function draw() {
  background(0);
  mostraBolinha();
  movimentoBolinha();
  colisaoBolinha();
  mostraRaquete(xRaquete1, yRaquete1);
  mostraRaquete(xRaqueteCPU, yRaqueteCPU);
  movimentoRaquete1();
  colisaoBiblioteca(xRaquete1,yRaquete1,compRaquete,altRaquete);
  movimentoRaqueteCPU();
  colisaoBiblioteca(xRaqueteCPU,yRaqueteCPU,compRaquete,altRaquete);
  incluiPlacar();
  marcaPonto();
}

function mostraBolinha(){
  circle(xBolinha, yBolinha, rBolinha);
}

function movimentoBolinha(){
  xBolinha += velocidadeXBolinha;
  yBolinha += velocidadeYBolinha;
}

function colisaoBolinha(){
  if(xBolinha + raio > width || xBolinha < raio){
    velocidadeXBolinha *= -1;
  }else if(yBolinha + raio > height || yBolinha < raio){
    velocidadeYBolinha *= -1;
  }
}

function mostraRaquete(x, y){
  rect(x, y, compRaquete, altRaquete);
}


function movimentoRaquete1(){
  if (keyIsDown(UP_ARROW)){
     yRaquete1 -= 5;
  }
  if (keyIsDown(DOWN_ARROW)){
    yRaquete1 += 5;
  }
}

function colisaoBiblioteca(x,y){
  colide = collideRectCircle(x, y, compRaquete, altRaquete, xBolinha, yBolinha, raio);
  if(colide){
    velocidadeXBolinha *= -1;
    raqueteSom.play();
  }
}

function movimentoRaqueteCPU(){
  velocidadeYCPU = yBolinha - yRaqueteCPU - compRaquete / 2 - 30;
  yRaqueteCPU += velocidadeYCPU + chanceDeErrar;
  calculaChanceDeErrar();
}

function incluiPlacar(){
  //stroke(000);
  textAlign(CENTER);
  textSize(16);
  textFont('Arial Black');
  fill(color(173,255,47));
  rect(150,10,40,20);
  fill(000);
  text(meusPontos, 170, 25);
  fill(color(173,255,47));
  rect(450,10,40,20);
  fill(000);
  text(cpuPontos, 470, 25);
  fill(255);
}

function marcaPonto(){
  if(xBolinha > 590){
    meusPontos += 1;
    ponto.play();
  }
  if(xBolinha < 10){
    cpuPontos += 1;
    pontoCPU.play();
  }
}


