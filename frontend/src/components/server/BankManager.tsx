import { getDistance } from "geolib";

export const getAllBanks = () => {

  // TODO: Should be changed with server logic later
  
  const banks = [
    {
      name: "OM Blood Bank Kolkata",
      address:
        "133, Sale tax office, H/1, Beleghata Main Rd, Beleghata, Kolkata, West Bengal 700015",
      phone: "08479919177",
      latitude: 22.56797731152482,
      longitude: 88.38172335763153,
      blood: ["A+", "B+", "O+", "AB+"],
    },
    {
      name: "SSKM Hospital Blood Bank",
      address:
        "G8RV+3FQ, Shikha Sarkar, SSKM Hospital Rd, Bhowanipore, Kolkata, West Bengal 700020",
      phone: "03322041233",
      latitude: 22.54309014744824,
      longitude: 88.34448694930073,
      blood: ["A-", "O-", "AB-"],
    },
    {
      name: "Fortis Hospitals Limited Blood Bank",
      address:
        "730, Eastern Metropolitan Bypass, Anandapur, East Kolkata Twp, Kolkata, West Bengal 700107",
      phone: "03366284230",
      latitude: 22.522854454154405,
      longitude: 88.40196187423764,
      blood: ["B+", "O+", "AB+", "A-"],
    },
    {
      name: "Amri Hospital Limited Blood Banks",
      address: "Dhakuria, Kankulia, Kolkata, West Bengal 700031",
      phone: "03366800000",
      latitude: 22.514779028323108,
      longitude: 88.36713731518297,
      blood: ["B-", "O-", "AB-", "A+", "B+", "O+"],
    },
    {
      name: "Calcutta National Medical College & Hospital Blood Bank",
      address: "24, Gorachand Rd, Beniapukur, Kolkata, West Bengal 700014",
      phone: "03322848397",
      latitude: 22.550046133270598,
      longitude: 88.37175158820219,
      blood: ["B-", "AB+", "A+", "B+", "O+"],
    },
    {
      name: "Chittaranjan National Cancer Institute Blood Bank",
      address:
        "Chittaranjan Shishu Hospital, Beltala Rd, Hazra, Kalighat, Kolkata, West Bengal 700026",
      phone: "03324765101",
      latitude: 22.528344676616094,
      longitude: 88.34813475355536,
      blood: ["B-", "O-", "AB-", "A+"],
    },
    {
      name: "Command Hospital (Ec) Blood Bank",
      address:
        "Command Hospital(Eastern Command), Alipore Rd, Alipore, Kolkata, West Bengal 700027",
      phone: "03322226415",
      latitude: 22.530467667334847,
      longitude: 88.33121639589315,
      blood: ["O-", "AB-", "A+", "B+", "O+"],
    },
    {
      name: "M. R. Bangur Hospital Blood Bank",
      address:
        "MR Bangur Hospital, Russa Rd South 1st Ln, Netajinagar, Madar Tala Colony, Lake Gardens, Kolkata, West Bengal 700033",
      phone: "03324727873",
      latitude: 22.50325988703856,
      longitude: 88.3445405935373,
      blood: ["B-", "O-", "B+", "O+"],
    },
    {
      name: "Medica Superspecialty Hospital Blood Bank",
      address: "Pano Rd, Nitai Nagar, Mukundapur, Kolkata, West Bengal 700099",
      phone: "03366525000",
      latitude: 22.496757515807573,
      longitude: 88.40239047700209,
      blood: ["B-", "O-", "AB-", "A+", "B+", "O+"],
    },
    {
      name: "Peerless Hospital And Research Center Limited Blood Bank",
      address:
        "Sahid Smirity Colony, Pancha Sayar, Kolkata, West Bengal 700094",
      phone: "NA",
      latitude: 22.484386307342156,
      longitude: 88.39346408569322,
      blood: ["B-", "O-", "AB-", "A+", "B+", "O+", "A-"],
    },
  ];

  return banks;
}

export const getNearbyBanks = (radiusKm: number, location: any) => {

  const banks = getAllBanks();

  // Find Blood Banks within given distance range
  const nearbyBloodBanks = banks
      .map((bloodBank) => {
        const distance = getDistance(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: bloodBank.latitude, longitude: bloodBank.longitude }
        );
        return {
          ...bloodBank,
          distance: distance / 1000, // Convert distance from meters to kilometers
        };
      })
      .filter((bloodBank) => bloodBank.distance <= radiusKm);

    // Sort the nearby blood banks by distance (from lower to higher)
    nearbyBloodBanks.sort((a, b) => a.distance - b.distance);

  return nearbyBloodBanks;
};
