import express from "express";
import { Server } from "socket.io";
import {createServer} from "node:http"
import cors from 'cors';
const port = process.env.PORT ?? 4000;
 
const app = express();
const server = createServer(app);
const io = new Server(server);
 
import pool from './db.js';
app.use(cors({
  origin: 'http://localhost:5173'
}));
io.on('connection', () =>{
  console.log('a user has connected!');
});
app.use(express.json());
// PUT - Actualizar producto por ID
app.put('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, marca, cantidad, precio, tipo } = req.body;
 
  // Validación básica
  if (!nombre || !marca || !cantidad || !precio || !tipo) {
    return res.status(400).json({
      success: false,
      error: 'Faltan campos obligatorios'
    });
  }
 
  const tiposPermitidos = ['Embolsado', 'Enlatado', 'Caja'];
  if (!tiposPermitidos.includes(tipo)) {
    return res.status(400).json({
      success: false,
      error: 'Tipo de producto no válido'
    });
  }
 
  try {
    const sql = `
      UPDATE productos
      SET nombre = ?, marca = ?, cantidad = ?, precio = ?, tipo = ?
      WHERE id = ?
    `;
 
    const [result] = await pool.execute(sql, [
      nombre,
      marca,
      cantidad,
      precio,
      tipo,
      id
    ]);
 
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }
 
    res.json({
      success: true,
      mensaje: 'Producto actualizado correctamente',
      producto: {
        id,
        nombre,
        marca,
        cantidad,
        precio,
        tipo
      }
    });
  } catch (err) {
    console.error('❌ Error al actualizar producto:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});
app.get('/', (req,res) => {
  res.send('<h1>esto es el chat</h1>');
});
const validarProducto = (req, res, next) => {
    console.log('Headers:', req.headers);
    console.log('Body completo:', req.body);
    console.log('Tipo de body:', typeof req.body);
   
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: 'No se recibieron datos en el cuerpo de la petición'
        });
    }
   
    const { nombre, marca, cantidad, precio, tipo } = req.body;
   
    // Validaciones básicas
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(400).json({
            error: 'El nombre del producto es requerido y debe ser texto'
        });
    }
   
    if (!marca || typeof marca !== 'string' || marca.trim() === '') {
        return res.status(400).json({
            error: 'La marca del producto es requerida y debe ser texto'
        });
    }
   
    if (!cantidad || isNaN(cantidad) || cantidad < 1) {
        return res.status(400).json({
            error: 'La cantidad debe ser un número mayor a 0'
        });
    }
   
    if (!precio || isNaN(precio) || precio <= 0) {
        return res.status(400).json({
            error: 'El precio debe ser un número mayor a 0'
        });
    }
   
    if (!tipo || !['Embolsado', 'Enlatado', 'Caja'].includes(tipo)) {
        return res.status(400).json({
            error: 'El tipo debe ser: Embolsado, Enlatado o Caja'
        });
    }
   
    next();
};
 
app.get('/api/productos', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM productos ORDER BY fecha_creacion DESC');
       
        res.json({
            success: true,
            data: rows,
            total: rows.length
        });
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});
 
app.get('/api/productos/:id', async (req, res) => {
    try {
         const { id } = req.params;
       
        const [producto] = await pool.execute('SELECT * FROM productos WHERE id = ?', [id]);
       
        res.json({
            success: true,
            data: producto[0],
        });
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});
 
 
app.delete('/api/productos/:id', async (req, res) => {
    try {
        const { id } = req.params;
       
        console.log('Eliminando producto con ID:', id);
       
        // Primero verificar si el producto existe
        const [producto] = await pool.execute('SELECT * FROM productos WHERE id = ?', [id]);
       
        if (producto.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Producto no encontrado'
            });
        }
       
        // Eliminar el producto
        const [result] = await pool.execute('DELETE FROM productos WHERE id = ?', [id]);
       
       
        console.log('Producto eliminado exitosamente:', producto[0]);
       
        res.json({
            success: true,
            message: 'Producto eliminado exitosamente',
            data: producto[0]
        });
       
    } catch (error) {
        console.error('Error eliminando producto:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});
 
app.post('/api/productos', validarProducto, async (req, res) => {
    try {
        const { nombre, marca, cantidad, precio, tipo } = req.body;
       
        console.log('Insertando producto:', { nombre, marca, cantidad, precio, tipo });
       
       
        const query = `
            INSERT INTO productos (nombre, marca, cantidad, precio, tipo)
            VALUES (?, ?, ?, ?, ?)
        `;
       
        const [result] = await pool.execute(query, [
            nombre.trim(),
            marca.trim(),
            parseInt(cantidad),
            parseFloat(precio),
            tipo
        ]);
       
        // Obtener el producto recién insertado
        const [newProduct] = await pool.execute(
            'SELECT * FROM productos WHERE id = ?',
            [result.insertId]
        );
       
       
        console.log('Producto insertado exitosamente:', newProduct[0]);
       
        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: newProduct[0]
        });
       
    } catch (error) {
        console.error('Error insertando producto:', error);
       
        if (error.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
            return res.status(400).json({
                success: false,
                error: 'El tipo debe ser: Embolsado, Enlatado o Caja'
            });
        }
       
        if (error.code === 'ECONNREFUSED') {
            return res.status(500).json({
                success: false,
                error: 'No se puede conectar a la base de datos'
            });
        }
       
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor: ' + error.message
        });
    }
});


// GET - Obtener todos los proveedores
app.get('/api/proveedores', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM proveedores ORDER BY id DESC');
    res.json({
      success: true,
      data: rows,
      total: rows.length
    });
  } catch (error) {
    console.error('❌ Error obteniendo proveedores:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// GET - Obtener proveedor por ID
app.get('/api/proveedores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM proveedores WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Proveedor no encontrado'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('❌ Error obteniendo proveedor:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// PUT - Actualizar proveedor por ID
app.put('/api/proveedores/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre_empresa, nombre_representante, marcas_que_surte, costo_productos } = req.body;

  if (!nombre_empresa || !nombre_representante || !marcas_que_surte || !costo_productos) {
    return res.status(400).json({
      success: false,
      error: 'Todos los campos son obligatorios'
    });
  }

  try {
    const sql = `
      UPDATE proveedores
      SET nombre_empresa = ?, nombre_representante = ?, marcas_que_surte = ?, costo_productos = ?
      WHERE id = ?
    `;

    const [result] = await pool.execute(sql, [
      nombre_empresa.trim(),
      nombre_representante.trim(),
      marcas_que_surte.trim(),
      parseFloat(costo_productos),
      id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Proveedor no encontrado'
      });
    }

    res.json({
      success: true,
      mensaje: 'Proveedor actualizado correctamente',
      proveedor: {
        id,
        nombre_empresa,
        nombre_representante,
        marcas_que_surte,
        costo_productos
      }
    });
  } catch (err) {
    console.error('❌ Error al actualizar proveedor:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// DELETE - Eliminar proveedor por ID
app.delete('/api/proveedores/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [proveedor] = await pool.execute('SELECT * FROM proveedores WHERE id = ?', [id]);

    if (proveedor.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Proveedor no encontrado'
      });
    }

    const [result] = await pool.execute('DELETE FROM proveedores WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Proveedor eliminado exitosamente',
      data: proveedor[0]
    });
  } catch (error) {
    console.error('❌ Error al eliminar proveedor:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

const validarProveedor = (req, res, next) => {
  const { nombre_empresa, nombre_representante, marcas_que_surte, costo_productos } = req.body;

  if (!nombre_empresa || typeof nombre_empresa !== 'string' || nombre_empresa.trim() === '') {
    return res.status(400).json({ error: 'El nombre de la empresa es requerido y debe ser texto' });
  }

  if (!nombre_representante || typeof nombre_representante !== 'string' || nombre_representante.trim() === '') {
    return res.status(400).json({ error: 'El nombre del representante es requerido y debe ser texto' });
  }

  if (!marcas_que_surte || typeof marcas_que_surte !== 'string' || marcas_que_surte.trim() === '') {
    return res.status(400).json({ error: 'Las marcas que surte son requeridas y deben ser texto' });
  }

  if (
    costo_productos === undefined ||
    isNaN(costo_productos) ||
    parseFloat(costo_productos) <= 0
  ) {
    return res.status(400).json({ error: 'El costo de productos debe ser un número mayor a 0' });
  }

  next();
};

app.post('/api/proveedores', validarProveedor, async (req, res) => {
  try {
    const { nombre_empresa, nombre_representante, marcas_que_surte, costo_productos } = req.body;

    const query = `
      INSERT INTO proveedores (nombre_empresa, nombre_representante, marcas_que_surte, costo_productos)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      nombre_empresa.trim(),
      nombre_representante.trim(),
      marcas_que_surte.trim(),
      parseFloat(costo_productos)
    ]);

    const [newProveedor] = await pool.execute(
      'SELECT * FROM proveedores WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Proveedor creado exitosamente',
      data: newProveedor[0]
    });
  } catch (error) {
    console.error('❌ Error insertando proveedor:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// GET: Todos los registros
app.get('/api/personal', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM personal');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al consultar personal', error: err.message });
  }
});

// GET: Personal por ID
app.get('/api/personal/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM personal WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Personal no encontrado' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al obtener personal', error: err.message });
  }
});

// POST: Agregar nuevo
app.post('/api/personal', async (req, res) => {
  const {
    nombre, apellido, curp, rfc,
    telefono, correo, matutino,
    vespertino, salario, puesto
  } = req.body;

  try {
    const [result] = await pool.query(`
      INSERT INTO personal
      (nombre, apellido, curp, rfc, telefono, correo, matutino, vespertino, salario, puesto)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, curp, rfc, telefono, correo, matutino, vespertino, salario, puesto]
    );

    res.status(201).json({ success: true, message: 'Personal agregado', id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al agregar personal', error: err.message });
  }
});

// PUT: Actualizar por ID
app.put('/api/personal/:id', async (req, res) => {
  const {
    nombre, apellido, curp, rfc,
    telefono, correo, matutino,
    vespertino, salario, puesto
  } = req.body;

  try {
    const [result] = await pool.query(`
      UPDATE personal
      SET nombre = ?, apellido = ?, curp = ?, rfc = ?, telefono = ?, correo = ?, matutino = ?, vespertino = ?, salario = ?, puesto = ?
      WHERE id = ?`,
      [nombre, apellido, curp, rfc, telefono, correo, matutino, vespertino, salario, puesto, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Personal no encontrado' });
    }

    res.json({ success: true, message: 'Personal actualizado' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al actualizar personal', error: err.message });
  }
});

// DELETE: Eliminar por ID
app.delete('/api/personal/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM personal WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Personal no encontrado' });
    }
    res.json({ success: true, message: 'Personal eliminado' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al eliminar personal', error: err.message });
  }
});
server.listen(port, () =>{
  console.log(`Server running on port ${port}`);
});
 
