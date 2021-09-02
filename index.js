//declarando constantes e importando los modulos de node
import fs from 'fs';
import  pathModule from 'path';
const extMd = '.md';
const regEx = /\]\((http[^)]+)\)/g;
import fetch from 'node-fetch';

async function ValidateURLs(urls) {
  let validUrls = []
  let invalidUrls = []
  for (const url of urls) {
    const response = await fetch(url, {headers:{"Content-Type": "application/json"}, mode: 'no-cors'})
    if(response.status === 200){
      //console.log(`link bueno: ${url}`)
      validUrls.push(url)
      
    }
    else{
      //console.log(`link malo: ${url}`)
      invalidUrls.push(url)
    }
  }
  
  return {'validUrls': validUrls, 'invalidUrls': invalidUrls}  
};

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
        const dataAString = data.toString();
        const allLink = dataAString.match(regEx);
        allLink.forEach(element => {
          // console.log('match dentro del forEach', element)
          arrayLinks.push(element.replace(/[\[\(\)\]]/g, ''))
        })
        resolve(arrayLinks)
      }
    })
  })
};

//funcion para leer archivos MD
const mdLinks = (path) => {
  return new Promise((resolve, reject) => {
    // console.log('imprimiendo el path', path)
    if(fs.lstatSync(path).isDirectory()){
      readFolder(path).then(files => {
        files.forEach(file => {
          if (pathModule.extname(file) === extMd) {
            printFile(file).then(links => {
              ValidateURLs(links)
              .then((objectLinks)=>{
                const validUrls = objectLinks.validUrls
                const invalidUrls = objectLinks.invalidUrls
                console.log('valid urls')
                console.log(validUrls)
                console.log('invalid urls')
                console.log(invalidUrls)
                resolve(objectLinks)
              })
              // console.log(links);
            }).catch(err => console.log(err))
          }
        })
      }).catch(err => console.log(err))
    }
  })
  
  
}

// PASO 1 : Lectura de parametro process.argv[2]
// Declarando variable parameterType y asignamos lo que envia la terminal
const parameterType = process.argv[2];
// console.log(parameterType)
//usamos el modulo fs e invoco el metodo lstatSync
mdLinks(parameterType)


