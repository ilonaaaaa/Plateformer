class UI extends Phaser.Scene {

    constructor() {
        super('UI');
    }

    preload(){
        this.load.image('fragUi', 'assets/images/fragment.png');
    }

    create(){
        let me = this;
        const {width, height}= this.scale

        this.add.sprite(50,50,'fragUi')
            .setDisplaySize(40,40);

        this.count1 = this.add.text(120 ,50 , objet_fragment + '/9',{
            color: '#ffffff',
            fontFamily: 'cursive',
            fontSize : 40
        })
            .setOrigin(0.5)
            .setAlpha(1)


        this.count2 = this.add.text(200 ,100 , 'End wall breakable !',{
            color: '#ffffff',
            fontFamily: 'cursive',
            fontSize : 40
        })
            .setOrigin(0.5)
            .setAlpha(1)

    }

    update(){
        this.count1.setText(Math.round(window.objet_fragment) + '/9');
        this.count2.setText('End wall breakable !');

        if (window.objet_fragment<7){
            this.count2.visible = false;
        }
        else if (window.objet_fragment>=7){
            this.count2.visible = true;
        }
    }
}