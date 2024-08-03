### What does version 0.6 bring?
    - Checking the King.
    
- My head hurts after all that debugging! I wrote for 2 hours for how the king should be in check and all, but it was getting out of hand so I deleted all my progress and went back to version 0.5!!! But then my Rook movement that I did fix before resorting to version 0.5 was screwed up! I had to debug for an hour to fix this bug AGAIN!!!
    - I was frustrated to say the less.

Checking the king is harder that it looks, I actually have to check 1 step further in the game and see if after moving the King, the King would still be on check or not!


# Explaination:
- So, I can officially say version 0.6 is done. But I have to admit that there are some bugs in this version that needs to be fixed. viz.,
    - If King is in check and moving a pawn 1 step forward would uncheck the King, the move can not happen.
    - If king is in check and we can capture the attacking piece, it is not yet allowed.
    - I think the Knights have a little bug in them, but I'm not sure yet. I would have to test my code for the next version.
    - The same is for King.

Before I go on explaining new methods, I need to express my feelings. I became so exhausted working on this version. Several times I wanted to delete all my progress and start from scratch (good thing that I didn't). It was frustrating but yet so pleasing that I pushed through and was successful on completing this version.

- ### New methods:
    - ##### Board class:
        - DOM(): I needed to get rid of the DOM property in my constructor so I made a method just for that.
        - copyBoard(): I needed to get a copy of the current state of the board to simulate moves on it.
    - ##### Piece class:
        - kingInCheck(): This was one of the main events of this version. I learned a lot about asynchronous function thanks to this method. It takes two parameters the position of the piece and one legal move (I was originally passing in legalMoves array but it would simulate all the moves all at once so I passed them one by one). This method is called at the bottom of updateLegalMoves() method. And I needed to add a flag to updateLegalMoves() to prevent infinite loops from happening. In kingInCheck() I first copy the state of the board, then move the piece to the potential position and if it would put my King in check I would return true indicating that the move is illegal.
        - copy(): So it seems like javaScript passes objects by reference so I needed to make a copy of every piece on current state of the board.
    - ##### King class:
        - isMoveSafeForKing(): We can't put the King on the squares that opposing side can attack. So I defined this method just for keeping my King safe from being captured. I think this method needs some restructuring but I have to test my code first.
- I also changed isLegalMove() and calculatePotentialPositions(). previously I was checking the squares and getting their data to see if there was a Piece present there, etc. But now they check the board instead of the squares on the board.

### What does version 0.7 bring?
    - Debug the bugs mentioned above.
    - Castling rights definition.

That's all.

Thank you for reading me.