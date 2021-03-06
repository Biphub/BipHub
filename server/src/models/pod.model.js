import Sequelize from 'sequelize'

// Conventional namespace used by all biphub pods
// const NAMESPACE = 'biphub-pod-'

export default function(sequelize) {
  const Pod = sequelize.define(
    'Pod',
    {
      name: {
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      url: {
        type: Sequelize.STRING,
      },
      stage: {
        type: Sequelize.ENUM('staging', 'public'),
      },
      icon: {
        type: Sequelize.STRING,
        get() {
          const name = this.getDataValue('name')
          const icon = this.getDataValue('icon')
          return `pods/${name}/images/${icon}`
        },
      },
      styles: {
        type: Sequelize.JSONB,
      },
    },
    {
      associate(models) {
        Pod.hasMany(models.Action)
        Pod.hasMany(models.PodAuth)
      },
    },
  )
  return Pod
}
