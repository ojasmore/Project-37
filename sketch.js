var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameover , restart , gameoverimg , restartimg;

var score;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameoverimg = loadImage("gameOver.png");
  restartimg = loadImage("restart.png");
}

function setup() {
  createCanvas(displayWidth, displayHeight);
  
  trex = createSprite(50,500,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,500,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(200,510,400,10);
  invisibleGround.visible = false;
  
  gameover = createSprite(displayWidth/2,displayHeight/2-50);
  gameover.addImage("gameover",gameoverimg);
  gameover.scale = 0.6;
  gameover.visible = false;
  
  restart = createSprite(displayWidth/2,displayHeight/2);
  restart.addImage("restartbutton",restartimg);
  restart.scale = 0.5;
  restart.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background(180);
  textSize(30);
  fill("black");
  text("Score: "+ score,camera.position.x+400,displayHeight/2-100);
  
  if(gameState === PLAY){
    
  score = score + Math.round(getFrameRate()/60);
    
  ground.velocityX = -(6+3*score/100); 

  gameover.x = trex.x;
  restart.x = trex.x;

  camera.position.y = trex.y;
  
  if(keyDown("space")&&trex.y > 481) {
    trex.velocityY = -12;
  }
  
  trex.velocityY = trex.velocityY + 0.8;
  trex.velocityX = 5;
  camera.position.x = trex.x; 
  invisibleGround.x = trex.x; 

 
  if (ground.x < trex.x - 500){
    ground.x = trex.x;
  }
  
  spawnClouds();
  spawnObstacles();
  
  if(trex.isTouching(obstaclesGroup)){
    
      gameState = END;
    
  }
    
  }
  
  else if(gameState === END){
  
  gameover.visible = true;
  restart.visible = true;
   
  cloudsGroup.setVelocityXEach(0);
  obstaclesGroup.setVelocityXEach(0);
  
  obstaclesGroup.setLifetimeEach(-1);
  cloudsGroup.setLifetimeEach(-1);
    
  trex.changeAnimation("collided",trex_collided);  
    
  ground.velocityX = 0;
  trex.velocityY = 0;
  trex.velocityX = 0;
  
  if(mousePressedOver(restart))
  {
      reset();
  }  
    
  }  
    
  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset(){
   
   gameState = PLAY;
  
   gameover.visible = false;
   restart.visible = false;
  
   obstaclesGroup.destroyEach();
   cloudsGroup.destroyEach();
  
   trex.changeAnimation("running",trex_running);
  
   score = 0;
  
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(trex.position.x + 700,400,40,10);
    cloud.y = Math.round(random(400,440));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = displayWidth/cloud.velocityX;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 40 === 0) {
    var obstacle = createSprite(trex.position.x+700,485,10,40);
    obstacle.velocityX = -(6 + score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = displayWidth/obstacle.velocityX;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}