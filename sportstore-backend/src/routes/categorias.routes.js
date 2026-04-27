const router = require("express").Router();
const pool = require("../db");

// LISTAR CATEGORÍAS CON CONTEO DE PRODUCTOS
router.get("/", async (req, res) => {
  try {
    const consulta = `
      SELECT 
        c.id, 
        c.nombre, 
        c.descripcion,
        c.estado,
        (SELECT COUNT(*) FROM productos p WHERE p.categoria_id = c.id AND p.estado = true) AS total_productos
      FROM categorias c 
      ORDER BY c.id
    `;
    const resultado = await pool.query(consulta);
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error consultando categorías" });
  }
});

// CREAR CATEGORÍA
router.post("/", async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    const resultado = await pool.query(
      `INSERT INTO categorias (nombre, descripcion) 
       VALUES ($1, $2) 
       RETURNING *`,
      [nombre, descripcion]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la categoría" });
  }
});

// ACTUALIZAR CATEGORÍA
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, estado } = req.body;

    const resultado = await pool.query(
      `UPDATE categorias 
       SET nombre = $1, descripcion = $2, estado = $3
       WHERE id = $4 
       RETURNING *`,
      [nombre, descripcion, estado, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la categoría" });
  }
});

// DESACTIVAR CATEGORÍA (Borrado lógico)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Al igual que en productos, cambiamos el estado a false en lugar de borrar
    const resultado = await pool.query(
      `UPDATE categorias SET estado = false WHERE id = $1 RETURNING *`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    res.json({ mensaje: "Categoría desactivada", categoria: resultado.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al desactivar la categoría" });
  }
});

module.exports = router;