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
server.listen(port, () =>{
  console.log(`Server running on port ${port}`);
});
