import Templator from '../../templator/index';
import Input from '../../features/input/Input';

const Login = (props) => {

    const temp = `
       <div class="main">
           <div class="content content-center">
                <div class="container container-xs">
                    <h1 class="text-center">Login</h1>
                    <form method="post" action="index.html">
                        <div class="row">
                            ${Input({
                                name: 'email',
                                label: 'Email',
                                type: 'text',
                                error: ''
                             })}
                        </div>
                        <div class="row">
                            ${Input({
                                name: 'password',
                                label: 'Password',
                                type: 'password',
                                error: ''
                            })}
                        </div>
                        <div class="row justify-content-center">
                            <a type="submit" class="btn btn-success btn-lg mw200" href="index.html">Login</a>
                        </div>
                        <div class="row justify-content-center">
                            <a href="/registration.html" class="text-gray">Create an account</a>
                        </div>
                    </form>
                </div>
           </div>
       </div>
    `;

    return new Templator(temp).compile(props);
}

export default Login;

