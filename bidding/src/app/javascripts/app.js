// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import bidding_artifacts from '../../build/contracts/Bidding.json'

var Bidding = contract(bidding_artifacts);

window.addEventListener('load', function() {
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://"+location.hostname+"/jsonrpc"));
    Bidding.setProvider(web3.currentProvider);
    var buyerAddrs = web3.eth.accounts[2];
    var sellerAddrs = web3.eth.accounts[3];
    var buyerBalance = web3.eth.getBalance(buyerAddrs);
    var sellerBalance = web3.eth.getBalance(sellerAddrs);
    document.getElementById("buyer_balance").innerHTML = "Buyer:" + (buyerBalance / 1000000000000000000);
    document.getElementById("seller_balance").innerHTML = "Seller:" +  (sellerBalance / 1000000000000000000);


})

window.balance=function() {
    Bidding.deployed().then(function(instance) {
        var contractAddr = instance.address;
        var contractBal = web3.eth.getBalance(contractAddr);
        document.getElementById("contractBalance").innerHTML = contractBal;
    })
}

window.projectCreation = function() {
    var projectName = document.getElementById ("pname").value;
    var description = document.getElementById ("pdetail").value;
    var buyerAddrs = web3.eth.accounts[2];
    var pvalue = document.getElementById("pvalue").value;
    pvalue = pvalue * 1000000000000000000;
    Bidding.deployed().then(function(instance) {
        return instance.createProject(projectName, description, pvalue, {from:buyerAddrs, gas:900000}) }).then(function(){
        getProjectId();
    })
}

window.getProjectId =function() {
    Bidding.deployed().then(function(instance) {
    return instance.getprojectID() }).then(function(result) {
        var pid = result;
        getPro(pid);
    })
}

window.getPro = function(pid) {
    console.log(pid);
    Bidding.deployed().then(function(instance) {
        return instance.getProject(pid)}).then(function(result) {
            var pvalue = result[2];
            var Project_status = '';
            pvalue = pvalue / 1000000000000000000;
            if(result[4] == 1) {
               Project_status = "Open";
            }
            var project_state = "";
            if (result[3]== 1) {
              project_state = "Open";
            }

            var table = document.getElementById("projectListTable");
            var y = $('#projectListTable tr').length;
            var row = table.insertRow(y);
            row.innerHTML = '<tr><td> <input  onclick="load_bid(\''+result[0]+'\','+result[4]+' )" type="radio" name="prj_select" value="'+result[4]+'"> </td>'+
                '<td >'+ result[0] +'</td><td >'+ result[1] +'</td><td >'+ pvalue +'</td>'+
                '<td id="prj_state'+result[4]+'">'+project_state+'</td>';
        });
}

window.load_bid= function(p_name, proId){
   $('#bName').val(p_name);
   $('#proId').val(proId);
}

window.totalval = function(id) {
   var amt = $('#'+id).val();
   $('#id_total_value').val(amt*2);
}

window.createBid = function() {
    var sellerAddrs = web3.eth.accounts[3];
    var amount = document.getElementById("bAmount").value;
    amount = amount*2;
    amount = amount * 1000000000000000000;
    var name = document.getElementById("bName").value;
    var prjId = document.getElementById("proId").value;
    Bidding.deployed().then(function(instance) {
        return instance.createBid(name,prjId, {from:sellerAddrs, value:amount, gas:900000}) }).then(function(){
        getBidId();
        getBalance();
    })
}

window.getBidId = function() {
  Bidding.deployed().then(function(instance) {
  return instance.getbidID() }).then(function(result) {
    var bid = result;
    getBid(bid);
  })
}

window.getBid = function(bid) {
   var sellerAddrs = web3.eth.accounts[3];
   Bidding.deployed().then(function(instance) {
       return instance.getBid(bid)}).then(function(resultbid) {
           console.log(resultbid);
           var bidamount = resultbid[1];
           bidamount = bidamount / 1000000000000000000;
           var bid_state ='';
           if(resultbid[2] == 1) {
              var bid_state = "Open";
           }

           var table2 = document.getElementById("bid_list_tabel");
           var y2 = $('#bid_list_tabel tr').length;
           var row2 = table2.insertRow(y2);
           row2.innerHTML = '<tr> '+
               '<td >'+ resultbid[0] +'</td><td >'+ bidamount +'</td><td id = "bid_list_state'+resultbid[3]+'" >'+ bid_state +'</td>'+
               '<td id = "action_td'+resultbid[3]+'"><button type="button" name="button" class="btn btn-success" id = "action_accept_btn'+resultbid[3]+'" onclick="acceptBid('+resultbid[3]+','+resultbid[1]+', '+resultbid[4]+')">Accept</button>'+
               '<button type="button" name="button" class="btn btn-danger"  id = "action_reject_btn'+resultbid[3]+'" onclick="rejectBid(\''+resultbid[3]+'\','+resultbid[4]+')">Reject</button>'+
               '<button style= "display : none;" type="button" name="button" class="btn btn-danger"  id = "action_conform_btn'+resultbid[3]+'" onclick="itemReceived(\''+resultbid[3]+'\','+resultbid[4]+')">Confirm</button>' +
            '</td>';
            getBalance();
       })
}

window.acceptBid = function(bid_id, bid_amount, prj_id) {
    var buyerAddrs = web3.eth.accounts[2];
    var proBidAmount = bid_amount*2;
    Bidding.deployed().then(function(instance) {
        return instance.acceptBid(bid_id,prj_id, {from:buyerAddrs, value:proBidAmount});
        getBalance();}).then(function() {
        var result = getBidState(bid_id, prj_id);
    })
}

//After AcceptBid function this function returns the bidState
window.getBidState = function(bid_id, prj_id) {
  Bidding.deployed().then(function(instance) {
  return instance.getacceptBid()}).then(function(result) {
    console.log(result);
    console.log(result.toString());
    var bidState = result[0];
    var prj_state = result[2];
    var result_prj_id = result[1];

    if(bidState == 2) {
      console.log("confimr called and accept Reject to hid");
       $('#bid_list_state'+bid_id).html( "Accepted");
       $('#action_accept_btn'+bid_id).hide();
       $('#action_reject_btn'+bid_id).hide();
       $('#action_conform_btn'+bid_id).show();
       if (prj_state == 2) {
         $('#prj_state'+prj_id).html( "In Process");

       }
    }
    getBalance();

  })
}


window.rejectBid = function(bid_id,prj_id) {
    console.log("bid id : " + bid_id);
    var buyerAddrs = web3.eth.accounts[2];
    Bidding.deployed().then(function(instance) {
        return instance.rejectBid(bid_id,{from:buyerAddrs});
        getBalance();}).then(function() {
        var result = getRejectState(bid_id,prj_id);
    })
}

//After RejectBid function this function returns the bidState
window.getRejectState = function(bid_id, prj_id) {
  Bidding.deployed().then(function(instance) {
  return instance.getrejectBid()}).then(function(result) {
    console.log(result);
    if(result == 3) {
       console.log("if called");
       $('#action_accept_btn'+bid_id).hide();
       $('#action_reject_btn'+bid_id).hide();
       $('#action_conform_btn'+bid_id).hide();
       $('#bid_list_state'+bid_id).html( "Rejected");
       getBalance();
    }

  })
}

window.itemReceived = function(bid_id,prj_id) {
    var buyerAddrs = web3.eth.accounts[2];
     Bidding.deployed().then(function(instance) { instance.itemReceived(bid_id,prj_id, {from:buyerAddrs}) }).then(function(result) {
        var result = itemReceive(bid_id, prj_id);

     })
}

window.itemReceive = function(bid_id, prj_id) {
  Bidding.deployed().then(function(instance) {
  return instance.geitemReceived()}).then(function(result) {
    console.log(result);
    getBalance();
    if(result[1] == 3) {
     console.log("executes if");
      $('#prj_state'+prj_id).html( "Closed");
     console.log(prj_id);
      getBalance();

   }
  })
}

window.getBalance = function() {
    var buyerAddrs = web3.eth.accounts[2];
    var sellerAddrs = web3.eth.accounts[3];
    var buyerBalance = web3.eth.getBalance(buyerAddrs);
    var sellerBalance = web3.eth.getBalance(sellerAddrs);
    document.getElementById("buyer_balance").innerHTML = "Buyer:" + " " + (buyerBalance / 1000000000000000000);
    document.getElementById("seller_balance").innerHTML = "Seller:" + " " + (sellerBalance / 1000000000000000000);
}

