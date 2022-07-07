import Block from '../../core/block/Block';
import './Loader.css';

export default class Loader extends Block {
  render() {
    let cl;
    if (this.props.className) {
      cl = this.props.className;
    } else {
      cl = '';
    }
    const temp = `
                  <div class="spinner-border ${cl}" role="status">
                        <span class="sr-only">Loading...</span>
                  </div>
                    `;
    // В данном случае render возвращает строкой разметку из шаблонизатора
    return this.compile(temp, this.props);
  }
}
