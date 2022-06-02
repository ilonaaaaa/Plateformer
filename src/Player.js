class Player {


    constructor(scene) {
        this.scene=scene
        this.cameras=scene
        this.player = this.scene.physics.add.sprite(190, 6080, 'nino');
        this.player.setBounce(0);
        this.player.setCollideWorldBounds(false);
        this.scene.physics.add.collider(this.player, this.scene.platform);

        this.animation()
        this.yoyo = this.scene.physics.add.sprite(this.player.x, this.player.y, "yoyo")
        this.yoyo.setScale(2)
        this.yoyo.setDepth(0);
        this.yoyo.setDisplaySize(20, 20)
        this.yoyo.launch = false;
        this.yoyo.body.setAllowGravity(false)
        this.action=false

        this.initKeyboard();
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        let me = this
        this.scene.input.on('pointerdown', function (pointer) {

            if(this.yoyo.launch === false  && Phaser.Math.Distance.Between(me.player.x, me.player.y, pointer.worldX, pointer.worldY) <= 700){
                me.scene.input.keyboard.enabled = false;
                me.yoyo.launch = true;
                me.player.play('Atk', true)
                me.player.setVelocityX(0);
                me.player.setVelocityY(0);
                //me.player.body.setAllowGravity(false)
                me.player.setImmovable(false)
                me.yoyoTween = me.scene.tweens.add({
                    targets: me.yoyo,
                    x: pointer.worldX,
                    y: pointer.worldY,
                    duration: 300,
                    ease: 'Power2',
                    yoyo: true,
                    onStart:()=>{this.action=true},
                    onComplete:()=>{ this.action=false }
                });
            }
        }, this);

    }

    animation(){

        this.scene.anims.create({
            key: 'run',
            frames: this.scene.anims.generateFrameNames('run', {
                start: 0,
                end: 15,
            }),
            frameRate: 11,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNames('idle', {
                start: 0,
                end: 4,
            }),
            frameRate: 6,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'jump',
            frames: this.scene.anims.generateFrameNames('jump', {
                start: 0,
                end: 5,
            }),
            frameRate: 8,
            repeat: 0
        });
        this.scene.anims.create({
            key: 'Atk',
            frames: this.scene.anims.generateFrameNames('Atk', {
                start: 0,
                end: 7,
            }),
            frameRate: 14,
            repeat: -1
        });

    }


    jump(){
        if(this.pokemon){
        }
        else{
            this.pokemon = true
            if(this.player.body.onFloor()){
                this.player.setVelocityY(-850)
                this.player.play('jump',true)
                this.saut =1 ;
            }
            if(this.saut === 1 && !this.player.body.onFloor()){
                this.player.setVelocityY(-750)
                this.player.play('jump',true)
                this.saut = 0;
            }
        }
    }
    moveRight(){
        this.player.setVelocityX(400);
        this.player.setFlipX(false);
        if (this.player.body.onFloor()) {
            this.player.play('run', true)}
    }
    moveLeft(){
        this.player.setVelocityX(-400);
        if (this.player.body.onFloor()) {
            this.player.play('run', true)}
        this.player.setFlipX(true);
    }
    stop(){
        this.player.setVelocityX(0);
        if (this.player.body.onFloor() && this.action===false) {
            this.player.play('idle',true)
        }
    }


    move(){
        if(this.qDown && this.spaceDown ){
            this.jump();
            return;
        }
        if(this.dDown && this.spaceDown ){
            this.jump();
            return;
        }
        switch (true) {
            case this.qDown:

                this.moveLeft();
                break;
            case this.dDown:
                this.moveRight();
                break;
            case this.spaceDown :
                this.jump();
                break;
            case this.player.body.onFloor():
                this.stop();
                break;
        }
    }


    initKeyboard() {
        let me = this;
        this.scene.input.keyboard.on('keydown', function (kevent) {
            switch (kevent.keyCode) {
                case Phaser.Input.Keyboard.KeyCodes.SPACE:
                    me.spaceDown=true;
                    break;
                case Phaser.Input.Keyboard.KeyCodes.Q:
                    me.qDown=true;
                    break;
                case Phaser.Input.Keyboard.KeyCodes.D:
                    me.dDown=true;
                    break;
            }
        });
        this.scene.input.keyboard.on('keyup', function (kevent) {
            switch (kevent.keyCode) {
                case Phaser.Input.Keyboard.KeyCodes.SPACE:
                    me.spaceDown=false;
                    me.pokemon=false;
                    break;
                case Phaser.Input.Keyboard.KeyCodes.Q:
                    me.qDown=false;
                    break;
                case Phaser.Input.Keyboard.KeyCodes.D:
                    me.dDown=false;
                    break;
            }
        });
    }


    update(){
        if (!this.yoyo.launch) {
            this.move();
            this.yoyo.x = this.player.x;
            this.yoyo.y = this.player.y;
        }
        else {
            this.move();
            if (this.yoyoTween.progress === 1) {
                this.scene.input.keyboard.enabled = true;
                this.yoyo.launch = false;

            }
        }
    }

    }



