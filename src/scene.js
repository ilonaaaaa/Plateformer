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
        this.load.image("boss", "assets/images/antagoniste.png");
        this.load.atlas('run','assets/anim/nino/run.png','assets/anim/nino/run.json');

        for (let m=1;m<=19;m++){
            this.load.image('boss-'+m,'assets/anim/boss/atk1/boss_0'+m+'.png')
        }
        for (let m=1;m<=17;m++){
            this.load.image('boss--'+m,'assets/anim/boss/atk2/bossatk2_'+m+'.png')
        }
    }

    create() {
        let me = this;
        this.checkatk = false;
        this.objet_fragment = 0;
        this.currentSaveX = 190;
        this.currentSaveY = 6080;

        this.map = this.make.tilemap({ key: 'map' });
        this.tileset = this.map.addTilesetImage('tilesheetPS2', 'tiles');
        this.bg = this.add.sprite(0,0, 'ciel').setOrigin(0,0);

        this.sol = this.map.createLayer('decor2', this.tileset, 0, 0);
        this.reel = this.map.createLayer('reel', this.tileset, 0, 0);
        this.solreel = this.map.createLayer('sol reel', this.tileset, 0, 0);
        this.salleBoss = this.map.createLayer('SalleBoss', this.tileset, 0, 0);
        //this.salleBoss.setVisible(false);

        this.bg2 = this.add.sprite(0,0, 'cial').setOrigin(0,0).setVisible(false);
        this.alt = this.map.createLayer('alt', this.tileset, 0, 0).setVisible(false);
        this.solalt = this.map.createLayer('sol alt', this.tileset, 0, 0).setVisible(false);

        this.boss = this.physics.add.sprite(12416,5568, 'boss').setOrigin(0, 0);
        this.boss.setVisible(true);
        this.boss.setDisplaySize(64*5,64*10);
        this.boss.body.setAllowGravity(false);
        this.boss.setImmovable(true);

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

        this.salleBoss = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        const fsfs = this.map.getObjectLayer('SalleDeBoss')
        fsfs.objects.forEach(porte=> {
            let door = this.physics.add.sprite(porte.x, porte.y, 'fezshfgksjhgkshuglish').setOrigin(0, 0);
            door.setDisplaySize(porte.width, porte.height);
            this.salleBoss.add(door)
            this.physics.add.collider(door,this.player.player);
        });


        //colliders et destruction des fragments d'ame à récupérer
        this.fragments = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        this.map.getObjectLayer('fragments').objects.forEach(item=> {

            let fragment = this.fragments.create(item.x, item.y,"fragment").setOrigin(0, 0).setDisplaySize( item.width, item.height);
            this.fragments.add(fragment)
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
            this.mur = this.murs.create(item.x, item.y,"fais le stp").setOrigin(0, 0).setDisplaySize( item.width, item.height);});
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
            this.mur_condition = this.murs_condition.create(item.x, item.y,"shrzeh").setOrigin(0, 0).setDisplaySize( item.width, item.height);});
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
            this.physics.add.collider(colliders,this.boss)

        })


        this.cameras.main.startFollow(this.player.player,false, 0.15,0.10, -10, 196);

        this.initKeyboard();
        this.Switch(true)
        this.anims.create({
            key: 'boss-atk',
            frames: [
                {key:'boss-1'},
                {key:'boss-2'},
                {key:'boss-3'},
                {key:'boss-4'},
                {key:'boss-5'},
                {key:'boss-6'},
                {key:'boss-7'},
                {key:'boss-8'},
                {key:'boss-9'},
                {key:'boss-10'},
                {key:'boss-11'},
                {key:'boss-12'},
                {key:'boss-13'},
                {key:'boss-14'},
                {key:'boss-15'},
                {key:'boss-16'},
                {key:'boss-17'},
                {key:'boss-18'},
                {key:'boss-19'},
            ],
            frameRate: 19,
            repeat: -1});

        this.anims.create({
            key: 'boss-atk2',
            frames: [
                {key:'boss--1'},
                {key:'boss--2'},
                {key:'boss--3'},
                {key:'boss--4'},
                {key:'boss--5'},
                {key:'boss--6'},
                {key:'boss--7'},
                {key:'boss--8'},
                {key:'boss--9'},
                {key:'boss--10'},
                {key:'boss--11'},
                {key:'boss--12'},
                {key:'boss--13'},
                {key:'boss--14'},
                {key:'boss--15'},
                {key:'boss--16'},
                {key:'boss--17'},
            ],
            frameRate: 17,
            repeat: -1});

        this.saves = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        this.map.getObjectLayer('Save').objects.forEach((save) => {
            this.saves.create(save.x, save.y- save.height, 'krkrkr').setOrigin(0);
        });
        this.physics.add.overlap(this.player.player, this.saves, this.sauvegarde, null, this)

        this.physics.add.overlap(this.player.player,this.boss, this.die, null, this)


    }

    die(){
        this.player.player.x = this.currentSaveX + 40;
        this.player.player.y = this.currentSaveY;
    }

    sauvegarde(player, saves) {

        this.currentSaveX = saves.x
        this.currentSaveY = saves.y-50
        saves.body.enable = false;
        console.log(this.currentSaveX)
    }


    Bossattack(boss,player){
        this.dist = Phaser.Math.Distance.BetweenPoints(player, boss);
        if(this.dist <800) {
            console.log("oui oui");
            if (this.checkatk === true) {
                let randatk = Phaser.Math.Between(1, 2)
                if (randatk === 1) {
                    boss.play('boss-atk');
                } else {
                boss.play('boss-atk2');
            }
            // this.Reset = this.scene.time.addEvent({
            //         delay: 25000,
            //         callback: ()=>{
            //             item.body.setEnable(true);
            //             item.setVisible(true);
            //         },
            //         loop: false,
            //     })
                this.checkatk = false
        }
            boss.setVelocityX(0);
        }else{
            this.checkatk = true
            console.log("en avant");
            boss.setVelocityX(-100);
            boss.setTexture('boss');
            //ici mettre idle de bossu
        }
    }
    //changement de monde
    Switch(masquer=false){
        if(masquer){
            this.fragments.setVisible(false);
            this.alt.visible = false;
            this.solalt.visible = false;
            this.bg2.visible = false;
            this.plateformes.getChildren().forEach(child=>{
                child.body.enable=false;
            });
            this.fragments.getChildren().forEach(child=>{
                child.body.enable=false;
            });
        }
        else{
            this.fragments.setVisible(true);
            this.alt.visible = true;
            this.solalt.visible = true;
            this.bg2.visible = true;
            this.plateformes.getChildren().forEach(child=>{
                this.plateformes.getChildren().forEach(child=>{
                    child.body.enable=true;
                });
            })
            this.fragments.getChildren().forEach(child=>{
                this.fragments.getChildren().forEach(child=>{
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
                case Phaser.Input.Keyboard.KeyCodes.R:
                    me.player.player.x = 10432
                    me.Switch(false)
                    break;
            }
        });
    }

    update() {

        if(this.player.player.x > 10432-32){
            this.salleBoss.setVisible(true);
            this.salleBoss.getChildren().forEach(child=>{
                child.body.enable=true;
            });

            console.log("nan mais ou on est d'accords" +
                "ok mlec")
            this.Bossattack(this.boss,this.player.player)
        }else{
            this.salleBoss.setVisible(false);
            this.salleBoss.getChildren().forEach(child=>{
                child.body.enable=false;
            });
        }


        this.player.update();
        this.player.move();

    }
}