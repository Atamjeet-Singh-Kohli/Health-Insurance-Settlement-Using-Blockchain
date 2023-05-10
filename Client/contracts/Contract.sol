// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21;

import "./Roles.sol";

contract Contract {
    using Roles for Roles.Role;

    Roles.Role private admin;
    Roles.Role private doctor;
    Roles.Role private patient;
    Roles.Role private agent;

    struct Doctor {
        string drHash;
    }

    struct Patient {
        string patHash;
    }

    struct MedRec {
        string RecordHash;
    }

    // +++

    struct Agent {
        address aID;
        string pwd;
    }

    struct Bill {
        uint256 id;
        uint256 bID;
        uint256 cID;
        address pID;
        string amount;
        string status;
    }

    struct Claim {
        uint256 id;
        uint256 bID;
        address pID;
        address aID;
        string status;
        string amount;
    }

    mapping(address => Doctor) Doctors;
    mapping(address => Patient) Patients;
    mapping(address => MedRec) Records;

    mapping(address => Agent) aMap;
    mapping(uint256 => Bill) bMap;
    mapping(uint256 => Claim) cMap;

    mapping(address => Bill[]) bMaps;
    mapping(address => Claim[]) uClaimMap;
    mapping(address => Claim[]) aClaimMap;

    address[] public Dr_ids;
    address[] public Patient_ids;
    string[] public RecordHashes;

    address accountId;
    address admin_id;
    address get_patient_id;
    address get_dr_id;

    Bill[] bills;
    Claim[] claims;
    uint256 cID;
    uint256 bID;

    constructor() {
        admin_id = msg.sender;
        admin.add(admin_id);

        cID = 0;
        bID = 0;
    }

    //get Admin

    function getAdmin() public view returns (address) {
        return admin_id;
    }

    //Add Doctor

    function addDoctor(address _newdr) public {
        require(admin.has(msg.sender), "Only For Admin");
        doctor.add(_newdr);
    }

    function delDoctor(address docID) public {
        require(admin.has(msg.sender), "Only For Admin");
        doctor.remove(docID);
    }

    // check is Doctor

    function isDr(address id) public view returns (string memory) {
        require(doctor.has(id), "Only for Doctors");
        return "1";
    }

    // Check is Patient

    function isPat(address id) public view returns (string memory) {
        require(patient.has(id), "Only for Doctors");
        return "1";
    }

    // Check is Agent
    function isAgent(address id) public view returns (bool) {
        return agent.has(id);
    }

    //  Add patient

    function addPatient(address _newpatient) external onlyAdmin {
        patient.add(_newpatient);
    }

    // Get Patient Information => retrun pateint IPFS hash

    function getPatInfo(address iD) public view returns (string memory) {
        return (Patients[iD].patHash);
    }

    // Add patient Information to BlockChain

    function addPatInfo(address pat_id, string memory _patInfoHash) public {
        Patient storage patInfo = Patients[pat_id];
        patInfo.patHash = _patInfoHash;
        Patient_ids.push(pat_id);

        patient.add(pat_id);
    }

    // Add Medical record to block chain

    function addMedRecord(string memory _recHash, address _pat_id) public {
        require(doctor.has(msg.sender) == true, "Only Doctor Can Do That");

        MedRec storage record = Records[_pat_id];
        record.RecordHash = _recHash;
        RecordHashes.push(_recHash);
    }

    // View Medical record return IPFS hash of record

    function viewMedRec(address id) public view returns (string memory) {
        return (Records[id].RecordHash);
    }

    // Insurance

    function addAgent(address _aID) public {
        require(!admin.has(_aID), "userID is Admin");
        require(!agent.has(_aID), "userId is Agent");
        require(!patient.has(_aID), "UserId is Patient");
        require(!doctor.has(_aID), "UserId is Patient");
        Agent storage a = aMap[_aID];
        a.aID = _aID;
        a.pwd = "password";

        agent.add(_aID);
    }

    function addBill(
        uint256 _id,
        address _pID,
        string memory _amount,
        string memory _status
    ) public {
        bID++;
        Bill storage b = bMap[bID];
        b.id = bID;
        b.bID = _id;
        b.pID = _pID;
        b.amount = _amount;
        b.status = _status;

        Bill[] storage bs = bMaps[_pID];
        bs.push(b);

        bills.push(b);
    }

    function getBills(address _id) public view returns (Bill[] memory) {
        Bill[] memory _bills = new Bill[](bMaps[_id].length);
        uint256 j = 0;
        for (uint256 i = 0; i <= bills.length; i++) {
            if (bMap[i].pID == _id) {
                _bills[j++] = bMap[i];
            }
        }
        return _bills;
    }

    function getAllBills() public view returns (Bill[] memory) {
        Bill[] memory _bills = new Bill[](bills.length);
        uint256 j = 0;
        for (uint256 i = 0; i < bills.length; i++) {
            _bills[j++] = bMap[i + 1];
        }
        return _bills;
    }

    function updateInsurance(
        uint256 _id,
        string memory _status,
        uint256 _cID
    ) public {
        Bill storage b = bMap[_id];
        b.status = _status;
        b.cID = _cID;
    }

    function claimInsurance(
        uint256 _bID,
        address _pID,
        address _aID,
        string memory _amount,
        string memory _status
    ) public {
        cID++;
        Claim storage c = cMap[cID];

        c.id = cID;
        c.bID = _bID;
        c.pID = _pID;
        c.aID = _aID;
        c.amount = _amount;
        c.status = _status;

        updateInsurance(_bID, _status, cID);

        claims.push(c);
    }

    function getUserClaims(address _pID) public view returns (Claim[] memory) {
        Claim[] memory _claims = new Claim[](claims.length);
        uint256 j = 0;
        for (uint256 i = 0; i <= bills.length; i++) {
            if (cMap[i].pID == _pID) {
                _claims[j++] = cMap[i];
            }
        }
        return _claims;
    }

    function getAgentClaims(address _aID) public view returns (Claim[] memory) {
        Claim[] memory _claims = new Claim[](claims.length);
        uint256 j = 0;
        for (uint256 i = 0; i <= bills.length; i++) {
            if (cMap[i].aID == _aID) {
                _claims[j++] = cMap[i];
            }
        }
        return _claims;
    }

    function updateClaim(uint256 _cID, string memory _status) public {
        Claim storage c = cMap[_cID];
        c.status = _status;
    }

    function acceptClaim(uint256 _cID, uint256 _bID) public {
        require(agent.has(msg.sender), "Only Agency Can Access this function");
        string memory _status = "Claim Accepted";
        updateClaim(_cID, _status);
        updateInsurance(_bID, _status, _cID);
    }

    function rejectClaim(uint256 _cID, uint256 _bID) public {
        require(agent.has(msg.sender), "Only Agency Can Access this function");
        string memory _status = "Claim Rejected";
        updateClaim(_cID, _status);
        updateInsurance(_bID, _status, _cID);
    }

    function sendPayment(uint256 _cID, uint256 _bID) public {
        string memory _status = "Bill Payed";
        updateClaim(_cID, _status);
        updateInsurance(_bID, _status, _cID);
    }

    /*
        Modifiers
    */

    modifier onlyAdmin() {
        require(admin.has(msg.sender) == true, "Only Admin Can Do That");
        _;
    }
    modifier onlyDoctor() {
        require(doctor.has(msg.sender) == true, "Only Doctor Can Do That");
        _;
    }
    modifier onlyPatient() {
        require(patient.has(msg.sender) == true, "Only Admin Can Do That");
        _;
    }
}
