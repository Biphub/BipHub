import * as Sequelize from 'sequelize'

export interface PodModel {
  name: string,
  type: string,
  description: string,
  url: string,
}

export interface PodInstance extends Sequelize.Instance<PodModel> {
}

// Conventional namespace used by all biphub pods
const NAMESPACE = 'biphub-pod-'

export default function (sequelize: Sequelize.Sequelize) {
  const Pod = sequelize.define<PodModel, PodInstance>('Pod', {
    name: {
      type: Sequelize.STRING
    },
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    url: {
      type: Sequelize.STRING
    },
    stage: {
      type: Sequelize.ENUM('staging', 'public'),
    },
    icon: {
      type: Sequelize.STRING,
      get() {
        const stage = this.getDataValue('stage')
        const name = this.getDataValue('name')
        const icon = this.getDataValue('icon')
        return `/${stage}/${NAMESPACE}${name}/images/${icon}`
      }
    }
  }, {
    associate (models: any) {
      Pod.hasMany(models.Action)
      Pod.belongsTo(models.PodAuth)
    }
  })
  return Pod
}
