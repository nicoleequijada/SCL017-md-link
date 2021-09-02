//declarando constantes e importando los modulos de node
import fs from 'fs';
import  pathModule from 'path';
const extMd = '.md';
const regEx = /\]\((http[^)]+)\)/g;
import fetch from 'node-fetch';
let linksBueno = [];
let linksMalo = [];
const headers = {
  "Content-Type": "application/json"
}

const validateUrls = (urls) => {
 return Promise.all(urls.map(url =>
    fetch(url).then(resp => resp)
    )).then(texts => {
      return texts
    })
    .catch(err => console.log("no funciona"))
    
    // fetch(url , {headers:headers, mode: 'no-cors'})
    // .then(response => {
    //   if(response.status === 200){
    //     // console.log("links buenos")
    //     linksBueno.push(url)
    //   }
    // })
    // .catch(err => linksMalo.push(url)) 
    
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
    // console.log('imprimiendo el path', path)
    if(fs.lstatSync(path).isDirectory()){
      readFolder(path).then(files => {
        files.forEach(file => {
          if (pathModule.extname(file) === extMd) {
            printFile(file).then(links => {
              
             const urlsArray = validateUrls(links).then(newLinks => newLinks)
             .then(a => a)
             console.log(urlsArray)
             urlsArray.map(currentResponse => {
               if(currentResponse.status === 200){
                 linksBueno.push(currentResponse.url)
               }else{
                 linksMalo.push(currentResponse.url)
               }
             })
              
              // console.log(links);
            }).catch(err => console.log(err))
          }
        })
      }).catch(err => console.log(err))
    }
    console.log({linksBueno})
    console.log({linksMalo})
  }
  
  // PASO 1 : Lectura de parametro process.argv[2]
  // Declarando variable parameterType y asignamos lo que envia la terminal
  const parameterType = process.argv[2];
  // console.log(parameterType)
  //usamos el modulo fs e invoco el metodo lstatSync
  mdLinks(parameterType)
  
  
  