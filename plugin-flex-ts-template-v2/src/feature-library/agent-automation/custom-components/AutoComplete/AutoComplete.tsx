// import * as Flex from '@twilio/flex-ui';
import { ITask } from '@twilio/flex-ui';
import React from 'react';
import { createClient } from '@supabase/supabase-js';

// import { TaskQualificationConfig } from '../../types/ServiceConfiguration';
// import { getMatchingTaskConfiguration } from '../../config';
// import TaskRouterService from '../../../../utils/serverless/TaskRouter/TaskRouterService';

const supabase = createClient(
  'https://kaleojbwrokdmrmedkov.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthbGVvamJ3cm9rZG1ybWVka292Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQyMzE1NTgsImV4cCI6MjAxOTgwNzU1OH0.gzmGhGPZ_qIyBbvCT-smESnQt4Seh3S0wGLty7zmmVo',
);

export type Props = {
  task: ITask;
};

// this component is intended to execute an autocomplete
// and as such should only added to the canvas when a task is in wrapping
// eg: if: (props) => props.task.status === 'wrapping',
// this removes dependency on the reservationWrapped event which may fail
// to get delivered to the client on a bad network.
// this method allows for the task status, which is not a single event but a
// sync with the state of the task so even if the browser is refreshed
// the task will auto wrap

export interface OwnProps {
  task: ITask;
}

const autoCompleteTask = async (task: ITask) => {
  // const autoCompleteTask = async (task: ITask, taskConfig: TaskQualificationConfig) => {
  const { taskSid } = task;

  try {
    // const scheduledTime = task.dateUpdated.getTime() + taskConfig.wrapup_time;
    // const currentTime = new Date().getTime();
    // const timeout = scheduledTime - currentTime > 0 ? scheduledTime - currentTime : 0;

    // setTimeout(async () => {
    //   if (task && Flex.TaskHelper.isInWrapupMode(task)) {
    //     if (taskConfig.default_outcome) {
    //       await TaskRouterService.updateTaskAttributes(task.taskSid, {
    //         conversations: {
    //           outcome: taskConfig.default_outcome,
    //         },
    //       });
    //     }
    //     Flex.Actions.invokeAction('CompleteTask', { sid });
    //   }
    // }, timeout);
    console.log('TASK', taskSid);
    const { error } = await supabase.from('tasks').insert({ sid: taskSid });
    if (error) throw error;
  } catch (error) {
    console.error(`Error attempting to set wrap up timeout for reservation: ${taskSid}`, error);
  }
};

class AutoComplete extends React.PureComponent<OwnProps> {
  componentDidMount() {
    const { task } = this.props;
    console.log('componentDidMount with task', task);
    autoCompleteTask(task);
    // const taskConfig = getMatchingTaskConfiguration(task);
    // if (taskConfig && taskConfig.auto_wrapup) autoCompleteTask(task, taskConfig);
  }

  render() {
    return null;
  }
}

export default AutoComplete;
