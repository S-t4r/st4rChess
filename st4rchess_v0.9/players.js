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

    // Create div if it doesn't already exist.
    createPlayerDOM() {

        // Player object.
        let player = $("<div>").attr('name', this.name);

        // Captured pieces div
        let capturedPieces = $('<div>').data({'capturedPieces': this.capturedPieces});
        capturedPieces.data({'capturedNum': this.capturedPieces.length});

        
        // Styling.
        player.css({display: 'block', textAlign: 'center', padding: '1rem 2rem',
            margin: '1rem', background: '#EE11AA', border: '1px solid black', borderRadius: '1rem'});
        capturedPieces.css({display: 'flex', flexDirection: 'row', padding: '2rem 2rem',  background: '#AA11AA', border: '1px solid black', borderRadius: '1rem'});
        
        // Captured Pieces list.
        player.text(this.name);
        player.append(capturedPieces);

        return player;
    }


    UpdateScore(captured) {
        if (captured.data('capturedNum') < captured.data('capturedPieces').length) {
            let newPiece = captured.data('capturedPieces').slice(captured.data('capturedNum'));

            newPiece.forEach(piece => {
                const newDom = $('<div>');
                newDom.css({
                    width: '20px',
                    height: '20px',
                    margin: '3px'
                });
        
                // SVG
                newDom.load(`./svg/${piece.color}${piece.name}.svg`, () => {
                    newDom.find('svg').css({
                        width: '100%',
                        height: '100%'
                    });
                });
                captured.append(newDom)
                captured.data('capturedNum', captured.data('capturedPieces').length)
            });
        }
        
        return;
    }

}

