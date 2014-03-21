// Archivo principal del Backend, configuración del servidor
// y otras opciones

var express = require('express'); // Express: Framework HTTP para Node.js
var routes = require('./routes'); // Dónde tenemos la configuración de las rutas
var path = require('path');

var mongoose = require('mongoose'); // Mongoose: Libreria para conectar con MongoDB
var passport = require('passport'); // Passport: Middleware de Node que facilita la autenticación de usuarios

// Importamos el modelo usuario y la configuración de passport
require('./models/user');
require('./passport')(passport);

// Conexión a la base de datos de MongoDB que tenemos en local
mongoose.connect('mongodb://localhost:27017/passport-example', function(err, res) {
  if(err) throw err;
  console.log('Conectado con éxito a la BD');
});

// Iniciamos la aplicación Express
var app = express();

// Configuración (Puerto de escucha, sistema de plantillas, directorio de vistas,...)
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));

// Middlewares de Express que nos permiten enrutar y poder
// realizar peticiones HTTP (GET, POST, PUT, DELETE)
app.use(express.cookieParser());
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());

// Ruta de los archivos estáticos (HTML estáticos, JS, CSS,...)
app.use(express.static(path.join(__dirname, 'public')));
// Indicamos que use sesiones, para almacenar el objeto usuario
// y que lo recuerde aunque abandonemos la página
app.use(express.session({ secret: 'lollllo' }));

// Configuración de Passport. Lo inicializamos
// y le indicamos que Passport maneje la Sesión
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

// Si estoy en local, le indicamos que maneje los errores
// y nos muestre un log más detallado
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/* Rutas de la aplicación */
// Cuando estemos en http://localhost:puerto/ (la raiz) se ejecuta el metodo index
// del modulo 'routes'
app.get('/', routes.index);

/* Rutas de Passport */
// Ruta para desloguearse
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});
// Ruta para autenticarse con Twitter (enlace de login)
app.get('/auth/twitter', passport.authenticate('twitter'));
// Ruta para autenticarse con Facebook (enlace de login)
app.get('/auth/facebook', passport.authenticate('facebook'));
// Ruta de callback, a la que redirigirá tras autenticarse con Twitter.
// En caso de fallo redirige a otra vista '/login'
app.get('/auth/twitter/callback', passport.authenticate('twitter',
  { successRedirect: '/', failureRedirect: '/login' }
));
// Ruta de callback, a la que redirigirá tras autenticarse con Facebook.
// En caso de fallo redirige a otra vista '/login'
app.get('/auth/facebook/callback', passport.authenticate('facebook',
  { successRedirect: '/', failureRedirect: '/login' }
));

// Inicio del servidor
app.listen(app.get('port'), function(){
  console.log('Aplicación Express escuchando en el puerto ' + app.get('port'));
});
