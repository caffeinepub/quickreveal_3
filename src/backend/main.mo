import List "mo:core/List";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Client = Principal;

  public type Service = {
    name : Text;
    durationMinutes : Nat;
    price : Nat;
  };

  public type Availability = {
    day : Text;
    time : Nat;
    isNight : Bool;
    isSunday : Bool;
    isAvailable : Bool;
    date : Text;
  };

  public type Salon = {
    name : Text;
    owner : Principal;
    availabilities : [Availability];
    neighborhood : Text;
    description : Text;
    photoUrls : [Text];
    isPremium : Bool;
    services : [Service];
  };

  module Salon {
    public func compare(salon1 : Salon, salon2 : Salon) : Order.Order {
      Text.compare(salon1.name, salon2.name);
    };
  };

  public type Booking = {
    client : Client;
    salonName : Text;
    time : Int;
    isNight : Bool;
    isSunday : Bool;
    price : Int;
    date : Text;
    service : Service;
  };

  module Booking {
    public func compare(booking1 : Booking, booking2 : Booking) : Order.Order {
      Text.compare(booking1.salonName, booking2.salonName);
    };
  };

  public type LoyaltyTier = {
    tierName : Text;
    requiredXP : Nat;
  };

  public type UserProfile = {
    name : Text;
    role : Text;
    xp : Nat;
    tier : LoyaltyTier;
  };

  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  let salons = Map.empty<Text, Salon>();
  let bookings = Map.empty<Text, Booking>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var salonsSeeded : Bool = false;

  // Internal function to seed salons (not publicly callable)
  private func seedSalonsIfNeeded() {
    if (salonsSeeded or salons.size() > 0) {
      return;
    };

    let today = "2024-01-15";
    let tomorrow = "2024-01-16";

    let defaultServices : [Service] = [
      { name = "Haircut"; durationMinutes = 45; price = 80 },
      { name = "Hair Coloring"; durationMinutes = 120; price = 150 },
      { name = "Manicure"; durationMinutes = 30; price = 40 },
      { name = "Pedicure"; durationMinutes = 45; price = 50 },
    ];

    let todaySlots = Array.tabulate(
      8,
      func(i) {
        let time = 10 + i;
        {
          day = "Monday";
          time;
          isNight = time >= 18;
          isSunday = false;
          isAvailable = true;
          date = today;
        };
      },
    );

    let tomorrowSlots = Array.tabulate(
      8,
      func(i) {
        let time = 10 + i;
        {
          day = "Tuesday";
          time;
          isNight = time >= 18;
          isSunday = false;
          isAvailable = true;
          date = tomorrow;
        };
      },
    );

    let allSlots = todaySlots.concat(tomorrowSlots);

    let premiumSalons : [Salon] = [
      {
        name = "Venus Beauty";
        owner = Principal.fromText("aaaaa-aa");
        availabilities = allSlots;
        neighborhood = "Ponte Preta";
        description = "Finest luxury experience in town with premium treatments";
        photoUrls = ["https://images.unsplash.com/photo-1560066984-138dadb4c035"];
        isPremium = true;
        services = defaultServices;
      },
      {
        name = "Belleza Lujosa";
        owner = Principal.fromText("aaaaa-aa");
        availabilities = allSlots;
        neighborhood = "Lapa";
        description = "Where beauty meets luxury in an elegant atmosphere";
        photoUrls = ["https://images.unsplash.com/photo-1562322140-8baeececf3df"];
        isPremium = true;
        services = defaultServices;
      },
      {
        name = "Royal Charm";
        owner = Principal.fromText("aaaaa-aa");
        availabilities = allSlots;
        neighborhood = "Ermelino";
        description = "Unleash your royal beauty with our exclusive services";
        photoUrls = ["https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f"];
        isPremium = true;
        services = defaultServices;
      },
      {
        name = "Elegant Essence";
        owner = Principal.fromText("aaaaa-aa");
        availabilities = allSlots;
        neighborhood = "Souza";
        description = "Elegant services for all, bringing out your natural beauty";
        photoUrls = ["https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6"];
        isPremium = true;
        services = defaultServices;
      },
      {
        name = "Urban Glam";
        owner = Principal.fromText("aaaaa-aa");
        availabilities = allSlots;
        neighborhood = "Piedade";
        description = "Glamorous treatments for city dwellers seeking modern style";
        photoUrls = ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e"];
        isPremium = true;
        services = defaultServices;
      },
    ];

    for (salon in premiumSalons.vals()) {
      salons.add(salon.name, salon);
    };

    salonsSeeded := true;
  };

  // Calculate loyalty tier based on XP
  private func calculateTier(xp : Nat) : LoyaltyTier {
    if (xp >= 1000) {
      { tierName = "Platinum"; requiredXP = 1000 };
    } else if (xp >= 500) {
      { tierName = "Gold"; requiredXP = 500 };
    } else if (xp >= 200) {
      { tierName = "Silver"; requiredXP = 200 };
    } else {
      { tierName = "Bronze"; requiredXP = 0 };
    };
  };

  // Internal function to award XP (not publicly callable)
  private func awardXP(user : Principal, amount : Nat) {
    let currentProfile = switch (userProfiles.get(user)) {
      case (null) {
        {
          name = "";
          role = "user";
          xp = 0;
          tier = { tierName = "Bronze"; requiredXP = 0 };
        };
      };
      case (?profile) { profile };
    };

    let newXP = currentProfile.xp + amount;
    let newTier = calculateTier(newXP);

    let updatedProfile : UserProfile = {
      currentProfile with
      xp = newXP;
      tier = newTier;
    };

    userProfiles.add(user, updatedProfile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    // Preserve XP and tier from existing profile - users cannot modify these
    let existingProfile = userProfiles.get(caller);
    let finalProfile = switch (existingProfile) {
      case (null) {
        {
          profile with
          xp = 0;
          tier = { tierName = "Bronze"; requiredXP = 0 };
        };
      };
      case (?existing) {
        {
          profile with
          xp = existing.xp;
          tier = existing.tier;
        };
      };
    };

    userProfiles.add(caller, finalProfile);
  };

  public query ({ caller }) func getSalons() : async [Salon] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view salons");
    };

    salons.values().toArray().sort();
  };

  public shared ({ caller }) func ensureSalonsSeeded() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can trigger seeding");
    };
    seedSalonsIfNeeded();
  };

  public query ({ caller }) func getSalon(name : Text) : async Salon {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view salons");
    };
    switch (salons.get(name)) {
      case (null) { Runtime.trap("Salon not found") };
      case (?salon) { salon };
    };
  };

  public shared ({ caller }) func createSalon(
    name : Text,
    neighborhood : Text,
    description : Text,
    photoUrls : [Text],
    services : [Service],
    isPremium : Bool
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (salons.containsKey(name)) { Runtime.trap("Salon already exists") };

    let defaultAvailabilities = Array.tabulate(
      10,
      func(i) {
        let time = 14 + i;
        {
          day = "Monday";
          time;
          isNight = time > 19;
          isSunday = false;
          isAvailable = true;
          date = "2024-01-15";
        };
      },
    );

    let salon : Salon = {
      name;
      owner = caller;
      availabilities = defaultAvailabilities;
      neighborhood;
      description;
      photoUrls;
      isPremium;
      services;
    };
    salons.add(name, salon);
  };

  public shared ({ caller }) func bookSalon(
    salonName : Text,
    time : Nat,
    date : Text,
    _serviceName : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can book salons");
    };

    switch (salons.get(salonName)) {
      case (null) { Runtime.trap("Salon not found") };
      case (?salon) {
        // For simplicity, pick the first available service for booking
        let service = switch (salon.services.size() > 0) {
          case (true) { salon.services[0] };
          case (false) { Runtime.trap("Service not found") };
        };

        // Find and update the specific availability slot
        var slotFound = false;
        let updatedAvailabilities = salon.availabilities.map(
          func(avail) {
            if (avail.date == date and avail.time == time and avail.isAvailable) {
              slotFound := true;
              { avail with isAvailable = false };
            } else {
              avail;
            };
          }
        );

        if (not slotFound) {
          Runtime.trap("Time slot not available");
        };

        let updatedSalon : Salon = {
          salon with availabilities = updatedAvailabilities;
        };
        salons.add(salonName, updatedSalon);

        let isNight = time >= 18;
        let isSunday = false; // Would need proper date parsing for real implementation

        let priceMultiplier = if (isNight or isSunday) { 120 } else { 100 };
        let finalPrice = service.price * priceMultiplier / 100;

        let bookingKey = salonName # "-" # date # "-" # time.toText();
        let booking : Booking = {
          client = caller;
          salonName;
          time;
          isNight;
          isSunday;
          price = finalPrice;
          date;
          service;
        };

        bookings.add(bookingKey, booking);

        // Award XP for successful booking (50 XP per booking)
        awardXP(caller, 50);
      };
    };
  };

  public query ({ caller }) func getBookings(salonName : Text) : async [Booking] {
    switch (salons.get(salonName)) {
      case (null) { Runtime.trap("Salon not found") };
      case (?salon) {
        if (caller != salon.owner and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only salon owner or admin can view bookings");
        };
        bookings.values().toArray().sort().filter(func(booking) { booking.salonName == salonName });
      };
    };
  };

  public query ({ caller }) func getMyBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their bookings");
    };
    bookings.values().toArray().filter(func(booking) { booking.client == caller });
  };

  public query ({ caller }) func getLoyaltyProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own loyalty profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func resetLoyaltyProfiles() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reset loyalty profiles");
    };
    userProfiles.clear();
  };

  // System initialization
  system func postupgrade() {
    seedSalonsIfNeeded();
  };
};
