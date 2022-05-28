import Templator from '../../templator/index';
import Image404 from './404.svg';

const Error404 = (props) => {

    const temp = `
       <div class="main">
           <div class="content content-center">
                <div class="container container-xs text-center">
                <img src="${Image404}">
                    <h1 class="text-center mb-0">Oops!!</h1>
                    <p class="text-gray mb-4">Looks like this page doesn’t exist</p>
                    <div>
                        <a href="index.html" class="text-gray">Back to the chats</a>
                    </div>
              
                </div>
           </div>
       </div>
    `;

    return new Templator(temp).compile(props);
}

export default Error404;

