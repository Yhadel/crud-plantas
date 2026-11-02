// Creado por Yhadel Lopez Matricula 2024-2493
import React, { useState, useEffect } from "react";
import { Trash2, Plus, Sprout, Leaf, Edit3, X } from "lucide-react";

// Plantas iniciales de ejemplo para que la app no inicie vacía
const PLANTAS_INICIALES = [
  { id: 1, name: "Orquídea (Phalaenopsis)", date: "24/10/2026" },
  { id: 2, name: "Monstera Deliciosa", date: "24/10/2026" },
  { id: 3, name: "Ficus Lyrata", date: "25/10/2026" },
  { id: 4, name: "Aloe Vera", date: "26/10/2026" },
  { id: 5, name: "Sansevieria (Lengua de Suegra)", date: "27/10/2026" },
];

export default function App() {
  // Inicializamos leyendo de la base de datos local (localStorage) o cargando los ejemplos
  const [plants, setPlants] = useState(() => {
    const saved = localStorage.getItem("plant_species");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) return parsed;
    }
    localStorage.setItem("plant_species", JSON.stringify(PLANTAS_INICIALES));
    return PLANTAS_INICIALES;
  });
  
  const [plantName, setPlantName] = useState("");
  const [editingId, setEditingId] = useState(null); // Controla si estamos editando un registro

  // Sincronizar automáticamente con la base de datos local (localStorage) cada vez que cambie 'plants'
  useEffect(() => {
    localStorage.setItem("plant_species", JSON.stringify(plants));
  }, [plants]);

  // CREAR (Create) o ACTUALIZAR (Update) una planta
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!plantName.trim()) return;

    if (editingId !== null) {
      // ACTUALIZAR (Update): Modifica el elemento existente
      setPlants(
        plants.map((plant) =>
          plant.id === editingId ? { ...plant, name: plantName.trim() } : plant
        )
      );
      setEditingId(null);
    } else {
      // CREAR (Create): Agrega un nuevo registro con ID único y fecha actual
      const newPlant = {
        id: Date.now(),
        name: plantName.trim(),
        date: new Date().toLocaleDateString(),
      };
      setPlants([newPlant, ...plants]);
    }
    setPlantName("");
  };

  // PREPARAR EDICIÓN: Carga los datos de la planta seleccionada en el formulario superior
  const startEditing = (plant) => {
    setEditingId(plant.id);
    setPlantName(plant.name);
  };

  // CANCELAR EDICIÓN: Limpia el formulario y el estado de edición
  const cancelEditing = () => {
    setEditingId(null);
    setPlantName("");
  };

  // ELIMINAR (Delete): Remueve una planta de la lista mediante su ID
  const deletePlant = (id) => {
    setPlants(plants.filter((plant) => plant.id !== id));
    if (editingId === id) cancelEditing();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col font-sans">
      
      {/* 1. ENCABEZADO / NAVBAR SUPERIOR */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-600">
              <Sprout size={28} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Sistema CRUD de Plantas</h1>
              <p className="text-xs text-gray-500">Gestión de especies botánicas con base de datos local</p>
            </div>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-3 py-1.5 rounded-full border border-emerald-200">
            Local Storage Activo
          </span>
        </div>
      </header>

      {/* 2. CONTENIDO PRINCIPAL A ANCHO COMPLETO */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 space-y-6">
        
        {/* Formulario de Registro / Edición */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {editingId !== null ? "Actualizar Especie de Planta" : "Registrar Nueva Especie"}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {editingId !== null
                  ? "Modifica el nombre de la especie seleccionada y guarda los cambios."
                  : "Escribe el nombre de la planta para guardarla automáticamente en la base de datos local."}
              </p>
            </div>
            {editingId !== null && (
              <button
                onClick={cancelEditing}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 bg-gray-100 px-2.5 py-1.5 rounded-lg transition"
              >
                <X size={14} /> Cancelar edición
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Ej: Cactus de Navidad, Helecho..."
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 text-gray-800 text-sm transition"
            />
            <button
              type="submit"
              className={`px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition text-sm shadow-sm cursor-pointer text-white ${
                editingId !== null
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {editingId !== null ? <Edit3 size={18} /> : <Plus size={18} />}
              <span>{editingId !== null ? "Actualizar Especie" : "Guardar Especie"}</span>
            </button>
          </form>
        </section>

        {/* Listado de Especies Registradas (Leer / Actualizar / Eliminar) */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <Leaf size={16} className="text-emerald-500" />
              Especies Registradas en la Base de Datos ({plants.length})
            </h3>
          </div>
          
          {plants.length === 0 ? (
            <p className="text-gray-400 text-sm italic text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              No hay especies registradas todavía.
            </p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {plants.map((plant) => (
                <li
                  key={plant.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition ${
                    editingId === plant.id
                      ? "bg-amber-50/60 border-amber-300 shadow-xs"
                      : "bg-gray-50/80 border-gray-200/80 hover:border-emerald-300 hover:bg-white"
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-gray-800 text-sm block">{plant.name}</span>
                    <span className="text-[11px] text-gray-400">Fecha de registro: {plant.date}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {/* Botón Editar */}
                    <button
                      onClick={() => startEditing(plant)}
                      className="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                      title="Editar planta"
                    >
                      <Edit3 size={18} />
                    </button>
                    {/* Botón Eliminar */}
                    <button
                      onClick={() => deletePlant(plant.id)}
                      className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition cursor-pointer"
                      title="Eliminar planta"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

      </main>

      {/* 3. PIE DE PÁGINA */}
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-400">
        Aplicación de Gestión de Plantas (CRUD) • Desarrollado para práctica académica
      </footer>

    </div>
  );
}