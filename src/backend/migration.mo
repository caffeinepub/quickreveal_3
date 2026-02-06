import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Blob "mo:core/Blob";
import Principal "mo:core/Principal";

module {
  // Data Types (from main.mo)
  type Client = Principal;

  type Service = {
    name : Text;
    durationMinutes : Nat;
    price : Nat;
    category : Text;
  };

  type Availability = {
    day : Text;
    time : Nat;
    isNight : Bool;
    isSunday : Bool;
    isAvailable : Bool;
    date : Text;
  };

  type InternalImage = {
    blob : Blob;
    contentType : Text;
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
    imageIds : [Text];
  };

  type Booking = {
    client : Principal;
    salonName : Text;
    time : Int;
    isNight : Bool;
    isSunday : Bool;
    price : Int;
    date : Text;
    service : Service;
  };

  type LoyaltyTier = {
    tierName : Text;
    requiredXP : Nat;
  };

  type UserProfile = {
    name : Text;
    role : Text;
    xp : Nat;
    tier : LoyaltyTier;
  };

  type OldActor = {
    salons : Map.Map<Text, Salon>;
    bookings : Map.Map<Text, Booking>;
    images : Map.Map<Text, InternalImage>;
    userProfiles : Map.Map<Principal, UserProfile>;
    monopolyMode : Bool;
  };

  type NewActor = {
    salons : Map.Map<Text, Salon>;
    bookings : Map.Map<Text, Booking>;
    images : Map.Map<Text, InternalImage>;
    userProfiles : Map.Map<Principal, UserProfile>;
    monopolyMode : Bool;
  };

  public func run(old : OldActor) : NewActor {
    { old with monopolyMode = false };
  };
};
