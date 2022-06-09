import {showModal} from "./modal";
import {createElement} from "../../helpers/domHelper";
import {createFighterImage} from "../fighterPreview";

export function showWinnerModal({winner}) {
    const winnerWrapper = createElement({tagName: 'div', className: 'winnerName'})
    const img = createFighterImage(winner);
    winnerWrapper.appendChild(img);
    showModal({
        title: 'The winner is ' + winner.name, bodyElement: winnerWrapper, onClose: () => document.location.reload()
    });
}
