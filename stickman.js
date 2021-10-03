const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth
canvas.height = window.innerHeight

// Settings
var showLeaves = true;
var settingAnimation = true
var settingTreeDepth = 10
var settingTrunkThickness = true;
var settingsConnectedTrunk = true;
var treeColor = '#4b4a33'

var settingsFall = false
var settingsSpring = true


// Constents
var BRANCH_LENGTH = (window.innerHeight / (.00001 * Math.pow(settingTreeDepth, 10))) //.4
var LEAF_SIZE = 25
var FLEXIBILITY = 200


// Animation Counter
var counter = 1

// Images
const imageSummer = new Image(60, 45);
imageSummer.src = 'branch.png';

const imageFall = new Image(60, 45);
imageFall.src = 'branch2.png';

// Helper Functions
function toDegrees (angle) {
    return angle * (180 / Math.PI);
}

function toRadians (angle) {
    return angle * (Math.PI / 180);
}

function treeRandomness(value) {
    return 1 - value + Math.random() * value * 2 
}

function tm(v, r) {
    return (Math.cos(counter/100 + (r * 100)) * (1/v)) / 400
}


// Settings Functions
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkBoxShowLeaves() {
    if (document.getElementById('checkbox1').checked) {
        showLeaves = true
    } else {
        showLeaves = false
    };
}

function checkBoxAnimate() {
    if (document.getElementById('checkbox2').checked) {
        settingAnimation = true
    } else {
        settingAnimation = false
    };
}

function sliderDepth() {
    let val = document.getElementById("size").value
    settingTreeDepth = val
    document.getElementById("settingTreeDepth").innerHTML = val
}

function checkBoxTrunkThickness() {
    if (document.getElementById('checkbox3').checked) {
        settingTrunkThickness = true
    } else {
        settingTrunkThickness = false
    };
}

function checkBoxConnectedTrunk() {
    if (document.getElementById('checkbox4').checked) {
        settingsConnectedTrunk = true
    } else {
        settingsConnectedTrunk = false
    };
}

function checkBoxSeasonFall() {
    settingsFall = true  
    settingsSummer = false
    treeColor = '#80461b'
}

function checkBoxSeasonSummer() { 
    settingsFall = false  
    settingsSummer = true
    treeColor = '#4b4a33'
}

// Onload function
function onload() {
    document.getElementById("settingTreeDepth").innerHTML = settingTreeDepth
}

// Tree Functions
function drawTreeFancy(x, y, branch) {
    let branchY = 0
    let branchX = 0
    for (i in branch.branches) {
        if (branch.depth > -1) {
            let newBranchY = Math.cos(branch.angle) * branch.length * branch.depth * BRANCH_LENGTH
            let newBranchX = Math.sin(branch.angle) * branch.length * branch.depth * BRANCH_LENGTH
           
            if (settingTrunkThickness) {
                ctx.lineWidth = branch.depth - 2
                ctx.beginPath(); 
            } else {
                ctx.lineWidth  = 1
            }
            
            
            
            ctx.moveTo(branchX + x, branchY + y);
            ctx.lineTo(newBranchX + branchX + x, newBranchY + branchY + y);
            if (branch.depth > 0 && settingsConnectedTrunk) {
                let newerBranchY = Math.cos(branch.branches[i].angle) * branch.branches[i].length * branch.branches[i].depth * BRANCH_LENGTH
                let newerBranchX = Math.sin(branch.branches[i].angle) * branch.branches[i].length * branch.branches[i].depth * BRANCH_LENGTH
           
                ctx.lineTo(newerBranchX + newBranchX + branchX + x, newerBranchY + newBranchY + branchY + y);
                branch.branches[i].x = newerBranchX + newBranchX + branchX + x
                branch.branches[i].y = newerBranchY + newBranchY + branchY + y

            }
            else if (!settingsConnectedTrunk) {
                branch.branches[i].x = newBranchX + branchX + x
                branch.branches[i].y = newBranchY + branchY + y
            }
            if (settingTrunkThickness) {
                ctx.stroke();
            }
            
            drawTreeFancy(newBranchX + x,newBranchY + y, branch.branches[i])
        }          
    }
}

function updateTree(branch) {
    branch.angle += tm(branch.depth, branch.rSeed)
    for (i in branch.branches) {
        if (branch.branches[i].depth > 0) {
            updateTree(branch.branches[i])
        }          
    }
}

//https://stackoverflow.com/questions/17411991/html5-canvas-rotate-image
// no need to use save and restore between calls as it sets the transform rather 
// than multiply it like ctx.rotate ctx.translate ctx.scale and ctx.transform
// Also combining the scale and origin into the one call makes it quicker
// x,y position of image center
// scale scale of image
// rotation in radians.
function drawImage(image, x, y, scale, rotation){
    ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
    ctx.rotate(rotation );
    ctx.drawImage(image, -image.height - 2.5, -image.width * 2.5);
} 


function drawLeaves(branch) {
    for (i in branch.branches) {
        drawLeaves(branch.branches[i])
        if (branch.branches[0].depth == 0) {

            image = imageSummer
            if (settingsFall) {
                image = imageFall
            }

            drawImage(image, branch.branches[i].x, branch.branches[i].y, .6 + (branch.rSeed / 3),  -branch.angle + Math.PI )
        }
    } 
    ctx.setTransform(1,0,0,1,0,0);
}

function createTree(degree, len, depth, first) {
    depth -= 1
    
    if (depth <= 0) {
        return {"angle":degree * treeRandomness(.8), "length":len * treeRandomness(.2), "depth":depth, "rSeed":Math.random(), "branches":[]}
    }
    

    let numberOfNewBranches = getRandomInt(1,10)
    if (numberOfNewBranches > 2) {
        numberOfNewBranches = 2
    }


    // if (first) {
    //     numberOfNewBranches = 1
    //     first = false
    // }

    let branches = []
    let leanAmount = getRandomInt(0,2)
    for (let i = 0; i < numberOfNewBranches; i++) {
        while (true) {
            let newValue = treeRandomness(.15)
            if (leanAmount <= 1 && newValue >= 1) {
                leanAmount = newValue
                break
            } 
            else if (leanAmount > 1 && newValue < 1) {
                leanAmount = newValue
                break
            }
        }

        if (first) {
            leanAmount = 1
        }
        
        let newBranch = createTree(degree * leanAmount, len * treeRandomness(.1), depth, false)
        branches.push(newBranch)
    }
    return {
        "angle":degree, 
        "length":len, 
        "depth":depth, 
        "rSeed":Math.random(), 
        "branches":branches
    }
}



var tree = null
let treeX = window.innerWidth / 2
let treeY = window.innerHeight - 50;

function genNewTree() {
    tree = createTree(toRadians(180),20, settingTreeDepth, true) // 13
    drawTreeFancy(treeX, treeY, tree)
    BRANCH_LENGTH = (window.innerHeight / (20 * Math.pow(settingTreeDepth, 2)))
}

genNewTree()



var d = new Date();
let oldDate = d.getTime();
let newDate = null
let totalFPS = 0
let fps = 0
function animation(timestamp) {
    d = new Date();
    oldDate = newDate
    newDate = d.getTime();
    fps += (1000 / (newDate - oldDate))
    if (counter % 20 == 0) {
        document.getElementById("fps").innerHTML = (fps / 20).toFixed(2)
        fps = 0
    }
    


    counter += 1
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (settingAnimation) {
        updateTree(tree)
    }
    

    ctx.strokeStyle = treeColor;
    if (!settingTrunkThickness) {
        ctx.beginPath(); 
        drawTreeFancy(treeX, treeY, tree)
        ctx.stroke();
    } else {
        drawTreeFancy(treeX, treeY, tree)
    }



    if (showLeaves) {
        drawLeaves(tree)
    }
    
    
    window.requestAnimationFrame(animation);
}

window.requestAnimationFrame(animation);

