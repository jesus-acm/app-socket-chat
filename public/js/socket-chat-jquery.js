var usuariosGlobal = [];
var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre');
var sala = params.get('sala');
var idGeneral = 'todos-usuarios';

// referencias de jquery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje =$('#txtMensaje');
var divChatbox = $('#divChatbox');
var divSala = $('#divSala');
var buscarContacto = $('#buscarContacto');

// Funciones para renderizar usuarios
function renderizarUsuarios(personas, modificar){ // [{}, {}, {}]
    console.log(personas);
    if(modificar){
        usuariosGlobal = personas;
    }

    var html = '';
    html += '<li>';
    html += '    <a data-id="todos-usuarios" id="todos-usuarios" class="active"> Chat de <span>'+params.get('sala')+'</span></a>';
    html += '</li>';

    for (let i = 0; i < personas.length; i++){
        html += '<li>';
        html += '    <a id='+personas[i].id+' data-id="'+personas[i].id+'" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+personas[i].nombre+' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsuarios.html(html);
}

function renderizarMensajes(mensaje, yo){
    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours()+':'+fecha.getMinutes();

    var adminClass = 'info';

    if(mensaje.nombre === 'Administrador'){
        adminClass = 'danger';
    }

    if(yo){
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>'+mensaje.nombre+'</h5>';
        html += '        <div class="box bg-light-inverse">'+mensaje.mensaje+'</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">'+hora+'</div>';
        html += '</li>';
    }else{
        html += '<li class="animated fadeIn">';

        if(mensaje.nombre !== 'Administrador'){
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        
        html += '    <div class="chat-content">';
        html += '        <h5>'+mensaje.nombre+'</h5>';
        html += '        <div class="box bg-light-'+adminClass+'">'+mensaje.mensaje+'</div>';
        html += '    </div>';
        html += '    <div class="chat-time">'+hora+'</div>';
        html += '</li>';
    }

    divChatbox.append(html);
}

function renderizarNombreSala (){
    var html = '    <h3 class="box-title">Sala de chat <small>'+params.get('sala')+'</small></h3>';
    divSala.empty();
    divSala.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

//============================
// Listeners
//============================
divUsuarios.on('click', 'a', function(){

    var id = $(this).data('id');
    if(id){
        $(`#${ idGeneral }`).removeClass('active');
        idGeneral = id;
        $(`#${ id }`).addClass('active');
    }
});



formEnviar.on('submit', function (event){
    event.preventDefault();

    if(txtMensaje.val().trim().length === 0){
        return;
    }
    if (idGeneral==='todos-usuarios'){
        socket.emit('crearMensaje', {
            nombre: nombre,
            mensaje: txtMensaje.val()
        }, function(mensaje) {
            txtMensaje.val('').focus();
            renderizarMensajes(mensaje, true);
            scrollBottom();
        });
    }else{
        socket.emit('mensajePrivado', {
            para:idGeneral, 
            mensaje:txtMensaje.val()
        }, function(mensajePrivado){
            txtMensaje.val('').focus();
            renderizarMensajes(mensajePrivado, true);
            scrollBottom();
        });
    }
});


buscarContacto.keyup(function(){
    let expresion = new RegExp(`${ $('#buscarContacto').val() }`,'i');

    let personas = usuariosGlobal.filter(persona => expresion.test(persona.nombre));
    renderizarUsuarios(personas, false);
});