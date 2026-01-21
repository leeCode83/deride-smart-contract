// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title RideSharing
 * @dev Smart contract untuk aplikasi ride-sharing terdesentralisasi
 * @notice Contract ini mengelola registrasi driver, pemesanan perjalanan, dan escrow payment menggunakan USDC
 */
contract RideSharing is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    
    // ============================================
    // STATE VARIABLES & ENUMS
    // ============================================
    
    // USDC Token Contract
    IERC20 public usdcToken;
    
    /**
     * @dev Enum untuk status pesanan perjalanan
     */
    enum RideStatus {
        Requested,           // Pesanan dibuat oleh penumpang
        Accepted,            // Pesanan diterima oleh driver
        Funded,              // Pembayaran sudah masuk ke escrow
        Started,             // Perjalanan dimulai
        CompletedByDriver,   // Driver sudah selesai
        Finalized,           // Penumpang konfirmasi selesai
        Cancelled            // Pesanan dibatalkan
    }
    
    /**
     * @dev Struct untuk data driver
     */
    struct Driver {
        string name;
        string plateNumber;
        string vehicleType;
        uint256 ratePerKm;      // Tarif per km dalam USDC (6 decimals)
        bool isRegistered;
        bool isAvailable;
    }
    
    /**
     * @dev Struct untuk data pesanan perjalanan
     */
    struct Ride {
        uint256 rideId;
        address rider;              // Alamat penumpang
        address driver;             // Alamat driver
        string pickupLocation;
        string destination;
        uint256 distance;           // Jarak dalam km
        uint256 fare;               // Total biaya perjalanan
        string notes;               // Catatan tambahan
        RideStatus status;
        uint256 createdAt;
    }
    
    // Mapping untuk menyimpan data driver berdasarkan address
    mapping(address => Driver) public drivers;
    
    // Mapping untuk menyimpan pesanan berdasarkan rideId
    mapping(uint256 => Ride) public rides;
    
    // Counter untuk rideId
    uint256 public rideCounter;
    
    // Array untuk menyimpan semua address driver yang terdaftar
    address[] public driverList;
    
    // ============================================
    // EVENTS
    // ============================================
    
    event USDCAddressUpdated(address indexed newUSDCAddress);
    event DriverRegistered(address indexed driverAddress, string name);
    event RideRequested(uint256 indexed rideId, address indexed rider, uint256 fare);
    event RideAccepted(uint256 indexed rideId, address indexed driver);
    event RideFunded(uint256 indexed rideId, uint256 amount);
    event RideStarted(uint256 indexed rideId);
    event RideCompletedByDriver(uint256 indexed rideId);
    event RideFinalized(uint256 indexed rideId, address indexed driver, uint256 fare);
    event RideCancelled(uint256 indexed rideId);
    
    // ============================================
    // MODIFIERS
    // ============================================
    
    /**
     * @dev Modifier untuk memastikan hanya driver yang terdaftar
     */
    modifier onlyDriver() {
        require(drivers[msg.sender].isRegistered, "Not a registered driver");
        _;
    }
    
    /**
     * @dev Modifier untuk memastikan ride exists
     */
    modifier rideExists(uint256 _rideId) {
        require(_rideId < rideCounter, "Ride does not exist");
        _;
    }
    
    // ============================================
    // CONSTRUCTOR
    // ============================================
    
    /**
     * @dev Constructor untuk set USDC token address
     * @param _usdcAddress Address dari USDC token contract
     */
    constructor(address _usdcAddress) Ownable(msg.sender) {
        require(_usdcAddress != address(0), "Invalid USDC address");
        usdcToken = IERC20(_usdcAddress);
        rideCounter = 0;
    }
    
    /**
     * @dev Fungsi untuk update USDC address (jika diperlukan)
     * @param _newUSDCAddress Address baru dari USDC token
     */
    function setUSDCAddress(address _newUSDCAddress) external onlyOwner {
        require(_newUSDCAddress != address(0), "Invalid USDC address");
        usdcToken = IERC20(_newUSDCAddress);
        emit USDCAddressUpdated(_newUSDCAddress);
    }
    
    // ============================================
    // DRIVER FUNCTIONS
    // ============================================
    
    /**
     * @dev Fungsi untuk registrasi driver baru
     * @param _name Nama driver
     * @param _plateNumber Nomor plat kendaraan
     * @param _vehicleType Tipe kendaraan
     * @param _ratePerKm Tarif per km dalam USDC (dengan 6 decimals, contoh: 1000000 = 1 USDC)
     */
    function registerDriver(
        string memory _name,
        string memory _plateNumber,
        string memory _vehicleType,
        uint256 _ratePerKm
    ) external {
        require(!drivers[msg.sender].isRegistered, "Driver already registered");
        require(_ratePerKm > 0, "Rate must be greater than 0");
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        drivers[msg.sender] = Driver({
            name: _name,
            plateNumber: _plateNumber,
            vehicleType: _vehicleType,
            ratePerKm: _ratePerKm,
            isRegistered: true,
            isAvailable: true
        });
        
        driverList.push(msg.sender);
        
        emit DriverRegistered(msg.sender, _name);
    }
    
    /**
     * @dev Fungsi untuk mendapatkan data driver
     * @param _driverAddress Address driver
     * @return Driver struct
     */
    function getDriver(address _driverAddress) external view returns (Driver memory) {
        require(drivers[_driverAddress].isRegistered, "Driver not registered");
        return drivers[_driverAddress];
    }
    
    /**
     * @dev Fungsi untuk mendapatkan jumlah driver terdaftar
     */
    function getDriverCount() external view returns (uint256) {
        return driverList.length;
    }
    
    // ============================================
    // RIDE FUNCTIONS
    // ============================================
    
    /**
     * @dev Fungsi untuk penumpang membuat pesanan perjalanan
     * @param _pickupLocation Lokasi jemput
     * @param _destination Tujuan
     * @param _distance Jarak estimasi dalam km
     * @param _notes Catatan tambahan (opsional)
     * @return rideId ID pesanan yang dibuat
     */
    function requestRide(
        string memory _pickupLocation,
        string memory _destination,
        uint256 _distance,
        string memory _notes
    ) external returns (uint256) {
        require(_distance > 0, "Distance must be greater than 0");
        require(bytes(_pickupLocation).length > 0, "Pickup location cannot be empty");
        require(bytes(_destination).length > 0, "Destination cannot be empty");
        
        uint256 newRideId = rideCounter;
        
        rides[newRideId] = Ride({
            rideId: newRideId,
            rider: msg.sender,
            driver: address(0),
            pickupLocation: _pickupLocation,
            destination: _destination,
            distance: _distance,
            fare: 0,  // Akan dihitung saat driver accept
            notes: _notes,
            status: RideStatus.Requested,
            createdAt: block.timestamp
        });
        
        rideCounter++;
        
        emit RideRequested(newRideId, msg.sender, 0);
        
        return newRideId;
    }
    
    /**
     * @dev Fungsi untuk driver menerima pesanan
     * @param _rideId ID pesanan yang akan diterima
     */
    function acceptRide(uint256 _rideId) 
        external 
        onlyDriver 
        rideExists(_rideId) 
    {
        Ride storage ride = rides[_rideId];
        
        require(ride.status == RideStatus.Requested, "Ride not available");
        require(drivers[msg.sender].isAvailable, "Driver not available");
        
        // Hitung fare berdasarkan distance dan rate driver
        uint256 calculatedFare = ride.distance * drivers[msg.sender].ratePerKm;
        
        ride.driver = msg.sender;
        ride.fare = calculatedFare;
        ride.status = RideStatus.Accepted;
        
        drivers[msg.sender].isAvailable = false;
        
        emit RideAccepted(_rideId, msg.sender);
    }
    
    /**
     * @dev Fungsi untuk penumpang membayar ke escrow (smart contract) menggunakan USDC
     * @param _rideId ID pesanan yang akan dibayar
     * @notice Penumpang harus approve USDC terlebih dahulu sebelum memanggil fungsi ini
     */
    function fundRide(uint256 _rideId) 
        external 
        rideExists(_rideId) 
        nonReentrant 
    {
        Ride storage ride = rides[_rideId];
        
        require(msg.sender == ride.rider, "Only rider can fund");
        require(ride.status == RideStatus.Accepted, "Ride must be accepted first");
        require(ride.fare > 0, "Fare must be greater than 0");
        
        // Cek allowance - pastikan rider sudah approve USDC
        uint256 allowance = usdcToken.allowance(msg.sender, address(this));
        require(allowance >= ride.fare, "Insufficient USDC allowance");
        
        // Cek balance rider
        uint256 riderBalance = usdcToken.balanceOf(msg.sender);
        require(riderBalance >= ride.fare, "Insufficient USDC balance");
        
        // Transfer USDC dari rider ke contract (escrow)
        usdcToken.safeTransferFrom(msg.sender, address(this), ride.fare);
        
        ride.status = RideStatus.Funded;
        
        emit RideFunded(_rideId, ride.fare);
    }
    
    /**
     * @dev Fungsi untuk driver memulai perjalanan
     * @param _rideId ID pesanan
     */
    function startRide(uint256 _rideId) 
        external 
        onlyDriver 
        rideExists(_rideId) 
    {
        Ride storage ride = rides[_rideId];
        
        require(msg.sender == ride.driver, "Only assigned driver can start");
        require(ride.status == RideStatus.Funded, "Ride must be funded first");
        
        ride.status = RideStatus.Started;
        
        emit RideStarted(_rideId);
    }
    
    /**
     * @dev Fungsi untuk driver menyatakan perjalanan selesai
     * @param _rideId ID pesanan
     */
    function completeRide(uint256 _rideId) 
        external 
        onlyDriver 
        rideExists(_rideId) 
    {
        Ride storage ride = rides[_rideId];
        
        require(msg.sender == ride.driver, "Only assigned driver can complete");
        require(ride.status == RideStatus.Started, "Ride must be started first");
        
        ride.status = RideStatus.CompletedByDriver;
        
        emit RideCompletedByDriver(_rideId);
    }
    
    /**
     * @dev Fungsi untuk penumpang konfirmasi perjalanan selesai
     * @notice Dana USDC akan ditransfer ke driver setelah konfirmasi
     * @param _rideId ID pesanan
     */
    function confirmArrival(uint256 _rideId) 
        external 
        rideExists(_rideId) 
        nonReentrant 
    {
        Ride storage ride = rides[_rideId];
        
        require(msg.sender == ride.rider, "Only rider can confirm");
        require(ride.status == RideStatus.CompletedByDriver, "Driver must complete first");
        
        ride.status = RideStatus.Finalized;
        
        // Transfer USDC dari contract ke driver
        uint256 fareAmount = ride.fare;
        address driverAddress = ride.driver;
        
        // Set driver available lagi
        drivers[driverAddress].isAvailable = true;
        
        // Transfer USDC payment ke driver
        usdcToken.safeTransfer(driverAddress, fareAmount);
        
        emit RideFinalized(_rideId, driverAddress, fareAmount);
    }
    
    /**
     * @dev Fungsi untuk membatalkan pesanan
     * @param _rideId ID pesanan yang akan dibatalkan
     */
    function cancelRide(uint256 _rideId) 
        external 
        rideExists(_rideId) 
        nonReentrant 
    {
        Ride storage ride = rides[_rideId];
        
        require(
            msg.sender == ride.rider || msg.sender == ride.driver,
            "Only rider or driver can cancel"
        );
        
        // Hanya bisa cancel jika belum Started
        require(
            ride.status == RideStatus.Requested || 
            ride.status == RideStatus.Accepted || 
            ride.status == RideStatus.Funded,
            "Cannot cancel ride in progress"
        );
        
        RideStatus previousStatus = ride.status;
        ride.status = RideStatus.Cancelled;
        
        // Refund USDC jika sudah funded
        if (previousStatus == RideStatus.Funded) {
            uint256 refundAmount = ride.fare;
            usdcToken.safeTransfer(ride.rider, refundAmount);
        }
        
        // Set driver available lagi jika sudah di-assign
        if (ride.driver != address(0)) {
            drivers[ride.driver].isAvailable = true;
        }
        
        emit RideCancelled(_rideId);
    }
    
    /**
     * @dev Fungsi untuk mendapatkan detail pesanan
     * @param _rideId ID pesanan
     * @return Ride struct
     */
    function getRide(uint256 _rideId) 
        external 
        view 
        rideExists(_rideId) 
        returns (Ride memory) 
    {
        return rides[_rideId];
    }
    
    /**
     * @dev Fungsi untuk mendapatkan total pesanan
     */
    function getTotalRides() external view returns (uint256) {
        return rideCounter;
    }
    
    /**
     * @dev Fungsi untuk mendapatkan balance USDC contract
     */
    function getContractBalance() external view returns (uint256) {
        return usdcToken.balanceOf(address(this));
    }
    
    /**
     * @dev Fungsi untuk cek allowance USDC user
     * @param _user Address user yang akan dicek
     */
    function checkAllowance(address _user) external view returns (uint256) {
        return usdcToken.allowance(_user, address(this));
    }
    
    /**
     * @dev Fungsi untuk cek balance USDC user
     * @param _user Address user yang akan dicek
     */
    function checkUserBalance(address _user) external view returns (uint256) {
        return usdcToken.balanceOf(_user);
    }
}