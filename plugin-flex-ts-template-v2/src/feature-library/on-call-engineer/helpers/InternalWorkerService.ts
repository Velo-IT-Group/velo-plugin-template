import { Worker } from 'types/task-router';

import ApiService from '../../../utils/serverless/ApiService';

class InternalWorkerService extends ApiService {
  changeOnCallEngineer = async (worker: Worker) => {
    return new Promise((resolve, reject) => {
      const workerSid = worker.sid;

      const encodedParams = {
        workerSid,
        Token: encodeURIComponent(this.manager.store.getState().flex.session.ssoTokenPayload.token),
      };

      this.fetchJsonWithReject(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/on-call-engineer/flex/make-on-call-engineer`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      )
        .then((response) => {
          console.log('Outbound call has been placed into wrapping');
          resolve(response);
        })
        .catch((error) => {
          console.error('ERROR HERE', error);
          reject(error);
        });
    });
  };
}

const internalWorkerService = new InternalWorkerService();

export default internalWorkerService;
