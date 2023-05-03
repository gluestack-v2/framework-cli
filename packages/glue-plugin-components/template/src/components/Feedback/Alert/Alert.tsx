import React from 'react';

import Wrapper from '../../Wrapper';
import {
  Alert,
  Center,
  InfoIcon,
  CheckCircleIcon,
  CloseIconFilled,
  NotificationIcon,
  WarningIcon,
  VStack,
  Icon,
} from '../../../ui-components';

export function AlertTemp({ ...props }: any) {
  return (
    <Wrapper>
      <Center>
        <Alert {...props}>
          <Alert.Icon>
            <Icon as={InfoIcon} />
          </Alert.Icon>
          <Alert.Text>Selection successfully moved!</Alert.Text>
        </Alert>
      </Center>
    </Wrapper>
  );
}

export default AlertTemp;

export {
  Alert,
  InfoIcon,
  Center,
  CheckCircleIcon,
  CloseIconFilled,
  NotificationIcon,
  WarningIcon,
  Icon,
  VStack,
};
