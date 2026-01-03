
import { PokemonBase, PokemonType } from './types';

const getSprite = (id: number, back: boolean = false) => 
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${back ? 'back/' : ''}${id}.png`;

const createPkmn = (id: number, name: string, types: PokemonType[], hp: number, atk: number, def: number, sp: number, speed: number, exp: number, catchRate: number, evo?: {level: number, toId: number}): PokemonBase => ({
    id, name, types,
    baseStats: { hp, attack: atk, defense: def, specialAttack: sp, specialDefense: sp, speed },
    baseExperience: exp, catchRate, evolution: evo,
    sprites: { front: getSprite(id), back: getSprite(id, true) },
    moves: []
});

const T = PokemonType;

export const POKEDEX_PART_3: PokemonBase[] = [
  createPkmn(101, "Electrode", [T.Electric], 60, 50, 70, 80, 140, 168, 60),
  createPkmn(102, "Exeggcute", [T.Grass, T.Psychic], 60, 40, 80, 60, 40, 64, 90, {level: 35, toId: 103}),
  createPkmn(103, "Exeggutor", [T.Grass, T.Psychic], 95, 95, 85, 125, 55, 212, 45),
  createPkmn(104, "Cubone", [T.Ground], 50, 50, 95, 40, 35, 64, 190, {level: 28, toId: 105}),
  createPkmn(105, "Marowak", [T.Ground], 60, 80, 110, 50, 45, 149, 75),
  createPkmn(106, "Hitmonlee", [T.Fighting], 50, 120, 53, 35, 87, 159, 45),
  createPkmn(107, "Hitmonchan", [T.Fighting], 50, 105, 79, 35, 76, 159, 45),
  createPkmn(108, "Lickitung", [T.Normal], 90, 55, 75, 60, 30, 77, 45),
  createPkmn(109, "Koffing", [T.Poison], 40, 65, 95, 60, 35, 68, 190, {level: 35, toId: 110}),
  createPkmn(110, "Weezing", [T.Poison], 65, 90, 120, 85, 60, 172, 60),
  createPkmn(111, "Rhyhorn", [T.Ground, T.Rock], 80, 85, 95, 30, 25, 69, 120, {level: 42, toId: 112}),
  createPkmn(112, "Rhydon", [T.Ground, T.Rock], 105, 130, 120, 45, 40, 170, 60),
  createPkmn(113, "Chansey", [T.Normal], 250, 5, 5, 35, 50, 395, 30),
  createPkmn(114, "Tangela", [T.Grass], 65, 55, 115, 100, 60, 87, 45),
  createPkmn(115, "Kangaskhan", [T.Normal], 105, 95, 80, 40, 90, 172, 45),
  createPkmn(116, "Horsea", [T.Water], 30, 40, 70, 70, 60, 66, 225, {level: 32, toId: 117}),
  createPkmn(117, "Seadra", [T.Water], 55, 65, 95, 95, 85, 154, 75),
  createPkmn(118, "Goldeen", [T.Water], 45, 67, 60, 35, 63, 64, 225, {level: 33, toId: 119}),
  createPkmn(119, "Seaking", [T.Water], 80, 92, 65, 65, 68, 158, 60),
  createPkmn(120, "Staryu", [T.Water], 30, 45, 55, 70, 85, 68, 225, {level: 35, toId: 121}),
  createPkmn(121, "Starmie", [T.Water, T.Psychic], 60, 75, 85, 100, 115, 182, 60),
  createPkmn(122, "Mr. Mime", [T.Psychic], 40, 45, 65, 100, 90, 161, 45),
  createPkmn(123, "Scyther", [T.Bug, T.Flying], 70, 110, 80, 55, 105, 175, 45),
  createPkmn(124, "Jynx", [T.Ice, T.Psychic], 65, 50, 35, 115, 95, 159, 45),
  createPkmn(125, "Electabuzz", [T.Electric], 65, 83, 57, 95, 105, 172, 45),
  createPkmn(126, "Magmar", [T.Fire], 65, 95, 57, 100, 93, 173, 45),
  createPkmn(127, "Pinsir", [T.Bug], 65, 125, 100, 55, 85, 175, 45),
  createPkmn(128, "Tauros", [T.Normal], 75, 100, 95, 40, 110, 172, 45),
  createPkmn(129, "Magikarp", [T.Water], 20, 10, 55, 15, 80, 40, 255, {level: 20, toId: 130}),
  createPkmn(130, "Gyarados", [T.Water, T.Flying], 95, 125, 79, 60, 81, 189, 45),
  createPkmn(131, "Lapras", [T.Water, T.Ice], 130, 85, 80, 85, 60, 187, 45),
  createPkmn(132, "Ditto", [T.Normal], 48, 48, 48, 48, 48, 101, 35),
  createPkmn(133, "Eevee", [T.Normal], 55, 55, 50, 45, 55, 65, 45, {level: 20, toId: 134}),
  createPkmn(134, "Vaporeon", [T.Water], 130, 65, 60, 110, 65, 184, 45),
  createPkmn(135, "Jolteon", [T.Electric], 65, 65, 60, 110, 130, 184, 45),
  createPkmn(136, "Flareon", [T.Fire], 65, 130, 60, 95, 65, 184, 45),
  createPkmn(137, "Porygon", [T.Normal], 65, 60, 70, 85, 40, 79, 45),
  createPkmn(138, "Omanyte", [T.Rock, T.Water], 35, 40, 100, 90, 35, 71, 45, {level: 40, toId: 139}),
  createPkmn(139, "Omastar", [T.Rock, T.Water], 70, 60, 125, 115, 55, 173, 45),
  createPkmn(140, "Kabuto", [T.Rock, T.Water], 30, 80, 90, 55, 55, 71, 45, {level: 40, toId: 141}),
  createPkmn(141, "Kabutops", [T.Rock, T.Water], 60, 115, 105, 65, 80, 173, 45),
  createPkmn(142, "Aerodactyl", [T.Rock, T.Flying], 80, 105, 65, 60, 130, 180, 45),
  createPkmn(143, "Snorlax", [T.Normal], 160, 110, 65, 65, 30, 189, 25),
  createPkmn(144, "Articuno", [T.Ice, T.Flying], 90, 85, 100, 95, 85, 261, 3),
  createPkmn(145, "Zapdos", [T.Electric, T.Flying], 90, 90, 85, 125, 100, 261, 3),
  createPkmn(146, "Moltres", [T.Fire, T.Flying], 90, 100, 90, 125, 90, 261, 3),
  createPkmn(147, "Dratini", [T.Dragon], 41, 64, 45, 50, 50, 60, 45, {level: 30, toId: 148}),
  createPkmn(148, "Dragonair", [T.Dragon], 61, 84, 65, 70, 70, 147, 45, {level: 55, toId: 149}),
  createPkmn(149, "Dragonite", [T.Dragon, T.Flying], 91, 134, 95, 100, 80, 270, 45),
  createPkmn(150, "Mewtwo", [T.Psychic], 106, 110, 90, 154, 130, 306, 3),
  createPkmn(151, "Mew", [T.Psychic], 100, 100, 100, 100, 100, 270, 45)
];
