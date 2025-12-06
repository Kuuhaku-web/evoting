// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title BinusUKMVoting
 * @dev Smart Contract untuk E-Voting Unit Kegiatan Mahasiswa BINUS University
 */
contract BinusUKMVoting {
    
    // Struct untuk Kandidat
    struct Candidate {
        uint256 id;
        string name;
        string description;
        string imageUrl;
        uint256 voteCount;
        bool isActive;
    }
    
    // Struct untuk Kategori UKM
    struct Category {
        uint256 id;
        string name;
        string description;
        bool isActive;
        uint256 totalVotes;
        uint256[] candidateIds;
    }
    
    // State Variables
    address public admin;
    bool public votingActive;
    uint256 public categoryCount;
    uint256 public candidateCount;
    
    // Mappings
    mapping(uint256 => Category) public categories;
    mapping(uint256 => Candidate) public candidates;
    mapping(uint256 => mapping(uint256 => bool)) public categoryHasCandidate; // categoryId => candidateId => exists
    mapping(address => mapping(uint256 => bool)) public hasVoted; // voter => categoryId => hasVoted
    mapping(address => mapping(uint256 => uint256)) public voterChoice; // voter => categoryId => candidateId
    mapping(address => bool) public registeredVoters;
    
    // Events
    event VoterRegistered(address indexed voter);
    event CategoryCreated(uint256 indexed categoryId, string name);
    event CandidateAdded(uint256 indexed candidateId, uint256 indexed categoryId, string name);
    event VoteCast(address indexed voter, uint256 indexed categoryId, uint256 indexed candidateId);
    event VotingStatusChanged(bool active);
    event CandidateStatusChanged(uint256 indexed candidateId, bool active);
    event CategoryStatusChanged(uint256 indexed categoryId, bool active);
    
    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    modifier votingIsActive() {
        require(votingActive, "Voting is not active");
        _;
    }
    
    modifier votingIsNotActive() {
        require(!votingActive, "Voting is currently active");
        _;
    }
    
    modifier onlyRegisteredVoter() {
        require(registeredVoters[msg.sender], "You are not a registered voter");
        _;
    }
    
    // Constructor
    constructor() {
        admin = msg.sender;
        votingActive = false;
        categoryCount = 0;
        candidateCount = 0;
    }
    
    // Admin Functions
    
    /**
     * @dev Mengubah admin contract
     */
    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid address");
        admin = newAdmin;
    }
    
    /**
     * @dev Memulai atau menghentikan voting
     */
    function toggleVoting() external onlyAdmin {
        votingActive = !votingActive;
        emit VotingStatusChanged(votingActive);
    }
    
    /**
     * @dev Membuat kategori UKM baru
     */
    function createCategory(
        string memory _name,
        string memory _description
    ) external onlyAdmin votingIsNotActive returns (uint256) {
        categoryCount++;
        
        categories[categoryCount] = Category({
            id: categoryCount,
            name: _name,
            description: _description,
            isActive: true,
            totalVotes: 0,
            candidateIds: new uint256[](0)
        });
        
        emit CategoryCreated(categoryCount, _name);
        return categoryCount;
    }
    
    /**
     * @dev Menambahkan kandidat ke kategori
     */
    function addCandidate(
        uint256 _categoryId,
        string memory _name,
        string memory _description,
        string memory _imageUrl
    ) external onlyAdmin votingIsNotActive returns (uint256) {
        require(_categoryId > 0 && _categoryId <= categoryCount, "Invalid category");
        require(categories[_categoryId].isActive, "Category is not active");
        
        candidateCount++;
        
        candidates[candidateCount] = Candidate({
            id: candidateCount,
            name: _name,
            description: _description,
            imageUrl: _imageUrl,
            voteCount: 0,
            isActive: true
        });
        
        categories[_categoryId].candidateIds.push(candidateCount);
        categoryHasCandidate[_categoryId][candidateCount] = true;
        
        emit CandidateAdded(candidateCount, _categoryId, _name);
        return candidateCount;
    }
    
    /**
     * @dev Mengaktifkan/menonaktifkan kandidat
     */
    function toggleCandidateStatus(uint256 _candidateId) external onlyAdmin {
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate");
        candidates[_candidateId].isActive = !candidates[_candidateId].isActive;
        emit CandidateStatusChanged(_candidateId, candidates[_candidateId].isActive);
    }
    
    /**
     * @dev Mengaktifkan/menonaktifkan kategori
     */
    function toggleCategoryStatus(uint256 _categoryId) external onlyAdmin {
        require(_categoryId > 0 && _categoryId <= categoryCount, "Invalid category");
        categories[_categoryId].isActive = !categories[_categoryId].isActive;
        emit CategoryStatusChanged(_categoryId, categories[_categoryId].isActive);
    }
    
    /**
     * @dev Mendaftarkan voter baru
     */
    function registerVoter(address _voter) external onlyAdmin {
        require(_voter != address(0), "Invalid address");
        require(!registeredVoters[_voter], "Voter already registered");
        
        registeredVoters[_voter] = true;
        emit VoterRegistered(_voter);
    }
    
    /**
     * @dev Mendaftarkan multiple voters sekaligus
     */
    function registerVoters(address[] memory _voters) external onlyAdmin {
        for (uint256 i = 0; i < _voters.length; i++) {
            if (_voters[i] != address(0) && !registeredVoters[_voters[i]]) {
                registeredVoters[_voters[i]] = true;
                emit VoterRegistered(_voters[i]);
            }
        }
    }
    
    // Voting Functions
    
    /**
     * @dev Melakukan voting untuk kandidat dalam kategori tertentu
     */
    function vote(uint256 _categoryId, uint256 _candidateId) 
        external 
        votingIsActive 
        onlyRegisteredVoter 
    {
        require(_categoryId > 0 && _categoryId <= categoryCount, "Invalid category");
        require(categories[_categoryId].isActive, "Category is not active");
        require(!hasVoted[msg.sender][_categoryId], "You have already voted in this category");
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate");
        require(candidates[_candidateId].isActive, "Candidate is not active");
        require(categoryHasCandidate[_categoryId][_candidateId], "Candidate not in this category");
        
        // Record vote
        hasVoted[msg.sender][_categoryId] = true;
        voterChoice[msg.sender][_categoryId] = _candidateId;
        candidates[_candidateId].voteCount++;
        categories[_categoryId].totalVotes++;
        
        emit VoteCast(msg.sender, _categoryId, _candidateId);
    }
    
    // View Functions
    
    /**
     * @dev Mendapatkan detail kandidat
     */
    function getCandidate(uint256 _candidateId) 
        external 
        view 
        returns (
            uint256 id,
            string memory name,
            string memory description,
            string memory imageUrl,
            uint256 voteCount,
            bool isActive
        ) 
    {
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate");
        Candidate memory candidate = candidates[_candidateId];
        return (
            candidate.id,
            candidate.name,
            candidate.description,
            candidate.imageUrl,
            candidate.voteCount,
            candidate.isActive
        );
    }
    
    /**
     * @dev Mendapatkan semua kandidat dalam kategori
     */
    function getCandidatesByCategory(uint256 _categoryId) 
        external 
        view 
        returns (uint256[] memory) 
    {
        require(_categoryId > 0 && _categoryId <= categoryCount, "Invalid category");
        return categories[_categoryId].candidateIds;
    }
    
    /**
     * @dev Mendapatkan detail kategori
     */
    function getCategory(uint256 _categoryId) 
        external 
        view 
        returns (
            uint256 id,
            string memory name,
            string memory description,
            bool isActive,
            uint256 totalVotes,
            uint256 candidateCount_
        ) 
    {
        require(_categoryId > 0 && _categoryId <= categoryCount, "Invalid category");
        Category memory category = categories[_categoryId];
        return (
            category.id,
            category.name,
            category.description,
            category.isActive,
            category.totalVotes,
            category.candidateIds.length
        );
    }
    
    /**
     * @dev Cek apakah user sudah vote di kategori tertentu
     */
    function hasUserVoted(address _voter, uint256 _categoryId) 
        external 
        view 
        returns (bool) 
    {
        return hasVoted[_voter][_categoryId];
    }
    
    /**
     * @dev Mendapatkan pilihan voter di kategori tertentu
     */
    function getUserVote(address _voter, uint256 _categoryId) 
        external 
        view 
        returns (uint256) 
    {
        require(hasVoted[_voter][_categoryId], "User has not voted in this category");
        return voterChoice[_voter][_categoryId];
    }
    
    /**
     * @dev Mendapatkan hasil voting untuk kategori
     */
    function getCategoryResults(uint256 _categoryId) 
        external 
        view 
        returns (
            uint256[] memory candidateIds_,
            uint256[] memory voteCounts,
            string[] memory names
        ) 
    {
        require(_categoryId > 0 && _categoryId <= categoryCount, "Invalid category");
        
        uint256[] memory catCandidates = categories[_categoryId].candidateIds;
        uint256 length = catCandidates.length;
        
        candidateIds_ = new uint256[](length);
        voteCounts = new uint256[](length);
        names = new string[](length);
        
        for (uint256 i = 0; i < length; i++) {
            uint256 candidateId = catCandidates[i];
            candidateIds_[i] = candidateId;
            voteCounts[i] = candidates[candidateId].voteCount;
            names[i] = candidates[candidateId].name;
        }
        
        return (candidateIds_, voteCounts, names);
    }
    
    /**
     * @dev Mendapatkan total votes secara keseluruhan
     */
    function getTotalVotes() external view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 1; i <= categoryCount; i++) {
            total += categories[i].totalVotes;
        }
        return total;
    }
    
    /**
     * @dev Cek apakah address adalah voter yang terdaftar
     */
    function isRegisteredVoter(address _voter) external view returns (bool) {
        return registeredVoters[_voter];
    }
}