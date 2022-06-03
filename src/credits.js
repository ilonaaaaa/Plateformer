class credits extends Phaser.Scene {
    constructor() {
        super('credits');
    }

    preload(){
        this.load.image('MenuB', 'assets/images/menu/bouton_start.png');
        this.load.image('fond', 'assets/images/menu/credits.png');

        this.load.audio('Wintheme','assets/sounds/WinMusic.mp3');
    }

    create() {

        const back = this.add.image(0, 0, 'fond').setOrigin(0, 0);

        this.WinTheme = this.sound.add('Wintheme',{volume: 0.3});
        this.WinTheme.loop = true;
        this.WinTheme.play();

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
                this.WinTheme.stop();
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