enum HeroType {
    Warrior = "WARRIOR",
    Mage = "MAGE",
    Archer = "ARCHER"
}

enum AttackType {
    Physical = "PHYSICAL",
    Magical = "MAGICAL",
    Ranged = "RANGED"
}

interface HeroStats {
    health: number;
    attack: number;
    defense: number;
    speed: number;
}

interface Hero {
    id: number;
    name: string;
    type: HeroType;
    attackType: AttackType;
    stats: HeroStats;
    isAlive: boolean;
}

type AttackResult = {
    damage: number;
    isCritical: boolean;
    remainingHealth: number;
};

function createHero(name: string, type: HeroType): Hero {
    const baseStats: Record<HeroType, HeroStats> = {
        [HeroType.Warrior]: { health: 120, attack: 40, defense: 30, speed: 20 },
        [HeroType.Mage]: { health: 80, attack: 60, defense: 20, speed: 25 },
        [HeroType.Archer]: { health: 100, attack: 50, defense: 25, speed: 30 }
    };

    return {
        id: Date.now(),
        name,
        type,
        attackType: type === HeroType.Warrior ? AttackType.Physical : type === HeroType.Mage ? AttackType.Magical : AttackType.Ranged,
        stats: baseStats[type],
        isAlive: true
    };
}

function calculateDamage(attacker: Hero, defender: Hero): AttackResult {
    const baseDamage = attacker.stats.attack - defender.stats.defense / 2;
    const critical = Math.random() < 0.2;
    const damage = Math.max(baseDamage * (critical ? 2 : 1), 0);

    defender.stats.health -= damage;
    if (defender.stats.health <= 0) {
        defender.isAlive = false;
        defender.stats.health = 0;
    }

    return {
        damage,
        isCritical: critical,
        remainingHealth: defender.stats.health
    };
}

function findHeroByProperty<T extends keyof Hero>(
    heroes: Hero[],
    property: T,
    value: Hero[T]
): Hero | undefined {
    return heroes.find(hero => hero[property] === value);
}

function battleRound(hero1: Hero, hero2: Hero): string {
    if (!hero1.isAlive || !hero2.isAlive) {
        return `${!hero1.isAlive ? hero1.name : hero2.name} не може брати участь у бою, бо він мертвий.`;
    }

    const result1 = calculateDamage(hero1, hero2);
    const result2 = hero2.isAlive ? calculateDamage(hero2, hero1) : null;

    let outcome = `${hero1.name} атакує ${hero2.name} і завдає ${result1.damage} пошкоджень${result1.isCritical ? " (критичний удар!)" : ""}. Залишилось здоров'я: ${hero2.stats.health}.
`;

    if (result2) {
        outcome += `${hero2.name} відповідає ${hero1.name} і завдає ${result2.damage} пошкоджень${result2.isCritical ? " (критичний удар!)" : ""}. Залишилось здоров'я: ${hero1.stats.health}.
`;
    }

    return outcome;
}

const heroes: Hero[] = [
    createHero("Дмитро", HeroType.Warrior),
    createHero("Мерлін", HeroType.Mage),
    createHero("Леголас", HeroType.Archer)
];

console.log("=== Створені герої ===");
console.log(heroes);

console.log("\n=== Пошук героя за типом ===");
const foundHero = findHeroByProperty(heroes, "type", HeroType.Warrior);
console.log(foundHero);

console.log("\n=== Початок бою ===");
const battleResult = battleRound(heroes[0], heroes[1]);
console.log(battleResult);

console.log("\n=== Статистика після бою ===");
console.log(heroes);
