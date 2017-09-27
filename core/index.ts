import { start } from './server'

start().fork(
  (e) => console.error('Failed to start the server!'),
  (app) => {
    app.listen(app.get('port'), () => {
      console.log(('  App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'))
      console.log('  Press CTRL-C to stop\n')
      app.queue.push({ name: 'yozzz!' }, () => {
        console.log('pushed!')
      })
    })
  }
)