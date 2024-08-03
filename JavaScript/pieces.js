export class Piece {
    constructor(board, color, square) {
        this.board = board;
        this.color = color;
        this.square = square;
        this.square.data('piece', this);

        this.position = {x: this.square.data('position').x, y: this.square.data('position').y};
        this.hasMoved = false;
        this.clicked = false;
        this.exists = false;
        this.legalMoves = [];
        this.captureMoves = [];
        this.coefficient;

        this.color === 'white'? this.coefficient = -1 : this.coefficient = 1;
    }


    Draw(where) {
        // If the piece does not exist, create one.
        if (!this.exists) {
            this.exists = true;
            const piece = $('<div>');
            piece.css({
                position: 'absolute',
                left: `${this.position.x * this.board.BOARDSIZE}%`,
                top: `${this.position.y * this.board.BOARDSIZE}%`,
                width: `${this.board.BOARDSIZE}%`,
                height: `${this.board.BOARDSIZE}%`
                });
    
            // SVG
            piece.load(`./svg/${this.color}${this.name}.svg`, () => {
                piece.find('svg').css({
                    width: '100%',
                    height: '100%'
                });
            });
    
            // Listen for clicks
            piece.on('click', this.Select.bind(this));
            where.append(piece);
        }
        
        // If the piece already exists
        else if (this.exists) {
            // Load SVG
            this.square.load(`./svg/${this.color}${this.name}.svg`, () => {
                this.square.find('svg').css({
                    width: '100%',
                    height: '100%'
                });
            });
            this.square.on('click', this.Select.bind(this));
            where.append(this);
        }
    }
    

    Move(piece, newPosition) {

        let coordinates = newPosition.data('position');
        

        // Check if is legal move
        if (!(piece.legalMoves.some(move => {;
            return move.x === coordinates.x && move.y === coordinates.y
        }))) {
            return;
        }

        // Old square data
        piece.square.css({backgroundColor: piece.square.data('originalColor')});
        piece.square.data('piece', null);
        piece.square.empty();
        piece.clicked = false;

        // Old position
        piece.board.board[piece.position.y][piece.position.x] = null;
        
        // Castling
        if (piece instanceof King && Math.abs(piece.position.x - coordinates.x) === 2) {
            piece.castling(coordinates.x);
        }

        // En-Passant
        // Check if the Pawn has moved 2 squares forward.
        if (this instanceof Pawn && Math.abs(this.position.y - coordinates.y) === 2) {
            // Check right and left squares.
            // Also check if they are withing bounds.

            // Left square
            let leftPawn;
            if (this.isWithinBounds({x: coordinates.x - 1, y: coordinates.y})) {
                leftPawn = this.board.board[coordinates.y][coordinates.x - 1];
            }

            // Right square
            let rightPawn;
            if (this.isWithinBounds({x: coordinates.x + 1, y: coordinates.y})) {
                rightPawn = this.board.board[coordinates.y][coordinates.x + 1];
            }

            // Left square has a Pawn in it.
            if (leftPawn instanceof Pawn) {
                leftPawn.enPassant(coordinates)
            }

            // Right square has a Pawn in it.
            if (rightPawn instanceof Pawn) {
                rightPawn.enPassant(coordinates);
            }
        }

        // Change piece's square
        this.makeMove(coordinates);
        piece.position = coordinates;
        piece.square = newPosition;

        // Update board
        piece.board.board[coordinates.y][coordinates.x] = piece;
        newPosition.data('piece', piece);

        // Promoting a Pawn
        // Check if the move has been made by the pawn and if it is the last square.
        if (this instanceof Pawn && this.position.y === 0 || this instanceof Pawn && this.position.y === 7)  {
            let piece;
            
            // Do until valid input
            do {
                // Prompt
                piece = prompt("Q/R/B/N)");

                // If user clicked on cancel provide a default value
                if (piece === null) {
                    piece = 'Q';
                    break;
                }

                // To upperCase
                piece = piece.toUpperCase();

                // Alert if invalid input
                if (piece !== 'Q' && piece !== 'R' && piece !== 'B' && piece !== 'N') {
                    alert("Invalid!!! Q for Queen, R for Rook, B for Bishop, N for Knight")
                }

                // Condition
            } while (piece !== 'Q' && piece !== 'R' && piece !== 'B' && piece !== 'N');

            // Promote
            this.promote(piece);
        }

        // reDraw
        this.Draw(newPosition);
        
        this.board.fifty++;

        this.board.pieces.forEach(async element => {
            // Change back legalMove squares 'background' after moving a Piece
            if (this.board.selectedPiece !== null) {
                let selected = this.board.selectedPiece.legalMoves;
                this.board.selectedPiece = null;
                this.board.ShowLegalMoves(selected);
            }

            // Update legal moves
            await element.updateLegalMoves(true);
            
            // Check for mate
            if (element instanceof King && element.checked) {
                element.board.CheckMate()
            }
        });
        // Fifty move rule
        if (this.board.fifty === 50) {
            this.board.GameOver('Draw');
            return;
        }


        // Change player turn
        if (!this.Turn(false)) {
            return;
        }
    }


    Capture(designation) {
        this.board.fifty = 0;
        // Add to captured pieces array
        let capturingSquare = this.board.square[designation.y][designation.x];
        let capturingPiece = capturingSquare.data('piece');
        capturingPiece.exists = false;
        capturingSquare.empty();

        this.board.capturedPieces.push(capturingPiece);
        this.board.players.forEach(player => {
            player.updatePosition(capturingPiece);
        });

            // New pieces array after capture
            this.board.pieces = this.board.pieces.filter(piece => piece.exists)
    }


    makeMove(newPosition) {
        // Change turn
        if (this.board.turn) {
            this.board.turn = false;
        }
        else if (!this.board.turn) {
            this.board.turn = true;
        }

        let boardSquare = this.board.square[newPosition.y][newPosition.x];
        this.hasMoved = true;
        // Capture move
        if (boardSquare.data('piece') !== null) {
            this.Capture(newPosition);
        }

        // En Passant
        else if (this instanceof Pawn && boardSquare.data('piece') === null) {

            // If color is 'white' and move is En Passant
            if (this.color === 'white' && 
            this.board.board[newPosition.y + 1][newPosition.x] instanceof Pawn) {
                this.Capture({x: newPosition.x, y: newPosition.y + 1})
            }

            // If color is 'black' and move is En Passant
            else if (this.color === 'black' && 
            this.board.board[newPosition.y - 1][newPosition.x] instanceof Pawn) {
                this.Capture({x: newPosition.x, y: newPosition.y - 1})
            }
        }
    }
    
    
    Turn() {
        // If a move had happen the king is not in check anymore.
        if (this.board.checkedKing) {
            this.board.checkedKing.checked = false;
            this.board.checkedKing = null;
        }
        
        if (this.color == 'white' && this.board.turn ||
            this.color == 'black' && !this.board.turn) {
            return true;
        }
        else {
            return false;
        }
    }


    Select() {
        // Check turn
        if (this.color === 'white' && !this.board.turn ||
            this.color === 'black' && this.board.turn) {
            return;
        }

        // Deselect the piece
        if (this.clicked && this.exists) {
            $(this.square).css({backgroundColor:
                this.square.data('originalColor')});
            
            let showOriginalColor = this.board.selectedPiece.legalMoves;
            this.clicked = false;
            this.board.selectedPiece = null;
            this.board.ShowLegalMoves(showOriginalColor);
            return;
        }

        // Selected piece is not null
        if (this.board.selectedPiece !== null && this.exists) {
            let showOriginalColor = this.board.selectedPiece.legalMoves;
            this.board.selectedPiece.clicked = false;
            this.board.ShowLegalMoves(showOriginalColor);
            
            $(this.board.selectedPiece.square).css({backgroundColor:
                this.board.selectedPiece.square.data('originalColor')});
                
        }

        // Select the piece
        if (!this.clicked && this.exists) {
            
            // Color mix
            let mixedColor = tinycolor.mix(this.square.data('originalColor'), 'darkblue', 20).toString();
        
            this.square.css({backgroundColor: mixedColor});
            this.clicked = true;
            this.board.selectedPiece = this;
            this.board.ShowLegalMoves(this.board.selectedPiece.legalMoves);
        }
    }

    
    isWithinBounds(position) {
        if (0 <= position.x && position.x < 8 && 0 <= position.y && position.y < 8) {
            return true;
        }
        else {
            return false;
        }
    }

    
    async updateLegalMoves(flag = false) {
        // We need a base case.

        // Potential Positions
        let potentialPositions = this.calculatePotentialPositions();

        this.legalMoves.length = 0;
        this.captureMoves.length = 0;

        // Make sure the move is Legal
        let movePromises = potentialPositions.map(element => this.isLegalMove(element));

        // Wait for all Promises to be done
        let moveResults = await Promise.all(movePromises);

        // If king is in check castling is not allowed.
        let kingIsInCheck;
        if (flag) {
            kingIsInCheck = await this.kingInCheck(this.position, this.position)
        }
        moveResults.forEach((result, index) => {
            if (result) {

                // Push to legalMoves
                this.legalMoves.push(potentialPositions[index]);
                
                let target = this.board.board[potentialPositions[index].y][potentialPositions[index].x];
                
                // Capture moves
                if (this instanceof Piece && target !== null) {
                    this.captureMoves.push(potentialPositions[index]);
                }

                // King in check.
                if (target instanceof King && target.color !== this.color) {
                    target.checked = true;
                    this.board.checkedKing = target;
                }

                // Castling
                if (this instanceof King && !this.hasMoved) {
                    if (!kingIsInCheck) {
                        this.castlingMoves();
                    }
                }
            }
        });
        // Remove duplicates
        this.legalMoves = Array.from(new Set(this.legalMoves.map(JSON.stringify))).map(JSON.parse);

        // Capture moves.
        this.captureMoves = Array.from(new Set(this.captureMoves.map(JSON.stringify))).map(JSON.parse);


        if (flag) {

            // Choose the array of same side pieces
            let pieces = [];
            if (this.board.turn) {
                // Filter
                if (this instanceof Piece && this.color === 'white') {
                    pieces = this.board.pieces.filter(piece => piece.color === this.color);
                }
            }
            // Filter
            else if (this instanceof Piece && !this.board.turn) {
                if (this.color === 'black') {
                    pieces = this.board.pieces.filter(piece => piece.color === this.color);
                }
            }

            // If not undefined, proceed.
            if (pieces) {
                for (let piece of pieces) {

                    // A tuple like structure
                    let legalPromises = piece.legalMoves.map(async (legalMove) => {
                        let inCheck = await this.kingInCheck(piece.position, legalMove);
                        return {move: legalMove, inCheck: inCheck};
                    });

                    // A tuple like structure
                    let capturePromises = piece.captureMoves.map(async (captureMove) => {
                        let inCheck = await this.kingInCheck(piece.position, captureMove);
                        return {move: captureMove, inCheck: inCheck};
                    });
                    
                    // Wait for all the promises to be complete.
                    let allPromises = await legalPromises.concat(capturePromises);
                    

                    Promise.all(allPromises).then((result) => {

                        piece.legalMoves = piece.legalMoves.filter((move) => {
                            let moveResult = result.find((res) => res.move === move);
                            return moveResult && !moveResult.inCheck;
                        });
                    });
                };
            };
        }
        return true;
    }
    

    async kingInCheck(originalPosition, potentialPositions) {

        // 1. Copy the current game state.
        let currentState = await this.board.copyBoard();
        let pieceToMove = currentState[originalPosition.y][originalPosition.x];
        let king;
        let opponentsPiecesMoves = [];

        
        // 2. Simulate the move.
        
        // Empty old position
        currentState[originalPosition.y][originalPosition.x] = null;
        
        // Move the piece
        pieceToMove.position = potentialPositions;
        currentState[potentialPositions.y][potentialPositions.x] = pieceToMove;

        // Go through the board and get opponent's pieces
        for (let i = 0; i < currentState[0].length; i++) {
            for (let j = 0; j < currentState[0].length; j++) {
                let piece = currentState[i][j];
                if (piece instanceof Piece) {

                    // Update each Piece's legalMoves
                    piece.board.board = currentState;
                    await piece.updateLegalMoves();

                    if (piece.color !== pieceToMove.color) {
                        opponentsPiecesMoves.push(...piece.legalMoves);
                    }

                    // Position of our King
                    if (piece instanceof King && piece.color === pieceToMove.color) {
                        king = piece;
                    }
                }
            }   
        }

        // loop through opponent's pieces
        for (let i = 0; i < opponentsPiecesMoves.length; i++) {
            let opponentMove = currentState[opponentsPiecesMoves[i].y][opponentsPiecesMoves[i].x];
            // 3. Check if the King is in check after the move.
            if (opponentMove === king) {
                // King is in check
                return true;
            }
        }

        return false;
    }


    copy(copiedBoard) {
        let newSquare = $("<div>").data({ 
            piece: this.square.data('piece'), 
            originalColor: this.square.data('originalColor'), 
            position: { ...this.square.data('position') } 
        });
        return new this.constructor(copiedBoard, this.color, newSquare);
    }

}


// Pawn class
export class Pawn extends Piece {
    constructor(board, color, square) {
        super(board, color, square);
        this.name = 'Pawn';
        this.score = 1;
    }


    async isLegalMove(newPosition) {
        let isRegularMove = false;

        // First move
        if (!this.hasMoved) {
            if (this.board.board[this.position.y + (1 * this.coefficient)][this.position.x] instanceof Piece) {
                return false;
            }
            if ((this.coefficient > 0 && newPosition.y - this.position.y === 1||
                this.coefficient < 0 && newPosition.y - this.position.y === -1) &&
                newPosition.x === this.position.x) {
                isRegularMove = true;
            }

            if (this.board.board[this.position.y + (2 * this.coefficient)][this.position.x] instanceof Piece) {
                return false;
            }
            if ((this.coefficient > 0 && newPosition.y - this.position.y === 2||
                this.coefficient < 0 && newPosition.y - this.position.y === -2) &&
                newPosition.x === this.position.x) {
                isRegularMove = true;
            }
        }

        
        // Not first move
        else if (this.hasMoved) {
            if ((this.coefficient > 0 && newPosition.y - this.position.y === 1||
                this.coefficient < 0 && newPosition.y - this.position.y === -1) &&
                newPosition.x === this.position.x &&
                !(this.board.board[this.position.y + (1 * this.coefficient)]
                [this.position.x] instanceof Piece)) {
                isRegularMove = true;
            }
        }



        // Check diagonally in front for CAPTURE
        if (Math.abs(newPosition.y - (this.position.y)) === 1 &&
        Math.abs(newPosition.x - (this.position.x)) === 1 &&
        this.board.board[newPosition.y][newPosition.x] !== null &&
        this.board.board[newPosition.y][newPosition.x].color !== this.color) {
            return true;
        }

        return isRegularMove;
    }


    calculatePotentialPositions() {
        // Return value
        let potentialPositions = [];
        

        // White Pawns
        // First move
        if (!this.hasMoved) {
            let firstMove = {x: this.position.x, y: this.position.y + (2 * this.coefficient) };
            let front = {x: this.position.x, y: this.position.y + (1 * this.coefficient)};
            
            if (this.isWithinBounds(firstMove)) {
                potentialPositions.push(firstMove);
            }

            if (this.isWithinBounds(front)) {
                potentialPositions.push(front);
            }
        }

        // Has moved
        else if (this.hasMoved) {
            let front = {x: this.position.x, y: this.position.y + (1 * this.coefficient)};
            if (this.isWithinBounds(front)) {
                potentialPositions.push(front);
            }
        }



        // Pawns captures
        let diagonalLeft = {x: this.position.x + (1 * this.coefficient), y: this.position.y + (1 * this.coefficient)};
        let diagonalRight = {x: this.position.x - (1 * this.coefficient), y: this.position.y + (1 * this.coefficient)};
        
        // Left diagonal
        if (this.isWithinBounds(diagonalLeft)) {
            if (this.board.board[diagonalLeft.y][diagonalLeft.x] !== null &&
            this.board.board[diagonalLeft.y][diagonalLeft.x].color !== this.color) {
                potentialPositions.push(diagonalLeft);
            }
        }

        // // Right diagonal
        if (this.isWithinBounds(diagonalRight)) {
            if (this.board.board[diagonalRight.y][diagonalRight.x] !== null &&
            this.board.board[diagonalRight.y][diagonalRight.x].color !== this.color) {
                    potentialPositions.push(diagonalRight);
            }
        }


        return potentialPositions;
    }


    async enPassant(position) {
        await this.updateLegalMoves()
        if (this.color === 'white') {
            this.legalMoves.push({x: position.x, y: Math.abs(position.y - 1)});
        }
        else if (this.color === 'black') {
            this.legalMoves.push({x: position.x, y: Math.abs(position.y + 1)});
        }
    }


    promote(piece) {
        let tempPiece;
        switch (piece) {
            // Queen
            case 'Q':
                tempPiece = new Queen(this.board, this.color, this.square);
                this.name = tempPiece.name;
                this.score = tempPiece.score;
                break;

            // Rook
            case 'R':
                tempPiece = new Rook(this.board, this.color, this.square);
                this.name = tempPiece.name;
                this.score = tempPiece.score;
                break;

            // Bishop
            case 'B':
                tempPiece = new Bishop(this.board, this.color, this.square);
                this.name = tempPiece.name;
                this.score = tempPiece.score;
                break;
            
            // Knight
            case 'N':
                tempPiece = new Knight(this.board, this.color, this.square);
                this.name = tempPiece.name;
                this.score = tempPiece.score;
                break;
        }


        this.isLegalMove = tempPiece.isLegalMove;
        this.calculatePotentialPositions = tempPiece.calculatePotentialPositions;
        this.enPassant = null;
    }
}


// Rook class
export class Rook extends Piece {
    constructor(board, color, square) {
        super(board, color, square);
        this.name = 'Rook';
        this.score = 5;
    }

    // CASTLING NEEDS DEFINING.

    async isLegalMove(newPosition) {
        let isRegularMove = false;

        // X's
        if (newPosition.x === this.position.x) {
            // To check the path from this.position to n - 1
            let isPathClear = true;

            // Check from smallest y to biggest y.
            for (let i = Math.min(this.position.y, newPosition.y) + 1; i < Math.max(this.position.y, newPosition.y); i++) {
                let thisSquare = this.board.board[i][newPosition.x];

                // If there is a piece in between Path is not clear.
                if (thisSquare instanceof Piece && 
                thisSquare !== this.board.board[this.position.y][this.position.x]) {
                    isPathClear = false;
                    return false;
                }

            }
            // If Path clear then capture is allowed
            if (this.board.board[newPosition.y][newPosition.x] !== null &&
            this.board.board[newPosition.y][newPosition.x].color !== this.color && isPathClear) {
                return true;
            }
            if (!isPathClear) return false;
            // If no captures, then return false.
            isRegularMove = true;
        }

        // y's
        if (newPosition.y === this.position.y) {
            // To check the path from this.position to n - 1
            let isPathClear = true;

            // Check from smallest y to biggest y.
            for (let i = Math.min(this.position.x, newPosition.x) + 1; i < Math.max(this.position.x, newPosition.x); i++) {
                let thisSquare = this.board.board[newPosition.y][i];

                // If there is a piece in between Path is not clear.
                if (thisSquare instanceof Piece && 
                thisSquare !== this.board.board[this.position.y][this.position.x]) {
                    isPathClear = false;
                    return false;
                }

            }
            // If Path clear then capture is allowed
            if (this.board.board[newPosition.y][newPosition.x] !== null &&
            this.board.board[newPosition.y][newPosition.x].color !== this.color && isPathClear) {
                return true;
            }

            if (!isPathClear) return false;

            // If no captures and path is clear then return true.
            isRegularMove = true;
        }
        return isRegularMove;
    }


    calculatePotentialPositions() {
        // Return value
        let potentialPositions = [];

        // Up, down, left, right
        let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
        
        // First move
        // if (!this.hasMoved) {
            directions.forEach(element => {
                for (let i = 1; i < this.board.board[0].length; i++) {

                    // Loop through the board and directions 
                    let checkMove = {x: this.position.x + i * element[0], y: this.position.y + i * element[1]}

                    // Check if it's on the board
                    if(this.isWithinBounds(checkMove)) {
                        potentialPositions.push(checkMove);
                        // Check if square is empty
                        if (this.board.board[checkMove.y][checkMove.x] !== null) {
                            
                            // Can't move on same color piece
                            if (this.board.board[checkMove.y][checkMove.x].color === this.color) {
                                potentialPositions.pop(checkMove);
                            }
                            break;
                        }
                    }
                }
            });
        // }

        // Has moved
        // else if (this.hasMoved) {

        // }

        return potentialPositions;
    }

}


// Knight class
export class Knight extends Piece {
    constructor(board, color, square) {
        super(board, color, square);
        this.name = 'Knight';
        this.score = 3;
    }


    async isLegalMove(newPosition) {
        let isRegularMove = false;
        let thisSquare = this.board.board[newPosition.y][newPosition.x];
        if (thisSquare !== null && thisSquare.color === this.color) {
            return false;
        }
        else isRegularMove = true

        return isRegularMove;
    }


    calculatePotentialPositions() {
        // Return value
        let potentialPositions = [];

        // 8 possible moves
        let directions = [[1, 2], [2, 1], [2, -1], [1, -2],
        [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
        
        directions.forEach(element => {
            // Calculate potential position by adding direction to current position.
            let newPosition = {x: this.position.x + element[0], y: this.position.y + element[1]}

            // If potential position is on board.
            if (this.isWithinBounds(newPosition)) {

                // Push to potentialPositions.
                potentialPositions.push(newPosition);
            }

        });
        return potentialPositions;
    }

}


// Bishop class
export class Bishop extends Piece {
    constructor(board, color, square) {
        super(board, color, square);
        this.name = 'Bishop';
        this.score = 3;
    }


    async isLegalMove(newPosition) {
        let isRegularMove = false;
        // Check if it's on the diagonal
        if (Math.abs(this.position.y - newPosition.y) !==
        Math.abs(this.position.x - newPosition.x)) {
            return false;
        }
        
        // Check if there's a piece in between.

        // Up right 
        if (newPosition.x > this.position.x && newPosition.y < this.position.y) {
            // X+ Y-
            for (let i = this.position.x, j = this.position.y; i < newPosition.x; i++, j--) {
                let thisSquare = this.board.board[j][i];
                let isPathClear = true;

                if (thisSquare instanceof Piece && 
                thisSquare !== this.board.board[this.position.y][this.position.x]) {    
                    isPathClear = false;
                    // Check for captures
                    if (this.board.board[newPosition.y][newPosition.x] !== null &&
                    this.board.board[newPosition.y][newPosition.x].color !== this.color && isPathClear) {
                        return true;
                    }                                                    
                    return false;
                }
                else isRegularMove = true;
            }
        }
        
        // Down right
        else if (newPosition.x > this.position.x && newPosition.y > this.position.y) {
            // X+ Y+
            for (let i = this.position.x, j = this.position.y; i < newPosition.x; i++, j++) {
                let thisSquare = this.board.board[j][i];
                let isPathClear = true;

                if (thisSquare instanceof Piece && 
                thisSquare !== this.board.board[this.position.y][this.position.x]) {    
                    isPathClear = false;
                    // Check for captures
                    if (this.board.board[newPosition.y][newPosition.x] !== null &&
                    this.board.board[newPosition.y][newPosition.x].color !== this.color && isPathClear) {
                        return true;
                    }                                                    
                    return false;
                }
                else isRegularMove = true;
            }
        }

        // Down left
        else if (newPosition.x < this.position.x && newPosition.y > this.position.y) {
            // X- Y+
            for (let i = this.position.x, j = this.position.y; i > newPosition.x; i--, j++) {
                let thisSquare = this.board.board[j][i];
                let isPathClear = true;

                if (thisSquare instanceof Piece && 
                thisSquare !== this.board.board[this.position.y][this.position.x]) {
                    isPathClear = false;
                    // Check for captures
                    if (this.board.board[newPosition.y][newPosition.x] !== null &&
                    this.board.board[newPosition.y][newPosition.x].color !== this.color&& isPathClear) {
                        return true;
                    }                                                    
                    return false;
                }
                else isRegularMove = true;
            }
        }
        
        // Up left
        else if (newPosition.x < this.position.x && newPosition.y < this.position.y) {
            // X- Y-
            for (let i = this.position.x, j = this.position.y; i > newPosition.x; i--, j--) {
                let thisSquare = this.board.board[j][i];
                let isPathClear = true;

                if (thisSquare instanceof Piece && 
                thisSquare !== this.board.board[this.position.y][this.position.x]) {    
                    isPathClear = false;
                    // Check for captures
                    if (this.board.board[newPosition.y][newPosition.x] !== null &&
                    this.board.board[newPosition.y][newPosition.x].color !== this.color && isPathClear) {
                        return true;
                    }                                                    
                    return false;
                }
                else isRegularMove = true;
            }
        }


        return isRegularMove;
    }


    calculatePotentialPositions() {
        // Return value
        let potentialPositions = [];

        // Diagonal move
        let directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        
        directions.forEach(element => {
            for (let i = 1; i < this.board.board[0].length; i++) {

                // Loop through the board and directions 
                let checkMove = {x: this.position.x + i * element[0], y: this.position.y + i * element[1]}

                // Check if it's on the board
                if(this.isWithinBounds(checkMove)) {
                    potentialPositions.push(checkMove);
                    // Check if square is empty
                    if (this.board.board[checkMove.y][checkMove.x] !== null) {
                        
                        // Can't move on same color piece
                        if (this.board.board[checkMove.y][checkMove.x].color === this.color) {
                            potentialPositions.pop(checkMove);
                        }
                        break;
                    }
                }
            }
        });
        return potentialPositions;
    }
}


// Queen class
export class Queen extends Piece {
    constructor(board, color, square) {
        super(board, color, square);
        this.name = 'Queen';
        this.score = 9;
    }
 

    async isLegalMove(newPosition) {
        let isRegularMove = false;

        // X's
        if (newPosition.x === this.position.x) {
            // To check the path from this.position to n - 1
            let isPathClear = true;

            // Check from smallest y to biggest y.
            for (let i = Math.min(this.position.y, newPosition.y) + 1; i < Math.max(this.position.y, newPosition.y); i++) {
                let thisSquare = this.board.board[i][newPosition.x];

                // If there is a piece in between Path is not clear.
                if (thisSquare instanceof Piece && 
                thisSquare !== this.board.board[this.position.y][this.position.x]) {
                    isPathClear = false;
                    return false;
                }

            }
            // If Path clear then capture is allowed
            if (this.board.board[newPosition.y][newPosition.x] !== null &&
            this.board.board[newPosition.y][newPosition.x].color !== this.color && isPathClear) {
                return true;
            }
            if (!isPathClear) return false;
            // If no captures, then return false.
            isRegularMove = true;
        }

        // y's
        if (newPosition.y === this.position.y) {
            // To check the path from this.position to n - 1
            let isPathClear = true;

            // Check from smallest y to biggest y.
            for (let i = Math.min(this.position.x, newPosition.x) + 1; i < Math.max(this.position.x, newPosition.x); i++) {
                let thisSquare = this.board.board[newPosition.y][i];

                // If there is a piece in between Path is not clear.
                if (thisSquare instanceof Piece && 
                thisSquare !== this.board.board[this.position.y][this.position.x]) {
                    isPathClear = false;
                    return false;
                }

            }
            // If Path clear then capture is allowed
            if (this.board.board[newPosition.y][newPosition.x] !== null &&
            this.board.board[newPosition.y][newPosition.x].color !== this.color && isPathClear) {
                return true;
            }

            if (!isPathClear) return false;

            // If no captures and path is clear then return true.
            isRegularMove = true;
        }
        if (isRegularMove) return true;


        // DIAGONAL MOVE


        // Check if it's on the diagonal
        if (Math.abs(this.position.y - newPosition.y) !==
        Math.abs(this.position.x - newPosition.x)) {
            return false;
        }
        
        // Check if there's a piece in between.

        // Up right 
        if (newPosition.x > this.position.x && newPosition.y < this.position.y) {
            // X+ Y-
            for (let i = this.position.x, j = this.position.y; i < newPosition.x; i++, j--) {
                let thisSquare = this.board.board[j][i];
                let isPathClear = true;
                if (thisSquare instanceof Piece && 
                thisSquare !== this.board.board[this.position.y][this.position.x]) {    
                    isPathClear = false;
                    // Check for captures
                    if (this.board.board[newPosition.y][newPosition.x] !== null &&
                    this.board.board[newPosition.y][newPosition.x].color !== this.color && isPathClear) {
                        return true;
                    }                                                    
                    return false;
                }
                else isRegularMove = true;
            }
        }
        
        // Down right
        else if (newPosition.x > this.position.x && newPosition.y > this.position.y) {
            // X+ Y+
            for (let i = this.position.x, j = this.position.y; i < newPosition.x; i++, j++) {
                let thisSquare = this.board.board[j][i];
                let isPathClear = true;

                if (thisSquare instanceof Piece && 
                thisSquare !== this.board.board[this.position.y][this.position.x]) {    
                    isPathClear = false;
                    // Check for captures
                    if (this.board.board[newPosition.y][newPosition.x] !== null &&
                    this.board.board[newPosition.y][newPosition.x].color !== this.color && isPathClear) {
                        return true;
                    }                                                    
                    return false;
                }
                else isRegularMove = true;
            }
        }

        // Down left
        else if (newPosition.x < this.position.x && newPosition.y > this.position.y) {
            // X- Y+
            for (let i = this.position.x, j = this.position.y; i > newPosition.x; i--, j++) {
                let thisSquare = this.board.board[j][i];
                let isPathClear = true;

                if (thisSquare instanceof Piece && 
                thisSquare !== this.board.board[this.position.y][this.position.x]) {
                    isPathClear = false;
                    // Check for captures
                    if (this.board.board[newPosition.y][newPosition.x] !== null &&
                    this.board.board[newPosition.y][newPosition.x].color !== this.color&& isPathClear) {
                        return true;
                    }                                                    
                    return false;
                }
                else isRegularMove = true;
            }
        }
        
        // Up left
        else if (newPosition.x < this.position.x && newPosition.y < this.position.y) {
            // X- Y-
            for (let i = this.position.x, j = this.position.y; i > newPosition.x; i--, j--) {
                let thisSquare = this.board.board[j][i];
                let isPathClear = true;

                if (thisSquare instanceof Piece && 
                thisSquare !== this.board.board[this.position.y][this.position.x]) {    
                    isPathClear = false;
                    // Check for captures
                    if (this.board.board[newPosition.y][newPosition.x] !== null &&
                    this.board.board[newPosition.y][newPosition.x].color !== this.color && isPathClear) {
                        return true;
                    }                                                    
                    return false;
                }
                else isRegularMove = true;
            }
        }


        return isRegularMove;
    }


    calculatePotentialPositions() {
        // Return value
        let potentialPositions = [];

        // Diagonal && Up, Down, Left, Right
        let directions = [[1, 1], [1, -1], [-1, 1], [-1, -1], [-1, 0], [1, 0], [0, -1], [0, 1]];
        
        directions.forEach(element => {
            for (let i = 1; i < this.board.board[0].length; i++) {

                // Loop through the board and directions 
                let checkMove = {x: this.position.x + i * element[0], y: this.position.y + i * element[1]}

                // Check if it's on the board
                if(this.isWithinBounds(checkMove)) {
                    potentialPositions.push(checkMove);
                    // Check if square is empty
                    if (this.board.board[checkMove.y][checkMove.x] !== null) {
                        
                        // Can't move on same color piece
                        if (this.board.board[checkMove.y][checkMove.x].color === this.color) {
                            potentialPositions.pop(checkMove);
                        }
                        break;
                    }
                }
            }
        });
        return potentialPositions;
    }
}


// King class
export class King extends Piece {
    constructor(board, color, square) {
        super(board, color, square);
        this.name = 'King';
        this.checked = false;
        this.score = 200;
    }


    async isLegalMove(newPosition) {
        let isRegularMove = false;


        // X's
        if (newPosition.x === this.position.x) {
            // To check the path from this.position to n - 1
            let isPathClear = true;

            // Check from smallest y to biggest y.
            for (let i = Math.min(this.position.y, newPosition.y) + 1; i < Math.max(this.position.y, newPosition.y); i++) {
                let thisSquare = this.board.board[i][newPosition.x];

                // If there is a piece in between Path is not clear.
                if (thisSquare instanceof Piece && 
                thisSquare !== this.board.board[this.position.y][this.position.x]) {
                    isPathClear = false;
                    return false;
                }

            }
            // If Path clear then capture is allowed
            if (this.board.board[newPosition.y][newPosition.x] !== null &&
            this.board.board[newPosition.y][newPosition.x].color !== this.color && isPathClear) {
                return true;
            }
            if (!isPathClear) return false;
            // If no captures, then return false.
            isRegularMove = true;
        }

        // y's
        if (newPosition.y === this.position.y) {
            // To check the path from this.position to n - 1
            let isPathClear = true;

            // Check from smallest y to biggest y.
            for (let i = Math.min(this.position.x, newPosition.x) + 1; i < Math.max(this.position.x, newPosition.x); i++) {
                let thisSquare = this.board.board[newPosition.y][i];

                // If there is a piece in between Path is not clear.
                if (thisSquare instanceof Piece && 
                thisSquare !== this.board.board[this.position.y][this.position.x]) {
                    isPathClear = false;
                    return false;
                }

            }
            // If Path clear then capture is allowed
            if (this.board.board[newPosition.y][newPosition.x] !== null &&
            this.board.board[newPosition.y][newPosition.x].color !== this.color && isPathClear) {
                return true;
            }

            if (!isPathClear) return false;

            // If no captures and path is clear then return true.
            isRegularMove = true;
        }
        if (isRegularMove) return true;


        // DIAGONAL MOVE


        // Check if it's on the diagonal
        if (Math.abs(this.position.y - newPosition.y) !==
        Math.abs(this.position.x - newPosition.x)) {
            return false;
        }
        
        // Check if there's a piece in between.

        // Up right 
        if (newPosition.x > this.position.x && newPosition.y < this.position.y) {
            // X+ Y-
            for (let i = this.position.x, j = this.position.y; i < newPosition.x; i++, j--) {
                let thisSquare = this.board.board[j][i];
                let isPathClear = true;
                if (thisSquare instanceof Piece && 
                thisSquare !== this.board.board[this.position.y][this.position.x]) {    
                    isPathClear = false;
                    // Check for captures
                    if (this.board.board[newPosition.y][newPosition.x] !== null &&
                    this.board.board[newPosition.y][newPosition.x].color !== this.color && isPathClear) {
                        return true;
                    }                                                    
                    return false;
                }
                else isRegularMove = true;
            }
        }
        
        // Down right
        else if (newPosition.x > this.position.x && newPosition.y > this.position.y) {
            // X+ Y+
            for (let i = this.position.x, j = this.position.y; i < newPosition.x; i++, j++) {
                let thisSquare = this.board.board[j][i];
                let isPathClear = true;

                if (thisSquare instanceof Piece && 
                thisSquare !== this.board.board[this.position.y][this.position.x]) {    
                    isPathClear = false;
                    // Check for captures
                    if (this.board.board[newPosition.y][newPosition.x] !== null &&
                    this.board.board[newPosition.y][newPosition.x].color !== this.color && isPathClear) {
                        return true;
                    }                                                    
                    return false;
                }
                else isRegularMove = true;
            }
        }

        // Down left
        else if (newPosition.x < this.position.x && newPosition.y > this.position.y) {
            // X- Y+
            for (let i = this.position.x, j = this.position.y; i > newPosition.x; i--, j++) {
                let thisSquare = this.board.board[j][i];
                let isPathClear = true;

                if (thisSquare instanceof Piece && 
                thisSquare !== this.board.board[this.position.y][this.position.x]) {
                    isPathClear = false;
                    // Check for captures
                    if (this.board.board[newPosition.y][newPosition.x] !== null &&
                    this.board.board[newPosition.y][newPosition.x].color !== this.color&& isPathClear) {
                        return true;
                    }                                                    
                    return false;
                }
                else isRegularMove = true;
            }
        }
        
        // Up left
        else if (newPosition.x < this.position.x && newPosition.y < this.position.y) {
            // X- Y-
            for (let i = this.position.x, j = this.position.y; i > newPosition.x; i--, j--) {
                let thisSquare = this.board.board[j][i];
                let isPathClear = true;

                if (thisSquare instanceof Piece && 
                thisSquare !== this.board.board[this.position.y][this.position.x]) {    
                    isPathClear = false;
                    // Check for captures
                    if (this.board.board[newPosition.y][newPosition.x] !== null &&
                    this.board.board[newPosition.y][newPosition.x].color !== this.color && isPathClear) {
                        return true;
                    }                                                    
                    return false;
                }
                else isRegularMove = true;
            }
        }



        return isRegularMove;
    }


    calculatePotentialPositions() {
        // Return value
        let potentialPositions = [];

        // Diagonal && Up, Down, Left, Right
        let directions = [[1, 1], [1, -1], [-1, 1], [-1, -1], [-1, 0], [1, 0], [0, -1], [0, 1]];
        
        directions.forEach(element => {

            // Loop through the board and directions 
            let checkMove = {x: this.position.x + element[0], y: this.position.y + element[1]}

            // Check if it's on the board
            if(this.isWithinBounds(checkMove)) {
                potentialPositions.push(checkMove);
                // Check if square is empty
                if (this.board.board[checkMove.y][checkMove.x] !== null) {
                    
                    // Can't move on same color piece
                    if (this.board.board[checkMove.y][checkMove.x].color === this.color) {
                        potentialPositions.pop(checkMove);
                    }
                }
            }
        });
        return potentialPositions;
    }


    castlingMoves() {
        // Filter
        let rooks = this.board.pieces.filter(piece => piece.color === this.color &&
            piece instanceof Rook && !piece.hasMoved);

            let castling;
            rooks.forEach(rook => {
                // See if there is a piece in between.
                
                // Check from smallest x to biggest x.
                for (let i = Math.min(this.position.x, rook.position.x) + 1;
                i < Math.max(this.position.x, rook.position.x); i++) {
                    // Loop through the array
                    let thisSquare = this.board.board[this.position.y][i];

                    // If there is a piece in between Path is not clear.
                    if (thisSquare instanceof Piece && 
                    thisSquare !== this.board.board[this.position.y][this.position.x]) {
                        return false;
                    }
                    castling = true;
                }
                // Castling rights.
                if (castling) {
                    // If rook is on the king's left.
                    // Queen side castling
                    if (this.position.x > rook.position.x) {
                        let leftCastle = {x: this.position.x - 2, y: this.position.y};
                        if (!this.legalMoves.some(position => position.x === leftCastle.x &&
                            position.y === leftCastle.y)) {
                                this.legalMoves.push(leftCastle);
                        }
                    }
            
                    // If rook is on the king's right.
                    // King side castling
                    if (this.position.x < rook.position.x) {
                        let rightCastle = {x: this.position.x + 2, y: this.position.y};
                        if (!this.legalMoves.some(position => position.x === rightCastle.x &&
                            position.y === rightCastle.y)) {
                                this.legalMoves.push(rightCastle);
                        }
                    }
                }

            });

        // for each square between King and Rook:
        //     if square is not empty:
        //         return false (or handle it appropriately)
    }

    
    castling(x) {
        // King's side castling
        if (this.position.x - x === -2) {
            let rightRook = this.board.pieces.filter(piece => piece.color === this.color &&
            piece instanceof Rook && !piece.hasMoved && piece.position.x > this.position.x);
            
            // Change Rook's position;
            // Old square
            rightRook[0].square.data('piece', null);
            rightRook[0].square.empty();
            rightRook[0].hasMoved = true;
            
            // Old position
            rightRook[0].board.board[rightRook[0].position.y][rightRook[0].position.x] = null;

            // Update Rook's square
            rightRook[0].position.x = this.position.x + 1;
            rightRook[0].square = rightRook[0].board.square[rightRook[0].position.y][rightRook[0].position.x];

            // Update board
            rightRook[0].board.board[rightRook[0].position.y][rightRook[0].position.x] = rightRook[0];
            rightRook[0].board.square[rightRook[0].position.y][rightRook[0].position.x].data('piece', rightRook[0]);

            // Redraw
            rightRook[0].Draw(rightRook[0].board.square[rightRook[0].position.y][rightRook[0].position.x]);
        }

        // Queen's side castling
        else if (this.position.x - x === 2) {
            let leftRook = this.board.pieces.filter(piece => piece.color === this.color &&
            piece instanceof Rook && !piece.hasMoved && piece.position.x < this.position.x);

            // Change Rook's position;
            // Old square
            leftRook[0].square.data('piece', null);
            leftRook[0].square.empty();
            leftRook[0].hasMoved = true;
            
            // Old position
            leftRook[0].board.board[leftRook[0].position.y][leftRook[0].position.x] = null;

            // Update Rook's square
            leftRook[0].position.x = this.position.x - 1;
            leftRook[0].square = leftRook[0].board.square[leftRook[0].position.y][leftRook[0].position.x];

            // Update board
            leftRook[0].board.board[leftRook[0].position.y][leftRook[0].position.x] = leftRook[0];
            leftRook[0].board.square[leftRook[0].position.y][leftRook[0].position.x].data('piece', leftRook[0]);

            // Redraw
            leftRook[0].Draw(leftRook[0].board.square[leftRook[0].position.y][leftRook[0].position.x]);
        }
    }
}