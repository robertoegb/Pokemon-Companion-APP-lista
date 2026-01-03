
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

export const POKEDEX_PART_2: PokemonBase[] = [
  createPkmn(51, "Dugtrio", [T.Ground], 35, 80, 50, 50, 120, 149, 50),
  createPkmn(52, "Meowth", [T.Normal], 40, 45, 35, 40, 90, 58, 255, {level: 28, toId: 53}),
  createPkmn(53, "Persian", [T.Normal], 65, 70, 60, 65, 115, 154, 90),
  createPkmn(54, "Psyduck", [T.Water], 50, 52, 48, 65, 55, 64, 190, {level: 33, toId: 55}),
  createPkmn(55, "Golduck", [T.Water], 80, 82, 78, 95, 85, 175, 75),
  createPkmn(56, "Mankey", [T.Fighting], 40, 80, 35, 35, 70, 61, 190, {level: 28, toId: 57}),
  createPkmn(57, "Primeape", [T.Fighting], 65, 105, 60, 60, 95, 159, 75),
  createPkmn(58, "Growlithe", [T.Fire], 55, 70, 45, 70, 60, 70, 190, {level: 35, toId: 59}),
  createPkmn(59, "Arcanine", [T.Fire], 90, 110, 80, 100, 95, 194, 75),
  createPkmn(60, "Poliwag", [T.Water], 40, 50, 40, 40, 90, 60, 255, {level: 25, toId: 61}),
  createPkmn(61, "Poliwhirl", [T.Water], 65, 65, 65, 50, 90, 131, 120, {level: 35, toId: 62}),
  createPkmn(62, "Poliwrath", [T.Water, T.Fighting], 90, 95, 95, 70, 70, 230, 45),
  createPkmn(63, "Abra", [T.Psychic], 25, 20, 15, 105, 90, 62, 200, {level: 16, toId: 64}),
  createPkmn(64, "Kadabra", [T.Psychic], 40, 35, 30, 120, 105, 140, 100, {level: 36, toId: 65}),
  createPkmn(65, "Alakazam", [T.Psychic], 55, 50, 45, 135, 120, 225, 50),
  createPkmn(66, "Machop", [T.Fighting], 70, 80, 50, 35, 35, 61, 180, {level: 28, toId: 67}),
  createPkmn(67, "Machoke", [T.Fighting], 80, 100, 70, 50, 45, 142, 90, {level: 38, toId: 68}),
  createPkmn(68, "Machamp", [T.Fighting], 90, 130, 80, 65, 55, 227, 45),
  createPkmn(69, "Bellsprout", [T.Grass, T.Poison], 50, 75, 35, 70, 40, 60, 255, {level: 21, toId: 70}),
  createPkmn(70, "Weepinbell", [T.Grass, T.Poison], 65, 90, 50, 85, 55, 137, 120, {level: 32, toId: 71}),
  createPkmn(71, "Victreebel", [T.Grass, T.Poison], 80, 105, 65, 100, 70, 221, 45),
  createPkmn(72, "Tentacool", [T.Water, T.Poison], 40, 40, 35, 50, 70, 67, 190, {level: 30, toId: 73}),
  createPkmn(73, "Tentacruel", [T.Water, T.Poison], 80, 70, 65, 80, 100, 180, 60),
  createPkmn(74, "Geodude", [T.Rock, T.Ground], 40, 80, 100, 30, 20, 60, 255, {level: 25, toId: 75}),
  createPkmn(75, "Graveler", [T.Rock, T.Ground], 55, 95, 115, 45, 35, 137, 120, {level: 36, toId: 76}),
  createPkmn(76, "Golem", [T.Rock, T.Ground], 80, 110, 130, 55, 45, 223, 45),
  createPkmn(77, "Ponyta", [T.Fire], 50, 85, 55, 65, 90, 82, 190, {level: 40, toId: 78}),
  createPkmn(78, "Rapidash", [T.Fire], 65, 100, 70, 80, 105, 175, 60),
  createPkmn(79, "Slowpoke", [T.Water, T.Psychic], 90, 65, 65, 40, 15, 63, 190, {level: 37, toId: 80}),
  createPkmn(80, "Slowbro", [T.Water, T.Psychic], 95, 75, 110, 100, 30, 172, 75),
  createPkmn(81, "Magnemite", [T.Electric], 25, 35, 70, 95, 45, 65, 190, {level: 30, toId: 82}),
  createPkmn(82, "Magneton", [T.Electric], 50, 60, 95, 120, 70, 163, 60),
  createPkmn(83, "Farfetch'd", [T.Normal, T.Flying], 52, 65, 55, 58, 60, 123, 45),
  createPkmn(84, "Doduo", [T.Normal, T.Flying], 35, 85, 45, 35, 75, 62, 190, {level: 31, toId: 85}),
  createPkmn(85, "Dodrio", [T.Normal, T.Flying], 60, 110, 70, 60, 100, 161, 45),
  createPkmn(86, "Seel", [T.Water], 65, 45, 55, 45, 45, 65, 190, {level: 34, toId: 87}),
  createPkmn(87, "Dewgong", [T.Water, T.Ice], 90, 70, 80, 70, 70, 166, 75),
  createPkmn(88, "Grimer", [T.Poison], 80, 80, 50, 40, 25, 65, 190, {level: 38, toId: 89}),
  createPkmn(89, "Muk", [T.Poison], 105, 105, 75, 65, 50, 175, 75),
  createPkmn(90, "Shellder", [T.Water], 30, 65, 100, 45, 40, 61, 190, {level: 30, toId: 91}),
  createPkmn(91, "Cloyster", [T.Water, T.Ice], 50, 95, 180, 85, 70, 184, 60),
  createPkmn(92, "Gastly", [T.Ghost, T.Poison], 30, 35, 30, 100, 80, 62, 190, {level: 25, toId: 93}),
  createPkmn(93, "Haunter", [T.Ghost, T.Poison], 45, 50, 45, 115, 95, 142, 90, {level: 36, toId: 94}),
  createPkmn(94, "Gengar", [T.Ghost, T.Poison], 60, 65, 60, 130, 110, 225, 45),
  createPkmn(95, "Onix", [T.Rock, T.Ground], 35, 45, 160, 30, 70, 77, 45),
  createPkmn(96, "Drowzee", [T.Psychic], 60, 48, 45, 43, 42, 66, 190, {level: 26, toId: 97}),
  createPkmn(97, "Hypno", [T.Psychic], 85, 73, 70, 73, 67, 169, 75),
  createPkmn(98, "Krabby", [T.Water], 30, 105, 90, 25, 50, 65, 225, {level: 28, toId: 99}),
  createPkmn(99, "Kingler", [T.Water], 55, 130, 115, 50, 75, 166, 60),
  createPkmn(100, "Voltorb", [T.Electric], 40, 30, 50, 55, 100, 66, 190, {level: 30, toId: 101})
];
