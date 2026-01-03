
import { PokemonBase, PokemonType, NPC, GymDef, MoveCategory, Move } from './types';
import { POKEDEX_151, ALL_MOVES } from './pokedexData';

export { ALL_MOVES };

export const EXPLORATION_SPRITES = {
  grass: "https://i.postimg.cc/VL9PMgLV/IMG_4803.png",
  surf: "https://i.postimg.cc/SNPC66Tc/IMG_4809.png",
  oldRod: "https://i.postimg.cc/yYhC9jYp/IMG_4804.png",
  goodRod: "https://i.postimg.cc/kXNP8sXj/IMG_4805.png",
  superRod: "https://i.postimg.cc/PrbnZyrQ/IMG_4806.png",
  cave: "https://i.postimg.cc/Prd6xp2L/91A1745D_1D62_425D_BEE5_7CEB36A958E1.jpg", 
  building: "https://i.postimg.cc/6pDXL9mX/entrada_edificio.png", 
  forest: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/leaf-stone.png", 
  water: "https://i.postimg.cc/SNPC66Tc/IMG_4809.png",
  caveEntrance: "https://i.postimg.cc/0jy8bVbL/entrada_cueva.png",
  buildingEntrance: "https://i.postimg.cc/6pDXL9mX/entrada_edificio.png"
};

export const TRAINER_SPRITES = {
  agatha: "https://i.postimg.cc/0jYLWHB7/agatha.png",
  bella: "https://i.postimg.cc/VvQxFcDD/bella.png",
  bill: "https://i.postimg.cc/KjS65yJ9/bill.png",
  blaine: "https://i.postimg.cc/XqSRg0Qs/blaine.png",
  blue: "https://i.postimg.cc/J0N96d2q/blue.png",
  brock: "https://i.postimg.cc/x8vWxF4y/brock.png",
  bruno: "https://i.postimg.cc/x8vWxF4G/bruno.png",
  caballero: "https://i.postimg.cc/XqfTHDzx/caballero.png",
  calvo: "https://i.postimg.cc/Rh7jsbDY/calvo.png",
  campista: "https://i.postimg.cc/6qrDj1m1/campista.png",
  cazabichos: "https://i.postimg.cc/HnwfZPhR/cazabichos.png",
  chica: "https://i.postimg.cc/T1VZ7H4S/chica.png",
  cientifico: "https://i.postimg.cc/SR6wTtPb/cientifico.png",
  dominguera: "https://i.postimg.cc/D0rtjYNK/dominguera.png",
  entrenador_guay: "https://i.postimg.cc/5yBZ7krV/entrenador-guay.png",
  entrenadora_guay: "https://i.postimg.cc/fyc62gPD/entrenadora_guay.png",
  equipo_rocket: "https://i.postimg.cc/RCw5ZNZq/equipo-rocket.png",
  erika: "https://i.postimg.cc/RCw5ZNZN/erika.png",
  ethan: "https://i.postimg.cc/wxD8j7j1/ethan.png",
  giovanni: "https://i.postimg.cc/3r25xdxv/giovanni.png",
  guitarrista: "https://i.postimg.cc/BZ29nXnF/guitarrista.png",
  joven: "https://i.postimg.cc/c1fyLrLY/joven.png",
  jugon: "https://i.postimg.cc/J7jVzGzZ/jugon.png",
  karateca: "https://i.postimg.cc/ry5XwKw1/karateca.png",
  koga: "https://i.postimg.cc/598d2625/koga.png",
  ladron: "https://i.postimg.cc/pVKbLpLY/ladron.png",
  lance: "https://i.postimg.cc/L4jK8n83/lance.png",
  lorelei: "https://i.postimg.cc/VsXQkdkK/lorelei.png",
  malabarista: "https://i.postimg.cc/3r25xdxf/malabarista.png",
  marinero: "https://i.postimg.cc/T2nM3p37/marinero.png",
  mecanico: "https://i.postimg.cc/HWbDkVkh/mecanico.png",
  medium: "https://i.postimg.cc/KctS8R8C/medium.png",
  medium_f: "https://i.postimg.cc/8PD8JN7Z/medium-f.png",
  mentalista: "https://i.postimg.cc/dtvMkwh4/mentalista.png",
  misty: "https://i.postimg.cc/NfYh9BKb/misty.png",
  montanero: "https://i.postimg.cc/28mpbr1P/montanero.png",
  motorista: "https://i.postimg.cc/02xgMPzT/motorista.png",
  nadador: "https://i.postimg.cc/sDyFQsBF/nadador.png",
  nadadora: "https://i.postimg.cc/hPgFzcX6/nadador-f.png",
  ornitologo: "https://i.postimg.cc/MKxkMqcx/ornitologo.png",
  pescador: "https://i.postimg.cc/YqkcGM4t/pescador.png",
  pokefan: "https://i.postimg.cc/tCy0Zp1p/pokefan.png",
  pokemaniaco: "https://i.postimg.cc/65ws2t79/pokemaniaco.png",
  policia: "https://i.postimg.cc/FsmtdNfs/policia.png",
  oak: "https://i.postimg.cc/15Pxnsg3/profesor-oak.png",
  profesora: "https://i.postimg.cc/hPgFzcJG/profesora.png",
  red: "https://i.postimg.cc/Red-sprite.png",
  rockero: "https://i.postimg.cc/bNR71Wbp/rockero.png",
  sabrina: "https://i.postimg.cc/VLFxXpML/sabrina.png",
  silver: "https://i.postimg.cc/CL43bXDh/silver.png",
  soldado_rocket: "https://i.postimg.cc/kXy0Wz8M/soldado-rocket.png",
  soldado_rocket_f: "https://i.postimg.cc/3JZs2Vpw/soldado-rocket-f.png",
  surge: "https://i.postimg.cc/CL43bXD1/st-surge.png",
  supernecio: "https://i.postimg.cc/Kv56twLj/supernecio.png"
};

export const POKEDEX: PokemonBase[] = POKEDEX_151;
export const STARTER_IDS = [1, 4, 7, 25, 133];

export const POKEMON_NAME_TO_ID: Record<string, {id: number, type: PokemonType}> = POKEDEX.reduce((acc, p) => ({
    ...acc,
    [p.name.charAt(0).toUpperCase() + p.name.slice(1)]: { id: p.id, type: p.types[0] }
}), {});

export const GYM_DATA: GymDef[] = [
  { 
    id: 'pewter_gym', city: 'Ciudad Plateada', leaderName: 'Brock', badgeName: 'Medalla Roca', 
    badgeSprite: 'https://i.postimg.cc/90dW5mN5/Medalla_brock.png',
    typeTheme: PokemonType.Rock, 
    trainers: [
      { name: 'Campista Liam', pokemonNames: ['Diglett', 'Rattata'], levels: [11, 11], isLeader: false, sprite: TRAINER_SPRITES.campista },
      { name: 'Montañero Bob', pokemonNames: ['Geodude', 'Sandshrew'], levels: [13, 14], isLeader: false, sprite: TRAINER_SPRITES.montanero },
      { name: 'Pokemaníaco Ted', pokemonNames: ['Sandshrew', 'Zubat'], levels: [14, 14], isLeader: false, sprite: TRAINER_SPRITES.pokemaniaco },
      { name: 'Líder Brock', pokemonNames: ['Geodude', 'Geodude', 'Onix' ], levels: [15, 15, 17], isLeader: true, sprite: TRAINER_SPRITES.brock }
    ] 
  },
  { 
    id: 'cerulean_gym', city: 'Ciudad Celeste', leaderName: 'Misty', badgeName: 'Medalla Cascada', 
    badgeSprite: 'https://i.postimg.cc/T1VRMdH6/Medalla_misty.png',
    typeTheme: PokemonType.Water, 
    trainers: [
      { name: 'Nadador Luis', pokemonNames: ['Staryu', 'Squirtle'], levels: [16, 16], isLeader: false, sprite: TRAINER_SPRITES.nadador },
      { name: 'Marinero Jeff', pokemonNames: ['Horsea', 'Tentacool'], levels: [17, 18], isLeader: false, sprite: TRAINER_SPRITES.marinero },
      { name: 'Pescador Barny', pokemonNames: ['Poliwag', 'Shellder'], levels: [17, 17], isLeader: false, sprite: TRAINER_SPRITES.pescador },
      { name: 'Líder Misty', pokemonNames: ['Staryu', 'Goldeen', 'Starmie'], levels: [18, 21, 24], isLeader: true, sprite: TRAINER_SPRITES.misty }
    ] 
  },
  { 
    id: 'vermilion_gym', city: 'Ciudad Carmín', leaderName: 'Lt. Surge', badgeName: 'Medalla Trueno', 
    badgeSprite: 'https://i.postimg.cc/QCQXG8nx/Medalla_surge.png',
    typeTheme: PokemonType.Electric, 
    trainers: [
      { name: 'Mecánico Axel', pokemonNames: ['Voltorb', 'Pikachu', 'Magnemite'], levels: [22, 22, 23], isLeader: false, sprite: TRAINER_SPRITES.mecanico },
      { name: 'Marinero Dwayne', pokemonNames: ['Voltorb', 'Magnemite', 'Voltorb'], levels: [23, 23, 23], isLeader: false, sprite: TRAINER_SPRITES.marinero },
      { name: 'Soldado Rocket', pokemonNames: ['Magnemite', 'Voltorb', 'Magnemite'], levels: [24, 25, 26], isLeader: false, sprite: TRAINER_SPRITES.soldado_rocket },
      { name: 'Líder Surge', pokemonNames: ['Electrode', 'Magneton', 'Electabuzz', 'Raichu'], levels: [30, 30, 31, 33], isLeader: true, sprite: TRAINER_SPRITES.surge }
    ] 
  },
  { 
    id: 'celadon_gym', city: 'Ciudad Azulona', leaderName: 'Erika', badgeName: 'Medalla Arcoiris', 
    badgeSprite: 'https://i.postimg.cc/L5tHK90R/Medalla_erika.png',
    typeTheme: PokemonType.Grass, 
    trainers: [
      { name: 'Bella Clara', pokemonNames: ['Bulbasaur', 'Oddish', 'Bellsprout'], levels: [23, 24, 25], isLeader: false, sprite: TRAINER_SPRITES.bella },
      { name: 'Dominguera Rose', pokemonNames: ['Ivysaur', 'Oddish', 'Bulbasaur'], levels: [26, 26, 26], isLeader: false, sprite: TRAINER_SPRITES.dominguera },
      { name: 'Profesora Ivy', pokemonNames: ['Weepinbell', 'Ivysaur', 'Gloom'], levels: [28, 27, 26], isLeader: false, sprite: TRAINER_SPRITES.profesora },
      { name: 'Líder Erika', pokemonNames: ['Victreebel', 'Venusaur', 'Vileplume', 'Tangela'], levels: [32, 33, 33, 35], isLeader: true, sprite: TRAINER_SPRITES.erika }
    ] 
  },
  { 
    id: 'fuchsia_gym', city: 'Ciudad Fucsia', leaderName: 'Koga', badgeName: 'Medalla Alma', 
    badgeSprite: 'https://i.postimg.cc/BbTq9Sw3/Medalla_sabrina.png',
    typeTheme: PokemonType.Poison, 
    trainers: [
      { name: 'Malabarista Kay', pokemonNames: ['Koffing', 'Muk', 'Venonat'], levels: [34, 34, 35], isLeader: false, sprite: TRAINER_SPRITES.malabarista },
      { name: 'Científico Kirk', pokemonNames: ['Grimer', 'Koffing', 'Arbok'], levels: [35, 35, 36], isLeader: false, sprite: TRAINER_SPRITES.cientifico },
      { name: 'Ladrón Kento', pokemonNames: ['Weezing', 'Muk', 'Arbok', 'Koffing'], levels: [36, 36, 36, 36], isLeader: false, sprite: TRAINER_SPRITES.ladron },
      { name: 'Supernecio Kyle', pokemonNames: ['Venonat', 'Weezing', 'Muk', 'Golbat'], levels: [37, 37, 38, 38], isLeader: false, sprite: TRAINER_SPRITES.supernecio },
      { name: 'Líder Koga', pokemonNames: ['Weezing', 'Muk', 'Arbok', 'Golbat', 'Venomoth'], levels: [38, 39, 39, 41, 44], isLeader: true, sprite: TRAINER_SPRITES.koga }
    ] 
  },
  { 
    id: 'saffron_gym', city: 'Ciudad Azafrán', leaderName: 'Sabrina', badgeName: 'Medalla Pantano', 
    badgeSprite: 'https://i.postimg.cc/NF6gqsPM/Medalla_koga.png',
    typeTheme: PokemonType.Psychic, 
    trainers: [
      { name: 'Médium Ty', pokemonNames: ['Kadabra', 'Mr. Mime', 'Slowpoke'], levels: [38, 38, 38], isLeader: false, sprite: TRAINER_SPRITES.medium },
      { name: 'Científico Phil', pokemonNames: ['Drowzee', 'Kadabra', 'Mr. Mime'], levels: [39, 39, 41], isLeader: false, sprite: TRAINER_SPRITES.cientifico },
      { name: 'Supernecio Stacy', pokemonNames: ['Alakazam', 'Starmie', 'Hypno', 'Kadabra'], levels: [40, 40, 40, 40], isLeader: false, sprite: TRAINER_SPRITES.supernecio },
      { name: 'Mentalista May', pokemonNames: ['Mr. Mime', 'Drowzee', 'Slowbro', 'Exeggcute'], levels: [41, 41, 41, 42], isLeader: false, sprite: TRAINER_SPRITES.mentalista },
      { name: 'Líder Sabrina', pokemonNames: ['Mr. Mime', 'Kadabra', 'Hypno', 'Exeggcutor', 'Alakazam'], levels: [44, 44, 45, 48, 50], isLeader: true, sprite: TRAINER_SPRITES.sabrina }
    ] 
  },
  { 
    id: 'cinnabar_gym', city: 'Isla Canela', leaderName: 'Blaine', badgeName: 'Medalla Volcán', 
    badgeSprite: 'https://i.postimg.cc/7h3x8HQC/Medalla_blaine.png',
    typeTheme: PokemonType.Fire, 
    trainers: [
      { name: 'Ladrón Joe', pokemonNames: ['Growlithe', 'Ponyta', 'Charmander', 'Magmar'], levels: [42, 42, 43, 44], isLeader: false, sprite: TRAINER_SPRITES.ladron },
      { name: 'Supernecio Quinn', pokemonNames: ['Vulpix', 'Ponyta', 'Magmar', 'Flareon'], levels: [43, 43, 43, 43], isLeader: false, sprite: TRAINER_SPRITES.supernecio },
      { name: 'Científico Ray', pokemonNames: ['Growlithe', 'Charmeleon', 'Ninetales', 'Rapidash'], levels: [44, 44, 44, 45], isLeader: false, sprite: TRAINER_SPRITES.cientifico },
      { name: 'Pokemaníaco Sam', pokemonNames: ['Growlithe', 'Vulpipx', 'Arcanine', 'Rapidash'], levels: [45, 45, 45, 45], isLeader: false, sprite: TRAINER_SPRITES.pokemaniaco },
      { name: 'Líder Blaine', pokemonNames: ['Ninetales', 'Rapidash', 'Flareon', 'Magmar', 'Arcanine', 'Charizard'], levels: [48, 50, 51, 51, 52, 53], isLeader: true, sprite: TRAINER_SPRITES.blaine }
    ] 
  },
  { 
    id: 'viridian_gym', city: 'Ciudad Verde', leaderName: 'Giovanni', badgeName: 'Medalla Tierra', 
    badgeSprite: 'https://i.postimg.cc/8cR1Qpnf/Medalla_giovanni.png',
    typeTheme: PokemonType.Ground, 
    trainers: [
      { name: 'Científico Ko', pokemonNames: ['Rhyhorn', 'Nidorino', 'Marowak', 'Sandslash'], levels: [46, 46, 46, 46], isLeader: false, sprite: TRAINER_SPRITES.cientifico },
      { name: 'Supernecio Warren', pokemonNames: ['Rhyhorn', 'Nidoqueen', 'Graveler', 'Dugtrio'], levels: [47, 47, 47, 47], isLeader: false, sprite: TRAINER_SPRITES.supernecio },
      { name: 'Pokemaníaco Yuji', pokemonNames: ['Nidorina', 'Rhydon', 'Marowak', 'Sandslash'], levels: [48, 48, 48, 48], isLeader: false, sprite: TRAINER_SPRITES.pokemaniaco },
      { name: 'Karateca Ken', pokemonNames: ['Hitmonlee', 'Hitmonchan', 'Graveler', 'Exeggcutor'], levels: [49, 49, 49, 49], isLeader: false, sprite: TRAINER_SPRITES.karateca },
      { name: 'Líder Giovanni', pokemonNames: ['Dugtrio', 'Golem', 'Nidoqueen', 'Rhydon', 'Persian', 'Nidoking'], levels: [50, 50, 52, 53, 55, 57], isLeader: true, sprite: TRAINER_SPRITES.giovanni }
    ] 
  }
];

export const NPC_LIST: NPC[] = [
  { 
    id: 'youngster_joey', 
    name: 'Joven Joey', 
    sprite: TRAINER_SPRITES.joven, 
    challengePhrase: '¡Mi Rattata es el mejor!', 
    defeatPhrase: '¡No puede ser! ¡Mi súper Rattata!',
    rewardMoney: 150, 
    teamSize: 1,
    weight: 10
  }
];

export const getTypeEffectiveness = (moveType: PokemonType, defenderTypes: PokemonType[]): number => {
  const TYPE_CHART: Record<string, Record<string, number>> = {
    [PokemonType.Normal]: { [PokemonType.Rock]: 0.5, [PokemonType.Ghost]: 0 },
    [PokemonType.Fire]: { [PokemonType.Fire]: 0.5, [PokemonType.Water]: 0.5, [PokemonType.Grass]: 2, [PokemonType.Bug]: 2, [PokemonType.Rock]: 0.5, [PokemonType.Dragon]: 0.5, [PokemonType.Ice]: 2 },
    [PokemonType.Water]: { [PokemonType.Fire]: 2, [PokemonType.Water]: 0.5, [PokemonType.Grass]: 0.5, [PokemonType.Ground]: 2, [PokemonType.Rock]: 2, [PokemonType.Dragon]: 0.5 },
    [PokemonType.Electric]: { [PokemonType.Water]: 2, [PokemonType.Electric]: 0.5, [PokemonType.Grass]: 0.5, [PokemonType.Ground]: 0, [PokemonType.Flying]: 2, [PokemonType.Dragon]: 0.5 },
    [PokemonType.Grass]: { [PokemonType.Fire]: 0.5, [PokemonType.Water]: 2, [PokemonType.Grass]: 0.5, [PokemonType.Poison]: 0.5, [PokemonType.Ground]: 2, [PokemonType.Flying]: 0.5, [PokemonType.Bug]: 0.5, [PokemonType.Rock]: 2, [PokemonType.Dragon]: 0.5 },
    [PokemonType.Ground]: { [PokemonType.Fire]: 2, [PokemonType.Electric]: 2, [PokemonType.Grass]: 0.5, [PokemonType.Poison]: 2, [PokemonType.Bug]: 0.5, [PokemonType.Rock]: 2 },
    [PokemonType.Rock]: { [PokemonType.Fire]: 2, [PokemonType.Ice]: 2, [PokemonType.Fighting]: 0.5, [PokemonType.Ground]: 0.5, [PokemonType.Flying]: 2, [PokemonType.Bug]: 2 },
    [PokemonType.Psychic]: { [PokemonType.Fighting]: 2, [PokemonType.Poison]: 2, [PokemonType.Psychic]: 0.5 },
  };
  let multiplier = 1;
  const attackRelations = TYPE_CHART[moveType];
  if (!attackRelations) return 1;
  defenderTypes.forEach(defType => {
    if (attackRelations[defType] !== undefined) multiplier *= attackRelations[defType];
  });
  return multiplier;
};
