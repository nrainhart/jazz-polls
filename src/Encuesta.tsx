import { useCoState } from "jazz-tools/react";
import { Encuesta, Voto, CasaDeHogwarts } from "./schema";

const COLORES_CASAS = {
  Gryffindor: "bg-red-600 hover:bg-red-700 border-red-700",
  Hufflepuff: "bg-yellow-500 hover:bg-yellow-600 border-yellow-600",
  Ravenclaw: "bg-blue-600 hover:bg-blue-700 border-blue-700",
  Slytherin: "bg-green-600 hover:bg-green-700 border-green-700",
} as const;

const DESCRIPCION_CASAS = {
  Gryffindor: "Valientes, caballerosos y audaces",
  Hufflepuff: "Leales, justos y trabajadores",
  Ravenclaw: "Sabios, inteligentes y creativos",
  Slytherin: "Ambiciosos, astutos y decididos",
} as const;

export function EncuestaHogwarts({
  idEncuesta,
  idVotante,
}: {
  idEncuesta: string;
  idVotante: string;
}) {
  const encuesta = useCoState(Encuesta, idEncuesta, {
    resolve: { votos: { $each: true } },
  });

  if (!encuesta.$isLoaded) return <div>Cargando encuesta...</div>;

  const totalVotos = encuesta.votos.length;

  const votoDelUsuario = encuesta.votos.find(
    (voto) => voto.idVotante === idVotante
  );
  const yaVoto = !!votoDelUsuario;

  const votosPorCasa = {
    Gryffindor: 0,
    Hufflepuff: 0,
    Ravenclaw: 0,
    Slytherin: 0,
  };

  encuesta.votos.forEach((voto) => {
    if (voto.casa) {
      votosPorCasa[voto.casa]++;
    }
  });

  const leaderboard = Object.entries(votosPorCasa)
    .sort(([, a], [, b]) => b - a)
    .map(([casa, votos]) => ({ casa: casa as CasaDeHogwarts, votos: votos }));

  const votar = (casa: CasaDeHogwarts) => {
    if (yaVoto) {
      // Actualizar voto existente
      votoDelUsuario.$jazz.set("casa", casa);
      votoDelUsuario.$jazz.set("fecha", new Date());
    } else {
      // Crear nuevo voto
      const voto = Voto.create(
        {
          casa: casa,
          idVotante: idVotante,
          fecha: new Date(),
        },
        encuesta.$jazz.owner
      );

      encuesta.votos.$jazz.push(voto);
    }
  };

  return (
    <div className="space-y-8">
      {/* Título de la encuesta */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {encuesta.titulo}
        </h2>
        <p className="text-gray-600">{encuesta.descripcion}</p>
        <p className="text-sm text-gray-500 mt-2">
          Total de votos: {totalVotos}
        </p>
      </div>
      {/* Clasificación */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="space-y-3">
          {leaderboard.map(({ casa, votos }, index) => {
            const porcentaje = totalVotos > 0 ? (votos / totalVotos) * 100 : 0;
            return (
              <div
                key={casa}
                className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-400">
                    #{index + 1}
                  </span>
                  <span className="font-semibold text-lg">{casa}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        COLORES_CASAS[casa].split(" ")[0]
                      }`}
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-lg min-w-[3rem] text-right">
                    {votos}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Sección de votación */}
      <div className="space-y-4">
        {yaVoto && (
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-1">
              Tu voto actual: {votoDelUsuario.casa}
            </h3>
            <p className="text-blue-700 text-sm">
              Podés cambiar tu voto seleccionando una casa diferente abajo.
            </p>
          </div>
        )}

        <h3 className="text-xl font-semibold text-center">
          {yaVoto ? "Cambiá tu voto" : "Elegí tu casa"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(COLORES_CASAS).map(([casa, colores]) => {
            const esVotoActual = votoDelUsuario?.casa === casa;
            const estiloBoton = esVotoActual
              ? `${colores} ring-4 ring-yellow-400 ring-opacity-75 shadow-lg`
              : colores;

            return (
              <button
                type="button"
                key={casa}
                onClick={() => votar(casa as CasaDeHogwarts)}
                className={`p-6 rounded-lg border-2 text-white font-bold text-lg transition-all duration-200 transform hover:scale-105 ${estiloBoton}`}
              >
                <div className="text-center">
                  <div className="text-xl mb-2">{casa}</div>
                  <div className="text-sm opacity-90">
                    {DESCRIPCION_CASAS[casa as CasaDeHogwarts]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
