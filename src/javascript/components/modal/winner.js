import {showModal} from "./modal";
import {createElement} from "../../helpers/domHelper";
import {createFighterImage} from "../fighterPreview";

export function showWinnerModal(player) {
  const winner = createElement({tagName:'h3',className:'winnerName'})
  const img = createFighterImage(player);
  winner.appendChild(img);
  showModal({title:'The winner is ' + player.name,bodyElement:winner});
}
