import { useAccount } from "jazz-tools/react";
import { EncuestaHogwarts } from "./Encuesta.tsx";
import { Logo } from "./Logo.tsx";
import { JazzAccount } from "./schema.ts";

function App() {
  const me = useAccount(JazzAccount, {
    resolve: { root: { encuesta: true } },
  });

  return (
    <main className="max-w-4xl mx-auto px-3 mt-16 flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🏰 Encuesta de Casas de Hogwarts
        </h1>
      </div>

      {!me.$isLoaded ? (
        <div>Cargando encuesta...</div>
      ) : (
        <EncuestaHogwarts
          idEncuesta={me.root.encuesta.$jazz.id}
          idVotante={me.$jazz.id}
        />
      )}

      <div className="text-center text-sm text-gray-500 mt-4 mb-8 flex items-center justify-center gap-2">
        <span>Desarrollado con</span>
        <Logo />
        <a className="font-semibold underline" href="https://jazz.tools">
          Jazz
        </a>
      </div>
    </main>
  );
}

export default App;
