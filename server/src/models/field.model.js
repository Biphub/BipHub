import * as Sequelize from 'sequelize'

/**
 * Pods' action such as onNewMessage, sendMessage, postTwit, and etc
 * @param sequelize
 * @returns {any}
 */
export default function(sequelize) {
  return sequelize.define('Field', {
    title: Sequelize.STRING,
    properties: Sequelize.JSONB,
  })
}
