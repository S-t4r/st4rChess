### What does version 0.9 bring?
- [x] Fix Castling bug.
- [x] Pawn reaching end of board.
- [x] Show svg of captured pieces.

In version 1.0 I'll define an engine to play against.

### Fix castling bug.
You could add a method to your King class that checks if the King is in check. This method could iterate over all the opponent's pieces and see if any of them can move to the King's square.

For checking if the squares the King would move through are under attack, you could add a method to your Board class that takes a square as input and returns true if an opponent's piece can move to that square, and false otherwise. You would call this method for each square the King would move through during castling.

### Promoting a Pawn
1. After a move is made, check if the piece is a pawn and if it has reached the end of the board.
2. If it has, prompt the user to choose a piece for promotion (queen, rook, bishop, knight).
3. Replace the pawn with the chosen piece.

### Showing SVG
- Okay this is a lot harder than I thought. It's on me, I wrote buggy code and now I'm paying the price. thanks past me :).

There are a lot of bugs that I don't even know where do they come from!!!
Like if a piece is on the back row it may break down and can't be selected no more!!!
another bug is when a piece gets promoted and is captured by opponent piece it still exists somehow!
another one that I discovered is that you can win a game even if the king can capture the attacking piece, only some times!!!
another bug is how i'm adding SVG s to player div, it is bound for failure!

I'm just gonna release this version today and fix these problems in future versions. I have to get this project done already.
I'm sorry David if I'm a little stupid... I'll try to get better.

### Version 1.0 brings the following:
- First and foremost a JavaScript worker engine to play against.
- I'll try to fix the mentioned bugs but don't ask too much of me, creating the worker is already great feet to take.
- I'll probably fix these bugs in future versions.

for now I kinda feel like I have done a lot. so I'm going to release this version.

Thank you for reading me ^-^.