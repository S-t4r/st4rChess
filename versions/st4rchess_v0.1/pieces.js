export class Piece {
    constructor(board, color, position, square) {
        this.board = board;
        this.color = color;
        this.position = position;
        this.square = square;
        this.hasMoved = false;
        this.clicked = false;
        this.exists = false;
    }

    Move(newPosition) {
        this.board.board[this.position.x][this.position.y] = null;
        this.square.css({backgroundColor: this.square.data('originalColor')});
        this.clicked = false;
        this.position = newPosition;
        let coordinates = this.board.convertCoordinates(newPosition.data('value'))
        this.board.board[coordinates.x][coordinates.y] = this;
        this.square = newPosition;
    }

    Capture() {

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
}

export class Pawn extends Piece {
    constructor(color, position, hasMoved, clicked, square, exists) {
        super(color, position, hasMoved, clicked, square, exists);
    }


    Draw(where) {
        // If the piece does not exist, create one.
        if (!this.exists) {
            this.exists = true;
            const PAWN = $('<div>');
            PAWN.css({
                position: 'absolute',
                top: `${this.position.x * 12.5}%`,
                left: `${this.position.y * 12.5}%`,
                width: '12.5%',
                height: '12.5%'
                });
    
            // SVG
            PAWN.load(`./svg/${this.color}Pawn.svg`, () => {
                PAWN.find('svg').css({
                    width: '100%',
                    height: '100%'
                });
            });
    
            // Listen for clicks
            PAWN.on('click', () => {
                if (this.clicked) {
                    // Deselect the piece
                    PAWN.css({backgroundColor: this.square.data('originalColor')})
                    this.clicked = false;
                    this.board.selectedPiece = null;
                    }
                else if (!this.clicked) {
                    // Select the piece
                    PAWN.css({backgroundColor: 'red'});
                    this.clicked = true;
                    this.board.selectedPiece = this;
                }
            });
            where.append(PAWN);
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
            this.square.on('click', () => {
                if (this.clicked) {
                    // Deselect the piece
                    this.square.css({backgroundColor: this.square.data('originalColor')});
                    this.clicked = false;
                    this.board.selectedPiece = null;
                    }
                else if (!this.clicked) {
                    // Select the piece
                    this.square.css({backgroundColor: 'red'});
                    this.clicked = true;
                    this.board.selectedPiece = this;
                }
            });
            where.append(this);
        }
    }
    

    PawnMove(newPosition) {
        // Check in front of
        console.log(this.board.board);
        if (this.board.board[newPosition.x][newPosition.y] != null) {
            return false;
        }

        // First move
        if (!this.hasMoved) {
            if (Math.abs(this.position.x - newPosition.x) <= 2
            && newPosition.y === this.position.y) {
                this.hasMoved = true;
                return true;
            }
            else {
                return false;
            }
        }
        // Not first move
        else if (this.hasMoved) {
            if (Math.abs(this.position.x - newPosition.x) <= 1
            && newPosition.y === this.position.y) {
                return true;
            }
            else {
                return false;
            }
        }
    }
}

export class Rook extends Piece {
    constructor(color, position, hasMoved) {
        super(color, position, hasMoved);
    }
    Draw(where, i, j) {
        const ROOK = $('<div>')
        ROOK.css({
            position: 'absolute',
            top: `${i * 12.5}%`,
            left: `${j * 12.5}%`,
            width: '12.5%',
            height: '12.5%'
            })
        ROOK.load(`./svg/${this.color}Rook.svg`, () => {
            ROOK.find('svg').css({
                width: '100%',
                height: '100%'
            });
        });
        where.append(ROOK)
    }
}

export class Knight extends Piece {
    constructor(color, position, hasMoved) {
        super(color, position, hasMoved);
    }
    Draw(where, i, j) {
        const KNIGHT = $('<div>')
        KNIGHT.css({
            position: 'absolute',
            top: `${i * 12.5}%`,
            left: `${j * 12.5}%`,
            width: '12.5%',
            height: '12.5%'
            })
        KNIGHT.load(`./svg/${this.color}Knight.svg`, () => {
            KNIGHT.find('svg').css({
                width: '100%',
                height: '100%'
            });
        });
        where.append(KNIGHT)
    }
}

export class Bishop extends Piece {
    constructor(color, position, hasMoved) {
        super(color, position, hasMoved);
    }
    Draw(where, i, j) {
        const BISHOP = $('<div>')
        BISHOP.css({
            position: 'absolute',
            top: `${i * 12.5}%`,
            left: `${j * 12.5}%`,
            width: '12.5%',
            height: '12.5%'
            })
        BISHOP.load(`./svg/${this.color}Bishop.svg`, () => {
            BISHOP.find('svg').css({
                width: '100%',
                height: '100%'
            });
        });
        where.append(BISHOP)
    }
}

export class Queen extends Piece {
    constructor(color, position, hasMoved) {
        super(color, position, hasMoved);
    }
    Draw(where, i, j) {
        const QUEEN = $('<div>')
        QUEEN.css({
            position: 'absolute',
            top: `${i * 12.5}%`,
            left: `${j * 12.5}%`,
            width: '12.5%',
            height: '12.5%'
            })
        QUEEN.load(`./svg/${this.color}Queen.svg`, () => {
            QUEEN.find('svg').css({
                width: '100%',
                height: '100%'
            });
        });
        where.append(QUEEN)
    }
}

export class King extends Piece {
    constructor(color, position, hasMoved) {
        super(color, position, hasMoved);
    }
    Draw(where, i, j) {
        const KING = $('<div>')
        KING.css({
            position: 'absolute',
            top: `${i * 12.5}%`,
            left: `${j * 12.5}%`,
            width: '12.5%',
            height: '12.5%'
            })
        KING.load(`./svg/${this.color}King.svg`, () => {
            KING.find('svg').css({
                width: '100%',
                height: '100%'
            });
        });
        where.append(KING)
    }
}