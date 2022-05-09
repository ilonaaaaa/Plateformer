class scene extends Phaser.Scene {

    constructor(key) {
        super(key);
    }

    preload() {
        this.load.atlas('player', 'assets/images/kenney_player.png', 'assets/images/kenney_player_atlas.json');
        this.load.image('tiles', 'assets/tilesets/tilesheetFT.png');
        this.load.image('nino', 'assets/images/nino646464.png');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/blockout.json');
        this.load.image("yoyo", "yoyo.png");
    }

    create() {

        this.map = this.make.tilemap({ key: 'map' });
        this.tileset = this.map.addTilesetImage('tilesheetFT', 'tiles');

        this.player = new Player(this)

        this.sol = this.map.createLayer('decor2', this.tileset, 0, 0);
        this.shiny = this.map.createLayer('shiny', this.tileset, 0, 0);

        this.colliders = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        const colliderLayer = this.map.getObjectLayer('colliders')
        colliderLayer.objects.forEach(objData=> {
            const {x = 0, y = 0, width = 0, height = 0} = objData
            let colliders = this.add.rectangle(x, y, width, height).setOrigin(0, 0)
            if(objData.name==='stick') {
                colliders.name=objData.name
            };
            colliders = this.physics.add.existing(colliders)
            this.colliders.add(colliders)
            this.physics.add.collider(colliders,this.player.player)
        })

        this.yoyo = this.physics.add.sprite(this.player.x, this.player.y, "yoyo")
        this.yoyo.setScale(2)
        this.yoyo.setDepth(0);
        this.yoyo.setDisplaySize(20, 20)
        this.yoyo.launch = false;
        this.yoyo.body.setAllowGravity(false)


        this.cursors = this.input.keyboard.createCursorKeys();

        this.cameras.main.startFollow(this.player.player,false, 0.15,0.10, -10, 196);

        this.player.initKeyboard();


        this.input.on('pointerdown', function (pointer) {
            if(this.yoyo.launch === false && Phaser.Math.Distance.Between(this.player.x, this.player.y, pointer.worldX, pointer.worldY) <= 1000){

                //this.drawLine()
                this.input.keyboard.enabled = false;
                this.yoyo.launch = true;
                this.player.setVelocityX(0);
                this.player.setVelocityY(0);
                this.player.body.setAllowGravity(false)
                this.player.body.setImmovable(true)
                this.yoyoTween = this.tweens.add({
                    targets: this.yoyo,
                    x: pointer.worldX,
                    y: pointer.worldY,
                    duration: 300,
                    ease: 'Power2',
                    yoyo: true,
                });
            }
        }, this);


    }

    update() {

        if (!this.yoyo.launch) {
            this.yoyo.x = this.player.x;
            this.yoyo.y = this.player.y;
        }
        else {
            //this.drawLine()
            if (this.yoyoTween.progress === 1) {
                this.input.keyboard.enabled = true;
                //this.redraw()
                this.yoyo.launch = false;
            }
        }
    }
}