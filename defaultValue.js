let user1 = new firstClass();

class firstClass{
    constructor(_firstName = "No fist name", _surname = "No surname"){
        this.fistName = _firstName;
        this.surname = _surname
    }
}

class secondClass{
    constructor({firstName = "No fist name", surname = "No surname", age = "25"}){
        this.fistName = firstName;
        this.surname = surname;
        this.age = age;
    }
}

let user2 = new secondClass({age:56, surname:'Monod'}) 

console.log(user1)
console.log(user2)