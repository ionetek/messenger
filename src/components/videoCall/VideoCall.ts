import Block from '../../core/block/Block';
import './VideoCall.css';
import EndCallIcon from './endCallIcon.svg';
import AnswerCallIcon from './answerCallIcon.svg';

//ДОПОЛНИТЕЛЬНАЯ БИБЛИОТЕКА, ДЛЯ ДОБАВЛЕНИЯ ВОЗМОЖНОСТИ ВИДЕО ЗВОНКОВ
//НАСТАВНИКИ РАЗРЕШИЛИ ИСПОЛЬЗОВАТЬ
import Peer, { MediaConnection } from 'peerjs';

export default class VideoCall extends Block {
  peer: Peer;

  peerId: string;

  isIncomingCall: boolean;

  mediaStream: any;

  constructor(props: TProps = {}) {

    const defaultValues = {
      isOpened: true,
    };

    const customEvents = [
      {
        selector: '#btnEndCall',
        events: {
          click: () => {
            this.props.endVideoCall();
          },
        },
      },
      {
        selector: '#btnAnswer',
        events: {
          click: () => {
            //this.answerVideoCall(this.props.videoCall);
            this.call(this.props.videoCall);
          },
        },
      },

    ];
    // Объединяем текущие пропсы компонента и его детей
    const propsAndChildren = { ...props, ...defaultValues };

    super(propsAndChildren, customEvents);

    this.isIncomingCall = this.props.videoCall !== 'outgoing';

  }

  protected componentDidMount() {
    /* VIDEO CALLS */
    this.peer = new Peer();

    let self = this;

    this.peer.on('open', (peerID) => {
      //ПОЛУЧАЕМ PEER ID ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
      self.peerId = peerID;

      //ЕСЛИ ИСХОДЯЩИЙ ЗВОНОК
      if (self.props.videoCall === 'outgoing') {
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
        const remoteVideoElement = self.element.querySelector('#remoteVideo') as HTMLVideoElement;
        remoteVideoElement.srcObject = remoteStream;
        remoteVideoElement.classList.remove('d-none');
        remoteVideoElement.onloadedmetadata = () => {
          remoteVideoElement.play();
          console.log('PLAY', remoteStream.getAudioTracks());
        };

      });
    });
  }

  protected answer(call: MediaConnection) {
    let self = this;
    call.answer(this.mediaStream); // Answer the call with an A/V stream.
    call.on('stream', (remoteStream: any) => {
      //ПОКАЗЫВАЕМ СТРИМ СОБЕСЕДНИКА
      const remoteVideoElement = self.element.querySelector('#remoteVideo') as HTMLVideoElement;
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

      let myVideo = self.element.querySelector('#myVideo') as HTMLVideoElement;

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

    const temp = `<div class="video-call-wrapper ${isOpenedClass} video-call-incoming">
                       
                       <div class="video-call <% if (this.videoCall !== 'outgoing') { %>video-call-waiting<% } %>">
                           <video id="myVideo" muted="muted" playsInline></video>
                           <video id="remoteVideo" muted="muted" playsInline class="d-none"></video>
                           <a class="btn btn-extra-lg btn-danger btn-end-call" id="btnEndCall">
                                <img src="${EndCallIcon}" />
                           </a>
                       </div>
                       <% if (this.videoCall !== 'outgoing') { %>
                       <div class="modal">
                            <div class="modal__header">
                                <h2 class="m-0 text-center">Incoming video call</h2>
                            </div>
                            <div class="modal__body">
                                <a class="btn btn-extra-lg btn-danger" id="btnDecline">
                                    <img src="${EndCallIcon}" />
                                </a>
                                <a class="btn btn-extra-lg btn-success" id="btnAnswer">
                                    <img src="${AnswerCallIcon}" />
                                </a>
                            </div>
                       </div>
                       <% } %>
                       
                       
                  </div>`;
    return this.compile(temp, this.props);
  }

}
