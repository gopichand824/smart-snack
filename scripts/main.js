class Snack{
    constructor() {
        this.dir = 2;  //up 1, right 2, down 3, left 4
        this.parts = [];
        this.time = 0;
        this.headTimePosition = new Map();
        this.speed = 1;
        this.init(5);
    }

    init(size) {                                                 //initialize the initial size
        this.#changeDir();
        // for (let index = 0; index < size; index++) {
            this.eat();
        // }
    }

    #makePart() {                                                   //make circle 
        let part = document.createElement('div');
        part.style = `position: fixed; width: 10px; height: 10px;`;
        part.classList.add('sn-part')
        document.querySelector('#playArea').appendChild(part);

        return {part:part, position: {x:100,y:100}};
    }

    #changeDir() {                                               //direction controll for snack
        document.addEventListener('keydown', (event) =>  {
  
            switch(event.key) {
                case 'ArrowUp':
                    this.dir = 1;
                    console.log("up")
                    break;
        
                case 'ArrowRight':
                    this.dir = 2;
                    console.log("right")
                    break;
        
                case 'ArrowDown':
                    this.dir = 3;
                    console.log("down")
                    break;
                    
                case 'ArrowLeft':
                    this.dir = 4;
                    console.log("left")
                    break;
        
                default:
                    break;
            }
        });
    }

    eat() {                  
        let part = null;
        for(let i = 0; i < 5; i++){                    //call this function when snack eat food
            part = this.#makePart();
            this.parts.push(part);
        }
    }

    move(speed = 1){                                  // move snack 
        this.speed = speed;
        switch (this.dir) {
            case 1:
                this.parts[0].position.y -= speed;
                // this.parts[0].position.x += speed * Math.cos(angle+=0.1*speed);
                break;
            case 2:
                this.parts[0].position.x += speed;
                // this.parts[0].position.y += speed * Math.cos(angle += 0.1*speed);
                break;

            case 3:
                this.parts[0].position.y += speed;
                // this.parts[0].position.x += speed * Math.cos(angle+=0.1*speed);
                break;

            case 4:
                this.parts[0].position.x -= speed;
                // this.parts[0].position.y += speed * Math.cos(angle += 0.1*speed);
                break;
            default:
                break;
        }


        this.parts[0].part.style.top =  this.parts[0].position.y + "px";
        this.parts[0].part.style.left = this.parts[0].position.x + "px";
        // this.parts[0].part.style.backgroundColor = "red";
        this.time += 1;
        this.headTimePosition.set(this.time,{...this.parts[0].position});      //recording the position head over time , we will use this data to animate the snack 
        if((this.parts.length * 10) < this.headTimePosition.size) {
            this.headTimePosition.delete(this.time - this.parts.length * 10);
        }
        
        for(let i = 1, localTime = this.time; i < this.parts.length; i++) { //animate snack using headTimePosition ,  
            if(localTime - Math.ceil(7/this.speed) > 0){
                localTime -= Math.ceil(7/this.speed);
            
                
            this.parts[i].position.x = this.headTimePosition.get(localTime).x;
            this.parts[i].position.y = this.headTimePosition.get(localTime).y;


            this.parts[i].part.style.top = this.parts[i].position.y + "px";
            this.parts[i].part.style.left = this.parts[i].position.x + "px";
            }
        }
    }

    position(){          //return position of head
        return {x:this.parts[0].position.x+5, y: this.parts[0].position.y+5};
    }

}

class GameWorld {
    constructor() {
        this.snack = new Snack();
        this.foodPosition = this.generateFood();
        this.score = 0;
        this.scoreBoard = document.querySelector('#score');
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      
    getRandomLocation() {     // returns a random location {x,y}
        return {x: this.getRandomNumber(50,window.innerWidth-50), y: this.getRandomNumber(50, window.innerHeight-100)}
    }
    generateFood() {
        let food = document.createElement('div');
        let location = this.getRandomLocation();
        food.classList.add('sn-food');
        food.id = 'food';
        food.style.top = location.y+"px";
        food.style.left = location.x+"px";// 
        document.querySelector("#playArea").appendChild(food);
        console.log('location of generated food', location)
        return {x: location.x+15, y: location.y+15};
    }

    collide(){                                 //checks collision with walls
        let position = this.snack.position();
        if(position.x < 0 || position.x > window.innerWidth || position.y < 40 || position.y > window.innerHeight) return true;
    }

    reachFood(){                                               //return true if head collide with food
        //distance between head and food d=√((x2 – x1)² + (y2 – y1)²)
        let headPosition = this.snack.position();

        let distance = Math.sqrt(Math.pow(this.foodPosition.x - headPosition.x, 2) + Math.pow(this.foodPosition.y - headPosition.y, 2));
        

        return distance < 20;
    }

    update(){
        let spd = Number(document.querySelector('#speed').value)
       if(!this.collide()) this.snack.move(spd);
       if(this.reachFood()) {
        const element = document.getElementById('food');
        element.remove();
        this.snack.eat()
        this.score += 1;
        this.scoreBoard.innerHTML = "score :" + this.score;
        this.foodPosition = this.generateFood();
       }
    }
}

let world = new GameWorld();            //generate a new gameworld 

function animate() {                    //start the game loop
    world.update();
    requestAnimationFrame(animate);
}

animate()
