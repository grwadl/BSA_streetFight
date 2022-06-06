export async function fight(firstFighter, secondFighter) {
    return new Promise((resolve) => {
        if (firstFighter.health <=0)
            resolve('Player 2 WIN');
        else if (secondFighter.health <= 0)
            resolve('Player 1 WIN');
    });
}

export function getDamage(attacker, defender) {
    const hitPower = getHitPower(attacker);
    const blockPower = getBlockPower(defender);
    if(!attacker.block){
        if (defender.block === true)
            blockPower>hitPower?defender.health:defender.health -=hitPower- blockPower;

        else
            defender.health -= getHitPower(attacker);
    }
 return defender.health;
}

export function getHitPower(fighter) {
    const criticalHitChance =Math.random() +1;
    const power =  fighter.attack + criticalHitChance;
    return power;
}
export function getCrit(fighter,defender) {
    return defender.health-=fighter.attack*2;
}
export function getBlockPower(fighter) {
    const dodgeChance =Math.random() +1;
    const power = fighter.defense*dodgeChance;
    console.log()
    return power;
}
