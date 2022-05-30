class scene extends Phaser.Scene {

    constructor(key) {
        super(key);
    }

    preload() {
        this.load.image('tiles', 'assets/tilesets/tilesheetFT.png');
        this.load.image('ciel', 'assets/images/ciel.png');
        this.load.image('cial', 'assets/images/cial.png');
        this.load.image('nino', 'assets/images/nino646464.png');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/blockout.json');
        this.load.image("yoyo", "assets/images/yoyo.png");
        this.load.image("fragment", "assets/images/fragment.png");
        this.load.atlas('run','assets/anim/run.png','assets/anim/run.json');
    }

    create() {
        let me = this;

        this.objet_fragment = 0;

        this.map = this.make.tilemap({ key: 'map' });
        this.tileset = this.map.addTilesetImage('tilesheetPS2', 'tiles');
        this.bg = this.add.sprite(0,0, 'ciel').setOrigin(0,0);

        this.sol = this.map.createLayer('decor2', this.tileset, 0, 0);
        this.reel = this.map.createLayer('reel', this.tileset, 0, 0);
        this.solreel = this.map.createLayer('sol reel', this.tileset, 0, 0);

        this.bg2 = this.add.sprite(0,0, 'cial').setOrigin(0,0).setVisible(false);
        this.alt = this.map.createLayer('alt', this.tileset, 0, 0).setVisible(false);
        this.solalt = this.map.createLayer('sol alt', this.tileset, 0, 0).setVisible(false);

        this.player = new Player(this)


        //colliders des plateformes
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

        //colliders et destruction des fragments d'ame à récupérer
        this.fragments = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        this.map.getObjectLayer('fragments').objects.forEach(item=> {
            this.fragment = this.fragments.create(item.x, item.y,"fragment").setOrigin(0, 0).setDisplaySize( item.width, item.height);
        });
        this.physics.add.collider(this.player.player,this.fragments,function (joueur,fragment) {
            fragment.destroy();
            me.objet_fragment += 1;
        });

        //colliders et destruction des murs cassables
        this.murs = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        this.map.getObjectLayer('colliders cassable').objects.forEach(item=> {
            this.mur = this.murs.create(item.x, item.y,"shrzeh").setOrigin(0, 0).setDisplaySize( item.width, item.height);
        });
        this.physics.add.collider(this.player.player,this.murs);
        this.physics.add.collider(this.player.yoyo,this.murs,function (yoyo,mur) {
            mur.destroy();
        });
        //idem mais en ajoutant la condition que le joueur doit avoir récupéré les 7 fragments disponibles avant de pouvoir casser ce mur
        this.murs_condition = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        this.map.getObjectLayer('colliders cassable condition').objects.forEach(item=> {
            this.mur_condition = this.murs_condition.create(item.x, item.y,"shrzeh").setOrigin(0, 0).setDisplaySize( item.width, item.height);
        });
        this.physics.add.collider(this.player.player,this.murs_condition);
        this.physics.add.collider(this.player.yoyo,this.murs_condition,function (yoyo,mur) {
            if (me.objet_fragment >= 7)
            {
                mur.destroy();
            }
        });

        //collider avec le sol
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

        this.initKeyboard();
        this.Switch(true)

    }
    //changement de monde
    Switch(masquer=false){
        if(masquer){
            this.alt.visible = false;
            this.solalt.visible = false;
            this.bg2.visible = false;
            this.plateformes.getChildren().forEach(child=>{
                child.body.enable=false;
            });
        }
        else{
            this.alt.visible = true;
            this.solalt.visible = true;
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
                    me.Switch(true)
                    break;
                case Phaser.Input.Keyboard.KeyCodes.F:
                    me.Switch(false)
                    break;
            }
        });
    }

    update() {

        this.player.update();
        this.player.move();

    }
}