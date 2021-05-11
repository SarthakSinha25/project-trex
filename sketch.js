  var PLAY = 1;
  var END = 0;
  var gameState = PLAY;

  var trex, trex_running, trex_collided;
  var ground, invisibleGround, groundImage, youWin_img, bg_img;

  var cloudsGroup, cloudImage;
  var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

  var score=0;

  var gameOver, restart;

  localStorage["HighestScore"] = 0;

  function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  youWin_img = loadImage("Youwin.png");
  bg_img = loadImage("bg.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  }

  function setup() {
  canvas = createCanvas(displayWidth - 20, displayHeight-150);

  trex = createSprite(50,580,20,50);

  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  trex.velocityX = -  camera.position.x - 1;

  ground = createSprite(200,590,10000000000000,10);
  // ground.addImage("ground",groundImage);
  ground.x = ground.width /10;
  ground.velocityX = -  camera.position.x - 5;
  ground.shapeColor = "blue"
  // ground.velocityX = -(6 + 3*score/100);

  gameOver = createSprite(650,200);
  gameOver.addImage(gameOverImg);
  gameOver.velocityX = -  camera.position.x - 1;

  restart = createSprite(650,240);
  restart.addImage(restartImg);
  restart.velocityX = -  camera.position.x - 1;

  gameOver.scale = 0.5;
  restart.scale = 0.5;

    gameOver.visible = false;
    restart.visible = false;

  invisibleGround = createSprite(200,590,400,10);
  invisibleGround.visible = false;
  invisibleGround.velocityX = -  camera.position.x - 1;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;

  }

  function draw() {
  //trex.debug = true;
  background(bg_img);
  fill("red")
  text("Score: "+ score + " /10,000",camera.position.x - 1,50);
  camera.position.x =   camera.position.x - 1;

  if (score >= 10000){
    trex.visible = false;
    score.visible = false;
    ground.visible = false;
    restart.visible = false;
    gameOver.visible = false;
    gameOver.visible = true;
    restart.visible = true;
    trex.velocityX = 0;
    score.velocityX = 0;
    invisibleGround.velocityX = 0;
    ground.velocityX = 0;
    restart.velocityX = 0;
    gameOver.velocityX = 0;
    camera.position.x =   camera.position.x + 1;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    gameOver.destroy();
    restart.destroy();
    background(youWin_img)
  }
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    // ground.velocityX = -(6 + 3*score/100);

    if(keyDown("space") && trex.y >= 560) {
      trex.velocityY = -16;
    }

    trex.velocityY = trex.velocityY + 0.8

    if (ground.x < 10){
      ground.x = ground.width/6;
    }

    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();

    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    trex.velocityX = 0;
    score.velocityX = 0;
    invisibleGround.velocityX = 0;
    ground.velocityX = 0;
    restart.velocityX = 0;
    gameOver.velocityX = 0;
    camera.position.x =   camera.position.x + 1;

    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }


  drawSprites();
  }

  function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 30 === 0) {
    var cloud = createSprite(1300,320,40,10);
    cloud.y = Math.round(random(80,560));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -(6 + 3*score/100);
    
      //assign lifetime to the variable
    cloud.lifetime = 700;
    cloud.lifetime = cloud.lifetime + 10;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }

  }

  function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(1350,570,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
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
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
  }

  function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
    invisibleGround.velocityX =  - 1;
    restart.velocityX = - 1;
    gameOver.velocityX = - 1;
      trex.velocityX = - 1;
    ground.velocityX = - 5;

  trex.changeAnimation("running",trex_running);

  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);

  score = 0;

  }