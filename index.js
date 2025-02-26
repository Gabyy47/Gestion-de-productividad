//Asignación de las tablas e investigación

//Tabla empleados y cookies - Alejandra
//Tabla tipo de productos y bitacora - Ana
//Tabla de proveedores y cors- Sonia
//Tabla de maquinaria y header de seguridad - Andrea
//Tabla de productos y JWT - Aileen


//Declaracion de modulos requeridos

var Express = require("express")
var bodyParser = require("body-parser")
var cors = require("cors")
var mysql = require("mysql2")
var jwt = require ("jsonwebtoken")
var  cookieParser = require("cookie-parser") 


//Conexion a la Base de Datos - Datasource

var conexion = mysql.createConnection({
    host:"localhost",
    port:"3306",
    user:"root",
    password:"",
    database:"L4TEST",

});

//Funcion para registrar el consumo de la API en bitacora
function registrarBitacora(tabla_afectada, tipo_operacion) {
    const query = "INSERT INTO bitacora (tabla_afectada, tipo_operacion) VALUES (?, ?)";
    const values = [tabla_afectada, tipo_operacion];
  
    conexion.query(query, values, (err, results) => {
      if (err) {
        handleDatabaseError(err, res, "Error en registrar la bitacora:");
            return;
      }
      logger.info("Listado de la bitacora - OK");
        res.json(rows);
    });
  }

//Inicio del uso de Express.js

var app = Express();

//Declaracion usos y libs

app.use(cors({

    origin: function (origin, callback) {
      const allowedOrigins = ['http://localhost:49146', 'http://localhost:3000', 'http://localhost:3306']; 
  
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {

        callback(new Error('Not allowed by CORS'));
      }
    },
    
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Habilita las cookies si es necesario

}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());


//Definicion del Listener

const logger = require("./logger"); // Importar logger

app.listen(49146, () => {
    conexion.connect((err) => {
        if (err) {
            logger.error("Error al conectar a la BD: " + err.message);
            throw err;
        }
        logger.info("Conexión a la BD con éxito!");
    });
});



app.get('/api/json', (solicitud, respuesta) => {
    respuesta.json({ text: "HOLA ESTE ES UN JSON" });
});

app.get('/', (solicitud, respuesta) => {
    respuesta.send("¡Hola Mundo!");
});

function handleDatabaseError(err, res, message) {
    logger.error(message, err);
    res.status(500).json({ error: err.message });
}


//Middleware para verificar JWT en rutas protegidas
const verificarToken = (req, res, next) => {
    const token = req.cookies.token; //obtiene el token de la cookie
    if (!token) return res.status(401).json({ mensaje: "Acceso denegado"});
    
    try {
        const verificado =jwt.verify(token, SECRET_KEY);
        req.usuario = verificado;
        next();
    } catch (error) {
        res.status(400).json({ mensaje: "Token Invalido"});
    }
};


//Ruta protegida con JWT
app.get('/api/seguro', verificarToken, (req, res) => {
    res.json({ mensaje: "Acceso concedido a la ruta segura"});
});

//Get listado de usuarios

app.get('/api/usuario', (request, response) => {
    var query = "SELECT * FROM l4test.usuario";

    conexion.query(query, (err, rows) => {
        if (err) {
            logger.error("Error en listado de usuario: " + err.message);
            return response.status(500).json({ error: "Error en listado de usuario" });
        }
        response.cookie('mi_cookie', 'valor_de_la_cookie', { 
            expires: new Date(Date.now() + 900000), 
            httpOnly: true, 
            secure: false,  
            sameSite: 'lax' 
        });
        registrarBitacora("usuario", "GET", request.body); // Registra la petición en la bitácora
        response.json(rows);
        logger.info("Listado de usuarios - OK");
    });
});


app.get("/api/cookie", (req, res) => {
    if (!req.cookies) {
        return res.status(400).json({ error: "Las cookies no están habilitadas o enviadas correctamente." });
    }

    const miCookie = req.cookies.mi_cookie;

    if (miCookie) {
        logger.info("Cookie leída correctamente");
        res.json({ mensaje: "Valor de la cookie:", cookie: miCookie });
    } else {
        res.status(404).json({ mensaje: "No se encontró la cookie" });
    }
});

//Get listado de usuarios con where

app.get('/api/usuario/:id', (req, res) => {
    const query = "SELECT * FROM l4test.usuario WHERE id_usuario = ?";
    const values = [parseInt(req.params.id)];
    conexion.query(query, values, (err, rows) => {
        if (err) {
            handleDatabaseError(err, res, "Error en listado de usuarios con where:");
            return;
        }
        registrarBitacora("usuario", "GET", request.body); // Registra la petición en la bitácora
        logger.info("Listado de usuarios con where - OK");
        res.json(rows);
    });
});

//Post insert de usuarios

app.post('/api/usuario', (req, res) => {
    const query = "INSERT INTO l4test.usuario (nombre, apellido, nombre_usuario, correo, contraseña) VALUES (?, ?, ?, ?, ?)";
    const values = [req.body.nombre, req.body.apellido, req.body.nombre_usuario, req.body.correo, req.body.contraseña];
    conexion.query(query, values, (err) => {
        if (err) {
            handleDatabaseError(err, res, "Error en inserción de usuario:");
            return;
        }
        registrarBitacora("usuario", "INSERT", request.body); // Registra accion en la bitácora
        logger.info("INSERT de usuarios - OK");
        res.json("INSERT EXITOSO!");
    });
});



//Put Update de usuarios

app.put('/api/usuario', (req, res) => {
    const query = "UPDATE l4test.usuario SET nombre = ?, apellido = ?, correo = ?, nombre_usuario = ? WHERE id_usuario = ?";
    const values = [req.body.nombre, req.body.apellido, req.body.correo, req.body.nombre_usuario, req.body.id_usuario];
    conexion.query(query, values, (err) => {
        if (err) {
            handleDatabaseError(err, res, "Error en actualización de usuario:");
            return;
        }
        registrarBitacora("usuario", "UPDATE", request.body); // Registra la accion en la bitacora
        logger.info("ACTUALIZACIÓN de usuarios - OK");
        res.json("UPDATE EXITOSO!");
    });
});

//Delete de usuarios

app.delete('/api/usuario/:id', (req, res) => {
    const query = "DELETE FROM l4test.usuario WHERE id_usuario = ?";
    const values = [parseInt(req.params.id)];
    conexion.query(query, values, (err) => {
        if (err) {
            handleDatabaseError(err, res, "Error en eliminación de usuario:");
            return;
        }
        registrarBitacora("usuario", "DELETE", request.body); // Registra accion en la bitácora
        logger.info("DELETE de usuarios - OK");
        res.json("DELETE EXITOSO!");
    });
});

//tabla empleados 
//Get listado de empleados
// Rutas de empleados
app.get('/api/empleados', (req, res) => {
    const query = "SELECT * FROM l4test.empleados"
    conexion.query(query, (err, rows) => {
        if (err) {
            handleDatabaseError(err, res, "Error en listado de empleados:");
            return;
        };
        registrarBitacora("empleados", "GET", request.body); // Registra la petición en la bitácora
        logger.info("Listado de empleados - OK");
        res.json(rows);
    });
});

app.get('/api/empleados/:id', (req, res) => {
    const query = "SELECT * FROM l4test.empleados WHERE id_empleado = ?";
    const values = [parseInt(req.params.id)];
    conexion.query(query, values, (err, rows) => {
        if (err) {
            handleDatabaseError(err, res, "Error en listado de empleados con where:");
            return;
        }
        registrarBitacora("empleados", "GET", request.body); // Registra la petición en la bitácora
        logger.info("Listado de empleados con where - OK");
        res.json(rows);
    });
});

app.post('/api/empleados', (req, res) => {
    const query = "INSERT INTO l4test.empleados (nombre, apellido, telefono, cargo, salario, estado, fecha_contratacion) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [req.body.nombre, req.body.apellido, req.body.telefono, req.body.cargo, req.body.salario, req.body.estado, req.body.fecha_contratacion];
    conexion.query(query, values, (err) => {
        if (err) {
            handleDatabaseError(err, res, "Error en inserción de empleado:");
            return;
        }
        registrarBitacora("empleados", "INSERT", request.body); // Registra accion en la bitácora
        logger.info("INSERT de empleados - OK");
        res.json("INSERT EXITOSO!");
    });
});

app.put('/api/empleados', (req, res) => {
    const query = "UPDATE l4test.empleados SET nombre = ?, apellido = ?, telefono = ?, cargo = ?, salario = ?, fecha_contratacion = ? WHERE id_empleado = ?";
    const values = [req.body.nombre, req.body.apellido, req.body.telefono, req.body.cargo, req.body.salario, req.body.fecha_contratacion, req.body.id_empleado];
    conexion.query(query, values, (err) => {
        if (err) {
            handleDatabaseError(err, res, "Error en actualización de empleado:");
            return;
        }
        registrarBitacora("empleados", "UPDATE", request.body); // Registra la accion en la bitacora
        logger.info("ACTUALIZACIÓN de empleados - OK");
        res.json("UPDATE EXITOSO!");
    });
});

app.delete('/api/empleados/:id', (req, res) => {
    const query = "DELETE FROM l4test.empleados WHERE id_empleado = ?";
    const values = [parseInt(req.params.id)];
    conexion.query(query, values, (err) => {
        if (err) {
            handleDatabaseError(err, res, "Error en eliminación de empleado:");
            return;
        }
        registrarBitacora("empleados", "DELETE", request.body); // Registra accion en la bitácora
        logger.info("DELETE de empleados - OK");
        res.json("DELETE EXITOSO!");
    });
});


//GET tipo de productos

app.get('/api/tipoproductos',(request, response) => {
    var query = "select *from L4TEST.tipo_productos"
    conexion.query(query, function(err, rows, fields) {
        if (err) {
            handleDatabaseError(err, res, "Error en listado de tipo de productos:");
            return;
        }
        registrarBitacora("tipo_productos", "GET", request.body); // Registra la petición en la bitácora
        logger.info("Listado de tipo de productos - OK");
        res.json(rows);
    })
});

//Get tipo de productos con where

app.get('/api/tipoproductos/:id',(request, response)=>{
    var query = "SELECT * FROM L4TEST.tipo_productos WHERE id_tipo_producto = ?"
    var values = [
        parseInt(request.params.id)
    ];

    conexion.query(query,values,function(err,rows,fields){
        if (err){
            handleDatabaseError(err, res, "Error en listado de tipos de productos con where:");
            return;
        }
        registrarBitacora("tipo_productos", "GET", request.body); 
        logger.info("Listado de tipo de productos con where - OK");
        res.json(rows);
    });
});

//Post tipo de productos

app.post('/api/tipoproductos', (request, response) => {
    var query = "INSERT INTO tipo_productos (nombre, cantidad) VALUES (?, ?)";
    var values = [
        request.body["nombre"],
        request.body["cantidad"],
    ];

    conexion.query(query, values, function(err, rows, fields) {
        if (err) {
            handleDatabaseError(err, res, "Error en inserción de tipo de productos:");
            return;
        }
        registrarBitacora("tipo_productos", "INSERT", request.body); // Registra accion en la bitácora
        logger.info("INSERT de tipo de productos - OK");
        res.json("INSERT EXITOSO!");
    });
});

//Put Update de tipo de productos

app.put('/api/tipoproductos', (request, response) => {
    var query = "UPDATE tipo_productos SET nombre = ?, cantidad = ? where id_usuario = ?";
    var values = [
        request.body["nombre"],
        request.body["cantidad"],
        request.body["id_tipo_producto"]

    ];
    conexion.query(query, values, function(err, rows, fields) {
        if (err) {
            handleDatabaseError(err, res, "Error en actualización de tipo de productos:");
            return;
        }
        registrarBitacora("tipo_productos", "UPDATE", request.body); // Registra la accion en la bitacora
        logger.info("ACTUALIZACIÓN de tipo de productos - OK");
        res.json("UPDATE EXITOSO!");
    });
});

//Delete de tipo de productos

app.delete('/api/tipoproductos/:id', (request, response) => {
    var query = "DELETE FROM tipo_productos where id_tipo_producto = ?";
    var values = [
        parseInt(request.params.id)
    ];

    conexion.query(query, values, function(err, rows, fields) {
        if (err) {
            handleDatabaseError(err, res, "Error en la eliminación de tipo de productos:");
            return;
        }
        registrarBitacora("tipo_productos", "DELETE", request.body); // Registra accion en la bitácora
        logger.info("DELETE de tipo de productos - OK");
        res.json("DELETE EXITOSO!");
    });
});


//Get listado de los productos

app.get('/api/productos',(request, response)=>{
    var query = "SELECT * FROM L4TEST.PRODUCTOS"
    conexion.query(query,function(err,rows,fields){
        if (err){
            handleDatabaseError(err, res, "Error en listado de productos:");
            return;
        }
        registrarBitacora("productos", "GET", request.body); //REGISTRAR LA PETICION EN LA BITACORA
        logger.info("Listado de productos - OK");
        res.json(rows);
    })

});


//Get listado de productos con where

app.get('/api/productos/:id',(request, response)=>{
    var query = "SELECT * FROM L4TEST.PRODUCTOS WHERE id_producto = ?"
    var values = [
        parseInt(request.params.id)

    ];
    conexion.query(query,values,function(err,rows,fields){
        if (err){
            handleDatabaseError(err, res, "Error en listado de productos con where:");
            return;
        };
        registrarBitacora("productos", "GET", request.body);
        logger.info("Listado de usuarios productos where - OK");
        res.json(rows);
    })

});

//Post insert de productos

app.post('/api/productos', (request, response) => {
    var query = "INSERT INTO PRODUCTOS (nombre, unidad_medida, proveedor, precio_unitario, cantidad_stock, fecha_ultima_compra, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?)";
    var values = [
        request.body["nombre"],
        request.body["unidad_medida"],
        request.body["proveedor"],
        request.body["precio_unitario"],
        request.body["cantidad_stock"],
        request.body["fecha_ultima_compra"],
        request.body["descripcion"]

        
    ];
    conexion.query(query, values, function(err, rows, fields) {
        if (err) {
            handleDatabaseError(err, res, "Error en inserción de productos:");
            return;
        }
        registrarBitacora("productos", "POST", request.body);
        logger.info("INSERT de productos - OK");
        res.json("INSERT EXITOSO!");
    });

});


//Put Update de productos

app.put('/api/productos', (request, response) => {
    var query = "UPDATE PRODUCTOS SET nombre = ?, unidad_medida = ?, proveedor = ?, precio_unitario = ?, cantidad_stock = ?, fecha_ultima_compra = ?, descripcion = ? where id_producto = ?";
    var values = [
        request.body["nombre"],
        request.body["unidad_medida"],
        request.body["proveedor"],
        request.body["precio_unitario"],
        request.body["cantidad_stock"],
        request.body["fecha_ultima_compra"],
        request.body["descripcion"],
        request.body["id_producto"]
    ];
    conexion.query(query, values, function(err, rows, fields) {
        if (err) {
            handleDatabaseError(err, res, "Error en actualización de productos:");
            return;
        }
        registrarBitacora("productos", "PUT", request.body);
        logger.info("ACTUALIZACIÓN de productos - OK");
        res.json("UPDATE EXITOSO!");
    });

});


//Delete de productos

app.delete('/api/productos/:id', (request, response) => {
    var query = "DELETE FROM PRODUCTOS where id_producto = ?";
    var values = [
        parseInt(request.params.id)
    ];
    conexion.query(query, values, function(err, rows, fields) {
        if (err) {
            handleDatabaseError(err, res, "Error en eliminación de producto:");
            return;
        }
        registrarBitacora("productos", "DELETE", request.body);
        logger.info("DELETE de producto - OK");
        res.json("DELETE EXITOSO!");
    });
});


// Get listado de maquinaria
app.get('/api/maquinaria', (request, response) => {
    var query = "SELECT * FROM l4test.maquinaria";

    conexion.query(query, function (err, rows, fields) {
        if (err) {
            handleDatabaseError(err, res, "Error en listado de la maquinaria:");
            return;
        }
        registrarBitacora("maquinaria", "GET", request.body); // Registra la petición en la bitácora
        logger.info("Listado de maquinaria - OK");
        res.json(rows);
    });
});

// Get maquinaria con where (por id)
app.get('/api/maquinaria/:id', (request, response) => {
    var query = "SELECT * FROM l4test.maquinaria WHERE id_maquinaria = ?";
    var values = [parseInt(request.params.id)];

    conexion.query(query, values, function (err, rows, fields) {
        if (err) {
            handleDatabaseError(err, res, "Error en listado de la maquinaria:");
            return;
        }
        registrarBitacora("maquinaria", "GET", request.body); // Registra la petición en la bitácora
        logger.info("Listado de maquinaria - OK");
        res.json(rows);
    });
});

// Post insert de maquinaria
app.post('/api/maquinaria', (request, response) => {
    var query = `
        INSERT INTO l4test.maquinaria (nombre, modelo, marca, id_proveedor, fecha_adquisicion, estado, costo, ubicacion) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    var values = [
        request.body["nombre"],
        request.body["modelo"],
        request.body["marca"],
        request.body["id_proveedor"],
        request.body["fecha_adquisicion"],
        request.body["estado"],
        request.body["costo"],
        request.body["ubicacion"]
    ];

    conexion.query(query, values, function (err, rows, fields) {
        if (err) {
            handleDatabaseError(err, res, "Error en inserción de maquinaria:");
            return;
        }
        registrarBitacora("maquinaria", "POST", request.body); // Registra la petición en la bitácora
        logger.info("INSERT de maquinaria - OK");
        res.json("INSERT EXITOSO!");
    });
});

// Put update de maquinaria
app.put('/api/maquinaria', (request, response) => {
    var query = `
        UPDATE l4test.maquinaria 
        SET nombre = ?, modelo = ?, marca = ?, id_proveedor = ?, fecha_adquisicion = ?, estado = ?, costo = ?, ubicacion = ?
        WHERE id_maquinaria = ?
    `;
    var values = [
        request.body["nombre"],
        request.body["modelo"],
        request.body["marca"],
        request.body["id_proveedor"],
        request.body["fecha_adquisicion"],
        request.body["estado"],
        request.body["costo"],
        request.body["ubicacion"],
        request.body["id_maquinaria"]
    ];

    conexion.query(query, values, function (err, rows, fields) {
        if (err) {
            handleDatabaseError(err, res, "Error en actualización de maquinaria:");
            return;
        }
        registrarBitacora("maquinaria", "PUT", request.body); // Registra la petición en la bitácora
        logger.info("ACTUALIZACIÓN de maquinaria - OK");
        res.json("UPDATE EXITOSO!");
    });
});

// Delete de maquinaria
app.delete('/api/maquinaria/:id', (request, response) => {
    var query = "DELETE FROM l4test.maquinaria WHERE id_maquinaria = ?";
    var values = [parseInt(request.params.id)];

    conexion.query(query, values, function (err, rows, fields) {
        if (err) {
            handleDatabaseError(err, res, "Error en eliminación de maquinaria:");
            return;
        }
        registrarBitacora("maquinaria", "DELETE", request.body); // Registra la petición en la bitácora
        logger.info("DELETE de maquinaria - OK");
        res.json("DELETE EXITOSO!");
    });
});


// Get lista de proveedores 
app.get('/api/proveedores', (request, response) => {
    const query = "SELECT * FROM proveedores";
    conexion.query(query, (err, rows) => {
        if (err) {
            handleDatabaseError(err, res, "Error en listado de proveedores:");
            return;
        }
        registrarBitacora("Proveedores", "GET");
        logger.info("Listado de proveedores - OK");
        res.json(rows);
    });
});

// Get listado de proveedores con where 
app.get('/api/proveedores/:id', (request, response) => {
    const query = "SELECT * FROM proveedores WHERE id_proveedor = ?";
    const values = [parseInt(request.params.id)];

    conexion.query(query, values, (err, rows) => {
        if (err) {
            handleDatabaseError(err, res, "Error en listado de proveedores con where:");
            return;
        }
        registrarBitacora("Proveedores", "GET");
        logger.info("Listado de proveedores con where - OK");
        res.json(rows);
    });
});

// Post para insertar proveedor
app.post('/api/proveedores', (request, response) => {
    const { nombre, contacto, telefono, correo, direccion, pais } = request.body;

    if (!nombre || !contacto || !telefono || !correo || !direccion || !pais) {
        return response.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const query = "INSERT INTO proveedores (nombre, contacto, telefono, correo, direccion, pais) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [nombre, contacto, telefono, correo, direccion, pais];

    conexion.query(query, values, (err, result) => {
        if (err) {
            handleDatabaseError(err, res, "Error en inserción de proveedor:");
            return;
        }
        registrarBitacora("Proveedores", "INSERT");
        logger.info("INSERT de proveedor - OK");
        res.json("INSERT EXITOSO!");
    });
});

// Put Update de proveedores
app.put('/api/proveedores/:id', (request, response) => {
    const { nombre, contacto, telefono, correo, direccion, pais } = request.body;
    const id_proveedor = parseInt(request.params.id);

    if (!nombre || !contacto || !telefono || !correo || !direccion || !pais) {
        return response.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const query = "UPDATE proveedores SET nombre = ?, contacto = ?, telefono = ?, correo = ?, direccion = ?, pais = ? WHERE id_proveedor = ?";
    const values = [nombre, contacto, telefono, correo, direccion, pais, id_proveedor];

    conexion.query(query, values, (err, result) => {
        if (err) {
            handleDatabaseError(err, res, "Error en actualización de proveedores:");
            return;
        }
        registrarBitacora("Proveedores", "PUT");
        logger.info("ACTUALIZACIÓN de proveedores - OK");
        res.json("UPDATE EXITOSO!");
    });
});

// Delete de Proveedor
app.delete('/api/proveedores/:id', (request, response) => {
    const query = "DELETE FROM proveedores WHERE id_proveedor = ?";
    const values = [parseInt(request.params.id)];

    conexion.query(query, values, (err, result) => {
        if (err) {
            handleDatabaseError(err, res, "Error en eliminación de proveedor:");
            return;
        }
        registrarBitacora("Proveedores", "DELETE");
        logger.info("DELETE de proveedor - OK");
        res.json("DELETE EXITOSO!");
    });
});

// GET listado de bitacora
app.get('/api/bitacora', (request, response, next) => {
    const query = "SELECT * FROM L4test.bitacora";
    conexion.query(query, (err, rows) => {
        if (err) {
            return next({ status: 500, message: "Error al obtener la bitácora" });
        }
        response.json({ status: "success", data: rows });
    });
});