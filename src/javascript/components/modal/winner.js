import { createFighterImage } from '../fighterPreview';
import showModal from './modal';

export default function showWinnerModal(fighter) {
    const title = `Winner: ${fighter.name}`;
    const bodyElement = createFighterImage(fighter);
    showModal({ title, bodyElement, onClose: () => document.location.reload() });
}
