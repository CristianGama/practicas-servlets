import { createPool } from "mysql2/promise";

export const pool = createPool({
    host:"localhost",
    port: 3306,
    user:"root",
    password:"admin",
    database:"tienda_productos",
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
}) 


pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conexión a MySQL exitosa');
    connection.release();
  }
});

export default pool;
