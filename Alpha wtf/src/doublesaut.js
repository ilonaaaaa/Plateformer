class DoubleSaut extends Phaser.Scene {


        //player.setBounce(0.2);// REBONDISSEMENT DU PERSONNAGE LORSQU'IL SAUTE
        player.setCollideWorldBounds(true);//COLLISION AVEC TOUS LES OBJETS DU JEU


        cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(player, platforms);//AJOUT DE COLLISION ENTRE LE PERSONNAGE ET LES PLATFORMES

        this.initKeyboard()

        this.dejaAppuye =false;
        this.doubleJump =0;
    }

    //LA ON DEFINIT CE QU'IL SE PASSE LORSQU'ON APPUIE SUR TELLE OU TELLE TOUCHE
    initKeyboard() {
        let me = this;
        this.input.keyboard.on('keydown', function (kevent) {
            switch (kevent.keyCode) {
                case Phaser.Input.Keyboard.KeyCodes.UP:
                    if (me.dejaAppuye) { //SI LA VARIABLE DEJAAPPUYE EST VRAI
                        //FAIS RIEN
                    }
                    else { //SINON
                        me.dejaAppuye = true;//POUR LA PROCHAINE FOIS
                        if (player.body.onFloor()){ // SI LE JOUEUR TOUCHE LE SOL
                            player.setVelocityY(-330); //LE PERSONNAGE VA A UNE VITESSE DE 330 VERS LE HAUT
                            me.doubleJump = 1; //LA VARIABLE DOUBLEJUMP A 1 POUR POUVOIR AVOIR LE DOUBLE SAUT
                        }
                        if (me.doubleJump === 1 && !player.body.onFloor()) { //SI LA VARIABLE DOUBLESAUT EST A 1 ET LE JOUEUR NE TOUCHE PAS LE SOL
                            player.setVelocityY(-330); //LE PERSONNAGE VA A UNE VITESSE DE 330 VERS LE HAUT
                            me.doubleJump = 0; //LA VARIABLE DOUBLEJUMP A 0 POUR NE PLUS POUVOIR AVOIR LE DOUBLE SAUT
                        }
                    }
                    break;
                case Phaser.Input.Keyboard.KeyCodes.RIGHT:
                    player.setVelocityX(160);//LE PERSONNAGE VA A UNE VITESSE DE A UNE VITESSE DE 160 A DROITE

                    player.anims.play('right', true);//ET ON LUI DEMANDE DE LANCER L'ANIMATION RIGHT QU'ON A CREE DANS LA FONCTION CREATE
                    break;
                case Phaser.Input.Keyboard.KeyCodes.LEFT:
                    player.setVelocityX(-160);//LE PERSONNAGE VA A UNE VITESSE DE A UNE VITESSE DE 160 A GAUCHE

                    player.anims.play('left', true);//ET ON LUI DEMANDE DE LANCER L'ANIMATION LEFT QU'ON A CREE DANS LA FONCTION CREATE
                    break;
            }
        });
        this.input.keyboard.on('keyup', function (kevent) {
            switch (kevent.keyCode) {
                case Phaser.Input.Keyboard.KeyCodes.UP:
                    me.dejaAppuye = false;
                    break;
                case Phaser.Input.Keyboard.KeyCodes.RIGHT:
                    player.setVelocityX(0);//LE PERSO NE BOUGE PAS

                    player.anims.play('turn');//ET ON JOUE L'ANIMATION TUR CREE DANS LA FONCTION CREATE
                    break;
                case Phaser.Input.Keyboard.KeyCodes.LEFT:
                    player.setVelocityX(0);//LE PERSO NE BOUGE PAS

                    player.anims.play('turn');//ET ON JOUE L'ANIMATION TUR CREE DANS LA FONCTION CREATE

                    break;
            }
        });
    }
    update ()
    {

    }

}

