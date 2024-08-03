# Hey guys,

## I'm creating a chess engine as my Final Project.

## My first step is to code an 8 * 8 board.

### Board Class.
  First I declared 2 const arrays RANK and, FILE, I looped through these arrays and took the remainder of i and j to determine the color of the square. IT IS 8 x 8
        // Create board array
        this.board = new Array(8).fill(null).map((_, i) => 
            new Array(8).fill(null).map((_, j) => FILE[i] + RANK[j])
        ); // sad face 

  Well when dealing with classes aka. collections of data, we need to treat everything as an 'object'. In PrintBoard(array, div) I'm take 2 arguments... And me now explaining this to you, have made me realize that the second paramater 'div' is unnecessary and it's just doing something in the main function that has to be done in the Class Board itself. so i'm gonna fix that and return with more explaining. :D

  Now, in PrintBoard() method, we take an array as input, I've predefined a property called  this.square and append it to this.DOM. Each square gets some property of their own when they originally are created, something that we can use to our advantage. so we have
    square.data('originalColor', color)
  I'm also giving each square an event listener and some styling that I think I can put away in my styling method.

##### StartingPosition(), DrawPieces() and redrawPiece().
  #### - StartingPosition();
  The starting position for every standard Chess game is fixed, pawns on the second and seventh rank and other Pieces on first and last rank, so I started to give my pieces to it's designated position. Everytime that I create a new Object ( found another potentioal bug thanks to explaining my code. ), I am giving it to this.board[i][j] but the thing is, it should be a child node of this.board[i][j].square so I'll fix that in v0.2.

  #### - DrawPieces();
  Here I'am looping through the board and checking for 'instanceof Piece' and drawing them accordingly.
  

  #### - redrawPiece();
  First, this method is called when a change has been made on the board. then, I change this.turn. I remove the piece from it's old position and append it to the new position.

  
  
  
### Piece Class.
  After creating Class Board, I have made another Class aka. object called Piece. Piece's property are as follows;
  - this.board, 'The board it is being placed on.'
  - this.color, 'The color of the piece.'
  - this.position, 'I'ts position on this.board.'
  - this.square, 'The current square that it has been placed on.'
  - this.hasMoved, 'False when not moved.'
  - this.clicked, 'Like an event listener.'
  - this.exists, 'If it still exists on this.board.'
    It is a super Class, it just describes a basic PIECE OBJECT, nothing else. Now that I'm writing this I want to describe a basic Draw function for each Piece.
    
#### Pawn Class.
  The line is,
    export class Pawn extends Piece {};
  This collection of data borrows a lot from it's parent aka. Piece, but it also has a few method it self.
  The first one is Draw(), the visual representation of Pawn and I'm loading a svg file into it. The next second method is PawnMove, each pawn can move only forward so here I'm getting the coordinates of piece, then I have 2 conditionals or forks, first one is whether the square in front of is occupied, next is whether is it's first.
  The next method is PawnMove(), first I'm checking squares in front of the Piece, then I check to see if it's the first move, if it is the Pawn has the ability of move 2 squares. The default legal move is one square forward.
  
### What's next?
  1. Fix the logical bug on squares in Class Board. Done.
  2. Define Capture() method. Done.
  After, I'll Create the sub classes of Piece one by one.

Thank you for reading me.
