import { IconButton, Manager } from '@twilio/flex-ui';
import React, { useState } from 'react';
import { AlertDialog } from '@twilio-paste/core/alert-dialog';
import { Toaster, useToaster } from '@twilio-paste/core/toast';
import { Flex } from '@twilio-paste/core/flex';
import { Tooltip } from '@twilio-paste/core/tooltip';

import internalWorkerService from '../helpers/InternalWorkerService';

export interface OwnProps {
  manager: Manager;
}

const OnCallButton = (props: OwnProps) => {
  const { manager } = props;
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const [checked, setChecked] = useState(() => {
    return manager.workerClient?.attributes?.on_call ?? false;
  });
  const toaster = useToaster();

  const updateOnCall = async () => {
    setIsOpen(false);
    try {
      // @ts-ignore
      await internalWorkerService.changeOnCallEngineer(manager.workerClient);
      toaster.push({
        message: `You are now the on call engineer. You can be reached at ${manager.workerClient?.attributes.work_phone}`,
        variant: 'success',
        dismissAfter: 4000,
      });

      setChecked(!checked);
    } catch (e) {
      toaster.push({
        message: 'There was an error updating the on call engineer. Please try again',
        variant: 'error',
        dismissAfter: 4000,
      });
    }
  };
  return (
    <>
      <Tooltip
        text={manager.workerClient?.attributes.on_call || checked ? 'You are on call' : 'You are not on call'}
        placement="left"
      >
        <Flex vAlignContent="center">
          <IconButton
            icon={manager.workerClient?.attributes.on_call || checked ? 'BellBold' : 'Bell'}
            disabled={manager.workerClient?.attributes.on_call === true}
            onClick={() => setIsOpen(!isOpen)}
            size="small"
            style={{ backgroundColor: 'transparent' }}
          />
        </Flex>
      </Tooltip>

      <AlertDialog
        heading={'Make yourself on call engineer?'}
        isOpen={isOpen}
        onConfirm={updateOnCall}
        onConfirmLabel="Submit"
        onDismiss={handleClose}
        onDismissLabel="Cancel"
      >
        Are you sure you want to set yourself as the on call engineer?
      </AlertDialog>

      <Toaster {...toaster} />
    </>
  );
};

export default OnCallButton;
