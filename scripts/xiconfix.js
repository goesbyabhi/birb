const logoObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      logoFix();
      faviconFix();
    }
  });
});

const titleObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      titleFix();
    }
  });
});

function faviconFix() {
  document.querySelector('link[rel="shortcut icon"]').href =
    chrome.runtime.getURL("../assets/favicon.png");
}
function logoFix() {
  const twitterLogoSelector = 'h1[role="heading"] a[aria-label="X"]';
  const element = document.querySelector(twitterLogoSelector);
  if (!element) {
    console.log("Logo not detected");
    return;
  } else {
    const newLogo = document.createElement("img");
    newLogo.src = chrome.runtime.getURL("../assets/twitter.svg");
    newLogo.alt = "Custom Logo";
    newLogo.style.cssText = "width: 45px; padding-top: 12px;";
    element.innerHTML = "";
    element.appendChild(newLogo);
    logoObserver.disconnect();
  }
}

function titleFix() {
  if (document.title.endsWith("X")) {
    document.title = document.title.slice(0, -1) + "Twitter";
  }
}

logoObserver.observe(document.body, {
  childList: true,
  subtree: true,
});
titleObserver.observe(document.querySelector("head"), {
  childList: true,
});
