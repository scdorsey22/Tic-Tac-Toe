import Store from "./store.js";
import View from "./view.js";

// Our players "config" - defines icons, colors, name, etc.
const players = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "turquoise",
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "yellow",
  },
];

function init() {
  const view = new View();
  const store = new Store("live-t3-storage-key", players);

  function initView() {
    view.closeAll();
    view.clearMoves();
    view.setTurnIndicator(store.game.currentPlayer);
    view.updateScoreboard(
      store.stats.playerWithStats[0].wins,
      store.stats.playerWithStats[1].wins,
      store.stats.ties
    );
    view.initializeMoves(store.game.moves)
  }

  window.addEventListener('storage', () => {
      console.log('State changed from another tab');
      initView();
  })

  initView()

  view.bindGameResetEvent((event) => {
    store.reset();
    initView();
  });

  view.bindNewRoundEvent((event) => {
    store.newRound();
    initView();
  });

  view.bindPlayerMoveEvent((square) => {
    const existingMove = store.game.moves.find(
      (move) => move.squareId === +square.id
    );

    if (existingMove) {
      return;
    }

    view.handlePlayerMove(square, store.game.currentPlayer);

    store.playerMove(+square.id);

    if (store.game.status.isComplete) {
      view.openModal(
        store.game.status.winner
          ? `${store.game.status.winner.name} wins!`
          : "Tie!"
      );

      return;
    }

    view.setTurnIndicator(store.game.currentPlayer);
  });
}

window.addEventListener("load", init);
