
import { LocationProfile, SubArea } from './types';
import { ZONE_ITEMS_REGISTRY } from './zoneItemsData';
import { ZONE_NPC_REGISTRY } from './zoneNpcData';
import { WILD_POKEMON_REGISTRY } from './wildEncountersData';
import { ZONE_EVENT_PROBABILITIES } from './zoneEvents';

const createZone = (id: string, name: string, config: { subAreas?: {id: string, name: string}[] } = {}): LocationProfile => {
  const subAreasMap: Record<string, SubArea> | undefined = config.subAreas 
    ? config.subAreas.reduce((acc, sub) => ({
        ...acc,
        [sub.id]: {
            id: sub.id,
            name: sub.name,
            type: sub.name.toLowerCase().includes('piso') || sub.name.toLowerCase().includes('planta') || sub.name.toLowerCase().includes('nivel') || sub.name.toLowerCase().includes('sub') ? 'floor' : 'cave',
            wildPool: WILD_POKEMON_REGISTRY[sub.name] || [],
            events: ZONE_EVENT_PROBABILITIES[sub.name] || { wild: 60, npc: 10, item: 10, nothing: 20 }
        }
      }), {})
    : undefined;

  return {
    id,
    name,
    events: ZONE_EVENT_PROBABILITIES[name] || { wild: 60, npc: 10, item: 10, nothing: 20 },
    wildPool: WILD_POKEMON_REGISTRY[name] || [],
    npcPool: ZONE_NPC_REGISTRY[name] || [],
    subAreas: subAreasMap,
    itemPool: ZONE_ITEMS_REGISTRY[name] || []
  };
};

export const LOCATION_DATA: Record<string, LocationProfile> = {
  "Ruta 1": createZone("route_1", "Ruta 1"),
  "Ruta 2": createZone("route_2", "Ruta 2"),
  "Ruta 3": createZone("route_3", "Ruta 3"),
  "Ruta 4": createZone("route_4", "Ruta 4"),
  "Ruta 5": createZone("route_5", "Ruta 5"),
  "Ruta 6": createZone("route_6", "Ruta 6"),
  "Ruta 7": createZone("route_7", "Ruta 7"),
  "Ruta 8": createZone("route_8", "Ruta 8"),
  "Ruta 9": createZone("route_9", "Ruta 9"),
  "Ruta 10": createZone("route_10", "Ruta 10"),
  "Ruta 11": createZone("route_11", "Ruta 11"),
  "Ruta 12": createZone("route_12", "Ruta 12"),
  "Ruta 13": createZone("route_13", "Ruta 13"),
  "Ruta 14": createZone("route_14", "Ruta 14"),
  "Ruta 15": createZone("route_15", "Ruta 15"),
  "Ruta 16": createZone("route_16", "Ruta 16"),
  "Ruta 17": createZone("route_17", "Ruta 17"),
  "Ruta 18": createZone("route_18", "Ruta 18"),
  "Ruta 19": createZone("route_19", "Ruta 19"),
  "Ruta 20": createZone("route_20", "Ruta 20"),
  "Ruta 21": createZone("route_21", "Ruta 21"),
  "Ruta 22": createZone("route_22", "Ruta 22"),
  "Ruta 23": createZone("route_23", "Ruta 23"),
  "Ruta 24": createZone("route_24", "Ruta 24"),
  "Ruta 25": createZone("route_25", "Ruta 25"),
  "Bosque Verde": createZone("viridian_forest", "Bosque Verde"),
  "Mt. Moon": createZone("mt_moon", "Mt. Moon", {
    subAreas: [
        { id: 'mt_moon_b1', name: 'Mt. Moon (Nivel -1)' },
        { id: 'mt_moon_b2', name: 'Mt. Moon (Nivel -2)' }
    ]
  }),
  "Cueva Diglett": createZone("diglett_cave", "Cueva Diglett"),
  "Túnel Roca": createZone("rock_tunnel", "Túnel Roca", {
    subAreas: [{ id: 'tunnel_b1', name: 'Túnel Roca (Nivel -1)' }]
  }),
  "Torre Pokémon": createZone("pokemon_tower", "Torre Pokémon", {
    subAreas: [
        { id: 'tower_2', name: 'Torre Pokémon (Planta 2)' },
        { id: 'tower_3', name: 'Torre Pokémon (Planta 3)' }
    ]
  }),
  "Central Eléctrica": createZone("power_plant", "Central Eléctrica"),
  "Silph S.A.": createZone("silph_sa", "Silph S.A.", {
      subAreas: [
          { id: 'silph_2', name: 'Silph S.A. (piso 2)' },
          { id: 'silph_3', name: 'Silph S.A. (piso 3)' },
          { id: 'silph_4', name: 'Silph S.A. (piso 4)' }
      ]
  }),
  "Guarida Rocket": createZone("rocket_hideout", "Guarida Rocket", {
    subAreas: [
        { id: 'rocket_b1', name: 'Guarida Rocket (Sub 1)' },
        { id: 'rocket_b2', name: 'Guarida Rocket (Sub 2)' },
        { id: 'rocket_b3', name: 'Guarida Rocket (Sub 3)' }
    ]
  }),
  "Mansión Pokémon": createZone("pokemon_mansion", "Mansión Pokémon", {
      subAreas: [
          { id: 'mansion_2', name: 'Mansión Pokémon (Planta 2)' },
          { id: 'mansion_b1', name: 'Mansión Pokémon (Sótano)' }
      ]
  }),
  "Zona Safari": createZone("safari_zone", "Zona Safari", {
    subAreas: [
        { id: 'safari_area1', name: 'Zona Safari (Área 1)' },
        { id: 'safari_area2', name: 'Zona Safari (Área 2)' },
        { id: 'safari_area3', name: 'Zona Safari (Área 3)' }
    ]
  }),
  "Islas Espuma": createZone("seafoam_islands", "Islas Espuma", {
    subAreas: [
        { id: 'seafoam_b1', name: 'Islas Espuma (Nivel -1)' },
        { id: 'seafoam_b2', name: 'Islas Espuma (Nivel -2)' },
        { id: 'seafoam_b3', name: 'Islas Espuma (Nivel -3)' },
        { id: 'seafoam_b4', name: 'Islas Espuma (Nivel -4)' }
    ]
  }),
  "Calle Victoria": createZone("victory_road", "Calle Victoria", {
    subAreas: [
        { id: 'victory_2', name: 'Calle Victoria (Nivel 2)' },
        { id: 'victory_3', name: 'Calle Victoria (Nivel 3)' }
    ]
  }),
  "Cueva Celeste": createZone("cerulean_cave", "Cueva Celeste"),
  "S.S. Anne": createZone("ss_anne", "S.S. Anne", {
    subAreas: [
        { id: 'ss_anne_b1', name: 'S.S. Anne (Sótano)' },
        { id: 'ss_anne_deck', name: 'S.S. Anne (Cubierta)' }
    ]
  })
};

export const DEFAULT_LOCATION = LOCATION_DATA["Ruta 1"];
export const LOCATION_KEYS = Object.keys(LOCATION_DATA);
