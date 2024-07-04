# Hey CS50,

## Version 0.3 of St4rchess engine.

- ### What's new?
	Well in this version I created a list of potential positions for each piece. It was a lot of work and a lot of debugging, but as always with enough time everything is solvable.
	Getting the correct position for each piece, checking if that position is on the board (not out of bound), making sure that the move is legal, pushing each legal move to legalMoves array and updating it each time a piece makes a move.
	Got to be honest, it wasn't possible without cs50.ai's duck.

- ##### I wrote cleaner code this time.
	First I made almost all of my methods in Pawn sub class, but then most of them had to be moved to Piece super class, I was nervous I might need to rewrite and adjust my methods. But then when I moved them to Piece super class surprisingly there was no error.
	It made me so happy :))

Let's break it down.
- ### isLegalMove(), calculatePotentialPositions(), isWithingBounds(), updateLegalMoves(), makeMove() and, ShowLegalMoves().
- ##### isLegalMove().
	- (found a bug, fixed it :D), here I am declaring two variables, isRegularMove and destinationSquare.
	- isRegularMove will be set to true as soon as it is decided it is a legalMove, else it will return false.
	- destinationSquare gets the square that the pawn is trying to get to, mostly I am checking if there is a Piece in that position, if there is, and if capture is allowed it will return true.
- ##### calculatePotentialPositions().
	- First I am declaring an array to return it later.
	- Mainly it's checking if the square the pawn is trying to get to is on the board, and if it is it will push it to potentialPositions array.
	- Here I had to seperate black and white pawns. But now that I'm looking at it I think using a switch case statement would be more concise.
- ##### isWithinBounds().
	- It gets a position as a paramater and check if it's on the board.
- ##### updateLegalMoves().
	- I call this.calculatePotentialPosition and store it's return value.
	- Each time this method has been called it means that the board has changed, so I need to set this.legalMoves.length to 0 so I have a new list.
	- Following the above steps, I loop through potentialPositions and validate the move. If it is valid then I'll push it to this.legalMoves.
- ##### makeMove().
	- I was changing this.hasMoved to true in my Move method, but then Move() has some other tasks to run and it might have broke the order of execution.
	- Also, if the square that the Piece is trying to get to is not null, aka. it is already occupied by another Piece, then I will call capture to get rid of the later.
- ##### ShowLegalMoves().
	- Here I'm showing the available places each piece can move to when it is selected.

- ### What's next?
	- Show Player Class.
	- Define Rook Class.

Thank you for read me. :)

[1^] I really can't believe it, I've wrote a **THOUSAND** line of code!