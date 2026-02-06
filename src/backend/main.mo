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
import Int "mo:core/Int";
import Debug "mo:core/Debug";
import Blob "mo:core/Blob";
import AccessControl "authorization/access-control";
import Migration "migration";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

// Stable Persistent State
(with migration = Migration.run)
actor {
  // Data Types
  type Client = Principal;

  public type Service = {
    name : Text;
    durationMinutes : Nat;
    price : Nat;
    category : Text;
  };

  public type Availability = {
    day : Text;
    time : Nat;
    isNight : Bool;
    isSunday : Bool;
    isAvailable : Bool;
    date : Text;
  };

  public type InternalImage = {
    blob : Blob;
    contentType : Text;
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
    imageIds : [Text];
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
  include MixinStorage();

  let salons = Map.empty<Text, Salon>();
  let bookings = Map.empty<Text, Booking>();
  let images = Map.empty<Text, InternalImage>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var monopolyMode : Bool = false;
  var salonsSeeded : Bool = false;

  // Internal function to seed salons and services
  private func seedSalonsIfNeeded() {
    if (salonsSeeded or salons.size() > 0) {
      return;
    };

    let today = "2024-01-15";
    let tomorrow = "2024-01-16";

    // Only French/Swiss service names and categories
    let louisVuittonServices : [Service] = [
      { name = "Coupe homme"; durationMinutes = 45; price = 1000; category = "Coiffure" },
      { name = "Balayage VIP"; durationMinutes = 120; price = 3500; category = "Coiffure" },
      { name = "Rasage D'Exception"; durationMinutes = 60; price = 2000; category = "Barbier" },
      { name = "Massage Suédois"; durationMinutes = 90; price = 1800; category = "Spa" },
      { name = "Manucure Luxe"; durationMinutes = 60; price = 1500; category = "Onglerie" },
    ];

    let premiumServices : [Service] = [
      { name = "Coupe de Cheveux Femme"; durationMinutes = 60; price = 130; category = "Coiffure" },
      { name = "Barbe de Luxe"; durationMinutes = 45; price = 90; category = "Barbier" },
      { name = "Soins du Visage Spa"; durationMinutes = 75; price = 180; category = "Spa" },
      { name = "Pédicure Pro"; durationMinutes = 50; price = 120; category = "Onglerie" },
    ];

    let standardServices : [Service] = [
      { name = "Coupe simple"; durationMinutes = 30; price = 50; category = "Coiffure" },
      { name = "Rasage traditionnel"; durationMinutes = 30; price = 40; category = "Barbier" },
      { name = "Massage Relaxant"; durationMinutes = 45; price = 100; category = "Spa" },
      { name = "Manucure Basique"; durationMinutes = 30; price = 60; category = "Onglerie" },
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
        name = "Louis Vuitton Beauté Luxe";
        owner = Principal.fromText("aaaaa-aa");
        availabilities = allSlots;
        neighborhood = "Lausanne Centre";
        description = "Expérience beauté premium avec des services de luxe exclusifs";
        photoUrls = ["https://images.unsplash.com/photo-1562322140-8baeececf3df"];
        isPremium = true;
        services = louisVuittonServices;
        imageIds = [];
      },
      {
        name = "Beauté Royale";
        owner = Principal.fromText("aaaaa-aa");
        availabilities = allSlots;
        neighborhood = "Montreux Centre";
        description = "Services de beauté luxueux pour une clientèle royale";
        photoUrls = ["https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f"];
        isPremium = true;
        services = premiumServices;
        imageIds = [];
      },
      {
        name = "Lausanne Elite Spa";
        owner = Principal.fromText("aaaaa-aa");
        availabilities = allSlots;
        neighborhood = "Lausanne Centre";
        description = "Spa et beauté pour les clients exigeants au cœur de Lausanne";
        photoUrls = ["https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6"];
        isPremium = true;
        services = premiumServices;
        imageIds = [];
      },
      {
        name = "Genève Exécutif Barbershop";
        owner = Principal.fromText("aaaaa-aa");
        availabilities = allSlots;
        neighborhood = "Genève Plainpalais";
        description = "Expérience exclusive de barbier pour une clientèle d'affaires";
        photoUrls = ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e"];
        isPremium = true;
        services = premiumServices;
        imageIds = [];
      },
    ];

    let standardSalons : [Salon] = [
      {
        name = "Le Barbier Moderne";
        owner = Principal.fromText("aaaaa-aa");
        availabilities = allSlots;
        neighborhood = "Lausanne Centre";
        description = "Services de coiffure et barbier modernes pour hommes et femmes";
        photoUrls = ["https://images.unsplash.com/photo-1560066984-138dadb4c035"];
        isPremium = false;
        services = standardServices;
        imageIds = [];
      },
      {
        name = "Beauté Naturelle Genève";
        owner = Principal.fromText("aaaaa-aa");
        availabilities = allSlots;
        neighborhood = "Genève Plainpalais";
        description = "Soins de beauté et spa inspirés de la nature";
        photoUrls = ["https://images.unsplash.com/photo-1517841905240-472988babdf9"];
        isPremium = false;
        services = standardServices;
        imageIds = [];
      },
      {
        name = "La Main d'Or";
        owner = Principal.fromText("aaaaa-aa");
        availabilities = allSlots;
        neighborhood = "Montreux Clarens";
        description = "Salon de manucure et SPA au service irréprochable";
        photoUrls = ["https://images.unsplash.com/photo-1520880867055-1e30d1cb001c"];
        isPremium = false;
        services = standardServices;
        imageIds = [];
      },
    ];

    for (salon in premiumSalons.vals()) {
      salons.add(salon.name, salon);
    };

    for (salon in standardSalons.vals()) {
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

  // Loyalty XP Awarding System
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

    userProfiles.add(user, {
      currentProfile with
      xp = newXP;
      tier = newTier;
    });
  };

  // Category Filtering Aux
  public query ({ caller }) func getCategories() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view categories");
    };

    let categories = List.empty<Text>();

    for (salon in salons.values()) {
      for (service in salon.services.values()) {
        if (not categories.any(func(category) { category == service.category })) {
          categories.add(service.category);
        };
      };
    };

    categories.toArray();
  };

  // User Profiles
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

  // Salon Operations
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create salons");
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
      imageIds = [];
    };
    salons.add(name, salon);
  };

  // Booking with Pricing Logic
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
        // Prevent salon owners from booking their own salon
        if (caller == salon.owner) {
          Runtime.trap("Unauthorized: Salon owners cannot book their own salon");
        };

        // For simplicity, pick the first available service for booking
        let service = switch (salon.services.size() > 0) {
          case (true) { salon.services[0] };
          case (false) { Runtime.trap("Service not found") };
        };

        // Find and update the specific availability slot
        var slotFound = false;
        var selectedSlot : ?Availability = null;
        let updatedAvailabilities = salon.availabilities.map(
          func(avail) {
            if (avail.date == date and avail.time == time and avail.isAvailable) {
              slotFound := true;
              selectedSlot := ?avail;
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

        // Calculate Price using the actual slot's flags
        let slot = switch (selectedSlot) {
          case (null) { Runtime.trap("Internal error: slot not found") };
          case (?s) { s };
        };

        var priceMultiplier = 100;
        if (monopolyMode and salon.isPremium and (slot.isNight or slot.isSunday)) {
          priceMultiplier := 120;
        };
        let finalPrice = service.price * priceMultiplier / 100;

        let bookingKey = salonName # "-" # date # "-" # time.toText();
        let booking : Booking = {
          client = caller;
          salonName;
          time;
          isNight = slot.isNight;
          isSunday = slot.isSunday;
          price = finalPrice;
          date;
          service;
        };

        bookings.add(bookingKey, booking);

        // Award XP (50 XP per booking)
        awardXP(caller, 50);
      };
    };
  };

  // Image Management
  public shared ({ caller }) func uploadSalonImage(
    salonName : Text,
    imageId : Text,
    imageBytes : Blob,
    contentType : Text
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can upload images");
    };

    let salon = switch (salons.get(salonName)) {
      case (null) { Runtime.trap("Salon does not exist.") };
      case (?salon) { salon };
    };

    // Only salon owner or admin can upload images
    if (caller != salon.owner and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only salon owner or admin can upload images");
    };

    let internalImage : InternalImage = {
      blob = imageBytes;
      contentType;
    };

    images.add(imageId, internalImage);

    let updatedSalon : Salon = {
      salon with imageIds = salon.imageIds.concat([imageId]);
    };

    salons.add(salonName, updatedSalon);
  };

  public query ({ caller }) func getSalonImage(imageId : Text) : async (Blob, Text) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view images");
    };

    switch (images.get(imageId)) {
      case (null) { Runtime.trap("Image not found") };
      case (?image) { (image.blob, image.contentType) };
    };
  };

  // Bookings
  public query ({ caller }) func getBookings(salonName : Text) : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view bookings");
    };

    switch (salons.get(salonName)) {
      case (null) { Runtime.trap("Salon not found") };
      case (?salon) {
        if (caller != salon.owner and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only salon owner or admin can view bookings");
        };
        bookings.values().toArray().filter(func(booking) { booking.salonName == salonName });
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view loyalty profiles");
    };

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

  public shared ({ caller }) func setMonopolyMode(enabled : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set Monopoly mode");
    };
    monopolyMode := enabled;
  };

  public shared ({ caller }) func deleteBooking(bookingKey : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete bookings");
    };
    switch (bookings.get(bookingKey)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        if (booking.client != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only booking owner or admin can delete bookings");
        };
        bookings.remove(bookingKey);
      };
    };
  };

  system func postupgrade() {
    seedSalonsIfNeeded();
  };
};
