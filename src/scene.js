class scene extends Phaser.Scene {

    constructor(key) {
        super(key);
    }

    preload() {
        this.load.atlas('player', 'assets/images/kenney_player.png', 'assets/images/kenney_player_atlas.json');
        this.load.image('tiles', 'assets/tilesets/tilesheetPS2.png');
        this.load.image('tile', 'assets/tilesets/tilesheetFT.png');
        this.load.image('ciel', 'assets/images/ciel.png');
        this.load.image('cial', 'assets/images/cial.png');
        this.load.image('nino', 'assets/images/nino646464.png');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/blockout.json');
        this.load.image("yoyo", "assets/images/yoyo.png");
        this.load.image("fragment", "assets/images/fragment.png");
        this.load.atlas('run','assets/anim/run.png','assets/anim/run.json');
    }

    create() {

        this.map = this.make.tilemap({ key: 'map' });
        this.tileset = this.map.addTilesetImage('tilesheetPS2', 'tiles');
        this.bg = this.add.sprite(0,0, 'ciel').setOrigin(0,0);
        this.bg2 = this.add.sprite(0,0, 'cial').setOrigin(0,0).setVisible(false);

        this.sol = this.map.createLayer('decor2', this.tileset, 0, 0);
        this.shiny = this.map.createLayer('shiny', this.tileset, 0, 0).setVisible(false);
        //this.fragmentlayer = this.map.getObjectLayer('fragment')['objects'];
        this.player = new Player(this)


        /*this.collidersC = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        const colliderCLayer = this.map.getObjectLayer('colliders cassable')
        colliderCLayer.objects.forEach(collidersC=> {
            const {x = 0, y = 0, width = 0, height = 0} = collidersC
            var collidersC = this.add.rectangle(x, y, width, height).setOrigin(0, 0)
            collidersC = this.physics.add.existing(collidersC)
            this.collidersC.add(collidersC)
            this.physics.add.collider(collidersC,this.player.player)
        })*/


        //RENOMMER LES VARIABLES
        this.plateformes = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        const colliderShinyLayer = this.map.getObjectLayer('colliders shiny')
        colliderShinyLayer.objects.forEach(item=> {
            let collider = this.add.rectangle(item.x, item.y, item.width, item.height).setOrigin(0, 0)
            this.plateformes.add(collider)
            this.physics.add.collider(collider,this.player.player);
        });



        this.colliderSol = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        const colliderSolLayer = this.map.getObjectLayer('colliders')
        colliderSolLayer.objects.forEach(item=> {
            let colliders = this.add.rectangle(item.x, item.y, item.width, item.height).setOrigin(0, 0)
            this.colliderSol.add(colliders)
            this.physics.add.collider(colliders,this.player.player)
        })


        this.cameras.main.startFollow(this.player.player,false, 0.15,0.10, -10, 196);


        //OK, commenter le code et mettre yoyo dans player

        this.initKeyboard();
        this.masquerTrucs(true)

    }

    masquerTrucs(masquer=false){
        if(masquer){
            this.shiny.visible = false;
            this.bg2.visible = false;
            this.plateformes.getChildren().forEach(child=>{
                child.body.enable=false;
            });
        }
        else{
            this.shiny.visible = true;
            this.bg2.visible = true;
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

        this.player.update();
        this.player.move();

    }
}