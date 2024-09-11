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
    if((isWhiteTurn && pieceColor == "white") || (!isWhiteTurn && pieceColor == "black"))
        ev.dataTransfer.setData("text", piece.id); //send the selected piece Id data once dragged
}

function drop(ev){
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text"); //receive the selected piece Id data once dropped
    const piece = document.getElementById(data); //get the selected piece object based on the piece id
    const destinationSquare = ev.currentTarget; //current Target refer to the destination of the pieces
    let destinationSquareId = destinationSquare.id;

    if(isSquareOccupied(destinationSquare)=="blank"){
        destinationSquare.appendChild(piece); //append the piece object to destination square object as a child
        isWhiteTurn = !isWhiteTurn; //set it to false/true after each pieces move
        return;
    }
    if(isSquareOccupied(destinationSquare)!="blank" && isSquareOccupied(destinationSquare)!=piece.getAttribute("color")){
        while(destinationSquare.firstChild){
            destinationSquare.removeChild(destinationSquare.firstChild);
        }
        destinationSquare.appendChild(piece); //append the piece object to destination square object as a child
        isWhiteTurn = !isWhiteTurn; //set it to false/true after each pieces move
        return;
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