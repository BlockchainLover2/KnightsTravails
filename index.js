class KnightsTravails{
    mapObj
    knight

    constructor() {
        this.mapObj = new Map()
        this.knight = new Knight()
    }
    move(from,to){
        let queue = []
        queue.push(from)
        while (queue.length > 0){
            let currentCoordinate = queue.shift()
            this.knight.coordinate.set(currentCoordinate.x, currentCoordinate.y)
            if(currentCoordinate.equals(to)){
                let array = []
                while (currentCoordinate !== null){
                    array.push(currentCoordinate)
                    currentCoordinate = currentCoordinate.previous
                }
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

class Map{
    table
    constructor(){
        this.table = []
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                this.table.push(new Coordinate(j,i))
            }
        }
    }
    printMap(knight){
        let array = []
        let index = 0
        for (const tableElement of this.table) {
            if(tableElement.equals(knight.coordinate)){
                array.push("[*]")
            }
            else
                array.push("[]")
            index++
            if(index % 8 === 0){
                console.log(array.join(""))
                array = []
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


let game = new KnightsTravails()
console.log(game.move(new Coordinate(3,3),new Coordinate(0,0)))


