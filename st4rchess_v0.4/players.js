export class Player {
    /*
     We have 2 players in a game of chess.
     Each has some property, viz.
     - board = The board they are playing on; done.
     - color = Black and White; done.
     - name = Some default value; done.
     - own pieces; done.
     - captured pieces; done.

     Where should we create the player?
     After initializing the board.

     But player is a property of board as well.
     let's take it step by step.
     */

    constructor(board, color, name, ownPieces) {
        this.board = board;
        this.color = color;
        this.name = name;
        this.ownPieces = ownPieces.filter(piece => piece.color === color);
        this.capturedPieces = [];
        this.score = 0;
    }


    updatePosition(capturingPiece) {
        // Update captured Pieces array.
        if (capturingPiece && capturingPiece.color !== this.color) {
            this.capturedPieces.push(capturingPiece);
            this.showPlayer();
        }
    }


    showPlayer() {
        let playerDiv = document.querySelector(`[name="${this.name}"`);
        if (!playerDiv) {
            playerDiv = this.createPlayerDOM();
            $('body').append(playerDiv)
        }
        else if (playerDiv) {
            let captured = $(playerDiv).find('div');
            this.UpdateScore(captured);
        }
    }

    // Create div if does not exist.
    createPlayerDOM() {

        // Player object.
        let player = $("<div>").attr('name', this.name);

        // Captured pieces div
        let capturedPieces = $('<div>').data({'capturedPieces': this.capturedPieces});
        capturedPieces.text(`score: ${this.score}`);
        
        // Styling.
        player.css({display: 'grid', padding: '1rem 2rem', margin: '1rem', background: 'red',
        border: '1px solid black'});
        capturedPieces.css({padding: '1rem 2rem',  background: 'blue'});
        
        // Captured Pieces list.
        player.text(this.name);
        player.append(capturedPieces);

        return player;
    }


    // Let's separate these functions.
    // -UpdatePosition
    UpdateScore(captured) {
        this.score = 0;
        this.capturedPieces.forEach(element => {

            this.score += element.score
        });
        captured.html(`<p>score: ${this.score}</p>`);
        return ;
    }

}

