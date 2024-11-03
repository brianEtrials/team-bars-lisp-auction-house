export class Constant {
    name:string
    value:number

    constructor(name:string, value:number) {
        this.name = name
        this.value = value
    }

    toString() {
        return this.name + "=" + this.value
    }
}

export class Model {
    constants:Array<Constant> = []

    constructor() { 
        this.constants = []
    }

    getValue(name:string):number {
        // if name is a STRING try to find constant with that name
        // o/w parse as double and continue
        let value = parseFloat(name)
        if (isNaN(value)) {
            // must be CONSTANT name!
            let foundConstant = this.constants.find((c) => c.name === name)
            if (foundConstant) {
                return foundConstant.value
            } else {
                return NaN   // shows error
            }
        } else {
            return value
        }
    }

    // Return TRUE if newly created; return FALSE if replace
    define(name:string, value:number):boolean {
        let foundConstant = this.constants.find((c) => c.name === name)
        if (foundConstant) {
            foundConstant.value = value
            return false
        }
        let c = new Constant(name, value)
        this.constants.push(c)
        return true
    }

    remove (name:string):boolean {
        let foundConstant = this.constants.find((c) => c.name === name)
        if (foundConstant) {
            // seems like perhaps does one extra step...
            const index = this.constants.indexOf(foundConstant)
            this.constants.splice(index, 1)
            return true
        }

        return false
    }
}