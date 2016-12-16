let w = window.innerWidth;
let h = window.innerHeight;
let game = new Phaser.Game(w, h, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render});
let player;
let sky = null;

function preload() {

	game.load.image("gameBg","assets/background2.jpg", w, h);
    game.load.spritesheet("player", "assets/Taya.png", 165, 140);
    game.load.image("obstacle1", "assets/spike1.png", 100, 800);
    game.load.image("obstacle2", "assets/spike2.png", 100, 800);
    game.load.spritesheet("enemy", "assets/bullet.png", 280, 150, 2);
    game.load.image("target", "assets/cible.png", 200, 200);
    game.load.audio('deathplayer', 'sound/player_death.ogg');
    game.load.audio('gamesound', 'sound/gamesound.ogg');
    game.load.audio('woodcrack', 'sound/wood_crack.ogg');
    game.load.audio('bulletdeath','sound/bullet_death.ogg');
}

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE); 
	game.renderer.clearBeforeRender = false;
	game.renderer.roundPixels = true;
	game.world.setBounds(0, 0, w, h);
	// fond
    sky = game.add.tileSprite(0, 0, w, h, 'gameBg');
    sky.fixedToCamera = true;
    // Joueur
    player = createPlayer();
    // Cible
    target = createTarget();
    // Ennemi
    enemy = createEnemy(-400, 800, 300);
    // Obstacle
    obstacleTab1 = [
    // En bas
    shortObstacle(-300, 300, 100, w/1.5, h/1.11, 0, 300, 100),
    shortObstacle(-300, 300, 100, w/1.1, h/1.11, 0, 300, 100),
    shortObstacle(-300, 300, 100, w*1.2, h/1.11, 0, 300, 100),
    shortObstacle(-300, 300, 100, w*1.45,h/1.11, 0, 300, 100),
    shortObstacle(-300, 300, 100, w*1.7, h/1.11, 0, 300, 100),
    // En haut
    shortObstacle(-300, 300, 100, w/1.5, h/9.5, 180, 300, 5),
    shortObstacle(-300, 300, 100, w/1.1, h/9.5, 180, 300, 5),
    shortObstacle(-300, 300, 100, w*1.2, h/9.5, 180, 300, 5),
    shortObstacle(-300, 300, 100, w*1.45,h/9.5, 180, 300, 5),
    shortObstacle(-300, 300, 100, w*1.7, h/9.5, 180, 300, 5)
    ]

    obstacleTab2 = [
    // En bas
    longObstacle(-300, 50, 500, w/1.27, h/1.9, 0, 50, 500, 0),
    longObstacle(-300, 50, 500, w/0.755, h/1.9, 0, 50, 500, 0),
    // En haut
    longObstacle(-300, 50, 500, w/0.95, h/1.9, 180, 50, 500, -500)
    ]
    // Sons
    deathplayer = game.add.audio('deathplayer');
    woodcrack = game.add.audio('woodcrack');
    bulletdeath = game.add.audio('bulletdeath');
    gamesound = game.add.audio('gamesound');
    gamesound.play()
}

function collisionPlayer(player, obstacleTab1, obstacleTab2, enemy){
		game.add.tween(player).to( { alpha: 0 }, 250, Phaser.Easing.Linear.None, true, 0).onComplete.add(function(){player.kill();deathplayer.play();});
}
function collisionEnemyTarget(enemy, target){
		game.add.tween(enemy).to( { alpha: 0 }, 250, Phaser.Easing.Linear.None, true, 0).onComplete.add(function(){enemy.kill();bulletdeath.play();});		
}
function collisionObstacle1Target(obstacleTab1, target){
		game.add.tween(obstacleTab1.scale).to( { x:2, y:2, alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0).onComplete.add(function(){obstacleTab1.kill();woodcrack.play();});
}
function collisionObstacle2Target(obstacleTab2, target){
		game.add.tween(obstacleTab2.scale).to( { x:1.5, y:1.5, alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 0).onComplete.add(function(){obstacleTab2.kill(); woodcrack.play();});
}
function update() {
	// Camera fond
	sky.tilePosition.x -= 4;
	// Collisions
	game.physics.arcade.collide(player, enemy, collisionPlayer, null, this);
	game.physics.arcade.collide(player, obstacleTab1, collisionPlayer, null, this);
	game.physics.arcade.collide(player, obstacleTab2, collisionPlayer, null, this);
	game.physics.arcade.collide(enemy, target, collisionEnemyTarget, null, this);
	game.physics.arcade.collide(obstacleTab1, target, collisionObstacle1Target, null, this);
	game.physics.arcade.collide(obstacleTab2, target, collisionObstacle2Target, null, this);
}

function render() {
	/*game.debug.body(player);*/
	/*let zone = game.camera.deadzone;
	game.context.fillStyle = 'rgba(255,0,0,0.6)';
    game.context.fillRect(zone.x, zone.y, zone.width, zone.height);*/
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 500);
}