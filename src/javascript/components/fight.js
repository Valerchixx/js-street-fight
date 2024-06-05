import controls from '../../constants/controls';

export function getHitPower(fighter) {
    const { attack } = fighter;
    const criticalHitChance = Math.random() * (2 - 1 + 1) + 1;
    const power = attack * criticalHitChance;
    return power;
}

export function getBlockPower(fighter) {
    const { defense } = fighter;
    const dodgeChance = Math.random() * (2 - 1 + 1) + 1;
    const power = defense * dodgeChance;
    return power;
}
export function getDamage(attacker, defender) {
    const hitPower = getHitPower(attacker);
    const blockPower = getBlockPower(defender);
    const damage = hitPower - blockPower;
    return Math.max(0, damage);
}

export async function fight(firstFighter, secondFighter) {
    const rightHealthBar = document.getElementById('right-fighter-indicator');
    const leftHealthBar = document.getElementById('left-fighter-indicator');
    const pressedKeys = new Set();

    const fighterOne = {
        ...firstFighter,
        currentHealth: firstFighter.health,
        attacking: false,
        blocking: false,
        healthBar: leftHealthBar,
        isCriticalActive: true
    };
    const fighterTwo = {
        ...secondFighter,
        currentHealth: secondFighter.health,
        attacking: false,
        blocking: false,
        healthBar: rightHealthBar,
        isCriticalActive: true
    };

    return new Promise(resolve => {
        function makeAttack(fighterAttacker, fighterDefender, damage) {
            const attacker = fighterAttacker;
            const defender = fighterDefender;
            attacker.attacking = true;
            defender.currentHealth -= damage;
            const barWidth = Math.max(0, (defender.currentHealth / defender.health) * 100);

            defender.healthBar.style.width = `${barWidth}%`;

            if (defender.currentHealth <= 0) {
                resolve(attacker);
            }
        }
        function attack(attacker, defender) {
            if (!attacker.blocking && !defender.blocking) {
                const damage = getDamage(attacker, defender);
                makeAttack(attacker, defender, damage);
            }
        }

        function isCriticalAttack(pressed, combination, attacker) {
            return combination.every(key => pressed.has(key)) && attacker.isCriticalActive;
        }

        function criticalAttack(fighterAttacker, fighterDefender) {
            const attacker = fighterAttacker;
            const defender = fighterDefender;
            const damage = 2 * attacker.attack;

            makeAttack(attacker, defender, damage);
            attacker.isCriticalActive = false;

            setTimeout(() => {
                attacker.isCriticalActive = true;
            }, 10000);
        }
        function keyDownHandler(event) {
            if (!event.repeat) {
                switch (event.code) {
                    case controls.PlayerOneAttack: {
                        attack(fighterOne, fighterTwo);
                        break;
                    }
                    case controls.PlayerTwoAttack: {
                        attack(fighterTwo, fighterOne);
                        break;
                    }
                    case controls.PlayerOneBlock: {
                        fighterOne.blocking = true;
                        break;
                    }
                    case controls.PlayerTwoBlock: {
                        fighterTwo.blocking = true;
                        break;
                    }
                    default: {
                        pressedKeys.add(event.code);
                        if (isCriticalAttack(pressedKeys, controls.PlayerOneCriticalHitCombination, fighterOne)) {
                            criticalAttack(fighterOne, fighterTwo);
                        } else if (
                            isCriticalAttack(pressedKeys, controls.PlayerTwoCriticalHitCombination, fighterTwo)
                        ) {
                            criticalAttack(fighterTwo, fighterOne);
                        }
                        break;
                    }
                }
            }
        }

        function keyUpHandler(event) {
            switch (event.code) {
                case controls.PlayerOneAttack: {
                    fighterOne.attacking = false;
                    break;
                }
                case controls.PlayerTwoAttack: {
                    fighterTwo.attacking = false;
                    break;
                }
                case controls.PlayerOneBlock: {
                    fighterOne.blocking = false;
                    break;
                }
                case controls.PlayerTwoBlock: {
                    fighterTwo.blocking = false;
                    break;
                }
                default: {
                    pressedKeys.delete(event.code);
                    break;
                }
            }
        }
        window.addEventListener('keydown', event => keyDownHandler(event));
        window.addEventListener('keyup', event => keyUpHandler(event));
    });
}
