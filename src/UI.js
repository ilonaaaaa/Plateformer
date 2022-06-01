class UI extends Phaser.Scene {

    constructor() {
        super('UI');
    }

    preload(){
        //this.load.image('lucioleUi', 'Alpha wtf/assets/images/lucioleUi.png');
    }

    create(){
        let me = this;
        const {width, height}= this.scale

        //this.add.sprite(50,50,'lucioleUi')
            //.setDisplaySize(40,40);

        this.count1 = this.add.text(50 ,50 , window.objet_fragment + '/9',{
            color: '#ffffff',
            fontFamily: 'cursive',
            fontSize : 40
        })
            .setOrigin(0.5)
            .setAlpha(1)


        this.count2 = this.add.text(50 ,50 , window.objet_fragment + '/9, end wall breakable !',{
            color: '#ffffff',
            fontFamily: 'cursive',
            fontSize : 40
        })
            .setOrigin(0.5)
            .setAlpha(1)
    }

    update(){
        this.count1.setText(Math.round(window.objet_fragment));
        this.count2.setText(Math.round(window.objet_fragment));

        if (window.objet_fragment<7){
            this.count1.visible = true;
            this.count2.visible = false;
        }
        else if (window.objet_fragment>=7){
            this.count1.visible = false;
            this.count2.visible = true;
        }
    }
}