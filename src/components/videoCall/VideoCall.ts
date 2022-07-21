import config from '../../config';
import Block from '../../core/block/Block';
import './VideoCall.css';
import EndCallIcon from './endCallIcon.svg';
import AnswerCallIcon from './answerCallIcon.svg';

//ДОПОЛНИТЕЛЬНАЯ БИБЛИОТЕКА, ДЛЯ ДОБАВЛЕНИЯ ВОЗМОЖНОСТИ ВИДЕО ЗВОНКОВ
//НАСТАВНИКИ РАЗРЕШИЛИ ИСПОЛЬЗОВАТЬ
import Peer, { MediaConnection } from 'peerjs';
import { store } from '../../store';

export default class VideoCall extends Block {
  peer: Peer;

  peerId: string;

  isIncomingCall: boolean;

  mediaStream: any;

  melody: HTMLAudioElement;

  constructor(props: TProps = {}) {

    const defaultValues = {
      isOpened: true,
      user: store.getState().videoCall.user,
    };

    const customEvents = [
      {
        selector: '#btn-end-call , #btn-decline',
        events: {
          click: () => {
            this.props.endVideoCall();
            if (this.melody) {
              this.melody.pause();
            }
          },
        },
      },
      {
        selector: '#btn-answer',
        events: {
          click: () => {
            if (this.melody) {
              this.melody.pause();
            }
            this.call(this.props.peerId);
          },
        },
      },

    ];
    // Объединяем текущие пропсы компонента и его детей
    const propsAndChildren = { ...props, ...defaultValues };

    super(propsAndChildren, customEvents);

    this.isIncomingCall = this.props.peerId !== 'outgoing';

    this.melody = new Audio('https://oviland.ru/storage/melody.mp3');
    if (this.isIncomingCall) {
      this.melody.loop = true;
      this.melody.play();

    }


  }

  protected componentDidMount() {
    /* VIDEO CALLS */
    this.peer = new Peer();

    let self = this;

    this.peer.on('open', (peerID) => {
      //ПОЛУЧАЕМ PEER ID ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
      self.peerId = peerID;

      //ЕСЛИ ИСХОДЯЩИЙ ЗВОНОК
      if (!this.isIncomingCall) {
        self.sendVideoCallRequest(peerID);
        self.startMyStream();
      }
    });

    this.peer.on('call', (call) => {
      self.answer(call);
      self.connected();
    });

    this.peer.on('disconnected', () => {
      console.log('Disconnected');
    });


  }

  protected sendVideoCallRequest(peerID: string) {
    this.props.sendVideoCallRequest(peerID);
  }

  protected call(peerID: string) {

    let self = this;
    this.startMyStream().then(stream => {
      let call = self.peer.call(peerID, stream);
      self.connected();
      call.on('stream', (remoteStream) => {
        //ПОКАЗЫВАЕМ СТРИМ СОБЕСЕДНИКА
        const remoteVideoElement = self.element.querySelector('#remote-video') as HTMLVideoElement;
        remoteVideoElement.srcObject = remoteStream;
        remoteVideoElement.classList.remove('d-none');
        remoteVideoElement.onloadedmetadata = () => {
          remoteVideoElement.play();
        };

      });
    });
  }

  protected answer(call: MediaConnection) {
    let self = this;
    call.answer(this.mediaStream); // Answer the call with an A/V stream.
    call.on('stream', (remoteStream: any) => {
      //ПОКАЗЫВАЕМ СТРИМ СОБЕСЕДНИКА
      const remoteVideoElement = self.element.querySelector('#remote-video') as HTMLVideoElement;
      remoteVideoElement.srcObject = remoteStream;
      remoteVideoElement.classList.remove('d-none');
      remoteVideoElement.onloadedmetadata = () => {
        remoteVideoElement.play();
      };
    });
  }

  protected startMyStream() {
    let self = this;
    return navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((mediaStream) => {

      let myVideo = self.element.querySelector('#my-video') as HTMLVideoElement;

      if (myVideo) {
        myVideo.srcObject = mediaStream;
      }

      myVideo.onloadedmetadata = function () {
        myVideo.play();
      };
      //Возвращаем медиа поток
      self.mediaStream = mediaStream;
      return mediaStream;
    });
  }

  protected connected() {
    //Меняем состояние видео трансляции на активную
    const elem = this.element.querySelector('.video-call') as HTMLElement;
    elem.classList.remove('video-call-waiting');
    elem.classList.add('video-call-active');

    if (this.element.querySelector('.modal')) {
      this.element.querySelector('.modal')!.remove();
    }
  }

  render() {

    let isOpenedClass = this.props.isOpened ? 'modal-opened' : '';

    console.log('USER:', this.props.user);

    const temp = `<div class="video-call-wrapper ${isOpenedClass} video-call-incoming">
                       
                       <div class="video-call <% if (this.peerId !== 'outgoing') { %>video-call-waiting<% } %>">
                           <video id="my-video" muted="muted" playsInline></video>
                           <video id="remote-video"  playsInline class="d-none"></video>
                           <a class="btn btn-extra-lg btn-danger btn-end-call" id="btn-end-call">
                                <img src="${EndCallIcon}" />
                           </a>
                       </div>
                       <% if (this.peerId !== 'outgoing') { %>
                       <div class="modal bg-transparent">
                            <div class="modal__header">
                            <h2 class="m-0 text-center text-white"><% this.user.first_name %>&nbsp;<% this.user.second_name %></h2>
                            <p class="m-0 text-center text-white inccoming-call-text">Incoming video call</p>
                            </div>
                            <div class="modal__body">
                                
                                <% if (this.user.avatar !== null) { %>
                                    <img src="${config.RESOURCES_URL}<% this.user.avatar %>" class="caller-photo mb-4" />
                                <% } else { %>
                                    <img src="/images/avatar.svg" class="caller-photo mb-4" />
                                <% } %>
                                
                                <div class="call-actions">
                                    <a class="btn btn-extra-lg btn-danger" id="btn-decline">
                                        <img src="${EndCallIcon}" />
                                    </a>
                                    <a class="btn btn-extra-lg btn-success" id="btn-answer">
                                        <img src="${AnswerCallIcon}" class="shaked-icon" />
                                    </a>
                                </div>
                                
                            </div>
                       </div>
                       <% } %>
                       
                       
                  </div>`;
    return this.compile(temp, this.props);
  }

}
