document.getElementById('navbar').innerHTML = `
<nav class="navbar">

  <!-- LOGO -->
  <div class="logo">
    <a href="index.html">Megha Quiz</a>
  </div>

  <!-- NAV LINKS -->
  <ul class="nav-links">

    <li>
      <a href="index.html">Home</a>
    </li>

    <li>
      <a href="practice.html">Practice</a>
    </li>

    <li>
      <a href="mock-test.html">Mock Test</a>
    </li>

    <li>
      <a href="daily-quiz.html">Daily Quiz</a>
    </li>

    <li>
      <a href="current-affairs.html">Current Affairs</a>
    </li>

    <li>
      <a href="about.html">About</a>
    </li>

    <li>
      <a href="contact.html">Contact</a>
    </li>

    <!-- SEARCH ITEM -->
    <li class="nav-search">
      <form id="navSearchForm">
        <input
          type="text"
          id="navSearchInput"
          placeholder="Search..."
        >
        <div id="searchResults"></div>
      </form>
    </li>

  </ul>

  <!-- AUTH BUTTONS -->
  <div class="nav-buttons">

    <a href="login.html" class="btn btn-outline">
      Login
    </a>

    <a href="signup.html" class="btn btn-primary">
      Sign Up
    </a>
    <button id="restartBtn" class="btn btn-primary">
      Reset
    </button>
  </div>

</nav>
`;