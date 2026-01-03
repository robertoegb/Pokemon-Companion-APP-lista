
import { NPC } from './types';
import { TRAINER_SPRITES } from './data';
import { ZONE_NPC_ROUTES } from './zoneNpcData_routes';

/**
 * Registro unificado de equipos Pokémon por ID de instancia de NPC (zona_npc_id).
 * Estructura plana para evitar errores de mapeo entre plantas/subzonas.
 */
export const ZONE_NPC_REGISTRY: Record<string, NPC[]> = {
  ...ZONE_NPC_ROUTES,
  "Bosque Verde": [
    { id: '051e937a-02f7-4cd5-9c0e-bb8754880c03', name: 'Cazabichos', sprite: TRAINER_SPRITES.cazabichos, challengePhrase: '¡Quiero ser el mejor! ¡No podrás vencerme!', defeatPhrase: 'Lo intenté...', rewardMoney: 10, teamSize: 4, weight: 70 },
    { id: '6d9bb6b6-a10d-4b92-b08c-3c8c034c0bcc', name: 'Chica', sprite: TRAINER_SPRITES.chica, challengePhrase: '¡Hola! ¿Tienes un Pikachu?', defeatPhrase: '¿De verdad?', rewardMoney: 10, teamSize: 2, weight: 30 }
  ],
  "Mt. Moon": [
    { id: '20bd5c6a-5c55-472b-9f0a-db4d67d4bee8', name: 'Cazabichos', sprite: TRAINER_SPRITES.cazabichos, challengePhrase: '¡Vamos allá! ¡A ver qué puedes hacer!', defeatPhrase: '¡Me has vencido!', rewardMoney: 10, teamSize: 4, weight: 18 },
    { id: '2a69422c-f1de-4a5e-b94d-4226e67dbb8c', name: 'Chica', sprite: TRAINER_SPRITES.chica, challengePhrase: '¿Qué? Estoy esperando aquí a mis amigos.', defeatPhrase: '¡Me has ganado!', rewardMoney: 20, teamSize: 3, weight: 18 },
    { id: '4f23a114-85e6-4c83-a285-362a01b30eb5', name: 'Montañero', sprite: TRAINER_SPRITES.montanero, challengePhrase: '¡Las rocas son mis favoritas!', defeatPhrase: '¡Has trabajado duramente!', rewardMoney: 40, teamSize: 2, weight: 10 },
    { id: 'c14fdded-ed71-4e81-9268-53dbefc712a5', name: 'Supernecio', sprite: TRAINER_SPRITES.supernecio, challengePhrase: '¡Eh! ¡No te pases conmigo!', defeatPhrase: '¡Mis Pokémon no lo han conseguido!', rewardMoney: 30, teamSize: 2, weight: 18 },
    { id: 'db79757a-5bca-4599-a865-633c8fa1f569', name: 'Soldado Rocket', sprite: TRAINER_SPRITES.soldado_rocket, challengePhrase: '¡Alto! ¡Somos el Team Rocket!', defeatPhrase: '¡Maldición!', rewardMoney: 40, teamSize: 4, weight: 27 },
    { id: 'ff384c5a-5d5e-4125-b5aa-02a54419efd4', name: 'Joven', sprite: TRAINER_SPRITES.joven, challengePhrase: '¡Vamos a luchar!', defeatPhrase: '¡No puede ser!', rewardMoney: 20, teamSize: 2, weight: 9 }
  ],
  "Mt. Moon (Nivel -1)": [
    { id: 'cba42780-b7d3-46bb-976c-8de12a924ac0', name: 'Chica', sprite: TRAINER_SPRITES.chica, challengePhrase: '¡Hola!', defeatPhrase: '¡Me ganaste!', rewardMoney: 20, teamSize: 3, weight: 18 },
    { id: '89d79688-cd37-417b-a0bd-70ffb814a2b7', name: 'Cazabichos', sprite: TRAINER_SPRITES.cazabichos, challengePhrase: '¡Mira mis bichos!', defeatPhrase: '¡Ah!', rewardMoney: 10, teamSize: 4, weight: 18 },
    { id: 'e4697a4e-6f5b-431f-8419-d0de4b915343', name: 'Montañero', sprite: TRAINER_SPRITES.montanero, challengePhrase: '¡Rocas everywhere!', defeatPhrase: 'Uff.', rewardMoney: 40, teamSize: 2, weight: 10 },
    { id: '093121ed-7781-41da-8f68-08499647c5fc', name: 'Soldado Rocket', sprite: TRAINER_SPRITES.soldado_rocket, challengePhrase: '¡Buscamos fósiles!', defeatPhrase: '¡No!', rewardMoney: 40, teamSize: 5, weight: 27 },
    { id: '98c71ee0-2ed7-416c-add2-cde323a0c415', name: 'Joven', sprite: TRAINER_SPRITES.joven, challengePhrase: '¡A luchar!', defeatPhrase: 'Perdí...', rewardMoney: 20, teamSize: 2, weight: 9 },
    { id: 'e82e1d69-9cf4-454d-b9a1-9c2f8e28993f', name: 'Supernecio', sprite: TRAINER_SPRITES.supernecio, challengePhrase: '¡No te pases conmigo!', defeatPhrase: 'Uff.', rewardMoney: 30, teamSize: 3, weight: 18 }
  ],
  "Mt. Moon (Nivel -2)": [
    { id: '0a7c8c56-9ad5-4961-be9c-11aa347fb551', name: 'Soldado Rocket', sprite: TRAINER_SPRITES.soldado_rocket, challengePhrase: '¡Fuera de aquí!', defeatPhrase: 'Maldita sea...', rewardMoney: 40, teamSize: 5, weight: 27 },
    { id: '3b671872-f248-4c88-946c-71b04827852b', name: 'Montañero', sprite: TRAINER_SPRITES.montanero, challengePhrase: '¡Mi excavación!', defeatPhrase: 'Has ganado.', rewardMoney: 40, teamSize: 2, weight: 10 },
    { id: '92026063-7d7a-4c67-aca7-7146194db9ed', name: 'Joven', sprite: TRAINER_SPRITES.joven, challengePhrase: '¡Eh, tú!', defeatPhrase: 'Increíble.', rewardMoney: 20, teamSize: 2, weight: 9 },
    { id: '9d19e155-4173-435b-8356-a356b2627cdb', name: 'Supernecio', sprite: TRAINER_SPRITES.supernecio, challengePhrase: '¡No tocarás mi botín!', defeatPhrase: '¡Tómalo todo!', rewardMoney: 30, teamSize: 3, weight: 18 },
    { id: 'beb64856-627b-48c9-aae1-766e3b453e1e', name: 'Cazabichos', sprite: TRAINER_SPRITES.cazabichos, challengePhrase: '¡Adelante!', defeatPhrase: 'Oh no...', rewardMoney: 10, teamSize: 4, weight: 18 },
    { id: '1523286f-9b14-4d38-9c3f-24def5cf6c6a', name: 'Chica', sprite: TRAINER_SPRITES.chica, challengePhrase: '¿Tienes un Clefairy?', defeatPhrase: '¡Qué mala suerte!', rewardMoney: 20, teamSize: 3, weight: 18 }
  ],
  "Túnel Roca": [
    { id: '7f97d2af-8756-4621-90ca-979844364cef', name: 'Montañero', sprite: TRAINER_SPRITES.montanero, challengePhrase: '¡Este túnel es oscuro!', defeatPhrase: '¡Veo la luz!', rewardMoney: 40, teamSize: 4, weight: 45 },
    { id: '3d4c7bfa-456e-4204-bce6-0ebb6ef709ee', name: 'Pokemaníaco', sprite: TRAINER_SPRITES.pokemaniaco, challengePhrase: '¡Pokémon raros por aquí!', defeatPhrase: '¡Mi colección!', rewardMoney: 50, teamSize: 2, weight: 25 },
    { id: '5fc91e86-3c95-42a8-abd5-06e8f80285fd', name: 'Dominguera', sprite: TRAINER_SPRITES.dominguera, challengePhrase: '¡No te pierdas!', defeatPhrase: 'Me perdí yo.', rewardMoney: 20, teamSize: 6, weight: 30 }
  ],
  "Túnel Roca (Nivel -1)": [
    { id: 'fd0f42cb-4b3a-4c78-b0d6-8b03dcffb7f7', name: 'Dominguera', sprite: TRAINER_SPRITES.dominguera, challengePhrase: '¡Cuidado con los murciélagos!', defeatPhrase: '¡Ay!', rewardMoney: 20, teamSize: 5, weight: 35 },
    { id: '7e980e74-04a3-41d9-870e-c72d5dc189b3', name: 'Pokemaníaco', sprite: TRAINER_SPRITES.pokemaniaco, challengePhrase: '¡No pases de aquí!', defeatPhrase: 'Bueno, pasa.', rewardMoney: 50, teamSize: 3, weight: 35 },
    { id: 'fa843bb0-0ffb-4bc2-b855-eb13c9e5bd5a', name: 'Montañero', sprite: TRAINER_SPRITES.montanero, challengePhrase: '¡Rocas duras!', defeatPhrase: '¡Tú más!', rewardMoney: 40, teamSize: 4, weight: 30 }
  ],
  "Torre Pokémon": [
    { id: '87468c71-fcb5-4fb2-9810-1869b9a3113c', name: 'Mentalista', sprite: TRAINER_SPRITES.mentalista, challengePhrase: '¡Fantasmas...', defeatPhrase: '¡Uuuh!', rewardMoney: 30, teamSize: 1, weight: 100 }
  ],
  "Torre Pokémon (Planta 2)": [
    { id: 'fc389ba3-167b-4504-99f9-12faca949abd', name: 'Mentalista', sprite: TRAINER_SPRITES.mentalista, challengePhrase: '¡Jejeje!', defeatPhrase: 'Mmm.', rewardMoney: 40, teamSize: 2, weight: 100 }
  ],
  "Torre Pokémon (Planta 3)": [
    { id: 'f2ac38cb-e33e-4b92-b28f-ea344a1add4a', name: 'Soldado Rocket', sprite: TRAINER_SPRITES.soldado_rocket, challengePhrase: '¡El Team Rocket manda!', defeatPhrase: '¡Reportaré esto!', rewardMoney: 40, teamSize: 6, weight: 100 }
  ],
  "S.S. Anne": [
    { id: 'fd46672a-5da2-4875-aa90-d8427c145f27', name: 'Pescador', sprite: TRAINER_SPRITES.pescador, challengePhrase: '¡Pescando en alta mar!', defeatPhrase: 'Vaya racha.', rewardMoney: 30, teamSize: 4, weight: 33 },
    { id: '9b3c94bb-e6aa-4a2b-a2c2-8e49d78b718c', name: 'Chica', sprite: TRAINER_SPRITES.chica, challengePhrase: '¡Qué gran barco!', defeatPhrase: 'Oh.', rewardMoney: 20, teamSize: 2, weight: 33 },
    { id: 'f16eed76-5445-43ae-bc42-1f1dd1f98854', name: 'Caballero', sprite: TRAINER_SPRITES.caballero, challengePhrase: '¡Un duelo formal!', defeatPhrase: 'Mis respetos.', rewardMoney: 100, teamSize: 3, weight: 34 }
  ],
  "S.S. Anne (Cubierta)": [
    { id: '7219114a-8b55-44d5-9d4c-03e9e039df23', name: 'Marinero', sprite: TRAINER_SPRITES.marinero, challengePhrase: '¡A limpiar!', defeatPhrase: 'Uff.', rewardMoney: 30, teamSize: 4, weight: 50 },
    { id: '397d9bff-bb0d-46db-8ee1-941ecf6cdcdc', name: 'Pescador', sprite: TRAINER_SPRITES.pescador, challengePhrase: '¡Mira lo que traigo!', defeatPhrase: 'Perdí.', rewardMoney: 30, teamSize: 4, weight: 50 }
  ],
  "S.S. Anne (Sótano)": [
    { id: '59a64d3e-e08e-47d4-b83a-86af89caa18d', name: 'Marinero', sprite: TRAINER_SPRITES.marinero, challengePhrase: '¡Zona restringida!', defeatPhrase: 'Vaya.', rewardMoney: 30, teamSize: 5, weight: 33 },
    { id: 'c8b07ee0-0278-49eb-a1f4-2961df1f5867', name: 'Caballero', sprite: TRAINER_SPRITES.caballero, challengePhrase: '¡Disculpa!', defeatPhrase: 'Buen juego.', rewardMoney: 100, teamSize: 4, weight: 33 },
    { id: 'd87cc8ba-9e59-46b6-b08b-18357c295bf2', name: 'Chica', sprite: TRAINER_SPRITES.chica, challengePhrase: '¡Hola!', defeatPhrase: 'Adiós.', rewardMoney: 20, teamSize: 1, weight: 34 }
  ],
  "Calle Victoria": [
    { id: '2cb8f732-3ae9-42f2-b451-20c527c86bb5', name: 'Entrenador Guay', sprite: TRAINER_SPRITES.entrenador_guay, challengePhrase: '¡Fuerza pura!', defeatPhrase: 'Increíble.', rewardMoney: 80, teamSize: 4, weight: 40 },
    { id: '626f1dda-7742-4388-99e7-e071c5a30ab2', name: 'Entrenadora Guay', sprite: TRAINER_SPRITES.entrenadora_guay, challengePhrase: '¡Mi equipo!', defeatPhrase: 'Perdí.', rewardMoney: 80, teamSize: 2, weight: 30 },
    { id: '3399f2d4-e3c0-4285-ae89-c8ae5ee761db', name: 'Comefuego', sprite: TRAINER_SPRITES.calvo, challengePhrase: '¡Quema!', defeatPhrase: 'Apagado.', rewardMoney: 60, teamSize: 2, weight: 30 }
  ],
  "Calle Victoria (Nivel 2)": [
    { id: '8a62a1bd-4c35-4115-ab39-ab5c71e7609f', name: 'Entrenadora Guay', sprite: TRAINER_SPRITES.entrenadora_guay, challengePhrase: '¡Técnica!', defeatPhrase: 'Uff.', rewardMoney: 80, teamSize: 5, weight: 30 },
    { id: '14f26666-1e0f-4f62-b08a-caf5bcf1de15', name: 'Entrenador Guay', sprite: TRAINER_SPRITES.entrenador_guay, challengePhrase: '¡Valor!', defeatPhrase: 'Digno.', rewardMoney: 80, teamSize: 6, weight: 30 },
    { id: 'a0b7c68b-634c-4167-bd20-593fb73b7213', name: 'Karateka', sprite: TRAINER_SPRITES.karateca, challengePhrase: '¡KIAAA!', defeatPhrase: 'Buen golpe.', rewardMoney: 50, teamSize: 2, weight: 20 },
    { id: '759ab873-43fd-4f7e-8fdc-1dc78b7b5076', name: 'Malabarista', sprite: TRAINER_SPRITES.malabarista, challengePhrase: '¡Truco!', defeatPhrase: 'Fallé.', rewardMoney: 40, teamSize: 3, weight: 20 }
  ],
  "Calle Victoria (Nivel 3)": [
    { id: '41fd3f5d-ea63-455a-a015-dbe9d34d2d16', name: 'Entrenador Guay', sprite: TRAINER_SPRITES.entrenador_guay, challengePhrase: '¡Final!', defeatPhrase: 'Casi...', rewardMoney: 90, teamSize: 6, weight: 25 },
    { id: '93038fc4-74a0-4b10-a037-404be6928422', name: 'Malabarista', sprite: TRAINER_SPRITES.malabarista, challengePhrase: '¡Mírame!', defeatPhrase: 'Confuso.', rewardMoney: 50, teamSize: 4, weight: 20 },
    { id: '8f0f5dcb-6687-40a4-9a70-3eca3915b353', name: 'Comefuego', sprite: TRAINER_SPRITES.calvo, challengePhrase: '¡Fuego!', defeatPhrase: 'Caliente.', rewardMoney: 70, teamSize: 3, weight: 20 },
    { id: '913b67f2-a4dd-4163-81bc-22a00c99ebab', name: 'Entrenadora Guay', sprite: TRAINER_SPRITES.entrenadora_guay, challengePhrase: '¡Lista!', defeatPhrase: '¡Wow!', rewardMoney: 90, teamSize: 5, weight: 20 },
    { id: 'c9fc5e4c-3569-40ae-9e9f-c5098e28ec61', name: 'Karateka', sprite: TRAINER_SPRITES.karateca, challengePhrase: '¡Fuerza!', defeatPhrase: 'Técnica.', rewardMoney: 60, teamSize: 3, weight: 15 }
  ],
  "Silph S.A.": [
    { id: '005a0fe2-1faa-483d-8d2c-272f416ac64f', name: 'Científico', sprite: TRAINER_SPRITES.cientifico, challengePhrase: '¡Secretos!', defeatPhrase: '¡Mis datos!', rewardMoney: 60, teamSize: 7, weight: 50 },
    { id: 'ceb56bee-0957-48d3-9ad5-70ef57e4cce4', name: 'Soldado Rocket', sprite: TRAINER_SPRITES.soldado_rocket, challengePhrase: '¡Fuera!', defeatPhrase: 'Argh.', rewardMoney: 40, teamSize: 5, weight: 50 }
  ],
  "Silph S.A. (piso 2)": [
    { id: 'dad0b1f4-00dd-4b62-9f12-822eb9f63ff6', name: 'Soldado Rocket', sprite: TRAINER_SPRITES.soldado_rocket, challengePhrase: '¡Control!', defeatPhrase: '¡No!', rewardMoney: 40, teamSize: 7, weight: 40 },
    { id: '39e6bf37-1b5a-4dbe-9cff-9abe48d27fb9', name: 'Malabarista', sprite: TRAINER_SPRITES.malabarista, challengePhrase: '¡Atención!', defeatPhrase: 'Oh.', rewardMoney: 40, teamSize: 2, weight: 30 },
    { id: '8f827751-48a0-4f2b-8ef7-c1e69e0abcd6', name: 'Científico', sprite: TRAINER_SPRITES.cientifico, challengePhrase: '¡Investigación!', defeatPhrase: 'Error.', rewardMoney: 60, teamSize: 5, weight: 30 }
  ],
  "Silph S.A. (piso 3)": [
    { id: '976c037c-6f41-48a3-b456-64e8a45671a0', name: 'Científico', sprite: TRAINER_SPRITES.cientifico, challengePhrase: '¡Pruebas!', defeatPhrase: 'Uff.', rewardMoney: 60, teamSize: 6, weight: 50 },
    { id: 'e85cf762-5167-40a2-8784-7e9fad68e5b7', name: 'Soldado Rocket', sprite: TRAINER_SPRITES.soldado_rocket, challengePhrase: '¡Paso!', defeatPhrase: '¡Rayos!', rewardMoney: 40, teamSize: 10, weight: 50 }
  ],
  "Silph S.A. (piso 4)": [
    { id: 'b15216b7-f4c0-428e-94d2-a03770fa765f', name: 'Soldado Rocket', sprite: TRAINER_SPRITES.soldado_rocket, challengePhrase: '¡Alto!', defeatPhrase: 'Ah.', rewardMoney: 40, teamSize: 7, weight: 50 },
    { id: '8a272e26-af89-4605-a61a-67dce98d936f', name: 'Científico', sprite: TRAINER_SPRITES.cientifico, challengePhrase: '¡Ciencia!', defeatPhrase: 'Nooo.', rewardMoney: 60, teamSize: 5, weight: 50 }
  ],
  "Mansión Pokémon": [
    { id: 'bb529352-93fc-45bb-b305-4369a3dd57e7', name: 'Científico', sprite: TRAINER_SPRITES.cientifico, challengePhrase: '¿Qué buscas?', defeatPhrase: '¡Fuerte!', rewardMoney: 70, teamSize: 3, weight: 50 },
    { id: 'c60a07dd-c572-4a6c-89f0-bb57ea330eb3', name: 'Ladrón', sprite: TRAINER_SPRITES.ladron, challengePhrase: '¡Es mío!', defeatPhrase: '¡Auch!', rewardMoney: 50, teamSize: 2, weight: 50 }
  ],
  "Mansión Pokémon (Planta 2)": [
    { id: '3b2c0d26-4bfe-491a-a9c2-793d48d21d1b', name: 'Ladrón', sprite: TRAINER_SPRITES.ladron, challengePhrase: '¡Nada!', defeatPhrase: 'Rayos.', rewardMoney: 50, teamSize: 2, weight: 50 },
    { id: '9ca9842d-2ffc-4967-93d5-ba2e604c686b', name: 'Científico', sprite: TRAINER_SPRITES.cientifico, challengePhrase: '¡Experimento!', defeatPhrase: 'Perdí.', rewardMoney: 70, teamSize: 2, weight: 50 }
  ],
  "Mansión Pokémon (Sótano)": [
    { id: 'b444b592-e61f-4833-907e-8318e7c5eb6e', name: 'Científico', sprite: TRAINER_SPRITES.cientifico, challengePhrase: '¡Origen!', defeatPhrase: 'Wow.', rewardMoney: 70, teamSize: 4, weight: 50 },
    { id: 'a83a18cb-5f41-4ad2-9ebc-502eb0f655f7', name: 'Ladrón', sprite: TRAINER_SPRITES.ladron, challengePhrase: '¡Joyas!', defeatPhrase: 'Vaya.', rewardMoney: 50, teamSize: 4, weight: 50 }
  ],
  "Guarida Rocket (sub 1)": [
    { id: '13f1a412-bdc3-4a25-a3d1-31d39bc73662', name: 'Soldado Rocket', sprite: TRAINER_SPRITES.soldado_rocket, challengePhrase: '¡Has destrozado nuestros planes!', defeatPhrase: '¡Chamuscado!', rewardMoney: 40, teamSize: 5, weight: 50 }
  ],
  "Guarida Rocket (sub 2)": [
    { id: '7b8c947a-2c57-4c2d-acbc-a98b14866f05', name: 'Soldado Rocket', sprite: TRAINER_SPRITES.soldado_rocket, challengePhrase: '¡Nos dijeron desde arriba que venías!', defeatPhrase: '¿Qué? ¿He perdido? ¡No!', rewardMoney: 40, teamSize: 5, weight: 50 }
  ],
  "Guarida Rocket (sub 3)": [
    { id: '3a1c9af6-e0fd-465b-a667-8f31fc29985c', name: 'Soldado Rocket', sprite: TRAINER_SPRITES.soldado_rocket, challengePhrase: '¡El Jefe me dijo que se pueden ver los fantasmas con el Scope Silph!', defeatPhrase: '¡Me rindo!', rewardMoney: 40, teamSize: 5, weight: 50 }
  ],
};
