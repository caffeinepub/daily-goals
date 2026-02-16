import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type GoalId = Nat;
  public type Goal = {
    id : GoalId;
    title : Text;
    description : Text;
    isArchived : Bool;
    createdAt : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  // Persistent state
  var nextGoalId = 0;
  let userGoals = Map.empty<Principal, List.List<Goal>>();
  let goalCompletions = Map.empty<GoalId, Set.Set<Time.Time>>();
  let goalOwners = Map.empty<GoalId, Principal>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  module Goal {
    public func compareByCreatedAt(goal1 : Goal, goal2 : Goal) : Order.Order {
      Int.compare(goal1.createdAt, goal2.createdAt);
    };
  };

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
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
    userProfiles.add(caller, profile);
  };

  // Goal management functions
  public shared ({ caller }) func createGoal(title : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create goals");
    };

    let goal : Goal = {
      id = nextGoalId;
      title;
      description;
      isArchived = false;
      createdAt = Time.now();
    };

    let userGoalList = switch (userGoals.get(caller)) {
      case (null) { List.empty<Goal>() };
      case (?goals) { goals };
    };
    userGoalList.add(goal);
    userGoals.add(caller, userGoalList);
    goalCompletions.add(goal.id, Set.empty<Time.Time>());
    goalOwners.add(goal.id, caller);

    nextGoalId += 1;
  };

  public query ({ caller }) func getActiveGoals() : async [Goal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get active goals");
    };

    switch (userGoals.get(caller)) {
      case (null) { [] };
      case (?goals) {
        goals.filter(func(g) { not g.isArchived }).toArray().sort(Goal.compareByCreatedAt);
      };
    };
  };

  public query ({ caller }) func getArchivedGoals() : async [Goal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get archived goals");
    };

    switch (userGoals.get(caller)) {
      case (null) { [] };
      case (?goals) {
        goals.filter(func(g) { g.isArchived }).toArray().sort(Goal.compareByCreatedAt);
      };
    };
  };

  public shared ({ caller }) func toggleGoalCompletion(goalId : GoalId, dayTimestamp : Time.Time) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can toggle goal completion");
    };

    // Verify ownership
    switch (goalOwners.get(goalId)) {
      case (null) { Runtime.trap("Goal not found") };
      case (?owner) {
        if (owner != caller) {
          Runtime.trap("Unauthorized: Can only toggle completion for your own goals");
        };
      };
    };

    switch (goalCompletions.get(goalId)) {
      case (null) { Runtime.trap("Goal not found") };
      case (?daySet) {
        if (daySet.contains(dayTimestamp)) {
          daySet.remove(dayTimestamp);
        } else {
          daySet.add(dayTimestamp);
        };
      };
    };
  };

  public query ({ caller }) func getGoalsForDay(dayTimestamp : Time.Time) : async [(Goal, Bool)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get goals for a day");
    };

    switch (userGoals.get(caller)) {
      case (null) { [] };
      case (?goals) {
        goals.values().toArray().sort(Goal.compareByCreatedAt).map(
          func(goal) {
            let completed = switch (goalCompletions.get(goal.id)) {
              case (null) { false };
              case (?daySet) { daySet.contains(dayTimestamp) };
            };
            (goal, completed);
          }
        );
      };
    };
  };

  public shared ({ caller }) func archiveGoal(goalId : GoalId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can archive goals");
    };

    // Verify ownership
    switch (goalOwners.get(goalId)) {
      case (null) { Runtime.trap("Goal not found") };
      case (?owner) {
        if (owner != caller) {
          Runtime.trap("Unauthorized: Can only archive your own goals");
        };
      };
    };

    let userGoalList = switch (userGoals.get(caller)) {
      case (null) { Runtime.trap("Goal not found") };
      case (?goals) { goals };
    };

    let updatedGoals = userGoalList.map<Goal, Goal>(
      func(g) {
        if (g.id == goalId) {
          {
            id = g.id;
            title = g.title;
            description = g.description;
            isArchived = true;
            createdAt = g.createdAt;
          };
        } else { g };
      }
    );
    userGoals.add(caller, updatedGoals);
  };
};
