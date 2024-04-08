import * as Flex from '@twilio/flex-ui';

import OnCallButton from '../../custom-components/OnCallButton';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.MainHeader;
export const componentHook = function addDeviceManagerToMainHeader(flex: typeof Flex, manager: Flex.Manager) {
  flex.MainHeader.Content.add(<OnCallButton key="on-call-button" manager={manager} />, {
    sortOrder: 0,
    align: 'end',
  });
};
