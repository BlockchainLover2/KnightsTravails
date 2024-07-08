class KnightsTravails{
    mapObj
    knight

    constructor() {
        this.mapObj = new MapGame()
        this.knight = new Knight()
    }
    async move(from,to){
        let queue = []
        queue.push(this.mapObj.getFromCoordinate(from))
        queue[0].isChecked = true
        while (queue.length > 0){
            let currentCoordinate = queue.shift()
            this.knight.coordinate.set(currentCoordinate.x, currentCoordinate.y)
            if(currentCoordinate.equals(to)){
                let array = []
                while (currentCoordinate !== null){
                    array.push(currentCoordinate)
                    currentCoordinate = currentCoordinate.previous
                }

                this.mapObj.table.forEach(x=>{
                    x.isChecked = false
                    x.previous = null

                })
                return array.map(coordinate=> {
                    return {x: coordinate.x, y: coordinate.y}
                }).reverse()
            }
            let possibleMoves = this.knight.getPossibleMoves(this.mapObj,currentCoordinate)
            for (let move of possibleMoves){
                if(!move.isChecked){
                    move.isChecked = true
                    move.previous = currentCoordinate
                    queue.push(move)
                }
            }
        }

    }
    search(){

    }
}
class MapGame{
    table
    constructor(){
        this.table = []
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                this.table.push(new Coordinate(j,i))
            }
        }
    }
    get(x,y){
        let index =  (y*8)+x
        return this.table[index]
    }
    getFromCoordinate(coordinate){
        if(coordinate!==null)
            return this.get(coordinate.x,coordinate.y)
        else
            return null
    }

}
class Coordinate{
    x
    y
    isChecked
    previous

    constructor(x,y,isChecked=false) {
        this.x = x;
        this.y = y;
        this.isChecked = isChecked;
        this.previous = null
    }
    get(){
        return {x: this.x, y: this.y};
    }
    equals(others){
        return this.x === others.x && this.y === others.y
    }
    set(x,y){
        if(!this.checkMovable(x,y))
            return null
        this.x = x;
        this.y = y;
        return this.get()
    }
    addToPosition(xAmount,yAmount){
        return this.set(this.x+xAmount,this.y+yAmount);
    }
    calculateThePosition(xAmount,yAmount){
        if(this.checkMovable(this.x+xAmount,this.y+yAmount))
            return new Coordinate(this.x+xAmount,this.y+yAmount)
        else
            return null
    }
    checkMovable(x,y){
        return !(x<0 || x>7 || y<0 || y>7)
    }
}
class Knight{
    coordinate

    constructor() {
        this.coordinate = new Coordinate(0,0)
    }

    getPossibleMoves(map,from){
        let array = []
        array.push(
            map.getFromCoordinate(from.calculateThePosition(2,1)))
        array.push(map.getFromCoordinate(from.calculateThePosition(-2,1)))
        array.push(map.getFromCoordinate(from.calculateThePosition(2,-1)))
        array.push(map.getFromCoordinate(from.calculateThePosition(-2,-1)))
        array.push(map.getFromCoordinate(from.calculateThePosition(1,2)))
        array.push(map.getFromCoordinate(from.calculateThePosition(-1,2)))
        array.push(map.getFromCoordinate(from.calculateThePosition(1,-2)))
        array.push(map.getFromCoordinate(from.calculateThePosition(-1,-2)))

        return array.filter(x=> x!==null)
    }
}

const container = document.querySelector(".container")
const fromText = document.querySelector(".text>*:nth-child(2)")
const toText = document.querySelector(".text>*:nth-child(4)")


let from = null
let to = null
let mapToElement = new Map()

let currentEvent = "from"

async function createUI(mapObj,executedEventTarget){
    container.innerHTML = ""
    mapToElement = new Map()
    for (let i = 0; i < Math.sqrt(mapObj.table.length)+1; i++) {
        for (let j = 0; j < Math.sqrt(mapObj.table.length)+1; j++) {
            let length = Math.sqrt(mapObj.table.length)
            let div = document.createElement('div')


            if(j === 0 || i === Math.sqrt(mapObj.table.length)){
                div.classList.add("numBlock")
                let index = i === Math.sqrt(mapObj.table.length)?j-1:length-1-i
                div.textContent = index.toString()
                if(index === -1)
                    div.style.visibility = "hidden"
            }
            else{
                div.classList.add("block")
                if((i+j) % 2 === 0)
                    div.classList.add("black")

                let obj = mapObj.get(j-1,length-1-i)
                mapToElement.set(obj,div)

                div.addEventListener('click',(e)=>addEvent(e.target,obj,mapObj))

                if(executedEventTarget !== undefined && executedEventTarget.equals(obj)){
                    await addEvent(div,obj,mapObj)
                }

            }
            container.append(div)
        }
    }
}
async function addEvent(target,mapBlock,mapObj){
    if(currentEvent === "from"){
        if(fromText.style.visibility === "visible"){
            fromText.style.visibility = "hidden"
            toText.style.visibility = "hidden"
            createUI(mapObj,mapBlock)
            return
        }



        from = mapBlock
        currentEvent = "to"
        fromText.textContent = `[${mapBlock.x},${mapBlock.y}]`
        fromText.style.visibility = "visible"

        let img = document.createElement('img')
        img.src = "black.svg"
        target.appendChild(img)
    }
    else if(currentEvent === "to"){
        to = mapBlock
        toText.textContent = `[${mapBlock.x},${mapBlock.y}]`
        toText.style.visibility = "visible"
    }

    if(from !== null && to !== null){
        let array = await game.move(from,to)

        for (let i = 0; i < array.length; i++) {
            let element = mapToElement.get(mapObj.getFromCoordinate(array[i]))
            let div = document.createElement('div')
            div.textContent = (i+1).toString()
            div.style.position = "absolute"
            element.appendChild(div)
            element.style.background = "blue"

        }


        let img = document.createElement('img')
        img.src = "black.svg"
        target.appendChild(img)
        from = null
        to = null
        currentEvent = "from"

    }
}

let game = new KnightsTravails()
createUI(game.mapObj)



