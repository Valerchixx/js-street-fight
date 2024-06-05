import createElement from '../helpers/domHelper';

function createDetailsElement(fighter, property) {
    const element = createElement({ tagName: 'span' });
    element.innerText = `${property}: ${fighter[property]}`;
    return element;
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
        attributes
    });

    return imgElement;
}

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });
    const fighterImage = createFighterImage(fighter);
    const healthElement = createDetailsElement(fighter, 'health');
    const nameElement = createDetailsElement(fighter, 'name');
    const attackElement = createDetailsElement(fighter, 'attack');
    const defenseElement = createDetailsElement(fighter, 'defense');

    fighterElement.append(nameElement, healthElement, attackElement, defenseElement, fighterImage);

    return fighterElement;
}
