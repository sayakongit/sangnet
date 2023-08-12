// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BloodDonation {
    struct Donation {
        uint256 donorId;
        string donorName;
        string bloodGroup;
        string donationDate;
        string location;
        bool isUrgent;
        uint256 units;
    }

    mapping(uint256 => Donation) public donations;
    uint256 public donationCount;

    event DonationRecorded(uint256 indexed donationId, uint256 indexed donorId, string donorName, string bloodGroup, string donationDate, string location, bool isUrgent, uint256 units);

    function recordDonation(uint256 donorId, string memory donorName, string memory bloodGroup, 
    string memory donationDate, string memory location, bool isUrgent, uint256 units) external {
        // Ensure that the donor ID is valid and unique (you may have a different mechanism for this)
        require(donorId > 0, "Invalid donor ID");
        require(bytes(donorName).length > 0, "Invalid donor name");
        require(bytes(bloodGroup).length > 0, "Invalid blood group");
        require(bytes(donationDate).length > 0, "Invalid donation date");
        require(bytes(location).length > 0, "Invalid location");

        // Increment donationCount to get a new unique donation ID
        donationCount++;

        // Create a new donation record
        Donation storage newDonation = donations[donationCount];
        newDonation.donorId = donorId;
        newDonation.donorName = donorName;
        newDonation.bloodGroup = bloodGroup;
        newDonation.donationDate = donationDate;
        newDonation.location = location;
        newDonation.isUrgent = isUrgent;
        newDonation.units = units;

        emit DonationRecorded(donationCount, donorId, donorName, bloodGroup, donationDate, location,isUrgent,units);

    }

    function getDonations() external view returns (Donation[] memory) {
        Donation[] memory donationArray = new Donation[](donationCount);
        for (uint256 i = 1; i <= donationCount; i++) {
            donationArray[i - 1] = donations[i];
        }
        return donationArray;
    }

    function getDonationsForDonor(uint256 donorId) external view returns (Donation[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= donationCount; i++) {
            if (donations[i].donorId == donorId) {
                count++;
            }
        }
        
        Donation[] memory donationArray = new Donation[](count);
        uint256 currentIndex = 0;
        for (uint256 i = 1; i <= donationCount; i++) {
            if (donations[i].donorId == donorId) {
                donationArray[currentIndex] = donations[i];
                currentIndex++;
            }
        }
        return donationArray;
    }
}