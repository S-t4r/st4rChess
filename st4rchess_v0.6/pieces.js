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
        this.coefficient;

        this.color === 'white'? this.coefficient = -1 : this.coefficient = 1;
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
        
        // Change piece's square
        this.makeMove(coordinates);
        piece.position = coordinates;
        piece.square = newPosition;

        // Update board
        piece.board.board[coordinates.y][coordinates.x] = piece;
        newPosition.data('piece', piece);

        // reDraw
        this.Draw(newPosition);

        this.board.pieces.forEach(async element => {
            // Change back legalMove squares 'background' after moving a Piece
            if (this.board.selectedPiece !== null) {
                let selected = this.board.selectedPiece.legalMoves;
                this.board.selectedPiece = null;
                this.board.ShowLegalMoves(selected);

            }
            
            // Update legal moves
            await element.updateLegalMoves(true);
        });
        // Change player turn
        if (!this.Turn()) {
            return;
        }
    }


    Capture(designation) {
        // Add to captured pieces array
        let capturingSquare = this.board.square[designation.y][designation.x];
        let capturingPiece = capturingSquare.data('piece');
        capturingPiece.exists = false;
        capturingSquare = this;

        this.board.capturedPieces.push(capturingPiece);
        this.board.players.forEach(player => {
            player.updatePosition(capturingPiece);
        });

        if (capturingSquare.square !== null) {
            capturingSquare.square.css({backgroundColor:
                capturingSquare.square.data('originalColor')});
        }

            // New pieces array after capture
            this.board.pieces = this.board.pieces.filter(piece => piece.exists)
    }


    // Use promises in here.
    async updateLegalMoves(flag = false) {
        // We need a base case.

        // Potential Positions
        let potentialPositions = this.calculatePotentialPositions();

        this.legalMoves.length = 0;
        if (this instanceof Pawn) this.captureMoves.length = 0;

        // Make sure the move is Legal
        let movePromises = potentialPositions.map(element => this.isLegalMove(element));

        // Wait for all Promises to be done
        let moveResults = await Promise.all(movePromises);

        moveResults.forEach((result, index) => {
            if (result) {

                // push to legalMoves
                this.legalMoves.push(potentialPositions[index]);
                
                // Pawn are unique!
                let target = this.board.board[potentialPositions[index].y][potentialPositions[index].x];
                if (this instanceof Pawn && target !== null) {
                    this.captureMoves.push(potentialPositions[index]);
                }

                // King in check.
                if (target instanceof King && target.color !== this.color) {
                    target.checked = true;
                    this.board.checkedKing = target;
                }
            }
        });
        // Remove duplicates
        this.legalMoves = Array.from(new Set(this.legalMoves.map(JSON.stringify))).map(JSON.parse);

        if (this instanceof Pawn) {
            this.captureMoves = Array.from(new Set(this.captureMoves.map(JSON.stringify))).map(JSON.parse);
        }


        // Maybe here at the end of this method we should call kingInCheck and pop any legalMove that 
        // is illegal.
        // But then I should have a flag.

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
                pieces.forEach(piece => {
                    let promises = piece.legalMoves.map(async (legalMove) => {
                        return await this.kingInCheck(piece.position, legalMove);
                    });

                    // Wait for all the promises to be complete.
                    Promise.all(promises).then((result) => {
                        piece.legalMoves = piece.legalMoves.filter((move, i) => !result[i])
                    });
                });
            }
        }
        return true;
    }


    makeMove(newPosition) {
        if (this.board.turn) {
            this.board.turn = false;
        }
        else if (!this.board.turn) {
            this.board.turn = true;
        }
        let boardSquare = this.board.square[newPosition.y][newPosition.x];
        this.hasMoved = true;
        if (boardSquare.data('piece') !== null) {
            this.Capture(newPosition);
        }
    }
    
    
    Turn() {
        // King
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
        // console.log(currentState);
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
        this.score = 1;
        this.captureMoves = [];
    }


    Draw(where) {
        // If the piece does not exist, create one.
        if (!this.exists) {
            this.exists = true;
            const Pawn = $('<div>');
            Pawn.css({
                position: 'absolute',
                left: `${this.position.x * 12.5}%`,
                top: `${this.position.y * 12.5}%`,
                width: '12.5%',
                height: '12.5%'
                });
    
            // SVG
            Pawn.load(`./svg/${this.color}Pawn.svg`, () => {
                Pawn.find('svg').css({
                    width: '100%',
                    height: '100%'
                });
            });
    
            // Listen for clicks
            Pawn.on('click', this.Select.bind(this));
            where.append(Pawn);
        }
        
        // If the piece already exists
        else if (this.exists) {
            // Load SVG
            this.square.load(`./svg/${this.color}Pawn.svg`, () => {
                this.square.find('svg').css({
                    width: '100%',
                    height: '100%'
                });
            });
            this.square.on('click', this.Select.bind(this));
            where.append(this);
        }
    }
    

    async isLegalMove(newPosition) {
        let isRegularMove = false;

        // First move
        if (!this.hasMoved) {
            if ((this.coefficient > 0 && newPosition.y - this.position.y === 1||
                this.coefficient < 0 && newPosition.y - this.position.y === -1) &&
                newPosition.x === this.position.x &&
                !(this.board.board[this.position.y + (1 * this.coefficient)]
                [this.position.x] instanceof Piece)) {
                isRegularMove = true;
            }

            if ((this.coefficient > 0 && newPosition.y - this.position.y === 2||
                this.coefficient < 0 && newPosition.y - this.position.y === -2) &&
                newPosition.x === this.position.x &&
                !(this.board.board[this.position.y + (2 * this.coefficient)]
            [this.position.x] instanceof Piece)) {
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

}


// Rook class
export class Rook extends Piece {
    constructor(board, color, square) {
        super(board, color, square);
        this.score = 5;
    }

    // CASTLING NEEDS DEFINING.

    Draw(where) {
        // If the piece does not exist, create one.
        if (!this.exists) {
            this.exists = true;
            const Rook = $('<div>');
            Rook.css({
                position: 'absolute',
                left: `${this.position.x * 12.5}%`,
                top: `${this.position.y * 12.5}%`,
                width: '12.5%',
                height: '12.5%'
                });
    
            // SVG
            Rook.load(`./svg/${this.color}Rook.svg`, () => {
                Rook.find('svg').css({
                    width: '100%',
                    height: '100%'
                });
            });
    
            // Listen for clicks
            Rook.on('click', this.Select.bind(this));
            where.append(Rook);
        }
        
        // If the piece already exists
        else if (this.exists) {
            // Load SVG
            this.square.load(`./svg/${this.color}Rook.svg`, () => {
                this.square.find('svg').css({
                    width: '100%',
                    height: '100%'
                });
            });
            this.square.on('click', this.Select.bind(this));
            where.append(this);
        }
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
        this.score = 3;
    }


    Draw(where) {
        // If the piece does not exist, create one.
        if (!this.exists) {
            this.exists = true;
            const Knight = $('<div>');
            Knight.css({
                position: 'absolute',
                left: `${this.position.x * 12.5}%`,
                top: `${this.position.y * 12.5}%`,
                width: '12.5%',
                height: '12.5%'
                });
    
            // SVG
            Knight.load(`./svg/${this.color}Knight.svg`, () => {
                Knight.find('svg').css({
                    width: '100%',
                    height: '100%'
                });
            });
    
            // Listen for clicks
            Knight.on('click', this.Select.bind(this));
            where.append(Knight);
        }
        
        // If the piece already exists
        else if (this.exists) {
            // Load SVG
            this.square.load(`./svg/${this.color}Knight.svg`, () => {
                this.square.find('svg').css({
                    width: '100%',
                    height: '100%'
                });
            });
            this.square.on('click', this.Select.bind(this));
            where.append(this);
        }
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
        this.score = 3;
    }


    Draw(where) {
        // If the piece does not exist, create one.
        if (!this.exists) {
            this.exists = true;
            const Bishop = $('<div>');
            Bishop.css({
                position: 'absolute',
                left: `${this.position.x * 12.5}%`,
                top: `${this.position.y * 12.5}%`,
                width: '12.5%',
                height: '12.5%'
                });
    
            // SVG
            Bishop.load(`./svg/${this.color}Bishop.svg`, () => {
                Bishop.find('svg').css({
                    width: '100%',
                    height: '100%'
                });
            });
    
            // Listen for clicks
            Bishop.on('click', this.Select.bind(this));
            where.append(Bishop);
        }
        
        // If the piece already exists
        else if (this.exists) {
            // Load SVG
            this.square.load(`./svg/${this.color}Bishop.svg`, () => {
                this.square.find('svg').css({
                    width: '100%',
                    height: '100%'
                });
            });
            this.square.on('click', this.Select.bind(this));
            where.append(this);
        }
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
        this.score = 9;
    }


    Draw(where) {
        // If the piece does not exist, create one.
        if (!this.exists) {
            this.exists = true;
            const Queen = $('<div>');
            Queen.css({
                position: 'absolute',
                left: `${this.position.x * 12.5}%`,
                top: `${this.position.y * 12.5}%`,
                width: '12.5%',
                height: '12.5%'
                });
    
            // SVG
            Queen.load(`./svg/${this.color}Queen.svg`, () => {
                Queen.find('svg').css({
                    width: '100%',
                    height: '100%'
                });
            });
    
            // Listen for clicks
            Queen.on('click', this.Select.bind(this));
            where.append(Queen);
        }
        
        // If the piece already exists
        else if (this.exists) {
            // Load SVG
            this.square.load(`./svg/${this.color}Queen.svg`, () => {
                this.square.find('svg').css({
                    width: '100%',
                    height: '100%'
                });
            });
            this.square.on('click', this.Select.bind(this));
            where.append(this);
        }
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
        this.checked = false;
    }


    Draw(where) {
        // If the piece does not exist, create one.
        if (!this.exists) {
            this.exists = true;
            const King = $('<div>');
            King.css({
                position: 'absolute',
                left: `${this.position.x * 12.5}%`,
                top: `${this.position.y * 12.5}%`,
                width: '12.5%',
                height: '12.5%'
                });
    
            // SVG
            King.load(`./svg/${this.color}King.svg`, () => {
                King.find('svg').css({
                    width: '100%',
                    height: '100%'
                });
            });
    
            // Listen for clicks
            King.on('click', this.Select.bind(this));
            where.append(King);
        }
        
        // If the piece already exists
        else if (this.exists) {
            // Load SVG
            this.square.load(`./svg/${this.color}King.svg`, () => {
                this.square.find('svg').css({
                    width: '100%',
                    height: '100%'
                });
            });
            this.square.on('click', this.Select.bind(this));
            where.append(this);
        }
    }
    

    async isLegalMove(newPosition) {
        let isRegularMove = false;


        // If king is in check
        if (!(await this.isMoveSafeForKing(newPosition))) {
            return false;
        }


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


    // This should be called after updateLegalMoves()
    async isMoveSafeForKing(newPosition) {

            await Promise.all(this.board.pieces.map(piece => {
                if (!(piece instanceof King)) {
                    return piece.updateLegalMoves();
                }
        }));
    
            // Store all the legal moves opponent can make.
            let allLegalMoves = [];
    
            // Get the opposite side pieces
            let pieces = this.board.pieces.filter(piece => piece !== null &&
                piece.color !== this.color);
    
            pieces.forEach(piece => {
                if (!(piece instanceof Pawn)) {
                    allLegalMoves.push(...piece.legalMoves);
                }
                else if (piece instanceof Pawn) {
                    allLegalMoves.push(...piece.captureMoves);
                }
            });
            
    
    
            let illegalKingMove = allLegalMoves.some(value => 
                value.y === newPosition.y && value.x === newPosition.x
            );
            if (illegalKingMove) return false;
    
            return true;
    }
    

}