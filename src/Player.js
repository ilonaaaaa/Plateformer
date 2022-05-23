class Player {


    constructor(scene) {
        this.scene=scene
        this.cameras=scene
        this.player = this.scene.physics.add.sprite(190, 6080, 'nino');
        this.player.setBounce(0);
        this.player.setCollideWorldBounds(false);
        this.scene.physics.add.collider(this.player, this.scene.platform);

    }


    worldSwitch(){

    }

    jump(){
        if(this.pokemon){
        }
        else{
            this.pokemon = true
            if(this.player.body.onFloor()){
                this.player.setVelocityY(-700)
                this.player.play('jump',true)
                this.saut =1 ;
            }
            if(this.saut === 1 && !this.player.body.onFloor()){
                this.player.setVelocityY(-800)
                this.player.play('jump',true)
                this.saut = 0;
            }
        }
    }
    moveRight(){
        this.player.setVelocityX(300);
        this.player.setFlipX(false);
        if (this.player.body.onFloor()) {
            this.player.play('walk', true)}
    }
    moveLeft(){
        this.player.setVelocityX(-300);
        if (this.player.body.onFloor()) {
            this.player.play('walk', true)}
        this.player.setFlipX(true);
    }
    stop(){
        this.player.setVelocityX(0);
        if (this.player.body.onFloor()) {
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

    switch(){
        if(this.qDown && this.spaceDown ){
            //this.jump();
            return;
        }
        if(this.dDown && this.spaceDown ){
            //this.jump();
            return;
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
                    case Phaser.Input.Keyboard.KeyCodes.E:
                    me.eDown=true;
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
                    case Phaser.Input.Keyboard.KeyCodes.E:
                    me.eDown=false;
                    break;
            }
        });
    }
    }



