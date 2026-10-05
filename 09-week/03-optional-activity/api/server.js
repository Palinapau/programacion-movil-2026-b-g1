const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let tareas = [
  {
    id: 1,
    titulo: "Terminar proyecto Ionic",
    descripcion: "Completar la actividad de la semana 9",
  },
  {
    id: 2,
    titulo: "Probar API REST",
    descripcion: "Verificar los endpoints GET y POST",
  },
];

app.get("/tareas", (req, res) => {
  res.json(tareas);
});

app.post("/tareas", (req, res) => {
  const { titulo, descripcion } = req.body;

  if (!titulo || !descripcion) {
    return res.status(400).json({
      error: "El título y la descripción son obligatorios",
    });
  }

  const nuevaTarea = {
    id: tareas.length > 0 ? tareas[tareas.length - 1].id + 1 : 1,
    titulo,
    descripcion,
  };

  tareas.push(nuevaTarea);

  res.status(201).json(nuevaTarea);
});

app.listen(PORT, () => {
  console.log(`API ejecutándose en http://localhost:${PORT}`);
});