import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });
  let fighterPreviewImage,fighterPreviewInfo;
  if(fighter){
    fighterPreviewInfo = createElement({tagName:'h3',className:`fighter-preview__info`});
    fighterPreviewInfo.innerText = `Name: ${fighter.name}  Health:${fighter.health}
    Attack potential:${fighter.attack} Defence:${fighter.defense}`
    fighterPreviewImage = createFighterImage(fighter);
    fighterElement.appendChild(fighterPreviewInfo);
    fighterElement.appendChild(fighterPreviewImage);
  }
  return fighterElement;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = { 
    src: source, 
    title: name,
    alt: name 
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });

  return imgElement;
}
