const fs = require('fs');
const ruta = __dirname;


try{
  const isDirectory = fs.lstatSync('/Users').isDirectory()
  console.log(isDirectory);
}catch(error){
  console.log(error)
  if(error.code =='ENOENT'){

  }else{

  }
}

fs.readdir(ruta,(err, archivos) => {
  archivos.forEach(archivo => {
    console.log('archivos', archivo);
  })
});