# Hey github,

## This is version 0.2 of my CS50's Final Project.

### What changed?
  First of all I had to fix a logical bug. It was frustrating but I pushed through. I needed a way to connect squares and pieces, well first I unintentionally created some kind of forever loop in my program. I was assigning the positions to squares over and over again! the thing that I needed to do was to convert the coordinates of the new squares and give them to piece.position, but I was giving the squares directly to my piece.position. 

##### I need to write cleaner code for my sake. It was all tangled up, every 'method' should do only one thing.

### Capture().
  Well this was an easy task, the steps were,
  - Check for legal moves.
  - Check diagonal squares.
  - if it contains a piece, capture is allowed.

### Next step?
  - Show Legal moves.
  - Add other pieces to the board.
Afterwards, I need to implement how other pieces move.

Thank you for reading me. ;)
