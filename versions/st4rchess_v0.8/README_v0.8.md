### What does version 0.8 bring?
- [x] En-Passant.
- [x] Check mate.

I have to take it step by step otherwise it will get overwhelming.
Player class needs more definition, like I need to show what pieces have been captured inside of player div.

Oh, don't forget, what happens when a Pawn reaches the end of the board? it can promote to any other piece it wants. this should be defined in version 0.9.

version 1.0 will define an engine to play against.


### En Passant
1. The En Passant move can only occur when a pawn moves two squares from its starting position and lands beside an opponent's pawn.
2. If the conditions for En Passant are met, the opponent's pawn captures the first player's pawn by moving to the square the first player's pawn skipped over.
3. Track the pawn's previous and current positions. If the difference in the row (or column, depending on your board orientation) is 2, then the pawn has moved two squares.
4. Check the squares immediately to the left and right of the pawn's new position. If there is an opponent's pawn in either of these squares, then the pawn has landed beside an opponent's pawn.

### Check mate
- My first problem with defining this method was where should I call it. Then I realized that I was updating legal moves of each piece after each move, so I decided to call board.CheckMate() besides updating legal moves.
- Then there was CheckMate() method, I first got all of the same side pieces and looped through their legal moves and calling kingInCheck() method inside them.
- after that I would push every legal move to allMoves array. if allMoves array was empty, aka. its length was equal to zero, then I would first get the color of the winner and then call GameOver() by passing winner's color.
- GameOver() method is making a DOM element and giving it the properties that I wanted, and then prepending it body.

### Game()
- So first I wanted to call this.PrintBoard(), this.StartingPosition() and, this.DrawPieces() method inside of my constructor but it was causing an infinite loop. So I decided to put them away in a separate method and calling that method inside of my main.

I have to admit, I have a few bugs that should be attended to.
1. The king can castle even if it is not allowed. If an opponent's piece can see the square between the King and The Rook, or King is in check, or opponent's piece can see the Rook, castling is not allowed. **THIS MUST BE FIXED.**
2. What happens when a Pawn reaches the end of the board? this should be defined as well. I will think about what more my object needs and write them down for version 0.9.

### What does version 0.9 bring?
- Fix Castling bug.
- Pawn reaching end of board.
- Show svg of captured pieces.




Thank you for reading me ^3^.