import {controls} from "../../constants/controls";

const setLeftPlayerRunning = () => {
    const img = document.querySelector('.arena___left-fighter');
    img.children[0].classList.add('punching');
    setTimeout(() => img.children[0].classList.remove('punching'), 300);
}
const setRightPlayerRunning = () => {
    const img = document.querySelector('.arena___right-fighter');
    img.children[0].classList.add('punching1');
    setTimeout(() => img.children[0].classList.remove('punching1'), 300);
}

export async function fight(firstFighter, secondFighter) {
    const healthBarLeft = document.querySelector('#left-fighter-indicator');
    const healthBarRight = document.querySelector('#right-fighter-indicator');
    let comboFirstPlayer = '';
    let comboSecondPlayer = '';
    let playerOneIsAbleToCrit = true;
    let playerTwoIsAbleToCrit = true;
    let startFirstPlayerHealth = firstFighter.health;
    let startSecondPlayerHealth = secondFighter.health;
    return new Promise((resolve) => {
        document.body.addEventListener("keydown", e => {
            switch (e.code) {
                case controls.PlayerOneBlock:
                    return firstFighter.block = true;
                case controls.PlayerTwoBlock:
                    return secondFighter.block = true;
                default:
                    return null;
            }
        })
        document.body.addEventListener("keyup", e => {
            switch (e.code) {
                case controls.PlayerOneBlock:
                    return firstFighter.block = false;
                case controls.PlayerTwoBlock:
                    return secondFighter.block = false;
                default:
                    return null;
            }
        });
        document.body.addEventListener('keypress', e => {
            const critPunchFirst = () => { //сложно обрабатывать одновременные нажатия клавиш сразу для двух сущностей в одном методе/функции
                comboFirstPlayer += e.code;
                if (controls.PlayerOneCriticalHitCombination.join('').includes(comboFirstPlayer)) {
                    if ((controls.PlayerOneCriticalHitCombination.join('') === comboFirstPlayer)) {
                        setLeftPlayerRunning();
                        comboFirstPlayer = '';
                        playerOneIsAbleToCrit = false;
                        secondFighter.health = getCrit(firstFighter,secondFighter);
                        setTimeout(() => playerOneIsAbleToCrit = true, 10000);
                       return  healthBarRight.style.width = `${(secondFighter.health * 100) / startSecondPlayerHealth}%`;
                    }
                } else {
                    comboFirstPlayer = '';
                }
            }
            const critPunchSecond = () => {
                comboSecondPlayer += e.code;
                if (controls.PlayerTwoCriticalHitCombination.join('').includes(comboSecondPlayer)) {
                    if ((controls.PlayerTwoCriticalHitCombination.join('') === comboSecondPlayer)) {
                        setRightPlayerRunning();
                        comboSecondPlayer = '';
                        firstFighter.health = getCrit(secondFighter,firstFighter);
                        playerTwoIsAbleToCrit = false;
                        setTimeout(() => playerTwoIsAbleToCrit = true, 10000);
                        return healthBarLeft.style.width = `${(firstFighter.health * 100) / startFirstPlayerHealth}%`;
                    }
                } else {
                    comboSecondPlayer = '';
                }
            }
            if (playerOneIsAbleToCrit)
                critPunchFirst()
            if (playerTwoIsAbleToCrit)
                critPunchSecond()
            if (firstFighter?.health <= 0)
                resolve(secondFighter);
            else if (secondFighter?.health <= 0)
                resolve(firstFighter);
            switch (e.code) {
                case controls.PlayerOneAttack: {
                    setLeftPlayerRunning();
                    secondFighter.health = getDamage(firstFighter, secondFighter);
                    return healthBarRight.style.width = `${(secondFighter.health * 100) / startSecondPlayerHealth}%`;
                }
                case controls.PlayerTwoAttack: {
                    setRightPlayerRunning();
                    firstFighter.health = getDamage(secondFighter, firstFighter);
                    return healthBarLeft.style.width = `${(firstFighter.health * 100) / startFirstPlayerHealth}%`;
                }
                default:
                    return null;
            }

        })
    });

}

export function getDamage(attacker, defender) {
    const hitPower = getHitPower(attacker);
    const blockPower = getBlockPower(defender);
    if (!attacker.block) {
        if (defender.block === true)
            blockPower > hitPower ? defender.health : defender.health -= hitPower - blockPower;

        else
            defender.health -=hitPower;
    }
    return defender.health;
}

export function getHitPower(fighter) {
    const criticalHitChance = Math.random() + 1;
    const power = fighter.attack + criticalHitChance;
    return power;
}

export function getCrit(fighter, defender) {
    return defender.health -= fighter.attack * 2;
}

export function getBlockPower(fighter) {
    const dodgeChance = Math.random() + 1;
    const power = fighter.defense * dodgeChance;
    return power;
}
