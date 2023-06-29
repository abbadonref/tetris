document.addEventListener("DOMContentLoaded", function(){
    createPage()
    changeBarClass('settings')
    document.getElementById('modalWind').style.display = 'block'
});

class Cell{
    constructor(num, group, color='black') {
        this.num = num
        this.color = color
    }
}

let timer = new Date(0)
var countCorrect
var curEl
var cellsSize
let group
let choseTableSize = 2
let choseGroups = 1
var groupColorStyles = ['green', 'red', 'magenta']
let countWClick = 0
let barTool = 'settings'

function changeBarClass(val){
    console.log(barTool)
    if (val === 'settings') {
        barTool = 'settings'
        document.getElementById("barSettings").className = "w3-bar-item w3-button w3-indigo w3-hover-indigo"
        document.getElementById("barStats").className = "w3-bar-item w3-button w3-light-blue w3-hover-aqua"

        html = `<div class="w3-container">
            <div class="w3-half">
                <h4>Table Size</h4>
                <select id="tableSize" class="w3-select" onChange="createPage()">
                    <option value="2">2 x 2</option>
                    <option value="3">3 x 3</option>
                    <option value="4">4 x 4</option>
                    <option value="5">5 x 5</option>
                    <option value="6">6 x 6</option>
                    <option value="7">7 x 7</option>
                    <option value="8">8 x 8</option>
                    <option value="9">9 x 9</option>
                    <option value="10">10 x 10</option>
                </select>
            </div>
            <div class="w3-half">
                <h4>Groups</h4>
                <select id="groups" class="w3-select" onChange="createPage()">
                    <option value="1">1 parameter</option>
                    <option value="2">2 parameters</option>
                    <option value="3">3 parameters</option>
                </select>
            </div>
            <h5>Execution order:</h5>
            <div id="exOrder">
            </div>`
        document.getElementById("menu").innerHTML = html
        document.getElementById('tableSize').value = choseTableSize
        document.getElementById('groups').value = choseGroups
        makeColorNum(choseGroups)
    }
    else if (val === 'stats') {
        barTool = 'stats'
        document.getElementById("barSettings").className = "w3-bar-item w3-button w3-light-blue w3-hover-aqua"
        document.getElementById("barStats").className = "w3-bar-item w3-button w3-indigo w3-hover-indigo"
        choseTableSize = document.getElementById('tableSize').value
        choseGroups = document.getElementById('groups').value
        document.getElementById("menu").innerHTML = `<div>
                    <table class="w3-table-all w3-large">
                        <tr>
                            <td>Time</td>
                            <td>${printDate(timer)}</td>
                        </tr>
                        <tr style="background-color: #e89a9a" ">
                            <td>Wrong Clicks</td>
                            <td>${countWClick}</td>
                        </tr>
                    </table>
                </div>`

    }
}

function makeColorNum(choseGroups){
    let exOrder = document.getElementById('exOrder')
    let order = ''

    if (choseGroups > 1) {
        for (let i = 0; i < choseGroups; i++) {
            order += `<div class="color-num" style="color: ${groupColorStyles[i]}">${1} &#8594 ${group[i]}</div>`
        }
    }
    else{
        order += `<div class="color-num" style="color: black">${1} &#8594 ${group[0]}</div>`
    }
    exOrder.innerHTML = order
}


function createPage(){
    delete curEl
    curEl = new Cell(1,1)
    countCorrect = 0
    var shuffleCount = 777
    group = []

    let val = document.getElementById("tableSize").value
    let groupsNum = document.getElementById('groups').value

    cellsSize = val * val
    groupSize = Math.floor(cellsSize / groupsNum)



    for (let i = 0; i < groupsNum; i++) {
        group.push(groupSize)
    }
    group[0] += cellsSize % groupsNum


    let cell = null
    let cells = []
    for (let g = 0; g < groupsNum; g++) {
        for (let num = 1; num <= group[g]; num++) {
            cell = new Cell(num, g + 1)
            if (groupsNum > 1) {
                cell.color = groupColorStyles[g]
            }
            cells.push(cell)
        }
    }

    for (var i = 0; i < shuffleCount; i++) {
        var aIdx = Math.floor(Math.random() * cellsSize);
        var bIdx = Math.floor(Math.random() * cellsSize);
        var aVal = cells[aIdx];
        cells[aIdx] = cells[bIdx];
        cells[bIdx] = aVal;
    }


    let rows = ''
    let table = document.getElementById('table')
    let size = 100 / val

    for (let i = 0; i < val; i++) {
        rows += `<div class="row" style="height: ${size}%">\n`
        for (let j = 0; j < val; j++) {
            rows += `<div id="cell_${i}_${j}" class="cell group_${cells[i * val + j].group}" style="width: ${size}%; color: ${cells[i * val + j].color};" onclick=cellClickCheck(this.id)>${cells[i * val + j].num}</div>\n`
        }
        rows += `</div>`
    }
    table.innerHTML = rows

    makeColorNum(document.getElementById('groups').value)
}

function cellClickCheck(id){
    let el = document.getElementById(id)
    let gr = el.getAttribute('class').split(' ')[1].slice(-1)
    let num = el.textContent

    if (curEl.group == gr && curEl.num == num){
        countCorrect++
        checkGood(el)
        if (countCorrect === cellsSize) {
            timer = new Date() - timer
            document.getElementById('modalWind').style.display = 'block'
            changeBarClass('stats')

        }

        if (group.length > 1) {
            curEl.group++
            if (curEl.group > group.length) {
                curEl.group = 1
                curEl.num++
            }
        }
        else {
            curEl.num++
        }

    }
    else {
        checkWrong(el)
        countWClick++
    }
}

function checkGood(el){
    el.classList.add("correct-cell");
}

function checkWrong(el){
    el.classList.add("wrong-cell")
    setTimeout(() => el.classList.remove("wrong-cell"), 500)
}

function start(){
    if (barTool === 'settings') {
        countWClick = 0
        createPage()
        document.getElementById('modalWind').style.display = 'none'
        delete timer
        timer = new Date()
    }
}

function printDate(timeInMiliseconds){
    let h,m,s
    h = Math.floor(timeInMiliseconds/1000/60/60)
    m = Math.floor((timeInMiliseconds/1000/60/60 - h)*60)
    s = Math.floor(((timeInMiliseconds/1000/60/60 - h)*60 - m)*60)
    ms = Math.floor(((timeInMiliseconds - h*1000*60*60) - m*60*1000) - s*1000)

    s < 10 ? s = `0${s}`: s = `${s}`
    m < 10 ? m = `0${m}`: m = `${m}`
    h < 10 ? h = `0${h}`: h = `${h}`
    ms < 10 ? ms = `00${ms}` : (ms < 100 ? ms = `0${ms}` : ms = `${ms}`)

    return `${h}:${m}:${s}:${ms}`
}
