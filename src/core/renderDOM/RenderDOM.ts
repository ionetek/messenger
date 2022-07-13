import Block from '../block/Block';

export default function renderDOM(block: Block) {
  const root = document.querySelector('#root');

  root!.innerHTML = '';
  root!.appendChild(block.getContent()!);
}
