import Block from '../../core/block/Block';
import Image500 from './500.svg';

export default class Error404 extends Block {
  constructor(props: TProps) {
    document.title = 'Oops something went wrong';
    super(props);
  }

  render() {
    const temp = `
       <div class="main">
            <div class="content content-center">
                <div class="container container-xs text-center">
                <img src="${Image500}">
                    <h1 class="text-center mb-0">Oops something went wrong</h1>
                    <p class="text-gray mb-4">We are aware of this problem and are already fixing it</p>
                    <div>
                        <a href="/messages" class="text-gray router-link">Back to the chats</a>
                    </div>
              
                </div>
            </div>
       </div>
    `;
    return this.compile(temp, {});
  }
}
