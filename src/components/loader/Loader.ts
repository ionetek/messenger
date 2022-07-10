import Block from '../../core/block/Block';
import './Loader.css';

export default class Loader extends Block {
  render() {
    const className = this.props.className ?? '';
    const temp = `
                  <div class="spinner-border ${className}" role="status">
                        <span class="sr-only">Loading...</span>
                  </div>
                    `;
    return this.compile(temp, this.props);
  }
}
