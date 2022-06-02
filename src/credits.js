class credits extends Phaser.Scene {
    constructor() {
        super('credits');
    }

    preload(){
        this.load.image('MenuB', 'assets/images/menu/bouton_credits.png');
        this.load.image('fond', 'assets/images/menu/credits.png');
    }

    create() {

        const back = this.add.image(0, 0, 'fond').setOrigin(0, 0);

        const buttonMenuSprite = this.add.image(1200, 730, 'MenuB')
            .setOrigin(0, 0)
            .setScale(1)
            .setAlpha(0.7)
            .setVisible(true);

        this.buttonMenu = this.add.rectangle(buttonMenuSprite.x, buttonMenuSprite.y,350,150,0xffffff,0)
            .setOrigin(0,0)
            .setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, ()=> {
                this.scene.start('Start');
                this.buttonMenu.disableInteractive();
                buttonMenuSprite.setVisible(false);
            })
            .on('pointerover',function(){
                buttonMenuSprite.setAlpha(1);
            })
            .on('pointerout',function(){
                buttonMenuSprite.setAlpha(0.7);
            })

    }
}