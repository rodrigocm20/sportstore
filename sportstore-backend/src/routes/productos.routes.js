const router=require("express").Router();

const pool=require("../db");

//LISTAR TODO
router.get("/", async(req,res)=>{
try{
const {buscar,categoria}=req.query;

let consulta=`
SELECT
p.*,
c.nombre AS categoria
FROM productos p
JOIN categorias c
ON p.categoria_id=c.id
WHERE p.estado=true
`;

let valores=[];
let indice=1;

// BUSCAR POR NOMBRE
if(buscar){

consulta+=`
AND LOWER(p.nombre)
LIKE LOWER($${indice})
`;
valores.push(`%${buscar}%`);
indice++;
}

// FILTRAR POR CATEGORIA
if(categoria){
consulta+=`
AND p.categoria_id=$${indice}
`;
valores.push(categoria);
}

consulta+=`
ORDER BY p.id
`;

const resultado=
await pool.query(
consulta,
valores
);

res.json(resultado.rows);

}catch(error){

console.error(error);

res.status(500).json({
error:"Error consultando productos"
});

}

});

//STOCK BAJO
router.get("/stock-bajo", async(req,res)=>{

try{

const resultado=
await pool.query(
`
SELECT
p.*,
c.nombre as categoria
FROM productos p
JOIN categorias c
ON p.categoria_id=c.id
WHERE
p.stock <= p.stock_minimo
AND p.estado=true
ORDER BY p.stock
`
);

res.json(resultado.rows);

}catch(error){

console.error(error);

res.status(500).json({
error:"Error consultando stock bajo"
});
}
});

//DASHBOARD ESTADÍSTICAS
router.get("/estadisticas/dashboard", async(req,res)=>{

try{

const total=
await pool.query(
`
SELECT COUNT(*)
FROM productos
WHERE estado=true
`
);

const stockBajo=
await pool.query(
`
SELECT COUNT(*)
FROM productos
WHERE stock <= stock_minimo
AND estado=true
`
);

const inventario=
await pool.query(
`
SELECT SUM(precio*stock)
FROM productos
WHERE estado=true
`
);

res.json({

total_productos:
total.rows[0].count,

productos_stock_bajo:
stockBajo.rows[0].count,

valor_inventario:
inventario.rows[0].sum

});
}catch(error){

console.error(error);

res.status(500).json({
error:"Error dashboard"
});
}
});

//LISTAR UNO EN ESPECÍFICO
router.get("/:id", async(req,res)=>{

try{

const id=req.params.id;

const resultado=
await pool.query(
"SELECT * FROM productos WHERE id=$1",
[id]
);

res.json(resultado.rows[0]);

}catch(error){

res.status(500).json(error);

}

});

//CREAR PRODUCTO
router.post("/", async(req,res)=>{

try{

const {
imagen_url,
nombre,
descripcion,
precio,
stock,
stock_minimo,
categoria_id
}=req.body;


const resultado=
await pool.query(

`
INSERT INTO productos
(
imagen_url,
nombre,
descripcion,
precio,
stock,
stock_minimo,
categoria_id
)

VALUES
($1,$2,$3,$4,$5,$6,$7)

RETURNING *
`,

[
imagen_url,
nombre,
descripcion,
precio,
stock,
stock_minimo,
categoria_id
]

);


res.status(201)
.json(resultado.rows[0]);

}catch(error){

console.error(error);

res.status(500).json(error);

}

});

//ACTUALIZAR PRODUCTO
router.put("/:id", async (req,res)=>{

try{

const id=req.params.id;

const{
imagen_url,
nombre,
descripcion,
precio,
stock,
stock_minimo,
categoria_id,
estado
}=req.body;


// Validaciones básicas
if(precio < 0){
return res.status(400).json({
error:"El precio no puede ser negativo"
});
}

if(stock < 0){
return res.status(400).json({
error:"El stock no puede ser negativo"
});
}


const resultado=
await pool.query(

`
UPDATE productos
SET
imagen_url=$1,
nombre=$2,
descripcion=$3,
precio=$4,
stock=$5,
stock_minimo=$6,
categoria_id=$7,
estado=$8
WHERE id=$9
RETURNING *
`,

[
imagen_url,
nombre,
descripcion,
precio,
stock,
stock_minimo,
categoria_id,
estado,
id
]
);

if(resultado.rows.length===0){
return res.status(404).json({
mensaje:"Producto no encontrado"
});
}
res.json(resultado.rows[0]);

}catch(error){
console.error(error);
res.status(500).json({
error:"Error al actualizar producto"
});
}
});

//ELIMINAR PRODUCTO
router.delete("/:id", async (req,res)=>{

try{
const id=req.params.id;
const resultado=
await pool.query(

`
UPDATE productos
SET estado=false
WHERE id=$1
RETURNING *
`,
[id]
);
if(resultado.rows.length===0){
return res.status(404).json({
mensaje:"Producto no encontrado"
});
}
res.json({
mensaje:"Producto desactivado",
producto:resultado.rows[0]
});

}catch(error){
console.error(error);
res.status(500).json({
error:"Error al eliminar producto"
});
}
});

module.exports=router;