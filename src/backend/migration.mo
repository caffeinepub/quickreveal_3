import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  type MigrationClient = Principal;

  type OldAvailability = {
    day : Text;
    time : Nat;
    isNight : Bool;
    isSunday : Bool;
    isAvailable : Bool;
  };

  type Availability = {
    day : Text;
    time : Nat;
    isNight : Bool;
    isSunday : Bool;
    isAvailable : Bool;
    date : Text;
  };

  type Service = {
    name : Text;
    durationMinutes : Nat;
    price : Nat;
  };

  type Salon = {
    name : Text;
    owner : Principal;
    availabilities : [Availability];
    neighborhood : Text;
    description : Text;
    photoUrls : [Text];
    isPremium : Bool;
    services : [Service];
  };

  type Booking = {
    client : MigrationClient;
    salonName : Text;
    time : Int;
    isNight : Bool;
    isSunday : Bool;
    price : Int;
    date : Text;
    service : Service;
  };

  public type LoyaltyTier = {
    tierName : Text;
    requiredXP : Nat;
  };

  type UserProfile = {
    name : Text;
    role : Text;
    xp : Nat;
    tier : LoyaltyTier;
  };

  type OldBooking = {
    client : MigrationClient;
    salonName : Text;
    time : Int;
    isNight : Bool;
    isSunday : Bool;
    price : Int;
  };

  type OldSalon = {
    name : Text;
    owner : Principal;
    availabilities : [OldAvailability];
  };

  type OldUserProfile = {
    name : Text;
    role : Text;
  };

  type OldActor = {
    salons : Map.Map<Text, OldSalon>;
    bookings : Map.Map<Text, OldBooking>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  public type NewActor = {
    salons : Map.Map<Text, Salon>;
    bookings : Map.Map<Text, Booking>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let newSalons = old.salons.map<Text, OldSalon, Salon>(
      func(_name, oldSalon) {
        {
          oldSalon with
          availabilities = oldSalon.availabilities.map(
            func(oldAvailability) {
              {
                oldAvailability with
                date = "2024-01-15";
              };
            }
          );
          neighborhood = "Unknown";
          description = "No description available";
          photoUrls = Array.empty<Text>();
          isPremium = false;
          services = Array.empty<Service>();
        };
      }
    );

    let newBookings = old.bookings.map<Text, OldBooking, Booking>(
      func(_name, oldBooking) {
        {
          oldBooking with
          date = "2024-01-15";
          service = {
            name = "Haircut";
            durationMinutes = 30;
            price = 100;
          };
        };
      }
    );

    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, UserProfile>(
      func(_user, oldProfile) {
        {
          oldProfile with
          xp = 0;
          tier = {
            tierName = "Bronze";
            requiredXP = 0;
          };
        };
      }
    );

    {
      salons = newSalons;
      bookings = newBookings;
      userProfiles = newUserProfiles;
    };
  };
};
