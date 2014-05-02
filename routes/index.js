// Rutas de la aplicación

exports.index = function(req, res){
  // Renderiza la plantilla 'index' cuando en el navegador
  // nos encontremos en la raiz '/' --> http://localhost:puerto/
  if(req.user && req.user != "undefined"){
    // Si se ha logrado obtener un usuario por la autenticacion de facebook o twitter
    // se renderea la plantilla home.jade
    res.render('home', {
      // Enviamos como variables un título
      // y un objeto 'user' que contiene toda
      // la información del usuario y viaja en el 'request'
      title: 'Ejemplo de Passport JS',
      user: req.user
    });
  }else{
    // Si NO se ha logrado obtener un usuario por la autenticacion de facebook o twitter
    // se renderea la plantilla index.jade para que inicie sesion
    res.render('index', {
      // Enviamos como variables solo el título
      title: 'Ejemplo de Passport JS'
    });
  }
};
