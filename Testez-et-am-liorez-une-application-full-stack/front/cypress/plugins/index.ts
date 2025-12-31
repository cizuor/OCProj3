/**
 * @type {Cypress.PluginConfig}
 */
 import * as registerCodeCoverageTasks from '@cypress/code-coverage/task';

 export default (on, config) => {
  require('@cypress/code-coverage/task')(on, config);
   return config;
 };
