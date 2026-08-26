const { getConnection } = require('./src/config/dataBase');

async function conectar() {
  let pool;
  try {
    pool = await getConnection();
    const result = await pool.request().query('SELECT 1 as test');
    console.log('🔥 ¡CONEXIÓN EXITOSA! Resultado:', result.recordset[0].test);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    if (pool) await pool.close();
  }
}

conectar();