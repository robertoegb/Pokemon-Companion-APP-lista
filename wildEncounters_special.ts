
import { EncounterEntry } from './types';

export const WILD_SPECIAL: Record<string, EncounterEntry[]> = {
  // === BOSQUE VERDE ===
  "Bosque Verde": [
    { pokemonId: 10, minLevel: 3, maxLevel: 6, weight: 30 }, // Caterpie
    { pokemonId: 13, minLevel: 3, maxLevel: 6, weight: 30 }, // Weedle
    { pokemonId: 25, minLevel: 3, maxLevel: 5, weight: 6 },  // Pikachu
    { pokemonId: 17, minLevel: 9, maxLevel: 9, weight: 4 },  // Pidgeotto
    { pokemonId: 16, minLevel: 3, maxLevel: 6, weight: 10 }, // Pidgey
    { pokemonId: 11, minLevel: 4, maxLevel: 4, weight: 10 }, // Metapod
    { pokemonId: 14, minLevel: 4, maxLevel: 4, weight: 10 }  // Kakuna
  ],

  // === CUEVA DIGLETT ===
  "Cueva Diglett": [
    { pokemonId: 50, minLevel: 15, maxLevel: 22, weight: 90 }, // Diglett
    { pokemonId: 51, minLevel: 29, maxLevel: 31, weight: 10 }  // Dugtrio
  ],

  // === MT. MOON ===
  "Mt. Moon": [
    { pokemonId: 41, minLevel: 6, maxLevel: 11, weight: 75 },
    { pokemonId: 74, minLevel: 8, maxLevel: 10, weight: 18 },
    { pokemonId: 46, minLevel: 8, maxLevel: 8, weight: 3 },
    { pokemonId: 35, minLevel: 8, maxLevel: 11, weight: 1 },
    { pokemonId: 27, minLevel: 12, maxLevel: 12, weight: 3 }
  ],
  "Mt. Moon (Nivel -1)": [
    { pokemonId: 74, minLevel: 10, maxLevel: 11, weight: 20 },
    { pokemonId: 35, minLevel: 10, maxLevel: 12, weight: 5 },
    { pokemonId: 46, minLevel: 9, maxLevel: 11, weight: 10 },
    { pokemonId: 41, minLevel: 8, maxLevel: 11, weight: 65 }
  ],
  "Mt. Moon (Nivel -2)": [
    { pokemonId: 35, minLevel: 9, maxLevel: 13, weight: 10 },
    { pokemonId: 46, minLevel: 13, maxLevel: 13, weight: 15 },
    { pokemonId: 74, minLevel: 11, maxLevel: 11, weight: 15 },
    { pokemonId: 41, minLevel: 10, maxLevel: 13, weight: 60 }
  ],

  // === TÚNEL ROCA ===
  "Túnel Roca": [
    { pokemonId: 66, minLevel: 15, maxLevel: 21, weight: 12 },
    { pokemonId: 74, minLevel: 16, maxLevel: 20, weight: 30 },
    { pokemonId: 95, minLevel: 13, maxLevel: 15, weight: 3 },
    { pokemonId: 41, minLevel: 15, maxLevel: 21, weight: 55 }
  ],
  "Túnel Roca (Nivel -1)": [
    { pokemonId: 95, minLevel: 14, maxLevel: 22, weight: 10 },
    { pokemonId: 74, minLevel: 17, maxLevel: 21, weight: 25 },
    { pokemonId: 66, minLevel: 18, maxLevel: 20, weight: 20 },
    { pokemonId: 41, minLevel: 20, maxLevel: 22, weight: 45 }
  ],

  // === TORRE POKÉMON ===
  "Torre Pokémon": [
    { pokemonId: 104, minLevel: 20, maxLevel: 22, weight: 5 },
    { pokemonId: 93, minLevel: 20, maxLevel: 25, weight: 10 },
    { pokemonId: 92, minLevel: 18, maxLevel: 25, weight: 85 }
  ],
  "Torre Pokémon (Planta 2)": [
    { pokemonId: 93, minLevel: 20, maxLevel: 25, weight: 5 },
    { pokemonId: 104, minLevel: 20, maxLevel: 22, weight: 5 },
    { pokemonId: 92, minLevel: 18, maxLevel: 25, weight: 90 }
  ],
  "Torre Pokémon (Planta 3)": [
    { pokemonId: 92, minLevel: 20, maxLevel: 29, weight: 82 },
    { pokemonId: 104, minLevel: 22, maxLevel: 24, weight: 8 },
    { pokemonId: 93, minLevel: 24, maxLevel: 30, weight: 10 }
  ],

  // === ISLAS ESPUMA ===
  "Islas Espuma": [
    { pokemonId: 41, minLevel: 9, maxLevel: 36, weight: 15 },
    { pokemonId: 120, minLevel: 28, maxLevel: 30, weight: 8 },
    { pokemonId: 116, minLevel: 28, maxLevel: 30, weight: 9 },
    { pokemonId: 80, minLevel: 38, maxLevel: 38, weight: 1 },
    { pokemonId: 42, minLevel: 29, maxLevel: 36, weight: 5 },
    { pokemonId: 90, minLevel: 28, maxLevel: 30, weight: 8 },
    { pokemonId: 86, minLevel: 30, maxLevel: 30, weight: 10 },
    { pokemonId: 54, minLevel: 28, maxLevel: 30, weight: 10 },
    { pokemonId: 79, minLevel: 28, maxLevel: 30, weight: 13 },
    { pokemonId: 55, minLevel: 38, maxLevel: 38, weight: 1 },
    { pokemonId: 98, minLevel: 25, maxLevel: 30, weight: 20 }
  ],
  "Islas Espuma (caña vieja)": [
    { pokemonId: 129, minLevel: 5, maxLevel: 5, weight: 100 }
  ],
  "Islas Espuma (caña buena)": [
    { pokemonId: 60, minLevel: 10, maxLevel: 10, weight: 50 },
    { pokemonId: 118, minLevel: 10, maxLevel: 10, weight: 50 }
  ],
  "Islas Espuma (supercaña)": [
    { pokemonId: 116, minLevel: 15, maxLevel: 15, weight: 12 },
    { pokemonId: 118, minLevel: 15, maxLevel: 15, weight: 12 },
    { pokemonId: 98, minLevel: 25, maxLevel: 25, weight: 24 },
    { pokemonId: 90, minLevel: 15, maxLevel: 15, weight: 12 },
    { pokemonId: 99, minLevel: 35, maxLevel: 35, weight: 10 },
    { pokemonId: 120, minLevel: 15, maxLevel: 40, weight: 30 }
  ],
  "Islas Espuma (surf)": [
    { pokemonId: 120, minLevel: 30, maxLevel: 30, weight: 35 },
    { pokemonId: 72, minLevel: 30, maxLevel: 40, weight: 55 },
    { pokemonId: 73, minLevel: 35, maxLevel: 40, weight: 10 }
    ],
  "Islas Espuma (Nivel -1)": [
    { pokemonId: 116, minLevel: 30, maxLevel: 32, weight: 9 },
    { pokemonId: 99, minLevel: 28, maxLevel: 37, weight: 2 },
    { pokemonId: 117, minLevel: 37, maxLevel: 37, weight: 2 },
    { pokemonId: 41, minLevel: 18, maxLevel: 36, weight: 9 },
    { pokemonId: 98, minLevel: 26, maxLevel: 32, weight: 15 },
    { pokemonId: 42, minLevel: 27, maxLevel: 27, weight: 3 },
    { pokemonId: 79, minLevel: 28, maxLevel: 30, weight: 9 },
    { pokemonId: 54, minLevel: 28, maxLevel: 30, weight: 9 },
    { pokemonId: 87, minLevel: 38, maxLevel: 38, weight: 2 },
    { pokemonId: 90, minLevel: 30, maxLevel: 30, weight: 15 },
    { pokemonId: 86, minLevel: 22, maxLevel: 30, weight: 10 }
  ],
  "Islas Espuma (Nivel -2)": [
    { pokemonId: 42, minLevel: 27, maxLevel: 36, weight: 5 },
    { pokemonId: 98, minLevel: 27, maxLevel: 30, weight: 11 },
    { pokemonId: 99, minLevel: 28, maxLevel: 28, weight: 2 },
    { pokemonId: 54, minLevel: 30, maxLevel: 32, weight: 10 },
    { pokemonId: 86, minLevel: 24, maxLevel: 32, weight: 18 },
    { pokemonId: 120, minLevel: 28, maxLevel: 30, weight: 10 },
    { pokemonId: 41, minLevel: 27, maxLevel: 36, weight: 10 },
    { pokemonId: 90, minLevel: 28, maxLevel: 30, weight: 8 },
    { pokemonId: 80, minLevel: 31, maxLevel: 37, weight: 2 },
    { pokemonId: 79, minLevel: 30, maxLevel: 32, weight: 12 },
    { pokemonId: 55, minLevel: 37, maxLevel: 37, weight: 2 },
    { pokemonId: 116, minLevel: 28, maxLevel: 30, weight: 10 }
  ],
  "Islas Espuma (Nivel -3)": [
    { pokemonId: 99, minLevel: 30, maxLevel: 39, weight: 3 },
    { pokemonId: 117, minLevel: 39, maxLevel: 39, weight: 2 },
    { pokemonId: 54, minLevel: 31, maxLevel: 33, weight: 14 },
    { pokemonId: 86, minLevel: 26, maxLevel: 33, weight: 18 },
    { pokemonId: 90, minLevel: 29, maxLevel: 31, weight: 8 },
    { pokemonId: 120, minLevel: 29, maxLevel: 31, weight: 8 },
    { pokemonId: 116, minLevel: 29, maxLevel: 31, weight: 8 },
    { pokemonId: 98, minLevel: 29, maxLevel: 31, weight: 12 },
    { pokemonId: 41, minLevel: 27, maxLevel: 36, weight: 5 },
    { pokemonId: 42, minLevel: 27, maxLevel: 27, weight: 5 },
    { pokemonId: 87, minLevel: 28, maxLevel: 37, weight: 3 },
    { pokemonId: 79, minLevel: 31, maxLevel: 33, weight: 14 }
  ],
  "Islas Espuma (Nivel -4)": [
    { pokemonId: 116, minLevel: 31, maxLevel: 33, weight: 14 },
    { pokemonId: 98, minLevel: 30, maxLevel: 33, weight: 17 },
    { pokemonId: 90, minLevel: 31, maxLevel: 33, weight: 12 },
    { pokemonId: 120, minLevel: 31, maxLevel: 33, weight: 12 },
    { pokemonId: 79, minLevel: 29, maxLevel: 31, weight: 8 },
    { pokemonId: 54, minLevel: 29, maxLevel: 31, weight: 8 },
    { pokemonId: 86, minLevel: 28, maxLevel: 32, weight: 14 },
    { pokemonId: 41, minLevel: 27, maxLevel: 36, weight: 3 },
    { pokemonId: 42, minLevel: 27, maxLevel: 36, weight: 4 },
    { pokemonId: 99, minLevel: 32, maxLevel: 32, weight: 2 },
    { pokemonId: 80, minLevel: 39, maxLevel: 39, weight: 2 },
    { pokemonId: 55, minLevel: 39, maxLevel: 39, weight: 2 },
    { pokemonId: 87, minLevel: 30, maxLevel: 34, weight: 2 }
  ],

  // === CALLE VICTORIA ===
  "Calle Victoria": [
    { pokemonId: 75, minLevel: 43, maxLevel: 44, weight: 6 },
    { pokemonId: 41, minLevel: 26, maxLevel: 44, weight: 12 },
    { pokemonId: 95, minLevel: 36, maxLevel: 47, weight: 20 },
    { pokemonId: 67, minLevel: 39, maxLevel: 42, weight: 5 },
    { pokemonId: 105, minLevel: 40, maxLevel: 40, weight: 4 },
    { pokemonId: 42, minLevel: 39, maxLevel: 40, weight: 8 },
    { pokemonId: 66, minLevel: 22, maxLevel: 22, weight: 10 },
    { pokemonId: 74, minLevel: 24, maxLevel: 41, weight: 35 }
  ],
  "Calle Victoria (Nivel 2)": [
    { pokemonId: 41, minLevel: 26, maxLevel: 26, weight: 8 },
    { pokemonId: 95, minLevel: 36, maxLevel: 49, weight: 15 },
    { pokemonId: 75, minLevel: 41, maxLevel: 47, weight: 8 },
    { pokemonId: 49, minLevel: 40, maxLevel: 40, weight: 5 },
    { pokemonId: 74, minLevel: 24, maxLevel: 46, weight: 32 },
    { pokemonId: 67, minLevel: 41, maxLevel: 45, weight: 8 },
    { pokemonId: 42, minLevel: 40, maxLevel: 44, weight: 10 },
    { pokemonId: 66, minLevel: 22, maxLevel: 22, weight: 10 },
    { pokemonId: 105, minLevel: 40, maxLevel: 40, weight: 4 }
  ],
  "Calle Victoria (Nivel 3)": [
    { pokemonId: 66, minLevel: 24, maxLevel: 24, weight: 10 },
    { pokemonId: 42, minLevel: 41, maxLevel: 41, weight: 3 },
    { pokemonId: 105, minLevel: 43, maxLevel: 43, weight: 1 },
    { pokemonId: 75, minLevel: 41, maxLevel: 47, weight: 5 },
    { pokemonId: 45, minLevel: 36, maxLevel: 45, weight: 20 },
    { pokemonId: 41, minLevel: 22, maxLevel: 44, weight: 18 },
    { pokemonId: 74, minLevel: 26, maxLevel: 41, weight: 40 },
    { pokemonId: 67, minLevel: 42, maxLevel: 42, weight: 3 }
  ],

  // === CUEVA CELESTE ===
  "Cueva Celeste": [
    { pokemonId: 26, minLevel: 53, maxLevel: 64, weight: 1 },
    { pokemonId: 40, minLevel: 54, maxLevel: 54, weight: 2 },
    { pokemonId: 42, minLevel: 46, maxLevel: 59, weight: 30 },
    { pokemonId: 65, minLevel: 49, maxLevel: 51, weight: 6 },
    { pokemonId: 112, minLevel: 52, maxLevel: 62, weight: 8 },
    { pokemonId: 28, minLevel: 52, maxLevel: 57, weight: 1 },
    { pokemonId: 101, minLevel: 52, maxLevel: 55, weight: 5 },
    { pokemonId: 75, minLevel: 45, maxLevel: 55, weight: 6 },
    { pokemonId: 24, minLevel: 52, maxLevel: 57, weight: 1 },
    { pokemonId: 113, minLevel: 56, maxLevel: 64, weight: 7 },
    { pokemonId: 105, minLevel: 52, maxLevel: 55, weight: 5 },
    { pokemonId: 111, minLevel: 50, maxLevel: 52, weight: 4 },
    { pokemonId: 85, minLevel: 49, maxLevel: 51, weight: 5 },
    { pokemonId: 47, minLevel: 52, maxLevel: 64, weight: 3 },
    { pokemonId: 132, minLevel: 53, maxLevel: 67, weight: 10 },
    { pokemonId: 97, minLevel: 46, maxLevel: 46, weight: 2 },
    { pokemonId: 49, minLevel: 49, maxLevel: 54, weight: 3 },
    { pokemonId: 108, minLevel: 50, maxLevel: 55, weight: 1 }
  ],
  "Cueva Celeste (caña vieja)": [
    { pokemonId: 129, minLevel: 5, maxLevel: 5, weight: 100 }
  ],
  "Cueva Celeste (caña buena)": [
    { pokemonId: 60, minLevel: 10, maxLevel: 10, weight: 50 },
    { pokemonId: 118, minLevel: 10, maxLevel: 10, weight: 50 }
  ],
  "Cueva Celeste (supercaña)": [
    { pokemonId: 117, minLevel: 23, maxLevel: 23, weight: 10 }, // Seadra
    { pokemonId: 99, minLevel: 23, maxLevel: 23, weight: 15 }, // Kingler
    { pokemonId: 119, minLevel: 23, maxLevel: 60, weight: 40 }, // Seaking
    { pokemonId: 80, minLevel: 23, maxLevel: 23, weight: 15 }, // Slowbro
    { pokemonId: 118, minLevel: 25, maxLevel: 30, weight: 20 }  // Goldeen
  ],

  // === CENTRAL ELÉCTRICA ===
  "Central Eléctrica": [
    { pokemonId: 125, minLevel: 33, maxLevel: 36, weight: 5 },
    { pokemonId: 26, minLevel: 33, maxLevel: 36, weight: 5 },
    { pokemonId: 82, minLevel: 32, maxLevel: 38, weight: 15 },
    { pokemonId: 88, minLevel: 33, maxLevel: 37, weight: 8 },
    { pokemonId: 25, minLevel: 20, maxLevel: 24, weight: 10 },
    { pokemonId: 100, minLevel: 21, maxLevel: 37, weight: 25 },
    { pokemonId: 81, minLevel: 21, maxLevel: 35, weight: 30 },
    { pokemonId: 89, minLevel: 33, maxLevel: 37, weight: 2 }
  ],

  // === MANSIÓN POKÉMON ===
  "Mansión Pokémon": [
    { pokemonId: 37, minLevel: 34, maxLevel: 34, weight: 5 },
    { pokemonId: 77, minLevel: 28, maxLevel: 34, weight: 20 },
    { pokemonId: 19, minLevel: 34, maxLevel: 37, weight: 12 },
    { pokemonId: 58, minLevel: 26, maxLevel: 38, weight: 10 },
    { pokemonId: 88, minLevel: 23, maxLevel: 32, weight: 22 },
    { pokemonId: 110, minLevel: 32, maxLevel: 39, weight: 3 },
    { pokemonId: 20, minLevel: 34, maxLevel: 37, weight: 10 },
    { pokemonId: 109, minLevel: 30, maxLevel: 32, weight: 15 }
  ],
  "Mansión Pokémon (Planta 2)": [
    { pokemonId: 20, minLevel: 40, maxLevel: 43, weight: 10 },
    { pokemonId: 37, minLevel: 33, maxLevel: 33, weight: 6 },
    { pokemonId: 110, minLevel: 38, maxLevel: 42, weight: 4 },
    { pokemonId: 77, minLevel: 32, maxLevel: 37, weight: 12 },
    { pokemonId: 58, minLevel: 33, maxLevel: 33, weight: 6 },
    { pokemonId: 126, minLevel: 34, maxLevel: 34, weight: 5 },
    { pokemonId: 89, minLevel: 35, maxLevel: 43, weight: 7 },
    { pokemonId: 109, minLevel: 31, maxLevel: 35, weight: 15 },
    { pokemonId: 88, minLevel: 31, maxLevel: 38, weight: 23 },
    { pokemonId: 19, minLevel: 40, maxLevel: 43, weight: 12 }
  ],
  "Mansión Pokémon (Sótano)": [
    { pokemonId: 89, minLevel: 40, maxLevel: 42, weight: 5 },
    { pokemonId: 77, minLevel: 32, maxLevel: 34, weight: 10 },
    { pokemonId: 132, minLevel: 12, maxLevel: 24, weight: 4 },
    { pokemonId: 88, minLevel: 31, maxLevel: 38, weight: 26 },
    { pokemonId: 58, minLevel: 35, maxLevel: 35, weight: 10 },
    { pokemonId: 109, minLevel: 31, maxLevel: 35, weight: 18 },
    { pokemonId: 20, minLevel: 37, maxLevel: 46, weight: 15 },
    { pokemonId: 37, minLevel: 35, maxLevel: 35, weight: 10 },
    { pokemonId: 110, minLevel: 40, maxLevel: 42, weight: 2 }
  ],

  // === ZONA SAFARI ===
  "Zona Safari (Área 1)": [
    { pokemonId: 127, minLevel: 15, maxLevel: 26, weight: 1 },
    { pokemonId: 128, minLevel: 21, maxLevel: 21, weight: 12 },
    { pokemonId: 104, minLevel: 19, maxLevel: 19, weight: 12 },
    { pokemonId: 84, minLevel: 26, maxLevel: 26, weight: 1 },
    { pokemonId: 33, minLevel: 32, maxLevel: 33, weight: 6 },
    { pokemonId: 115, minLevel: 25, maxLevel: 25, weight: 5 },
    { pokemonId: 46, minLevel: 22, maxLevel: 22, weight: 20 },
    { pokemonId: 30, minLevel: 32, maxLevel: 33, weight: 10 },
    { pokemonId: 113, minLevel: 21, maxLevel: 21, weight: 2 },
    { pokemonId: 102, minLevel: 22, maxLevel: 26, weight: 30 },
    { pokemonId: 47, minLevel: 25, maxLevel: 25, weight: 1 }
    ],
  "Zona Safari (Área central)": [
    { pokemonId: 104, minLevel: 19, maxLevel: 19, weight: 2 },
    { pokemonId: 113, minLevel: 7, maxLevel: 23, weight: 1 },
    { pokemonId: 127, minLevel: 15, maxLevel: 23, weight: 1 },
    { pokemonId: 102, minLevel: 22, maxLevel: 26, weight: 25 },
    { pokemonId: 115, minLevel: 25, maxLevel: 33, weight: 15 },
    { pokemonId: 47, minLevel: 27, maxLevel: 32, weight: 15 },
    { pokemonId: 111, minLevel: 25, maxLevel: 25, weight: 12 },
    { pokemonId: 46, minLevel: 22, maxLevel: 27, weight: 10 },
    { pokemonId: 33, minLevel: 23, maxLevel: 31, weight: 8 },
    { pokemonId: 30, minLevel: 31, maxLevel: 31, weight: 7 },
    { pokemonId: 123, minLevel: 22, maxLevel: 25, weight: 4 }
  ],
  "Zona Safari (Área 2)": [
    { pokemonId: 104, minLevel: 16, maxLevel: 16, weight: 5 },  // Cubone
    { pokemonId: 102, minLevel: 20, maxLevel: 27, weight: 25 }, // Exeggcute
    { pokemonId: 123, minLevel: 25, maxLevel: 25, weight: 4 },  // Scyther
    { pokemonId: 30, minLevel: 23, maxLevel: 30, weight: 8 },   // Nidorina
    { pokemonId: 33, minLevel: 30, maxLevel: 30, weight: 10 },  // Nidorino
    { pokemonId: 115, minLevel: 28, maxLevel: 33, weight: 18 }, // Kangaskhan
    { pokemonId: 113, minLevel: 26, maxLevel: 26, weight: 2 },  // Chansey
    { pokemonId: 111, minLevel: 25, maxLevel: 26, weight: 15 }, // Rhyhorn
    { pokemonId: 46, minLevel: 22, maxLevel: 22, weight: 12 },  // Paras
    { pokemonId: 127, minLevel: 15, maxLevel: 15, weight: 1 }   // Pinsir
  ],
  "Zona Safari (Área 3)": [
    { pokemonId: 48, minLevel: 23, maxLevel: 23, weight: 8 },   // Venonat
    { pokemonId: 33, minLevel: 32, maxLevel: 33, weight: 10 },  // Nidorino
    { pokemonId: 49, minLevel: 31, maxLevel: 31, weight: 5 },   // Venomoth
    { pokemonId: 115, minLevel: 28, maxLevel: 28, weight: 2 },  // Kangaskhan
    { pokemonId: 127, minLevel: 25, maxLevel: 25, weight: 4 },  // Pinsir
    { pokemonId: 102, minLevel: 22, maxLevel: 26, weight: 30 }, // Exeggcute
    { pokemonId: 128, minLevel: 21, maxLevel: 26, weight: 15 }, // Tauros
    { pokemonId: 84, minLevel: 26, maxLevel: 26, weight: 12 },  // Doduo
    { pokemonId: 104, minLevel: 19, maxLevel: 19, weight: 10 }, // Cubone
    { pokemonId: 105, minLevel: 24, maxLevel: 24, weight: 3 },  // Marowak
    { pokemonId: 114, minLevel: 27, maxLevel: 27, weight: 1 }   // Tangela
  ],
  "Zona Safari (Pesca)": [
    { pokemonId: 54, minLevel: 15, maxLevel: 15, weight: 10 }, // Psyduck
    { pokemonId: 148, minLevel: 15, maxLevel: 15, weight: 3 }, // Dragonair
    { pokemonId: 60, minLevel: 10, maxLevel: 10, weight: 15 }, // Poliwag
    { pokemonId: 79, minLevel: 15, maxLevel: 15, weight: 10 }, // Slowpoke
    { pokemonId: 147, minLevel: 15, maxLevel: 15, weight: 12 }, // Dratini
    { pokemonId: 98, minLevel: 15, maxLevel: 15, weight: 10 }, // Krabby
    { pokemonId: 118, minLevel: 10, maxLevel: 10, weight: 15 }, // Goldeen
    { pokemonId: 129, minLevel: 5, maxLevel: 15, weight: 25 }  // Magikarp
  ]
};
