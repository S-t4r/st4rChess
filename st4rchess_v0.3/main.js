import { Piece } from "./pieces.js";
import { Pawn } from "./pieces.js";
import { Rook } from "./pieces.js";
import { Knight } from "./pieces.js";
import { Bishop } from "./pieces.js";
import { Queen } from "./pieces.js";
import { King } from "./pieces.js";

import tinycolor from "https://esm.sh/tinycolor2";

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

                // Add square position
                square.data('position', {x: i, y: j})

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
                            if (this.selectedPiece.isLegalMove(clickedPosition)) {
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

            this.pieces.push(whitePiece);
            this.pieces.push(blackPiece);
            }

        // White pieces

        // White Rooks
        // Left Rook
        let whiteRookLeft = this.square[7][0];
        let whiteRookLeftInstance = new Rook(this, 'white', {x: 7, y: 0,}, whiteRookLeft);
        this.board[7][0] = whiteRookLeftInstance;
        whiteRookLeft.data('piece', whiteRookLeftInstance);
        this.pieces.push(whiteRookLeftInstance);
        
        // Right Rook
        let whiteRookRight = this.square[7][7];
        let whiteRookRightInstance = new Rook(this, 'white', {x: 7, y: 7,}, whiteRookRight);
        this.board[7][7] = whiteRookRightInstance;
        whiteRookRight.data('piece', whiteRookRightInstance);
        this.pieces.push(whiteRookRightInstance);

        // White Knights
        // Left Knight
        let whiteKnightLeft = this.square[7][1];
        let whiteKnightLeftInstance = new Knight(this, 'white', {x: 7, y: 1,}, whiteKnightLeft);
        this.board[7][1] = whiteKnightLeftInstance;
        whiteKnightLeft.data('piece', whiteKnightLeftInstance);
        this.pieces.push(whiteKnightLeftInstance);
        
        // Right Knight
        let whiteKnightRight = this.square[7][6];
        let whiteKnightRightInstance = new Knight(this, 'white', {x: 7, y: 6,}, whiteKnightRight);
        this.board[7][6] = whiteKnightRightInstance;
        whiteKnightRight.data('piece', whiteKnightRightInstance);
        this.pieces.push(whiteKnightRightInstance);
        
        // White Bishops
        // Left Bishop
        let whiteBishopLeft = this.square[7][2];
        let whiteBishopLeftInstance = new Bishop(this, 'white', {x: 7, y: 2,}, whiteBishopLeft);
        this.board[7][2] = whiteBishopLeftInstance;
        whiteBishopLeft.data('piece', whiteBishopLeftInstance);
        this.pieces.push(whiteBishopLeftInstance);
        
        // Right Bishop
        let whiteBishopRight = this.square[7][5];
        let whiteBishopRightInstance = new Bishop(this, 'white', {x: 7, y: 5,}, whiteBishopRight);
        this.board[7][5] = whiteBishopRightInstance;
        whiteBishopRight.data('piece', whiteBishopRightInstance);
        this.pieces.push(whiteBishopRightInstance);
        
        // White Queen
        let whiteQueen = this.square[7][3];
        let whiteQueenInstance = new Queen(this, 'white', {x: 7, y: 3,}, whiteQueen);
        this.board[7][3] = whiteQueenInstance;
        whiteQueen.data('piece', whiteQueenInstance);
        this.pieces.push(whiteQueenInstance);
        
        // White King
        let whiteKing = this.square[7][4];
        let whiteKingInstance = new King(this, 'white', {x: 7, y: 4,}, whiteKing);
        this.board[7][4] = whiteKingInstance;
        whiteKing.data('piece', whiteKingInstance);
        this.pieces.push(whiteKingInstance);
        

        // Black pieces
        
        // Black Rooks
        // First Rook
        let blackRookLeft = this.square[0][0];
        let blackRookLeftInstance = new Rook(this, 'black', {x: 0, y: 0,}, blackRookLeft);
        this.board[0][0] = blackRookLeftInstance;
        blackRookLeft.data('piece', blackRookLeftInstance);
        this.pieces.push(blackRookLeftInstance);
        
        // Right Rook
        let blackRookRight = this.square[0][7];
        let blackRookRightInstance = new Rook(this, 'black', {x: 0, y: 7,}, blackRookRight);
        this.board[0][7] = blackRookRightInstance;
        blackRookRight.data('piece', blackRookRightInstance);
        this.pieces.push(blackRookRightInstance);
        
        // Black Knights
        // Left Knight
        let blackKnightLeft = this.square[0][1];
        let blackKnightLeftInstance = new Knight(this, 'black', {x: 0, y: 1,}, blackKnightLeft);
        this.board[0][1] = blackKnightLeftInstance;
        blackKnightLeft.data('piece', blackKnightLeftInstance);
        this.pieces.push(blackKnightLeftInstance);
        
        // Right Knight
        let blackKnightRight = this.square[0][6];
        let blackKnightRightInstance = new Knight(this, 'black', {x: 0, y: 6,}, blackKnightRight);
        this.board[0][6] = blackKnightRightInstance;
        blackKnightRight.data('piece', blackKnightRightInstance);
        this.pieces.push(blackKnightRightInstance);
        

        // Black Bishops
        // Left Bishop
        let blackBishopLeft = this.square[0][2];
        let blackBishopLeftInstance = new Bishop(this, 'black', {x: 0, y: 2,}, blackBishopLeft);
        this.board[0][2] = blackBishopLeftInstance;
        blackBishopLeft.data('piece', blackBishopLeftInstance);
        this.pieces.push(blackBishopLeftInstance);
        
        // Right Bishop
        let blackBishopRight = this.square[0][5];
        let blackBishopRightInstance = new Bishop(this, 'black', {x: 0, y: 5,}, blackBishopRight);
        this.board[0][5] = blackBishopRightInstance;
        blackBishopRight.data('piece', blackBishopRightInstance);
        this.pieces.push(blackBishopRightInstance);

        // Black Queen
        let blackQueen = this.square[0][3];
        let blackQueenInstance = new Queen(this, 'black', {x: 0, y: 3,}, blackQueen);
        this.board[0][3] = blackQueenInstance;
        blackQueen.data('piece', blackQueenInstance);
        this.pieces.push(blackQueenInstance);

        // Black King
        let blackKing = this.square[0][4];
        let blackKingInstance = new King(this, 'black', {x: 0, y: 4,}, blackKing);
        this.board[0][4] = blackKingInstance;
        blackKing.data('piece', blackKingInstance);
        this.pieces.push(blackKingInstance);

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


    ShowLegalMoves(legalMoves) {
        let legalSquares = this.square
        // When a Piece is selected
        if (this.selectedPiece !== null) {
            // When a Piece is selected and another Piece is clicked
            if (!this.selectedPiece.clicked) {
                legalMoves.forEach(element => {
                    let originalColor = legalSquares[element.x][element.y].data('originalColor');
                    legalSquares[element.x][element.y].css('backgroundColor', originalColor);
                });
            }
            else if (this.selectedPiece.clicked) {
                legalMoves.forEach(element => {

                    // tinyColor library
                    let originalColor = legalSquares[element.x][element.y].data('originalColor');
                    let pinkColor;
        
                    if (originalColor === 'darkgray') {
                        pinkColor = tinycolor('hotpink').darken(10).toString();
                    }
                    else if (originalColor === 'lightgray') {
                        pinkColor = tinycolor('hotpink').lighten(10).toString();
                    }
        
                    let mixedColor = tinycolor.mix(originalColor, pinkColor, 20).toString();
                
                    legalSquares[element.x][element.y].css('backgroundColor', mixedColor);
                });
            }
        }
        // When a Piece is deselected
        else if (this.selectedPiece === null) {
            legalMoves.forEach(element => {
                let originalColor = legalSquares[element.x][element.y].data('originalColor');
                legalSquares[element.x][element.y].css('backgroundColor', originalColor);
            });
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
});