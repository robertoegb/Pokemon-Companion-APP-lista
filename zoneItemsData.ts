import { ZoneItemPoolEntry } from './types';

export const ZONE_ITEMS_REGISTRY: Record<string, ZoneItemPoolEntry[]> = {
  "Ruta 1": [
    { name: "Poción", quantity: 1, weight: 1, locationDescription: "Cerca del cartel de entrada" },
    { name: "Pokéball", quantity: 1, weight: 1, locationDescription: "Al lado del camino principal" }
  ],
  "Ruta 2": [
    { name: "Pokéball", quantity: 1, weight: 1, locationDescription: "Detrás de un arbusto" },
    { name: "Piedra Lunar", quantity: 1, weight: 1, locationDescription: "Al lado de una roca", isRare: true }
  ],
  "Ruta 4": [
    { name: "Antiquemar", quantity: 1, weight: 1, locationDescription: "Detrás de una pequeña roca" },
    { name: "Superball", quantity: 1, weight: 1, locationDescription: "Enterrada al lado del camino" }
  ],
  "Ruta 6": [
    { name: "Poción", quantity: 1, weight: 1, locationDescription: "Al borde del estanque" },
    { name: "Pokéball", quantity: 1, weight: 1, locationDescription: "Cerca de la hierba alta" }
  ],
  "Ruta 8": [
    { name: "Antídoto", quantity: 1, weight: 1, locationDescription: "Alguien lo escondió detrás de la piedra" }
  ],
  "Ruta 9": [
    { name: "Pokéball", quantity: 1, weight: 1, locationDescription: "A medio enterrar al lado del camino" },
    { name: "Éter", quantity: 1, weight: 1, locationDescription: "Oculto en la roca debajo de la zona de hierba, al noroeste" }
  ],
  "Ruta 10": [
    { name: "Éter máximo", quantity: 1, weight: 1, locationDescription: "A la derecha de la salida del Túnel Roca en el árbol (oculto)", isRare: true },
    { name: "Superpoción", quantity: 1, weight: 1, locationDescription: "A la derecha de la entrada del Túnel Roca, cortando un arbusto (oculto)" }
  ],
  "Ruta 11": [
    { name: "Cuerda Huida", quantity: 1, weight: 1, locationDescription: "En la sección norte, a la izquierda del edificio, oculto en el arbusto" }
  ],
  "Ruta 12": [
    { name: "Pokéball", quantity: 1, weight: 1, locationDescription: "Encontraste una Pokéball" },
    { name: "Hiperpoción", quantity: 1, weight: 1, locationDescription: "Oculta en la parte que no es puente a la izquierda del Snorlax" }
  ],
  "Ruta 16": [
    { name: "Superpoción", quantity: 1, weight: 1, locationDescription: "A medio enterrar al lado del camino" }
  ],
  "Ruta 17": [
    { name: "Elíxir máximo", quantity: 1, weight: 1, locationDescription: "Cerca del final de la ruta, al sur del último motorista", isRare: true },
    { name: "Revivir máximo", quantity: 1, weight: 1, locationDescription: "Detrás de una roca", isRare: true },
    { name: "Restaura todo", quantity: 1, weight: 1, locationDescription: "Antes del primer cartel del camino central (oculto)", isRare: true },
    { name: "Caramelo raro", quantity: 1, weight: 1, locationDescription: "En la parte central del área de hierba alta", isRare: true }
  ],
  "Ruta 23": [
    { name: "Éter máximo", quantity: 1, weight: 1, locationDescription: "Oculto en la esquina noroeste de la isla norte", isRare: true },
    { name: "Ultraball", quantity: 1, weight: 1, locationDescription: "Oculta en el árbol al sur del arbusto", isRare: true },
    { name: "Restaura todo", quantity: 1, weight: 1, locationDescription: "Oculto en las rocas al oeste de la hierba alta", isRare: true }
  ],
  "Ruta 24": [
    { name: "Pepita", quantity: 1, weight: 1, locationDescription: "Escondida en el borde del estanque", isRare: true },
    { name: "Superpoción", quantity: 1, weight: 1, locationDescription: "En la orilla del estanque" }
  ],
  "Ruta 25": [
    { name: "Éter", quantity: 1, weight: 1, locationDescription: "Oculto cerca de la casa" },
    { name: "Elixir", quantity: 1, weight: 1, locationDescription: "Oculto en el muro tras el paso estrecho" }
  ],
  "Bosque Verde": [
    { name: "Poción", quantity: 1, weight: 3, locationDescription: "Cerca de árbol grande, en pasto u oculto cerca árbol y piedra", canRepeat: true },
    { name: "Antídoto", quantity: 1, weight: 2, locationDescription: "Detrás de árbol pequeño y en hierba alta", canRepeat: true },
    { name: "Pokéball", quantity: 1, weight: 1, locationDescription: "Entre unos arbustos" }
  ],
  "Mt. Moon": [
    { name: "Poción", quantity: 1, weight: 1, locationDescription: "Medio enterrada atrás de una roca" },
    { name: "Piedra Lunar", quantity: 1, weight: 1, locationDescription: "En la esquina de la cueva bajo la arena", isRare: true },
    { name: "Caramelo raro", quantity: 1, weight: 1, locationDescription: "Al lado de un montículo de tierra", isRare: true }
  ],
  "Mt. Moon (Nivel -1)": [
    { name: "Antídoto", quantity: 1, weight: 1, locationDescription: "Al oeste de algo que parecen fósiles" },
    { name: "Cuerda Huida", quantity: 1, weight: 1, locationDescription: "Subiendo al otro lado de una excavación poco profunda" },
    { name: "Anti paralizar", quantity: 1, weight: 1, locationDescription: "A la izquierda de una gran maleza" },
    { name: "Éter", quantity: 1, weight: 1, locationDescription: "Lo encuentras en lo que parece ser una excavación poco profunda" }
  ],
  "Mt. Moon (Nivel -2)": [
    { name: "Superball", quantity: 1, weight: 1, locationDescription: "Enterrada tropiezas con ella" },
    { name: "Poción", quantity: 1, weight: 1, locationDescription: "Detrás de un entrenador despistado" },
    { name: "Revivir", quantity: 1, weight: 1, locationDescription: "Al norte de la escalera para bajar a este nivel" },
    { name: "Piedra Lunar", quantity: 1, weight: 1, locationDescription: "Al lado de otro montón de piedras comunes", isRare: true }
  ],
  "Central Eléctrica": [
    { name: "Caramelo raro", quantity: 1, weight: 1, locationDescription: "Encima de una mesa en la sala", isRare: true },
    { name: "Superball", quantity: 1, weight: 1, locationDescription: "En una esquina tras el estante" },
    { name: "Piedra Trueno", quantity: 1, weight: 1, locationDescription: "Cerca de un basurero en una esquina", isRare: true },
    { name: "Elíxir máximo", quantity: 1, weight: 1, locationDescription: "En la última silla de la sala", isRare: true }
  ],
  "Torre Pokémon": [
    { name: "Despertar", quantity: 1, weight: 1, locationDescription: "Detrás de un basurero" },
    { name: "Cuerda Huida", quantity: 1, weight: 1, locationDescription: "En una esquina empolvada" }
  ],
  "Torre Pokémon (Planta 2)": [
    { name: "Pepita", quantity: 1, weight: 1, locationDescription: "En la parte sur cerca de unos diarios", isRare: true },
    { name: "Elixir", quantity: 1, weight: 1, locationDescription: "Cerca de unas escaleras" }
  ],
  "Torre Pokémon (Planta 3)": [
    { name: "Superpoción", quantity: 1, weight: 1, locationDescription: "En una esquina debajo de una alfombra" },
    { name: "Caramelo raro", quantity: 1, weight: 1, locationDescription: "En el centro de la planta", isRare: true }
  ],
  "Zona Safari (Central)": [
    { name: "Pepita", quantity: 1, weight: 1, locationDescription: "Detrás de unos arbustos", isRare: true }
  ],
  "Zona Safari (Área 1)": [
    { name: "Poción", quantity: 1, weight: 1, locationDescription: "Sobre unas raíces" },
    { name: "Poción máxima", quantity: 1, weight: 1, locationDescription: "Detrás de unas piedras", isRare: true }
  ],
  "Zona Safari (Área 2)": [
    { name: "Revivir máximo", quantity: 1, weight: 1, locationDescription: "Al lado de un letrero", isRare: true }
  ],
  "Zona Safari (Área 3)": [
    { name: "Revivir", quantity: 1, weight: 1, locationDescription: "Escondida en la hierba" },
    { name: "Revivir máximo", quantity: 1, weight: 1, locationDescription: "Detrás del letrero entre unos arbustos", isRare: true }
  ],
  "Zona Safari (Pesca)": [
    { name: "Ultraball", quantity: 1, weight: 1, locationDescription: "Pescando encontraste esto", isRare: true },
    { name: "Piedra Agua", quantity: 1, weight: 1, locationDescription: "Pescando encontraste esto", isRare: true }
  ],
  "Islas Espuma": [
    { name: "Pepita", quantity: 1, weight: 1, locationDescription: "Al lado de una roca", isRare: true },
    { name: "Elixir", quantity: 1, weight: 1, locationDescription: "Cerca de un charco en el suelo" }
  ],
  "Islas Espuma (Nivel -2)": [
    { name: "Ultraball", quantity: 1, weight: 1, locationDescription: "Cerca de una madriguera de algún Pokémon", isRare: true }
  ],
  "Islas Espuma (Nivel -3)": [
    { name: "Superball", quantity: 1, weight: 1, locationDescription: "En el lodo" },
    { name: "Superpoción", quantity: 1, weight: 1, locationDescription: "Cerca del charco" }
  ],
  "Calle Victoria": [
    { name: "Caramelo raro", quantity: 1, weight: 1, locationDescription: "Bajo unas ramas en el suelo", isRare: true },
    { name: "Superball", quantity: 1, weight: 1, locationDescription: "Encima de una roca plana" }
  ],
  "Calle Victoria (Nivel 2)": [
    { name: "Ultraball", quantity: 1, weight: 1, locationDescription: "Dentro de una madriguera", isRare: true },
    { name: "Restaura todo", quantity: 1, weight: 1, locationDescription: "A medio enterrar en una esquina", isRare: true },
    { name: "Cura Total", quantity: 1, weight: 1, locationDescription: "Cerca de una madriguera en el suelo" }
  ],
  "Calle Victoria (Nivel 3)": [
    { name: "Hiperpoción", quantity: 1, weight: 1, locationDescription: "Detrás de unas piedras esparcidas en el suelo" },
    { name: "Revivir máximo", quantity: 1, weight: 1, locationDescription: "Cerca de un entrenador despistado", isRare: true }
  ],
  "Cueva Celeste": [
    { name: "Caramelo raro", quantity: 1, weight: 1, locationDescription: "En una roca a simple vista", isRare: true },
    { name: "Restaura todo", quantity: 1, weight: 1, locationDescription: "Cerca de unas ramas que están en el suelo", isRare: true },
    { name: "Ultraball", quantity: 3, weight: 1, locationDescription: "En montículo, detrás de plantas secas y a medio enterrar", isRare: true, canRepeat: true },
    { name: "Revivir máximo", quantity: 1, weight: 1, locationDescription: "A simple vista sobre unas piedras", isRare: true },
    { name: "Pepita", quantity: 1, weight: 1, locationDescription: "En el suelo al lado de unas piedras pequeñas", isRare: true },
    { name: "Elíxir máximo", quantity: 1, weight: 1, locationDescription: "Cerca del río", isRare: true }
  ],
  "Silph S.A.": [
    { name: "Cura Total", quantity: 1, weight: 1, locationDescription: "En la esquina de una mesa" },
    { name: "Hiperpoción", quantity: 1, weight: 1, locationDescription: "En la parte este del piso" },
    { name: "Cuerda Huida", quantity: 1, weight: 1, locationDescription: "Detrás de un estante" }
  ],
  "Silph S.A. (piso 2)": [
    { name: "Revivir máximo", quantity: 1, weight: 1, locationDescription: "En la orilla de una habitación oscura", isRare: true },
    { name: "Elixir", quantity: 1, weight: 1, locationDescription: "Oculto detrás de una maceta" }
  ],
  "Silph S.A. (piso 3)": [
    { name: "Éter", quantity: 1, weight: 1, locationDescription: "Dentro de un basurero" },
    { name: "Poción máxima", quantity: 1, weight: 1, locationDescription: "Encima de una mesa en una habitación", isRare: true }
  ],
  "Silph S.A. (piso 4)": [
    { name: "Caramelo raro", quantity: 1, weight: 1, locationDescription: "Sobre una silla de escritorio", isRare: true },
    { name: "Hiperpoción", quantity: 1, weight: 1, locationDescription: "Detrás de un escritorio" }
  ],
  "Guarida Rocket (Sub 1)": [
    { name: "Pepita", quantity: 1, weight: 1, locationDescription: "Sobre unas baldosas", isRare: true },
    { name: "Cuerda Huida", quantity: 1, weight: 1, locationDescription: "Debajo de una mesa" },
    { name: "Superpoción", quantity: 1, weight: 1, locationDescription: "Detrás de un basurero" }
  ],
  "Guarida Rocket (Sub 2)": [
    { name: "Piedra Lunar", quantity: 1, weight: 1, locationDescription: "En un cajón de un escritorio", isRare: true },
    { name: "Hiperpoción", quantity: 1, weight: 1, locationDescription: "Detrás de un estante oculta" },
    { name: "Superpoción", quantity: 1, weight: 1, locationDescription: "Sobre una mesa en la esquina" }
  ],
  "Guarida Rocket (Sub 3)": [
    { name: "Caramelo raro", quantity: 1, weight: 1, locationDescription: "En el suelo bajo una silla", isRare: true },
    { name: "Pepita", quantity: 1, weight: 1, locationDescription: "Oculto en un cajón de un escritorio", isRare: true }
  ],
  "S.S. Anne": [
    { name: "Superball", quantity: 1, weight: 1, locationDescription: "En una esquina detrás de una planta falsa" },
    { name: "Éter", quantity: 1, weight: 1, locationDescription: "Debajo del escritorio de un camarote" }
  ],
  "S.S. Anne (Sótano)": [
    { name: "Caramelo raro", quantity: 1, weight: 1, locationDescription: "En la cocina, detrás de unos estantes", isRare: true },
    { name: "Éter máximo", quantity: 1, weight: 1, locationDescription: "Bajo la alfombra, tropezaste con esto", isRare: true },
    { name: "Pokéball", quantity: 1, weight: 1, locationDescription: "Dentro de un basurero" }
  ],
  "S.S. Anne (Cubierta)": [
    { name: "Hiperpoción", quantity: 1, weight: 1, locationDescription: "Cerca del ancla oculta" }
  ],
  "Mansión Pokémon": [
    { name: "Piedra Lunar", quantity: 1, weight: 1, locationDescription: "Detrás de un pilar", isRare: true },
    { name: "Cuerda Huida", quantity: 1, weight: 1, locationDescription: "Al lado de la alfombra" }
  ],
  "Mansión Pokémon (Planta 2)": [
    { name: "Superball", quantity: 1, weight: 1, locationDescription: "Cerca de un mueble de madera" }
  ],
  "Mansión Pokémon (Sótano)": [
    { name: "Cura Total", quantity: 1, weight: 1, locationDescription: "Sobre un escritorio" }
  ]
};