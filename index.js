//declarando constantes e importando los modulos de node
const fs = require('fs');
const pathModule = require('path');
const extMd = '.md';
const regEx = /\]\((http[^)]+)\)/g
// se creo funcion para luego en la funcion principal pueda ser llamada
//esta funcion verifica si es un directorio
const isDirectory = (path) => {
  //usamos el modulo fs e invoco el metodo lstatSync
  const value = fs.lstatSync(parameterType).isDirectory();
  return value;
}
//esta funcion se encarga de leer directorios o carpetas
const readFolder = (location) => {
  return new Promise((resolve, reject) => {
    fs.readdir(location, (err, files) => {
      if (err) {
        reject(err)
      } else {
        resolve(files)
      }
    })
  })
};
//esta funcion se encarga de leer un archivo e imprimir su contenido en la terminal
const printFile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        reject(err)
      } else {
        let arrayLinks = [];
        const dataAsString = data.toString();
        const allLink = dataAsString.match(regEx);
        allLink.forEach(e => {
          arrayLinks.push(e.replace(/[\[\(\)\]]/g, ''))
        })
        resolve(arrayLinks)
      }
    })
  })
};

//funcion para leer archivos MD
const mdLinks = (path) => {
  console.log('imprimiendo el path', path)
if(isDirectory(path)){
  readFolder(path).then(files => {
    files.forEach(file => {
      if (pathModule.extname(file) === extMd) {
        printFile(file).then(links => {
          let linksBueno = [];
          let linksMalo = [];
          links.forEach(link =>{
            if(isValidUrl(link)){
              linksBueno.push(link)
            }else{
              linksMalo.push(link)
            }
            console.log({linksBueno})
            console.log({linksMalo})
          })
    
          console.log(links);
        }).catch(err => console.log(err))
      }
    })
  }).catch(err => console.log(err))
}
}
 
// PASO 1 : Lectura de parametro process.argv[2]
// Declarando variable parameterType y asignamos lo que envia la terminal
const parameterType = process.argv[2];
console.log(parameterType)
//usamos el modulo fs e invoco el metodo lstatSync
const valor = fs.lstatSync(parameterType).isDirectory();
console.log('Es un directorio : ' + valor);
module.exports.mdLinks = mdLinks(parameterType)

const isValidUrl = (url) => {
  try {
    new URL(url);
  } catch (e) {
    console.error(e);
    return false;
  }
  return true;
};
