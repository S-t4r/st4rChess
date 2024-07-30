- ### TO DOs.
	- [x] If King is in check and moving a pawn 1 step forward would uncheck the King, the move can not happen.
    - [x] If king is in check and we can capture the attacking piece, it is not yet allowed.
    - [x] I think the Knights have a little bug in them, but I'm not sure yet. I would have to test my code for the next version.
    - [x] The same is for King.


- ### What does version 0.7 bring?
    - [x] Debug the bugs mentioned above.
    - [x] Castling rights definition.


Fix updating the board.

Let us explain our problems and fix them. This version is all about debugging and cleaning up.

Let's have a default piece svg and be able to show it.

Draw methods are just repeating code. 

#### some CONSTANT variable are needed to be declared, mainly:
- position of the piece should be relevant to the size of the board.
- we are using 12.5% in a lot of places. That's 100/8 and it should be a CONSTANT to be able to change the size of the board easily.

### Tomorrow I'll review my code and point out every thing that is needed to be done.



## We should have a whole description on it.


# St4rchess description
## How a game of chess is defined?
- We have a 8 x 8 Board that everything happens on it.
- The Board also has Pieces, mainly Pawns, Rooks, Knights, Bishops, Queens, and Kings.
- The Board has two players playing against each other.
Each class has some properties and some methods that I need to describe to be able to express them in code.

### Board:
#### Properties:
- A board array.
- Pieces array.
- Captured pieces array.
- Squares array.
- Player's array.
- Boolean turn.
- Checked king.
I should add the following properties:
- Game over.
#### Methods:
- PrintBoard():
	- To represent the board on screen.
- StartingPosition():
	- Every game has a starting position.
- DrawPieces():
	- To draw pieces onto the board.
- ShowLegalMoves(legalMoves)():
	- This will show the legal moves of a piece that has been clicked.
- copyBoard():
	- To make a deep copy of the board.
- DOM():
	- The document object model.

The following changes are to be made:
- ShowLegalMoves() method does not belong to Board class. %% FUCK THIS I DON'T WANT ANY MORE DEBUGGING NOW, MAYBE I WOULD FIX THIS IN THE NEXT VERSION. %%
- [x] I should have a const instead of using the magic number 8 everywhere.

### Pieces:
#### Properties:
- A board that it is being placed on.
- The color of the piece.
- The square that it has been placed on.
- A position on the board.
- Whether it exists or not.
- Whether it has moved or not.
- Whether it has been clicked on or not.
- An array of legal moves.
- A coefficient, white -1, black 1.

#### Methods:
- Move(piece, newPosition):
	- A piece should be able to move on the board.
- Capture(designation):
	- A piece can attack and capture enemy's pieces.
- updateLegalMoves(flag = false):
	- After each move the legal moves for each piece is different.
- makeMove(newPosition):
	- To handle operations after a move have been made.
- Turn():
	- To change the turn of the game.
- Select():
	- When a piece is clicked on.
- isWithinBounds():
	- To restrict the piece to board dimensions.
- kingInCheck():
	- To see if a move will put my own king in check.
- copy():
	- To make a copy of a piece.
##### Sub classes:
###### Properties:
- A name.
- A score.
- Which moves can capture enemy pieces.

###### Methods:
- Draw():
	- To draw a piece.
- isLegalMove(): 
	- To process legal moves for certain piece.
- calculatePotentialPositions():
	- To calculate potential positions a piece can move to.

The following changes are to be made:
- [x] Draw method should should be in super class.
- [x] A piece should have a name property.
- [x] I have to get rid of constants like 12.5 in Draw method.
### Players:
#### Properties:

#### Methods:



### Every task is completed. Let us summarize:
- I should have completed this task so much sooner but I got lazy and distracted! I was a little depressed so I didn't pay any attention to my project.
- When I started to work on this version I was struggling with my code cause I forgot what I was doing and what needed to be fixed.
- But as always I pushed through.

#### So many bugs have been fixed in this version and I defined castling rights.
- To be honest, I could have wrote a better and more compact code but, well I'm a little lazy. I know, I know, I will have to pay for writing like this but that is for future me to figure out. :D FUCK YOU FUTURE ME XD.
I learned so much from this version, for instance I must finish a project in a fixed time for if I don't I'll forget and I have to figure somethings out all over again.

### What does version 0.8 bring?
- [ ] En-peasant.
- [ ] Check mate.

I have to take it step by step otherwise it will get overwhelming.
Player class needs more definition, like I need to show what pieces have been captured inside of player div.

Oh, don't forget, what happens when a Pawn reaches the end of the board? it can promote to any other piece it wants. this should be defined in version 0.9.

version 1.0 will define an engine to play against.

Thank you for reading me ^3^.
