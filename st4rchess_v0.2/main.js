import { Piece } from "./pieces.js";
import { Pawn } from "./pieces.js";
import { Rook } from "./pieces.js";
import { Knight } from "./pieces.js";
import { Bishop } from "./pieces.js";
import { Queen } from "./pieces.js";
import { King } from "./pieces.js";

class Board {
    constructor() {
        const FILE = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const RANK = ['1', '2', '3', '4', '5', '6', '7', '8'];
        this.pieces = [];
        this.capturedPieces = [];
        this.selectedPiece = null;
        this.square = [];
        this.turn = true;
        this.DIV = $('div');
        this.Styling();
        
        // Create board array
        this.board = new Array(8).fill(null).map((_, i) => 
            new Array(8).fill(null).map((_, j) => FILE[i] + RANK[j])
        );
    }


    PrintBoard(array) {
        for (let i = 0; i < array.length; i++) {
            this.square[i] = [];
            // File
            for (let j = 0; j < array.length; j++) {
                // Decide it's color
                let color = (i + j) % 2 == 0 ? 'lightgray' : 'darkgray';

                // Add value to div
                let square = $("<div>").data({ 'value': array[j][i], piece: null });
                this.square[i][j] = square;

                // Add original color to the square
                square.data('originalColor', color);

                square.css({width: '12.5%', height: '12.5%', background: color});
                // Event Listener
                square.on('click', (event) => {
                    event.stopPropagation();
                    let clickedPosition = this.convertCoordinates($(square).data('value'));
                    
                    if (this.selectedPiece != null && this.selectedPiece.Turn()) {
                        let oldPosition = this.selectedPiece;
                        // Change piece position
                        if (oldPosition.position.x != clickedPosition.x ||
                            oldPosition.position.y != clickedPosition.y
                        ) {
                            // console.log(this.selectedPiece.PawnMove(clickedPosition));
                            if (this.selectedPiece.PawnMove(clickedPosition)) {
                                this.redrawPiece(oldPosition, clickedPosition);
                                this.selectedPiece = null;
                            }
                        }
                    }
                });
                square.appendTo(this.DIV);
            }
        }
    }


    redrawPiece(oldPosition, newPosition) {
        if (this.turn) {
            this.turn = false;
        }
        else if (!this.turn) {
            this.turn = true;
        }
        // Remove piece form old position
        this.square[oldPosition.position.x][oldPosition.position.y].empty();
        this.square[oldPosition.position.x][oldPosition.position.y] == null;
        
        // Draw piece at new position
        let piece = this.selectedPiece;
        piece.Move(piece, this.square[newPosition.x][newPosition.y]);
        piece.Draw(this.square[newPosition.x][newPosition.y]);
        
    }


    StartingPosition() {
        for (let i = 0; i < 8; i++) {
            // Associate squares to pieces
            let whiteSquare = this.square[6][i];
            let blackSquare = this.square[1][i];
            
            // White pawns
            let whitePiece = new Pawn(this, 'white', {x: 6, y: i}, whiteSquare);
            this.board[6][i] = whitePiece;
            whiteSquare.data('piece', whitePiece);
            
            // Black pawns
            let blackPiece = new Pawn(this, 'black', {x: 1, y: i}, blackSquare);
            this.board[1][i] = blackPiece;
            blackSquare.data('piece', blackPiece)

            this.pieces.push(this.board[1][i]);
            this.pieces.push(this.board[6][i]);
            }
        // White pieces
        this.board[7][0] = new Rook(this, 'white')
        this.board[7][1] = new Knight(this, 'white')
        this.board[7][2] = new Bishop(this, 'white')
        this.board[7][3] = new Queen(this, 'white')
        this.board[7][4] = new King(this, 'white')
        this.board[7][5] = new Bishop(this, 'white')
        this.board[7][6] = new Knight(this, 'white')
        this.board[7][7] = new Rook(this, 'white')
        
        // Black pieces
        this.board[0][0] = new Rook(this, 'black')
        this.board[0][1] = new Knight(this, 'black')
        this.board[0][2] = new Bishop(this, 'black')
        this.board[0][3] = new Queen(this, 'black')
        this.board[0][4] = new King(this, 'black')
        this.board[0][5] = new Bishop(this, 'black')
        this.board[0][6] = new Knight(this, 'black')
        this.board[0][7] = new Rook(this, 'black')

        // Loop through the board
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.board[i][j] instanceof Piece) {

                }
                else {
                    this.board[i][j] = null;
                }
            }
        }

    }


    DrawPieces() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.board[i][j] instanceof Pawn) {
                    let square = this.square[i][j];
                    this.board[i][j].Draw(square);
                }
                else if (this.board[i][j] instanceof Rook) {
                    this.board[i][j].Draw(this.DIV, i, j)
                }
                else if (this.board[i][j] instanceof Knight) {
                    this.board[i][j].Draw(this.DIV, i, j)
                }
                else if (this.board[i][j] instanceof Bishop) {
                    this.board[i][j].Draw(this.DIV, i, j)
                }
                else if (this.board[i][j] instanceof Queen) {
                    this.board[i][j].Draw(this.DIV, i, j)
                }
                else if (this.board[i][j] instanceof King) {
                    this.board[i][j].Draw(this.DIV, i, j)
                }
            }
        }
    }


    convertCoordinates(notation) {
        let y = notation[0].charCodeAt(0) - 'a'.charCodeAt(0);
        let x = parseInt(notation[1]) - 1;
        return {x: x, y: y}
    }

    isSquareOccupied(i, j) {
        return this.board[i][j] instanceof Piece;
    }


    Styling() {
        // CSS style.
        const WIDTH = '500px';
        this.DIV.css({display: 'flex', position: 'relative', flexWrap: 'wrap',
                width: WIDTH, height: WIDTH, border: '1px solid black',
                justifyContent: 'center', alignItems: 'center'
            });
    }

}

$('document').ready(() => {
    // Game

    // Add DOM element to the Board constructor.
    const playerDisplay = $('#player')

    // class game
    let game = new Board
    game.PrintBoard(game.board);
    game.StartingPosition();
    game.DrawPieces();
    console.log(game);
});