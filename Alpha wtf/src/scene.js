class scene extends Phaser.Scene {

    constructor(key) {
        super(key);
    }

    preload() {
        this.load.atlas('player', 'assets/images/kenney_player.png', 'assets/images/kenney_player_atlas.json');
        this.load.image('tiles', 'assets/tilesets/tilesheetFT.png');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/blockout.json');
    }

    create() {

        this.map = this.make.tilemap({ key: 'map' });
        this.tileset = this.map.addTilesetImage('tilesheetFT', 'tiles');

        this.sol = this.map.createLayer('decor2', this.tileset, 0, 0);
        this.shiny = this.map.createLayer('shiny', this.tileset, 0, 0);


        this.cursors = this.input.keyboard.createCursorKeys();

        this.player = new Player(this)

        this.cameras.main.startFollow(this.player.player,false);
        this.player.initKeyboard();
    }

    update() {
        this.player.move();
        }
}