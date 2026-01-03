
import { PokemonBase, PokemonType } from './types';

// Helper local para evitar duplicar código en el archivo parcial
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

export const POKEDEX_PART_1: PokemonBase[] = [
  createPkmn(1, "Bulbasaur", [T.Grass, T.Poison], 45, 49, 49, 65, 45, 64, 45, {level: 16, toId: 2}),
  createPkmn(2, "Ivysaur", [T.Grass, T.Poison], 60, 62, 63, 80, 60, 142, 45, {level: 32, toId: 3}),
  createPkmn(3, "Venusaur", [T.Grass, T.Poison], 80, 82, 83, 100, 80, 236, 45),
  createPkmn(4, "Charmander", [T.Fire], 39, 52, 43, 60, 65, 62, 45, {level: 16, toId: 5}),
  createPkmn(5, "Charmeleon", [T.Fire], 58, 64, 58, 80, 80, 142, 45, {level: 36, toId: 6}),
  createPkmn(6, "Charizard", [T.Fire, T.Flying], 78, 84, 78, 109, 100, 240, 45),
  createPkmn(7, "Squirtle", [T.Water], 44, 48, 65, 50, 43, 63, 45, {level: 16, toId: 8}),
  createPkmn(8, "Wartortle", [T.Water], 59, 63, 80, 65, 58, 142, 45, {level: 36, toId: 9}),
  createPkmn(9, "Blastoise", [T.Water], 79, 83, 100, 85, 78, 239, 45),
  createPkmn(10, "Caterpie", [T.Bug], 45, 30, 35, 20, 45, 39, 255, {level: 7, toId: 11}),
  createPkmn(11, "Metapod", [T.Bug], 50, 20, 55, 25, 30, 72, 120, {level: 10, toId: 12}),
  createPkmn(12, "Butterfree", [T.Bug, T.Flying], 60, 45, 50, 90, 70, 178, 45),
  createPkmn(13, "Weedle", [T.Bug, T.Poison], 40, 35, 30, 20, 50, 39, 255, {level: 7, toId: 14}),
  createPkmn(14, "Kakuna", [T.Bug, T.Poison], 45, 25, 50, 25, 35, 72, 120, {level: 10, toId: 15}),
  createPkmn(15, "Beedrill", [T.Bug, T.Poison], 65, 90, 40, 45, 75, 178, 45),
  createPkmn(16, "Pidgey", [T.Normal, T.Flying], 40, 45, 40, 35, 56, 50, 255, {level: 18, toId: 17}),
  createPkmn(17, "Pidgeotto", [T.Normal, T.Flying], 63, 60, 55, 50, 71, 122, 120, {level: 36, toId: 18}),
  createPkmn(18, "Pidgeot", [T.Normal, T.Flying], 83, 80, 75, 70, 101, 216, 45),
  createPkmn(19, "Rattata", [T.Normal], 30, 56, 35, 25, 72, 51, 255, {level: 20, toId: 20}),
  createPkmn(20, "Raticate", [T.Normal], 55, 81, 60, 50, 97, 145, 127),
  createPkmn(21, "Spearow", [T.Normal, T.Flying], 40, 60, 30, 31, 70, 52, 255, {level: 20, toId: 22}),
  createPkmn(22, "Fearow", [T.Normal, T.Flying], 65, 90, 65, 61, 100, 155, 90),
  createPkmn(23, "Ekans", [T.Poison], 35, 60, 44, 40, 55, 58, 255, {level: 22, toId: 24}),
  createPkmn(24, "Arbok", [T.Poison], 60, 95, 69, 65, 80, 157, 90),
  createPkmn(25, "Pikachu", [T.Electric], 35, 55, 40, 50, 90, 112, 190, {level: 20, toId: 26}),
  createPkmn(26, "Raichu", [T.Electric], 60, 90, 55, 90, 110, 218, 75),
  createPkmn(27, "Sandshrew", [T.Ground], 50, 75, 85, 20, 40, 60, 255, {level: 22, toId: 28}),
  createPkmn(28, "Sandslash", [T.Ground], 75, 100, 110, 45, 65, 158, 90),
  createPkmn(29, "Nidoran♀", [T.Poison], 55, 47, 52, 40, 41, 55, 235, {level: 16, toId: 30}),
  createPkmn(30, "Nidorina", [T.Poison], 70, 62, 67, 55, 56, 128, 120, {level: 30, toId: 31}),
  createPkmn(31, "Nidoqueen", [T.Poison, T.Ground], 90, 92, 87, 75, 76, 227, 45),
  createPkmn(32, "Nidoran♂", [T.Poison], 46, 57, 40, 40, 50, 55, 235, {level: 16, toId: 33}),
  createPkmn(33, "Nidorino", [T.Poison], 61, 72, 57, 55, 65, 128, 120, {level: 30, toId: 34}),
  createPkmn(34, "Nidoking", [T.Poison, T.Ground], 81, 102, 77, 85, 85, 227, 45),
  createPkmn(35, "Clefairy", [T.Normal], 70, 45, 48, 60, 35, 113, 150, {level: 30, toId: 36}),
  createPkmn(36, "Clefable", [T.Normal], 95, 70, 73, 95, 60, 217, 25),
  createPkmn(37, "Vulpix", [T.Fire], 38, 41, 40, 50, 65, 60, 190, {level: 30, toId: 38}),
  createPkmn(38, "Ninetales", [T.Fire], 73, 76, 75, 81, 100, 177, 75),
  createPkmn(39, "Jigglypuff", [T.Normal], 115, 45, 20, 45, 20, 95, 170, {level: 30, toId: 40}),
  createPkmn(40, "Wigglytuff", [T.Normal], 140, 70, 45, 75, 45, 196, 50),
  createPkmn(41, "Zubat", [T.Poison, T.Flying], 40, 45, 35, 30, 55, 49, 255, {level: 22, toId: 42}),
  createPkmn(42, "Golbat", [T.Poison, T.Flying], 75, 80, 70, 65, 90, 159, 90),
  createPkmn(43, "Oddish", [T.Grass, T.Poison], 45, 50, 55, 75, 30, 64, 255, {level: 21, toId: 44}),
  createPkmn(44, "Gloom", [T.Grass, T.Poison], 60, 65, 70, 85, 40, 138, 120, {level: 32, toId: 45}),
  createPkmn(45, "Vileplume", [T.Grass, T.Poison], 75, 80, 85, 110, 50, 221, 45),
  createPkmn(46, "Paras", [T.Bug, T.Grass], 35, 70, 55, 45, 25, 57, 190, {level: 24, toId: 47}),
  createPkmn(47, "Parasect", [T.Bug, T.Grass], 60, 95, 80, 60, 30, 142, 75),
  createPkmn(48, "Venonat", [T.Bug, T.Poison], 60, 55, 50, 40, 45, 61, 190, {level: 31, toId: 49}),
  createPkmn(49, "Venomoth", [T.Bug, T.Poison], 70, 65, 60, 90, 90, 158, 75),
  createPkmn(50, "Diglett", [T.Ground], 10, 55, 25, 35, 95, 53, 255, {level: 26, toId: 51})
];
