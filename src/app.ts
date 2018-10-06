import { Lambda } from 'aws-sdk';
import { CloudWatchLogsEvent, Context, Callback } from 'aws-lambda';

const client = new Lambda({
  region: process.env.AWS_DEFAULT_REGION,
});

const env = process.env.ENVIRONMENT as string;
const excepts = process.env.EXCEPT_FUNCTIONS as string;
const except = excepts.split(',');

/** Invoke Enter */
export const handler = (event: CloudWatchLogsEvent, content: Context, callback: Callback) => {
  invoke().then(() => callback(null, 'Success')).catch(err => callback(err, null));
};

const invoke = async () => {
  const funcs = await client.listFunctions().promise();

  if (!funcs.Functions || funcs.Functions.length === 0) {
    return;
  }

  const invokes: any = [];

  funcs.Functions.forEach((func) => {
    if (!func.FunctionName) return;
    // 環境依存
    if (!func.FunctionName.startsWith(env)) return;
    // 除外を除く
    if (except.find(item => item === func.FunctionName)) return;

    const params = {
      FunctionName: func.FunctionName,
      InvocationType: 'RequestResponse',
      LogType: 'None',
      Qualifier: '$LATEST',
      Payload: JSON.stringify({ source: 'Health check from lambda.' }),
    };
    invokes.push(client.invoke(params).promise());
  });

  // 対象なし
  if (invokes.length === 0) {
    console.log('Invoke Function: Nothing');
    return;
  }

  const ret = await Promise.all(invokes);

  console.log(ret);
};
