var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var formSubmitHandler = function (event) {
  event.preventDefault();
  //get value from input el
  var username = nameInputEl.value.trim();

  if (username) {
    getUserRepos(username);
    nameInputEl.value = "";
  } else {
    alert("Please enter a GitHub username");
  }
  console.log(event);
};

var getUserRepos = function (user) {
  // format github api url
  var apiUrl = "https://api.github.com/users/" + user + "/repos";
  // make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      // USER was found
      if (response.ok) {
        response.json().then(function (data) {
          displayRepos(data, user);
        });
        // USER not found
      } else {
        alert("ERROR: GitHub User Not Found");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to GitHub");
    });
};

var displayRepos = function (repos, searchTerm) {
  // if user has no repos
  if (repos.length === 0) {
    repoContainerEl.textContent = "No Repsositories found.";
    return;
  }

  console.log(repos);
  console.log(searchTerm);
  // clear old content
  repoContainerEl.textContent = "";
  repoSearchTerm.textContent = searchTerm;

  // loop over repos
  for (var i = 0; i < repos.length; i++) {
    //format repo name
    var repoName = repos[i].owner.login + "/" + repos[i].name;
    //creat a container for each repo
    var repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
    //create a span el to hold repo name
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;
    //append name to container
    repoEl.appendChild(titleEl);

    //create status EL
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    // check if current repo has issues or not
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" +
        repos[i].open_issues_count +
        " issue(s)";
    } else {
      statusEl.innerHTML =
        "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    // append to Status to repo
    repoEl.appendChild(statusEl);

    // append container to DOM
    repoContainerEl.appendChild(repoEl);
  }
};

userFormEl.addEventListener("submit", formSubmitHandler);
getUserRepos();
