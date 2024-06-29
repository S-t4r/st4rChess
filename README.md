# Hey guys,

## I'm creating a chess engine as my Final Project.

#### My first step is to code an 8 * 8 board.
  First I declared 2 const arrays RANK and, FILE, I looped through these arrays and took the remainder of i and j to determine the color of the square. IT IS 8 x 8
        // Create board array
        this.board = new Array(8).fill(null).map((_, i) => 
            new Array(8).fill(null).map((_, j) => FILE[i] + RANK[j])
        );

  Well when dealing with classes aka. collections of data, we need to treat everything as an 'object'. In PrintBoard(array, div) I take 2 arguments... And me now explaining this to you, have made me realize that the second paramater 'div' is unnecessary and it's just doing something in the main function that has to be done in the Class Board itself. so i'm gonna fix that and return with more explaining. :D

#### Add pieces.

Describe how pieces move.
