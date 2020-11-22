//config carros
let largCarro = 60;
let altCarro = 30;
let xCarros = [600, 600, 600, 600, 600, 600];
let yCarros = [45,100,155, 215, 275, 325];
let velCarros = [2.9,2.7,3.1, 2.3, 2.1, 2.5];

function mostraCarro(){
    for(let i = 0; i < imagemCarros.length; i++){
      image(imagemCarros[i], xCarros[i], yCarros[i], largCarro, altCarro);
    }

}
  
function movimentaCarro(){
  for(let i = 0; i < imagemCarros.length; i++){
    xCarros[i] -= velCarros[i];
    if(xCarros[i] <= -largCarro){
      xCarros[i] = 600;
    }
  }
}
