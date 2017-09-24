import * as Sequelize from 'sequelize'

export interface FieldModel {
  title: string,
  properties: JSON
}

export interface FieldInstance extends Sequelize.Instance<FieldModel> {
  dataValues: FieldModel
}

/**
 * Pods' action such as onNewMessage, sendMessage, postTwit, and etc
 * @param sequelize
 * @returns {any}
 */
export default function (sequelize: Sequelize.Sequelize) {
  const Field = sequelize.define('Field', {
    title: Sequelize.STRING,
    properties: Sequelize.JSONB
  }, {
    classMethods: {
      associate(models: any) {
        Field.belongsTo(models.Payload)
      }
    }
  })
  return Field
}
