# 🏰 Encuesta de Casas de Hogwarts

Demo interactiva de [Jazz](https://jazz.tools), usada en mi charla de Nerdearla Argentina 2025: **Construyendo aplicaciones colaborativas sin morir en el intento**.

## Para correrla localmente

Instalá las dependencias:

```bash
pnpm i
```

Después, levantá la aplicación:

```bash
pnpm dev
```

Abrí [http://localhost:5173](http://localhost:5173) en tu navegador para acceder a la app.

## Sobre Jazz

**Jazz** es una base de datos que está pensada para ser usada directamente desde aplicaciones web y mobile, por varios usuarios al mismo tiempo. Te permite construir aplicaciones colaborativas de forma muy fácil, ¡y con muy poco código! Si te interesa saber más, pasate por [https://jazz.tools](https://jazz.tools).

## Preguntas / problemas / feedback

El [Discord de Jazz](https://discord.gg/utDMjHYg42) es el mejor lugar para hacer preguntas, dejar feedback, o reportar problemas!


## Configuración: sync server

Esta app usa [Jazz Cloud](https://jazz.tools/cloud) (`wss://cloud.jazz.tools`) para sincronizar los cambios entre distintos usuarios.

Si corrés la aplicación localmente, también podés levantar un sync server local corriendo `npx jazz-run sync` y modificando el parámetro `sync` de `JazzReactProvider` en [./src/main.tsx](./src/main.tsx) a `{ peer: "ws://localhost:4200" }`.
