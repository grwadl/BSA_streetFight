import {controls} from "../../constants/controls";
import {createElement} from "../helpers/domHelper";

export async function fight(firstFighter, secondFighter) {
    const healthBarLeft = document.querySelector('#left-fighter-indicator');
    const healthBarRight = document.querySelector('#right-fighter-indicator');
    let comboFirstPlayer = [], comboSecondPlayer = [];
    let startFirstPlayerHealth = firstFighter.health, startSecondPlayerHealth = secondFighter.health;
    let fightersModels = document.querySelectorAll('.arena___fighter');
    const indicators = document.querySelectorAll('.arena___fighter-indicator');
    const minusHPleft = createElement({tagName: 'span', className: 'minusHP'});
    const minusHPRight = createElement({tagName: 'span', className: 'minusHP'});
    indicators[0].appendChild(minusHPleft);
    indicators[1].appendChild(minusHPRight);
    const fighterImgWrapper = document.querySelectorAll('.arena___fighter');
    const setPlayerRunning = (imgWrapper) => {
        imgWrapper.children[0].classList.add('punching');
        setTimeout(() => imgWrapper.children[0].classList.remove('punching'), 300);
    }
    const indicateCrit = (fighterModel) => {
        fighterModel.classList.add('critHit');
        setTimeout(() => fighterModel.classList.remove('critHit'), 400);
    }
    const handlePunch = (power, minusHp, defender, healthBar, startHp, fighterModel,indicator) => {
        indicator.removeChild(minusHp);
        indicator.appendChild(minusHp);
        minusHp.innerText = `-${Math.round(power)}`;
        setTimeout(() => minusHp.innerText = '', 400)
        defender.health < 20 ? healthBar.style.backgroundColor = 'red' : '';
        power === 0 ? fighterModel.classList.add('dodged') : defender.health -= power;
        setTimeout(() => fighterModel.classList.remove('dodged'), 400)
        if (power) {
            fighterModel.classList.add('punched');
            setTimeout(() => fighterModel.classList.remove('punched'), 200)
        }
        healthBar.style.width = defender.health > 0 ? `${(defender.health * 100) / startHp}%` : '0%';
        defender.health < 20 ? healthBar.style.backgroundColor = 'red' : '';
    }
    const setBlock = (fighterModel, fighter) => {
        fighterModel.classList.add('onBlock')
        return fighter.block = true;
    }
    const removeBlock = (fighterModel, fighter) => {
        fighterModel.classList.remove('onBlock')
        return fighter.block = false;
    }
    const critPunch = (controlsStr, combo, atacker,e) => {
        combo.push(e.code);
        let power = 0;
        if (combo.includes(controlsStr[0])&&(combo.includes(controlsStr[1])&&(combo.includes(controlsStr[2])))) {
                combo = [];
                power = getCrit(atacker);
                atacker.ableCrit = false;
                setTimeout(() => atacker.ableCrit = true, 10000);
        }
        return [atacker, combo, power]
    }
    return new Promise((resolve) => {
        const onResolve = (atacker,defender,fighterModel)=>{
             if(defender.health <= 0) {
                 fighterModel.classList.add('beaten')
                 resolve({winner:atacker})
             }
        }
        const keyDownHandler = e => {
            if (firstFighter.ableCrit && !firstFighter.block) {
                let power = 0;
                [firstFighter, comboFirstPlayer, power] = critPunch(controls.PlayerOneCriticalHitCombination, comboFirstPlayer, firstFighter,e);
                if (power) {
                    setPlayerRunning(fighterImgWrapper[0]);
                    indicateCrit(fightersModels[0]);
                    handlePunch(power, minusHPRight, secondFighter, healthBarRight, startSecondPlayerHealth, fightersModels[1],indicators[1])
                    return onResolve(firstFighter,secondFighter,fightersModels[1]);
                }
            }
            if (secondFighter.ableCrit && !secondFighter.block) {
                let power = 0;
                [secondFighter, comboSecondPlayer, power] = critPunch(controls.PlayerTwoCriticalHitCombination, comboSecondPlayer, secondFighter,e);
                if (power) {
                    setPlayerRunning(fighterImgWrapper[1]);
                    indicateCrit(fightersModels[1]);
                    handlePunch(power, minusHPleft, firstFighter, healthBarLeft, startFirstPlayerHealth, fightersModels[0],indicators[0])
                    return onResolve(secondFighter,firstFighter,fightersModels[0]);
                }
            }
            switch (e.code) {
                case controls.PlayerOneBlock:
                    return firstFighter.block = setBlock(fightersModels[0], firstFighter);
                case controls.PlayerTwoBlock:
                    return secondFighter.block = setBlock(fightersModels[1], secondFighter);
            }
        }
        const keyUpHandler = e => {
            if (controls.PlayerTwoCriticalHitCombination.includes(e.code))
                comboSecondPlayer = [];
            if (controls.PlayerOneCriticalHitCombination.includes(e.code))
                comboFirstPlayer = [];
            switch (e.code) {
                case controls.PlayerOneBlock:
                    return firstFighter.block = removeBlock(fightersModels[0],firstFighter)
                case controls.PlayerTwoBlock:
                    return secondFighter.block = removeBlock(fightersModels[1],secondFighter)
            }
        }
        const keyPressHandler = e => {
            switch (e.code) {
                case controls.PlayerOneAttack: {
                    setPlayerRunning(fighterImgWrapper[0]);
                    const power = getDamage(firstFighter, secondFighter);
                    handlePunch(power, minusHPRight, secondFighter, healthBarRight, startSecondPlayerHealth, fightersModels[1],indicators[1])
                    return onResolve(firstFighter,secondFighter,fightersModels[1]);
                }
                case controls.PlayerTwoAttack: {
                    setPlayerRunning(fighterImgWrapper[1]);
                    const power = getDamage(secondFighter, firstFighter);
                    handlePunch(power, minusHPleft, firstFighter, healthBarLeft, startFirstPlayerHealth, fightersModels[0],indicators[0])
                    return onResolve(secondFighter,firstFighter,fightersModels[0]);
                }
            }
        }
        document.body.addEventListener("keydown", keyDownHandler)
        document.body.addEventListener("keyup", keyUpHandler);
        document.body.addEventListener('keypress',keyPressHandler);
    });
}

export function getDamage(attacker, defender) {
    const hitPower = getHitPower(attacker);
    const blockPower = getBlockPower(defender);
    const damage = hitPower - blockPower;
    if (!attacker.block)
        if (defender.block) {
            return damage <= 0 ? 0 : damage;
        } else
            return hitPower;
    return 0;
}

export function getHitPower(fighter) {
    const criticalHitChance = Math.random() + 1;
    return fighter.attack * criticalHitChance;
}

export const getCrit = fighter => {
    return fighter.attack * 2;
}

export function getBlockPower(fighter) {
    const dodgeChance = Math.random() + 1;
    return fighter.defense * dodgeChance;
}
