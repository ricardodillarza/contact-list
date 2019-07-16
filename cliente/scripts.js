const contactList = document.querySelector("#contact-list");
const contactInfo = document.querySelector("#contact-info");
const modal = document.querySelector("#nuevo-contacto-modal");  //MODAL PARA CREAR CONTACTO NUEVO
const editModal = document.querySelector("#edit-contact-modal"); //MODAL PARA EDITAR CONTACTO

const formulario = document.querySelector("#formulario-crear-contacto"); //FORM PARA CREAR NUEVO CONTACTO
const editForm = document.querySelector("#edit-form-contact");  //FORM PARA EDITAR CONTACTO EXISTENTE
const submitEditInfo = document.getElementById("enviarNuevaInfo");

const url = "http://localhost:3000/api/contacts";
const config = {
  method:"get"   //OBTENER LA INFO DE CADA USUARIO
}

function getContactos() {
fetch(url, config)
  .then(function(response) {  //UNA PROMESA
    return response.json();
  })
  .then(function(response) {   //2A PROMESA, EL PARAMETRO ES EL RETURN, PARA LIGAR TODO
    printContacts(response.contactList);
  })
}
getContactos();

function printContacts(lista) {
  let cards = ' ';
  for(let contact of lista) {   //A CADA CARTA LE AÑADES SU FOTO Y SU NOMBRE
    cards += `
      <div class = "contactCard" onclick = "showInfo(${contact.id})">
        <h2>${contact.name}</h2>
        <img src=${contact.photo}>
      </div>
    `
  }   //CON EL ONCLICK DE ARRIBA VAS A MOSTRAR LA INFO COMPLETA DE CADA CONTACTO, POR ESO ESPECIFICAS EL ID DENTRO DE LA FUNCION
  contactList.innerHTML = cards;  //IMPRIME TODO LO QUE SE LE FUE AÑADIENDO A CARDS
}


// AHORA VAMOS A IMPRIMIR LA INFO DE CADA USUARIO AL DAR CLICK EN SU CARTA
function showInfo(id) {
  fetch(`${url}/${id}`, config)
    .then(function(response) {
      return response.json();
  })
    .then(function(contact) {
      contactInfo.innerHTML = `
    <section class = "singleContactInfo">
      <img src=${contact.photo}>
      <h3>${contact.name}</h3>
      <p>${contact.cellphone}</p>
      <p>${contact.email}</p>
      <button class="edit-button" onclick = "editContact()">Editar contacto</button>
      <button class="delete-button" onclick = "deleteContact(${contact.id})">Eliminar contacto</button>

    </section>
  `
})
}


//EDITAR CONTACTO
function editContact() {
  editModal.classList.add("active");
}

function escondeNuevoModal() {
  editModal.classList.remove("active");
}

editForm.addEventListener("submit", function(event) {
  event.preventDefault();

  escondeNuevoModal();

      //NUEVOS VALORES QUE SE GUARDARAN
    const newPhotoInfo = editForm.newPhoto.value;
    const newNameInfo = editForm.newName.value;
    const newCellphoneInfo = parseInt(editForm.newCellphone.value);
    const newEmailInfo = editForm.newEmail.value;

  //CONFIG DE MET PUT PARA LA PETICION
  const postEditContact = {
    method: "put",
    body: JSON.stringify({
      "photo": newPhotoInfo,
      "name": newNameInfo,
      "cellphone": newCellphoneInfo,
      "email": newEmailInfo
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }


  // CONFIG DEL PUT CON SU FETCH

  function newinfo(id) {
  fetch(`${url}/${id}`, postEditContact)
    .then(function(response) {
      getContactos();
    })
    .then(function(response) {
      const cards = document.querySelectorAll(".contactCard");
      for(let i = 0; i < cards.length; i++) {
          if (cards[i].value == id) {
            console.log("Funciona");
          }
        }

    })

    .catch(function(err) {
    console.log(err);
    })
  }
});




//BORRAR CONTACTO
function deleteContact(id) {
  fetch(`${url}/${id}`, { method: "delete" })
  .then(function(response) {
    getContactos();
    contactInfo.innerHTML = " ";
  })

  .catch(function(err) {
    console.log(err);
  })
}

// AL MOMENTO DE DAR CLICK EN CREAR CONTACTO APARECE EL FORM
function crearContacto() {
  modal.classList.add("active");
}
//CON ESTA FUNCION SE ESCONDE AL TERMINAR
function escondeModal() {
  modal.classList.remove("active");
}





// METODO POST YA CONFIGURADO AL MOMENTO DE LLENAR TODO EL FORM Y ENVIARLO
formulario.addEventListener("submit", function(event) {
  event.preventDefault();  //ASI NO SE REFRESQUE LA PAGINA AL HACER SUBMIT
  escondeModal();

  //POST. GUARDAMOS LOS VALORES DEL FORM EN VARIABLES
  const photo = formulario.photo.value;
  const name = formulario.name.value;
  const cellphone = parseInt(formulario.cellphone.value);
  const email = formulario.email.value;

  //VALORES QUE INCLUYE EL FORM
  const postNewContact = {
    method: "post",
    body: JSON.stringify({
      "photo": photo,   //PUEDEN IR SIN COMILLAS, PORQUE AL FINAL TODO SE CONVIERTE A JSON
      "name": name,  //EL formulario.name.value PUEDE IR DIRECTAMENT AQUI
      "cellphone": cellphone,
      "email": email
    }),
    headers: {
      'Content-Type': 'application/json'   //LE DECIMO QUE LE ENVIAREMOS CONTENIDO DE  TIPO JSON
    }
  }

  //CONFIG DEL POST
  fetch(url, postNewContact)
    .then(function(response) {
          console.log(response);
          getContactos();
    })
    .catch(function(err) {
      console.log(err);
  })
});
