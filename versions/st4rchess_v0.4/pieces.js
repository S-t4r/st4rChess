export class Piece {
    constructor(board, color, position, square) {
        this.board = board;
        this.color = color;
        this.position = position;
        this.square = square;
        this.hasMoved = false;
        this.clicked = false;
        this.exists = false;
        this.legalMoves = [];
    }

    Move(piece, newPosition) {
        // Old square data
        piece.square.css({backgroundColor: piece.square.data('originalColor')});
        piece.square.data('piece', null);
        piece.clicked = false;
        let coordinates = piece.board.convertCoordinates(newPosition.data('value'));
        
        // Old position
        piece.board.board[piece.position.x][piece.position.y] = null;
        
        // Change piece's square
        this.makeMove(coordinates);
        piece.position = coordinates;
        piece.square = newPosition;
        
        // Update board
        piece.board.board[coordinates.x][coordinates.y] = piece;
        newPosition.data('piece', piece);

        // reDraw
        this.Draw(newPosition);

        this.board.pieces.forEach(element => {
            // Change back legal move squares after moving a Piece
            if (this.board.selectedPiece !== null) {
                let selected = this.board.selectedPiece.legalMoves;
                this.board.selectedPiece = null;
                this.board.ShowLegalMoves(selected);

            }
            // Update legal moves
            if (element instanceof Pawn) {
                element.updateLegalMoves();
            }
            });
    }


    Capture(designation) {
        // Add to captured pieces array
        let capturingSquare = this.board.square[designation.x][designation.y];
        let capturingPiece = capturingSquare.data('piece');
        capturingPiece.exists = false;
        capturingSquare = this;

        this.board.capturedPieces.push(capturingPiece);
        this.board.players.forEach(player => {
            player.updatePosition(capturingPiece);
        });

        if (capturingSquare.square != null) {
            capturingSquare.square.css({backgroundColor:
                capturingSquare.square.data('originalColor')});
        }

            // New pieces array after capture
            this.board.pieces = this.board.pieces.filter(piece => piece.exists)
    }


    updateLegalMoves() {
        let potentialPositions = this.calculatePotentialPositions();
        this.legalMoves.length = 0;
        potentialPositions.forEach(element => {
            if (this.isLegalMove(element)) {
                this.legalMoves.push(element);
            }
        });
    }


    makeMove(newPosition) {
        let boardSquare = this.board.square[newPosition.x][newPosition.y];
        this.hasMoved = true;
        if (boardSquare.data('piece') !== null) {
            this.Capture(newPosition);
        }
    }
    
    
    Turn() {
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
        
            $(this.square).css({backgroundColor: mixedColor});
            this.clicked = true;
            this.board.selectedPiece = this;
            this.board.ShowLegalMoves(this.board.selectedPiece.legalMoves)
        }
    }

    
    isWithinBounds(position) {
        if (0 <= position.x && position.x <= 7 && 0 <= position.y && position.y <= 7) {
            return true;
        }
        else {
            return false;
        }
    }
    

}

// Pawn class
export class Pawn extends Piece {
    constructor(color, position, hasMoved, clicked, square, exists) {
        super(color, position, hasMoved, clicked, square, exists);
        this.score = 1;
        this.updateLegalMoves();
    }


    Draw(where) {
        // If the piece does not exist, create one.
        if (!this.exists) {
            this.exists = true;
            const Pawn = $('<div>');
            Pawn.css({
                position: 'absolute',
                top: `${this.position.x * 12.5}%`,
                left: `${this.position.y * 12.5}%`,
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
    

    isLegalMove(newPosition) {
        let isRegularMove = false;
        let destinationSquare = this.board.square[newPosition.x][newPosition.y];

        // First move
        if (!this.hasMoved) {
            if (Math.abs(this.position.x - newPosition.x) <= 2
            && newPosition.y === this.position.y &&
            destinationSquare.data('piece') == null) {
                isRegularMove = true;
            }
        }
        // Not first move
        else if (this.hasMoved) {
            if (Math.abs(this.position.x - newPosition.x) <= 1 &&
            newPosition.y === this.position.y &&
            destinationSquare.data('piece') == null) {
                isRegularMove = true;
            }
        }

        // Check diagonally in front for CAPTURE
        if (Math.abs(newPosition.y - this.position.y) === 1 &&
        Math.abs(newPosition.x - this.position.x) === 1) {
            if (destinationSquare.data('piece') != null && destinationSquare.data('piece').color !== this.color) {
                return true;
            }
            else return false;
        }
        return isRegularMove;
    }


    calculatePotentialPositions() {
        // Return value
        let potentialPositions = [];
        
        // Check the square directly in front of the pawn
        // White Pawns
        if (this.color == 'white' && !this.hasMoved) {
            let firstMove = {x: this.position.x - 2, y: this.position.y};
            let front = {x: this.position.x - 1, y: this.position.y};
            
            if (this.isWithinBounds(firstMove)) {
                potentialPositions.push(firstMove);
            }
            if (this.isWithinBounds(front)) {
                potentialPositions.push(front);
            }
        }
        else if (this.color == 'white' && this.hasMoved) {
            let front = {x: this.position.x - 1, y: this.position.y};
            if (this.isWithinBounds(front)) {
                potentialPositions.push(front);
            }
        }
        // Black Pawns
        if (this.color == 'black' && !this.hasMoved) {
            let firstMove = {x: this.position.x + 2, y: this.position.y};
            let front = {x: this.position.x + 1, y: this.position.y};
            if (this.isWithinBounds(firstMove)) {
                potentialPositions.push(firstMove);
            }
            if (this.isWithinBounds(front)) {
                potentialPositions.push(front);
            }
        }
        else if (this.color == 'black' && this.hasMoved) {
            let front = {x: this.position.x + 1, y: this.position.y};
            if (this.isWithinBounds(front)) {
                potentialPositions.push(front);
            }
        }

        // White Pawns captures
        if (this.color == 'white') {
            let diagonalLeft = {x: this.position.x - 1, y: this.position.y - 1};
            let diagonalRight = {x: this.position.x - 1, y: this.position.y + 1};
            
            // Left diagonal
            if (this.isWithinBounds(diagonalLeft) && 
            this.board.square[diagonalLeft.x][diagonalLeft.y].data('piece') != null) {
                potentialPositions.push(diagonalLeft);
            }

            // Right diagonal
            if (this.isWithinBounds(diagonalRight) &&
            this.board.square[diagonalRight.x][diagonalRight.y].data('piece') != null) {
                potentialPositions.push(diagonalRight);
            }
        }

        // Black Pawns captures
        if (this.color == 'black') {
            let diagonalLeft = {x: this.position.x + 1, y: this.position.y - 1};
            let diagonalRight = {x: this.position.x + 1, y: this.position.y + 1};
            
            // Left diagonal
            if (this.isWithinBounds(diagonalLeft) && 
            this.board.square[diagonalLeft.x][diagonalLeft.y].data('piece') != null) {
                potentialPositions.push(diagonalLeft);
            }

            // Right diagonal
            if (this.isWithinBounds(diagonalRight) &&
            this.board.square[diagonalRight.x][diagonalRight.y].data('piece') != null) {
                potentialPositions.push(diagonalRight);
            }
        }

        return potentialPositions;
    }


}

// Rook class
export class Rook extends Piece {
    constructor(color, position, hasMoved, clicked, square, exists) {
        super(color, position, hasMoved, clicked, square, exists);
    }

    
    Draw(where) {
        // If the piece does not exist, create one.
        if (!this.exists) {
            this.exists = true;
            const Rook = $('<div>');
            Rook.css({
                position: 'absolute',
                top: `${this.position.x * 12.5}%`,
                left: `${this.position.y * 12.5}%`,
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


    isLegalMove(newPosition) {
        let isRegularMove = false;
        let destinationSquare = this.board.square[newPosition.x][newPosition.y];

        // First move
        if (!this.hasMoved) {
            if (Math.abs(this.position.x - newPosition.x) <= 2
            && newPosition.y === this.position.y &&
            destinationSquare.piece == null) {
                isRegularMove = true;
            }
        }
        // Not first move
        else if (this.hasMoved) {
            if (Math.abs(this.position.x - newPosition.x) <= 1 &&
            newPosition.y === this.position.y &&
            destinationSquare.piece == null) {
                isRegularMove = true;
            }
        }

        // Check diagonally in front for CAPTURE
        if (Math.abs(newPosition.y - this.position.y) === 1 &&
        Math.abs(newPosition.x - this.position.x) === 1) {
            if (destinationSquare.data('piece') != null && destinationSquare.data('piece').color !== this.color) {
                return true;
            }
            else return false;
        }
        return isRegularMove;
    }


    calculatePotentialPositions() {
        // Return value
        let potentialPositions = [];
        
        // Check the square directly in front of the pawn
        // White Pawns
        if (this.color == 'white' && !this.hasMoved) {
            let firstMove = {x: this.position.x - 2, y: this.position.y};
            
            if (this.isWithinBounds(firstMove)) {
                potentialPositions.push(firstMove);
            }
            if (this.isWithinBounds(front)) {
                potentialPositions.push(front);
            }
        }
        else if (this.color == 'white' && this.hasMoved) {
            let front = {x: this.position.x - 1, y: this.position.y};
            if (this.isWithinBounds(front)) {
                potentialPositions.push(front);
            }
        }
        // Black Pawns
        if (this.color == 'black' && !this.hasMoved) {
            let firstMove = {x: this.position.x + 2, y: this.position.y};
            let front = {x: this.position.x + 1, y: this.position.y};
            if (this.isWithinBounds(firstMove)) {
                potentialPositions.push(firstMove);
            }
            if (this.isWithinBounds(front)) {
                potentialPositions.push(front);
            }
        }
        else if (this.color == 'black' && this.hasMoved) {
            let front = {x: this.position.x + 1, y: this.position.y};
            if (this.isWithinBounds(front)) {
                potentialPositions.push(front);
            }
        }

        // White Pawns captures
        if (this.color == 'white') {
            let diagonalLeft = {x: this.position.x - 1, y: this.position.y - 1};
            let diagonalRight = {x: this.position.x - 1, y: this.position.y + 1};
            
            // Left diagonal
            if (this.isWithinBounds(diagonalLeft) && 
            this.board.square[diagonalLeft.x][diagonalLeft.y].data('piece') != null) {
                potentialPositions.push(diagonalLeft);
            }

            // Right diagonal
            if (this.isWithinBounds(diagonalRight) &&
            this.board.square[diagonalRight.x][diagonalRight.y].data('piece') != null) {
                potentialPositions.push(diagonalRight);
            }
        }

        // Black Pawns captures
        if (this.color == 'black') {
            let diagonalLeft = {x: this.position.x + 1, y: this.position.y - 1};
            let diagonalRight = {x: this.position.x + 1, y: this.position.y + 1};
            
            // Left diagonal
            if (this.isWithinBounds(diagonalLeft) && 
            this.board.square[diagonalLeft.x][diagonalLeft.y].data('piece') != null) {
                potentialPositions.push(diagonalLeft);
            }

            // Right diagonal
            if (this.isWithinBounds(diagonalRight) &&
            this.board.square[diagonalRight.x][diagonalRight.y].data('piece') != null) {
                potentialPositions.push(diagonalRight);
            }
        }

        return potentialPositions;
    }

}

export class Knight extends Piece {
    constructor(color, position, hasMoved, clicked, square, exists) {
        super(color, position, hasMoved, clicked, square, exists);
    }


    Draw(where) {
        // If the piece does not exist, create one.
        if (!this.exists) {
            this.exists = true;
            const Knight = $('<div>');
            Knight.css({
                position: 'absolute',
                top: `${this.position.x * 12.5}%`,
                left: `${this.position.y * 12.5}%`,
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
}

export class Bishop extends Piece {
    constructor(color, position, hasMoved, clicked, square, exists) {
        super(color, position, hasMoved, clicked, square, exists);
    }


    Draw(where) {
        // If the piece does not exist, create one.
        if (!this.exists) {
            this.exists = true;
            const Bishop = $('<div>');
            Bishop.css({
                position: 'absolute',
                top: `${this.position.x * 12.5}%`,
                left: `${this.position.y * 12.5}%`,
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
}

export class Queen extends Piece {
    constructor(color, position, hasMoved, clicked, square, exists) {
        super(color, position, hasMoved, clicked, square, exists);
    }


    Draw(where) {
        // If the piece does not exist, create one.
        if (!this.exists) {
            this.exists = true;
            const Queen = $('<div>');
            Queen.css({
                position: 'absolute',
                top: `${this.position.x * 12.5}%`,
                left: `${this.position.y * 12.5}%`,
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
}

export class King extends Piece {
    constructor(color, position, hasMoved, clicked, square, exists) {
        super(color, position, hasMoved, clicked, square, exists);
    }


    Draw(where) {
        // If the piece does not exist, create one.
        if (!this.exists) {
            this.exists = true;
            const King = $('<div>');
            King.css({
                position: 'absolute',
                top: `${this.position.x * 12.5}%`,
                left: `${this.position.y * 12.5}%`,
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
}