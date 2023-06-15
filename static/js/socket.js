var auctionCode = document.getElementById("auction_header").getAttribute("auction_id");

var connectionString = 'ws://' + window.location.host + '/ws/live/' + auctionCode + '/';

var auctionsocket = new WebSocket(connectionString);

const bidbutton = document.getElementsByClassName('btn btn-primary');

bidbutton[1].addEventListener("click", updatebid);


function updatebid(){
    const my_bid = document.getElementById('id_amount').value
    
    var curr_bid= document.getElementById("current_bid_header").getAttribute("curr_bid");
    
    if( isNaN(Number(curr_bid)) ){
        var starting_bid = document.getElementById("starting_bid").getAttribute("starting_bid");
        
        if( my_bid < Number(starting_bid)){
            document.getElementById("warning").innerHTML += "<div class='alert alert-warning' role='alert'>Your bid must be greater than or equal to<strong>&euro;"+ starting_bid +"</strong>.</div>"
        }
        else{
            element = document.getElementById("warning")
            if(element){
                element.innerHTML = ""
            }
            let data = {
                "user": document.getElementById("auction_header").getAttribute("user"),
                "curr_bid": my_bid
            }
            auctionsocket.send(JSON.stringify(data))

            window.location.reload();
        }
    }
    else {
        var curr_bid = Number(document.getElementById('current_bid').innerHTML);

        if( my_bid <= Number(curr_bid)){
            document.getElementById("warning").innerHTML += "<div class='alert alert-warning' role='alert'>Your bid must be greater than <strong>&euro;"+ curr_bid + "</strong>.</div>"
        }
        else{
            element = document.getElementById("warning")
            if(element){
                element.innerHTML = ""
            }
            let data = {
                "user": document.getElementById("auction_header").getAttribute("user"),
                "curr_bid": my_bid
            }
            auctionsocket.send(JSON.stringify(data))
        }
    }
}

auctionsocket.onmessage = function(e){
    const data = JSON.parse(e.data);
    
    document.getElementById('current_bid').innerHTML = data['curr_bid']

    // document.getElementById('current_bid_user').innerHTML = data['user']

    document.getElementById('current_bid_header').innerHTML = data['curr_bid']
}
