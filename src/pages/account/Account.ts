import Block from '../../core/block/Block';
import BackIcon from './backIcon.svg';
import EditIcon from './editIcon.svg';

export default class Account extends Block {
  render() {
    const temp = `
    <div class="main align-items-start pt-5">
           <div class="content content-center">
                <div class="container container-xs">
                    <div class="nav-header">
                        <div class="nav-header__item">
                             <a class="btn btn-nav" href="index.html">
                                <img src="${BackIcon}" />
                             </a>
                        </div>
                        <div class="nav-header__item">
                             <a class="btn btn-nav" href="account-edit.html">
                                <img src="${EditIcon}" />
                             </a>
                        </div>
                    </div>
                    <div class="profile-info text-center">
                        <div class="profile-info__avatar">
                            <img src="images/avatar.jpg" />
                            <div class="avatar__hover">
                            
                            </div>
                        </div>
                        <div class="profile-info__name">
                            Ivan Tekunov
                        </div>
                        <div class="profile-info__login">
                            @ionetek
                        </div>
                        <div class="h-delimiter"></div>
                        <div class="row">
                            <div class="profile-info__item">
                                <div class="profile-info__item-label">
                                    Email
                                </div>
                                <div class="profile-info__item-value">
                                    ivan@oviland.ru
                                </div>
                            </div>
                            <div class="profile-info__item">
                                <div class="profile-info__item-label">
                                    Phone
                                </div>
                                <div class="profile-info__item-value">
                                    +7 (917) 539-89-84
                                </div>
                            </div>
                        </div>
                        <div class="h-delimiter"></div>
                        <div class="row">
                            <a class="btn text-underline text-gray" href="password-edit.html">Change password</a>
                        </div>
                        <div class="row">
                            <a class="btn text-underline text-red" href="login.html">Sign out</a>
                        </div>
                    </div>  
                </div>
           </div>
      </div>
    `;
    return this.compile(temp, this.props);
  }
}
