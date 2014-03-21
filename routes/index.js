// Rutas de la aplicación

exports.index = function(req, res){
  // Renderiza la plantilla 'index' cuando en el navegador
  // nos encontremos en la raiz '/' --> http://localhost:puerto/
  res.render('index', {
    // Enviamos como variables un título
    // y objeto 'user' que contiene toda
    // la información del usuario y viaja en el 'request'
    title: 'Ejemplo de Passport JS',
    user: req.user
  });
};
