'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Pipelines',
      [{
        id: 1,
        title: 'test pipeline',
        description: 'this is just for testing!',
        entryApp: 'biphub-pod-fake1',
        entryType: 'webhook',
        createdAt: new Date(),
        updatedAt: new Date(),
        nodes: JSON.stringify([
          {
            id: 1,
            podName: 'biphub-pod-fake1',
            actionName: 'webhook'
          },
          {
            id: 2,
            podName: 'biphub-pod-fake1',
            actionName: 'post-fake-message'
          },
          {
            id: 3,
            podName: 'biphub-pod-fake2',
            actionName: 'create-fake-issue'
          },
          {
            id: 4,
            podName: 'biphub-pod-fake2',
            actionName: 'test-move-issue'
          },
          {
            id: 5,
            podName: 'biphub-pod-fake1',
            actionName: 'search-channel'
          },
          {
            id: 6,
            podName: 'biphub-pod-fake1',
            actionName: 'deleteFakeMessage'
          }
        ]),
        edges: JSON.stringify([
          { from: 1, to: 2 },
          { from: 1, to: 4 },
          { from: 1, to: 6 },
          { from: 2, to: 3 },
          { from: 4, to: 5 },
        ])
        /*
        sequence: JSON.stringify({
          webhook: {
            id: 1,
            podName: 'biphub-pod-fake1',
            graph: {
              x: 10,
              y: 210
            },
            next: {
              'post-fake-message': {
                id: 2,
                podName: 'biphub-pod-fake1',
                graph: {
                  x: 20,
                  y: 50
                },
                next: {
                  'create-fake-issue': {
                    podName: 'biphub-pod-fake2',
                    graph: {
                      x: 40,
                      y: 10
                    }
                  }
                }
              },
              'test-move-issue': {
                podName: 'biphub-pod-fake2',
                graph: {
                  x: 10,
                  y: 60
                },
                next: {
                  'search-channel': {
                    podName: 'biphub-pod-fake1',
                    graph: {
                      z: 10,
                      x: 20
                    }
                  }
                }
              },
              deleteFakeMessage: {
                podName: 'biphub-pod-fake1',
                graph: 1
              }
            }
          }
        }) */
      }]
    ).catch(err => {
      console.error(err.message)
      throw err
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
}
