class scene extends Phaser.Scene {

    constructor() {
        super('level');
    }

    preload() {
        this.load.image('tiles', 'assets/tilesets/tilesheetFT.png');
        this.load.image('ciel', 'assets/images/decor/ciel.png');
        this.load.image('cial', 'assets/images/decor/cial.png');
        this.load.image('plan2a', 'assets/images/decor/plan_alt2.png');
        this.load.image('plan2r', 'assets/images/decor/plan_reel2.png');
        this.load.image('nino', 'assets/images/nino.png');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/blockout.json');
        this.load.image("yoyo", "assets/images/yoyo.png");
        this.load.image("SaveSprite", "assets/images/save.png");
        this.load.image("fragment", "assets/images/fragment.png");
        this.load.image("indic", "assets/images/indic.png");
        this.load.image("boss", "assets/images/antagoniste.png");
        this.load.image("plantus", "assets/images/plantus.png");
        this.load.image("collid", "assets/images/CASSTOU.png");
        this.load.image("collidindic", "assets/images/CASSTOUOE.png");
        this.load.spritesheet('Atk','assets/anim/nino/AtkSheet.png',{frameWidth: 203, frameHeight: 224});
        this.load.spritesheet('run','assets/anim/nino/run.png',{frameWidth: 182, frameHeight: 224});
        this.load.spritesheet('idle','assets/anim/nino/aie.png',{frameWidth: 200, frameHeight: 224});
        this.load.spritesheet('jump','assets/anim/nino/jump.png',{frameWidth: 182, frameHeight: 224});
        this.load.spritesheet('bIdle','assets/anim/boss/bIdle.png',{frameWidth: 302, frameHeight: 528});
        this.load.spritesheet('bAtk1','assets/anim/boss/bAtk1.png',{frameWidth: 650, frameHeight: 528});
        this.load.spritesheet('bAtk2','assets/anim/boss/bAtk2.png',{frameWidth: 650, frameHeight: 528});
        this.load.image('bossBase','assets/anim/boss/Atk1bas.png');
        this.load.image('boss2Base','assets/anim/boss/Atk2bas.png');
        this.load.image('idlebossBase','assets/anim/boss/IdlBas.png');

        for (let m=1;m<=11;m++){
            this.load.image('plante-'+m,'assets/anim/plante/plantus_'+m+'.png')
        }

        this.load.audio('Maintheme','assets/sounds/LevelMusic.mp3');
        this.load.audio('Bosstheme','assets/sounds/BossMusic.mp3');
    }

    create() {
        let me = this;
        this.checkatk = false;
        window.objet_fragment = 0;
        this.currentSaveX = 190;
        this.currentSaveY = 6080;
        this.MondeAlt = false;
        this.started = false;
        this.bossLife = 150;
        this.musicSwap = false;

        this.MainTheme = this.sound.add('Maintheme',{volume: 0.3});
        this.MainTheme.loop = true;
        this.MainTheme.play();

        this.BossTheme = this.sound.add('Bosstheme',{volume: 0.3});
        this.BossTheme.loop = true;

        this.map = this.make.tilemap({ key: 'map' });
        this.tileset = this.map.addTilesetImage('tilesheetPS2', 'tiles');
        this.bg = this.add.sprite(0,0, 'ciel').setOrigin(0,0);
        this.bg2 = this.add.sprite(0,0, 'cial').setOrigin(0,0).setVisible(false);
        

        this.plan3reel = this.map.createLayer('Plan3reel', this.tileset, 0, 0);
        this.plan3alt = this.map.createLayer('Plan3alt', this.tileset, 0, 0);
        this.plan2reel = this.map.createLayer('Plan2reel', this.tileset, 0, 0);
        this.plan2alt = this.map.createLayer('Plan2alt', this.tileset, 0, 0);

        this.sol = this.map.createLayer('decor2', this.tileset, 0, 0);
        this.reel = this.map.createLayer('reel', this.tileset, 0, 0);
        this.solreel = this.map.createLayer('sol reel', this.tileset, 0, 0);
        this.salleBoss = this.map.createLayer('SalleBoss', this.tileset, 0, 0);
        //this.salleBoss.setVisible(false);

        this.alt = this.map.createLayer('alt', this.tileset, 0, 0).setVisible(false);
        this.solalt = this.map.createLayer('sol alt', this.tileset, 0, 0).setVisible(false);

        this.boss = this.physics.add.sprite(12416,5568, 'idlebossBase').setOrigin(0, 0);
        this.boss.body.setAllowGravity(false);
        this.boss.setImmovable(true);

        this.attack1 = this.physics.add.sprite(50000,50000, 'bossBase').setOrigin(0, 0);
        this.attack1.setVisible(true);
        this.attack1.body.setAllowGravity(false);
        this.attack1.setImmovable(true);

        this.attack2 = this.physics.add.sprite(50000,50000, 'boss2Base').setOrigin(0, 0);
        this.attack2.setVisible(true);
        this.attack2.body.setAllowGravity(false);
        this.attack2.setImmovable(true);

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
            let door = this.physics.add.sprite(porte.x, porte.y, 'collid').setOrigin(0, 0);
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

            this.fragSprite = this.fragments.create(item.x , item.y, 'fragment').setOrigin(0);
            this.tweens.add({
                targets: this.fragSprite,
                y:this.fragSprite.y-20,
                duration: 1000,
                paused: false,
                yoyo: true,
                repeat: -1
            });

        });
        this.physics.add.collider(this.player.player,this.fragments,function (joueur,fragment) {

            fragment.destroy();
            window.objet_fragment += 1;
        });

        //le dernier fragment qui lance les crédits du jeu
        this.Next = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        this.map.getObjectLayer('fragmentendgame').objects.forEach((Next) => {
            this.NextSprite = this.Next.create(Next.x , Next.y -Next.height, 'fragment').setOrigin(0);
            this.tweens.add({
                targets: this.NextSprite,
                y:this.NextSprite.y-20,
                duration: 1000,
                paused: false,
                yoyo: true,
                repeat: -1
            });
        });
        this.physics.add.overlap(this.player.player,this.NextSprite, this.NextZone, null, this);


        //colliders sur l'arbre pour l'easter egg
         this.colArbre = this.physics.add.group({
             allowGravity: false,
             immovable: true
         });
         this.map.getObjectLayer('colliders arbre').objects.forEach(item=> {
                this.colArbreSprite = this.colArbre.create(item.x, item.y).setOrigin(0, 0).setBodySize( item.width, item.height).setVisible(false);

         });
         this.physics.add.collider(this.player.player,this.colArbre);


        //colliders et destruction des murs cassables si le monde est reel
        this.murs = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        this.map.getObjectLayer('colliders cassable').objects.forEach(item=> {
            this.mur = this.murs.create(item.x, item.y,"collid").setOrigin(0, 0).setDisplaySize( item.width, item.height);
        });
        this.physics.add.collider(this.player.player,this.murs);
        this.physics.add.collider(this.player.yoyo,this.murs,function (yoyo,mur) {
            if (me.MondeAlt === false)
            {
                mur.destroy();
            }
            else {}
        });



        //idem mais en ajoutant la condition que le joueur doit avoir récupéré les 7 fragments disponibles avant de pouvoir casser ce mur
        this.murs_condition = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        this.map.getObjectLayer('colliders cassable condition').objects.forEach(item=> {
            this.mur_condition = this.murs_condition.create(item.x, item.y,"collid").setOrigin(0, 0).setDisplaySize( item.width, item.height);

        });
        this.physics.add.collider(this.player.player,this.murs_condition);
        this.physics.add.collider(this.player.yoyo,this.murs_condition,function (yoyo,mur) {
            if (window.objet_fragment >= 7 && me.MondeAlt===false)
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




        //animation pour l'ennemi
        this.anims.create({
            key: 'plante-atk',
            frames: [
                {key:'plante-1'},
                {key:'plante-2'},
                {key:'plante-3'},
                {key:'plante-4'},
                {key:'plante-5'},
                {key:'plante-6'},
                {key:'plante-7'},
                {key:'plante-8'},
                {key:'plante-9'},
                {key:'plante-10'},
                {key:'plante-11'},
            ],
            frameRate: 10,
            repeat: -1});

        // et son collider
        this.ennemi = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        this.map.getObjectLayer('ennemis').objects.forEach((item) => {
            const ennemiSprite = this.ennemi.create(item.x, item.y,'plantus').setOrigin(0, 0).setDisplaySize(item.width, item.height).play("plante-atk");});
            this.physics.add.collider(this.player.player, this.ennemi, this.die,null, this)
            this.physics.add.collider(this.player.yoyo,this.ennemi,function (yoyo,ennemy) {
                {
                    ennemy.destroy();
                }
            });



        this.input.mouse.disableContextMenu();
        this.cameras.main.startFollow(this.player.player,true, 0.15,0.10, -10, 100);
        this.cameras.main.setBounds(0,0,12800, 6400 );
        this.cameras.main.setZoom(0.8);
        this.initKeyboard();



        //animation pour les attaques du boss
        this.anims.create({
            key: 'boss-atk',
            frames: this.anims.generateFrameNames('bAtk1', {
                start: 0,
                end: 21,
            }),
            frameRate: 16,
            repeat: -1
        });

        this.anims.create({
            key: 'boss-atk2',
            frames: this.anims.generateFrameNames('bAtk2', {
                start: 0,
                end: 19,
            }),
            frameRate: 16,
            repeat: -1
        });

        this.anims.create({
            key: 'boss-idle',
            frames: this.anims.generateFrameNames('bIdle', {
                start: 0,
                end: 4,
            }),
            frameRate: 15,
            repeat: -1
        });
        this.boss.play('boss-idle');

        //création des checkpoints
        this.saves = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        this.map.getObjectLayer('Save').objects.forEach((save) => {
            this.saves.create(save.x, save.y- save.height, 'SaveSprite').setOrigin(0);
        });
        this.physics.add.overlap(this.player.player, this.saves, this.sauvegarde, null, this)

        this.physics.add.overlap(this.player.player,this.boss, this.die, null, this)
        this.physics.add.overlap(this.player.player,this.attack1, this.die, null, this)
        this.physics.add.overlap(this.player.player,this.attack2, this.die, null, this)
        //Le boss perds de la vie quand on le touche
        this.physics.add.collider(this.player.yoyo,this.boss,function (yoyo,boss) {
            {
                me.bossLife -= 1;
                me.BossDed();
            }
        });

        // this.plan1reel = this.map.createLayer('Plan1reel', this.tileset, 0, 0);
        // this.plan1alt = this.map.createLayer('Plan1alt', this.tileset, 0, 0);

        //Gestion des parralaxes
        this.plan2alt.scrollFactorX=0.99;
        this.plan2alt.scrollFactorY=0.99;
        this.plan2reel.scrollFactorX=0.99;
        this.plan2reel.scrollFactorY=0.99;
        this.plan3alt.scrollFactorX=0.97;
        this.plan3alt.scrollFactorY=0.97;
        this.plan3reel.scrollFactorX=0.97;
        this.plan3reel.scrollFactorY=0.97;

        this.Switch(true)

        this.scene.launch('UI');

    }

    //création de la fonction sauvegarde qui ramène le joueur à un endroit précis
    sauvegarde(player, saves) {

        this.currentSaveX = saves.x
        this.currentSaveY = saves.y-50
        saves.body.enable = false;
        console.log(this.currentSaveX)
    }

    die(){
        this.player.player.x = this.currentSaveX + 40;
        this.player.player.y = this.currentSaveY;
    }

    //apres avoir recupéré le dernier fragment, on lance une nouvelle scene pour les credits
    NextZone(){
        let me = this;
        if (me.started === true){
        }
        else {
            this.scene.start('credits')
            this.scene.stop('UI');
            this.BossTheme.stop();
            this.started = true ;
        }
    }

    //mort du boss
    BossDed(){
        let me = this;
        if(me.bossLife ===0){
            me.boss.setVisible(false);
            me.boss.body.enable = false;
            me.attack1.body.enable=false;
            me.attack2.body.enable = false;
            me.attack1.visible = false;
            me.attack2.visible = false;
        }
    }

    //toutes les interactions du boss
    Bossattack(boss,player){
        this.dist = Phaser.Math.Distance.BetweenPoints(player, boss);
        if(this.bossLife >>0){if(this.dist <600) {
            console.log("oui oui");
            if (this.checkatk === true) {
                let randatk = Phaser.Math.Between(1, 2)
                if (randatk === 1) {

                    this.attack1.x = boss.x-(boss.width/2);
                    this.attack1.y = boss.y;
                    this.attack1.play('boss-atk');
                    boss.setVisible(false);

                } else {
                    this.attack2.x = boss.x-(boss.width/2);
                    this.attack2.y = boss.y;
                    this.attack2.play('boss-atk2');
                    boss.setVisible(false);

                    //this.attac2 = this.add.rectangle(this.boss.x, this.boss.y, 500, 40).setOrigin(0, 0)
                }
                this.Reset = this.time.addEvent({
                    delay: 25000,
                    callback: ()=>{

                    },
                    loop: false,
                })
                this.checkatk = false
            }
            boss.setVelocityX(0);
        }else{
            this.attack1.x = -9999
            this.attack1.y = -9999

            this.attack2.x = -9999
            this.attack2.y = -9999
            this.checkatk = true
            console.log("en avant");
            boss.setVelocityX(-100);
            boss.setVisible(true);
        }}

    }





    //changement de monde
    Switch(masquer=false){
        if(masquer){
            this.MondeAlt = false;
            //this.fragments.setVisible(false);
            this.fragments.setAlpha(0.5);
            this.Next.setAlpha(0.5);
            this.NextSprite.body.enable = false;
            //this.plan1alt.visible = false;
            this.alt.visible = false;
            if(window.objet_fragment >=7){
                for(let i = 0;i < this.murs_condition.getChildren().length; i++){
                    this.murs_condition.getChildren()[i].setTexture('collidindic');
                }
            }
            for(let i = 0;i < this.murs.getChildren().length; i++){
                this.murs.getChildren()[i].setTexture('collidindic');
            }
            this.reel.visible = true;
            this.solalt.visible = false;
            this.plan2alt.visible=false;
            this.plan2reel.visible=true;
            this.plan3alt.visible=false;
            this.plan3reel.visible=true;
            this.bg2.visible = false;
            this.plateformes.getChildren().forEach(child=>{
                child.body.enable=false;
            });
            this.fragments.getChildren().forEach(child=>{
                child.body.enable=false;
            });
        }
        else{
            this.MondeAlt = true;
            //this.fragments.setVisible(true);
            this.fragments.setAlpha(1);
            this.Next.setAlpha(1);
            this.NextSprite.body.enable = true;
            //this.plan1alt.visible = true;
            this.alt.visible = true;
            if(window.objet_fragment >=7){
                for(let i = 0;i < this.murs_condition.getChildren().length; i++){
                    this.murs_condition.getChildren()[i].setTexture('collid');
                }
            }
            for(let i = 0;i < this.murs.getChildren().length; i++){
                this.murs.getChildren()[i].setTexture('collid');
            }
            this.reel.visible = false;
            this.solalt.visible = true;
            this.plan2alt.visible=true;
            this.plan2reel.visible=false;
            this.plan3alt.visible=true;
            this.plan3reel.visible=false;
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
                case Phaser.Input.Keyboard.KeyCodes.R:
                    me.Switch(false)
                    break;
                case Phaser.Input.Keyboard.KeyCodes.E:
                    me.Switch(true)
                    break;
                //les deux prochaines touches sont la pour faciliter le deplacement rapide dans le niveau si besoin
                case Phaser.Input.Keyboard.KeyCodes.L:
                    me.player.player.x = 10432
                    break;
                case Phaser.Input.Keyboard.KeyCodes.M:
                    me.player.player.x = 5064
                    me.player.player.y = 1840
                    break;
            }
        });
    }



    update() {
        if(this.player.player.x >= 10395){
            this.salleBoss.setVisible(true);
            this.salleBoss.getChildren().forEach(child=>{
                child.body.enable=true;
            });
            this.Bossattack(this.boss,this.player.player)

        }else{
            this.salleBoss.setVisible(false);
            this.salleBoss.getChildren().forEach(child=>{
                child.body.enable=false;
            });
        }

        if(this.player.player.x >= 10395 && this.musicSwap === false){
            this.MainTheme.stop();
            this.BossTheme.play();
            this.musicSwap = true;

        }

        this.player.update();
        this.player.move();

    }
}