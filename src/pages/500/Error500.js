import Templator from '../../templator/index';
import Image500 from './500.svg';

const Error500 = (props) => {

    const temp = `
       <div class="main">
            <div class="content content-center">
                <div class="container container-xs text-center">
                <img src="${Image500}">
                    <h1 class="text-center mb-0">Oops something went wrong</h1>
                    <p class="text-gray mb-4">We are aware of the problem and have already fixed it</p>
                    <div>
                        <a href="index.html" class="text-gray">Back to the chats</a>
                    </div>
              
                </div>
            </div>
       </div>
    `;

    return new Templator(temp).compile(props);
}

export default Error500;

