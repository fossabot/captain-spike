Feature: captain-spike
  Scenario: Find commits on a git reopsitory with single author
    Given a git repository
    Given 7 commits with a single author
    Given 3 commits created with co-authored
    When I start captain-spike
    Then it should output the commits with a single author
 