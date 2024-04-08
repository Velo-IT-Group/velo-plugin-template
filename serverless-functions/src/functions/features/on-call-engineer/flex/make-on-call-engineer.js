const { prepareFlexFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const TaskRouterOperations = require(Runtime.getFunctions()['common/twilio-wrappers/taskrouter'].path);

const requiredParameters = [{ key: 'workerSid', purpose: 'unique ID of user to perform operations on' }];

const updateWorker = async (context, workerSid) => {
  // get current worker attributes
  const { worker } = await TaskRouterOperations.getWorker({ context, workerSid });

  // flip on_call variable
  const attributes = worker.attributes;
  const workerAttributes = { ...attributes, on_call: !attributes.on_call };

  // update worker attributes
  const {
    success,
    status,
    worker: updatedWorker,
  } = await TaskRouterOperations.updateWorkerAttributes({
    context,
    workerSid,
    attributesUpdate: JSON.stringify(workerAttributes),
  });

  return {
    success,
    status,
    worker: updatedWorker,
  };
};

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { workerSid } = event;

    const { workers } = await TaskRouterOperations.getEligibleWorkers({
      context,
      targetWorkersExpression: 'on_call == true',
    });

    if (workers.length === 0) {
      const { worker } = await updateWorker(context, workerSid);
      response.setBody(worker);
      return callback(null, response);
    }

    await updateWorker(context, workers[0].sid);
    const { status, worker } = await updateWorker(context, workerSid);
    console.log(status);
    response.setBody(worker);
    response.setStatusCode(status);

    return callback(null, response);
  } catch (error) {
    console.error(error);
    return handleError(error);
  }
});
