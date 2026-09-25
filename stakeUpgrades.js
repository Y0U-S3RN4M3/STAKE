const speedUpgradeButton = document.getElementById("speedUpgradeButton"); 
const speedUpgradeButtonMax = document.getElementById("speedUpgradeButtonMax");

const headStrengthUpgradeButton = document.getElementById("headStrengthUpgradeButton"); 
const headStrengthUpgradeButtonMax = document.getElementById("headStrengthUpgradeButtonMax"); 

const tailStrengthUpgradeButton = document.getElementById("tailStrengthUpgradeButton"); 
const tailStrengthUpgradeButtonMax = document.getElementById("tailStrengthUpgradeButtonMax"); 

const waveSkippingUpgradeButton = document.getElementById("waveSkippingUpgradeButton"); 
const waveSkippingUpgradeButtonMax = document.getElementById("waveSkippingUpgradeButtonMax"); 

const buySpeed = document.getElementById("buySpeed"); 
const buyHeadStrength = document.getElementById("buyHeadStrength"); 
const buyTailStrength = document.getElementById("buyTailStrength"); 
const buyWaveSkip = document.getElementById("buyWaveSkip");

const speedAmountDisplay = document.getElementById("speedAmount");
const headStrengthAmountDisplay = document.getElementById("headStrengthAmount");
const tailStrengthDisplay = document.getElementById("tailStrengthAmount");
const waveSkippingDisplay = document.getElementById("waveSkippingAmount");

const pointLabel = document.getElementById("points");

const normalButtons = [ 
    speedUpgradeButton, 
    headStrengthUpgradeButton, 
    tailStrengthUpgradeButton, 
    waveSkippingUpgradeButton 
]; 

const maxButtons = [ 
    speedUpgradeButtonMax, 
    headStrengthUpgradeButtonMax, 
    tailStrengthUpgradeButtonMax, 
    waveSkippingUpgradeButtonMax 
]; 

const allButtons = [normalButtons, maxButtons]; 
 
let stats = { 
    points: 0, 
    speedLVL: 1, 
    headStrengthLVL: 1, 
    tailStrengthLVL: 1, 
    waveSkippingLVL: 1, 
} 
 
function saveStats(){ 
    localStorage.setItem("statsSave", JSON.stringify(stats)); 
} 
 
function loadStats(){ 
    const savedStats = localStorage.getItem("statsSave"); 
 
    if(savedStats){ 
        stats = JSON.parse(savedStats); 
    } 
} 
 
function alert(message){ 
    const alertDiv = document.getElementById(`alertDiv`); 
    const alert = document.createElement(`div`); 
    alert.textContent = message; 
    alert.classList.add(`alert`); 
    alertDiv.appendChild(alert); 
    const divCount = alertDiv.children.length; 
    if(divCount > 4){ 
        alertDiv.removeChild(alertDiv.firstElementChild) 
    } 
    setTimeout(() => { 
        if(alert.parentNode === alertDiv){ 
            alertDiv.removeChild(alert); 
        } 
    }, 3000); 
} 
 
async function customConfirm(message) { 
 
    return new Promise(resolve => { 
        const overlay = document.createElement("div"); 
        overlay.id = "confirmOverlay"; 
 
        const confirmBox = document.createElement("div"); 
        confirmBox.id = "confirm"; 
        confirmBox.classList.add("confirm"); 
 
        const text = document.createElement("div"); 
        text.textContent = message; 
 
        const btnContainer = document.createElement("div"); 
        btnContainer.classList.add("allowanddeny"); 
 
        const allow = document.createElement("button"); 
        allow.classList.add("btn"); 
        allow.classList.add("allowBtn"); 
        allow.textContent = "allow"; 
 
        allow.addEventListener("click", () => { 
 
            confirmBox.remove(); 
            overlay.remove(); 
 
            alert("Confirmed"); 
  
            resolve(true); 
 
        }); 
 
        const deny = document.createElement("button"); 
        deny.classList.add("btn"); 
        deny.classList.add("denyBtn"); 
        deny.textContent = "deny"; 
 
        deny.addEventListener("click", () => { 
 
            confirmBox.remove(); 
            overlay.remove(); 
 
            setCountDown(); 
 
            alert("Rejected"); 
 
            resolve(false); 
 
        }); 
 
        document.body.appendChild(overlay); 
        document.body.appendChild(confirmBox); 
 
        confirmBox.appendChild(text); 
        confirmBox.appendChild(document.createElement("br")); 
        confirmBox.appendChild(btnContainer); 
 
        btnContainer.appendChild(allow); 
        btnContainer.appendChild(deny); 
 
    }); 
 
} 
 
function findPrice(element){ 
    switch(element){ 
        case speedUpgradeButton: 
        case speedUpgradeButtonMax: 
            return (stats.speedLVL === 1 ? 10 : stats.speedLVL ** 5); 
 
        case headStrengthUpgradeButton: 
        case headStrengthUpgradeButtonMax: 
            return (stats.headStrengthLVL === 1 ? 10 : stats.headStrengthLVL ** 5); 
 
        case tailStrengthUpgradeButton: 
        case tailStrengthUpgradeButtonMax: 
            return stats.tailStrengthLVL === 1 
                ? 25 
                : Math.round((stats.tailStrengthLVL ** 5) * 1.25 / 5) * 5; 
 
        case waveSkippingUpgradeButton: 
        case waveSkippingUpgradeButtonMax: 
            return (stats.waveSkippingLVL === 1 
                ? 625 
                : 5 ** ((stats.waveSkippingLVL * 2) + 2)); 
    } 
} 

function findIfMax(element){ 
    switch(element){ 
        case speedUpgradeButton: 
            return false; 
 
        case speedUpgradeButtonMax: 
            return true; 
 
        case headStrengthUpgradeButton: 
            return false; 
 
        case headStrengthUpgradeButtonMax: 
            return true; 
 
        case tailStrengthUpgradeButton: 
            return false; 
 
        case tailStrengthUpgradeButtonMax: 
            return true; 
 
        case waveSkippingUpgradeButton: 
            return false; 
 
        case waveSkippingUpgradeButtonMax: 
            return true; 
    } 
} 

async function upgradeStat(buttonElement, max) { 
    let price = findPrice(buttonElement); 

    if (stats.points < price) { 
        alert("You do not have enough boxes."); 
        return; 
    } 
 
    const accepted = await customConfirm( 
        `Are you sure you want to upgrade this, it costs ${price}. If you are buying the maximum amount, you are about to lose most of your money.` 
    ); 
 
    if (!accepted) { 
        return; 
    } 

    switch (buttonElement) { 

        case speedUpgradeButton: 
            stats.points -= price; 
            stats.speedLVL++; 
            break; 

        case speedUpgradeButtonMax: 
            while (stats.points >= price) { 
                stats.points -= price; 
                stats.speedLVL++; 
                price = findPrice(buttonElement); 
            } 
            break; 

        case headStrengthUpgradeButton: 
            stats.points -= price; 
            stats.headStrengthLVL++; 
            break; 

        case headStrengthUpgradeButtonMax: 
            while (stats.points >= price) { 
                stats.points -= price; 
                stats.headStrengthLVL++; 
                price = findPrice(buttonElement); 
            } 
            break; 

        case tailStrengthUpgradeButton: 
            stats.points -= price; 
            stats.tailStrengthLVL++; 
            break; 

        case tailStrengthUpgradeButtonMax: 
            while (stats.points >= price) { 
                stats.points -= price; 
                stats.tailStrengthLVL++; 
                price = findPrice(buttonElement); 
            } 
            break; 

        case waveSkippingUpgradeButton: 
            stats.points -= price; 
            stats.waveSkippingLVL++; 
            break; 

        case waveSkippingUpgradeButtonMax: 
            while (stats.points >= price) { 
                stats.points -= price; 
                stats.waveSkippingLVL++; 
                price = findPrice(buttonElement); 
            } 
            break; 
    } 
    saveStats();
    updateUI(); 
} 

allButtons.forEach(buttonGroup => { 
    buttonGroup.forEach(button => { 
 
        button.addEventListener("click", async () => { 
 
            await upgradeStat(button, findIfMax(button)); 
 
        }); 
 
    }); 
});

function convertLVLtoDescription(type, num){ 
    switch(type){ 

        case 'speed': 
            switch(num){ 
                case 1: return 'Worm'; 
                case 2: return 'Slow'; 
                case 3: return 'Average'; 
                case 4: return 'Fast'; 
                case 5: return 'Speedy'; 
                case 6: return 'Quick'; 
                case 7: return 'Swift'; 
                case 8: return 'Rapid'; 
                case 9: return `That snail's fast!`; 
                case 10: return 'Lightning'; 
                case 11: return 'Hyper'; 
                case 12: return 'Supersonic'; 
                case 13: return 'Insane'; 
                case 14: return 'Unreal'; 
                case 15: return 'Extreme'; 
                case 16: return 'Ridiculous'; 
                case 17: return 'Absurd'; 
                case 18: return `Where'd He Go?`; 
                case 19: return 'Oh No'; 
                case 20: return 'Hey, why is it September 11 3145?'; 
                default: return '.   .   .'; 
            }

        case 'headStrength': 
            switch(num){ 
                case 1: return 'Weakling'; 
                case 2: return 'Ugly'; 
                case 3: return 'Normal'; 
                case 4: return 'Strong'; 
                case 5: return 'Powerful'; 
                case 6: return 'Tuff'; 
                case 7: return 'Jacked'; 
                case 8: return 'Brutal'; 
                case 9: return 'Devastating'; 
                case 10: return 'Destructive'; 
                case 11: return 'Too Strong'; 
                case 12: return 'Overwhelming'; 
                case 13: return 'Monstrous'; 
                case 14: return 'Titan'; 
                case 15: return 'Colossal'; 
                case 16: return 'Unstoppable'; 
                case 17: return 'Invincible'; 
                case 18: return 'Unbreakable'; 
                case 19: return 'Here we go again...'; 
                case 20: return 'One hit kill'; 
                default: return 'ONE HIT KILL'; 
            }

        case 'tailStrength': 
            switch(num){ 
                case 1: return 'Flimsy'; 
                case 2: return 'Weak'; 
                case 3: return 'Flexible'; 
                case 4: return 'Sturdy'; 
                case 5: return 'Strong'; 
                case 6: return 'Tough'; 
                case 7: return 'Reinforced'; 
                case 8: return 'Hardened'; 
                case 9: return 'Heavy'; 
                case 10: return 'Armored'; 
                case 11: return 'Fortified'; 
                case 12: return 'Tungsten'; 
                case 13: return 'Undefinedanium'; 
                case 14: return 'Indestructible'; 
                case 15: return 'Unbreakable'; 
                case 16: return 'Immovable'; 
                case 17: return 'Absolute'; 
                case 18: return 'Eternal'; 
                case 19: return 'INFINITE'; 
                case 20: return 'IMMORTAL'; 
                default: return 'IMMORTAL'; 
            }

        case 'waveSkipping': 
            switch(num){ 
                case 1: return 'E'; 
                case 2: return 'D'; 
                case 3: return 'C'; 
                case 4: return 'B'; 
                case 5: return 'A'; 
                case 6: return 'S'; 
                default: return 'S++'; 
            }
    }
}
 
function updateUI(){ 
    pointLabel.textContent = `Strange Orange Boxes: ${stats.points}`; 

    buySpeed.textContent = `Speed: ${convertLVLtoDescription('speed', stats.speedLVL)} (LVL ${stats.speedLVL})`; 
    buyHeadStrength.textContent = `Head Strength: ${convertLVLtoDescription('headStrength', stats.headStrengthLVL)} (LVL ${stats.headStrengthLVL})`; 
    buyTailStrength.textContent = `Tail Strength: ${convertLVLtoDescription('tailStrength', stats.tailStrengthLVL)} (LVL ${stats.tailStrengthLVL})`; 
    buyWaveSkip.textContent = `Knowledge: ${convertLVLtoDescription('waveSkipping', stats.waveSkippingLVL)} (LVL ${stats.waveSkippingLVL})`;

    speedAmountDisplay.textContent = `${findPrice(speedUpgradeButton)} Boxes`
    headStrengthAmountDisplay.textContent = `${findPrice(headStrengthUpgradeButton)} Boxes`
    tailStrengthDisplay.textContent = `${findPrice(tailStrengthUpgradeButton)} Boxes`
    waveSkippingDisplay.textContent = `${findPrice(waveSkippingUpgradeButton)} Boxes`
} 
 
function init(){ 
    loadStats(); 
    updateUI();
}
 
window.addEventListener("load", init);