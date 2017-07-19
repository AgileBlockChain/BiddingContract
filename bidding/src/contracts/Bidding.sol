pragma solidity ^0.4.11;

contract Bidding {

    enum ProjectState { NULL, OPEN, INPROCESS, CLOSED }
    ProjectState public projectState;
    enum BidState { NULL, OPEN, ACCEPTED, REJECTED }
    BidState public state;
    address buyerAddress;
    address sellerAddress;

    struct Project {
        string  proname;
        string desc;
        uint price;
    }

    struct Bid {
        address bidAddress;
        string name;
        uint amount;
        uint proId;
        BidState state;
    }

    mapping (uint  => Bid) bid;
    uint [] bidIndex;
    uint bidID;
    mapping (uint => Project) projects;
    uint [] projectIndex;
    uint projectID;

    function createProject(string proname, string desc, uint price) {
        buyerAddress = msg.sender;
        projectID = projectIndex.length;
        projects[projectID].proname = proname;
        projects[projectID].desc = desc;
        projects[projectID].price = price ;
        projectIndex.push(projectID);
    }

    function getprojectID() constant returns(uint projectId) {
       return  projectID;
    }

    function getProject(uint _projectID )
    public constant returns  (string proname, string desc, uint price, ProjectState, uint )  {
        buyerAddress = buyerAddress;
        projectID =_projectID;
        return (
            projects[projectID].proname,
            projects[projectID].desc,
            projects[projectID].price,
            ProjectState.OPEN,
            projectID
        );
    }

    function createBid (string name, uint proId) payable  {
        bidID = bidIndex.length;
        bid[bidID].bidAddress = msg.sender;
        bid[bidID].name = name;
        bid[bidID].amount = msg.value / 2;
        bid[bidID].proId = proId;
        bidIndex.push(bidID);
    }

    function getbidID() constant returns(uint bidId ) {
       return  bidID;
    }

    function getBid(uint bidID)
    constant returns (string name, uint amount, BidState, uint, uint proId) {
        return (
            bid[bidID].name,
            bid[bidID].amount,
            BidState.OPEN,
            bidID,
            bid[bidID].proId
        );
    }

    function getBalance(address x) returns (uint balance) {
        return x.balance;
    }

    function acceptBid(uint bidId, uint proId) payable {
        if (msg.value == bid[bidID].amount*2) {
            bidID = bidId;
            sellerAddress = bid[bidID].bidAddress;
            sellerAddress.transfer((bid[bidID].amount)*2);
        }
    }

    function getacceptBid() constant returns(BidState, uint, ProjectState) {
       return  (BidState.ACCEPTED, bid[bidID].proId, ProjectState.INPROCESS);
    }

    function itemReceived(uint bidId, uint proId ) {
        buyerAddress == msg.sender;
        bidID = bidId;
        sellerAddress = bid[bidID].bidAddress;
        sellerAddress.transfer(bid[bidID].amount);
        buyerAddress.transfer(bid[bidID].amount);
    }

    function geitemReceived() constant returns(uint, ProjectState) {
       return  (bid[bidID].proId, ProjectState.CLOSED);
    }

    function rejectBid(uint bidId)  {
        bidID = bidId;
        sellerAddress = bid[bidID].bidAddress;
        sellerAddress.transfer((bid[bidID].amount)*2); 
    }

    function getrejectBid() constant returns(BidState) {
       return  BidState.REJECTED;
    }

}

