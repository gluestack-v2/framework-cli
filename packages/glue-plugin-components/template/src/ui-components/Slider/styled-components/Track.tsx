import { styled } from '../../styled';
import { Pressable } from 'react-native';

export default styled(
  Pressable,
  {
    'h': '100%',
    'bg': '$backgroundLight200',
    'borderRadius': 8,
    'overflow': 'hidden',

    ':disabled': {
      opacity: 0.4,
    },

    '_dark': {
      bg: '$backgroundDark800',
    },
  },
  {}
);
