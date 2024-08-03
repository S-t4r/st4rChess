import { Piece } from "./pieces.js";
import { Pawn } from "./pieces.js";
import { Rook } from "./pieces.js";
import { Knight } from "./pieces.js";
import { Bishop } from "./pieces.js";
import { Queen } from "./pieces.js";
import { King } from "./pieces.js";
import { Player } from "./players.js"

class Board {
    constructor() {
        this.SIZE = 8;
        this.pieces = [];
        this.capturedPieces = [];
        this.selectedPiece = null;
        this.square = new Array(this.SIZE).fill(null).map(() => new Array(this.SIZE).fill(null));
        this.turn = true;

        // King in check
        this.checkedKing = null;
        
        // Create board array
        this.board = new Array(this.SIZE).fill(null).map(() => new Array(this.SIZE).fill(null));

        // Players
        this.BOARDSIZE = 100/this.SIZE;
        this.players = [];

        // Fifty move rule
        this.fifty = 0;
    }


    PrintBoard() {
        let DOMelement = this.DOM();
        for (let i = 0; i < this.board[0].length; i++) {
            
            // File
            for (let j = 0; j < this.board[0].length; j++) {
                // Decide it's color
                let color = (i + j) % 2 == 0 ? 'lightgray' : 'darkgray';

                // Add value to div
                let square = $("<div>").data({ piece: null });
                
                // Add original color to the square
                square.data('originalColor', color);
                
                // Add square position
                square.data('position', {x: j, y: i});
                
                square.css({width: `${this.BOARDSIZE}%`, height: `${this.BOARDSIZE}%`, background: color});
                
                square.appendTo(DOMelement);


                this.square[i][j] = square;

                // Event Listener
                this.square[i][j][0].addEventListener('click', () => {
                    if (this.selectedPiece !== null && this.square[i][j] !== this.selectedPiece.square) {
                        // for each legal move
                        this.selectedPiece.Move(this.selectedPiece, this.square[i][j]);
                    }
                });

            }
        }
        $('body').append(DOMelement)
    }


    StartingPosition() {
        for (let i = 0; i < 8; i++) {
            
        //     // White pawns
            let whitePawn = new Pawn(this, 'white', this.square[6][i]);

            // Black pawns
            let blackPawn = new Pawn(this, 'black', this.square[1][i]);

            this.pieces.push(whitePawn);
            this.pieces.push(blackPawn);
        }
    // White pieces
    
    // White Rooks
    // Left Rook
    let whiteRookLeft = new Rook(this, 'white', this.square[7][0]);
    this.pieces.push(whiteRookLeft)
    
    // Right Rook
    let whiteRookRight = new Rook(this, 'white', this.square[7][7]);
    this.pieces.push(whiteRookRight)

    // White Knights
    // Left Knight
    let whiteKnightLeft = new Knight(this, 'white', this.square[7][1]);
    this.pieces.push(whiteKnightLeft);

    // Right Knight
    let whiteKnightRight = new Knight(this, 'white', this.square[7][6]);
    this.pieces.push(whiteKnightRight);

    // White Bishops
    // Left Bishop
    let whiteBishopLeft = new Bishop(this, 'white', this.square[7][2]);
    this.pieces.push(whiteBishopLeft);

    // Right Bishop
    let whiteBishopRight = new Bishop(this, 'white', this.square[7][5]);
    this.pieces.push(whiteBishopRight);

    // White Queen
    let whiteQueen = new Queen(this, 'white', this.square[7][3]);
    this.pieces.push(whiteQueen);

    // White King
    let whiteKing = new King(this, 'white', this.square[7][4]);
    this.pieces.push(whiteKing)

    // _______________________________________
    // _______________________________________

    // Black pieces
    
    // Black Rooks
    // Left Rook
    let blackRookLeft = new Rook(this, 'black', this.square[0][0]);
    this.pieces.push(blackRookLeft);
    
    // Right Rook
    let blackRookRight = new Rook(this, 'black', this.square[0][7]);
    this.pieces.push(blackRookRight);
    
    
    // Black Knights
    // Left Knight
    let blackKnightLeft = new Knight(this, 'black', this.square[0][1]);
    this.pieces.push(blackKnightLeft);

    // Right Knight
    let blackKnightRight = new Knight(this, 'black', this.square[0][6]);
    this.pieces.push(blackKnightRight);

    // Black Bishops
    // Left Bishop
    let blackBishopLeft = new Bishop(this, 'black', this.square[0][2]);
    this.pieces.push(blackBishopLeft);

    // Right Bishop
    let blackBishopRight = new Bishop(this, 'black', this.square[0][5]);
    this.pieces.push(blackBishopRight);

    // Black Queen
    let blackQueen = new Queen(this, 'black', this.square[0][3]);
    this.pieces.push(blackQueen);
    
    // Black King
    let blackKing = new King(this, 'black', this.square[0][4]);
    this.pieces.push(blackKing)




    // Loop through the board
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            // if the board has not been initialized.
            if (this.square[i][j].data('piece') instanceof Piece) {
                this.board[i][j] = this.square[i][j].data('piece');
            }
        }
    }

    // Players
        // Create new players
        let player1 = new Player(this, 'white', 'White', this.pieces);
        let player2 = new Player(this, 'black', 'Black', this.pieces);

        // Push to players array.
        this.players.push(player1, player2);

        this.pieces.forEach(piece => {
            piece.updateLegalMoves(true);
        });
        
        // Call players to update their positions.
        this.players.forEach(player => {
            player.showPlayer();
            player.updatePosition();
        });
    }


    DrawPieces() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.board[i][j] instanceof Piece) {
                    this.board[i][j].Draw(this.square[i][j]);
                }
            }
        }
    }


    ShowLegalMoves(legalMoves) {

        // When a Piece is selected
        if (this.selectedPiece !== null) {

            // When a Piece is selected and another Piece is clicked
            if (!this.selectedPiece.clicked) {
                legalMoves.forEach(element => {
                    let chosenSquare = this.square[element.y][element.x];
                    chosenSquare.css('backgroundColor', 
                        chosenSquare.data('originalColor'));
                });
            }

            // When a Piece is selected.
            else if (this.selectedPiece.clicked) {
                legalMoves.forEach(element => {
                    let chosenSquare = this.square[element.y][element.x];

                    // tinyColor library
                    let originalColor = chosenSquare.data('originalColor');
                    let pinkColor;
        
                    if (originalColor === 'darkgray') {
                        pinkColor = tinycolor('hotpink').darken(10).toString();
                    }
                    else if (originalColor === 'lightgray') {
                        pinkColor = tinycolor('hotpink').lighten(10).toString();
                    }
        
                    let mixedColor = tinycolor.mix(originalColor, pinkColor, 20).toString();
                
                    chosenSquare.css('backgroundColor', mixedColor);
                });
            }
        }
        // When a Piece is deselected
        else if (this.selectedPiece === null) {
            legalMoves.forEach(element => {
                let chosenSquare = this.square[element.y][element.x];
                chosenSquare.css('backgroundColor', 
                    chosenSquare.data('originalColor'));
            });
        }
    }


    async CheckMate() {

        if (this.checkedKing) {
                        
            // Check if it is game over
            // Get my own pieces
            let myPieces = this.pieces.filter(piece => piece.color === this.checkedKing.color);

            // Map legal moves
            let allMoves = [];

            // A tuple like structure
            for (let piece of myPieces) {

                let legalPromises = piece.legalMoves.map(async (legalMove) => {
                    let inCheck = await piece.kingInCheck(piece.position, legalMove);
                    return {move: legalMove, inCheck: inCheck};
                });

                await Promise.all(legalPromises).then((result) => {
                    let legalMoves = piece.legalMoves.filter((move) => {
                        let moveResult = result.find((res) => res.move === move);
                        return moveResult && !moveResult.inCheck;
                    });
                    allMoves.push(...legalMoves)
                });
            }
            
            // If legalMoves length is 0 then it's Game over.
            if (allMoves.length === 0) {
                // Get opponent's Color
                let opponentColor = this.checkedKing.color === 'white' ? 'black' : 'white';
                this.GameOver(opponentColor);
            }
        }
    }


    // Attend to
    async isSquareUnderAttack(color, square) {
        // Get opponent's piece
        let opponent = this.pieces.filter(piece => piece.color !== color);
        // Opponent's legal moves
        let opponentMoves = (await Promise.all(opponent.map(async piece => {
            return piece.legalMoves;
        }))).flat();

        let isLegal = opponentMoves.some(move => {
            return square.some(square => {
                return move.x === square.x && move.y === square.y;
            });
        });
        if (isLegal) {
            return true;
        }
        else return false;
    }


    GameOver(color) {
        let gameOver = $("<div>");
        color = color.charAt(0).toUpperCase() + color.slice(1);
        gameOver.html(`<h1>Winner: ${color}</h1>`);
        gameOver.css({textAlign: 'center', padding: '1rem 2rem',
            margin: '1rem', background: '#EE11AA', border: '1px solid black', borderRadius: '1rem'});
        $('body').prepend(gameOver);

    }


    async copyBoard() {
        // Make an new Board instance
        let superBoard = new Board()

        // A new this.board 
        let copiedBoard = new Array(8).fill(null).map(() => new Array(8).fill(null));
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board.length; j++) {
                if (this.board[i][j] instanceof Piece) {

                    superBoard.board = copiedBoard;
                    // Copy pieces.
                    copiedBoard[i][j] = this.board[i][j].copy(superBoard);

                    // UPDATE THEIR POSITIONS;
                    copiedBoard[i][j].board.board = copiedBoard;
                }
                else if (this.board[i][j]) {
                    copiedBoard[i][j] = null;
                }
            }
        }

        return copiedBoard;
    }


    DOM() {
        // CSS style.
        let div = $('<div>');
        const WIDTH = '500px';
        div.css({display: 'flex', position: 'relative', flexWrap: 'wrap',
                width: WIDTH, height: WIDTH, border: '1px solid black',
                justifyContent: 'center', alignItems: 'center'
        });
        return div;
    }


    Game() {
        this.PrintBoard();
        this.StartingPosition();
        this.DrawPieces();
    }
}








// Main()
$('document').ready(() => {

    // Game
    let game = new Board;
    game.Game();
});