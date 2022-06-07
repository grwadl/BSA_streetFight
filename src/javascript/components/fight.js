import {controls} from "../../constants/controls";
import {createElement} from "../helpers/domHelper";

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
    let fightersModels = document.querySelectorAll('.arena___fighter');
    const indicators = document.querySelectorAll('.arena___fighter-indicator');
    const minusHPleft = createElement({tagName:'span',className:'minusHP'});
    const minusHPRight = createElement({tagName:'span',className:'minusHP'});
    indicators[0].appendChild(minusHPleft);
    indicators[1].appendChild(minusHPRight);
    const indicateDamage = (minusHP,power) =>{
        minusHP.innerText = `-${Math.ceil(power)}`;
        setTimeout(()=>minusHP.innerText ='',400)
    }
    return new Promise((resolve) => {
        document.body.addEventListener("keydown", e => {
            switch (e.code) {
                case controls.PlayerOneBlock: {
                    fightersModels[0].classList.add('onBlock')
                    return firstFighter.block = true;
                }
                case controls.PlayerTwoBlock: {
                    fightersModels[1].classList.add('onBlock')
                    return secondFighter.block = true;
                }
                default:
                    return null;
            }
        })
        document.body.addEventListener("keyup", e => {
            switch (e.code) {
                case controls.PlayerOneBlock: {
                    fightersModels[0].classList.remove('onBlock')
                    return firstFighter.block = false;
                }
                case controls.PlayerTwoBlock: {
                    fightersModels[1].classList.remove('onBlock')
                    return secondFighter.block = false;
                }
                default:
                    return null;
            }
        });
        document.body.addEventListener('keypress', e => {
            const critPunchFirst = () => {
                comboFirstPlayer += e.code;
                if (controls.PlayerOneCriticalHitCombination.join('').includes(comboFirstPlayer)) {
                    if ((controls.PlayerOneCriticalHitCombination.join('') === comboFirstPlayer)) {
                        setLeftPlayerRunning();
                        comboFirstPlayer = '';
                        playerOneIsAbleToCrit = false;
                        const power =  getCrit(firstFighter);
                        indicateDamage(minusHPRight,power);
                        secondFighter.health -= power;
                        setTimeout(() => playerOneIsAbleToCrit = true, 10000);
                        healthBarRight.style.width = secondFighter.health>0
                            ?`${(secondFighter.health * 100) / startSecondPlayerHealth}%`:'0%';
                        return secondFighter.health <= 0 ? resolve(firstFighter) : null;
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
                        const power =  getCrit(secondFighter);
                        indicateDamage(minusHPleft,power);
                        firstFighter.health -= power;
                        playerTwoIsAbleToCrit = false;
                        setTimeout(() => playerTwoIsAbleToCrit = true, 10000);
                        healthBarLeft.style.width = firstFighter.health > 0 ?
                            `${(firstFighter.health * 100) / startFirstPlayerHealth}%` : '0%';
                        return firstFighter.health <= 0 ? resolve(secondFighter) : null;
                    }
                } else {
                    comboSecondPlayer = '';
                }
            }
            if (playerOneIsAbleToCrit&&!firstFighter.block)
                critPunchFirst();
            if (playerTwoIsAbleToCrit&&!secondFighter.block)
                critPunchSecond();
            switch (e.code) {
                case controls.PlayerOneAttack: {
                    setLeftPlayerRunning();
                    const power=getDamage(firstFighter, secondFighter);
                    power === 0 ? fightersModels[1].classList.add('dodged') : secondFighter.health -= power;
                    indicateDamage(minusHPRight,power);
                    setTimeout(() => fightersModels[1].classList.remove('dodged'), 400)
                    healthBarRight.style.width = secondFighter.health > 0
                        ?`${(secondFighter.health * 100) / startSecondPlayerHealth}%`:'0%';
                    return secondFighter.health <= 0 ? resolve(firstFighter) : secondFighter.health;
                }
                case controls.PlayerTwoAttack: {
                    setRightPlayerRunning();
                    const power = getDamage(secondFighter, firstFighter);
                    power === 0 ? fightersModels[0].classList.add('dodged') : firstFighter.health -= power;
                    indicateDamage(minusHPleft,power);
                    setTimeout(() => fightersModels[0].classList.remove('dodged'), 400)
                    healthBarLeft.style.width = firstFighter.health > 0 ?
                        `${(firstFighter.health * 100) / startFirstPlayerHealth}%` : '0%';
                    return firstFighter.health <= 0 ? resolve(secondFighter) : firstFighter.health;
                }
            }
        })
    });

}

export function getDamage(attacker, defender) {
    const hitPower = getHitPower(attacker);
    const blockPower = getBlockPower(defender);
    const damage = hitPower - blockPower;
    if (!attacker.block) {
        if (defender.block) {
            return damage <= 0 ? 0 : damage;
        }
        else
            return hitPower;
    }
    return 0;
}

export function getHitPower(fighter) {
    const criticalHitChance = Math.random() + 1;
    const power = fighter.attack + criticalHitChance;
    return power;
}

export function getCrit(fighter) {
    return fighter.attack * 2;
}

export function getBlockPower(fighter) {
    const dodgeChance = Math.random() + 1;
    const power = fighter.defense * dodgeChance;
    return power;
}
