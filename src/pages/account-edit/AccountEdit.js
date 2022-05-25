import Templator from '../../templator/index';
import BackIcon from './backIcon.svg';
import Avatar from './avatar.jpg';
import Input from '../../features/input/Input';

const AccountEdit = (props) => {

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
                    <h1 class="text-center">Account edit</h1>
                    <form>
                        <div class="profile-info text-center">
                            <div class="profile-info__avatar">
                                <img src="${Avatar}" />
                                <div class="profile-info__avatar-hover">
                                    Update photo
                                </div>
                            </div>
                        </div>
                        <div class="h-delimiter"></div>
                        <div class="row">
                            ${Input({
                                name: 'first_name',
                                label: 'First name',
                                type: 'text',
                                value: 'Ivan',
                                error: ''
                            })}
                            
                            ${Input({
                                name: 'second_name',
                                label: 'Second name',
                                type: 'text',
                                value: 'Tekunov',
                                error: ''
                            })}
                        </div>
                        <div class="row">
                            ${Input({
                                name: 'email',
                                label: 'Email',
                                type: 'text',
                                value: 'ivan@oviland.ru',
                                error: ''
                            })}
                        </div>
                        <div class="row">
                            ${Input({
                                name: 'login',
                                label: 'Login',
                                type: 'text',
                                value: 'ivan@oviland.ru',
                                error: ''
                            })}
                            ${Input({
                                name: 'phone',
                                label: 'Phone',
                                type: 'text',
                                value: '+7 (917) 539-89-84',
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

export default AccountEdit;

