# Automatic Matching System Specification

## Purpose

This specification defines the automatic matching algorithm that detects compatible clients based on their interests, zones, property types, and price ranges.

## Matching Algorithm

### Core Requirements

The matching system MUST detect compatible client pairs where:
1. One client wants to SELL ("vender" in interests)
2. The other client wants to BUY or RENT ("comprar" or "alquiler" in interests)
3. Both clients are interested in the SAME ZONE
4. Both clients are interested in the SAME PROPERTY TYPE
5. Their price ranges OVERLAP

### Requirement: Zone Compatibility

The system MUST match clients based on geographic zone preference.

#### Scenario: Exact zone match

- GIVEN Client A wants to sell in "Barrio Jardin" and Client B wants to buy in "Barrio Jardin"
- WHEN the matching algorithm runs
- THEN both clients are considered zone-compatible
- AND zone compatibility score is 100%

#### Scenario: No zone match

- GIVEN Client A wants to sell in "Barrio Norte" and Client B wants to buy in "Barrio Sur"
- WHEN the matching algorithm runs
- THEN clients are NOT zone-compatible
- AND no match is created

### Requirement: Operation Type Compatibility

The system MUST match complementary operation types.

#### Scenario: Sell-Buy compatibility

- GIVEN Client A has interests: ["vender"]
- AND Client B has interests: ["comprar"]
- WHEN the matching algorithm runs
- THEN the operation types are compatible
- AND they can be matched for sale/purchase

#### Scenario: Sell-Rent compatibility

- GIVEN Client A has interests: ["vender"]
- AND Client B has interests: ["alquiler"]
- WHEN the matching algorithm runs
- THEN the operation types are compatible
- AND they can be matched for rent

#### Scenario: Buy-Buy not compatible

- GIVEN Client A has interests: ["comprar"]
- AND Client B has interests: ["comprar"]
- WHEN the matching algorithm runs
- THEN the operation types are NOT compatible
- AND no match is created

### Requirement: Property Type Compatibility

The system MUST match clients interested in the same property type.

#### Scenario: Same property type

- GIVEN Client A wants to sell "departamento"
- AND Client B wants to buy "departamento"
- WHEN the matching algorithm runs
- THEN property types are compatible

#### Scenario: Different property types

- GIVEN Client A wants to sell "casa"
- AND Client B wants to buy "departamento"
- WHEN the matching algorithm runs
- THEN property types are NOT compatible
- AND no match is created

### Requirement: Price Range Overlap

The system MUST verify price range compatibility between seller and buyer.

#### Scenario: Price overlap for sale

- GIVEN Client A wants to sell for $100,000
- AND Client B wants to buy between $80,000 and $150,000
- WHEN the matching algorithm checks price overlap
- THEN there IS overlap because $100,000 is within [$80,000, $150,000]
- AND price compatibility is 100%

#### Scenario: Price overlap for rent

- GIVEN Client A wants to rent for $500/month
- AND Client B wants to rent between $400 and $700/month
- WHEN the matching algorithm checks price overlap
- THEN there IS overlap
- AND price compatibility is 100%

#### Scenario: No price overlap (seller too expensive)

- GIVEN Client A wants to sell for $200,000
- AND Client B wants to buy between $50,000 and $100,000
- WHEN the matching algorithm checks price overlap
- THEN there is NO overlap
- AND no match is created

#### Scenario: No price overlap (buyer budget too low)

- GIVEN Client A wants to sell for $80,000
- AND Client B wants to buy between $100,000 and $200,000
- WHEN the matching algorithm checks price overlap
- THEN there is NO overlap
- AND no match is created

### Requirement: Score Calculation

The system MUST calculate a compatibility score (0-100) based on multiple factors.

#### Score Components

| Factor | Weight | Description |
|--------|--------|-------------|
| Zone Match | 40% | Same preferred zone |
| Property Type Match | 30% | Same property type |
| Price Range Overlap | 30% | Amount within buyer's range |

#### Scenario: Perfect match score

- GIVEN Client A and Client B match on zone, property type, and price
- WHEN the algorithm calculates the score
- THEN the score is 100%

#### Scenario: Partial match score

- GIVEN Client A and Client B match on zone and property type but NOT on price
- WHEN the algorithm calculates the score
- THEN the score is 70% (zone 40% + property 30% + price 0%)

#### Scenario: Minimum threshold

- GIVEN Client A and Client B have a score of 50%
- WHEN the algorithm evaluates the match
- THEN the match is NOT created (threshold is 70%)

### Requirement: Automatic Trigger

The system MUST trigger matching automatically on client creation or update.

#### Scenario: Trigger on client create

- GIVEN a new client is created via POST /api/clients
- WHEN the client is successfully saved
- THEN the matching algorithm automatically runs
- AND new matches are created if compatible clients exist

#### Scenario: Trigger on client update

- GIVEN an existing client is updated via PUT /api/clients/:id
- WHEN the client is successfully updated
- THEN the matching algorithm automatically runs
- AND old invalid matches are removed
- AND new matches are created if applicable

#### Scenario: Avoid duplicate matches

- GIVEN a match already exists between Client A and Client B
- WHEN the matching algorithm runs again
- THEN the system does NOT create a duplicate match
- AND existing match is preserved

### Requirement: Match Status Management

The system MUST allow administrators to manage match status.

#### Match Status Values

| Status | Description | Visible In |
|--------|-------------|------------|
| pending | Newly detected, not yet contacted | Pending list |
| contacted | Admin has contacted both parties | Contacted list |
| discarded | Match was not relevant | Hidden from main view |

#### Scenario: Mark as contacted

- GIVEN a match with status "pending"
- WHEN admin updates status to "contacted"
- THEN the match is moved to contacted list
- AND timestamp is updated

#### Scenario: Discard match

- GIVEN a match with status "pending"
- WHEN admin updates status to "discarded"
- THEN the match is hidden from pending view
- AND can be viewed in "all matches" with filter

### Requirement: Bidirectional Matching

The system MUST consider both directions of matching.

#### Scenario: A sells to B matches

- GIVEN Client A is seller, Client B is buyer
- WHEN match is created
- THEN match record has sellerClient=A, buyerClient=B

#### Scenario: Bidirectional detection

- GIVEN Client A wants to sell and Client B wants to buy
- WHEN match is created
- THEN the system does NOT create a reverse match (B→A)
- AND only one match record exists per pair

### Requirement: Inactive Client Handling

The system MUST NOT match inactive clients.

#### Scenario: Inactive seller excluded

- GIVEN Client A is inactive (status: "inactive")
- AND Client B is active and wants to buy
- WHEN matching algorithm runs
- THEN Client A is NOT included in matching
- AND no match is created with Client A

#### Scenario: Existing matches invalidated on deactivate

- GIVEN a match exists between active Client A and Client B
- WHEN Client A is deactivated
- THEN the match becomes invalid
- AND is not shown in active match queries
