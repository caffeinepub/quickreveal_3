import List "mo:core/List";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Blob "mo:core/Blob";
import AccessControl "authorization/access-control";

import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

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

  public type SocialLinks = {
    instagram : ?Text;
    facebook : ?Text;
    website : ?Text;
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
    socialLinks : SocialLinks;
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

  // Internal function to seed Swiss salons
  private func seedSwissSalonsIfNeeded() {
    if (salons.size() > 0) {
      return;
    };

    let today = "2024-01-15";

    let defaultAvailableHours = Array.tabulate(
      9,
      func(i) {
        let time = 7 + i;
        {
          day = "Monday";
          time;
          isNight = false;
          isSunday = false;
          isAvailable = true;
          date = today;
        };
      },
    );

    let exclusiveServices : [Service] = [
      { name = "Coiffure homme"; durationMinutes = 30; price = 65; category = "Coiffure" },
      { name = "Coiffure femme"; durationMinutes = 45; price = 85; category = "Coiffure" },
      { name = "Coupe enfant"; durationMinutes = 25; price = 53; category = "Coiffure" },
      { name = "Barbe"; durationMinutes = 30; price = 30; category = "Barbier" },
      { name = "Massage cuir chevelu"; durationMinutes = 10; price = 25; category = "Spa" },
      { name = "Soin Kérathermie"; durationMinutes = 60; price = 89; category = "Spa" },
      { name = "Couleurs"; durationMinutes = 90; price = 79; category = "Coiffure" },
    ];

    let lOrealServices : [Service] = [
      { name = "Coiffure homme"; durationMinutes = 30; price = 45; category = "Coiffure" },
      { name = "Coiffure femme"; durationMinutes = 45; price = 55; category = "Coiffure" },
      { name = "Balayage"; durationMinutes = 45; price = 59; category = "Coiffure" },
      { name = "Coiffure enfant"; durationMinutes = 25; price = 29; category = "Coiffure" },
      { name = "Soin lissant"; durationMinutes = 45; price = 39; category = "Spa" },
      { name = "Massage cheveux"; durationMinutes = 10; price = 22; category = "Spa" },
      {
        name = "Peignage coiffage";
        durationMinutes = 25;
        price = 29;
        category = "Coiffure";
      },
      { name = "Coloration"; durationMinutes = 45; price = 50; category = "Coiffure" },
    ];

    let beautyServices : [Service] = [
      { name = "Coupe femme"; durationMinutes = 30; price = 35; category = "Coiffure" },
      { name = "Shampoing femme"; durationMinutes = 15; price = 12; category = "Coiffure" },
      { name = "Coiffure homme"; durationMinutes = 30; price = 18; category = "Coiffure" },
      { name = "Lissage brésilien"; durationMinutes = 30; price = 49; category = "Spa" },
      { name = "Brushing"; durationMinutes = 25; price = 19; category = "Coiffure" },
      { name = "Coloration"; durationMinutes = 35; price = 29; category = "Coiffure" },
    ];

    let spaAndBeautyServices : [Service] = [
      { name = "Coiffure femme"; durationMinutes = 30; price = 50; category = "Coiffure" },
      { name = "Coiffure homme"; durationMinutes = 30; price = 38; category = "Coiffure" },
      { name = "Soin capillaire"; durationMinutes = 20; price = 25; category = "Coiffure" },
      { name = "Soins visage"; durationMinutes = 45; price = 72; category = "Spa" },
      { name = "Beauté mains"; durationMinutes = 35; price = 54; category = "Onglerie" },
      { name = "Massage du dos"; durationMinutes = 38; price = 62; category = "Spa" },
    ];

    let blackbladeSalon : Salon = {
      name = "BlackBlade Hairstylist";
      owner = Principal.fromText("aaaaa-aa");
      availabilities = defaultAvailableHours;
      neighborhood = "Rue Centrale 5, Lausanne";
      description = "Salon de coiffure haut de gamme à Lausanne";
      photoUrls = [
        "https://d3jxhwq3gtskzp.cloudfront.net/J9BdEf8v9Um30WZJoEE9GWvZYI9DjH_salon_89c29bc0-9075-11ee-9c01-0242ac110005_external.jpeg"
      ];
      isPremium = true;
      services = exclusiveServices;
      imageIds = [];
      socialLinks = {
        instagram = ?"/blackbladehairstylist";
        facebook = ?"/BlackBladeHairstylist";
        website = ?"/www.blackbladehairstylist.ch";
      };
    };

    let leStudio : Salon = {
      name = "Le Studio - L'Oréal";
      owner = Principal.fromText("aaaaa-aa");
      availabilities = defaultAvailableHours;
      neighborhood = "Rue de Bourg 21, Lausanne";
      description = "Salon de beauté et coiffure partenaire L’Oréal";
      photoUrls = ["https://images.unsplash.com/photo-1506744038136-46273834b3fb"];
      isPremium = true;
      services = lOrealServices;
      imageIds = [];
      socialLinks = {
        instagram = ?"/loreal";
        facebook = ?"/LeStudioLinz";
        website = ?"/www.lorealparis.ch";
      };
    };

    let suzyCoiffure : Salon = {
      name = "Suzy Coiffure & Head Spa";
      owner = Principal.fromText("aaaaa-aa");
      availabilities = defaultAvailableHours;
      neighborhood = "Rue Belle-Fontaine 3, Lausanne";
      description = "Salon de coiffure et spa";
      photoUrls = [
        "https://d3jxhwq3gtskzp.cloudfront.net/J9BdEf8v9Um30WZJoEE9GWvZYI9DjH_salon_89c29bc0-9075-11ee-9c01-0242ac110005_external.jpeg"
      ];
      isPremium = true;
      services = beautyServices;
      imageIds = [];
      socialLinks = {
        instagram = ?"/suzycoiffure";
        facebook = ?"/suzycoiffure";
        website = null;
      };
    };

    let emerCoiffure : Salon = {
      name = "EMER Coiffure";
      owner = Principal.fromText("aaaaa-aa");
      availabilities = defaultAvailableHours;
      neighborhood = "Rue Georges Gremaud 6, Lausanne";
      description = "Salon de beauté et spa à Lausanne";
      photoUrls = [
        "https://d3jxhwq3gtskzp.cloudfront.net/J9BdEf8v9Um30WZJoEE9GWvZYI9DjH_salon_89c29bc0-9075-11ee-9c01-0242ac110005_external.jpeg"
      ];
      isPremium = true;
      services = spaAndBeautyServices;
      imageIds = [];
      socialLinks = {
        instagram = ?"/emercoiffure";
        facebook = ?"/EmerCoiffure";
        website = ?"/www.spa-beaute.ch";
      };
    };

    salons.add("BlackBlade Hairstylist", blackbladeSalon);
    salons.add("Le Studio - L'Oréal", leStudio);
    salons.add("Suzy Coiffure & Head Spa", suzyCoiffure);
    salons.add("EMER Coiffure", emerCoiffure);
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

    let newXP : Nat = currentProfile.xp + amount;
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
    seedSwissSalonsIfNeeded();
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
    isPremium : Bool,
    socialLinks : SocialLinks
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create salons");
    };

    let id = name # neighborhood;
    if (salons.containsKey(id)) { Runtime.trap("Salon already exists") };

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
      socialLinks;
    };
    salons.add(id, salon);
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
        if (caller == salon.owner) {
          Runtime.trap("Unauthorized: Salon owners cannot book their own salon");
        };

        let service = switch (salon.services.size() > 0) {
          case (true) { salon.services[0] };
          case (false) { Runtime.trap("Service not found") };
        };

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
    seedSwissSalonsIfNeeded();
  };
};

