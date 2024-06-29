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

###### StartingPosition(), DrawPieces() and redrawPiece().
  Every board has a starting position, so I have declared
  
  
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
  




























Describe how pieces move.
