import {showModal} from "./modal";
import {createElement} from "../../helpers/domHelper";

export function showWinnerModal(player) {
  const winner = createElement({tagName:'h3',className:'winnerName'})
  winner.innerText = player;
  showModal({title:'RESULT',bodyElement:winner});
}
