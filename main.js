//<------------setting up chess board and pieces------------>
let legalSquares = [];
let isWhiteTurn = true;
const boardSquares = document.getElementsByClassName("square");//square object
const pieces = document.getElementsByClassName("piece");//peice object
const piecesImages = document.getElementsByTagName("img");//piece image object

setupBoardSquares();
setupPieces();
function setupBoardSquares() {
    for(let i = 0; i<boardSquares.length; i++){
        //add the dragover and drop event and respective functions
        boardSquares[i].addEventListener("dragover", allowDrop);
        boardSquares[i].addEventListener("drop", drop);

        //calculate the row and column of each square and assigns an ID to the square in the format column+row
        let row = 8 - Math.floor(i/8);
        let column = String.fromCharCode(97+(i%8)); //convert ASCII value to character
        let square = boardSquares[i];
        square.id = column+row;
    }
}

function setupPieces(){
    for(let i=0; i<pieces.length; i++){
        //call the drag function when the piece objects are getting dragged and set draggable attribute to true for each pieces
        pieces[i].addEventListener("dragstart", drag);
        pieces[i].setAttribute("draggable", true);
        //the second class name after " " concantenate with the id of squares (parent element) that has been setup in the setupBoardSquares function
        pieces[i].id = pieces[i].className.split(" ")[1]+pieces[i].parentElement.id;
    }

    for(let i=0; i<piecesImages.length; i++){
        //to avoid images from getting drag
        piecesImages[i].setAttribute("draggable", false);
    }
}

function allowDrop(ev){
    //by default, an element cannot be dropped on another element. PreventDefault cancels this default behaviour
    ev.preventDefault();
}

function drag(ev){
    const piece = ev.target; //refers to the HTML element triggers the drag event
    const pieceColor = piece.getAttribute("color");
    //allow pieces taking turns
    if((isWhiteTurn && pieceColor == "white") || (!isWhiteTurn && pieceColor == "black")){
        ev.dataTransfer.setData("text", piece.id); //send the selected piece Id data once dragged

        //retrieve the ID of the starting square
        const startingSquareId = piece.parentNode.id;
        //call the possible moves function
        getPossibleMoves(startingSquareId, piece);
    }
        
    

}

function drop(ev){
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text"); //receive the selected piece Id data once dropped
    const piece = document.getElementById(data); //get the selected piece object based on the piece id
    const destinationSquare = ev.currentTarget; //current Target refer to the destination of the pieces
    let destinationSquareId = destinationSquare.id;

    //check if the square is occupied by any pieces and if the destination square exist in the legal Squares array
    if((isSquareOccupied(destinationSquare)=="blank") && (legalSquares.includes(destinationSquareId))){
        destinationSquare.appendChild(piece); //append the piece object to destination square object as a child
        isWhiteTurn = !isWhiteTurn; //set it to false/true after each pieces move
        legalSquares.length = 0;
        return;
    }

    //check if the square is occupied by any pieces and if the destination square exist in the legal Squares array
    if((isSquareOccupied(destinationSquare)!="blank" && isSquareOccupied(destinationSquare)!=piece.getAttribute("color")) && (legalSquares.includes(destinationSquareId))){
        while(destinationSquare.firstChild){
            destinationSquare.removeChild(destinationSquare.firstChild);
        }
        destinationSquare.appendChild(piece); //append the piece object to destination square object as a child
        isWhiteTurn = !isWhiteTurn; //set it to false/true after each pieces move
        legalSquares.length = 0;
        return;
    }
    
}

function getPossibleMoves(startingSquareId, piece){
    const pieceColor = piece.getAttribute("color");
    if(piece.classList.contains("pawn")){
        getPawnMoves(startingSquareId, pieceColor);
    }
}


function isSquareOccupied(square){
    //piece at the destination square
    if(square.querySelector(".piece")){
        const color = square.querySelector(".piece").getAttribute("color");
        return color;
    } else { 
        return "blank";
    }
}

//Pawn Legal Moves
function getPawnMoves(startingSquareId, pieceColor){
    checkPawnDiagonalCaptures(startingSquareId, pieceColor);
    checkPawnForwardMoves(startingSquareId, pieceColor);
}

function checkPawnDiagonalCaptures(startingSquareId, pieceColor){   
    //  By separating the file and rank, you can easily manipulate them independently. For example, if you want to move the piece to the next square, you would need to increment the rank or change the file.
    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    let currentFile = file;
    let currentRank = rankNumber;
    let currentSquareId = currentFile+currentRank;
    let currentSquare = document.getElementById(currentSquareId);
    let squareContent = isSquareOccupied(currentSquare);

    const direction = pieceColor == "white" ? 1: -1; //if the color is white (+1) else if black (-1)

    currentRank += direction;
    //check the diagonal squares
    for(let i = -1; i<=1; i+=2){
        currentFile = String.fromCharCode(file.charCodeAt(0)+i);//convert from alphabet to ASCII value and add it with i and then convert it back to alphabet
        if(currentFile>="a" && currentFile<="h"){
            currentSquareId = currentFile + currentRank;
            currentSquare = document.getElementById(currentSquareId);
            squareContent = isSquareOccupied(currentSquare);
            if(squareContent != "blank" && squareContent != pieceColor){
                legalSquares.push(currentSquareId);
            }
        }
    }

}

function checkPawnForwardMoves(startingSquareId, pieceColor){
    //  By separating the file and rank, you can easily manipulate them independently. For example, if you want to move the piece to the next square, you would need to increment the rank or change the file.
    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    let currentFile = file;
    let currentRank = rankNumber;
    let currentSquareId = currentFile+currentRank;
    let currentSquare = document.getElementById(currentSquareId);
    let squareContent = isSquareOccupied(currentSquare);

    //pawn forward moves code segment
    const direction = pieceColor == "white" ? 1: -1;//convert from alphabet to ASCII value and add it with i and then convert it back to alphabet
    currentRank += direction;
    currentSquareId = currentFile + currentRank;
    currentSquare = document.getElementById(currentSquareId);
    squareContent = isSquareOccupied(currentSquare);
    if(squareContent != "blank"){
        return; //it only allow the forward squareId to be push into the legal squares if it is blank
    }
    legalSquares.push(currentSquareId);


    if(rankNumber != 2 && rankNumber != 7) return; //checks whether the pawn is at rank 7 or 2 and return if true. This is important to control whether the pawn are able to move two squares ahead
    currentRank += direction;
    currentSquareId = currentFile + currentRank;
    currentSquare = document.getElementById(currentSquareId);
    squareContent = isSquareOccupied(currentSquare);
    if(squareContent != "blank"){
        return;
    }
    legalSquares.push(currentSquareId);
}