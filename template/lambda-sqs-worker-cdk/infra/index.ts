import { App } from 'aws-cdk-lib';

import { AppStack } from './appStack.js';
import { config } from './config.js';

const app = new App();

// eslint-disable-next-line no-new
new AppStack(app, 'appStack', {
  stackName: config.appName,
});
