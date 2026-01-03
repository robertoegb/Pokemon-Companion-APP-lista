
import { NPC } from './types';
import { TRAINER_SPRITES } from './data';

export const ZONE_NPC_ROUTES_1_12: Record<string, NPC[]> = {
  "Ruta 3": [
    { id: '19bc8d72-8bfc-4bd2-897d-d09bbe54be94', name: 'Chica', sprite: TRAINER_SPRITES.chica, challengePhrase: 'Estabas mirándome ¿verdad?', defeatPhrase: '¡Eres muy malo!', rewardMoney: 10, teamSize: 3, weight: 38 },
    { id: 'affd8107-81bc-4c24-8d95-3bf381ba1895', name: 'Joven', sprite: TRAINER_SPRITES.joven, challengePhrase: '¡Hola! ¡Me gustan los pantalones cortos!', defeatPhrase: '¡Perdí! ¡Perdí!', rewardMoney: 20, teamSize: 3, weight: 26 },
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
  ]
};
