const logoObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      logoFix();
      faviconFix();
      premRemove();
	  grokRemove();
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

function getCurrTheme() {
  const body = document.body;
  const backgroundColor =
    body.style.backgroundColor || getComputedStyle(body).backgroundColor;

  if (backgroundColor.startsWith("#")) {
    const hex = backgroundColor.substring(1);
    backgroundColor = `rgb(${parseInt(hex.slice(0, 2), 16)}, ${parseInt(
      hex.slice(2, 4),
      16,
    )}, ${parseInt(hex.slice(4, 6), 16)})`;
  }

  if (backgroundColor === "rgb(0, 0, 0)" || backgroundColor === "#000000") {
    return "dark";
  } else if (
    backgroundColor === "rgb(21, 32, 43)" ||
    backgroundColor === "#15202B"
  ) {
    return "blue";
  } else if (
    backgroundColor === "rgb(255, 255, 255)" ||
    backgroundColor === "#FFFFFF"
  ) {
    return "light";
  } else {
    return "unknown";
  }
}

function faviconFix() {
  document.querySelector('link[rel="shortcut icon"]').href =
    chrome.runtime.getURL("../assets/favicon.png");
}
function logoFix() {
  const twitterLogoSelector = 'h1[role="heading"] a[aria-label="X"]';
  const element = document.querySelector(twitterLogoSelector);

  if (!element) {
//    console.log("Lmao Logo not detected");
    return;
  } else {
    const theme = getCurrTheme();
    const newLogo = document.createElement("img");

    switch (theme) {
      case "dark":
        newLogo.src = chrome.runtime.getURL("../assets/twitterDark.svg");
        break;
      case "blue":
        newLogo.src = chrome.runtime.getURL("../assets/twitter.svg");
        break;
      case "light":
        newLogo.src = chrome.runtime.getURL("../assets/twitter.svg");
        break;
      default:
//        console.log("Unknown theme");
        return;
    }

    newLogo.alt = "Custom Logo";
    newLogo.style.cssText =
      "width: 30px; height: 30px; margin-top: 10px; margin-right: 5px; padding-left: 8px";
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

function premRemove() {
  const premiumSelector = 'nav[role="navigation"] a[aria-label="Premium"]';
  const element = document.querySelector(premiumSelector);
  if (!element) {
//    console.log("Lmao Premium Nav section not found");
    return;
  } else {
    element.remove();
    logoObserver.disconnect();
  }
}

function grokRemove() {
	const grokSelector = 'nav[role="navigation"] a[aria-label="Grok"]';
	const element = document.querySelector(grokSelector);
	if (!element) {
//		console.log("Lmao Grok not found");
		return;
	} else {
		element.remove();
		logoObserver.disconnect();
	}
}

logoObserver.observe(document.body, {
  childList: true,
  subtree: true,
});
titleObserver.observe(document.querySelector("head"), {
  childList: true,
});
