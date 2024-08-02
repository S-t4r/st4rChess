### Version 1.0 brings the following:
- First and foremost a JavaScript worker engine to play against.
- I'll try to fix the mentioned bugs but don't ask too much of me, creating the worker is already great feet to take.
- I'll probably fix these bugs in future versions.

### Move generator
1. **Evaluation Function**: This function should take a game state (in your case, a `Board` object) and return a numerical score representing how favorable that state is for the AI. For example, the score could be based on the number of pieces the AI has versus the number of pieces the opponent has.
    
2. **Move Generation**: This function should generate all possible moves the AI could make from the current game state.
    
3. **Minimax Algorithm**: This is a common algorithm used in two-player games. It simulates all possible game states several moves ahead and uses the evaluation function to determine the best move.
    
4. **Alpha-Beta Pruning**: This is an optimization for the minimax algorithm that allows it to search deeper in the same amount of time.

### Worker
1. **Create a new Worker object**: You can create a new Worker object by calling the Worker constructor with the URL of the script that the worker will execute. For example: `let myWorker = new Worker('worker.js');`
    
2. **Send data to the worker**: You can send data to the worker using the `postMessage` method. For example: `myWorker.postMessage([first.value, second.value]);`
    
3. **Receive data from the worker**: You can receive data from the worker by listening for the `message` event. For example: `myWorker.onmessage = function(e) { result.textContent = e.data; }`
    
4. **Terminate the worker**: When you're done with a worker, you can terminate it using the `terminate` method. For example: `myWorker.terminate();`

Thank you for reading me ^-^.



# I am so sorry...
- I wanted to create an engine to play against but I have wrote such a bad code that I have to start over and build my board from ground up. 
- I will give it another try but for now I need to finish CS50x because I have been doing this course for over than 6 months now.
- I'm sorry if I don't have what it takes but I promise that I will try to get better day by day.
- I will submit my project without defining a chess engine worker.