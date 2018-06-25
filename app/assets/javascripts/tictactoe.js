// Code your JavaScript / jQuery solution here
$(function(){
  //when adding the ability to start a previous game, switch thisGame!!
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
        type: "PUT",
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
      let gameList = "<ul>"
      r.data.forEach(function(game){
        gameList += `<li class="oldGame" data-id="${game["id"]}">` + game["id"] + "<br></li>"
      })
      gameList += "</ul>"
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
      for(let i = 0; i < state.length; i++){
        tdArray[i].textContent = state[i] //assigns state from server to corresponding tds on front-end
      }
    })
  })

  //clears board
  $("#clear").on("click", function(e){
    e.preventDefault()
    $("td").each(function(box){
      box.textContent = ""
    })
  })
})