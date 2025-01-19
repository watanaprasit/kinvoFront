import PropTypes from 'prop-types';
import { StyledButton } from './styles';

const Button = ({ onClick, type = 'button', isLoading, children, className }) => {
  return (
    <StyledButton
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={className}
      $isLoading={isLoading} // Use `$isLoading` for styled-components to differentiate
    >
      {isLoading ? 'Loading...' : children}
    </StyledButton>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Button;

