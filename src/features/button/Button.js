import Templator from '../../templator/index';
const Button = (props) => {

    const temp = `Button`;

    return new Templator(temp).compile(props);
}

export default Button;