import { Group, co, z } from "jazz-tools";

/**
 * ID del grupo que es dueño de la encuesta global
 */
const ID_GRUPO_MAESTRO = "co_zWftKygoVvHw69JaV4g2KYw6mbh";

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

    // Inicializa la cuenta la primera vez que se accede a la app
    if (!account.$jazz.has("root")) {
      // Los grupos controlan quién puede leer y escribir en los CoValues
      let grupoPublico = await Group.load(ID_GRUPO_MAESTRO);
      if (!grupoPublico) {
        // Si no se encuentra el grupo maestro, se crea uno local.
        // Esto va a permitir usar la app, pero no ver los cambios de otros usuarios.
        grupoPublico = Group.create();
        grupoPublico.addMember("everyone", "writer"); // Todos pueden votar
      }

      // Busca la encuesta global
      let encuesta = await Encuesta.loadUnique(
        "encuesta-hogwarts",
        grupoPublico.$jazz.id
      );
      // Si no se encuentra, se crea una nueva (esto sólo va a
      // ocurrir cuando el primer usuario acceda a la app)
      if (!encuesta) {
        encuesta = await Encuesta.upsertUnique({
          value: {
            titulo: "¿A qué casa de Hogwarts pertenecés?",
            descripcion: "¡Votá por tu casa favorita!",
            votos: [],
          },
          unique: "encuesta-hogwarts",
          owner: grupoPublico,
        });
      }
      account.$jazz.set("root", { encuesta });
    }
  });
