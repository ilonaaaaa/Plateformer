// class fragment {
//
//     constructor(scene) {
//         this.scene=scene
//         this.cameras=scene
//
//         this.fragment = this.scene.physics.add.staticGroup()
//         this.scene.fragmentlayer.forEach(object => {
//             let obj = this.scene.fragment.create(object.x, object.y, "fragment");
//             obj.setScale(object.width/16, object.height/16);
//             obj.setOrigin(0);
//             obj.body.width = object.width;
//             obj.body.height = object.height;
//         });
//
//         this.scene.map.setCollisionBetween(0, 923, true, 'GroundLayer');
//         this.scene.player.setCollideWorldBounds(true);
//         this.scene.physics.add.collider(this.scene.player, this.scene.sol);
//         this.scene.physics.add.overlap(this.scene.player, this.fragment, this.scene.fragmentlayer, null, this);
//
//         // text = this.add.text(570, 70, `Coins: ${coinScore}x`, {
//         //     fontSize: '20px',
//         //     fill: '#ffffff'
//         // });
//         // text.setScrollFactor(0);
//
//         // this.function collectFrag(player, fragment) {
//         //     this.fragment.destroy(coin.x, coin.y); // remove the tile/coin
//         //     //coinScore ++; // increment the score
//         //     //text.setText(`Coins: ${coinScore}x`); // set the text to show the current score
//         //     return false;
//         // }
//     }
//
//
//
// }