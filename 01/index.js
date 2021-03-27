const pix = document.querySelector(".chave-pix")

function copiarPix(){
  pix.innerHTML = "51b81827-4ae8-4806-9853-d85891cda413"
}

pix.onclick = (evento) => {
  evento.preventDefault()
  copiarPix();
  setTimeout(function(){ 
    pix.innerHTML = "Chave Pix"; 
  }, 5000);
}
