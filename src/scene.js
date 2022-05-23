class scene extends Phaser.Scene {

    constructor(key) {
        super(key);
    }

    preload() {
        this.load.atlas('player', 'assets/images/kenney_player.png', 'assets/images/kenney_player_atlas.json');
        this.load.image('tiles', 'assets/tilesets/tilesheetFT.png');
        this.load.image('nino', 'assets/images/nino646464.png');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/blockout.json');
        this.load.image("yoyo", "assets/images/yoyo.png");
    }

    create() {

        this.map = this.make.tilemap({ key: 'map' });
        this.tileset = this.map.addTilesetImage('tilesheetFT', 'tiles');

        this.player = new Player(this)

        this.sol = this.map.createLayer('decor2', this.tileset, 0, 0);
        this.shiny = this.map.createLayer('shiny', this.tileset, 0, 0).setVisible(false);


        /*this.collidersC = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        const colliderCLayer = this.map.getObjectLayer('colliders cassable')
        colliderCLayer.objects.forEach(collidersC=> {
            const {x = 0, y = 0, width = 0, height = 0} = collidersC
            var collidersC = this.add.rectangle(x, y, width, height).setOrigin(0, 0)
            if(collidersC.name==='stick') {
                collidersC.name=collidersC.name
            };
            collidersC = this.physics.add.existing(collidersC)
            this.collidersC.add(collidersC)
            this.physics.add.collider(collidersC,this.player.player)
        })*/

        //
        this.plateformes = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        const colliderSLayer = this.map.getObjectLayer('colliders shiny')
        colliderSLayer.objects.forEach(item=> {
            let collider = this.add.rectangle(item.x, item.y, item.width, item.height).setOrigin(0, 0)
            this.plateformes.add(collider)
            this.physics.add.collider(collider,this.player.player);
        });




        this.colliders = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        const colliderLayer = this.map.getObjectLayer('colliders')
        colliderLayer.objects.forEach(colliders=> {
            const {x = 0, y = 0, width = 0, height = 0} = colliders
            var colliders = this.add.rectangle(x, y, width, height).setOrigin(0, 0)

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

        let me = this

        this.input.on('pointerdown', function (pointer) {

            if(this.yoyo.launch === false  && Phaser.Math.Distance.Between(me.player.player.x, me.player.player.y, pointer.worldX, pointer.worldY) <= 700){
                console.log("lol")
                //this.drawLine()
                me.input.keyboard.enabled = false;
                me.yoyo.launch = true;
                me.player.player.setVelocityX(0);
                me.player.player.setVelocityY(0);
                me.player.player.body.setAllowGravity(false)
                me.player.player.setImmovable(true)
                me.yoyoTween = me.tweens.add({
                    targets: me.yoyo,
                    x: pointer.worldX,
                    y: pointer.worldY,
                    duration: 300,
                    ease: 'Power2',
                    yoyo: true,
                });
            }
        }, this);


        this.initKeyboard();
        this.masquerTrucs(true)



    }

    masquerTrucs(masquer=false){
        if(masquer){
            this.shiny.visible = false;
            this.plateformes.getChildren().forEach(child=>{
                child.body.enable=false;
            });
        }
        else{
            this.shiny.visible = true;
            this.plateformes.getChildren().forEach(child=>{
                this.plateformes.getChildren().forEach(child=>{
                    child.body.enable=true;
                });
            })
        }
    }


    initKeyboard(){
        let me = this;
        this.input.keyboard.on('keydown', function (kevent) {
            switch (kevent.keyCode) {
                case Phaser.Input.Keyboard.KeyCodes.E:
                    me.masquerTrucs(true)
                    break;
                case Phaser.Input.Keyboard.KeyCodes.F:
                    me.masquerTrucs(false)
                    break;
            }
        });
    }

    update() {

        this.player.move();

        if (!this.yoyo.launch) {
            this.yoyo.x = this.player.player.x;
            this.yoyo.y = this.player.player.y;
        }
        else {
            if (this.yoyoTween.progress === 1) {
                this.input.keyboard.enabled = true;
                this.yoyo.launch = false;
                this.player.player.body.setAllowGravity(true)
                this.player.player.setImmovable(false)
            }
        }
        //console.log(this.yoyo.launch)
    }
}