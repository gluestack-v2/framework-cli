import React from 'react';
import {
  Text,
  Pressable,
  Popover,
  Button,
  CloseIcon,
  Icon,
} from '../../../ui-components';

import Wrapper from '../../Wrapper';

export const PopoverStory = () => {
  return (
    <Wrapper>
      <Popover
        placement={'top'}
        trigger={(triggerProps: any) => {
          return (
            <Pressable
              bgColor={'$red500'}
              borderRadius={'$md'}
              {...triggerProps}
            >
              <Text color={'white'} padding="$3">
                Popover
              </Text>
            </Pressable>
          );
        }}
      >
        <Popover.Content>
          <Popover.Header>
            <Text>Delete Customer</Text>
            <Popover.CloseButton>
              <Icon as={CloseIcon} sx={{ w: 16, h: 16 }} />
            </Popover.CloseButton>
          </Popover.Header>
          <Popover.Body>
            <Text>
              This will remove all data relating to Alex. This action cannot be
              reversed. Deleted data can not be recovered.
            </Text>
          </Popover.Body>
          <Popover.Footer>
            {/* @ts-ignore */}
            <Button variant="outline" mr={'$2'}>
              <Button.Text>Cancel</Button.Text>
            </Button>
            <Button>
              <Button.Text color={'white'}>Delete</Button.Text>
            </Button>
          </Popover.Footer>
        </Popover.Content>
      </Popover>
    </Wrapper>
  );
};

export { Text, Pressable, Popover, Button, CloseIcon };
