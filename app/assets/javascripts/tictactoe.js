// Code your JavaScript / jQuery solution here
$(function(){
  //when adding the ability to start a previous game, switch thisGame!!
  window.turn = 0//define a turn
  let thisGame //set a game ID to determine if this game has already been saved
  //saves or updates current game
  $("#save").on("click", function(e){
    e.preventDefault()
    let state = [] //set state array to pass as JSON to rails server
    $("td").each(function(){
      state.push(this.textContent)
    })
    //if this current game has been saved already there will be an ID stored in thisGame
    //if not a new game will be created and saved, and its id will be set as thisGame
    if (!!thisGame) {
      $.ajax({
        url: "/games/" + thisGame,
        type: "PATCH",
        data: {state},
        success: function(r){alert("Game " + r.data["id"] + " updated!")}
      })
    } else {
      $.post('/games', {state}, function(r){
        thisGame = parseInt(r.data["id"])
        alert("New game " + thisGame + " saved!")
      })
    }
  })
  //shows previous games
  $("#previous").on("click", function(e){
    e.preventDefault()
    $.get('/games', function(r){
      let gameList = ""
      r.data.forEach(function(game){
        gameList += `<button class="oldGame" data-id="${game["id"]}">` + game["id"] + "</button>"
      })
      $("#games").html(gameList)
    })
  })
  
  //reloads a previous games
  $("#games").on("click", function(e){
    e.preventDefault()
    const thisID = $(e.target).data("id") //gets id of clicked game via data-id attr
    $.get("/games/" + thisID, function(r){
      thisGame = r.data["id"]//gets id from Rails server and sets as thisGame on the front-end
      let tdArray = $("td") //creates array of td elements
      const state = r.data.attributes["state"] //grabs state of selected game from rails server
      window.turn = state.filter(function(el){return el != ""}).length //counts taken spots on the board and sets the turn
      for(let i = 0; i < state.length; i++){
        tdArray[i].textContent = state[i] //assigns state from server to corresponding tds on front-end
      }
      checkWinner(state)
    })
  })

  //clears board
  $("#clear").on("click", function(e){
    e.preventDefault()
    gameState = []
    window.turn = 0
    thisGame = null //sets current game ID to null/false on front-end to ensure if statement works when saving
    $("td").each(function(){
      this.textContent = "" //sets each td-tag's value to an empty string
    })
  })
  //adds X or O to the board, changes the state, and invokes doTurn()
  $("td").on("click", function(e){
    if(e.target.textContent === ""){
      doTurn(e.target)
    }
  })


})
const winningNumbers = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
let gameState = []

function player(){
  return (window.turn % 2 == 0) ? "X" : "O"
}

function updateState(element){
  gameState = []
  element.textContent = player()
  $("td").each(function(){gameState.push(this.textContent)})
}

function checkWinner(){
  let winner = false
  winningNumbers.forEach(function(nums){
    if (gameState[nums[0]] === gameState[nums[1]] && gameState[nums[1]] === gameState[nums[2]]){
      setMessage(gameState[nums[1]])
      winner = true
    } 
  })
  return winner
}

function setMessage(winner){
  $("#message").html(`<p>Player ${winner} Won!</p>`)
}

function doTurn(element){
  window.turn++
  updateState(element)
  checkWinner()
  debugger;
}
