/**
 * This is a project that simulates the transfer
 * of virus from one person to another in a population.
 *
 * @author Yiyun Hu
 * @Version 1.0
 */
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

var ctx;
var population1 = [];
var infected1 = [];
var suspected = [];
var populationNum = 20;
var infectedNum = 2;
var x = canvas.width / 2; // spawn point is in the middle of the page for now
var y = canvas.height / 2;
var dx = (Math.random() - 0.5) * 6;
var dy = (Math.random() - 0.5) * 6;
var xx = Math.random() * canvas.width + 1; // spawn varius/people randamly on the screen
var yy = Math.random() * canvas.height + 1;
var w = 32; //width of sprite
var h = 32; //height of sprite
var isColliding = false;
var infectedTime = new Date().getTime() + 30000;
var currentTime = new Date().getTime();

/**
 * The healthy population that is not infected.
 * The constructor takes in a x position, y position,
 * rate of change in the x and y direction and if the population is colliding.
 */
class Population {
    static sprite;
    static load_sprite(){
        Population.sprite = document.createElement('img');
        Population.sprite.src = "people.png";
    }
    constructor(x, y, dx, dy, isColliding) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.isColliding = isColliding;
    }
    changeDirection() { // if the virus or people is on the edge, then change direction
        if (this.x + this.dx <= 0 || this.x + this.dx >= canvas.width - w) {
            this.dx = -this.dx;
        }
        if (this.y + this.dy <= 0 || this.y + this.dy >= canvas.height - h) { //the picture is 32 x 32
            this.dy = -this.dy;
        }
    }
    draw() {
        this.x = this.x + this.dx;
        this.y = this.y + this.dy;
        ctx.drawImage(Population.sprite, this.x, this.y);
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getDX() {
        return this.dx;
    }
    getDY() {
        return this.dy;
    }
    setIsColliding (torf) {
        this.isColliding = torf;
    }
}

/**
 * The population that is infected.
 * The constructor takes in a x position, y position,
 * rate of change in the x and y direction and if the population is colliding.
 */
class Infected {
    static sprite;
    static load_sprite(){
        Infected.sprite = document.createElement('img');
        Infected.sprite.src = "infected.png";
    }
    constructor(x, y, dx, dy, isColliding) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.isColliding = isColliding;
        this.infectedTime = new Date().getTime() + 30000;
    }
    changeDirection() { // if the virus or people is on the edge, then change direction
        if (this.x + this.dx <= 0 || this.x + this.dx >= canvas.width - w) {
            this.dx = -this.dx;
        }
        if (this.y + this.dy <= 0 || this.y + this.dy >= canvas.height - h) { //the picture is 32 x 32
            this.dy = -this.dy;
        }
    }
    draw() {
        this.x = this.x + this.dx;
        this.y = this.y + this.dy;
        ctx.drawImage(Infected.sprite, this.x, this.y);
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getDX() {
        return this.dx;
    }
    getDY() {
        return this.dy;
    }
    getTime() {
        return this.infectedTime;
    }
    setIsColliding (torf) {
        this.isColliding = torf;
    }
}
// creates an array containing the healthy population
for (var i = 0; i < populationNum; i++) {
    population1.push(new Population(xx, yy, dx, dy, false));
    xx = Math.random() * (canvas.width - w) + 1;
    yy = Math.random() * (canvas.height - h) + 1;
    dx = (Math.random() - 0.5) * 6;
    dy = (Math.random() - 0.5) * 6;
}

//creates an array containing the infected population
for (var j = 0; j < infectedNum; j++) {
    infected1.push(new Infected(xx, yy, dx, dy, false));
    xx = Math.random() * (canvas.width - w) + 1;
    yy = Math.random() * (canvas.height - h) + 1;
    dx = (Math.random() - 0.5) * 6;
    dy = (Math.random() - 0.5) * 6;
}

//checks if the two objects passed in is colloding
//and sets the veriable isColliding to true for the colliding objects
function collision(p1, p2) {
    if (p1.x <= p2.x && p2.x <= p1.x + w
            && p1.getY() <= p2.getY() && p2.getY() <= p1.getY() + h) {
        p1.setIsColliding(true);
        p2.setIsColliding(true);
    }
}
// this function is called in the html file
function start(){ 
    display = document.getElementById("canvas");
    ctx = display.getContext("2d");
    Population.load_sprite();
    Infected.load_sprite();
    window.requestAnimationFrame(run);
}

function run() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    //updates the sprite of the population
    for (var r = 0; r < population1.length; r++) {
        population1[r].draw();
        population1[r].changeDirection();
    }
    //updates the sprite of the infected people
    for (var u = 0; u < infected1.length; u++) {
        infected1[u].draw();
        infected1[u].changeDirection();
    }
    //checks for 
    for (var s = 0; s < infected1.length; s++) {
        currentTime = new Date().getTime();
        if (currentTime > infected1[s].getTime()) {
            population1.push(new Population(infected1[s].getX(), infected1[s].getY(),
                                            infected1[s].getDX(), infected1[s].getDY(), false));
            infected1.splice(s, 1)
            s--;
        }
    }
    //checks for collision, population vs infected
    for (var i = 0; i < population1.length; i++) {
        for (var k = 0; k < infected1.length; k++) {
            collision(population1[i], infected1[k]);
        }
    }
    //updates the infected population after infection
    for (var j = 0; j < population1.length; j++) {
        if (population1[j].isColliding) {
            infected1.push(new Infected(population1[j].getX(), population1[j].getY(),
                            population1[j].getDX(), population1[j].getDY(), false));
        population1.splice(j, 1)
        j--;
        }
    }
    window.requestAnimationFrame(run);
}
