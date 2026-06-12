async function loadLeaderboard() {

  const response =
    await fetch(
      "data/leaderboard.json"
    );

  const leaderboard =
    await response.json();

  const currentUser = {

    name: "You",

    score:
      Number(
        localStorage.getItem(
          "correctAnswers"
        )
      ) || 0,

    accuracy:
      Number(
        localStorage.getItem(
          "accuracy"
        )
      ) || 0
  };

  leaderboard.push(
    currentUser
  );

  leaderboard.sort(
    (a, b) =>
      b.score - a.score
  );

  renderLeaderboard(
    leaderboard
  );

}

function renderLeaderboard(
  players
) {

  const body =
    document.getElementById(
      "leaderboardBody"
    );

  body.innerHTML = "";

  let yourRank = 0;

  players.forEach(
    (player, index) => {

      let rowClass = "";

      if (
        player.name === "You"
      ) {

        rowClass =
          "current-user";

        yourRank =
          index + 1;
      }

      if (index === 0)
        rowClass +=
          " gold";

      if (index === 1)
        rowClass +=
          " silver";

      if (index === 2)
        rowClass +=
          " bronze";

      body.innerHTML += `
        <tr class="${rowClass}">
          <td>${index + 1}</td>
          <td>${player.name}</td>
          <td>${player.score}/50</td>
          <td>${player.accuracy}%</td>
        </tr>
      `;
    }
  );

  document.getElementById(
    "yourScore"
  ).textContent =
    `${
      localStorage.getItem(
        "correctAnswers"
      ) || 0
    }/50`;

  document.getElementById(
    "yourAccuracy"
  ).textContent =
    `${
      localStorage.getItem(
        "accuracy"
      ) || 0
    }%`;

  document.getElementById(
    "yourRank"
  ).textContent =
    "#" + yourRank;

}

loadLeaderboard();