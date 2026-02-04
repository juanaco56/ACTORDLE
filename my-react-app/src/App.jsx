import { useState } from "react";
import { actores } from "./data/actores";
import "./App.css";

// Devuelve un actor aleatorio y el resto del array sin ese actor
function sacarActorRandom(lista) {
  const index = Math.floor(Math.random() * lista.length);
  const actor = lista[index];
  const resto = lista.filter((_, i) => i !== index);
  return { actor, resto };
}

function App() {
  // Actores que todavía no han salido (para no repetir)
  const [actoresDisponibles, setActoresDisponibles] = useState(actores);

  // Elegimos el primer actor al cargar la app
  const inicial = sacarActorRandom(actoresDisponibles);
  const [actorActual, setActorActual] = useState(inicial.actor);

  // Estados del juego
  const [respuesta, setRespuesta] = useState("");
  const [intentos, setIntentos] = useState(0);
  const [acertado, setAcertado] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Quitamos el actor inicial de la lista solo la primera vez
  if (actoresDisponibles.length === actores.length) {
    setActoresDisponibles(inicial.resto);
  }

  // Comprueba la respuesta del usuario
  function comprobarRespuesta() {
    if (acertado) return;

    const respuestaUsuario = respuesta.trim().toLowerCase();
    const nombreActor = actorActual.nombre.toLowerCase();

    // Si el input está vacío, cuenta como fallo
    if (respuestaUsuario === "") {
      setMensaje("NO LO DEJES VACÍO, SE CUENTA COMO ERROR!");
      setIntentos((prev) => prev + 1);
      setRespuesta("");
      return;
    }

    // Si acierta
    if (respuestaUsuario === nombreActor) {
      setMensaje("¡Has acertado! GGS");
      setAcertado(true);
    } else {
      // Si falla
      const nuevosIntentos = intentos + 1;
      setIntentos(nuevosIntentos);

      if (nuevosIntentos > 3) {
        setMensaje(
          "Anda que fallar con lo fácil que era... El actor era " +
            actorActual.nombre
        );
        setAcertado(true);
      } else {
        setMensaje("Toma una pequeña ayuda, que te veo perdid@");
      }
    }

    setRespuesta("");
  }

  // Pasa al siguiente actor sin repetir
  function siguienteActor() {
    let lista = actoresDisponibles;

    // Si ya no quedan actores, se reinicia la lista
    if (lista.length === 0) {
      lista = actores;
    }

    const { actor, resto } = sacarActorRandom(lista);
    setActorActual(actor);
    setActoresDisponibles(resto);

    // Reinicio del estado del juego
    setIntentos(0);
    setAcertado(false);
    setMensaje("");
    setRespuesta("");
  }

  return (
    <div className="app">
      <h1>🎭 Actordle</h1>

      {/* Imagen del actor con o sin blurblur hasta acertar */}

      <img
        src={actorActual.imagen}
        alt="Actor misterioso"
        className={acertado ? "actor-img revealed" : "actor-img"}
      />

      {/* Input y botón para adivinar */}

      <div className="guess-box">
        <input
          type="text"
          value={respuesta}
          placeholder="Escribe el nombre del actor..."
          onChange={(e) => setRespuesta(e.target.value)}
          disabled={acertado}
        />
        <button onClick={comprobarRespuesta} disabled={acertado}>
          Adivinar
        </button>
      </div>

      {/* Pistas que aparecen según los intentos */}

      <div className="pistas">
        {actorActual.pistas.slice(0, intentos).map((pista, index) => (
          <p key={index}>💡 {pista}</p>
        ))}
      </div>

      {/* Mensaje de acierto o fallo */}

      {mensaje !== "" && <p className="mensaje">{mensaje}</p>}

      {/* Botón para pasar al siguiente actor */}

      {acertado && (
        <button className="next-btn" onClick={siguienteActor}>
          Siguiente actor
        </button>
      )}
    </div>
  );
}

export default App;
