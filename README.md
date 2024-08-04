# St4rChess
- A JavaScript Object for a standard Chess Board.

#### Video Demo:  https://youtu.be/caHaj2po0mM?feature=shared

## Introduction
- Hello, I'm Matin. I'm a 24 years old boy who David changed his life for good. I kind of understand how stupid I am comparing to you, but one thing that I have learned from CS50 is that I can learn and grow, I have the faculty to become as smart as you guys. without further ado allow me to present my project.
## St4rChess Project
- Chess in one of my favorite games of all time, I'm playing since my childhood. So I decided to write a chess board with JavaScript as my last project. (actually I was going to define a chess engine to play against but it is long passed my deadline. I will present a better project for CS50w.)
- I decided to write my game with JavaScript for a few reasons, viz.:
	1. Easy to visualize stuff.
	2. Object oriented.
	3. Easy to debug.
- Something that I realized along the way was that programming is more about defining what you want to write to yourself. After you have clarified what you want and how to get it, it is an easy task to write it. *But I had to learn that the hard way.*
### Visualizing
- I myself would understand problems better if there was something to **see**, I now regret that I didn't use flow-charts and other ways to make my life easier.
### Object oriented
- I'm a fan of objects, they have properties, they have methods and so many other ways to interact with those objects. As I was progressing and my code was getting bigger I would find many ways to make my code more compact and even more readable.
- Objects in JavaScript are same as classes aka collections of data. I have a class called Board which everything happens on this board. I have a super-class called Piece and six sub-classes of Piece, also, I have a Player class to represent each player.
#### Board 
##### Properties
- The Board has a few properties that I will briefly introduce them,
	- Properties include:
		- this.size;    Size of the board.
		- this.pieces[];    Every piece that has been placed on the board.
		- this.capturedPieces[];    Pieces that have been captured.
		- this.selectedPiece;    The piece that has been selected to move on board.
		- this.square[];    Every square on the board.
		- this.turn;    White's turn is true, Black's is false.
		- this.checkedKing;    The king in check.
		- this.board[];    The actual board array to place pieces on.
		- this.BOARDSIZE;    Size of the board relative to browser's size.
		- this.players[];    An array of player objects.
		- this.fifty;    Fifty move rule (Draw).
##### Methods
- The methods of Board instance were so much harder when I was first writing them but now I think I would do a better job writing methods like these. The methods are:
	- PrintBoard();
		- Basically I create a DOM element at first, then start to fill up this newly created DOM with squares. In my nested for loops first I'm choosing the color of the square by checking the module of i + j, then, I will proceed to give my squares some jQuery properties, some CSS, and an event listener.
	- StartingPosition();
		- In this method I'm defining the position of the board and I'm also creating the Piece instances and player instances. As soon as I have created the pieces I will loop through my board and give the corresponding index it's Piece. I also update the legal moves of Pieces once.
	- DrawPieces();
		- Loop through board array and if instance of Piece then Piece.Draw().
	- ShowLegalMoves()
		- When a Piece has been clicked on, I will show the legal moves of the said Piece. Here I did add some logic to be able to select other pieces when a piece is selected.
	- CheckMate();
		- If a King is in check this function will be called and checks if the King's colored pieces have any legal moves. If the list of legal moves is empty then it's game over.
	- GameOver();
		- This will show who's the winner of the game is. and if it is a draw it will show draw.
	- copyBoard()
		- I needed to make a deep copy of my board to simulate moves on it. the main reason was to check if a certain move would put my king in check.
	- DOM();
		- Creates the DOM element.
	- Game();
		- Easy to use this board. just use 'let game = new Board; game.Game()'.

#### Piece
##### Properties
- I've had so many changes across all my versions for my Piece class. Let us proceed.
	- this.board;    The corresponding Board.
	- this.color;    The color of the Piece.
	- this.square;    The square it has been placed on.
	- this.position;    It's position on Board.
	- this.hasMoved;    Whether it has moved.
	- this.clicked;    Whether it has been clicked on.
	- this.exists;    Whether it still exists.
	- this.legalMoves[];    An array of all it's legal moves.
	- this.captureMoves[];    An array of all the moves leading to a capture.
	- this.coefficient;    Its coefficient, (white -1), (black 1). To determine the direction of Pawn movement.
##### Methods
- So many methods! most of them unnecessary, but it is what it is...
	- Draw();
		- To draw the pieces. First I was writing this in every sub-class, then I realized I can have this in one place instead of 6.
	- Move();
		- It takes in a piece and a new position to move the piece to. It also has some logic in it, like En-Passant and promoting a Pawn.
	- Capture();
		- This adds the captured piece to capturedPieces array.
	- makeMove();
		- To have some logic after a move has been made. Change the turn, If move is a capturing move, and wether the move was En-Passant.
	- Turn();
		- Changed the Turn of the game.
	- Select();
		- Select a Piece when it is clicked on. I used tinycolor library for changing the color of squares.
	- isWithinBounds();
		- To if a certain position is on the board.
	- updateLegalMoves();
		- Okay this one was the toughest. I don't know why I made it an asynchronous, maybe I wanted to learn about async functions. This method gave me nightmares:D.
		- So lets take it step by step, I will get the potential move of each piece, then I will check if that potential move is legal. I will wait for all the promises to finish their run. Then I will check if king is in check, if it is castling is not allowed.
		- Then, with the promises that I get back, firstly I push it to legal moves of the piece, secondly I check for captures. After that I check if King is in check, afterwards I'll check for castling rights for each king!
		- **I'm not finished yet, XD.** After dealing with promises I will remove any duplicates that I have, and trust me, there were a *LOT* of duplicates!
		- At the bottom I have a flag to check if a certain move would put my king in check, and if so I would remove that move from legal moves array.
			- I was dealing with infinite loops here, using a flag fixed my problem.
	- kingInCheck();
		- First I create a deep copy of the board, on that board I'll simulate the move, aka. I move the piece to a potential position. Afterwards I will update each piece's legal moves, If my king is in check I would return true indicating the move is illegal, else I'll return false to allow the move.
	- copy();
		- To create a deep copy of each piece.
##### Sub-classes
- I have six sub-classes, each for a unique piece. A Pawn class, a Rook class, a Knight class, a Bishop class, a Queen class, a King class. And they have their own properties and methods.
###### Properties
- For every piece I have some properties that are common, except the King that has one extra property.
	- super(board, color, square);    I think I don't event need this line in my sub classes!
	- this.name;    Every Piece has a unique string name.
	- this.score;    Every Piece has a score.
	King has the following extra property,
	- this.checked;    If King is in check.
###### Methods
- Every piece has 2 identical methods like so,
	- isLegalMove();
		- For each Piece we have a unique way of indicating it's legal moves.
		- A Pawn can only move one or two steps forward if it is its first more, else it will move 1 step forward, and can also capture diagonally one square.
		- A Rook can move vertically and horizontally until it reaches a Piece.
		- A Knight has L shape movement, jumping over the Pieces.
		- A bishop can move diagonally in each direction until it reaches a Piece.
		- A Queen can move like Rook and Bishop combined.
		- A King can move like Queen but only one square.
	- calculatePotentialPositions();
		- Here I calculate every possible position a piece can move regardless of its legality.
	A Pawn and a King have 2 extra methods.
	For Pawns,
	- enPassant();
		- the Logic of En-Passant is implemented in Move method! in here I just check the color of my Pawn and push the move to legalMoves array!
	- promote();
		- So when a Pawn reaches the end of the board the player will be prompted to choose a Piece to promote the Pawn to. I'm using a switch case since there are only four Pieces a Pawn can promote to.
		- I'm also giving the newly created piece its new methods at the bottom.
	For Kings,
	- castlingMoves();
		- An example of me writing inefficient and unnecessary code!
		- First I'll filter the Pieces to have only the rooks, Then I will check the distance between the Rook and the King (I have checked if they haven't moved in Move() method before calling this method.), if there is no piece in between then I will push the move to legal moves array.
		- I also have a distinction between the right Rook and the left Rook.
	- castling();
		- So the logic of moving the King and the Rook takes place in here.

#### Player
##### Properties
- I didn't really worked on the aspect of Player object because it was more a designing aspect rather than a logic one, nevertheless I had my usual problems with implementing this object. The following are the properties of Player
	- this.board;    The Board that The game is being played on.
	- this.color;    The color of Player's pieces.
	- this.name;    Name of Player.
	- this.ownPieces;    Player's own Pieces.
	- this.capturedPieces;    The pieces Player has captured thus far.
	- this.score;    The score It has.
##### Methods
- Another example of me writing unnecessary and inefficient code!
	- updatePosition();
		- Here I will add the captured Pieces to capturedPieces array.
	- showPlayer();
		- First I check if there is a div associated with the Player, if not then create one and append it to body. If Player div exists then update the score of Player.
	- createPlayerDOM();
		- Create the DOM element that has some properties associated with player.
	- UpdateScore();
		- I will add a SVG drawing to Player div each time a Piece has been captured.

### How was my journey?
- **Fun & comprehensive.**
- I think I have grown as a human being, "Humans aren't born Humans, they are made to a Human". I'm able to solve real world problems much easier. recently I have realized that I might not be stupid or medically retarded!
- Einstein, Hawking, Newton, Socrates, Aristotle, Kant and all other great human beings were just like me a mere human. So I have the faculty to acquire what they have. Generation by generation we as humans are getting smarter, so I might even be more intellect than those who have came before me.
- All in all, it was a great journey and I can't wait to a new CS50 course.

### What's next?
- I'm planning to take the course on CS50w and another course on Calculus taught by MIT. I will finish them before the new year.

Thank you for all your efforts. You guys have changed my view of life and therefore I think my life has a meaning and a direction now.

Thanks for reading me.
Matin ^-^
