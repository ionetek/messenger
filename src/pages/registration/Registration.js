import Templator from '../../templator/index';
import Input from '../../features/input/Input';

const Registration = (props) => {

    const temp = `
       <div class="main">
           <div class="content content-center">
                <div class="container container-xs">
                    <h1 class="text-center">Registration</h1>
                    <form method="post" action="index.html">
                        <div class="row">
                            ${Input({
                                    name: 'first_name',
                                    label: 'First name',
                                    type: 'text',
                                    error: ''
                                })}
                            
                            ${Input({
                                    name: 'second_name',
                                    label: 'Second name',
                                    type: 'text',
                                    error: ''
                                })}
                        </div>
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
                                    name: 'login',
                                    label: 'Login',
                                    type: 'text',
                                    error: ''
                                })}
                            ${Input({
                                    name: 'phone',
                                    label: 'Phone',
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
                            ${Input({
                                    name: 'password_confirmation',
                                    label: 'Password confirmation',
                                    type: 'password',
                                    error: ''
                                })}
                        </div>
                        <div class="row justify-content-center">
                            <a type="submit" class="btn btn-success btn-lg mw200" href="index.html">Register</a>
                        </div>
                        <div class="row justify-content-center">
                            <a href="/login.html" class="text-gray">I have an account</a>
                        </div>
                    </form>
                </div>
           </div>
       </div>
    `;

    return new Templator(temp).compile(props);
}

export default Registration;

