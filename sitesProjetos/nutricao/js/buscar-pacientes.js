var botaoAdicionar = document.querySelector("#buscar-pacientes");

botaoAdicionar.addEventListener("click", function(){
    //https://api-pacientes.herokuapp.com/pacientes
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "https://api-pacientes.herokuapp.com/pacientes");

    xhr.addEventListener("load", function(){
        var erroAjax = document.querySelector("#erro-ajax");
        var carregadoAjax = document.querySelector("#carregado-ajax");
        if(xhr.status == 200){ 
            mensagemRequest(carregadoAjax);    
            var resposta = xhr.responseText;
            var pacientes = JSON.parse(resposta);

            pacientes.forEach( function(paciente){
                adicionaPacienteTabela(paciente);
            });
        }else {
            console.log(xhr.status);
            console.log(xhr.response);
            mensagemRequest(erroAjax);
        }
        
    });

    xhr.send();

});

function mensagemRequest(classe){
    function mostraMensagem(classe){
        classe.classList.remove("invisivel");
    }
    mostraMensagem(classe);

    function retiraMensagem(classe){       
        setTimeout(function(){
            classe.classList.add("invisivel");
        },3000); 
    }
    retiraMensagem(classe);
}




