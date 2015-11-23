/*
 * Subscribe a listener to the store that reads the current state
 * then turn that state into a plain JavaScript object
 * and emit it as a state event on the socket.io server
 */

import Server from 'socket.io';

export default function startServer (store) {
  const io = new Server().attach(8090);

  /*
   * We are now publishing the whole state
   * to everyone whenever any changes occur.
   * This may end up causing a lot of data transfer.
   * One could think of various ways of optimizing this
   * (e.g. just sending the relevant subset,
   * sending diffs instead of snapshots...),
   * but this implementation has the benefit of being
   * easy to write, so we'll just use it for our example app.
   */
  store.subscribe(
    // Send state to all subcribers when a change occurs
    () => io.emit('state', store.getState().toJS())
  );

/*
 * In addition to sending a state snapshot whenever state changes,
 * it will be useful for clients to immediately receive the
 * current state when they connect to the application.
 * That lets them sync their client-side state to the
 * latest server state right away.
 *
 * We can listen to 'connection' events on our Socket.io server.
 * We get one each time a client connects.
 * In the event listener we can emit the current state right away:
 */

  io.on('connection', (socket) => {
    // Send the current state to all new connections
    socket.emit('state', store.getState().toJS());

    // Receive remote actions from clients (e.g. votes)
    // This is ignoring security!  Any client can send any action
    // into the srore.  A real app would use a firewall
    // and plugin an authentication mechanism here
    //  Example at
    //  http://vertx.io/docs/vertx-web/java/#_securing_the_bridge
    //
    socket.on('action', store.dispatch.bind(store));
  });
}
