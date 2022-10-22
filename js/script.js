const ApiKey = "5bc089f3184b43419a0d602db61b06e8";
const baseUrl = "http://api.football-data.org/v4/";
const leagueId = "2021";
const baseEndPoin = `${baseUrl}competitions/${leagueId}`;
const teamEndPoin = `${baseUrl}competitions/${leagueId}/teams`;
const standingEndPoin = `${baseUrl}competitions/${leagueId}/standings`;
const matchEndPoin = `${baseUrl}competitions/${leagueId}/matches`;

const contents = document.querySelector("#content-list");
const title = document.querySelector(".card-title");

const detailTeam = document.getElementById("detail-team");

const fetchHeader = {
  headers: {
    "X-Auth-Token": ApiKey,
  },
};

// fungsi untuk menampilkan list daftar tim liga Inggris
function getListTeams() {
  title.innerHTML = "Daftar Tim Liga Primer Inggris";
  fetch(teamEndPoin, fetchHeader)
    .then((response) => response.json())
    .then((resJson) => {
      console.log(resJson.teams);
      let teams = "";
      resJson.teams.forEach((team) => {
        teams += `
        <li class="collection-item avatar">
            <img src="${team.crest}" alt="" class="circle">
            <span class="title">${team.name}</span>
            <p>Berdiri:${team.founded}<br>
                Markas: ${team.venue}
            </p>
            <a href="#modalDetailTim" id="${team.id}" class="secondary-content btn-tim modal-trigger"><i id="${team.id}" class="material-icons">info</i></a>
        </li>
        `;
      });
      contents.innerHTML = '<ul class="collection">' + teams + "</ul>";

      document.querySelectorAll(".btn-tim").forEach((item) => {
        item.addEventListener("click", function (e) {
          detailTeamModal(e.target.id);
        });
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

function detailTeamModal(id) {
  detailTeam.innerHTML = "";
  fetch(`https://api.football-data.org/v4/teams/${id}`, fetchHeader)
    .then((res) => res.json())
    .then((result) => {
      let squadsHTML = ``;
      result.squad.forEach((squad, index) => {
        squadsHTML += `
          <tr>
            <td>${index + 1}</td>
            <td>${squad.name}</td>
            <td>${squad.position}</td>
            <td>${squad.dateOfBirth}</td>
            <td>${squad.nationality}</td>
          </tr>`;
      });
      let detailTeamHTML = ` <div class="row">
      <div class="col m12">
        <div style="display: flex;
          align-items: center;">
          <img style="width:25%;" src="${result.crest}" alt="" />
          <h4 style="font-weight: bold; margin-left: 20px;">${result.name}</h4>
        </div>
        <p style="margin-top: 30px;font-weight: bold; text-decoration: underline">Informasi Tim</p>
        <table class="striped" id="information-table">
          <tr>
            <td>Nama</td>
            <td>${result.name}</td>
          </tr>
          <tr>
            <td>TLA</td>
            <td>${result.tla}</td>
          </tr>
          <tr>
            <td>Alamat</td>
            <td>${result.address}</td>
          </tr>
          <tr>
            <td>Website</td>
            <td> <a href="${result.website}">${result.website}</a></td>
          </tr>
          <tr>
            <td>Berdiri</td>
            <td>${result.founded}</td>
          </tr>
          <tr>
            <td>Warna Klub</td>
            <td>${result.clubColors}</td>
          </tr>
          <tr>
            <td>Markas</td>
            <td>${result.venue}</td>
          </tr>
        </table>
        <p style="margin-top: 50px; font-weight: bold; text-decoration: underline">Skuad Tim</p>
        <table class="highlight">
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Posisi</th>
            <th>Tanggal Lahir</th>
            <th>Kebangsaan</th>
          </tr>
          ${squadsHTML}
        </table>
      </div>
    </div>`;
      detailTeam.innerHTML = detailTeamHTML;
    });
}

// fungsi untuk menampilkan list tabel klasemen
function getListStandings() {
  title.innerHTML = "Klasemen Sementara Liga Primer Inggris";
  fetch(standingEndPoin, fetchHeader)
    .then((response) => response.json())
    .then((resJson) => {
      console.log(resJson.standings[0]);
      let teams = "";
      let i = 1;
      resJson.standings[0].table.forEach((team) => {
        teams += `
                <tr>
                    <td style="padding-left:20px;">${i}.</td>
                    <td><img src="${team.team.crest}" alt="${team.team.name}" width="30px"></td>
                    <td>${team.team.name}</td>
                    <td>${team.playedGames}</td>
                    <td>${team.won}</td>
                    <td>${team.draw}</td>
                    <td>${team.lost}</td>
                    <td>${team.points}</td>
                </tr>
                `;
        i++;
      });
      contents.innerHTML = `
                <div class="card">
                    <table class="highlight responsive-table">
                        <thead>
                            <th></th>
                            <th></th>
                            <th>Nama Tim</th>
                            <th>PG</th>
                            <th>W</th>
                            <th>D</th>
                            <th>L</th>
                            <th>P</th>
                        </thead>
                        <tbody>
                            ${teams}
                        </tbody>
                    </table>
                </div>
            `;
    })
    .catch((err) => {
      console.error(err);
    });
}

function getListMatches() {
  title.innerHTML = "Jadwal Pertandingan Liga Primer Inggris";
  fetch(matchEndPoin, fetchHeader)
    .then((response) => response.json())
    .then((resJson) => {
      console.log(resJson.matches);
      let matchs = "";
      let i = 1;
      resJson.matches.forEach((match) => {
        let d = new Date(match.utcDate).toLocaleDateString("id");
        let scoreHomeTeam =
          match.score.fullTime.home == null ? 0 : match.score.fullTime.home;
        let scoreAwayTeam =
          match.score.fullTime.away == null ? 0 : match.score.fullTime.away;
        matchs += `
                <tr>
                    <td style="padding-left:20px;">${i}.</td>
                    <td>${match.homeTeam.name} vs ${match.awayTeam.name}</td>
                    <td>${d}</td>
                    <td>${scoreHomeTeam}:${scoreAwayTeam}</td>
                </tr>
                `;
        i++;
      });
      contents.innerHTML = `
                <div class="card">
                    <table class="highlight responsive-table">
                        <thead>
                            <th></th>
                            <th>Peserta</th>
                            <th>Tanggal</th>
                            <th>Skor Akhir</th>
                        </thead>
                        <tbody>
                            ${matchs}
                        </tbody>
                    </table>
                </div>
            `;
    })
    .catch((err) => {
      console.error(err);
    });
}

function loadPage(page) {
  switch (page) {
    case "teams":
      getListTeams();
      break;
    case "standings":
      getListStandings();
      break;
    case "matches":
      getListMatches();
      break;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".sidenav");
  var instances = M.Sidenav.init(elems);

  var elems = document.querySelectorAll(".modal");
  var instances = M.Modal.init(elems);

  document.querySelectorAll(".sidenav a, .topnav a").forEach((elm) => {
    elm.addEventListener("click", (evt) => {
      let sideNav = document.querySelector(".sidenav");
      M.Sidenav.getInstance(sideNav).close();
      page = evt.target.getAttribute("href").substr(1);
      loadPage(page);
    });
  });
  var page = window.location.hash.substr(1);
  if (page === "" || page === "!") page = "teams";
  loadPage(page);
});
