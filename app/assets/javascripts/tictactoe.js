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
        gameList += `<li class="oldGame" data-id="${game["id"]}">` + game["id"] + "<button>Restore</button></li>"
      })
      gameList += "</ul>"
      $("#games").html(gameList)
    })
  })
  //reloads a previous games
  $("ul button").on("click", function(e){
    e.preventDefault()
    debugger;
    //$.get("/games" + )
  })

})