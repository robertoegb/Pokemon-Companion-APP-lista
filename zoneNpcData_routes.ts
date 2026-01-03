
import { NPC } from './types';
import { TRAINER_SPRITES } from './data';

export const ZONE_NPC_ROUTES: Record<string, NPC[]> = {
  "Ruta 3": [
    { id: '19bc8d72-8bfc-4bd2-897d-d09bbe54be94', name: 'Chica', sprite: TRAINER_SPRITES.chica, challengePhrase: 'Estabas mirándome ¿verdad?', defeatPhrase: '¡Eres muy malo!', rewardMoney: 10, teamSize: 2, weight: 38 },
    { id: 'affd8107-81bc-4c24-8d95-3bf381ba1895', name: 'Joven', sprite: TRAINER_SPRITES.joven, challengePhrase: '¡Hola! ¡Me gustan los pantalones cortos!', defeatPhrase: '¡Perdí! ¡Perdí!', rewardMoney: 20, teamSize: 2, weight: 26 },
    { id: 'f4f2cdec-7e8e-4387-943c-1e51d765833e', name: 'Cazabichos', sprite: TRAINER_SPRITES.cazabichos, challengePhrase: '¡Nos vimos en el BOSQUE VERDE!', defeatPhrase: '¡Otra vez ganaste!', rewardMoney: 10, teamSize: 4, weight: 36 }
  ],
  "Ruta 4": [
    { id: '64bbbae0-c4ee-40ea-985f-4fbfc03c2e99', name: 'Chica', sprite: TRAINER_SPRITES.chica, challengePhrase: '¡Vine a recoger mis hongos POKéMON!', defeatPhrase: '¡Oh! ¡Mi pobre hongo POKéMON!', rewardMoney: 50, teamSize: 3, weight: 100 }
  ],
  "Ruta 6": [
    { id: '0e8d6807-7b28-4b96-9160-6d6752143de0', name: 'Dominguera', sprite: TRAINER_SPRITES.dominguera, challengePhrase: '¿Yo? Pues vale. ¡Jugaré!', defeatPhrase: '¡No funcionó!', rewardMoney: 30, teamSize: 3, weight: 34 },
    { id: '51f1ff37-6b7c-4fd0-827d-f6b802dccb86', name: 'Campista', sprite: TRAINER_SPRITES.campista, challengePhrase: '¿Qué? ¿Quieres hablar conmigo?', defeatPhrase: '¡Yo no empecé!', rewardMoney: 30, teamSize: 2, weight: 33 },
    { id: 'a3c39ae1-e985-45a6-b415-30b4fdb7bc09', name: 'Cazabichos', sprite: TRAINER_SPRITES.cazabichos, challengePhrase: '¡Jamás te había visto por aquí! ¿Eres bueno?', defeatPhrase: '¡Eres demasiado bueno!', rewardMoney: 20, teamSize: 3, weight: 33 }
  ],
  "Ruta 8": [
    { id: '0f9f71a8-3d42-4c99-a31b-b359190cb03f', name: 'Chica', sprite: TRAINER_SPRITES.chica, challengePhrase: '¡Debemos tener un aspecto muy tonto!', defeatPhrase: '¡Mira lo que has hecho!', rewardMoney: 40, teamSize: 5, weight: 45 },
    { id: '686627c1-d69f-4c08-971f-af822608fe12', name: 'Supernecio', sprite: TRAINER_SPRITES.supernecio, challengePhrase: '¡Me gusta el colegio, y los Pokémon!', defeatPhrase: 'Me quedaré con el colegio...', rewardMoney: 60, teamSize: 4, weight: 33 },
    { id: 'd9cf2ca9-3e3c-4c44-87c9-38825571e875', name: 'Policía', sprite: TRAINER_SPRITES.policia, challengePhrase: '¡Soy un jugador errante!', defeatPhrase: '¡Perdí el gran premio!', rewardMoney: 60, teamSize: 3, weight: 22 }
  ],
  "Ruta 9": [
    { id: '31a478b5-6d3a-4031-bded-9031105a0d4d', name: 'Dominguera', sprite: TRAINER_SPRITES.dominguera, challengePhrase: '¡Tienes algunos Pokémon! ¡En guardia!', defeatPhrase: '¡Me has defraudado!', rewardMoney: 40, teamSize: 4, weight: 20 },
    { id: '649a1983-efef-4ee0-9792-4465d494ae90', name: 'Campista', sprite: TRAINER_SPRITES.campista, challengePhrase: '¡Tomaré el Túnel Roca para ir al Pueblo Lavanda!', defeatPhrase: '¿Vas a ir también al Túnel Roca?', rewardMoney: 40, teamSize: 4, weight: 15 },
    { id: '82efa173-71c0-4309-b814-4f7f21aa4df0', name: 'Montañero', sprite: TRAINER_SPRITES.montanero, challengePhrase: '¡Jaja! ¡No es que seas muy duro!', defeatPhrase: '¿Qué es eso?', rewardMoney: 70, teamSize: 3, weight: 30 },
    { id: '8440460a-ff7d-4e53-999e-a93c2ecb8b4b', name: 'Joven', sprite: TRAINER_SPRITES.joven, challengePhrase: '¡Intento llegar a ser el entrenador definitivo!', defeatPhrase: '¿Mi Sandshrew ha perdido?', rewardMoney: 40, teamSize: 1, weight: 15 },
    { id: 'f2fccc94-d62f-4669-90d1-b2e7d13b0a15', name: 'Cazabichos', sprite: TRAINER_SPRITES.cazabichos, challengePhrase: '¡Adelante mi súper bicho Pokémon!', defeatPhrase: 'Mis bichos...', rewardMoney: 20, teamSize: 3, weight: 20 }
  ],
  "Ruta 10": [
    { id: '4a8a46a2-fb0e-4ee0-aed2-f546695a382c', name: 'Pokemaníaco', sprite: TRAINER_SPRITES.pokemaniaco, challengePhrase: '¿Eres también un POKéMANÍACO? ¿Quieres ver mi colección?', defeatPhrase: '¡Qué! ¡No estoy enfadado!', rewardMoney: 130, teamSize: 3, weight: 33 },
    { id: '7741cfee-e54b-4407-806b-1aa50460d2a8', name: 'Dominguera', sprite: TRAINER_SPRITES.dominguera, challengePhrase: '¡Me siento débil tras la escalada!', defeatPhrase: '¡No tengo ganas!', rewardMoney: 50, teamSize: 2, weight: 34 },
    { id: 'a8bdfce1-3abd-4f31-86de-b4a5106b68d8', name: 'Montañero', sprite: TRAINER_SPRITES.montanero, challengePhrase: '¡Ah-ahah-ah-ah!', defeatPhrase: '¡Ah-ahah! ¡No me estoy riendo! ¡Es ah-ah-lergia! ¡Ahah-ah-chús!', rewardMoney: 40, teamSize: 2, weight: 33 }
  ],
  "Ruta 11": [
    { id: '14a3df72-63dc-4a6b-bebe-4487c8ef09ce', name: 'Comefuego', sprite: TRAINER_SPRITES.calvo, challengePhrase: '¡Cuidado con esos cables!', defeatPhrase: '¡Uaauu! ¡Vaya chispazo!', rewardMoney: 50, teamSize: 3, weight: 20 },
    { id: 'a9d51902-9cb7-4309-a737-7ef81fb13051', name: 'Policía', sprite: TRAINER_SPRITES.policia, challengePhrase: '¡Jajaja! ¡No he perdido nunca!', defeatPhrase: '¡La primera vez que pierdo!', rewardMoney: 70, teamSize: 2, weight: 40 },
    { id: 'baa9756c-7a8b-4d27-b780-0351060f20c8', name: 'Joven', sprite: TRAINER_SPRITES.joven, challengePhrase: '¡Soy el mejor de mi clase!', defeatPhrase: '¡Maldición! ¡Mis POKÉMON deben ser más fuertes!', rewardMoney: 40, teamSize: 3, weight: 40 }
  ],
  "Ruta 12": [
    { id: '37421a82-9a91-497f-a405-b3c165d44f0c', name: 'Rockero', sprite: TRAINER_SPRITES.rockero, challengePhrase: '¡Preferiría estar trabajando!', defeatPhrase: 'No es fácil...', rewardMoney: 60, teamSize: 2, weight: 15 },
    { id: '9c0cb1c8-e0d9-4369-8c6f-d41fdbb0cae2', name: 'Joven', sprite: TRAINER_SPRITES.joven, challengePhrase: '¡El Pescador Loco contra el Niño Pokémon!', defeatPhrase: '¡Eso fue demasiado!', rewardMoney: 60, teamSize: 2, weight: 14 },
    { id: 'a92d3e95-7b89-463d-84c8-215a61dcd59b', name: 'Pescador', sprite: TRAINER_SPRITES.pescador, challengePhrase: '¡Bien! ¡Ha picado algo!', defeatPhrase: '¡Bah! ¡Era muy pequeñajo!', rewardMoney: 40, teamSize: 4, weight: 71 }
  ],
  "Ruta 13": [
    { id: '00e56e26-0266-4c0e-a90d-68c02a1a3dd3', name: 'Dominguera', sprite: TRAINER_SPRITES.dominguera, challengePhrase: '¡Una vez encontré Carburante en una cueva!', defeatPhrase: '¡Lo hice fatal!', rewardMoney: 40, teamSize: 5, weight: 30 },
    { id: '199751e2-531c-4819-8a55-100170f5c5a5', name: 'Bella', sprite: TRAINER_SPRITES.bella, challengePhrase: '¡Claro que jugaré contigo!', defeatPhrase: '¡Oh! ¡Que bruto eres!', rewardMoney: 40, teamSize: 3, weight: 20 },
    { id: '9e276617-4d97-4802-bc33-8c7635a98608', name: 'Ornitólogo', sprite: TRAINER_SPRITES.ornitologo, challengePhrase: '¡Mis pájaros POKéMON quieren pelear!', defeatPhrase: '¿Perdió mi combinación de pájaros?', rewardMoney: 50, teamSize: 5, weight: 30 },
    { id: 'cfc7d2d8-2700-4be2-9cf0-17d0048b3fbc', name: 'Motorista', sprite: TRAINER_SPRITES.motorista, challengePhrase: '¿Y tú que miras?', defeatPhrase: '¡Vaya! ¡Derrape!', rewardMoney: 50, teamSize: 3, weight: 20 }
  ],
  "Ruta 14": [
    { id: '1a604c46-512c-4b0f-baaf-686f0ff75dc0', name: 'Motorista', sprite: TRAINER_SPRITES.motorista, challengePhrase: '¡Salimos por aquí porque hay más espacio!', defeatPhrase: '¡Aniquilado!', rewardMoney: 50, teamSize: 4, weight: 60 },
    { id: '78c6d66e-2ea4-4112-a3bb-a68b1af1a400', name: 'Ornitólogo', sprite: TRAINER_SPRITES.ornitologo, challengePhrase: 'Mis pájaros POKéMON deberían poder luchar.', defeatPhrase: '¡No estoy listo!', rewardMoney: 50, teamSize: 4, weight: 40 }
  ],
  "Ruta 15": [
    { id: '4c974c78-395f-4dd1-ba18-4cefcabf659c', name: 'Dominguera', sprite: TRAINER_SPRITES.dominguera, challengePhrase: '¡Pareces débil! ¡Creo que podría vencerte!', defeatPhrase: 'No, ¡muy mal!', rewardMoney: 40, teamSize: 3, weight: 40 },
    { id: '52689d7c-bf5e-4831-a011-7e58714552b2', name: 'Motorista', sprite: TRAINER_SPRITES.motorista, challengePhrase: '¡Oye! ¡Ven aquí! ¡Mira esto!', defeatPhrase: '¿Por qué no?', rewardMoney: 50, teamSize: 5, weight: 20 },
    { id: 'af6ef2f3-5700-46e3-9b88-3b15e3d8f4a8', name: 'Ornitólogo', sprite: TRAINER_SPRITES.ornitologo, challengePhrase: '¡Silbando puedo llamar a los pájaros Pokémon!', defeatPhrase: '¡Ooh! ¡Qué tragedia!', rewardMoney: 50, teamSize: 4, weight: 20 },
    { id: 'e88a1b26-917a-4468-af08-e25d1d03c8cd', name: 'Bella', sprite: TRAINER_SPRITES.bella, challengePhrase: '¡Déjame probar el Pokémon que acabo de cambiar!', defeatPhrase: '¡No fue suficiente!', rewardMoney: 50, teamSize: 2, weight: 20 }
  ],
  "Ruta 16": [
    { id: '157e38ad-df60-4905-891f-4733aafa1cce', name: 'Pokéfan', sprite: TRAINER_SPRITES.pokefan, challengePhrase: '¡Bonita bici! ¡Dámela!', defeatPhrase: '¡Fuera de combate!', rewardMoney: 60, teamSize: 3, weight: 50 },
    { id: '756b8a43-fbb0-446b-a048-91de89ae38bb', name: 'Motorista', sprite: TRAINER_SPRITES.motorista, challengePhrase: '¿Qué quieres?', defeatPhrase: '¡No oses reírte!', rewardMoney: 50, teamSize: 4, weight: 50 }
  ],
  "Ruta 17": [
    { id: '56040a29-86c6-4cd6-8936-0aa817109741', name: 'Motorista', sprite: TRAINER_SPRITES.motorista, challengePhrase: '¡Somos los Motoristas! ¡Las estrellas de la autopista!', defeatPhrase: '¡Ahumado!', rewardMoney: 50, teamSize: 5, weight: 50 },
    { id: 'a8d6e15f-8f21-4765-b873-265b8ef36ea1', name: 'Pokéfan', sprite: TRAINER_SPRITES.pokefan, challengePhrase: '¿Qué quieres chaval?', defeatPhrase: '¡Uauuu!', rewardMoney: 60, teamSize: 4, weight: 50 }
  ],
  "Ruta 18": [
    { id: '8d49ee2c-a482-43c7-b884-e098fd3e82cc', name: 'Ornitólogo', sprite: TRAINER_SPRITES.ornitologo, challengePhrase: 'Compruebo siempre las zonas de hierba alta en busca de nuevos Pokémon.', defeatPhrase: '¡Tch!', rewardMoney: 50, teamSize: 4, weight: 100 }
  ],
  "Ruta 19 (surf)": [
    { id: '425bbc48-3c9e-427b-8e57-975e2f98dc08', name: 'Bella', sprite: TRAINER_SPRITES.bella, challengePhrase: '¡Nadar es genial! ¡Pero quemarse al Sol no!', defeatPhrase: '¡Que horror!', rewardMoney: 40, teamSize: 5, weight: 30 },
    { id: '49593adc-21c5-48ec-8365-2fd8c02ebb3d', name: 'Nadador', sprite: TRAINER_SPRITES.nadador, challengePhrase: '¡Me gusta nadar! ¿Y a ti?', defeatPhrase: '¡Vaya planchazo!', rewardMoney: 50, teamSize: 5, weight: 70 }
  ],
  "Ruta 20 (surf)": [
    { id: '50dfc642-78a2-4193-b0c8-f48c1c78874e', name: 'Bella', sprite: TRAINER_SPRITES.bella, challengePhrase: 'Las Islas Espuma son una fácil salida.', defeatPhrase: '¡Déjalo ya!', rewardMoney: 40, teamSize: 3, weight: 37 },
    { id: '7ddc0adf-73b3-4776-aa2a-73064efab2ab', name: 'Nadador', sprite: TRAINER_SPRITES.nadador, challengePhrase: 'El agua es poco profunda aquí.', defeatPhrase: '¡Splash!', rewardMoney: 50, teamSize: 4, weight: 50 },
    { id: 'e7b4bde4-111b-44c9-beb6-cafe263f7379', name: 'Ornitólogo', sprite: TRAINER_SPRITES.ornitologo, challengePhrase: '¡Me subí en mi pájaro Pokémon!', defeatPhrase: '¡Oh no!', rewardMoney: 50, teamSize: 3, weight: 13 }
  ],
  "Ruta 21 (surf)": [
    { id: '07ed10cf-9d06-4df8-b575-36b5b48d0586', name: 'Pokéfan', sprite: TRAINER_SPRITES.pokefan, challengePhrase: '¿Qué quieres chaval?', defeatPhrase: '¡Uauuu!', rewardMoney: 60, teamSize: 3, weight: 12 },
    { id: '2365da46-6e97-4b4d-8c49-bb8dcba64bfb', name: 'Nadador', sprite: TRAINER_SPRITES.nadador, challengePhrase: '¡Me gusta nadar! ¿Y a ti?', defeatPhrase: '¡Vaya planchazo!', rewardMoney: 50, teamSize: 3, weight: 44 },
    { id: '8c6f37b5-71c6-485e-8c76-892fb08480a6', name: 'Pescador', sprite: TRAINER_SPRITES.pescador, challengePhrase: '¡Quería un Pokémon y he pescado a alguien que los entrena!', defeatPhrase: '¡Se me ha roto el sedal!', rewardMoney: 40, teamSize: 6, weight: 44 }
  ],
  "Ruta 24": [
    { id: '18164bec-41fb-4fa0-ab00-2d56166d617d', name: 'Soldado Rocket', sprite: TRAINER_SPRITES.soldado_rocket, challengePhrase: '¿Te gustaría unirte al Team Rocket?', defeatPhrase: '¡Arrgh! ¡Eres bueno!', rewardMoney: 50, teamSize: 2, weight: 17 },
    { id: '333e752c-047e-4f3f-bf72-c60e09734c5b', name: 'Campista', sprite: TRAINER_SPRITES.campista, challengePhrase: '¡Me encanta acampar con mis Pokémon!', defeatPhrase: '¡Impresionante!', rewardMoney: 40, teamSize: 2, weight: 17 },
    { id: '3c61b1bb-5775-44ac-b6a4-532e0d5f9a6c', name: 'Joven', sprite: TRAINER_SPRITES.joven, challengePhrase: '¡Estoy entrenando para ser el mejor!', defeatPhrase: '¡No puede ser!', rewardMoney: 20, teamSize: 2, weight: 17 },
    { id: '92670da1-58d7-4383-9d3e-4c7d0d8bfa41', name: 'Cazabichos', sprite: TRAINER_SPRITES.cazabichos, challengePhrase: '¡Éste es el Puente Pepita!', defeatPhrase: '¡Hice todo lo que pude!', rewardMoney: 10, teamSize: 2, weight: 17 },
    { id: '291a9955-aab1-4990-bcb9-29a00a1c6234', name: 'Chica', sprite: TRAINER_SPRITES.chica, challengePhrase: '¡Yo soy la 2a.!', defeatPhrase: '¡Uau! ¡Bien jugado!', rewardMoney: 20, teamSize: 2, weight: 32 }
  ],
  "Ruta 25": [
    { id: '0793ef3a-b6ee-4b78-bc91-4df5af5ac9e9', name: 'Chica', sprite: TRAINER_SPRITES.chica, challengePhrase: '¡Hola! ¡Mi chico es genial!', defeatPhrase: '¡No estaba en muy buena forma!', rewardMoney: 20, teamSize: 3, weight: 22 },
    { id: '2103a51b-f981-482c-b28a-c554b8a890d0', name: 'Campista', sprite: TRAINER_SPRITES.campista, challengePhrase: 'Soy un buen chico. ¡Y tengo novia!', defeatPhrase: 'Maldición...', rewardMoney: 30, teamSize: 2, weight: 12 },
    { id: 'cf13a687-d151-44ac-b856-f65564c06d32', name: 'Montañero', sprite: TRAINER_SPRITES.montanero, challengePhrase: '¡Acabo de bajar del Mt. Moon, pero estoy listo!', defeatPhrase: '¡Has trabajado duramente!', rewardMoney: 50, teamSize: 4, weight: 33 },
    { id: 'd2a3f4cd-0e87-4a92-be2d-00f7f41b9c12', name: 'Joven', sprite: TRAINER_SPRITES.joven, challengePhrase: '¡Los entrenadores locales vienen aquí a practicar!', defeatPhrase: 'Eres bastante bueno.', rewardMoney: 20, teamSize: 2, weight: 33 }
  ]
};
