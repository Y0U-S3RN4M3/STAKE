document.getElementById("playDiv").addEventListener('click', () => {
    window.location.href = 'stakeGame.html';
});
document.getElementById("upgradeDiv").addEventListener('click', () => {
    window.location.href = 'stakeUpgrades.html';
});
document.getElementById("tutorialDiv").addEventListener('click', () => {
    window.location.href = 'learn.html';
});

document.addEventListener("selectionchange", () => {
    const selection = window.getSelection();
    const logo = document.querySelector("#headerContainer span img");
    const span = document.querySelector("#headerContainer span");

    if (
        selection.toString().length > 0 &&
        selection.containsNode(span, true)
    ) {
        logo.style.filter = "grayscale(100%)";
    } else {
        logo.style.filter = "";
    }
});