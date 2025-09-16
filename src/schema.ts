import { Group, co, z } from "jazz-tools";

export const CasaDeHogwarts = z.enum([
  "Gryffindor",
  "Hufflepuff",
  "Ravenclaw",
  "Slytherin",
]);
export type CasaDeHogwarts = z.infer<typeof CasaDeHogwarts>;

/** Un voto para una casa específica */
export const Voto = co.map({
  casa: CasaDeHogwarts,
  // ID de la cuenta del votante
  idVotante: z.string(),
  fecha: z.date(),
});

/** La encuesta que contiene todos los votos */
export const Encuesta = co.map({
  titulo: z.string(),
  descripcion: z.string().optional(),
  votos: co.list(Voto),
});

/** `Account.root` es un `CoMap` privado para cada usuario.
 * Contiene objetos a los que ese usuario puede acceder. */
export const AccountRoot = co.map({
  encuesta: Encuesta,
});

export const JazzAccount = co
  .account({
    profile: co.profile(),
    root: AccountRoot,
  })
  .withMigration(async (account) => {
    /**
     * La migración de cuenta se ejecuta en la creación de cuenta y en cada inicio de sesión.
     * Podés usarla para configurar a qué CoValues tiene acceso la cuenta.
     */

    // Los grupos controlan quién puede leer y escribir en los CoValues
    const grupoPublico = Group.create();
    grupoPublico.addMember("everyone", "writer"); // Todos pueden votar

    // Crear la encuesta global de Hogwarts si no existe
    let encuesta = account.root?.encuesta;
    if (!encuesta) {
      encuesta = await Encuesta.upsertUnique({
        value: {
          titulo: "¿A qué casa de Hogwarts pertenecés?",
          descripcion: "¡Votá por tu casa favorita de Hogwarts!",
          votos: [],
        },
        unique: { uniqueness: "encuesta-hogwarts" },
        owner: grupoPublico,
      });
    }

    if (!account.root) {
      account.$jazz.set("root", { encuesta: encuesta });
    } else if (!account.root.encuesta) {
      account.root.$jazz.set("encuesta", encuesta);
    }
    console.log({ account: account.toJSON(), encuesta: encuesta?.toJSON() });
  });
