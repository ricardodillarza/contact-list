const express = require("express");
const app = express();
const port = 3000;
const database = require("./database.json");
const cors = require("cors");

app.listen(port, function() {
  console.log(`Servidor encendido en el puerto:${port}`);
  console.log(`http://localhost:${port}`);
});

//SERVIDOR ESTATICO
app.use("/", express.static("cliente"));

//PETICIONES
app.use(cors());
app.use(express.json());

app.get("/api/contacts", getContactInfo);
app.get("/api/contacts/:id", getSingleContactInfo);

app.put("/api/contacts/:id", editContactInfo);
app.post("/api/contacts", newContact);
app.delete("/api/contacts/:id", deleteContactInfo);

function getContactInfo(request, response) {    //TRAER TODA MI LISTA DE CONTACTOS
  response.send(database);
}

function getSingleContactInfo(request, response) {    //TRAER SOLO UN CONTACTO
  const id = request.params.id;

  for(let i = 0 ; i < database.contactList.length ; i++) {   //RECORRE LA LISTA DE USUARIOS Y VERIFICA QUE EXISTA EL SOLICITADO
    if(database.contactList[i].id == id) {
      response.status(200).send(database.contactList[i]);
    }
  }
  response.status(400).send("Usuario no registrado");
}

function editContactInfo(request, response) {    //EDITAR INFO DE UN CONTACTO
  const id = request.params.id;
  let contactToUpdate;

  for(let i = 0 ; i < database.contactList.length ; i++) {
    if(database.contactList[i].id == id) {
      contactToUpdate = database.contactList[i];
    }
  }

  if(request.body.photo) {
    const newPhoto = request.body.photo;
    contactToUpdate.photo = newPhoto;
  }

  if(request.body.name) {
    const newName = request.body.name;
    contactToUpdate.name = newName;
  }

  if(request.body.cellphone) {
    const newCellPhone = request.body.cellphone;
    contactToUpdate.cellphone = newCellPhone;
  }

  if(request.body.email) {
    const newEmail = request.body.email;
    contactToUpdate.email = newEmail;
  }
  response.send(database);
}

function newContact(request, response) {   //AÑADE UN NUEVO CONTACTO
  const addContact = request.body;

  let newId = Math.floor(Math.random() * 99.99);
  for(let i = 0 ; i<database.contactList.length ; i++) {
    if(database.contactList[i].id == newId) {
      newId = Math.floor(Math.random() * 99.99);
      i = 0;
    } else {
      addContact.id = newId;
    }
  }
  database.contactList.push(addContact);
  response.status(201).send(database);
}

function deleteContactInfo(request, response) {   // BORRA UN CONTACTO
  const id = request.params.id;
  for(let i = 0 ; i < database.contactList.length ; i++) {
    if(database.contactList[i].id == id) {
      database.contactList.splice(i, 1);
    }
  }
  response.send(database);
}
