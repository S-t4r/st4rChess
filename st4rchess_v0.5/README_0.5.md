- ### what does version 0.5 bring?
    - fix coordinates. Done.
	- Player class full definition. Next version.
	- Add Rook Logic to the game!!! HOW!?!!?!?@#?! Done.
		- For instance you can check each square up and down and see if it contains a Piece instance, if not, then add that square to legal moves?! hmmm,





Duck, let's talk about my chess board.
I've started defining Rook sub class.
so far I have definition for 3 methods,
- Draw
- isLegalMove
- calculatePotentialPositions
The only fully defined method is Draw. the last two need to be defined. First I have to decide what are the legal moves for a Rook. it can go vertically and horizontally utill it reaches a piece.
that piece is rather for capturing or it's the same color as ours.

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

Here I need to check every square that is infront of the pawn and check to see if any of them contains a piece.

The good aspect of object oriented programming is that a lot of properties and methods can be reused in other objects with minimal changes. as soon as I finished defining Rook class, defining other classes was an easy task.

I thought defining Knight class would be sooo hard! But it was the easiest class definition in the whole board.

enough chit chat,
- ### What does version 0.6 bring?
- Castling rights.
- Checking the king.
- Maybe take care of player class?
    - The reason I don't wanna fully define player class is that it's more of a designing problem than an board problem. 
    - First I need to figure out what happens when a king is checked.

#### Thank you for reading me ^3^ .