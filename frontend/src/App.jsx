import { useEffect, useState } from "react";
import { api } from "./api/client";

export default function App() {
  const [lotes, setLotes] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    cultivo: "",
    fechaSiembra: "",
    estado: "Planeado"
  });

  async function cargar() {
    const res = await api.get("/api/lotes");
    setLotes(res.data);
  }

  useEffect(()=>{ cargar(); },[]);

  function change(e){
    setForm({...form, [e.target.name]: e.target.value});
  }

  async function submit(e){
    e.preventDefault();
    await api.post("/api/lotes", form);
    cargar();
  }

  async function eliminar(id){
    await api.delete(`/api/lotes/${id}`);
    cargar();
  }

  return (
    <main>
      <h1>AgriTrack Lite</h1>
      <form onSubmit={submit}>
        <input name="nombre" placeholder="Nombre" onChange={change}/>
        <input name="cultivo" placeholder="Cultivo" onChange={change}/>
        <input type="date" name="fechaSiembra" onChange={change}/>
        <select name="estado" onChange={change}>
          <option>Planeado</option>
          <option>En proceso</option>
          <option>Cosechado</option>
        </select>
        <button>Crear</button>
      </form>

      <ul>
        {lotes.map(l=>(
          <li key={l._id}>
            {l.nombre} - {l.cultivo} - {l.estado}
            <button onClick={()=>eliminar(l._id)}>X</button>
          </li>
        ))}
      </ul>
    </main>
  );
}