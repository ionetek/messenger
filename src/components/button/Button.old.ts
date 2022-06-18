import Templator from '../../core/templator/Templator';

const Button = (props: TProps) => {
  const temp = 'Button';
  return new Templator(temp).compile(props);
};

export default Button;
