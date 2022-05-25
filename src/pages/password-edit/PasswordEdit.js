import Templator from '../../templator/index';
import BackIcon from './backIcon.svg';
import Input from '../../features/input/Input';

const PasswordEdit = (props) => {

    const temp = `
       <div class="main align-items-start pt-5">
           <div class="content content-center">
                <div class="container container-xs">
                    <div class="nav-header">
                        <div class="nav-header__item">
                             <a class="btn btn-nav" href="/account.html">
                                <img src="${BackIcon}" />
                             </a>
                        </div>
                    </div>
                    <h1 class="text-center">Edit password</h1>
                    <form>
                    <div class="row">
                            ${Input({
                                name: 'password',
                                label: 'Password',
                                type: 'password',
                                error: ''
                            })}
                    </div>
                    <div class="row">
                            ${Input({
                                name: 'password_confirmation',
                                label: 'Password confirmation',
                                type: 'password',
                                error: ''
                            })}
                        </div>
                        <div class="row justify-content-center">
                            <a type="submit" class="btn btn-success btn-lg mw200" href="/account.html">Confirm</a>
                        </div>
</form>
                </div>
           </div>
      </div>
    `;

    return new Templator(temp).compile(props);
}

export default PasswordEdit;

