import {createElement} from '../helpers/domHelper';
import {createFighterImage} from './fighterPreview';
import {fight, getCrit, getDamage} from "./fight";
import {controls} from "../../constants/controls";
import {showWinnerModal} from "./modal/winner";

export function renderArena(selectedFighters) {
    const root = document.getElementById('root');
    const arena = createArena(selectedFighters);
    const [firstPlayer, secondPlayer] = selectedFighters;
    let startFirstPlayerHealth = firstPlayer.health;
    let startSecondPlayerHealth = secondPlayer.health;
    root.innerHTML = '';
    root.append(arena);
    let comboFirstPlayer = '';
    let comboSecondPlayer = '';
    let playerOneIsAbleToCrit = true;
    let playerTwoIsAbleToCrit = true;
    const healthBarLeft = document.querySelector('#left-fighter-indicator');
    const healthBarRight = document.querySelector('#right-fighter-indicator');
    const setLeftPlayerRunning = ()=>{
        const img = document.querySelector('.arena___left-fighter');
        img.children[0].classList.add('punching');
        setTimeout(() => img.children[0].classList.remove('punching'), 300);
    }
    const setRightPlayerRunning = ()=>{
        const img = document.querySelector('.arena___right-fighter');
        img.children[0].classList.add('punching1');
        setTimeout(() => img.children[0].classList.remove('punching1'), 300);
    }
    document.body.addEventListener("keypress", e => { //я не придумал способа чтоб не дублировать код для 100% крита :(
        const critPunchFirst = () => { //сложно обрабатывать одновременные нажатия клавиш сразу для двух сущностей в одном методе/функции
            comboFirstPlayer += e.code;
            if (controls.PlayerOneCriticalHitCombination.join('').includes(comboFirstPlayer)) {
                if ((controls.PlayerOneCriticalHitCombination.join('') === comboFirstPlayer)) {
                    setLeftPlayerRunning();
                    comboFirstPlayer = '';
                    playerOneIsAbleToCrit = false;
                    secondPlayer.health = getCrit(firstPlayer,secondPlayer);
                    setTimeout(() => playerOneIsAbleToCrit = true, 10000);
                    healthBarRight.style.width = `${(secondPlayer.health * 100) / startSecondPlayerHealth}%`;
                    return fight(firstPlayer, secondPlayer).then(res => showWinnerModal(res));
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
                    firstPlayer.health = getCrit(secondPlayer,firstPlayer);
                    playerTwoIsAbleToCrit = false;
                    setTimeout(() => playerTwoIsAbleToCrit = true, 10000);
                    healthBarLeft.style.width = `${(firstPlayer.health * 100) / startFirstPlayerHealth}%`;
                    return fight(firstPlayer, secondPlayer).then(res => showWinnerModal(res));
                }
            } else {
                comboSecondPlayer = '';
            }
        }
        if (playerOneIsAbleToCrit)
            critPunchFirst()
        if (playerTwoIsAbleToCrit)
            critPunchSecond()
        switch (e.code) {
            case controls.PlayerOneAttack: {
                setLeftPlayerRunning();
                secondPlayer.health = getDamage(firstPlayer, secondPlayer);
                healthBarRight.style.width = `${(secondPlayer.health * 100) / startSecondPlayerHealth}%`;
                return fight(firstPlayer, secondPlayer).then(res => showWinnerModal(res));
            }
            case controls.PlayerTwoAttack: {
                setRightPlayerRunning();
                firstPlayer.health = getDamage(secondPlayer, firstPlayer);
                healthBarLeft.style.width = `${(firstPlayer.health * 100) / startFirstPlayerHealth}%`;
                return fight(firstPlayer, secondPlayer).then(res => showWinnerModal(res));
            }
            default:
                return null;
        }
    })
    document.body.addEventListener("keydown", e => {
        switch (e.code) {
            case controls.PlayerOneBlock:
                return firstPlayer.block = true;
            case controls.PlayerTwoBlock:
                return secondPlayer.block = true;
            default:
                return null;
        }
    })
    document.body.addEventListener("keyup", e => {
        switch (e.code) {
            case controls.PlayerOneBlock:
                return firstPlayer.block = false;
            case controls.PlayerTwoBlock:
                return secondPlayer.block = false;
            default:
                return null;
        }
    });
}


function createArena(selectedFighters) {
    const arena = createElement({tagName: 'div', className: 'arena___root'});
    const healthIndicators = createHealthIndicators(...selectedFighters);
    const fighters = createFighters(...selectedFighters);

    arena.append(healthIndicators, fighters);
    return arena;
}

function createHealthIndicators(leftFighter, rightFighter) {
    const healthIndicators = createElement({tagName: 'div', className: 'arena___fight-status'});
    const versusSign = createElement({tagName: 'div', className: 'arena___versus-sign'});
    const leftFighterIndicator = createHealthIndicator(leftFighter, 'left');
    const rightFighterIndicator = createHealthIndicator(rightFighter, 'right');

    healthIndicators.append(leftFighterIndicator, versusSign, rightFighterIndicator);
    return healthIndicators;
}

function createHealthIndicator(fighter, position) {
    const {name} = fighter;
    const container = createElement({tagName: 'div', className: 'arena___fighter-indicator'});
    const fighterName = createElement({tagName: 'span', className: 'arena___fighter-name'});
    const indicator = createElement({tagName: 'div', className: 'arena___health-indicator'});
    const bar = createElement({
        tagName: 'div',
        className: 'arena___health-bar',
        attributes: {id: `${position}-fighter-indicator`}
    });

    fighterName.innerText = name;
    indicator.append(bar);
    container.append(fighterName, indicator);

    return container;
}

function createFighters(firstFighter, secondFighter) {
    const battleField = createElement({tagName: 'div', className: `arena___battlefield`});
    const firstFighterElement = createFighter(firstFighter, 'left');
    const secondFighterElement = createFighter(secondFighter, 'right');

    battleField.append(firstFighterElement, secondFighterElement);
    return battleField;
}

function createFighter(fighter, position) {
    const imgElement = createFighterImage(fighter);
    const positionClassName = position === 'right' ? 'arena___right-fighter' : 'arena___left-fighter';
    const fighterElement = createElement({
        tagName: 'div',
        className: `arena___fighter ${positionClassName}`,
    });

    fighterElement.append(imgElement);
    return fighterElement;
}
