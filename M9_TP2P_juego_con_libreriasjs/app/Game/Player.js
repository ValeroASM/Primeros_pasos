/**
 * Personaje principal del juego. Hereda de la clase Character.
 * @extends Character
 */
class Player extends Character {
    /**
     * Inicializa un jugador
     * @param game {Game} La instancia del juego al que pertenece el personaje
     */
    constructor(game) {
        const height = PLAYER_HEIGHT * game.width / 100,
            width = PLAYER_WIDTH * game.width / 100,
            x = game.width / 2 - width / 2,
            y = game.height - height,
            speed = PLAYER_SPEED,
            myImage = PLAYER_PICTURE,
            myImageDead = PLAYER_PICTURE_DEAD;


        super(game, width, height, x, y, speed, myImage, myImageDead);
        this.lifes = this.game.lifes;
        this.updatesPerShot = 20;
        this.updatesPerShotCount = 0;
        this.dragging = false;
        this.initDraggingAbility();
    }

    /**
     * Actualiza los atributos de posición del jugador y los disparos en función de las teclas pulsadas
     */
    update() {
        document.querySelector('.lifes .amount').innerHTML = this.lifes;

        if (!this.dead && !this.dragging) {
            switch (this.game.keyPressed) {
                case KEY_LEFT:
                    if (this.x > this.speed) {
                        this.x -= this.speed;
                    }
                    break;
                case KEY_RIGHT:
                    if (this.x < this.game.width - this.width - this.speed) {
                        this.x += this.speed;
                    }
                    break;
                case KEY_SHOOT:
                    this.game.shoot(this);
                    break;
            }
        }


        /**
         * In case game is touchable...
         */
        if (!this.dead) {
            this.updatesPerShotCount++;
            if (this.updatesPerShotCount % this.updatesPerShot == 0) {
                this.game.shoot(this);
                if(shoot_status){
                    shoot_fx.play(); //Reproducir el efecto si esta activado
                }
            }
        }
    }


    /**
     * In case game is touchable...
     */
     initDraggingAbility() {
        let interactable = interact(this.myImageContainer);

        interactable.draggable({
            modifiers: [
                interact.modifiers.restrictRect({
                  restriction: 'parent'
                })
              ],
            listeners: {
                
                start: ev => {
                    console.log(ev)
                }, 
                move: ev => {
                    if(!this.dead){
                        this.x += ev.dx
                    }
                }, 
                end: ev => {
                    ev.target.style.transform =
                    `translate(${this.x}px)`;
                }
            }
        })
    }



    /**
     * Mata al jugador
     */

    //Agregado el gastar vidas antes de morir
    die() {

        console.log(this.game.lifes);

        if (!this.dead && this.lifes>0) {
            this.lifes--;
            setTimeout(() => {
                this.myImage.src = PLAYER_PICTURE;
                this.dead = false;
                this.dragging = false;
            }, 2000);

            this.myImage.src = this.myImageDead;

            this.dead = true;

            console.log(this.lifes);

            super.die();


        }else{
            if(this.lifes===0){
                this.game.endGame();
            }
        }
    }
}